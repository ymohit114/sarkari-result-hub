import cron, { ScheduledTask } from 'node-cron';
import { runScraper } from './scraper';

interface SchedulerState {
  isInitialized: boolean;
  isRunning: boolean;
  schedule: string;
  intervalHours: number;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
  cronTask: ScheduledTask | null;
}

const globalForScheduler = globalThis as unknown as {
  schedulerState: SchedulerState | undefined;
};

export const schedulerState: SchedulerState =
  globalForScheduler.schedulerState ?? {
    isInitialized: false,
    isRunning: false,
    schedule: '0 */4 * * *', // Every 4 hours: at minute 0 past every 4th hour
    intervalHours: 4,
    lastRunAt: null,
    nextRunAt: null,
    cronTask: null,
  };

if (process.env.NODE_ENV !== 'production') {
  globalForScheduler.schedulerState = schedulerState;
}

function calculateNextRun(hours: number): Date {
  const next = new Date();
  const currentHour = next.getHours();
  const remainder = currentHour % hours;
  const hoursToAdd = hours - remainder;
  next.setHours(currentHour + hoursToAdd, 0, 0, 0);
  return next;
}

export function startScheduler() {
  if (schedulerState.isInitialized && schedulerState.cronTask) {
    return;
  }

  schedulerState.schedule = '0 */4 * * *';
  schedulerState.intervalHours = 4;
  schedulerState.nextRunAt = calculateNextRun(4);

  console.log(`[Scheduler] Initializing 4-hour automatic sync worker (${schedulerState.schedule})...`);
  console.log(`[Scheduler] Next run estimated at: ${schedulerState.nextRunAt.toLocaleString('en-IN')}`);

  // Schedule task every 4 hours: "0 */4 * * *"
  schedulerState.cronTask = cron.schedule(schedulerState.schedule, async () => {
    if (schedulerState.isRunning) {
      console.log('[Scheduler] Scrape already in progress, skipping scheduled cycle.');
      return;
    }

    console.log(`[Scheduler] 4-Hour interval reached (${new Date().toLocaleTimeString('en-IN')}). Triggering auto-sync...`);
    schedulerState.isRunning = true;
    schedulerState.lastRunAt = new Date();
    schedulerState.nextRunAt = calculateNextRun(4);

    try {
      const res = await runScraper({
        forceMock: false,
        limitPerCategory: 8,
      });
      console.log(`[Scheduler] Auto-sync finished successfully: ${res.message}`);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('[Scheduler] Error during scheduled sync:', error.message);
    } finally {
      schedulerState.isRunning = false;
    }
  });

  schedulerState.isInitialized = true;
}

export function getSchedulerInfo() {
  return {
    isInitialized: schedulerState.isInitialized,
    isRunning: schedulerState.isRunning,
    intervalHours: schedulerState.intervalHours,
    schedule: schedulerState.schedule,
    lastRunAt: schedulerState.lastRunAt,
    nextRunAt: schedulerState.nextRunAt || calculateNextRun(4),
  };
}
