import { NextResponse } from 'next/server';
import { testTelegramBot } from '@/lib/telegram';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { token, channelId } = await request.json();
    const result = await testTelegramBot(token, channelId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
