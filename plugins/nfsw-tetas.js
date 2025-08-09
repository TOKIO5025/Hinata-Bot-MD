import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    if (m.react) await m.react('🔞')
    let res = await fetch('https://api.dorratz.com/nsfw/tetas')
    let data = await res.json()
    let url = data?.url || data?.link || data?.image
    await conn.sendFile(m.chat, url, 'tetas.jpg', 'Aquí tienes 😏', m)
  } catch {
    await conn.reply(m.chat, '❌ No pude obtener la imagen.', m)
  }
}

handler.command = /^(tetas|teta|boobs|pechos)$/i
export default handler
