import axios from 'axios';
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys"))["default"];

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `💋 *¿Y qué querés que busque si no pones nada, bebé?*\nEscribe algo, no soy adivina 😒\n\n📌 *Ejemplo:* \`${usedPrefix + command} anime aesthetic\``, m);
  }

  let query = text + ' hd';
  await m.react("💅");
  conn.reply(m.chat, '🖤 *Cierra el pico un rato...* estoy buscando tus imágenes 🔍✨', m);

  try {
    let { data } = await axios.get(`https://anime-xi-wheat.vercel.app/api/pinterest?q=chicos+gays+xxx+-18${encodeURIComponent(query)}`);
    let images = data.slice(0, 6).map(item => item.image_large_url);

    if (!images.length) throw 'No encontré nada, mi rey. Busca mejor.';

    let cards = [];
    let count = 1;

    for (let url of images) {
      const { imageMessage } = await generateWAMessageContent({ image: { url } }, { upload: conn.waUploadToServer });
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: `🖼️ Imagen sexy #${count++}` }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "🌸 Pinterest HD" }),
        header: proto.Message.InteractiveMessage.Header.fromObject({ title: '', hasMediaAttachment: true, imageMessage }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [{
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "✨ Ver en Pinterest",
              Url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
              merchant_url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`
            })
          }]
        })
      });
    }

    const messageContent = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({ text: `📂 *Resultados bien coquetos de:* ${query}` }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: "🔞 Pinterest HD - Powered by Hinata-Bot 💋" }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
          })
        }
      }
    }, { quoted: m });

    await m.react("✅");
    await conn.relayMessage(m.chat, messageContent.message, { messageId: messageContent.key.id });

  } catch (err) {
    console.error(err);
    return conn.reply(m.chat, "😒 Algo salió mal, reina... ni modo. Intenta con otra cosa.", m);
  }
};

handler.help = ["pinterest"];
handler.tags = ["descargas"];
handler.command = ['pinterest', 'pin'];

export default handler;
