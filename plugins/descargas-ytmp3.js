import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🍓 *Dime el link o el nombre de la canción, mi amor...*\n\nEjemplo: .ytmp3 <nombre o link>`, m);
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    const search = await yts(text);
    const video = search.videos?.[0];
    if (!video) throw new Error('No encontré nada, mi cielo 😿');

    const { title, timestamp, views, ago, url, author, thumbnail } = video;
    const canal = author?.name || 'Desconocido';
    const vistas = views?.toLocaleString() || '???';

    const thumbnailBuffer = await (await fetch(thumbnail)).buffer();

    const textoInfo = `⬣ *🎲  \`YOUTUBE - MP3\` 🇦🇱* ⬣\n\n`
      + `> 🌾 *𝑻𝒊𝒕𝒖𝒍𝒐:* ${title}\n`
      + `> ⏱️ *𝑫𝒖𝒓𝒂𝒄𝒊𝒐𝒏:* ${timestamp}\n`
      + `> 🍰 *𝑪𝒂𝒏𝒂𝒍:* ${canal}\n`
      + `> 🌧️ *𝑽𝒊𝒔𝒕𝒂𝒔:* ${vistas}\n`
      + `> 🌳 *𝑷𝒖𝒃𝒍𝒊𝒄𝒂𝒅𝒐:* ${ago}\n`
      + `> 🔗 *𝑳𝒊𝒏𝒌:* ${url}\n\n`
      + `*➭ 𝑬𝒍 𝒂𝒖𝒅𝒊𝒐 𝒍𝒍𝒆𝒈𝒐, 𝒔𝒊𝒆𝒏𝒕𝒆 𝒆𝒍 𝒑𝒓𝒐𝒍𝒐𝒏𝒈𝒆 𝒄𝒐𝒏 𝒉𝒊𝒏𝒂𝒕𝒂~ 🌸*`;

    await conn.sendMessage(m.chat, {
      image: thumbnailBuffer,
      caption: textoInfo,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363341523880410@newsletter',
          newsletterName: '=͟͟͞Hinata Bot • 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⌺',
          serverMessageId: -1
        }
      }
    }, { quoted: m });

    const api = `https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json?.status || !json?.download) throw new Error('No pude sacar el audio, mi rey 😢');

    await conn.sendMessage(m.chat, {
      audio: { url: json.download },
      mimetype: 'audio/mpeg',
      fileName: `${json.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: json.title,
          body: 'YOUTUBE • MP3',
          mediaType: 1,
          thumbnail: thumbnailBuffer,
          mediaUrl: url,
          sourceUrl: url,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m }); // Aquí está la corrección

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error('❌ Error en ytmp3:', e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return conn.reply(m.chat, `❌ *Error:* ${e.message}`, m);
  }
};

handler.command = ['ytmp3'];
handler.tags = ['descargas'];
handler.help = ['ytmp3 *<link o título>*'];

export default handler;
