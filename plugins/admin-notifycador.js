import { default as makeWASocket, proto } from '@adiwajshing/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isAdmin }) => {
  if (!isAdmin) return m.reply('❌ ¡Solo mis dioses admins pueden usar esto, no te hagas el pendejo/a! 😼')
  
  if (!m.quoted && !text) return m.reply('❗️ ¿Y el texto o mensaje para mencionar a todos, eh?')

  try {
    // Obtener los JID de todos menos el bot
    let users = participants.map(u => conn.decodeJid(u.id)).filter(jid => jid !== conn.user.id)

    // Si se responde a un mensaje
    if (m.quoted) {
      // Obtener mensaje citado
      let q = m.quoted
      let mime = (q.msg || q).mimetype || ''
      let isMedia = /image|video|sticker|audio/.test(mime)
      let htextos = text || '🔥 Aquí va toda la manada completa, prepárense para la locura 😈🍑'

      // Descargar media si es media para reenviar
      if (isMedia) {
        let mediaData = await q.download?.()
        let msgOptions = { mentions: users, caption: htextos, quoted: m }
        
        if (q.mtype === 'imageMessage') await conn.sendMessage(m.chat, { image: mediaData, ...msgOptions })
        else if (q.mtype === 'videoMessage') await conn.sendMessage(m.chat, { video: mediaData, mimetype: 'video/mp4', ...msgOptions })
        else if (q.mtype === 'audioMessage') await conn.sendMessage(m.chat, { audio: mediaData, mimetype: 'audio/mp4', fileName: 'Hidetag.mp3', ...msgOptions })
        else if (q.mtype === 'stickerMessage') await conn.sendMessage(m.chat, { sticker: mediaData, mentions: users, quoted: m })
        else await conn.sendMessage(m.chat, { text: htextos, mentions: users, quoted: m })
      } else {
        await conn.sendMessage(m.chat, { text: htextos, mentions: users, quoted: m })
      }
    } else {
      // Si no se responde, sólo manda el texto con menciones y frase coqueta
      let textosCoquetos = [
        'Ey, mira quién manda aquí... ¡yo! 🐉🔥',
        'Te traje a todos, no te hagas el/la loco/a 😈🍑',
        'Si te pica, es porque les gusto, ¡acepta! 😼💦',
        '¡A mover esas nalguitas que los estoy mencionando! 🍑😜',
        'Papi/mami, la fiesta no empieza sin ustedes 🔥🔥',
        'Ya llegó tu diosa Hinata, para que tiemblen los valientes 😈💥'
      ]
      let textoCoqueto = textosCoquetos[Math.floor(Math.random() * textosCoquetos.length)]

      let sendText = `${text}\n\n${textoCoqueto}`

      let users = participants.map(u => conn.decodeJid(u.id)).filter(jid => jid !== conn.user.id)
      await conn.sendMessage(m.chat, { text: sendText, mentions: users, quoted: m })
    }
  } catch (e) {
    console.error(e)
    m.reply('❌ Algo salió mal al intentar mencionar a todos, intentá otra vez, pelotudo/a.')
  }
}

handler.command = /^(notificador|notificar|notify)$/i
handler.group = true
handler.admin = true

export default handler
