const cheerio = require('cheerio');

const sources = [
  'https://www.sarkariresult.com/',
  'https://sarkariresult.com.cm/',
  'https://www.sarkariresults.org.in/',
  'https://sarkariresult.freejobalert.com/',
  'https://affairscloud.com/jobs/sarkari-results/'
];

async function testSources() {
  for (const url of sources) {
    try {
      console.log(`\nTesting source: ${url}`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: AbortSignal.timeout(10000)
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);
        console.log(`Title: ${$('title').text().trim().slice(0, 70)}`);
        
        // Find links
        const links = [];
        $('a').each((_, a) => {
          const href = $(a).attr('href');
          const text = $(a).text().trim();
          if (href && text.length > 12 && !href.includes('#') && !href.includes('whatsapp') && !href.includes('t.me')) {
            links.push({ text: text.slice(0, 50), href });
          }
        });
        console.log(`Candidate links: ${links.length}`);
        if (links.length > 0) {
          console.log(`Sample link 1:`, links[0]);
          console.log(`Sample link 2:`, links[1]);
        }
      }
    } catch (e) {
      console.log(`Error testing ${url}:`, e.message);
    }
  }
}

testSources().catch(console.error);
