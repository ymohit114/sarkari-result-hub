const cheerio = require('cheerio');

async function testDetail() {
  const url = 'https://www.sarkariresult.com/2026/up-kvm-block-program-manager-sep26/';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('H1:', $('h1').text().trim());
  console.log('Tables count:', $('table').length);
  $('table').each((i, table) => {
    console.log(`\n--- TABLE ${i} ---`);
    console.log($(table).text().replace(/\s+/g, ' ').slice(0, 300));
  });

  // Check links for apply and pdf
  $('a').each((_, a) => {
    const text = $(a).text().trim();
    const href = $(a).attr('href');
    if (text && href && (text.toLowerCase().includes('apply') || text.toLowerCase().includes('notification') || text.toLowerCase().includes('official'))) {
      console.log(`Link: "${text}" => ${href}`);
    }
  });
}

testDetail().catch(console.error);
