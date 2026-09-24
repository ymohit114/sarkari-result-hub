import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });

    const expectedPassword = settings?.adminPassword || process.env.ADMIN_PASSWORD || 'admin';

    if (password === expectedPassword) {
      await setAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
