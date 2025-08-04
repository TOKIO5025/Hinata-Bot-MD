// 📥 Comando .facebook – Hinata Bot 💋
// 💀 TOKIO5025 – github.com/TOKIO5025/Hinata-Bot-MD

import { igdl } from 'ruhend-scraper';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🥵 *¿Dónde está el link, bebé?*\n\nUsa así:\n${usedPrefix + command} https://www.facebook.com/...`, m);
  }

  await m.react('🌀');

  let res;
  try {
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, '❌ *Ocurrió un error descargando el video...*\n¿Será privado o ese link ya murió? 💀', m);
  }

  let result = res?.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, '⚠️ *No encontré ni madres con ese link, intenta otro.*', m);
  }

  let data = result.find(v => v.resolution.includes('720')) || result[0];

  if (!data?.url) {
    return conn.reply(m.chat, '💔 *No hay video en buena calidad disponible... ¿me estás jugando?*', m);
  }

  try {
    await conn.sendMessage(
      m.chat,
      {
        video: { url: data.url },
        caption: `✨ *Hinata Bot te cumple el capricho*\n\n📥 *Resolución:* ${data.resolution}\n🌐 *Enlace original:* ${args[0]}\n\n🩷 *Disfrútalo, sabros@.*`,
        fileName: `fb_video_${Date.now()}.mp4`,
        mimetype: 'video/mp4'
      },
      { quoted: m }
    );
    await m.react('✅');
  } catch (e) {
    await m.react('❌');
    return conn.reply(m.chat, '😿 *No pude mandarlo, capaz que está muy pesado o dañado...*\nPrueba con otro link, pececito.', m);
  }
};

handler.command = ['facebook', 'fb'];
handler.help = ['facebook <url>', 'fb <url>'];
handler.tags = ['descargas'];

export default handler;
