const cheerio = require('cheerio');

async function testRowExtractor() {
  const testCases = [
    { url: 'https://www.sarkariresult.com/2026/mpesb-mp-police-constable-gd-sep26/', cat: 'latest-jobs' },
    { url: 'https://www.sarkariresult.com/2026/ibps-hindi-officer-ho-sep26/', cat: 'latest-jobs' },
    { url: 'https://www.sarkariresult.com/ssc/ssc-stenographer-2026/', cat: 'answer-key' },
    { url: 'https://www.sarkariresult.com/2026/upessc-up-primary-teacher-05-2026/', cat: 'syllabus' }
  ];

  for (const { url, cat } of testCases) {
    console.log('\nTesting:', url, `[${cat}]`);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
    });
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
        ) return;

        // Apply Online or Primary Action based on category
        if (rowText.includes('apply online') || rowText.includes('registration') || rowText.includes('online form')) {
          if (!applyUrl) applyUrl = href;
        } else if (cat === 'admit-card' && (rowText.includes('admit card') || rowText.includes('hall ticket') || rowText.includes('call letter'))) {
          if (!applyUrl) applyUrl = href;
        } else if (cat === 'results' && (rowText.includes('result') || rowText.includes('marks') || rowText.includes('score card'))) {
          if (!applyUrl) applyUrl = href;
        } else if (cat === 'answer-key' && (rowText.includes('answer key') || rowText.includes('response sheet') || rowText.includes('objection'))) {
          if (!applyUrl) applyUrl = href;
        } else if (cat === 'syllabus' && (rowText.includes('syllabus') || rowText.includes('exam pattern'))) {
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

    console.log('  -> Apply/Action Link:', applyUrl);
    console.log('  -> Notification PDF:', pdfUrl);
    console.log('  -> Official Website:', officialUrl);
  }
}

testRowExtractor().catch(console.error);
