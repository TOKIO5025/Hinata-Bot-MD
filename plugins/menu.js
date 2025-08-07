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
  before: `🍓 *Bienvenido al mundo travieso de 𝙃𝙞𝙣𝙖𝙩𝙖 𝘽𝙤𝙩...*
👑 Soy tu diosa virtual, ¿quieres jugar conmigo, amorcito?

✨ ᴜꜱᴜᴀʀɪᴏ: %name
🔮 ɴɪᴠᴇʟ: %level | ⚡ ᴇxᴘ: %exp / %maxexp
📋 ʀᴇɢɪꜱᴛʀᴏꜱ: %totalreg
💖 ᴇꜱᴛᴀᴅᴏ: ᴏɴʟɪɴᴇ
⏳ ᴛɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ: %muptime

─────── 𝐌𝐄𝐍𝐔 𝐇𝐈𝐍𝐀𝐓𝐀 ───────
🔞 *Tengo comandos traviesos, peligrosos y muy calientes...*
¿Te atreves a usarlos, papito? 😈`.trim(),

  header: '\n╭━━〔 💋 %category 〕━━⬣',
  body: '│ ➤ %cmd\n',
  footer: '╰━━━━━━━━━━━━⬣',
  after: `\n💋 *Menú ejecutado, mi amor...*\n_¿Quieres más poder? Solo pídelo con gemidos 😏_`
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let { exp, level } = global.db.data.users[m.sender]
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

    // Mensaje antes de menú
    let textBefore = before.replace(/%name/g, name)
      .replace(/%level/g, level)
      .replace(/%exp/g, exp - min)
      .replace(/%maxexp/g, xp)
      .replace(/%totalreg/g, totalreg)
      .replace(/%muptime/g, muptime)

    await conn.reply(m.chat, textBefore, m)
    await conn.sendReaction(m.chat, '🐉', m.key)  // Reacciona al mensaje del usuario

    // Envía cada categoría por separado rápido
    for (let tag of Object.keys(tags)) {
      const cmds = help
        .filter(menu => menu.tags.includes(tag))
        .map(menu => menu.help.map(cmd => body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)).join('\n'))
        .join('\n')

      let textCategory = `${header.replace(/%category/g, tags[tag])}\n${cmds}\n${footer}\n${after}`

      await conn.reply(m.chat, textCategory, m)
      await conn.sendReaction(m.chat, '🐉', m.key)
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ *Oops... fallé como tu diosa virtual 💔 Hinata necesita mimos.*', m)
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
