import fs from 'fs'
import path from 'path'
import archiver from 'archiver' // npm i archiver

// Función para crear ZIP
async function createZip(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve(outputPath))
    archive.on('error', err => reject(err))

    archive.pipe(output)
    archive.file(filePath, { name: path.basename(filePath) })
    archive.finalize()
  })
}

const handler = async (m, { args, usedPrefix, command, conn }) => {
  const fileName = args[0]
  if (!fileName) throw `✨ Usa el comando así mi ciela:\n${usedPrefix + command} <nombre-del-comando-sin-.js>\n\n💖 Ejemplo:\n${usedPrefix + command} descargas-apk`

  const filePath = path.join('./plugins', `${fileName}.js`)
  if (!fs.existsSync(filePath)) throw `❌ No encontré el archivo *${fileName}.js* en la carpeta plugins, bb ✨`

  const code = fs.readFileSync(filePath, 'utf-8')

  if (code.length > 4000) {
    // Aviso coqueto cuando es muy largo
    const msg = await conn.sendMessage(m.chat, {
      text: `💌 El archivo *${fileName}.js* es demasiado largo para mandártelo así, cosita.\n\nElige cómo lo quieres:\n\n🐉 En versión *ZIP* (bien guardadito)\n🐲 En *Documento* (para leerlo rico)\n\n✨ Reacciona con el emoji que prefieras ✨`,
      quoted: m
    })

    // Guardamos referencia para cuando reaccionen
    global.enviarLargo = global.enviarLargo || {}
    global.enviarLargo[msg.key.id] = {
      filePath,
      fileName,
      chat: m.chat
    }
    return
  }

  await m.reply(`📂 Aquí tienes el código de *${fileName}.js*, amor:\n\n` + '```js\n' + code + '\n```')
}

// Escucha reacciones y responde con zip o txt
handler.all = async function (m, { conn }) {
  if (!m.message?.reactionMessage) return
  const reactId = m.message.reactionMessage.key?.id
  const emoji = m.message.reactionMessage.text
  if (!reactId || !emoji) return

  const data = global.enviarLargo?.[reactId]
  if (!data) return

  const { filePath, fileName, chat } = data

  if (emoji === '🐉') {
    const zipPath = `./${fileName}.zip`
    await createZip(filePath, zipPath)
    await conn.sendMessage(chat, {
      document: { url: zipPath },
      mimetype: 'application/zip',
      fileName: `${fileName}.zip`,
      caption: `🐉 Aquí está tu *${fileName}.js* en formato ZIP, mi ciela 💕`
    })
    fs.unlinkSync(zipPath)
  }

  if (emoji === '🐲') {
    const txtPath = `./${fileName}.txt`
    fs.copyFileSync(filePath, txtPath)
    await conn.sendMessage(chat, {
      document: { url: txtPath },
      mimetype: 'text/plain',
      fileName: `${fileName}.txt`,
      caption: `🐲 Aquí tienes tu archivo *${fileName}.js* en documento, cosita linda ✨`
    })
    fs.unlinkSync(txtPath)
  }

  // Limpiar memoria
  delete global.enviarLargo[reactId]
}

handler.command = /^encontrar$/i
handler.owner = true
export default handler
