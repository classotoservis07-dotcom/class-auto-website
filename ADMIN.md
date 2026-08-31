# CLASS AUTO — Yönetim Paneli

> Bu dosya oluşturma tarihi: 27 Ağustos 2026

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Kur
```bash
cd c:\Users\ibrah\Desktop\CLASS-AUTO-WEB-SITESI\class-auto
npm install
```

### 2. Veritabanını Oluştur
```bash
npx prisma db push
```

### 3. Varsayılan Verileri Yükle
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 4. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```

---

## 🔐 Yönetim Paneline Erişim

### İlk Kurulum
Tarayıcıda açın: **http://localhost:3000/admin/setup**

- Ad Soyad, e-posta ve şifrenizi girin
- Şifre: en az 8 karakter ve 1 rakam içermeli
- "Yönetici Hesabını Oluştur" butonuna tıklayın

### Giriş
**http://localhost:3000/admin/login**

---

## 📁 Panel Sayfaları

| URL | Sayfa |
|-----|-------|
| `/admin` | Kontrol Paneli |
| `/admin/ayarlar` | Site Ayarları (iletişim, logo, SEO) |
| `/admin/ana-sayfa` | Hero Bölümü Yönetimi |
| `/admin/hizmetler` | Hizmet Listesi |
| `/admin/calismalar` | Çalışmalar Galerisi |
| `/admin/kampanyalar` | Kampanya Yönetimi |
| `/admin/reklam-sayfalari` | Reklam/Landing Sayfaları |
| `/admin/yorumlar` | Müşteri Yorumları |
| `/admin/sss` | Sık Sorulan Sorular |
| `/admin/talepler` | Randevu ve Talepler |
| `/admin/reklam-raporlari` | Reklam Raporları |
| `/admin/seo` | SEO Ayarları |
| `/admin/medya` | Medya Kütüphanesi |
| `/admin/yonlendirmeler` | URL Yönlendirmeleri |
| `/admin/kullanicilar` | Kullanıcı Yönetimi |
| `/admin/kayitlar` | Sistem Kayıtları |

---

## 🗃️ Veritabanı

- **Tür:** SQLite (lokal) → üretimde PostgreSQL
- **Dosya:** `prisma/dev.db`
- **Schema:** `prisma/schema.prisma`
- **Seed:** `prisma/seed.ts`

### DB Komutları
```bash
npx prisma studio        # DB görsel arayüz (tarayıcıda açılır)
npx prisma db push       # Schema'yı DB'ye uygula
npx prisma db seed       # Varsayılan verileri yükle
```

---

## 🔒 Güvenlik Özellikleri

- bcryptjs ile şifre hashleme (12 round)
- iron-session ile güvenli cookie oturumu (8 saat)
- 5 hatalı girişte 15 dakika hesap kilidi
- Tüm `/admin/*` route'ları oturum kontrolünden geçer
- Panel CSS/JS ziyaretçi sayfalarına yüklenmez
- `robots: noindex` — panel arama motorlarında görünmez

---

## ⚙️ Ortam Değişkenleri (.env.local)

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="en-az-32-karakter-guclu-sifre-buraya"
CONTACT_FORM_RECIPIENT=classotoservis07@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=classotoservis07@gmail.com
SMTP_PASS=google-uygulama-sifresi
```
