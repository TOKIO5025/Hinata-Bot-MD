let handler = async (m, { conn, participants, args, isAdmin }) => {
  if (!isAdmin) return m.reply('❌ ¡Oye, solo mis admins pueden usar esto, no te hagas! 😼');

  // Obtener todos los usuarios menos el bot
  let users = participants.map(u => u.id).filter(v => v !== conn.user.jid);

  if (m.quoted) {
    // Si responde a un mensaje, reenviar con mención y texto coqueto
    await conn.sendMessage(m.chat, {
      forward: m.quoted.fakeObj || m.quoted,
      mentions: users,
      caption: '🔥 Aquí va la manada completa, ¡prepárense! 😈🍑',
    }, { quoted: m });
  } else {
    if (args.length === 0) return m.reply('❗️ ¡No seas tímido/a! Escribe algo para que te mencione, o responde a un mensaje, pendejito/a. 😏');

    let text = args.join(' ');
    let textosCoquetos = [
      'Ey, mira quién manda aquí... ¡yo! 🐉🔥',
      'Te traje a todos, no te hagas el/la loco/a 😈🍑',
      'Si te pica, es porque les gusto, ¡acepta! 😼💦',
      '¡A mover esas nalguitas que los estoy mencionando! 🍑😜',
      'Papi/mami, la fiesta no empieza sin ustedes 🔥🔥',
      'Ya llegó tu diosa Hinata, para que tiemblen los valientes 😈💥'
    ];
    // Elegir uno al azar para darle flow
    let textoCoqueto = textosCoquetos[Math.floor(Math.random() * textosCoquetos.length)];

    await conn.sendMessage(m.chat, {
      text: `${text}\n\n${textoCoqueto}`,
      mentions: users
    }, { quoted: m });
  }
};

handler.help = ['tag <texto> (responder a mensaje también)'];
handler.tags = ['grupo'];
handler.command = /^(totag|tag|n)$/i;

handler.admin = true;
handler.group = true;

export default handler;
