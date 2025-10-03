import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { createInterface } from 'readline'
import cfonts from 'cfonts'
import yargs from 'yargs'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, author } = require(join(__dirname, './package.json'))
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

// Fake gradient para no instalar "gradient-string"
const gradient = {
  pastel: { multiline: (text) => chalk.magentaBright(text) },
  rainbow: (text) => chalk.bold.rgb(255, 105, 180)(text), // rosado fuerte
  cristal: (text) => chalk.cyanBright(text),
  mind: (text) => chalk.yellowBright(text),
  morning: (text) => chalk.greenBright(text)
}

console.log(gradient.pastel.multiline(`
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
`))

say('HINATA-BOT 🌸', {
  font: 'block',
  align: 'center',
  gradient: ['pink', 'magenta'],
  transitionGradient: true
})

say(`✨ Echo Con Mucho Amor ✨\nMulti-Bots-WhatsApp`, {
  font: 'console',
  align: 'center',
  gradient: ['cyan', 'yellow', 'magenta']
})

console.log(gradient.rainbow(`Autor: ${author} | Versión: ${name}`))
console.log(gradient.cristal('🔥 Preparando todos los sistemas... 🔥'))

let dots = ''
const loading = setInterval(() => {
  dots += '.'
  process.stdout.write(`\r${gradient.mind('Cargando' + dots)}   `)
  if (dots.length > 5) dots = ''
}, 300)

setTimeout(() => {
  clearInterval(loading)
  console.log('\n' + gradient.morning('✅ Todos los sistemas listos! ✅\n'))
}, 3000)

let isRunning = false

function start(file) {
  if (isRunning) return
  isRunning = true

  const args = process.argv.slice(2)

  setupMaster({
    exec: join(__dirname, file),
    args: args
  })

  const p = fork()

  p.on('message', (msg) => {
    if (msg === 'reset') {
      p.kill()
      isRunning = false
      start(file)
    } else if (msg === 'uptime') {
      p.send(process.uptime())
    }
  })

  p.on('exit', (_, code) => {
    console.error(chalk.redBright('⚠️ Error Inesperado ⚠️'), code)
    isRunning = false
    start(file)
  })

  const opts = yargs(args).exitProcess(false).parse()

  if (!opts.test && rl.listenerCount() === 0) {
    rl.on('line', (line) => {
      p.send(line.trim())
    })
  }
}

// Inicia el bot
start('main.js')
