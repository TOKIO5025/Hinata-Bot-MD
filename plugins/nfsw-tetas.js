/* Comando creado por 🐉𝙉𝙚𝙤𝙏𝙤𝙆𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 & Light Yagami */

//código creado por NEOTOKIO para hinata bot no quites los créditos 
//github.com/TOKIO5025

import fetch from 'node-fetch';

const handler = async (m, { conn, command }) => {
  try {
    const res = await fetch('https://api.dorratz.com/nsfw/tetas');
    if (!res.ok) throw new Error(`Error en la API: ${res.status}`);

    const buffer = await res.buffer();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🔥 Aquí tienes tu ${command} bien rico/a 😏`,
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('❌ No pude traer la imagen, la API no respondió bien.');
  }
};

handler.command = ['tetas', 'teta', 'tetona'];
handler.tags = ['nsfw'];
handler.help = ['tetas', 'teta', 'tetona'];
handler.register = true;

export default handler;
