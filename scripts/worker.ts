import { startScheduler, getSchedulerInfo } from '../lib/scheduler';
import { runScraper } from '../lib/scraper';

async function main() {
  console.log('=====================================================');
  console.log('⏰ SARKARI RESULT AUTO-SYNC WORKER STARTED');
  console.log('Interval: Every 4 Hours (Cron: 0 */4 * * *)');
  console.log('=====================================================');

  // Perform initial immediate sync on startup
  console.log('Running initial immediate sync...');
  try {
    const initialRes = await runScraper({
      forceMock: false,
      limitPerCategory: 6,
    });
    console.log(`Initial sync completed: ${initialRes.message}`);
  } catch (err: any) {
    console.error('Initial sync error:', err.message);
  }

  // Start the 4-hour cron scheduler
  startScheduler();
  const info = getSchedulerInfo();
  console.log(`Next automatic sync scheduled at: ${info.nextRunAt?.toLocaleString('en-IN')}`);
  console.log('Worker is running in background. Press Ctrl+C to stop.');
}

main().catch((err) => {
  console.error('Fatal worker error:', err);
  process.exit(1);
});
