// ============================================================
//  VoiceFlow Worker — 接收分段音频 → Whisper 转写
//  支持 webm/opus, mp4/aac, ogg, wav 全格式
// ============================================================

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return cors(new Response(null));
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/transcribe' && request.method === 'POST') {
      return cors(await transcribe(request, env));
    }

    if (url.pathname === '/api/health') {
      return cors(json({ ok: true, ts: Date.now() }));
    }

    // 前端静态文件由 Pages 托管，Worker 只处理 API
    return cors(json({ error: 'not found' }, 404));
  }
};

async function transcribe(req, env) {
  try {
    const fd = await req.formData();
    const file = fd.get('audio');
    const lang = fd.get('language');

    if (!file || !(file instanceof File)) {
      return json({ error: 'missing audio' }, 400);
    }
    if (file.size > 25 * 1024 * 1024) {
      return json({ error: 'file too large (25MB max)' }, 413);
    }
    if (file.size < 500) {
      return json({ error: 'audio too short' }, 400);
    }

    const buf = await file.arrayBuffer();
    const input = { audio: new Uint8Array(buf) };

    if (lang && lang !== 'auto') {
      input.language = lang;
    }

    // whisper-large-v3-turbo → fallback whisper
    let result;
    try {
      result = await env.AI.run('@cf/openai/whisper-large-v3-turbo', input);
    } catch {
      result = await env.AI.run('@cf/openai/whisper', input);
    }

    return json({
      text: result.text || '',
      language: result.language || lang || 'auto',
      duration: result.duration || null,
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function cors(resp) {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return resp;
}
