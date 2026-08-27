'use server';

import { z } from 'zod';
import { contactFormSchema } from '@/lib/schemas';
import { SITE_CONFIG } from '@/lib/config';

// Simple in-memory rate limiting (production: use Redis/Upstash)
const rateMap = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 dakika

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export type FormState = {
  status: 'idle' | 'success' | 'error' | 'validation';
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // ─── Honeypot kontrolü ──────────────────────────────────────────────────
  const hp = formData.get('_hp');
  if (hp && String(hp).length > 0) {
    // Sessizce başarılı gibi davran (bota bilgi verme)
    return { status: 'success', message: 'Mesajınız alındı.' };
  }

  // ─── Ham veri çıkart ────────────────────────────────────────────────────
  const raw = {
    fullName:        formData.get('fullName'),
    phone:           formData.get('phone'),
    vehicleMakeModel:formData.get('vehicleMakeModel'),
    plate:           formData.get('plate') ?? '',
    service:         formData.get('service'),
    message:         formData.get('message'),
    kvkk:            formData.get('kvkk') === 'on' ? true : undefined,
    _hp:             '',
  };

  // ─── Doğrulama ──────────────────────────────────────────────────────────
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const [field, issues] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      errors[field] = issues as string[];
    }
    return {
      status: 'validation',
      message: 'Lütfen formdaki hataları düzeltin.',
      errors,
    };
  }

  const data = parsed.data;

  // ─── Form alıcısı kontrolü ──────────────────────────────────────────────
  const recipient = SITE_CONFIG.contact.formRecipient;
  if (
    !recipient ||
    recipient === 'ONAY_BEKLIYOR' ||
    !recipient.includes('@')
  ) {
    console.error('[ContactForm] Form alıcısı yapılandırılmamış.');
    return {
      status: 'error',
      message:
        'Form servisi şu an kullanılamıyor. Lütfen bize telefonla ulaşın.',
    };
  }

  // ─── E-posta gönderimi ──────────────────────────────────────────────────
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safeFullName        = sanitize(String(data.fullName));
    const safePhone           = sanitize(String(data.phone));
    const safeVehicleMakeModel= sanitize(String(data.vehicleMakeModel));
    const safePlate           = sanitize(String(data.plate ?? ''));
    const safeService         = sanitize(String(data.service));
    const safeMessage         = sanitize(String(data.message));

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME ?? 'CLASS AUTO İletişim'}" <${process.env.SMTP_FROM_ADDRESS ?? process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: safePhone,
      subject: `Yeni Randevu Talebi — ${safeFullName} (${safeService})`,
      text: [
        `Ad Soyad: ${safeFullName}`,
        `Telefon: ${safePhone}`,
        `Araç: ${safeVehicleMakeModel}`,
        `Plaka: ${safePlate || 'Belirtilmedi'}`,
        `İstenen Hizmet: ${safeService}`,
        `Mesaj:\n${safeMessage}`,
        `---`,
        `CLASS AUTO Web Sitesi İletişim Formu`,
        `Tarih: ${new Date().toLocaleString('tr-TR')}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
          <div style="background:#111315;padding:16px 24px;border-radius:6px 6px 0 0;">
            <h2 style="color:#F4F4F4;margin:0;font-size:18px;">CLASS AUTO — Yeni Randevu Talebi</h2>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 6px 6px;border:1px solid #eee;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;color:#666;width:40%;">Ad Soyad</td><td style="padding:8px;font-weight:600;">${safeFullName}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Telefon</td><td style="padding:8px;font-weight:600;">${safePhone}</td></tr>
              <tr><td style="padding:8px;color:#666;">Araç</td><td style="padding:8px;font-weight:600;">${safeVehicleMakeModel}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Plaka</td><td style="padding:8px;">${safePlate || 'Belirtilmedi'}</td></tr>
              <tr><td style="padding:8px;color:#666;">İstenen Hizmet</td><td style="padding:8px;font-weight:600;color:#C8281E;">${safeService}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-left:4px solid #C8281E;border-radius:4px;">
              <p style="margin:0;color:#333;white-space:pre-wrap;">${safeMessage}</p>
            </div>
            <p style="margin-top:16px;font-size:12px;color:#999;">
              Bu e-posta CLASS AUTO web sitesi iletişim formu aracılığıyla gönderilmiştir.<br>
              Tarih: ${new Date().toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      `,
    });

    return {
      status: 'success',
      message:
        'Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    };
  } catch (error) {
    // Üretimde teknik detayı kullanıcıya gösterme
    console.error('[ContactForm] E-posta gönderilemedi:', error);
    return {
      status: 'error',
      message:
        'Mesajınız şu an gönderilemedi. Lütfen telefon veya WhatsApp ile iletişime geçin.',
    };
  }
}
