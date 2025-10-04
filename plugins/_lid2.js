let handler = async (m, { conn, args, usedPrefix, command }) => {
  let number;
  
  if (m.quoted?.sender) {
    number = m.quoted.sender;
  } 

  else if (m.mentionedJid?.length) {
    number = m.mentionedJid[0];
  } 

  else if (args[0]) {
    let raw = args[0].replace(/[^0-9]/g, '');
    if (raw.length < 8) {
      return conn.reply(m.chat, `☠️ 𝙀𝙧𝙧𝙤𝙧, 𝙥𝙤𝙧𝙦𝙪𝙚 𝙢𝙚 𝙟𝙪𝙚𝙜𝙖𝙨 𝙖 𝙙𝙖𝙧 𝙪𝙣 𝙣𝙪𝙢𝙚𝙧𝙤 𝙦𝙪𝙚 𝙣𝙞 𝙚𝙭𝙞𝙨𝙩𝙚?...`, m, fake);
    }
    number = raw + '@s.whatsapp.net';
  } 
  else {
    return conn.reply(m.chat, `☠️ 𝙐𝙨𝙖 𝙗𝙞𝙚𝙣 𝙢𝙞 𝙟𝙪𝙚𝙜𝙤, 𝙞𝙣𝙨𝙚𝙧𝙫𝙞𝙡...  

┌─「 *𝙀𝙟𝙚𝙢𝙥𝙡𝙤* 」
├ ${usedPrefix + command} +50248019799
├ ${usedPrefix + command} @usuario
└ 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖 𝙪𝙣 𝙢𝙚𝙣𝙨𝙖𝙟𝙚`, m);
  }

  try {
    let [user] = await conn.onWhatsApp(number);

    if (!user?.lid) {
      return conn.reply(m.chat, '☠️ 𝙀𝙨𝙩𝙚 𝙣𝙪𝙢𝙚𝙧𝙤 𝙣𝙞 𝙨𝙞𝙦𝙪𝙞𝙚𝙧𝙖 𝙚𝙨 𝙙𝙞𝙜𝙣𝙤 𝙙𝙚 𝙩𝙚𝙣𝙚𝙧 𝙪𝙣 𝙇𝙄𝘿... 𝙡𝙖𝙨𝙩𝙞𝙢𝙖.', m);
    }

    let name = await conn.getName(user.jid);

    let texto = `☠️ *「 𝙆𝙄𝙍𝘼 𝙎𝘼𝘾𝙊 𝙏𝙐 𝙋𝙀𝙍𝙁𝙄𝙇 」* ☠️  

✦ 𝙉𝙤𝙢𝙗𝙧𝙚: ${name || '𝙉𝙞 𝙨𝙚 𝙙𝙞𝙜𝙣𝙖 𝙖 𝙩𝙚𝙣𝙚𝙧 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚'}
✦ 𝙉𝙪𝙢𝙚𝙧𝙤: wa.me/${user.jid.replace(/[^0-9]/g, '')}
✦ 𝙇𝙄𝘿: ${user.lid}

✰ 𝘼𝙘𝙩𝙖 𝙘𝙤𝙢𝙤 𝙨𝙞 𝙣𝙖𝙙𝙖, 𝙥𝙚𝙧𝙤 𝙮𝙖 𝙩𝙚 𝙩𝙚𝙣𝙜𝙤 𝙚𝙣 𝙢𝙞 𝙡𝙞𝙨𝙩𝙖...`;

    conn.reply(m.chat, texto, m, fake);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '☠️ 𝙀𝙧𝙧𝙤𝙧 𝙞𝙣𝙚𝙨𝙥𝙚𝙧𝙖𝙙𝙤... 𝙥𝙚𝙧𝙤 𝙖𝙪𝙣 𝙖𝙨𝙞, 𝙩𝙪 𝙙𝙚𝙨𝙩𝙞𝙣𝙤 𝙚𝙨 𝙚𝙨𝙩𝙖𝙧 𝙖𝙣𝙤𝙩𝙖𝙙𝙤 𝙚𝙣 𝙢𝙞 𝙡𝙞𝙗𝙧𝙤...', m);
  }
};

handler.command = ['lid2'];
handler.help = ['lid2'];
handler.tags = ['tools'];

export default handler;
