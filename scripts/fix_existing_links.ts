import { prisma } from '../lib/prisma';
import * as cheerio from 'cheerio';

async function fixAllLinks() {
  console.log('🔄 Repairing and updating all post links to official registration portals...');
  const posts = await prisma.jobPost.findMany();
  console.log(`Found ${posts.length} posts to inspect.`);

  let updatedCount = 0;

  for (const post of posts) {
    if (!post.sourceUrl || !post.sourceUrl.includes('sarkariresult.com')) {
      continue;
    }

    try {
      const res = await fetch(post.sourceUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

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
            href.includes('sarkariresultportal.com') ||
            href.includes('sarkariresult.tools') ||
            href.includes('whatsapp') ||
            href.includes('t.me') ||
            href.includes('play.google.com') ||
            href.includes('itunes.apple.com') ||
            href.includes('youtube.com') ||
            href.includes('youtu.be')
          ) {
            return;
          }

          // Category-specific direct action link
          if (rowText.includes('apply online') || rowText.includes('registration') || rowText.includes('online form')) {
            if (!applyUrl) applyUrl = href;
          } else if (post.category === 'admit-card' && (rowText.includes('admit card') || rowText.includes('hall ticket') || rowText.includes('call letter'))) {
            if (!applyUrl) applyUrl = href;
          } else if (post.category === 'results' && (rowText.includes('result') || rowText.includes('score card') || rowText.includes('marks'))) {
            if (!applyUrl) applyUrl = href;
          } else if (post.category === 'answer-key' && (rowText.includes('answer key') || rowText.includes('response sheet') || rowText.includes('objection'))) {
            if (!applyUrl) applyUrl = href;
          } else if (post.category === 'syllabus' && (rowText.includes('syllabus') || rowText.includes('exam pattern'))) {
            if (!applyUrl) applyUrl = href;
          } else if (post.category === 'admission' && (rowText.includes('apply') || rowText.includes('registration') || rowText.includes('admission'))) {
            if (!applyUrl) applyUrl = href;
          }

          // Notification PDF
          if ((rowText.includes('notification') || href.endsWith('.pdf')) && !pdfUrl) {
            pdfUrl = href;
          }

          // Official Website
          if (rowText.includes('official website') && !officialUrl) {
            officialUrl = href;
          }
        });
      });

      // Search for government or institutional website domain
      if (!officialUrl) {
        $('a').each((_, a) => {
          const href = $(a).attr('href');
          if (href && href.startsWith('http') && !href.includes('sarkariresult')) {
            if (href.includes('.gov.in') || href.includes('.nic.in') || href.includes('.ac.in') || href.includes('.org.in') || href.includes('.edu')) {
              if (!officialUrl) officialUrl = href;
            }
          }
        });
      }

      if (!applyUrl) applyUrl = officialUrl || 'https://ssc.gov.in';
      if (!pdfUrl) pdfUrl = officialUrl || applyUrl;
      if (!officialUrl) officialUrl = 'https://ssc.gov.in';

      // Update in DB
      await prisma.jobPost.update({
        where: { id: post.id },
        data: {
          applyOnlineUrl: applyUrl,
          notificationPdfUrl: pdfUrl,
          officialWebsiteUrl: officialUrl,
        },
      });

      updatedCount++;
      console.log(`[UPDATED] ${post.title.substring(0, 45)}`);
      console.log(`          Apply URL: ${applyUrl}`);
    } catch (e: any) {
      console.log(`Error updating ${post.title}:`, e.message);
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} posts with real registration portals!`);
}

fixAllLinks()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
