const { createClient } = require('@libsql/client');
const { put } = require('@vercel/blob');
const fs = require('fs');

const BLOB_TOKEN = 'vercel_blob_rw_WMc5FdtANk6EsNR8_h4rxv3XWt6UZuHIUn3cQcY0rdvhG6I';

const db = createClient({
  url: 'libsql://class-auto-db-classotoservis07-dotcom.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgxNjYzNzEsImlkIjoiMDFhMDU3MDItZDEwMS03MWQwLWI1NjItZDQxNGE0ZThmNGMxIiwia2lkIjoiVjhvdzc3alpFaU5Vd3NSLUpOcmNpc3QwTWoxRmptUURuS2Etamc4SUU3VSIsInJpZCI6ImRkYmE1ZjRmLWZjZjQtNDUyMy05MTFmLTEyNmE1ZTdkMDgyMiJ9.au6ttFP04mp6bYA8RcbHHJexg-h_JfDIEtQTEcSxb6NcU1n8gQOf8uyBtRwD5N6_fDRWWQ9ND4ZTy6HMErRYAA'
});

async function run() {
  // 1. Kampanya görselini Blob'a yükle
  const imgPath = 'C:\\Users\\ibrah\\.gemini\\antigravity\\brain\\7a688660-4b79-4de8-a87f-40d9ba9d67b4\\campaign_oil_service_1788193413277.jpg';
  const buffer = fs.readFileSync(imgPath);
  console.log(`Gorsel yukleniyor: ${Math.round(buffer.length/1024)}KB`);
  
  const blob = await put('campaigns/periyodik-bakim-yag-bakimi.jpg', buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    token: BLOB_TOKEN,
    allowOverwrite: true,
  });
  console.log('Blob URL:', blob.url);

  // 2. DB'yi güncelle
  await db.execute({
    sql: `UPDATE Campaign SET 
      imageUrl = ?,
      image = ?,
      badge = ?,
      startDate = NULL,
      updatedAt = CURRENT_TIMESTAMP
    WHERE id = 1`,
    args: [blob.url, blob.url, '3.500 TL\'den Başlayan Fiyatlar']
  });

  const r = await db.execute('SELECT id, title, imageUrl, badge, startDate, isActive, showOnHome, status FROM Campaign WHERE id=1');
  console.log('Kampanya guncellendi:', JSON.stringify(r.rows[0], null, 2));

  await db.close();
  console.log('TAMAM!');
}
run().catch(console.error);
