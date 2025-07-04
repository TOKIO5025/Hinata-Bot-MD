import axios from 'axios';
import fs from 'fs';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    // Si no hay argumento, responde con ejemplo
    return m.reply(`ℹ️ Usa el comando correctamente:\n\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/1lthxq.mp4`);
  }

  try {
    const url = text;

    const res = await axios.head(url);
    const tipo = res.headers['content-type'];

    if (tipo.includes('video') || url.endsWith('.mp4')) {
      m.reply('⬇️ Descargando el video...');

      let nombre = `video_${Date.now()}.mp4`;
      const buffer = await (await fetch(url)).buffer();

      // Crea carpeta temporal si no existe
      fs.mkdirSync('./tmp', { recursive: true });
      fs.writeFileSync(`./tmp/${nombre}`, buffer);

      await conn.sendFile(m.chat, `./tmp/${nombre}`, nombre, `🎬 Video descargado con éxito\n🔥 Reacciones: 👍💯😎`, m);
      fs.unlinkSync(`./tmp/${nombre}`);
    } else {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const titulo = $('title').text() || 'Sin título';
      const textoPlano = $('body').text().slice(0, 500);

      await m.reply(`🌐 Título del sitio: ${titulo}\n\n📝 Fragmento:\n${textoPlano.trim()}...\n\n👍🔥`);
    }
  } catch (e) {
    console.error(e);
    m.reply('❌ Error al procesar el link. ¿Está bien escrito?');
  }
};

handler.help = ['getsit <url>'];
handler.tags = ['tools', 'downloader'];
handler.command = /^getsit$/i;

export default handler;
