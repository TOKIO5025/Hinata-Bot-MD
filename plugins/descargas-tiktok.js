import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `🌾 Por favor, ingresa un enlace de TikTok.`, m, fake);
    }

    try {
        await conn.reply(m.chat, `*🌳 Espere un momento, estoy descargando su video...*`, m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, "❌ Error: No se pudo obtener el video.", m);
        }

        const data = tiktokData.data;
        const videoURL = data.play;

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `╭━━〔 *📥 TikTok Downloader* 〕━━⬣  
📌 *Título:* ${data.title || 'Sin descripción'}

💖 *Likes:* ${data.digg_count || 0}
💬 *Comentarios:* ${data.comment_count || 0}  
👀 *Vistas:* ${data.play_count || 0}
🔁 *Compartido:* ${data.share_count || 0}
⏱️ *Duración:* ${data.duration || 'Desconocida'} seg
🖼️ *Calidad:* ${videoURL.includes('hd') ? 'HD 🎞️' : 'Estándar 📺'}

╰─〔 🌪️ 𝙀𝙣𝙟𝙤𝙮 𝙮𝙤𝙪𝙧 𝙫𝙞𝙙𝙚𝙤! 🎬 〕⬣`, m);
        } else {
            return conn.reply(m.chat, "❌ No se pudo descargar.", m);
        }
    } catch (error1) {
        return conn.reply(m.chat, `❌ Error: ${error1.message}`, m);
    }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
//handler.group = true;
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}
