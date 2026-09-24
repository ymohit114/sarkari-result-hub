const cheerio = require('cheerio');

async function testFreeJobAlert() {
  const url = 'https://www.freejobalert.com/articles/ibps-rrb-crp-xv-recruitment-2026-apply-online-for-officer-office-assistant-posts-3065386';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  $('tr').each((_, tr) => {
    const row = $(tr).text().toLowerCase().replace(/\s+/g, ' ');
    $(tr).find('a').each((_, a) => {
      const h = $(a).attr('href');
      const t = $(a).text().trim();
      if (h && h.startsWith('http') && !h.includes('freejobalert')) {
        console.log(`FJA Row: "${row.slice(0, 30)}" | "${t}" => ${h}`);
      }
    });
  });
}

testFreeJobAlert().catch(console.error);
