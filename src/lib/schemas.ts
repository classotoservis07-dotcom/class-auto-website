import { z } from 'zod';

/** İletişim formu doğrulama şeması */
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Ad Soyad en az 2 karakter olmalıdır.')
    .max(100, 'Ad Soyad çok uzun.')
    .regex(/^[\p{L}\s'\-]+$/u, 'Ad Soyad geçersiz karakter içeriyor.'),

  phone: z
    .string()
    .min(10, 'Telefon numarası geçerli değil.')
    .max(20, 'Telefon numarası çok uzun.')
    .regex(/^[\d\s\-+()]+$/, 'Telefon numarası yalnız rakam, boşluk ve - + ( ) içerebilir.'),

  vehicleMakeModel: z
    .string()
    .min(2, 'Araç marka ve modeli giriniz.')
    .max(100, 'Araç bilgisi çok uzun.'),

  plate: z.string().max(15, 'Plaka çok uzun.').optional().or(z.literal('')),

  service: z.string().min(1, 'Lütfen bir hizmet seçiniz.').max(100),

  message: z
    .string()
    .min(10, 'Mesajınız en az 10 karakter olmalıdır.')
    .max(1000, 'Mesajınız çok uzun (en fazla 1000 karakter).'),

  kvkk: z.literal(true, {
    message: 'Devam etmek için KVKK metnini onaylamanız gerekmektedir.',
  }),

  // Honeypot — botlar doldurur, gerçek kullanıcılar boş bırakır
  _hp: z.string().max(0, 'Bot algılandı.').optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/** Hizmet seçenekleri */
export const SERVICE_OPTIONS = [
  'Periyodik Bakım',
  'Mekanik Bakım ve Onarım',
  'Motor ve Şanzıman',
  'Oto Elektrik ve Elektronik',
  'Bilgisayarlı Arıza Tespiti',
  'Kaporta Onarımı',
  'Profesyonel Oto Boya',
  'Boyasız Göçük Düzeltme',
  'Klima Bakımı ve Gaz Dolumu',
  'Lastik Değişimi ve Balans',
  'Diğer',
] as const;
