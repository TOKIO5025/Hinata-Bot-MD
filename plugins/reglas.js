// código creador por +50248019799
// para Hinata-Bot | Akeno Himejima versión
// deja los créditos, gracias ~

let handler = async (m, { conn }) => {
  if (!m.isGroup) throw '🚫 Este comando solo funciona en grupos.'

  let metadata = await conn.groupMetadata(m.chat)
  let reglas = metadata.desc || '⚠️ Este grupo no tiene reglas escritas en la descripción... ¡Qué caos!'

  let texto = `
┏━━━━━━༻༺━━━━━━┓
   🌸 𝓡𝓔𝓖𝓛𝓐𝓢 𝓓𝓔𝓛 𝓖𝓡𝓤𝓟𝓞 🌸
┗━━━━━━༻༺━━━━━━┛

🧿 *Nombre del Grupo:* ${metadata.subject}
👥 *Miembros:* ${metadata.participants.length}

📜 *Reglas:*
${reglas}

┏━━━━━━━━━━━━━━━━┓
🌺 *Lee y cumple las reglas, o Akeno usará su rayo 😈⚡️*
🕊️ *Si tienes dudas, invoca con:* #help o pidele ayuda ami amor Netokio 
🦋 *Canal:* ${global.canalLink || 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A'}
 ${dev}
┗━━━━━━━━━━━━━━━━┛
  `.trim()

  // ✉️ Enviar texto primero
  await conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      externalAdReply: {
        title: "Reglas del grupo • Akeno Himejima Bot",
        body: "Leídas desde la descripción mágica 🦋",
        thumbnailUrl: "https://files.catbox.moe/d2prue.jpg",
        sourceUrl: global.canalLink || 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  // 🔊 Enviar audio después
  await conn.sendMessage(m.chat, {
    audio: { url: 'https://cloudkuimages.com/uploads/videos/94GPV7SF.mp4' },
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true
  }, { quoted: m })
}

handler.help = ['reglas']
handler.tags = ['group']
handler.command = /^reglas$/i

export default handler
