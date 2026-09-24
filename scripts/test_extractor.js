const cheerio = require('cheerio');

async function testParsePost() {
  const url = 'https://www.sarkariresult.com/2026/mpesb-mp-police-constable-gd-sep26/';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0.0.0' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('h1').first().text().trim() || $('title').text().trim();
  const bodyText = $('body').text();

  // Extract dates
  const appBeginMatch = bodyText.match(/Application Begin\s*:\s*([^\n\r<]+)/i);
  const lastDateMatch = bodyText.match(/Last Date for Apply\s*(?:Online)?\s*:\s*([^\n\r<]+)/i);
  const examDateMatch = bodyText.match(/Exam Date\s*:\s*([^\n\r<]+)/i);
  const admitCardMatch = bodyText.match(/Admit Card Available\s*:\s*([^\n\r<]+)/i);

  // Extract fees
  const genFeeMatch = bodyText.match(/General\s*\/\s*(?:Other State|OBC)\s*:\s*([^\n\r<]+)/i);
  const scFeeMatch = bodyText.match(/SC\s*\/\s*ST\s*:\s*([^\n\r<]+)/i);

  // Extract Age
  const minAgeMatch = bodyText.match(/Minimum Age\s*:\s*([^\n\r<]+)/i);
  const maxAgeMatch = bodyText.match(/Maximum Age\s*:\s*([^\n\r<]+)/i);

  // Extract Vacancy
  const vacancyMatch = bodyText.match(/Total\s*(?:Post|Vacancy)\s*:\s*([^\n\r<]+)/i) || bodyText.match(/(\d+[\d,]*)\s*Post/i);

  // Extract Short Info
  let shortInfo = '';
  $('p, td, div').each((_, el) => {
    const t = $(el).text().trim();
    if (t.toLowerCase().startsWith('short information') && t.length > 30) {
      shortInfo = t.replace(/^short information\s*[:\s]*/i, '').trim();
    }
  });

  // Extract Links
  const links = {};
  $('table a, a').each((_, a) => {
    const text = $(a).text().trim().toLowerCase();
    const href = $(a).attr('href');
    if (href && href.startsWith('http') && !href.includes('sarkariresult.com') && !href.includes('whatsapp') && !href.includes('telegram')) {
      if (text.includes('apply online') || text.includes('registration') || text.includes('login')) {
        links.apply = href;
      } else if (text.includes('notification') || href.endsWith('.pdf')) {
        links.pdf = href;
      } else if (text.includes('official website')) {
        links.official = href;
      }
    }
  });

  console.log({
    title,
    appBegin: appBeginMatch ? appBeginMatch[1].trim() : null,
    lastDate: lastDateMatch ? lastDateMatch[1].trim() : null,
    examDate: examDateMatch ? examDateMatch[1].trim() : null,
    admitCard: admitCardMatch ? admitCardMatch[1].trim() : null,
    feeGen: genFeeMatch ? genFeeMatch[1].trim() : null,
    feeSC: scFeeMatch ? scFeeMatch[1].trim() : null,
    ageMin: minAgeMatch ? minAgeMatch[1].trim() : null,
    ageMax: maxAgeMatch ? maxAgeMatch[1].trim() : null,
    vacancies: vacancyMatch ? vacancyMatch[0].trim() : null,
    shortInfo: shortInfo.slice(0, 150),
    links
  });
}

testParsePost().catch(console.error);
