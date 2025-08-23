import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    let stick = args.join(" ").split("|");
    let f = stick[0] !== "" ? stick[0] : global.packname
    let g = typeof stick[1] !== "undefined" ? stick[1] : global.author

    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        let img;

        // Sticker animado o imagen/video
        if (q.msg?.sticker || /webp|image|video/.test(mime)) {
            if (q.msg?.sticker) {
                // Sticker animado → descargar webp
                img = await q.download?.()
                if (!img) return m.reply('*Chapinita traviesa 😏* no pude descargar tu sticker 😢')
            } else if (/video/.test(mime)) {
                if ((q.msg || q).seconds > 18) 
                    return m.reply('⚠️ Uy vos, el video está bien largo 😏 máximo 12 segs, hacelo corto mi chapina 😘')
                img = await q.download?.()
            } else {
                img = await q.download?.()
            }

            // Crear el sticker
            try {
                stiker = await sticker(img, false, f, g)
            } catch (e) {
                console.error(e)
                let out
                if (q.msg?.sticker || /webp/.test(mime)) out = await webp2png(img) // sticker animado → png frame
                else if (/image/.test(mime)) out = await uploadImage(img)
                else if (/video/.test(mime)) out = await uploadFile(img)
                stiker = await sticker(false, out, f, g)
            }

        } else if (args[0]) {
            if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author)
            else return m.reply('Esa URL está malita 😏 pasame una buena, chapina traviesa 😘')
        } else {
            return m.reply(`*Ey vos, no me mandaste nada 😏* Responde a una imagen, video o sticker animado para hacer tu sticker, chapina traviesa. Usa: ${usedPrefix + command}`)
        }
    } catch (e) {
        console.error(e)
        if (!stiker) stiker = e
    } finally {
        if (stiker) {
            // Enviar como sticker animado si aplica
            conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
        }
    }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker'] 
handler.register = true
export default handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
    }
