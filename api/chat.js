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

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no Vercel.' });
  }

  // Converter formato Gemini para Anthropic
  const systemPrompt = system_instruction?.parts?.[0]?.text || '';
  const messages = contents.map(msg => ({
    role: msg.role === 'model' ? 'assistant' : 'user',
    content: msg.parts?.[0]?.text || ''
  }));

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: generationConfig?.maxOutputTokens || 1000,
        system: systemPrompt,
        messages: messages
      })
    });

    const anthropicData = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('Anthropic error:', JSON.stringify(anthropicData));
      return res.status(502).json({ error: 'Erro na API de IA: ' + JSON.stringify(anthropicData) });
    }

    const text = anthropicData.content?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'Sem resposta do modelo.' });
    }

    return res.status(200).json({ text });
  } catch (e) {
    console.error('Fetch error:', e);
    return res.status(500).json({ error: 'Erro de conexão com a API de IA.' });
  }
};