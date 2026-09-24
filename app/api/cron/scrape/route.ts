import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const secret = process.env.CRON_SECRET || 'sarkari_secret_cron_key';

    if (key && key !== secret) {
      return NextResponse.json({ error: 'Unauthorized cron key' }, { status: 401 });
    }

    const result = await runScraper({ forceMock: false });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
