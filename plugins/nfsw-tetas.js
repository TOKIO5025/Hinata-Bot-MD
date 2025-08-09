//código creado por tu jefe 🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲
//para Hinata Bot deja créditos pa
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const res = await fetch('https://api.dorratz.com/nsfw/tetas');
  const json = await res.json();

  await conn.sendMessage(m.chat, {
    image: { url: json.url },
    caption: `📦 Aquí tienes tu pack asquerosito 😈`,
  }, { quoted: m });
};

handler.command = ['tetas'];
handler.tags = ['nsfw'];
handler.help = ['tetas'];
handler.register = true;

export default handler;
