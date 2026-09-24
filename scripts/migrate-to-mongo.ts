import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function importToMongo() {
  const filePath = path.join(process.cwd(), 'prisma', 'seed-data.json');
  if (!fs.existsSync(filePath)) {
    console.error('Seed file prisma/seed-data.json not found! Run scripts/export-data.ts first.');
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  console.log(`Starting migration to database with ${data.jobs?.length || 0} jobs...`);

  // Migrate Site Settings
  if (data.settings && data.settings.length > 0) {
    const s = data.settings[0];
    const existing = await prisma.siteSetting.findFirst();
    if (!existing) {
      await prisma.siteSetting.create({
        data: {
          siteName: s.siteName,
          siteDescription: s.siteDescription,
          siteUrl: s.siteUrl,
          telegramBotToken: s.telegramBotToken,
          telegramChannelId: s.telegramChannelId,
          telegramAutoPublish: s.telegramAutoPublish,
          scraperAutoPublish: s.scraperAutoPublish,
          adminPassword: s.adminPassword,
        },
      });
      console.log('Site settings initialized.');
    }
  }

  // Migrate Job Posts
  let importedCount = 0;
  for (const job of data.jobs) {
    try {
      const existing = await prisma.jobPost.findUnique({
        where: { slug: job.slug },
      });

      if (!existing) {
        // Strip previous id to let MongoDB generate its native ObjectId
        const { id, ...jobData } = job;
        if (jobData.postDate) jobData.postDate = new Date(jobData.postDate);
        if (jobData.createdAt) jobData.createdAt = new Date(jobData.createdAt);
        if (jobData.updatedAt) jobData.updatedAt = new Date(jobData.updatedAt);

        await prisma.jobPost.create({
          data: jobData,
        });
        importedCount++;
      }
    } catch (err) {
      console.warn(`Could not import job ${job.slug}:`, (err as Error).message);
    }
  }

  console.log(`Successfully migrated ${importedCount} posts to the database!`);
}

importToMongo()
  .catch((err) => console.error('Migration failed:', err))
  .finally(() => prisma.$disconnect());
