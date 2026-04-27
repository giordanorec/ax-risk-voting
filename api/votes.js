// Vercel Serverless Function — proxy para jsonblob.com
// Resolve o problema de CORS: a página chama /api/votes (mesmo domínio),
// e este servidor faz a requisição para o jsonblob (servidor→servidor, sem CORS).

const BLOB_URL = "https://jsonblob.com/api/jsonBlob/019dceb0-d630-7368-a36c-a76cf96ee51d";

export default async function handler(req, res) {
  // Permitir CORS de qualquer origem (para dev local também funcionar)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responder ao preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const response = await fetch(BLOB_URL, {
        headers: { "Accept": "application/json" }
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "PUT") {
      const response = await fetch(BLOB_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy request failed", detail: err.message });
  }
}
