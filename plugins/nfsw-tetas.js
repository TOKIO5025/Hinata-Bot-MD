import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://waifu.pics/sfw/neko');
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Respuesta inesperada: ${contentType}`);
    }
    const json = await res.json();
    if (!json.url) throw new Error('No se encontró "url" en la respuesta');

    await conn.sendMessage(m.chat, {
      image: { url: json.url },
      caption: `🍒 Tómate estas nekos, cochino 😏`,
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    // Intento alternativo con Fluxpoint API (requiere API key)
    try {
      const fluxKey = process.env.FLUXPOINT_KEY || 'https://api.dorratz.com/nsfw/tetas';
      const res2 = await fetch('https://api.dorratz.com/nsfw/tetas', {
        headers: { Authorization: fluxKey }
      });
      const j2 = await res2.json();
      if (j2.file) {
        return await conn.sendMessage(m.chat, {
          image: { url: j2.file },
          caption: `🍒 Aquí tienes unas tetas nuevas, pervertido 😏`
        }, { quoted: m });
      }
    } catch (_) {}
    return conn.sendMessage(m.chat, { text: `❌ No se pudo obtener la imagen. La API está caída o respondió mal.` }, { quoted: m });
  }
};

handler.command = ['neko'];
handler.tags = ['nsfw'];
handler.help = ['neko'];
handler.register = true;

export default handler;
        
