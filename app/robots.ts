import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-static';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  const baseUrl = settings?.siteUrl || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
