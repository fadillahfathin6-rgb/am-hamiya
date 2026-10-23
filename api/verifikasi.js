export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, rawLink } = req.body;

  if (!email || !rawLink) {
    return res.status(400).json({ success: false, message: 'Email dan Link wajib diisi' });
  }

  const API_URL = 'https://anita-studio.netlify.app/.netlify/functions/amprem';

  try {
    // 1. Verifikasi Akun
    const verifyRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify-account', email: email, rawLink: rawLink })
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.success && !verifyData.idToken && !verifyData.profile?.idToken) {
      return res.status(400).json({ success: false, message: verifyData.message || 'Verifikasi akun gagal. Link mungkin salah/kedaluwarsa.' });
    }

    const idToken = verifyData.idToken || verifyData.profile?.idToken;
    if (!idToken) {
        return res.status(400).json({ success: false, message: 'Gagal mendapatkan token verifikasi.' });
    }

    // 2. Apply Premium
    const premiumRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'apply-premium', email: email, idToken: idToken })
    });
    const premiumData = await premiumRes.json();

    if (premiumData.success) {
      return res.status(200).json({ success: true, message: 'Berhasil! Akun Alight Motion Anda sudah Premium.' });
    } else {
      return res.status(400).json({ success: false, message: premiumData.message || 'Gagal menerapkan premium.' });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal terhubung ke server API pusat.' });
  }
        }
