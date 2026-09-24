const cheerio = require('cheerio');
const fs = require('fs');

async function inspectSections() {
  const res = await fetch('https://www.sarkariresult.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0 Safari/537.36' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  // Sarkari Result has divs with headings or tables for Result, Admit Card, Latest Jobs
  // Let's find headings: h2, h3, or elements with text "Result", "Admit Card", "Latest Jobs"
  const sections = {};
  
  $('div').each((_, div) => {
    const text = $(div).clone().children().remove().end().text().trim();
    const id = $(div).attr('id') || '';
    const cls = $(div).attr('class') || '';

    // Check if this div has child links
    const links = [];
    $(div).find('> ul > li > a, > a').each((_, a) => {
      const href = $(a).attr('href');
      const title = $(a).text().trim();
      if (href && title) {
        links.push({ title, href });
      }
    });

    if (links.length >= 3) {
      // Find heading or nearby text
      const heading = $(div).prev().text().trim() || $(div).find('h2, h3, h4, b').first().text().trim() || id || cls;
      if (heading) {
        sections[heading] = links.slice(0, 5);
      }
    }
  });

  console.log('Sections discovered:', Object.keys(sections));
  for (const [k, v] of Object.entries(sections)) {
    console.log(`\n=== Section: ${k} (${v.length} sample links) ===`);
    console.log(v);
  }
}

inspectSections().catch(console.error);
