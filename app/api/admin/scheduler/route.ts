import { NextResponse } from 'next/server';
import { getSchedulerInfo } from '@/lib/scheduler';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const info = getSchedulerInfo();
  return NextResponse.json(info);
}
