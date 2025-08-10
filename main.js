
bold.greenBright('\n▣─────────────────────────────···\n│\n│❧ 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾 𝙲𝙾𝚁𝚁𝙴𝙲𝚃𝙰𝙼𝙴𝙽𝚃𝙴 𝙰𝙻 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 ✅\n│\n▣─────────────────────────────···'))
}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
if (reason == 405) {
await fs.unlinkSync("./HINATA-BotSession/" + "creds.json")
console.log(chalk.bold.redBright(`[ ⚠ ] Conexión replazada, Por favor espere un momento me voy a reiniciar...\nSi aparecen error vuelve a iniciar con : npm start`)) 
process.send('reset')}
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
conn.logger.error(`[ ⚠ ] Sesión incorrecta, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
//process.exit();
} else if (reason === DisconnectReason.connectionClosed) {
conn.logger.warn(`[ ⚠ ] Conexión cerrada, reconectando...`);
await global.reloadHandler(true).catch(console.error);
} else if (reason === DisconnectReason.connectionLost) {
conn.logger.warn(`[ ⚠ ] Conexión perdida con el servidor, reconectando...`);
await global.reloadHandler(true).catch(console.error);
} else if (reason === DisconnectReason.connectionReplaced) {
conn.logger.error(`[ ⚠ ] Conexión reemplazada, se ha abierto otra nueva sesión. Por favor, cierra la sesión actual primero.`);
//process.exit();
} else if (reason === DisconnectReason.loggedOut) {
conn.logger.error(`[ ⚠ ] Conexion cerrada, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
//process.exit();
} else if (reason === DisconnectReason.restartRequired) {
conn.logger.info(`[ ⚠ ] Reinicio necesario, reinicie el servidor si presenta algún problema.`);
await global.reloadHandler(true).catch(console.error);
} else if (reason === DisconnectReason.timedOut) {
conn.logger.warn(`[ ⚠ ] Tiempo de conexión agotado, reconectando...`);
await global.reloadHandler(true).catch(console.error);
} else {
conn.logger.warn(`[ ⚠ ] Razón de desconexión desconocida. ${reason || ''}: ${connection || ''}`);
await global.reloadHandler(true).catch(console.error);
}}}

process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e)
}
if (restatConn) {
const oldChats = global.conn.chats
try { global.conn.ws.close() } catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('group-participants.update', conn.participantsUpdate)
conn.ev.off('groups.update', conn.groupsUpdate)
conn.ev.off('message.delete', conn.onDelete)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}

conn.welcome = 'HOLAA!! @user ¿COMO ESTAS?😃\n\n『Bienvenido A *@subject*』\n\nUn gusto conocerte amig@ 🤗\n\n_Recuerda leer las reglas del grupo para no tener ningun problema 🧐_\n\n*Solo disfrutar de este grupo y divertite 🥳*`'
conn.bye = 'Bueno, se fue @user 👋\n\nQue dios lo bendiga 😎`'
conn.spromote = 'Hey @user ya forma parte de staff 👑'
conn.sdemote = 'jajaja @user ya no eres admins'
conn.sDesc = 'La descripción ha sido cambiada a \n@desc'
conn.sSubject = 'El nombre del grupo ha sido cambiado a \n@group'
conn.sIcon = 'El icono del grupo ha sido cambiado'
conn.sRevoke = 'El enlace del grupo ha sido cambiado a \n@revoke'
conn.handler = handler.handler.bind(global.conn)
conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
conn.onDelete = handler.deleteUpdate.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)

conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('group-participants.update', conn.participantsUpdate)
conn.ev.on('groups.update', conn.groupsUpdate)
conn.ev.on('message.delete', conn.onDelete)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = fa = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true)
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(`Plugins actualizado: '${filename}'`)
else { 
conn.logger.warn(`delete plugins: '${filename}'`)
return delete global.plugins[filename]
}
} else conn.logger.info(`Nuevo plugins:  '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`❌ error de sintaxis al cargar '${filename}'\n${format(err)}`)
else {
try { 
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(`❌ Error requiere plugins: '${filename}\n${format(e)}'`);
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}}

Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

 ffprobe, ffmpegWebp, convert, magick, gm, find }
Object.freeze(global.support)
}

_quickTest()
.then(() => conn.logger.info('Ƈᴀʀɢᴀɴᴅᴏ．．．.\n'))
.catch(console.error)

function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function() {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
arguments[0] = ""
}
originalConsoleMethod.apply(console, arguments)
}}

async function isValidPhoneNumber(number) {
try {
number = number.replace(/\s+/g, '')
// Si el número empieza con '+521' o '+52 1', quitar el '1'
if (number.startsWith('+521')) {
number = number.replace('+521', '+52'); // Cambiar +521 a +52
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52'); // Cambiar +52 1 a +52
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)
} catch (error) {
return false
}}

/*
async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}*/
