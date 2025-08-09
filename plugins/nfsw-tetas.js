/* Comando creado por 🐉𝙉𝙚𝙤𝙏𝙤𝙆𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 & Light Yagami */

import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  m.react('🕑');

  let txt = 'Pack🔥🔥🔥';
  let img = 'https://api.dorratz.com/nsfw/tetas';

  m.react('✅');
  conn.sendMessage(m.chat, { 
    image: { url: img }, 
    caption: txt 
  }, { quoted: m });
};

handler.help = ['tetas'];
handler.tags = ['nsfw'];
handler.command = ['tetas', 'pechos'];

export default handler;
