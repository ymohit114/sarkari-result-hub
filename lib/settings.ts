import { prisma } from './prisma';

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          siteName: 'Sarkari Result Hub',
          siteDescription: 'Latest Government Jobs, Sarkari Naukri, Results, Admit Card, Answer Key, Syllabus & Admissions',
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
          telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
          telegramAutoPublish: true,
          scraperAutoPublish: true,
          adminPassword: process.env.ADMIN_PASSWORD || 'admin',
        },
      });
    }
    return settings;
  } catch (error) {
    console.error('Failed to get site settings:', error);
    return {
      id: 'default',
      siteName: 'Sarkari Result Hub',
      siteDescription: 'Latest Government Jobs, Sarkari Naukri, Results, Admit Card, Answer Key, Syllabus & Admissions',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
      telegramAutoPublish: true,
      scraperAutoPublish: true,
      adminPassword: process.env.ADMIN_PASSWORD || 'admin',
      updatedAt: new Date(),
    };
  }
}

export async function updateSiteSettings(data: {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  telegramBotToken?: string;
  telegramChannelId?: string;
  telegramAutoPublish?: boolean;
  scraperAutoPublish?: boolean;
  adminPassword?: string;
}) {
  const current = await getSiteSettings();
  return prisma.siteSetting.update({
    where: { id: current.id },
    data: {
      siteName: data.siteName ?? current.siteName,
      siteDescription: data.siteDescription ?? current.siteDescription,
      siteUrl: data.siteUrl ?? current.siteUrl,
      telegramBotToken: data.telegramBotToken ?? current.telegramBotToken,
      telegramChannelId: data.telegramChannelId ?? current.telegramChannelId,
      telegramAutoPublish: data.telegramAutoPublish ?? current.telegramAutoPublish,
      scraperAutoPublish: data.scraperAutoPublish ?? current.scraperAutoPublish,
      ...(data.adminPassword ? { adminPassword: data.adminPassword } : {}),
    },
  });
}
