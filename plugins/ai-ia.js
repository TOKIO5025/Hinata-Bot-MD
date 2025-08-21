import axios from 'axios'

let handler = async (m, { conn, text }) => {
  const botname = "Hinata Bot"
  const vs = "1.0"

  const username = conn.getName(m.sender)
  const basePrompt = `Hola mi amor, soy ${botname} versión ${vs}. Te llamaré ${username} con cariño. Soy divertida, atrevida y siempre coqueta.`

  // Si es imagen
  const isQuotedImage = m.quoted && m.quoted.mimetype?.startsWith('image/')
  if (isQuotedImage) {
    try {
      const img = await m.quoted.download?.()
      if (!img) return conn.reply(m.chat, "❌ Uy, no pude descargar tu imagen 😿", m)

      const prompt = `${basePrompt}. Describe la imagen con detalle y dime quién eres.`
      const result = await luminsesi(prompt, username, img)
      await conn.reply(m.chat, `💖 ${result}`, m)
    } catch (e) {
      console.error("Error IA Imagen:", e)
      await conn.reply(m.chat, "❌ No pude analizar tu imagen 😿", m)
    }
    return
  }

  // Si es texto
  if (!text) return conn.reply(m.chat, "🌟 Amorcito, escribe algo para que yo te responda 😘", m)

  try {
    const prompt = `${basePrompt}. Responde lo siguiente: ${text}`
    const result = await luminsesi(prompt, username)
    await conn.reply(m.chat, `💖 ${result}`, m)
  } catch (e) {
    console.error("Error IA Texto:", e)
    await conn.reply(m.chat, "❌ Amorcito, no puedo responder a eso 😿", m)
  }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'luminai']
handler.group = false
export default handler

// Función IA
async function luminsesi(prompt, username, imageBuffer) {
  try {
    const payload = imageBuffer
      ? { content: prompt, user: username, image: imageBuffer.toString('base64') }
      : { content: prompt, user: username }

    const res = await axios.post("https://Luminai.my.id/chat", payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    console.log("Respuesta IA:", res.data)
    return res.data.result || "😿 No obtuve respuesta de la IA"
  } catch (err) {
    console.error("Error Luminsesi:", err)
    throw err
  }
}
