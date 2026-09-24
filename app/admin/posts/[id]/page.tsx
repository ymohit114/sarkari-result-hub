import { redirect, notFound } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EditPostClient from './EditPostClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const post = await prisma.jobPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return <EditPostClient initialPost={post} />;
}
