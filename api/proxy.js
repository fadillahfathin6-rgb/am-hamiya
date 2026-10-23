export default async function handler(req, res) {
  const { email, options, apikey } = req.query;

  if (!email || !apikey) {
    return res.status(400).json({ status: false, message: "Parameter email atau apikey tidak lengkap." });
  }

  // Memastikan parameter options diteruskan dengan benar (default ke 'verif' jika kosong)
  const optionParam = options || 'verif';

  const targetUrl = `https://sylvatica.my.id/api/tools/alightmotion?email=${encodeURIComponent(email)}&options=${optionParam}&url=&apikey=${apikey}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return res.status(500).json({ status: false, message: "Server API mengembalikan respon tidak valid." });
    }

    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ status: false, message: "Gagal terhubung ke server API pusat." });
  }
}
