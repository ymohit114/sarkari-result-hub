const cheerio = require('cheerio');

async function testDetailPages() {
  const urls = [
    'https://sarkariresult.com.cm/upessc-prt-assistant-teacher-2026/',
    'https://www.freejobalert.com/articles/ibps-rrb-crp-xv-recruitment-2026-apply-online-for-officer-office-assistant-posts-3065386'
  ];

  for (const url of urls) {
    console.log('\n--- Inspecting Detail Page:', url);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    const $ = cheerio.load(html);

    console.log('Title:', $('h1').first().text().trim() || $('title').text().trim());

    // Check tables and direct external links
    $('table tr').each((_, tr) => {
      const text = $(tr).text().toLowerCase().replace(/\s+/g, ' ');
      $(tr).find('a').each((_, a) => {
        const h = $(a).attr('href');
        const t = $(a).text().trim();
        if (h && h.startsWith('http') && !h.includes('sarkariresult') && !h.includes('freejobalert') && !h.includes('facebook') && !h.includes('whatsapp') && !h.includes('t.me')) {
          console.log(`Row: "${text.slice(0, 30)}" | Link: "${t}" => ${h}`);
        }
      });
    });
  }
}

testDetailPages().catch(console.error);
