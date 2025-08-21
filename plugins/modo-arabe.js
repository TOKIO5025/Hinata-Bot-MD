//=====================================================//
// 🔥 Script: Modo Árabes                             //
// ✨ Autor: Neotokio                                 //
// 📌 Bloquea automáticamente a números con prefijos  //
//     árabes cuando escriban al bot.                 //
//=====================================================//

let modoArabes = false // estado global del modo

let handler = async (m, { conn, command, isOwner }) => {
  if (!isOwner) return m.reply('⚠️ Solo el owner puede usar este comando.')

  if (command === 'activatemodoarabes') {
    modoArabes = true
    m.reply('✅ Modo árabes ACTIVADO.\nLos números árabes serán bloqueados automáticamente.')
  }

  if (command === 'desactivatemodoarabes') {
    modoArabes = false
    m.reply('❌ Modo árabes DESACTIVADO.\nYa no se bloquearán números árabes.')
  }
}

// Prefijos comunes de países árabes
const prefijosArabes = [
  '+20',   // Egipto
  '+212',  // Marruecos
  '+213',  // Argelia
  '+218',  // Libia
  '+971',  // EAU
  '+966',  // Arabia Saudita
  '+964',  // Irak
  '+973',  // Bahréin
  '+974',  // Catar
  '+968',  // Omán
  '+970',  // Palestina
  '+962'   // Jordania
]

// Hook que revisa mensajes privados antes de responder
handler.before = async (m, { conn }) => {
  if (!m.chat.endsWith('@s.whatsapp.net')) return  // solo chats privados
  if (!modoArabes) return false                   // solo si está activo

  let numero = m.sender.replace(/@s\.whatsapp\.net/, '')
  if (prefijosArabes.some(pre => numero.startsWith(pre))) {
    // Bloquear al número automáticamente
    await conn.updateBlockStatus(m.sender, 'block')
    console.log(`🚫 [NEOTOKIO] Número bloqueado automáticamente: ${numero}`)
    return true
  }
  return false
}

handler.help = ['activatemodoarabes', 'desactivatemodoarabes']
handler.tags = ['owner']
handler.command = /^(activatemodoarabes|desactivatemodoarabes)$/i

export default handler
