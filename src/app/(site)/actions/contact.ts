'use server';

import { contactFormSchema } from '@/lib/schemas';

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
  smtpWarning?: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // ─── Honeypot kontrolü ──────────────────────────────────────────────────
  const hp = formData.get('_hp');
  if (hp && String(hp).length > 0) {
    return { status: 'success', message: 'Mesajınız alındı.' };
  }

  // ─── Ham veri çıkart ────────────────────────────────────────────────────
  const raw = {
    fullName:         formData.get('fullName'),
    phone:            formData.get('phone'),
    vehicleMakeModel: formData.get('vehicleMakeModel'),
    plate:            formData.get('plate') ?? '',
    service:          formData.get('service'),
    message:          formData.get('message'),
    kvkk:             formData.get('kvkk') === 'on' ? true : undefined,
    _hp:              '',
  };

  // ─── Doğrulama ──────────────────────────────────────────────────────────
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    const flat = parsed.error.flatten();
    for (const [field, issues] of Object.entries(flat.fieldErrors)) {
      if (Array.isArray(issues)) errors[field] = issues as string[];
    }
    return {
      status: 'validation',
      message: 'Lütfen formdaki hataları düzeltin.',
      errors,
    };
  }

  const data = parsed.data;

  // ─── Veritabanına kaydet (SMTP olmasa da her zaman) ──────────────────────
  let savedToDb = false;
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.appointment.create({
      data: {
        fullName:    String(data.fullName),
        phone:       String(data.phone),
        serviceName: String(data.service),
        message:     String(data.message),
        plate:       String(data.plate ?? ''),
        kvkkApproved: Boolean(data.kvkk),
        status:      'new',
        source:      'contact_form',
        ipAddress:   'unknown',
        createdAt:   new Date(),
      },
    });
    savedToDb = true;
  } catch (dbErr) {
    console.error('[ContactForm] DB kaydı başarısız:', dbErr);
    // DB hatası olsa bile e-posta göndermeyi dene
  }

  // ─── SMTP kontrolü ──────────────────────────────────────────────────────
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const recipient = process.env.CONTACT_FORM_RECIPIENT;

  const smtpConfigured =
    smtpPass &&
    smtpPass.trim() !== '' &&
    smtpPass !== 'BURAYA_GOOGLE_UYGULAMA_SIFRESI' &&
    smtpHost &&
    smtpUser &&
    recipient &&
    recipient.includes('@');

  if (!smtpConfigured) {
    // SMTP yapılandırılmamış — DB'ye kaydedildiyse başarı say
    if (savedToDb) {
      return {
        status: 'success',
        message: 'Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
        smtpWarning: true,
      };
    }
    console.warn('[ContactForm] SMTP yapılandırılmamış ve DB kaydı da başarısız.');
    return {
      status: 'error',
      message: 'Form servisi şu an kullanılamıyor. Lütfen bize doğrudan ulaşın.',
    };
  }

  // ─── E-posta gönderimi ──────────────────────────────────────────────────
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host:   smtpHost,
      port:   Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: smtpUser, pass: smtpPass },
    });

    const safeFullName         = sanitize(String(data.fullName));
    const safePhone            = sanitize(String(data.phone));
    const safeVehicleMakeModel = sanitize(String(data.vehicleMakeModel));
    const safePlate            = sanitize(String(data.plate ?? ''));
    const safeService          = sanitize(String(data.service));
    const safeMessage          = sanitize(String(data.message));

    await transporter.sendMail({
      from: `"${process.env.CONTACT_FORM_FROM_NAME ?? 'CLASS AUTO İletişim'}" <${smtpUser}>`,
      to: recipient,
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
    });

    return {
      status: 'success',
      message: 'Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    };
  } catch (error) {
    console.error('[ContactForm] E-posta gönderilemedi:', error);
    if (savedToDb) {
      return {
        status: 'success',
        message: 'Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
        smtpWarning: true,
      };
    }
    return {
      status: 'error',
      message: 'Mesajınız şu an gönderilemedi. Lütfen telefon veya WhatsApp ile iletişime geçin.',
    };
  }
}
