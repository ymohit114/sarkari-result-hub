import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const target = process.argv[2]; // 'mongo' or 'sqlite'

if (target === 'mongo') {
  console.log('Switching Prisma schema to MongoDB...');
  const mongoSchema = fs.readFileSync(path.join(process.cwd(), 'prisma', 'schema.mongo.prisma'), 'utf-8');
  fs.writeFileSync(path.join(process.cwd(), 'prisma', 'schema.prisma'), mongoSchema, 'utf-8');
  console.log('schema.prisma updated for MongoDB.');
  
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
  if (envContent.includes('file:./dev.db') || !envContent.includes('mongodb')) {
    console.log('\n⚠️  Please update DATABASE_URL in your .env file with your MongoDB connection string:');
    console.log('Example: DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/sarkari?retryWrites=true&w=majority"\n');
  } else {
    try {
      console.log('Pushing schema to MongoDB...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('Migrating data to MongoDB...');
      execSync('npx tsx scripts/migrate-to-mongo.ts', { stdio: 'inherit' });
    } catch (e) {
      console.error('Error syncing MongoDB:', e);
    }
  }
} else if (target === 'sqlite') {
  console.log('Switching Prisma schema to SQLite...');
  // Restore sqlite schema
  const sqliteSchema = `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model JobPost {
  id                  String   @id @default(cuid())
  title               String
  slug                String   @unique
  category            String   @default("latest-jobs")
  organization        String?
  postDate            DateTime @default(now())
  shortDescription    String?
  totalVacancies      String?
  qualification       String?
  
  // Important Dates
  applicationBegin    String?
  lastDateApply       String?
  lastDateFee         String?
  examDate            String?
  admitCardDate       String?
  
  // Application Fee
  feeGeneral          String?
  feeScStPh           String?
  feeFemale           String?
  feePaymentMode      String?
  
  // Age Limit
  ageMin              String?
  ageMax              String?
  ageDetails          String?
  
  // Vacancy & Links
  vacancyDetailsJson  String?
  applyOnlineUrl      String?
  notificationPdfUrl  String?
  officialWebsiteUrl  String?
  content             String?
  
  // Scraper & Sync
  sourceUrl           String?  @unique
  status              String   @default("PUBLISHED")
  isTelegramSent      Boolean  @default(false)
  telegramMessageId   String?
  viewCount           Int      @default(0)
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model SiteSetting {
  id                  String   @id @default("default")
  siteName            String   @default("Sarkari Result Hub")
  siteDescription     String   @default("Latest Government Jobs, Sarkari Naukri, Results, Admit Card, Answer Key, Syllabus & Admissions")
  siteUrl             String   @default("http://localhost:3000")
  telegramBotToken    String   @default("")
  telegramChannelId   String   @default("")
  telegramAutoPublish Boolean  @default(true)
  scraperAutoPublish  Boolean  @default(true)
  adminPassword       String   @default("admin123")
  updatedAt           DateTime @updatedAt
}

model ScraperLog {
  id           String   @id @default(cuid())
  source       String
  itemsFound   Int      @default(0)
  itemsCreated Int      @default(0)
  status       String   @default("SUCCESS")
  logMessage   String?
  createdAt    DateTime @default(now())
}
`;
  fs.writeFileSync(path.join(process.cwd(), 'prisma', 'schema.prisma'), sqliteSchema, 'utf-8');
  console.log('schema.prisma updated for SQLite.');
  execSync('npx prisma generate', { stdio: 'inherit' });
} else {
  console.log('Usage: npx tsx scripts/switch-db.ts [mongo|sqlite]');
}
