import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function exportData() {
  try {
    const jobs = await prisma.jobPost.findMany();
    const settings = await prisma.siteSetting.findMany();
    const data = { jobs, settings };
    const filePath = path.join(process.cwd(), 'prisma', 'seed-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Successfully exported ${jobs.length} jobs and ${settings.length} settings to prisma/seed-data.json`);
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
