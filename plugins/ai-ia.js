import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const botname = "Hinata Bot"
  const vs = "1.0"
  const rwait = "🕑"
  const done = "✅"
  const error = "❌"

  const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Hola mi amor, soy ${botname}, creada por Neotokio. Versión ${vs}. Te llamaré ${username} con mucho cariño, soy divertida y me encanta aprender cosas nuevas. Siempre seré tu amiguita coqueta y atrevida.`

  if (isQuotedImage) {
    const q = m.quoted
    const img = await q.download?.()
    if (!img) {
      return conn.reply(m.chat, `${error} Uy, no pude descargar tu imagen 😿`, m)
    }

    const content = `😼 ¿Qué se observa en la imagen?`
    try {
      const imageAnalysis = await fetchImageBuffer(content, img)
      const query = `⚡ Descríbeme la imagen y dime quién eres`
      const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
      const description = await luminsesi(query, username, prompt)
      await conn.reply(m.chat, `💖 ${description}`, m)
    } catch (e) {
      console.error("Error IA Imagen:", e)
      await conn.reply(m.chat, `${error} No pude analizar tu imagen 😿`, m)
    }
  } else {
    if (!text) {
      return conn.reply(m.chat, `🌟 Amorcito, escribe algo para que yo lo responda 😘`, m)
    }

    await m.react(rwait)
    try {
      const query = text
      const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
      const response = await luminsesi(query, username, prompt)
      await conn.sendMessage(m.chat, { text: `💖 ${response}` }, { quoted: m })
      await m.react(done)
    } catch (e) {
      console.error("Error IA Texto:", e)
      await m.react(error)
      await conn.reply(m.chat, `${error} Amorcito, no puedo responder a eso 😿`, m)
    }
  }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'luminai']
handler.group = true

export default handler

// --- Funciones auxiliares ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchImageBuffer(content, imageBuffer) {
  try {
    const base64 = imageBuffer.toString('base64')
    const response = await axios.post('https://Luminai.my.id/image', {
      content: content,
      image: base64
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (error) {
    console.error('Error Imagen:', error)
    throw error
  }
}

async function luminsesi(q, username, logic) {
  try {
    const response = await axios.post("https://Luminai.my.id/chat", {
      content: q,
      user: username,
      prompt: logic,
      webSearchMode: false
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data.result
  } catch (error) {
    console.error("Error Chat:", error)
    throw error
  }
        }
