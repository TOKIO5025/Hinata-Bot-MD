import { createHash } from 'crypto'
import moment from 'moment-timezone'
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;
import db from '../lib/database.js'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { text, usedPrefix, command, conn }) {
    let nombre = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let semana = d.toLocaleDateString(locale, { weekday: 'long' })
    let fecha = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let hora = moment.tz('America/Lima').format('HH')
    let minuto = moment.tz('America/Lima').format('mm')
    let segundo = moment.tz('America/Lima').format('ss')
    let tiempo = `${hora} H ${minuto} M ${segundo} S`
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg')
    let user = global.db.data.users[m.sender]
    let sn = createHash('md5').update(m.sender).digest('hex')
    
    let bio, fechaBio
    let sinDefinir = '😿 Es privada'
    let biografia = await conn.fetchStatus(m.sender).catch(() => null)
    if (!biografia || !biografia[0] || biografia[0].status === null) {
        bio = sinDefinir
        fechaBio = "Fecha no disponible"
    } else {
        bio = biografia[0].status || sinDefinir
        fechaBio = biografia[0].setAt ? new Date(biografia[0].setAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "Fecha no disponible"
    }

    if (user.registered === true) throw `❗ ¡Ya estás registrado!\n\n¿Quieres registrarte de nuevo?\nEscribe:\n${usedPrefix}unreg ${sn}`

    if (!text && !m.quoted) {
        return m.reply(`「 *REGISTRO* 」\n\n⚡ Para registrarte usa el comando:\n${usedPrefix}${command} nombre.edad\n\n📌 Ejemplo: ${usedPrefix}${command} hinata.25`)
    }

    if (!Reg.test(text)) return m.reply(`⚠️ Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad*\nEjemplo : *${usedPrefix + command} ${nombre}.18*`)

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('*¿Cuál es tu nombre?*')
    if (!age) return m.reply('*¿Cuál es tu edad?*')
    if (name.length > 100) return m.reply('El nombre debe tener máximo 100 caracteres.')
    age = parseInt(age)
    if (age > 1000) return m.reply('Wow el abuelo quiere jugar al bot.')
    if (age < 5) return m.reply('Hay un abuelo bebé jsjsj.')

    user.name = name + '✓'.trim()
    user.age = age
    user.descripcion = bio
    user.regTime = +new Date
    user.registered = true
    
    user.coin += 40
    user.exp += 300
    user.joincount += 20

    let caption = `
╭━━━[ 𝑅𝐸𝒢𝐼𝒮𝒯𝑅𝒪 𝒞𝒪𝑀𝒫𝐿𝐸𝒯𝒜𝐷𝒪 ]━━━╮
┃ 👤 𝙽𝚘𝚖𝚋𝚛𝚎:      » ${name}
┃ 🎂 𝙴𝚍𝚊𝚍:        » ${age} años
┃ 📝 𝙱𝚒𝚘:         » ${bio}
┃ 🆔 𝙲𝚕𝚊𝚟𝚎 SN:   » ${sn}
┃━━━━━━━━━━━━━━━━━━
┃ 📅 𝙵𝚎𝚌𝚑𝚊:      » ${semana}, ${fecha}
┃ ⏰ 𝙷𝚘𝚛𝚊:        » ${tiempo}
┃━━━━━━━━━━━━━━━━━━
┃ 🎁 𝙱𝚘𝚗𝚘𝚜 𝚍𝚎 𝚁𝚎𝚐𝚒𝚜𝚝𝚛𝚘:
┃   ⛁ Monedas:      +40
┃   ✰ Experiencia:   +300
┃   ❖ Tokens:        +20
┃━━━━━━━━━━━━━━━━━━
┃ ¡Bienvenido/a al sistema del bot!
┃ Tus datos han sido guardados exitosamente.
┃ Usa *${usedPrefix}profile* para ver tu perfil.
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

  await conn.sendMessage(
        m.chat,
        {
            image: { url: pp },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: `${conn.getName(conn.user.jid)} Sistema`,
                    body: `Registro exitoso en la base de datos`,
                    thumbnailUrl: pp,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        },
        { quoted: m }
    );
}

handler.help = ['registrar']
handler.tags = ['usuario']
handler.command = /^(registrar|verificar|daftar|reg(istro)?)$/i

export default handler
