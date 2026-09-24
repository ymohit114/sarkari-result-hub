const cheerio = require('cheerio');

async function inspectPostLinks() {
  const res = await fetch('https://www.sarkariresult.com/latestjob/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  // Check main content selectors
  const selectors = ['#post ul li a', '.entry-content ul li a', 'div#post a', 'article a', 'div.entry-content a'];
  for (const sel of selectors) {
    const items = [];
    $(sel).each((_, a) => {
      const href = $(a).attr('href');
      const text = $(a).text().trim();
      if (href && text.length > 10) {
        items.push({ text, href });
      }
    });
    console.log(`Selector "${sel}": ${items.length} links. First 3:`, items.slice(0, 3));
  }
}

inspectPostLinks().catch(console.error);
