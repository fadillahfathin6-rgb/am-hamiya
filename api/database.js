export default async function handler(req, res) {
  // Mengizinkan akses dari domain mana saja (Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ==========================================
  // KONFIGURASI DATABASE ANDA
  // ==========================================
  const BIN_ID = "6adb471eac6210605a4bb9ca"; 
  const JSONBIN_API_KEY = "$2a$10$bed.4AkorEHtZnnFOiC/4un54RhvFVfhhKVhP5JqY2AQbDwI0PlG6";
  
  const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  try {
    // 1. AMBIL DATA (Untuk Login)
    if (req.method === 'GET') {
      const response = await fetch(`${JSONBIN_URL}/latest`, {
        headers: { 
            'X-Master-Key': JSONBIN_API_KEY,
            'X-Bin-Meta': 'false' // Meminta JSONBin hanya mengirim data aslinya, tanpa meta-data
        }
      });
      
      if (!response.ok) {
          return res.status(500).json({ error: "Gagal mengambil data dari JSONBin" });
      }

      const data = await response.json();
      
      // JSONBin terkadang membungkus data di dalam properti 'record'
      // Kita pastikan website menerima data mentahnya (object user)
      const cleanData = data.record ? data.record : data;
      return res.status(200).json(cleanData);
    }

    // 2. SIMPAN DATA (Untuk Daftar / Buat Akun Member)
    if (req.method === 'POST') {
      const newData = req.body; 
      
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
    console.error("Database Error:", error);
    return res.status(500).json({ success: false, message: "Gagal terhubung ke database" });
  }
}
