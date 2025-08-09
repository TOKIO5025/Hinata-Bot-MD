import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => { try { // reacción coqueto if (m.react) await m.react('🔞')

const res = await fetch('https://api.dorratz.com/nsfw/tetas')
if (!res.ok) throw new Error('API error')
const data = await res.json()

// intentar extraer la URL de la respuesta de forma flexible
let url = data?.url || data?.link || data?.image || data?.src || (Array.isArray(data) ? data[0] : null)
if (!url && typeof data === 'string') url = data
if (!url) throw new Error('No image url returned')

const caption = `Desarrollado por 🐉𝙉𝙚𝙤𝙏𝙤𝙆𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 & light Yagami\n\nAquí tienes tus tetas, perrito 😏` 

// Envía la imagen al chat (compatible con la mayoría de handlers de Baileys)
await conn.sendFile(m.chat, url, 'tetas.jpg', caption, m)

} catch (err) { console.log(err) await conn.reply(m.chat, '❌ No pude obtener la imagen. Intenta de nuevo más tarde.', m) } }

handler.help = ['tetas'] handler.tags = ['nsfw'] handler.command = /^(tetas|teta|boobs|pechos)$/i handler.register = true

export default handler

  
