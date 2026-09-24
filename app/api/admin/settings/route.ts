import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  return NextResponse.json(settings || {});
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        siteUrl: data.siteUrl,
        telegramBotToken: data.telegramBotToken,
        telegramChannelId: data.telegramChannelId,
        telegramAutoPublish: Boolean(data.telegramAutoPublish),
        scraperAutoPublish: Boolean(data.scraperAutoPublish),
        ...(data.adminPassword ? { adminPassword: data.adminPassword } : {}),
      },
      create: {
        id: 'default',
        siteName: data.siteName || 'Sarkari Result Hub',
        siteDescription: data.siteDescription || 'Latest Government Jobs, Results, Admit Card & Syllabus Alerts',
        siteUrl: data.siteUrl || 'http://localhost:3000',
        telegramBotToken: data.telegramBotToken || '',
        telegramChannelId: data.telegramChannelId || '',
        telegramAutoPublish: Boolean(data.telegramAutoPublish),
        scraperAutoPublish: Boolean(data.scraperAutoPublish),
        adminPassword: data.adminPassword || 'admin',
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
