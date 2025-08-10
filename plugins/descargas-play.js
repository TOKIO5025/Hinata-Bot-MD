import fetch from "node-fetch";
import yts from "yt-search";

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text = '', usedPrefix, command }) => {
  try {
    text = text.trim();

    // Comando sin prefijo
    let cmd = command;
    if (!cmd) {
      const firstWord = text.split(' ')[0].toLowerCase();
      const validCommands = ['play', 'play2', 'playaudio', 'playvideo'];
      if (validCommands.includes(firstWord)) {
        cmd = firstWord;
        text = text.split(' ').slice(1).join(' ').trim();
      } else {
        return conn.reply(m.chat, '🤨 ¿Qué coño quieres? Ese comando no existe, intenta de nuevo.', m);
      }
    }

    if (!text) return conn.reply(m.chat, `🎧 Oye, mete el nombre o link del video, que no adivino tu mente, ¿ok?`, m);

    let videoIdMatch = text.match(youtubeRegexID);
    let search = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text);
    let video = videoIdMatch
      ? search.all.find(v => v.videoId === videoIdMatch[1]) || search.videos.find(v => v.videoId === videoIdMatch[1])
      : search.videos?.[0];

    if (!video) return conn.reply(m.chat, '🚫 No encontré ni madres con esa búsqueda, prueba con otra cosa.', m);

    const res2 = await fetch('https://files.catbox.moe/qzp733.jpg');
    const thumb2 = await res2.buffer();
    const Shadow = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: `DESCARGA COMPLETA\n[▓▓▓▓▓▓▓▓░░░░] 100%`,
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

    const { title, thumbnail, timestamp, views, ago, url, author } = video;
    const vistas = formatViews(views);
    const canal = author?.name || 'Desconocido';

    await m.react('☁️');

    const infoMessage = `🔥 *Aquí tienes tu video, prro:* 🔥\n\n` +
      `> 🎬 *Título:* ${title}\n` +
      `> 📺 *Canal:* ${canal}\n` +
      `> 👁️ *Vistas:* ${vistas}\n` +
      `> ⏰ *Duración:* ${timestamp}\n` +
      `> 📅 *Publicado:* ${ago}\n` +
      `> 🔗 *Link:* ${url}\n\n` +
      `*Pide rápido que no me ando con jueguitos* 😎`;

    const thumb = (await conn.getFile(thumbnail))?.data;
    const external = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: wm || 'Hinata Bot 💨 - El puto amo de las descargas',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: false
        }
      }
    };

    await conn.reply(m.chat, infoMessage, m, external);

    if (['play', 'playaudio'].includes(cmd)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
        const json = await res.json();
        if (!json.result?.download?.url) throw '⚠ No se pudo pillar el enlace del audio, qué pedo.';

        await m.react('✅');
        await conn.sendMessage(m.chat, {
          audio: { url: json.result.download.url },
          mimetype: 'audio/mpeg',
          fileName: `${json.result.title}.mp3`,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: 'Hinata Bot 💨 - Audio listo para que lo disfrutes, cabrón',
              mediaType: 1,
              thumbnail: thumb,
              mediaUrl: url,
              sourceUrl: url,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: Shadow });
      } catch (e) {
        return conn.reply(m.chat, '❌ Maldita sea, no pude mandar el audio, pesa mucho o algo raro pasó.', m);
      }
    }
    else if (['play2', 'playvideo'].includes(cmd)) {
      try {
        const res = await fetch(`https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`);
        const json = await res.json();
        if (!json.download) throw '⚠ No se pudo pillar el enlace del video, qué pedo.';

        await m.react('✅');
        await conn.sendFile(m.chat, json.download, `${json.title || 'video'}.mp4`, `📥 *Video descargado con éxito, maldito crack.*\n\n` +
          `> 🎬 *Título:* ${json.title}\n` +
          `> ⏱️ *Duración:* ${timestamp}\n` +
          `> 📽️ *Calidad:* ${json.quality}\n` +
          `> 🔗 *Link:* ${url}`, Shadow);
      } catch (e) {
        return conn.reply(m.chat, '❌ No pude mandar el video, pesadote o error de la puta API.', m);
      }
    }
    else {
      return conn.reply(m.chat, '🤔 ¿Qué chingados? Ese comando no está aquí.', m);
    }

  } catch (err) {
    return m.reply(`⚠️ Se chingó todo:\n${err}`);
  }
};

handler.command = ['play', 'play2', 'playaudio', 'playvideo'];
handler.tags = ['descargas'];

export default handler;

function formatViews(views) {
  if (views === undefined) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
        }
