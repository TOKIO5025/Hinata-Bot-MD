import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const res = await fetch('https://nekos.life/api/v2/img/lewd');
  const json = await res.json();

  await conn.sendMessage(m.chat, {
    image: { url: json.url },
    caption: `🍑 Aquí está tu culito diario, sucio/a 😈`,
  }, { quoted: m });
};

handler.command = ['culito'];
handler.tags = ['nsfw'];
handler.help = ['culito'];
handler.register = true;

export default handler;
