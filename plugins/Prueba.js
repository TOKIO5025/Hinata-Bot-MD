let handler = async (m) => {
    m.reply("📺 Aquí está tu enlace del canal: https://youtube.com/@MiCanal");
}

handler.command = /^prueba$/i
handler.register = true // 🔹 Esto obliga a estar registrado
export default handler
