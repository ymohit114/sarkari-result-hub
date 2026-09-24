import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TelegramSettingsClient from './TelegramSettingsClient';

export default async function TelegramAdminPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  return <TelegramSettingsClient initialSettings={settings} />;
}
