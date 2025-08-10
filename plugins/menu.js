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
  before: `🍑 *Bienvenido al mundo sensual y peligroso de 𝙃𝙞𝙣𝙖𝙩𝙖 𝙎𝙃𝙄𝙉𝙊𝘽𝙄...* 💋
👑 Soy tu diosa virtual, ¿quieres que te castigue con mis comandos traviesos?

✨ ᴜꜱᴜᴀʀɪᴏ: %name
🔮 ɴɪᴠᴇʟ: %level | ⚡ ᴇxᴘ: %exp / %maxexp
📋 ʀᴇɢɪꜱᴛʀᴏꜱ: %totalreg
💖 ᴇꜱᴛᴀᴅᴏ: ᴏɴʟɪɴᴇ
⏳ ᴛɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ: %muptime

─────── 𝐌𝐄𝐍𝐔 𝐇𝐈𝐍𝐀𝐓𝐀 𝙎𝙃𝙄𝙉𝙊𝘽𝙄 ───────
🔞 *Mis comandos están tan calientes que te harán sudar...*
¿Te atreves a probarlos, papito? 😈🔥
%readmore`.trim(),

  header: '\n╭━━〔 💋 %category 〕━━⬣',
  body: '│ ➤ %cmd\n',
  footer: '╰━━━━━━━━━━━━⬣',
  after: `\n💋 *Menú ejecutado, mi amor...*\n_¿Quieres más poder? Solo susúrrame y yo lo haré 😏_`
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Reacción rápida antes de procesar
    await m.react('🕑')

    // Obtener información del usuario de la base de datos
    let { exp, level } = global.db.data.users[m.sender] || {}
    if (!exp || !level) {
      // Si no se encuentra la información del usuario, asignar valores predeterminados
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

    let text = _text.replace(/%(\w+)/g, (_, key) => replace[key] || '')

    const videos = [
      'https://files.cloudkuimages.guru/images/dQwgPEAt.jpg',
      'https://files.cloudkuimages.guru/images/zQdRjSX7.jpg',
      'https://files.cloudkuimages.guru/images/MxFaAos6.jpg',
      'https://files.cloudkuimages.guru/images/GzXbIfWA.jpg',
      'https://files.cloudkuimages.guru/images/N1BYGRr2.jpg'
    ]
    const selected = videos[Math.floor(Math.random() * videos.length)]

    // Enviar el archivo y el texto
    await conn.sendFile(m.chat, selected, 'hinata-menu.mp4', text, m)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❎ *Ups... fallé como tu diosa Shinobi 💔 Hinata necesita mimos.*

🔴 *Error detectado:*
\`\`\`
${e.message}
\`\`\`
`, m)
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
