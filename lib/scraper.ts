import * as cheerio from 'cheerio';
import { prisma } from './prisma';
import { broadcastJobToTelegram } from './telegram';

export interface ScrapeResult {
  success: boolean;
  totalFound: number;
  totalCreated: number;
  message: string;
  logs: string[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Multi-Source Registry configured as requested
export const DEFAULT_JOB_SOURCES = [
  'https://www.sarkariresult.com/latestjob/',
  'https://www.sarkariresult.com/admitcard/',
  'https://www.sarkariresult.com/result/',
  'https://www.sarkariresult.com/answerkey/',
  'https://www.sarkariresult.com/syllabus/',
  'https://www.sarkariresult.com/admission/',
  'https://sarkariresult.com.cm/',
  'https://www.sarkariresults.org.in/',
  'https://sarkariresult.freejobalert.com/',
  'https://affairscloud.com/jobs/sarkari-results/',
];

export interface ScrapeOptions {
  forceMock?: boolean;
  sources?: string[];
  maxTotalItems?: number;
  limitPerCategory?: number;
}

export async function runScraper(options: ScrapeOptions = {}): Promise<ScrapeResult> {
  const logs: string[] = [];
  let totalFound = 0;
  let totalCreated = 0;

  logs.push(`[${new Date().toLocaleTimeString('en-IN')}] Initiating Multi-Source Government Job Sync...`);

  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
    const autoPublish = settings?.scraperAutoPublish ?? true;
    const telegramAuto = settings?.telegramAutoPublish ?? true;

    if (options.forceMock) {
      logs.push('Force mock enabled.');
      return { success: true, totalFound: 0, totalCreated: 0, message: 'Done', logs };
    }

    const sources = options.sources || DEFAULT_JOB_SOURCES;
    logs.push(`Configured ${sources.length} active government job sources for full extraction.`);

    // Candidate links collected across all sources
    const candidateLinks: Array<{ title: string; url: string; category: string; source: string }> = [];

    // Step 1: Scan all sources
    for (const sourceUrl of sources) {
      logs.push(`Scanning source: ${sourceUrl}...`);
      try {
        const res = await fetch(sourceUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          logs.push(`Source ${sourceUrl} returned HTTP ${res.status}. Skipping.`);
          continue;
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        let sourceCount = 0;
        $('a').each((_, a) => {
          const href = $(a).attr('href');
          const text = $(a).text().trim();
          const lower = text.toLowerCase();

          const isMenu = [
            'home', 'about', 'contact', 'privacy', 'terms', 'disclaimer', 'sarkari result',
            'sarkari result®', 'sarkari result™', 'download mobile app', 'sarkari tools',
            'join telegram', 'join whatsapp', 'view more', 'click here', 'scholarship', 'terms and conditions'
          ].some(m => lower === m || lower.startsWith(m) || lower.includes('scholarship') || lower.includes('terms and conditions') || lower.includes('privacy policy'));

          if (
            href &&
            text.length > 10 &&
            !isMenu &&
            !href.includes('facebook') &&
            !href.includes('twitter') &&
            !href.includes('play.google') &&
            !href.includes('whatsapp') &&
            !href.includes('t.me') &&
            !href.includes('#')
          ) {
            let fullUrl = href;
            if (!href.startsWith('http')) {
              try {
                const u = new URL(href, sourceUrl);
                fullUrl = u.toString();
              } catch {
                return;
              }
            }

            // Determine Category based on keywords first (avoiding domain name matches)
            let category = 'latest-jobs';
            const urlPath = new URL(fullUrl).pathname.toLowerCase();

            if (lower.includes('admit card') || lower.includes('hall ticket') || lower.includes('call letter') || urlPath.includes('admitcard')) {
              category = 'admit-card';
            } else if (lower.includes('answer key') || lower.includes('response sheet') || lower.includes('objection') || urlPath.includes('answerkey')) {
              category = 'answer-key';
            } else if (lower.includes('syllabus') || lower.includes('exam pattern') || urlPath.includes('syllabus')) {
              category = 'syllabus';
            } else if (lower.includes('admission') || lower.includes('entrance') || lower.includes('ph.d') || urlPath.includes('admission')) {
              category = 'admission';
            } else if (lower.includes('result') || lower.includes('score card') || lower.includes('merit list') || lower.includes('cutoff') || urlPath.includes('/result/')) {
              category = 'results';
            } else if (lower.includes('recruitment') || lower.includes('online form') || lower.includes('apply online') || lower.includes('vacancy') || lower.includes('post')) {
              category = 'latest-jobs';
            }

            // Deduplicate within current batch
            if (!candidateLinks.some(c => c.url === fullUrl || c.title.toLowerCase() === text.toLowerCase())) {
              candidateLinks.push({ title: text, url: fullUrl, category, source: sourceUrl });
              sourceCount++;
            }
          }
        });

        logs.push(`Found ${sourceCount} recruitment notices from ${new URL(sourceUrl).hostname}`);
      } catch (err: unknown) {
        const error = err as Error;
        logs.push(`Error scanning ${sourceUrl}: ${error.message}`);
      }
    }

    totalFound = candidateLinks.length;
    logs.push(`Total unique posts discovered across all sources: ${totalFound}. Processing and extracting direct links...`);

    // Remove the 8-post limit! Process up to maxTotalItems (default 60 per sync cycle to ensure super fast response)
    const maxItems = options.maxTotalItems || 60;
    const toProcess = candidateLinks.slice(0, maxItems);

    for (const item of toProcess) {
      // Check existing in DB
      const existing = await prisma.jobPost.findFirst({
        where: {
          OR: [
            { sourceUrl: item.url },
            { title: item.title },
          ],
        },
      });

      if (existing) {
        continue;
      }

      // Fetch and extract direct official portal links
      const detail = await fetchAndParseDetailPage(item.url, item.title, item.category);

      let baseSlug = slugify(detail.title || item.title);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await prisma.jobPost.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const createdPost = await prisma.jobPost.create({
        data: {
          title: detail.title,
          slug: uniqueSlug,
          category: detail.category,
          organization: detail.organization || 'Government Recruitment Board',
          shortDescription:
            detail.shortDescription ||
            `Official notification published for ${detail.title}. Read full details for eligibility criteria, important dates, and selection process.`,
          totalVacancies: detail.totalVacancies || 'Various Posts',
          qualification: detail.qualification || 'Check Official Notification PDF for Qualifications',
          applicationBegin: detail.applicationBegin || 'Started',
          lastDateApply: detail.lastDateApply || 'Check Official Notification',
          lastDateFee: detail.lastDateFee || detail.lastDateApply || 'Check Official Notification',
          examDate: detail.examDate || 'Notify Soon',
          admitCardDate: detail.admitCardDate || 'Before Exam',
          feeGeneral: detail.feeGeneral || '₹ 100/-',
          feeScStPh: detail.feeScStPh || '₹ 0/- (Nil)',
          feeFemale: detail.feeFemale || '₹ 0/- (Exempted)',
          feePaymentMode: detail.feePaymentMode || 'Online via Debit/Credit Card or Net Banking',
          ageMin: detail.ageMin || '18 Years',
          ageMax: detail.ageMax || '30-33 Years',
          ageDetails: detail.ageDetails || 'Age Relaxation Extra as per Official Rules',
          applyOnlineUrl: detail.applyOnlineUrl,
          notificationPdfUrl: detail.notificationPdfUrl,
          officialWebsiteUrl: detail.officialWebsiteUrl,
          sourceUrl: item.url,
          status: autoPublish ? 'PUBLISHED' : 'DRAFT',
          isTelegramSent: false,
        },
      });

      totalCreated++;
      logs.push(`[ADDED] ${createdPost.title.substring(0, 48)} (Category: ${createdPost.category})`);

      // Trigger Telegram broadcast if enabled
      if (telegramAuto && autoPublish) {
        const broadcastRes = await broadcastJobToTelegram(createdPost);
        if (broadcastRes.success) {
          logs.push(`--> Broadcasted to Telegram: ${broadcastRes.messageId}`);
        }
      }
    }

    const message = `Multi-source sync completed. Analyzed ${totalFound} items from all portals, added ${totalCreated} new recruitment posts directly to your portal.`;
    logs.push(`[FINISHED] ${message}`);

    await prisma.scraperLog.create({
      data: {
        source: 'Multi-Source (10 portals)',
        itemsFound: totalFound,
        itemsCreated: totalCreated,
        status: 'SUCCESS',
        logMessage: logs.join('\n'),
      },
    });

    return {
      success: true,
      totalFound,
      totalCreated,
      message,
      logs,
    };
  } catch (err: unknown) {
    const error = err as Error;
    logs.push(`[FATAL ERROR] ${error.message}`);
    return {
      success: false,
      totalFound,
      totalCreated,
      message: error.message,
      logs,
    };
  }
}

async function fetchAndParseDetailPage(url: string, defaultTitle: string, category: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return createFallbackData(defaultTitle, category, url);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('h1').first().text().trim() || $('title').text().trim() || defaultTitle;
    const bodyText = $('body').text();

    // Regex matchers for Dates
    const appBeginMatch = bodyText.match(/Application Begin\s*:\s*([^\n\r<]+)/i);
    const lastDateMatch = bodyText.match(/Last Date for Apply\s*(?:Online)?\s*:\s*([^\n\r<]+)/i);
    const examDateMatch = bodyText.match(/Exam Date\s*:\s*([^\n\r<]+)/i);
    const admitCardMatch = bodyText.match(/Admit Card Available\s*:\s*([^\n\r<]+)/i);

    // Regex matchers for Fees
    const genFeeMatch = bodyText.match(/General\s*\/\s*(?:Other State|OBC|EWS)\s*:\s*([^\n\r<]+)/i);
    const scFeeMatch = bodyText.match(/SC\s*\/\s*ST\s*:\s*([^\n\r<]+)/i);
    const femaleFeeMatch = bodyText.match(/Female\s*:\s*([^\n\r<]+)/i);

    // Regex matchers for Age
    const minAgeMatch = bodyText.match(/Minimum Age\s*:\s*([^\n\r<]+)/i);
    const maxAgeMatch = bodyText.match(/Maximum Age\s*:\s*([^\n\r<]+)/i);

    // Regex matchers for Vacancy
    const vacancyMatch =
      bodyText.match(/Total\s*(?:Post|Vacancy)\s*:\s*([^\n\r<]+)/i) ||
      bodyText.match(/(\d+[\d,]*)\s*(?:Post|Vacancy|Vacancies)/i);

    // Short info
    let shortInfo = '';
    $('td, p, div').each((_, el) => {
      const t = $(el).text().trim();
      if (t.toLowerCase().startsWith('short information') && t.length > 25 && !shortInfo) {
        shortInfo = t.replace(/^short information\s*[:\s]*/i, '').trim();
      }
    });

    // Row-based exact official link extractor
    let applyUrl = '';
    let pdfUrl = '';
    let officialUrl = '';

    $('table tr').each((_, tr) => {
      const rowText = $(tr).text().toLowerCase().replace(/\s+/g, ' ');
      $(tr).find('a').each((_, a) => {
        const href = $(a).attr('href');
        if (!href || !href.startsWith('http')) return;
        if (
          href.includes('sarkariresult.com') ||
          href.includes('sarkariresult.com.cm') ||
          href.includes('sarkariresults.org.in') ||
          href.includes('sarkariresultportal.com') ||
          href.includes('sarkariresult.tools') ||
          href.includes('freejobalert.com') ||
          href.includes('affairscloud.com') ||
          href.includes('whatsapp') ||
          href.includes('t.me') ||
          href.includes('play.google.com') ||
          href.includes('itunes.apple.com') ||
          href.includes('youtube.com') ||
          href.includes('youtu.be')
        ) {
          return;
        }

        // 1. Direct Registration / Primary action link
        if (rowText.includes('apply online') || rowText.includes('registration') || rowText.includes('online form')) {
          if (!applyUrl) applyUrl = href;
        } else if (category === 'admit-card' && (rowText.includes('admit card') || rowText.includes('hall ticket') || rowText.includes('call letter'))) {
          if (!applyUrl) applyUrl = href;
        } else if (category === 'results' && (rowText.includes('result') || rowText.includes('score card') || rowText.includes('marks'))) {
          if (!applyUrl) applyUrl = href;
        } else if (category === 'answer-key' && (rowText.includes('answer key') || rowText.includes('response sheet') || rowText.includes('objection'))) {
          if (!applyUrl) applyUrl = href;
        } else if (category === 'syllabus' && (rowText.includes('syllabus') || rowText.includes('exam pattern'))) {
          if (!applyUrl) applyUrl = href;
        } else if (category === 'admission' && (rowText.includes('apply') || rowText.includes('registration') || rowText.includes('admission'))) {
          if (!applyUrl) applyUrl = href;
        }

        // 2. Direct Notification PDF
        if ((rowText.includes('notification') || href.endsWith('.pdf')) && !pdfUrl) {
          pdfUrl = href;
        }

        // 3. Direct Official Website
        if (rowText.includes('official website') && !officialUrl) {
          officialUrl = href;
        }
      });
    });

    // Extract official website from government domains
    if (!officialUrl) {
      $('a').each((_, a) => {
        const href = $(a).attr('href');
        if (href && href.startsWith('http')) {
          if (
            (href.includes('.gov.in') || href.includes('.nic.in') || href.includes('.ac.in') || href.includes('.org.in') || href.includes('.edu')) &&
            !href.includes('sarkariresult') &&
            !href.includes('freejobalert')
          ) {
            if (!officialUrl) officialUrl = href;
          }
        }
      });
    }

    if (!applyUrl) applyUrl = officialUrl || 'https://ssc.gov.in';
    if (!pdfUrl) pdfUrl = officialUrl || applyUrl;
    if (!officialUrl) officialUrl = 'https://ssc.gov.in';

    // Organization detection
    let organization = 'Central / State Government Board';
    if (title.includes('SSC')) organization = 'Staff Selection Commission (SSC)';
    else if (title.includes('UPSC')) organization = 'Union Public Service Commission (UPSC)';
    else if (title.includes('Railway') || title.includes('RRB')) organization = 'Railway Recruitment Boards (RRB)';
    else if (title.includes('UP Police') || title.includes('UPPRPB')) organization = 'Uttar Pradesh Police (UPPRPB)';
    else if (title.includes('MP Police') || title.includes('MPESB')) organization = 'Madhya Pradesh Employees Selection Board (MPESB)';
    else if (title.includes('IBPS')) organization = 'Institute of Banking Personnel Selection (IBPS)';
    else if (title.includes('NTA') || title.includes('NEET') || title.includes('JEE')) organization = 'National Testing Agency (NTA)';
    else if (title.includes('UPSSSC')) organization = 'UP Subordinate Services (UPSSSC)';
    else if (title.includes('BPSC') || title.includes('Bihar')) organization = 'Bihar Public Service Commission (BPSC)';
    else if (title.includes('UPESSC')) organization = 'UP Education Services (UPESSC)';

    return {
      title,
      category,
      organization,
      shortDescription:
        shortInfo ||
        `Recruitment notification released for ${title}. Candidates can check eligibility criteria, age limits, pay scale, and application procedure.`,
      totalVacancies: vacancyMatch ? vacancyMatch[0].trim() : 'Various Posts',
      qualification: 'Check Official Notification PDF for Eligibility & Qualifications',
      applicationBegin: appBeginMatch ? appBeginMatch[1].trim() : 'Started',
      lastDateApply: lastDateMatch ? lastDateMatch[1].trim() : 'Check Notification',
      lastDateFee: lastDateMatch ? lastDateMatch[1].trim() : 'Check Notification',
      examDate: examDateMatch ? examDateMatch[1].trim() : 'Notify Soon',
      admitCardDate: admitCardMatch ? admitCardMatch[1].trim() : 'Before Exam',
      feeGeneral: genFeeMatch ? `₹ ${genFeeMatch[1].trim().replace(/^₹\s*/, '')}` : '₹ 100/-',
      feeScStPh: scFeeMatch ? `₹ ${scFeeMatch[1].trim().replace(/^₹\s*/, '')}` : '₹ 0/-',
      feeFemale: femaleFeeMatch ? `₹ ${femaleFeeMatch[1].trim().replace(/^₹\s*/, '')}` : '₹ 0/- (Exempted)',
      feePaymentMode: 'Pay the Examination Fee Through Debit Card, Credit Card, Net Banking, UPI',
      ageMin: minAgeMatch ? minAgeMatch[1].trim() : '18 Years',
      ageMax: maxAgeMatch ? maxAgeMatch[1].trim() : '30-33 Years',
      ageDetails: 'Age Relaxation Extra as per Official Recruitment Rules',
      applyOnlineUrl: applyUrl,
      notificationPdfUrl: pdfUrl,
      officialWebsiteUrl: officialUrl,
    };
  } catch {
    return createFallbackData(defaultTitle, category, url);
  }
}

function createFallbackData(title: string, category: string, url: string) {
  return {
    title,
    category,
    organization: 'Government Recruitment Board',
    shortDescription: `Official alert released for ${title}. Complete details regarding eligibility, qualification, and important dates are updated.`,
    totalVacancies: 'Various Posts',
    qualification: 'Bachelor Degree / 12th / 10th in relevant discipline',
    applicationBegin: 'Started',
    lastDateApply: 'Check Notification',
    lastDateFee: 'Check Notification',
    examDate: 'To be announced',
    admitCardDate: 'Available soon',
    feeGeneral: '₹ 100/-',
    feeScStPh: '₹ 0/-',
    feeFemale: '₹ 0/-',
    feePaymentMode: 'Online Mode',
    ageMin: '18 Years',
    ageMax: '30 Years',
    ageDetails: 'Age Relaxation as per rules',
    applyOnlineUrl: 'https://ssc.gov.in',
    notificationPdfUrl: 'https://ssc.gov.in',
    officialWebsiteUrl: 'https://ssc.gov.in',
  };
}

export async function seedSampleJobs(
  autoPublish = true,
  telegramAuto = false,
  logs: string[] = []
): Promise<ScrapeResult> {
  return runScraper({ forceMock: false });
}
