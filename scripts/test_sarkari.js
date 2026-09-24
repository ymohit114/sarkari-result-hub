const cheerio = require('cheerio');

async function testFetch() {
  try {
    const res = await fetch('https://www.sarkariresult.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    console.log('Homepage status code:', res.status);
    const html = await res.text();
    console.log('Homepage HTML size:', html.length);
    const $ = cheerio.load(html);
    console.log('Title:', $('title').text());

    // Check links on homepage
    const links = [];
    $('a').each((_, a) => {
      const href = $(a).attr('href');
      const text = $(a).text().trim();
      if (href && (href.includes('.php') || href.includes('/202') || href.startsWith('http')) && text.length > 5) {
        links.push({ text, href });
      }
    });

    console.log('Total relevant links on homepage:', links.length);
    console.log('Sample links (first 5):', JSON.stringify(links.slice(0, 5), null, 2));

    // Test a category page
    const catRes = await fetch('https://www.sarkariresult.com/latestjob.php', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0 Safari/537.36' }
    });
    console.log('latestjob.php status:', catRes.status);
    if (catRes.ok) {
      const catHtml = await catRes.text();
      const cat$ = cheerio.load(catHtml);
      const jobLinks = [];
      cat$('#post ul li a, #post a, div a').each((_, a) => {
        const h = cat$(a).attr('href');
        const t = cat$(a).text().trim();
        if (h && t.length > 10 && !['home', 'contact us', 'privacy policy'].includes(t.toLowerCase())) {
          jobLinks.push({ t, h });
        }
      });
      console.log('Jobs extracted from latestjob.php:', jobLinks.length);
      console.log('Top 3 jobs:', JSON.stringify(jobLinks.slice(0, 3), null, 2));

      // Test fetching 1 detail page
      if (jobLinks.length > 0) {
        const sampleUrl = jobLinks[0].h.startsWith('http') ? jobLinks[0].h : `https://www.sarkariresult.com/${jobLinks[0].h.replace(/^\//, '')}`;
        console.log('Testing detail page fetch:', sampleUrl);
        const detailRes = await fetch(sampleUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
        });
        console.log('Detail page status:', detailRes.status);
        if (detailRes.ok) {
          const detailHtml = await detailRes.text();
          const detail$ = cheerio.load(detailHtml);
          console.log('Detail Title:', detail$('h1').text().trim() || detail$('title').text().trim());
          console.log('Tables found:', detail$('table').length);
        }
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testFetch();
