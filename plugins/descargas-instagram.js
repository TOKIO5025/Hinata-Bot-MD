import axios from 'axios';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '💅✨ A ver, mi ciela… ¿y el link de Instagram? No soy adivina. 😏', m);
  }

  const instagramUrl = args[0];
  let res;

  try {
    await m.react('💃');
    res = await axios.get(`https://api.dorratz.com/igdl?url=${encodeURIComponent(instagramUrl)}`);
  } catch (e) {
    return conn.reply(m.chat, '💅 Error al jalar el chisme de Instagram… revisa el link, mija. 🙄', m);
  }

  const result = res.data;

  if (!result || !result.data || result.data.length === 0) {
    return conn.reply(m.chat, '🙄 No encontré nada… seguro me diste un link feo.', m);
  }

  const media = result.data[0].url;
  const type = result.data[0].type || 'video';

  if (!media) {
    return conn.reply(m.chat, '🚫 Ese post está más vacío que tu ex cuando decía “te amo” 💔.', m);
  }

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (type.includes('video')) {
        await conn.sendMessage(m.chat, { 
          video: { url: media }, 
          caption: `💅 *Toma, reina:* tu video de Instagram está más HD que tus fotos con filtro. 📹\n\n💖 *Chismecito descargado con amor* 💖`, 
          fileName: 'instagram.mp4', 
          mimetype: 'video/mp4' 
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { 
          image: { url: media }, 
          caption: `💅 *Aquí tienes, diva:* tu foto lista para presumir.\n\n📸 *Descargado sin censura* 😈` 
        }, { quoted: m });
      }
      await m.react('✅');
      break;
    } catch (e) {
      if (attempt === maxRetries) {
        await m.react('❌');
        return conn.reply(m.chat, '💅 Ni con milagro pude mandarte eso, mija. 😤', m);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

handler.help = ['instagram', 'insta'];
handler.tags = ['descargas'];
handler.command = /^(instagram|insta|ig|igdl)$/i;
handler.register = true;

export default handler;
