const cheerio = require('cheerio');

async function inspectBottomLinks() {
  const urls = [
    'https://www.sarkariresult.com/2026/mpesb-mp-police-constable-gd-sep26/',
    'https://www.sarkariresult.com/2026/ibps-hindi-officer-ho-sep26/',
    'https://www.sarkariresult.com/ssc/ssc-stenographer-2026/'
  ];

  for (const url of urls) {
    console.log('\n=============================================');
    console.log('Inspecting:', url);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    $('table tr').each((_, tr) => {
      const rowText = $(tr).text().replace(/\s+/g, ' ').trim();
      const a = $(tr).find('a');
      if (a.length > 0) {
        a.each((_, linkEl) => {
          const text = $(linkEl).text().trim();
          const href = $(linkEl).attr('href');
          console.log(`Row: "${rowText.slice(0, 40)}" | Link text: "${text}" => href: "${href}"`);
        });
      }
    });
  }
}

inspectBottomLinks().catch(console.error);
