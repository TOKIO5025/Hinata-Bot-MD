let handler = async (m, { conn, args, usedPrefix, command }) => {
  let number;
  
  if (m.quoted?.sender) {
    number = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    number = m.mentionedJid[0];
  } else if (args[0]) {
    let raw = args[0].replace(/[^0-9]/g, '');
    if (raw.length < 8) {
      return conn.reply(m.chat, `☠️ Error, número inválido.`, m);
    }
    number = raw + '@s.whatsapp.net';
  } else {
    return conn.reply(m.chat, `☠️ Usa bien el comando...  

┌─「 *Ejemplo* 」
├ ${usedPrefix + command} +50248019799
├ ${usedPrefix + command} @usuario
└ Responde a un mensaje`, m);
  }

  try {
    let [user] = await conn.onWhatsApp(number);

    if (!user || !user.exists) {
      return conn.reply(m.chat, '☠️ Este número ni existe en WhatsApp.', m);
    }

    let name = await conn.getName(user.jid);

    let texto = `☠️ *「 KIRA SACÓ TU PERFIL 」* ☠️  

✦ Nombre: ${name || 'Sin nombre'}
✦ Número: wa.me/${user.jid.replace(/[^0-9]/g, '')}
✦ JID: ${user.jid}

✰ Acta como si nada, pero ya te tengo en mi lista...`;

    conn.reply(m.chat, texto, m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '☠️ Error inesperado...', m);
  }
};

handler.command = ['lid2'];
handler.help = ['lid2'];
handler.tags = ['tools'];

export default handler;
