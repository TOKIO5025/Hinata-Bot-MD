// 📥 Comando .facebook – Hinata Bot 💋
// 💀 TOKIO5025 – github.com/TOKIO5025/Hinata-Bot-MD

import fetch from 'node-fetch';

let handler = async (m, { args, command, conn }) => {
  if (!args[0]) {
    return m.reply(`✨ *Uso correcto: .${command} <enlace de Facebook>*\n\nEjemplo:\n.${command} https://www.facebook.com/watch/...`);
  }

  try {
    await m.react('🕒');

    const res = await fetch(`https://eliasar-yt-api.vercel.app/api/facebookdl?link=${encodeURIComponent(args[0])}`);
    if (!res.ok) throw '*El servidor no respondió correctamente.*';

    const json = await res.json();
    if (!json.status || !json.data || !json.data.length) throw '*No se encontró el video.*';

    // buscar video SD para evitar enlaces rotos
    let video = json.data.find(v => v.url && v.quality?.toLowerCase().includes('sd')) || json.data[0];
    if (!video || !video.url) throw '*No se encontró un enlace válido para descargar.*';

    await conn.sendFile(m.chat, video.url, 'facebook.mp4', `📥 *Video descargado exitosamente desde Facebook*\n\n🥵 Aquí lo tienes, mi cielo...`, m);
    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('⚠️');
    m.reply(`❌ *No se pudo descargar el video:*\n${e.message}`);
  }
};

handler.help = ['facebook', 'fb'].map(v => v + ' <enlace>');
handler.tags = ['downloader'];
handler.command = ['fb', 'facebook'];

export default handler;
