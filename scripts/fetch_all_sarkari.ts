import { runScraper } from '../lib/scraper';

async function main() {
  console.log('🚀 Starting full live fetch directly from Sarkari Result...');
  const result = await runScraper({
    forceMock: false,
    limitPerCategory: 8, // Fetch top 8 newest live items from each category
  });

  console.log('\n--- EXECUTION LOGS ---');
  result.logs.forEach((log) => console.log(log));
  console.log('\n✅ Summary:', result.message);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Fatal scrape error:', e);
    process.exit(1);
  });
