// print.js versión NeoTokio con Dinosaurio + Glitch
// By TOKIO5025 ✨

import { WAMessageStubType } from '@whiskeysockets/baileys'
import chalk from 'chalk'
import { watchFile } from 'fs'
const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

// 🎭 Función para simular glitch
function glitchText(text) {
  const glitchChars = ['░', '▒', '▓', '█', '▌', '▐', '▖', '▗', '▘', '▝', '▄', '▀']
  return text.split('').map(c => {
    if (Math.random() > 0.85) return chalk.rgb(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    )(glitchChars[Math.floor(Math.random() * glitchChars.length)])
    return c
  }).join('')
}

export default async function (m, conn = { user: {} }) {
  let _name = await conn.getName(m.sender)
  let sender = '+' + m.sender.replace('@s.whatsapp.net', '') + (_name ? ' ~' + _name : '')
  let chat = await conn.getName(m.chat)

  let img
  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
  } catch (e) {
    console.error(e)
  }

  let filesize = (m.msg ?
    m.msg.vcard ? m.msg.vcard.length :
    m.msg.fileLength ? m.msg.fileLength.low || m.msg.fileLength :
    m.msg.axolotlSenderKeyDistributionMessage ? m.msg.axolotlSenderKeyDistributionMessage.length :
    m.text ? m.text.length : 0
    : m.text ? m.text.length : 0) || 0

  let me = '+' + (conn.user?.jid || '').replace('@s.whatsapp.net', '')

  // 🎇 Banner NeoTokio Glitch
  let banner = `
╔═════════════════════════════════════════════╗
║ 🦖 HINATA-BOT CONSOLE :: ${chalk.magentaBright('NEO-TOKIO GLITCH MODE')} 🦖
╠═════════════════════════════════════════════╣
║ Bot: ${chalk.cyanBright(me)} ~ ${chalk.magentaBright(conn.user.name)}
║ Fecha: ${chalk.yellowBright(new Date().toLocaleString())}
║ Remitente: ${chalk.blueBright(sender)}
║ Chat: ${chalk.redBright(m.chat)} ${chat ? chalk.greenBright('~' + chat) : ''}
║ Tipo de mensaje: ${chalk.magentaBright(m.mtype || 'Desconocido')}
║ Tamaño/Peso: ${chalk.yellowBright(filesize + ' B')}
╚═════════════════════════════════════════════╝
  `

  console.log(glitchText(banner)) // ← aplica glitch

  if (img) console.log(img.trimEnd())

  // Logs con formato markdown + glitch opcional
  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~`])(?!`)(.+?)\1|```((?:.|[\n\r])+?)```|`([^`]+?)`)(?=\S?(?:[\s\n]|$))/g
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = { '_': 'italic', '*': 'bold', '~': 'strikethrough', '`': 'bgGray' }
      text = text || monospace
      return !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(/`/g, '').replace(mdRegex, mdFormat(depth - 1)))
    }

    log = log.replace(mdRegex, mdFormat(4))
    log = log.split('\n').map(line => {
      if (line.trim().startsWith('>')) return chalk.bgGray.dim(line.replace(/^>/, '┃'))
      else if (/^([1-9]|[1-9][0-9])\./.test(line.trim())) return line
      else if (/^[-*]\s/.test(line.trim())) return line.replace(/^[*-]/, '  •')
      return line
    }).join('\n')

    if (log.length < 1024)
      log = log.replace(urlRegex, url => chalk.blueBright(url))

    if (m.mentionedJid) {
      for (let user of m.mentionedJid)
        log = log.replace('@' + user.split`@`[0], chalk.cyanBright('@' + await conn.getName(user)))
    }

    console.log(m.error != null ? chalk.redBright(glitchText(log)) : m.isCommand ? chalk.yellowBright(glitchText(log)) : glitchText(log))
  }

  // Tipos de mensajes extras
  if (/document/i.test(m.mtype)) console.log(`📂 ${chalk.greenBright(m.msg.fileName || 'Documento')}`)
  else if (/contact/i.test(m.mtype)) console.log(`👤 ${chalk.yellowBright(m.msg.displayName || '')}`)
  else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds
    console.log(`${m.msg.ptt ? '🎤 PTT' : '🎵 AUDIO'} ${chalk.magentaBright('(' + Math.floor(duration / 60).toString().padStart(2, 0) + ':' + (duration % 60).toString().padStart(2, 0) + ')')}`)
  }

  console.log(chalk.greenBright('═════════════════════════════════════════════\n'))
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  console.log(chalk.greenBright("⚡ Actualizado 'lib/print.js' en modo NeoTokio GLITCH"))
})
