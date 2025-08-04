import axios from "axios"

let handler = async (m, { conn, text }) => {
  if (!text) throw '✨ ¿Y qué quieres que le pregunte al diablito de la IA, bebé? Escribe algo...';

  try {
    await m.react?.('🤖');
    let respuesta = await chatGpt(text);
    await conn.sendMessage(m.chat, {
      text: `*💬 Respuesta AI:*\n${respuesta}\n\n🧠 _Desarrollado por 🐉𝙉𝙚𝙤𝙏𝙤𝙆𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 & light Yagami_`,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply('💥 Ocurrió un error, mi cielo:\n' + err);
  }
};

handler.help = ['demo *<texto>*'];
handler.command = ['demo', 'openai'];
handler.tags = ['ai'];
handler.group = true;

export default handler;

async function chatGpt(query) {
  try {
    const createChat = await axios.post(
      "https://chat.chatgptdemo.net/new_chat",
      { user_id: "crqryjoto2h3nlzsg" },
      { headers: { "Content-Type": "application/json" } }
    );

    const id_ = createChat?.data?.id_;
    if (!id_) throw 'ID de sesión no recibido.';

    const payload = {
      question: query,
      chat_id: id_,
      timestamp: Date.now(),
    };

    const res = await axios.post(
      "https://chat.chatgptdemo.net/chat_api_stream",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const chunks = res.data.split("data: ").filter(Boolean);
    const parsed = chunks.map(chunk => JSON.parse(chunk.trim()));
    const respuesta = parsed.map(item => item.choices?.[0]?.delta?.content || "").join("");

    return respuesta || '🤷‍♀️ No entendí nada, ¿me repites, mi amor?';

  } catch (error) {
    console.error("Error al procesar la respuesta:", error);
    return '🚫 Error al contactar con la IA.';
  }
}
