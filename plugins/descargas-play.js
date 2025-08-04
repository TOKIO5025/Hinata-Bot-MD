import fetch from 'node-fetch'
import yts from 'yt-search'

const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

let handler = async (m, { conn, text, command }) => {
  if (!text?.trim()) {
    return conn.reply(m.chat, `🎧 *Dime qué canción quieres, ricura.*\n\nEscribe el nombre o pega el link de YouTube.`, m)
  }

  try {
    let match = text.match(ytRegex)
    let search = await yts(match ? `https://youtu.be/${match[1]}` : text)
    let video = match
      ? search.all.find(v => v.videoId === match[1]) || search.videos.find(v => v.videoId === match[1])
      : search.videos?.[0]

    if (!video) return conn.reply(m.chat, '🚫 No encontré nada con ese nombre, bebé.', m)

    const { title, thumbnail, timestamp, views, ago, url, author } = video
    const canal = author?.name || 'Desconocido'
    const ytID = video.videoId

    // 🔥 API confiable para MP3
    let api = `https://api.lolhuman.xyz/api/ytaudio2?apikey=GataDios&url=https://youtu.be/${ytID}`
    let res = await fetch(api)
    let json = await res.json()

    if (!json || !json.result || !json.result.link) {
      throw '⛔ No pude descargar el audio, amorcito. Intenta con otro.'
    }

    // 💖 Mensaje coqueto
    let mensaje = `💿 *Título:* ${title}\n⏱ *Duración:* ${timestamp}\n📺 *Canal:* ${canal}\n📥 *Enviando tu rolita, bebé...*`
    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: mensaje }, { quoted: m })

    // 🎶 Enviar el audio final
    await conn.sendMessage(m.chat, {
      audio: { url: json.result.link },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ *Ocurrió un error, bebé:*\n${e}`, m)
  }
}

handler.command = /^play2|musica|ytmp3c$/i
handler.help = ['play2', 'musica', 'ytmp3c']
handler.tags = ['downloader']

export default handler
