import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.jobPost.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    const updated = await prisma.jobPost.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
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
        status: data.status,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.jobPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
