//=====================================================//
// 🔥 Script: Reglas del Grupo                        //
// 😈 Hinata-Bot | Versión Akeno Himejima             //
// ✨ Desarrollado con mucho amor por Neotokio 💋      //
// 🖤 No te olvides... siempre te estaré observando 👁️ //
//=====================================================//

let handler = async (m, { conn }) => {
  if (!m.isGroup) throw '🚫 Este comando solo sirve en grupos, cerote hueco 😾.'

  let metadata = await conn.groupMetadata(m.chat)
  let reglas = metadata.desc || '⚠️ Ni reglas tiene este grupo, la gran p... qué mulas 😏.'

  let texto = `
┏━━━━━━༻༺━━━━━━┓
   🌸 𝓡𝓔𝓖𝓛𝓐𝓢 𝓓𝓔𝓛 𝓖𝓡𝓤𝓟𝓞 🌸
┗━━━━━━༻༺━━━━━━┛

🧿 *Nombre del Grupo:* ${metadata.subject}
👥 *Miembros:* ${metadata.participants.length}

📜 *Reglamento (leelo o te saco a patadas, cerote):*
${reglas}

┏━━━━━━━━━━━━━━━━┓
💋 *Hinata dice:* “Miren vos, respeten las reglas porque si no los saco de un vergazo 😈.”
🕊️ *¿Tenés dudas?* Usá: #help o preguntale a mi dueño chulo *Neotokio* 💕
🦋 *Canal oficial:* ${global.canalLink || 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A'}

✨ Desarrollado con mucho amor por *Neotokio*.  
👁️ Siempre te estaré observando, así que portate bonito… o hacete el loco, me vale verga 😏.
┗━━━━━━━━━━━━━━━━┛
  `.trim()

  // ✉️ Enviar texto primero
  await conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      externalAdReply: {
        title: "📜 Reglas del grupo • Hinata Bot 😈",
        body: "Leídas desde la descripción cerota 💋",
        thumbnailUrl: "https://files.catbox.moe/d2prue.jpg",
        sourceUrl: global.canalLink || 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  // 🔊 Enviar audio chapín coquetón
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
