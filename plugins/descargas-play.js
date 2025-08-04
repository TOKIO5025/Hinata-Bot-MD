import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

let handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `🎵 *Dime qué música quieres, bombón.*\n\nEscribe el nombre o pega el link de YouTube.`, m);
    }

    let match = text.match(youtubeRegexID);
    let search = await yts(match ? `https://youtu.be/${match[1]}` : text);
    let video = match
      ? search.all.find(v => v.videoId === match[1]) || search.videos.find(v => v.videoId === match[1])
      : search.videos?.[0];

    if (!video) return conn.reply(m.chat, '🚫 No encontré nada, mi amor. Intenta con otro nombre o link.', m);

    const { title, thumbnail, timestamp, views, ago, url, author } = video;
    const canal = author?.name || 'Desconocido';
    const vistas = formatViews(views);

    const resThumb = await fetch('https://files.catbox.moe/qzp733.jpg');
    const thumb2 = await resThumb.buffer();
    const Shadow = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Hinata"
      },
      message: {
        locationMessage: {
          name: `𝐇𝐈𝐍𝐀𝐓𝐀 𝐁𝐎𝐓\n[▓▓▓▓▓▓▓▓░░░░] 100%`,
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

    const infoMessage = `🎶 *${title}*\n\n` +
      `📺 *Canal:* ${canal}\n` +
      `👀 *Vistas:* ${vistas}\n` +
      `⏱️ *Duración:* ${timestamp}\n` +
      `📆 *Publicado:* ${ago}\n` +
      `🔗 *Link:* ${url}`;

    const thumb = (await conn.getFile(thumbnail))?.data;
    const external = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: '🐉 Hinata Bot – ¡Tu diosa musical!',
          mediaType: 1,
          thumbnail,
          mediaUrl: url,
          sourceUrl: url,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.reply(m.chat, infoMessage, m, external);

    if (['play', 'playaudio'].includes(command)) {
      const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
      const json = await res.json();

      if (!json.result?.download?.url) throw '❌ El enlace de descarga de audio falló.';

      await m.react?.('🎧');
      await conn.sendMessage(m.chat, {
        audio: { url: json.result.download.url },
        mimetype: 'audio/mpeg',
        fileName: `${json.result.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: json.result.title,
            body: '🎶 Hinata descargó tu canción',
            mediaType: 1,
            thumbnail,
            mediaUrl: url,
            sourceUrl: url,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: Shadow });

    } else if (['play2', 'playvideo'].includes(command)) {
      const res = await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`);
      const json = await res.json();

      if (!json.download) throw '❌ No se pudo obtener el video, mi rey.';

      await m.react?.('🎬');
      await conn.sendFile(m.chat, json.download, `${json.title || 'video'}.mp4`,
        `📥 *Video descargado exitosamente:*\n\n🎬 *Título:* ${json.title}\n📽️ *Duración:* ${timestamp}\n🔗 *Link:* ${url}`,
        Shadow
      );

    } else {
      return conn.reply(m.chat, '🛑 Comando no válido. Usa .play, .play2, .playaudio o .playvideo', m);
    }

  } catch (err) {
    console.error(err);
    return m.reply(`❌ *Ocurrió un error, bebé:*\n${err}`);
  }
};

handler.command = handler.help = ['play', 'play2', 'playaudio', 'playvideo'];
handler.tags = ['descargas'];

export default handler;

function formatViews(views) {
  if (views === undefined) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}
