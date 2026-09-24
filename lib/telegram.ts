import { prisma } from './prisma';

export interface TelegramBroadcastResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

export async function getTelegramCredentials() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  const token = settings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '';
  const channelId = settings?.telegramChannelId || process.env.TELEGRAM_CHANNEL_ID || '';
  const autoPublish = settings?.telegramAutoPublish ?? true;
  const siteUrl = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return { token, channelId, autoPublish, siteUrl };
}

export async function testTelegramBot(token: string, channelId: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!token || !channelId) {
      return { success: false, message: 'Bot Token and Channel/Chat ID are required' };
    }

    // 1. Verify Bot Token
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json();
    if (!meData.ok) {
      return { success: false, message: `Invalid Bot Token: ${meData.description || 'Unknown error'}` };
    }

    // 2. Send test message
    const text = `✅ <b>Sarkari Result Bot Connected!</b>\n\nThis is a test notification from your Sarkari Portal.\nBot Name: <b>@${meData.result.username}</b>\nTimestamp: <i>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</i>`;

    const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const sendData = await sendRes.json();
    if (!sendData.ok) {
      return { success: false, message: `Failed to post to channel: ${sendData.description}` };
    }

    return { success: true, message: `Successfully connected to @${meData.result.username} and posted to channel!` };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message || 'Network error connecting to Telegram' };
  }
}

export async function broadcastJobToTelegram(post: {
  id: string;
  title: string;
  slug: string;
  category: string;
  organization?: string | null;
  totalVacancies?: string | null;
  qualification?: string | null;
  lastDateApply?: string | null;
  applyOnlineUrl?: string | null;
  notificationPdfUrl?: string | null;
}): Promise<TelegramBroadcastResult> {
  try {
    const { token, channelId, siteUrl } = await getTelegramCredentials();

    if (!token || !channelId) {
      console.warn('Telegram broadcast skipped: Bot token or channel ID not configured');
      return { success: false, error: 'Telegram credentials not configured' };
    }

    const postUrl = `${siteUrl.replace(/\/$/, '')}/post/${post.slug}`;
    const categoryTag = post.category ? `#${post.category.replace(/[^a-zA-Z0-9]/g, '')}` : '#JobAlert';

    let message = `🔥 <b>NEW RECRUITMENT NOTIFICATION</b> 🔥\n\n`;
    message += `📌 <b>${escapeHtml(post.title)}</b>\n`;
    if (post.organization) {
      message += `🏛️ <b>Dept:</b> ${escapeHtml(post.organization)}\n`;
    }
    if (post.totalVacancies) {
      message += `👥 <b>Total Posts:</b> ${escapeHtml(post.totalVacancies)}\n`;
    }
    if (post.qualification) {
      message += `🎓 <b>Qualification:</b> ${escapeHtml(post.qualification)}\n`;
    }
    if (post.lastDateApply) {
      message += `⏰ <b>Last Date:</b> ${escapeHtml(post.lastDateApply)}\n`;
    }

    message += `\n${categoryTag} #SarkariResult #GovernmentJobs\n`;
    message += `\n👇 <b>Click below for details & direct apply:</b>`;

    const inlineKeyboard: Array<Array<{ text: string; url: string }>> = [
      [{ text: '👉 View Full Details & Apply', url: postUrl }],
    ];

    const extraButtons: Array<{ text: string; url: string }> = [];
    if (post.applyOnlineUrl && post.applyOnlineUrl.startsWith('http')) {
      extraButtons.push({ text: '⚡ Direct Apply Link', url: post.applyOnlineUrl });
    }
    if (post.notificationPdfUrl && post.notificationPdfUrl.startsWith('http')) {
      extraButtons.push({ text: '📄 Notification PDF', url: post.notificationPdfUrl });
    }
    if (extraButtons.length > 0) {
      inlineKeyboard.push(extraButtons);
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description };
    }

    // Update database record to mark as sent
    await prisma.jobPost.update({
      where: { id: post.id },
      data: {
        isTelegramSent: true,
        telegramMessageId: String(data.result?.message_id || ''),
      },
    });

    return { success: true, messageId: data.result?.message_id };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error broadcasting to Telegram:', error);
    return { success: false, error: error.message };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
