import { seedSampleJobs } from '../lib/scraper';

async function main() {
  console.log('Seeding initial data...');
  const res = await seedSampleJobs(true, false);
  console.log(res.message);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
