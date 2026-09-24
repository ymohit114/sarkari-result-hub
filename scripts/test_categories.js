const cheerio = require('cheerio');

async function testCategories() {
  const categories = [
    { name: 'latest-jobs', urls: ['https://www.sarkariresult.com/latestjob/', 'https://www.sarkariresult.com/latestjob.php'] },
    { name: 'admit-card', urls: ['https://www.sarkariresult.com/admitcard/', 'https://www.sarkariresult.com/admitcard.php'] },
    { name: 'results', urls: ['https://www.sarkariresult.com/result/', 'https://www.sarkariresult.com/result.php'] },
    { name: 'answer-key', urls: ['https://www.sarkariresult.com/answerkey/', 'https://www.sarkariresult.com/answerkey.php'] },
    { name: 'syllabus', urls: ['https://www.sarkariresult.com/syllabus/', 'https://www.sarkariresult.com/syllabus.php'] },
    { name: 'admission', urls: ['https://www.sarkariresult.com/admission/', 'https://www.sarkariresult.com/admission.php'] },
  ];

  for (const cat of categories) {
    let success = false;
    for (const url of cat.urls) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
        });
        if (res.ok) {
          const html = await res.text();
          const $ = cheerio.load(html);
          const links = [];
          $('a').each((_, a) => {
            const h = $(a).attr('href');
            const t = $(a).text().trim();
            if (h && t.length > 12 && !h.endsWith('.com/') && !h.endsWith('.com') && !h.includes('#') && (h.includes('/202') || h.includes('.php') || h.includes('sarkariresult.com/'))) {
              links.push({ title: t, url: h });
            }
          });
          console.log(`[${cat.name}] ${url} -> Found ${links.length} links. Sample:`, links[0]?.title);
          success = true;
          break;
        }
      } catch (e) {
        // try next
      }
    }
  }
}

testCategories().catch(console.error);
