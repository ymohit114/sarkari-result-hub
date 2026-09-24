import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PostsListClient from './PostsListClient';

export default async function AdminPostsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const posts = await prisma.jobPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <PostsListClient initialPosts={posts} />;
}
