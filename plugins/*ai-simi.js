import translate from '@vitalets/google-translate-api';
import axios from 'axios';

const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `💬 *Hinata dice:* ¿Y qué quieres que diga si no me escribes nada, baboso?`, m);

  try {
    const resSimi = await simitalk(text);
    if (resSimi.status) {
      conn.sendMessage(m.chat, { text: `🍑 *Simi dice:* ${resSimi.resultado.simsimi}` }, { quoted: m });
    } else {
      conn.reply(m.chat, `💢 *Simi se enojó:* ${resSimi.resultado.msg}`, m);
    }
  } catch (e) {
    conn.reply(m.chat, `❌ *Simi se cayó:* Error al responder... vuelve más tarde, cachondo.`, m);
  }
};

handler.help = ['simi'];
handler.tags = ['fun'];
handler.group = true;
handler.register = true;
handler.command = ['simi', 'Simi'];

export default handler;

async function simitalk(ask, apikey = "iJ6FxuA9vxlvz5cKQCt3", language = "es") {
  if (!ask) return { status: false, resultado: { msg: "Escribe algo para que Simi te conteste, tontito." }};

  try {
    const response1 = await axios.get(`https://delirius-apiofc.vercel.app/tools/simi?text=${encodeURIComponent(ask)}`);
    let trad1 = await translate(`${response1.data.data.message}`, { to: language, autoCorrect: true });
    if (trad1.text.toLowerCase() === 'indefinida' || !response1.data) throw 'respuesta inválida';
    return { status: true, resultado: { simsimi: trad1.text }};
  } catch {
    try {
      const response2 = await axios.get(`https://anbusec.xyz/api/v1/simitalk?apikey=${apikey}&ask=${encodeURIComponent(ask)}&lc=${language}`);
      return { status: true, resultado: { simsimi: response2.data.message }};
    } catch (error2) {
      return { status: false, resultado: { msg: "Todas las API's fallaron. Simi está con la regla 💀", error: error2.message }};
    }
  }
    }
