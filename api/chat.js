const { createClient } = require('@supabase/supabase-js');

// Admin client — usa a service role key para validar qualquer token de usuário
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

module.exports = async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar token do aluno
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
  }

  // Extrair payload do frontend
  const { system_instruction, contents, generationConfig } = req.body || {};
  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ error: 'Payload inválido.' });
  }

  // Debug: verificar se variáveis existem
  console.log('GEMINI_API_KEY existe:', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY prefix:', process.env.GEMINI_API_KEY?.slice(0, 10));
  console.log('SUPABASE_URL existe:', !!process.env.SUPABASE_URL);

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no Vercel.' });
  }

  // Chamar Gemini com a chave do servidor
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction, contents, generationConfig })
      }
    );

    const geminiData = await geminiRes.json();

    console.log('Gemini status:', geminiRes.status);

    if (!geminiRes.ok) {
      console.error('Gemini error:', JSON.stringify(geminiData));
      return res.status(502).json({ error: 'Erro na API de IA: ' + JSON.stringify(geminiData) });
    }

    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'Sem resposta do modelo.' });
    }

    return res.status(200).json({ text });
  } catch (e) {
    console.error('Fetch error:', e);
    return res.status(500).json({ error: 'Erro de conexão com a API de IA.' });
  }
};
