import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import*as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//---------[ Añada los numeros a ser Propietario/a ]---------

global.owner = [  
  ['54649784684755@lid', '| 👑 𝗣 𝗥 𝗢 𝗣 𝗜 𝗘 𝗧 𝗔 𝗥 𝗜 𝗢 👑 |', true],  
  ['5212219831926', '| 🍷 𝗖 𝗢 - 𝗢 𝗪 𝗡 𝗘 𝗥 🍷 |', true],
  ['15614809253', '| 🍷 AyeitsDavid 🍷 |', true],
  ['573142495895', '| 🧃 𝗔 𝗦 𝗘 𝗦 𝗢 𝗥 🧃 |', true]  
]

global.lidOwners = [  
  ['50248019799'], // 👑 NEOTOKIO  
  ['5212219831926'], // 🍷 CO-OWNER  
  ['54649784684755@lid'] // 🧃 ASESOR
]

global.mods = []  
global.prems = []

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumberCode = "" //Ejemplo: +50248019799
global.confirmCode = "" 

// Cambiar a false para usar el Bot desde el mismo numero del Bot.
global.isBaileysFail = false

//---------[ APIS GLOBAL ]---------

global.openai_key = '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' /* Consigue tu ApiKey en este enlace: https://platform.openai.com/account/api-keys */
global.openai_org_id = 'HITjoN7H8pCwoncEB9e3fSyW' /* Consigue tu ID de organizacion en este enlace: https://platform.openai.com/account/org-settings */
global.Key360 = ['964f-0c75-7afc']//key de violetics
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = "GataDiosV2"
global.itsrose = ['4b146102c4d500809da9d1ff']
global.baileys = '@whiskeysockets/baileys'
global.apis = 'https://deliriussapi-oficial.vercel.app'

global.APIs = {xteam: 'https://api.xteam.xyz', 
dzx: 'https://api.dhamzxploit.my.id',
lol: 'https://api.lolhuman.xyz',
violetics: 'https://violetics.pw',
neoxr: 'https://api.neoxr.my.id',
zenzapis: 'https://api.zahwazein.xyz',
akuari: 'https://api.akuari.my.id',
akuari2: 'https://apimu.my.id',	
fgmods: 'https://api-fgmods.ddns.net',
botcahx: 'https://api.botcahx.biz.id',
ibeng: 'https://api.ibeng.tech/docs',	
rose: 'https://api.itsrose.site',
popcat : 'https://api.popcat.xyz',
xcoders : 'https://api-xcoders.site' },
global.APIKeys = {'https://api.xteam.xyz': `${keysxteam}`,
'https://api.lolhuman.xyz': `${lolkeysapi}`,
'https://api.neoxr.my.id': `${keysneoxr}`,	
'https://violetics.pw': 'beta',
'https://api.zahwazein.xyz': `${keysxxx}`,
'https://api-fgmods.ddns.net': 'fg-dylux',
'https://api.botcahx.biz.id': 'Admin',
'https://api.ibeng.tech/docs': 'tamvan',
'https://api.itsrose.site': 'Rs-Zeltoria',
'https://api-xcoders.site': 'Frieren' }

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

//------------------------[ Stickers ]-----------------------------

global.packname = `
╭──────⊹𖥔༶
│ 🦋 𝐇𝐈𝐍𝐀𝐓𝐀-𝐁𝐎𝐓 💮
│ ✦ 𝑉𝑒𝑟𝑠𝑖ó𝑛: 𝑆𝑒𝑛𝑝𝑎𝑖 𝑀𝑜𝑑𝑒 ✧
│ ✧ 𝐵𝑜𝓉 𝒹𝑒 𝒶𝓂𝒾𝑔𝒶𝓈 𝓎 𝑔𝓊𝒶𝓇𝒹𝒾𝒶𝓃 𝒅𝑒 𝓉𝓊 𝑔𝓇𝓊𝓅𝑜 ♡
╰──────⊹𖥔༶
`

global.author = `
╭─────🌸 𝙊𝙬𝙣𝙚𝙧 𝘽𝙤𝙩 🌸─────╮
│ 🐉 𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨™
│ 🩷 𝐌𝐢 - Creador Oficial ꒰ა♡໒꒱
│ ✨ 𝘾𝙤𝙙𝙚 𝙜𝙚𝙣𝙞𝙪𝙨 + 𝘼𝙣𝙞𝙢𝙚 𝙨𝙤𝙪𝙡
│ 🐾 𝑷𝒂𝒓𝒕𝒊𝒄𝒖𝒍𝒂𝒓 𝒄𝒐𝒎𝒐 𝒖𝒏 𝒏𝒆𝒌𝒐 𝒆𝒏 𝒍𝒖𝒄𝒆𝒔 ✧
╰────────────────────╯
`

//------------[ Versión | Nombre  ]------------

// Cambia por el nombre de tu bot

global.wm = 'HINATA-BOT' 
global.botname = 'HINATS-𝗕𝗢𝗧'
global.vs = '3.3.0'
global.dev = 'DESSAROLLADO POR 🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲'
global.copy = '⍟ 2025'

//----------------------------[ NIVELES | RPG ]---------------------------------

global.multiplier = 850 // Cuanto más alto, más difícil subir de nivel
global.maxwarn = '4' // máxima advertencias

//━━━━━━━━━━━━━━━━━━━━ ฅ^•ﻌ•^ฅ

global.rwait = '⌛'
global.dmoji = '💗'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🫣' 

//━━━━━━━━━━━━━━━━━━━━ ฅ^•ﻌ•^ฅ

global.flaaa = [
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=']

// -----------------------------------------

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
