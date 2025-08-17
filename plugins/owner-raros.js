//=====================================================//
// 🔥 Script: Modo Árabes                             //
// ✨ Autor: Neotokio                                 //
// 📌 Función: Bloquear automáticamente a números     //
//      con prefijos árabes cuando escriban al bot.   //
//=====================================================//

let modoArabes = false // variable global para el estado del modo

// Activar modo árabes
let activar = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('⚠️ Solo el owner puede usar este comando.')
  modoArabes = true
  m.reply('✅ Modo árabes ACTIVADO.\nLos números árabes serán bloqueados automáticamente.')
}

// Desactivar modo árabes
let desactivar = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('⚠️ Solo el owner puede usar este comando.')
  modoArabes = false
  m.reply('❌ Modo árabes DESACTIVADO.\nYa no se bloquearán números árabes.')
}

// Handler que revisa mensajes privados
let before = async (m, { conn }) => {
  if (!m.chat.endsWith('@s.whatsapp.net')) return  // solo chats privados
  if (!modoArabes) return false                   // solo si está activo

  // Prefijos comunes de países árabes
  let prefijosArabes = [
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

  let numero = m.sender.replace(/@s\.whatsapp\.net/, '')
  if (prefijosArabes.some(pre => numero.startsWith(pre))) {
    // Bloquear al número automáticamente
    await conn.updateBlockStatus(m.sender, 'block')
    console.log(`🚫 [NEOTOKIO] Número bloqueado automáticamente: ${numero}`)
    return true
  }
  return false
}

activar.command = ['activatemodoarabes']
desactivar.command = ['desactivatemodoarabes']

export default {
  activar,
  desactivar,
  before
    }
