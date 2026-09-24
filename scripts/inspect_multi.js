const cheerio = require('cheerio');

async function inspectCandidateLinks() {
  const sources = [
    { name: 'SarkariResult.com.cm', url: 'https://sarkariresult.com.cm/' },
    { name: 'SarkariResults.org.in', url: 'https://www.sarkariresults.org.in/' },
    { name: 'FreeJobAlert', url: 'https://sarkariresult.freejobalert.com/' },
    { name: 'AffairsCloud', url: 'https://affairscloud.com/jobs/sarkari-results/' }
  ];

  for (const s of sources) {
    try {
      console.log(`\n=== SOURCE: ${s.name} ===`);
      const res = await fetch(s.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
      });
      const html = await res.text();
      const $ = cheerio.load(html);

      const postLinks = [];
      $('a').each((_, a) => {
        const text = $(a).text().trim();
        const href = $(a).attr('href');
        if (
          href &&
          text.length > 15 &&
          !href.includes('privacy') &&
          !href.includes('terms') &&
          !href.includes('contact') &&
          !href.includes('about') &&
          !href.includes('disclaimer') &&
          !href.includes('facebook') &&
          !href.includes('twitter') &&
          !href.includes('play.google')
        ) {
          const lower = text.toLowerCase();
          if (
            lower.includes('form') ||
            lower.includes('recruitment') ||
            lower.includes('post') ||
            lower.includes('apply') ||
            lower.includes('admit card') ||
            lower.includes('result') ||
            lower.includes('syllabus') ||
            lower.includes('answer key') ||
            lower.includes('teacher') ||
            lower.includes('constable') ||
            lower.includes('officer') ||
            lower.includes('ssc') ||
            lower.includes('railway') ||
            lower.includes('upsc') ||
            lower.includes('ibps') ||
            lower.includes('police')
          ) {
            postLinks.push({ text, href });
          }
        }
      });

      console.log(`Total recruitment links identified: ${postLinks.length}`);
      console.log('Sample links (first 5):', JSON.stringify(postLinks.slice(0, 5), null, 2));
    } catch (e) {
      console.log(`Error in ${s.name}:`, e.message);
    }
  }
}

inspectCandidateLinks().catch(console.error);
