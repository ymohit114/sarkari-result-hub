import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { slugify } from '@/lib/scraper';
import { broadcastJobToTelegram } from '@/lib/telegram';

export async function GET(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  const where: any = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { organization: { contains: search } },
    ];
  }

  const posts = await prisma.jobPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    let baseSlug = slugify(data.title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.jobPost.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.jobPost.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        category: data.category || 'latest-jobs',
        organization: data.organization,
        shortDescription: data.shortDescription,
        totalVacancies: data.totalVacancies,
        qualification: data.qualification,
        applicationBegin: data.applicationBegin,
        lastDateApply: data.lastDateApply,
        lastDateFee: data.lastDateFee,
        examDate: data.examDate,
        admitCardDate: data.admitCardDate,
        feeGeneral: data.feeGeneral,
        feeScStPh: data.feeScStPh,
        feeFemale: data.feeFemale,
        feePaymentMode: data.feePaymentMode,
        ageMin: data.ageMin,
        ageMax: data.ageMax,
        ageDetails: data.ageDetails,
        vacancyDetailsJson: data.vacancyDetailsJson,
        applyOnlineUrl: data.applyOnlineUrl,
        notificationPdfUrl: data.notificationPdfUrl,
        officialWebsiteUrl: data.officialWebsiteUrl,
        content: data.content,
        status: data.status || 'PUBLISHED',
      },
    });

    if (data.broadcastNow && post.status === 'PUBLISHED') {
      await broadcastJobToTelegram(post);
    }

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
