import { xpRange } from '../lib/levelling.js'

const textHinata = (text) => {
  const charset = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  }
  return text.toLowerCase().split('').map(c => charset[c] || c).join('')
}

let tags = {
  'main': textHinata('sistema'),
  'group': textHinata('grupos'),
  'serbot': textHinata('sub bots'),
  'owner': textHinata('owner'),
  'tools': textHinata('herramientas'),
  'fun': textHinata('diversión'),
  'rpg': textHinata('rpg'),
  'nsfw': textHinata('nsfw'),
  'games': textHinata('juegos'),
  'downloader': textHinata('descargas'),
  'search': textHinata('buscador'),
  'sticker': textHinata('stickers')
}

const defaultMenu = {
  before: `
🌸 ʜᴏʟᴀ ᴍɪ ᴀᴍᴏʀ ✨  
Bienvenido al mundo 🔥 *Hinata Shinobi* 🔥  
Prepárate que aquí mando yo 😏💋  

👤 ᴜꜱᴜᴀʀɪᴏ: %name  
🔮 ɴɪᴠᴇʟ: %level | ⚡ XP: %exp / %maxexp  
📊 ʀᴇɢɪꜱᴛʀᴏꜱ: %totalreg  
⏳ ᴀᴄᴛɪᴠᴏ: %muptime  

━━━━━━━ 💎 ━━━━━━━
%readmore`.trim(),

  header: '\n╭─〔 💋 %category 〕─✦',
  body: '│ ✧ %cmd',
  footer: '╰───────────────✦',
  after: `\n💖 ᴍᴇɴᴜ ᴇɴᴠɪᴀᴅᴏ ᴍɪ ᴀᴍᴏʀ...  
_¿Qᴜɪᴇʀᴇs ᴠᴇʀ ᴍᴀ́s ᴛʀᴀᴠᴇꜱᴜʀᴀꜱ? 😈_`
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await m.react('🌸')

    let { exp, level } = global.db.data.users[m.sender] || {}
    if (!exp || !level) {  
      exp = 0  
      level = 1  
    }

    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p,
      limit: p.limit,
      premium: p.premium,
      enabled: !p.disabled
    }))

    for (let plugin of help) {  
      for (let t of plugin.tags) {  
        if (!(t in tags) && t) tags[t] = textHinata(t)
      }
    }

    const { before, header, body, footer, after } = defaultMenu

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags.includes(tag))
          .map(menu => menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)).join('\n'))
          .join('\n')
        return `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}`
      }),
      after
    ].join('\n')

    let replace = {
      '%': '%',
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg,
      muptime,
      readmore: String.fromCharCode(8206).repeat(4001)
    }

    let menuText = _text.replace(/%(\w+)/g, (_, key) => replace[key] || '')

    // 🎨 Imagenes nuevas estilo anime/pro
    const images = [
      'https://raw.githubusercontent.com/TOKIO5025/Audios/main/Hinata.jpg',
      'https://raw.githubusercontent.com/TOKIO5025/Audios/main/Hinata-Bot.jpg',
      'https://raw.githubusercontent.com/TOKIO5025/Audios/main/Hinata-Bot-ultra.jpg',
      'https://raw.githubusercontent.com/TOKIO5025/Audios/main/Hinata-B.jpg',
      'https://raw.githubusercontent.com/TOKIO5025/Audios/main/Hinata-neo.jpg'
    ]
    const selectedImage = images[Math.floor(Math.random() * images.length)]

    await conn.sendMessage(m.chat, {
      image: { url: selectedImage },
      caption: menuText,
      contextInfo: {
        externalAdReply: {
          title: '🌸 𝐇𝐢𝐧𝐚𝐭𝐚 𝐒𝐡𝐢𝐧𝐨𝐛𝐢',
          body: '🐉 Dev by NeoTokyo Beats',
          thumbnailUrl: selectedImage,
          sourceUrl: 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `💔 Fallé como tu diosa Shinobi...  
\`\`\`${e.message}\`\`\``, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
