import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `🌺 *¿Y el link, amorcito?*\n\nNo seas tímido, pásame ese TikTok delicioso:\n${usedPrefix + command} https://www.tiktok.com/@user/video/1234567890`, m);
    }

    try {
        await conn.reply(m.chat, `😈 *Espérame, bebé... estoy sacándote el video con mis manitas calientes.*`, m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, "💔 *Hinata no encontró nada con ese link. ¿Seguro que me lo diste bien, travieso?*", m);
        }

        const data = tiktokData.data;
        const videoURL = data.play;

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `╭━━〔 🍑 *TikTok Calientito Descargado* 〕━━⬣  
📌 *Nombre del pecadito:* ${data.title || 'Sin descripción, pero igual se disfruta~'}

💖 *Likes:* ${data.digg_count || 0} 😏
💬 *Comentarios:* ${data.comment_count || 0} 😮‍💨  
👀 *Vistas:* ${data.play_count || 0} 🔥
🔁 *Compartido:* ${data.share_count || 0} 💦
⏱️ *Duración:* ${data.duration || 'Desconocida'} seg
🖼️ *Calidad:* ${videoURL.includes('hd') ? 'HD bien rico 🎞️' : 'Estándar pero sabroso 📺'}

╰─〔 💋 *Disfrútalo como sabes hacerlo...* 〕⬣`, m);
        } else {
            return conn.reply(m.chat, "🥺 *No pude bajarlo, mi cielo... intenta más tarde.*", m);
        }
    } catch (error1) {
        return conn.reply(m.chat, `😿 *Ocurrió un error mientras lo bajaba, mi amor:*\n\n${error1.message}`, m);
    }
};

handler.help = ['tiktok *<link>*'];
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}
