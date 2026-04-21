const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Sessão inválida. Faça login novamente.' });
  }

  const { system_instruction, contents, generationConfig } = req.body || {};
  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ error: 'Payload inválido.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY não configurada no Vercel.' });
  }

  // Converte formato Gemini para formato OpenAI/Groq
  const messages = [];

  if (system_instruction?.parts?.[0]?.text) {
    messages.push({ role: 'system', content: system_instruction.parts[0].text });
  }

  for (const item of contents) {
    const role = item.role === 'model' ? 'assistant' : 'user';
    const content = item.parts?.[0]?.text || '';
    messages.push({ role, content });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: generationConfig?.maxOutputTokens || 1000,
        temperature: 0.7
      })
    });

    const groqData = await groqRes.json();

    if (!groqRes.ok) {
      console.error('Groq error:', JSON.stringify(groqData));
      return res.status(502).json({ error: 'Erro na API de IA: ' + JSON.stringify(groqData) });
    }

    const text = groqData.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(502).json({ error: 'Sem resposta do modelo.' });
    }

    return res.status(200).json({ text });
  } catch (e) {
    console.error('Fetch error:', e);
    return res.status(500).json({ error: 'Erro de conexão com a API de IA.' });
  }
};
