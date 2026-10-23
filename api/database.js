export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ==========================================
  // KONFIGURASI JSONBIN (GANTI DENGAN MILIK ANDA)
  // ==========================================
  const BIN_ID = "6adb471eac6210605a4bb9ca"; 
  const JSONBIN_API_KEY = "$2a$10$bed.4AkorEHtZnnFOiC/4un54RhvFVfhhKVhP5JqY2AQbDwI0PlG6";
  
  const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  try {
    // 1. AMBIL DATA (Untuk Login)
    if (req.method === 'GET') {
      const response = await fetch(`${JSONBIN_URL}/latest`, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      });
      const data = await response.json();
      return res.status(200).json(data.record || {});
    }

    // 2. SIMPAN DATA (Untuk Daftar / Buat Akun Member)
    if (req.method === 'POST') {
      const newData = req.body; // Data yang dikirim dari index.html
      
      // Simpan ke JSONBin
      const response = await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(newData)
      });
      
      const data = await response.json();
      return res.status(200).json({ success: true, message: "Data tersimpan", data: data.record });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: "Gagal terhubung ke database" });
  }
}
