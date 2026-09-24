import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { broadcastJobToTelegram } from '@/lib/telegram';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ success: false, message: 'postId is required' }, { status: 400 });
    }

    const post = await prisma.jobPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const result = await broadcastJobToTelegram(post);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
