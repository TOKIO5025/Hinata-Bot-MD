import { createHash } from 'crypto';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;

let handler = async function (m, { text, conn, command, usedPrefix, args }) {
  let sn = createHash('md5').update(m.sender).digest('hex');
  let nombre = conn.getName(m.sender);
  let user = global.db.data.users[m.sender];
  let edad = user.age;
  const defaultImg = 'https://files.catbox.moe/xr2m6u.jpg';
  const pp = await conn.profilePictureUrl(m.sender, "image").catch(_ => defaultImg);

  // Proceder directamente con el desregistro

  let caption = `
╭━━━[ 𝙳𝙴𝚂𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙴𝚇𝙸𝚃𝙾𝚂𝙾 ]━━━╮

👤 𝙽𝚘𝚖𝚋𝚛𝚎: *${nombre}*
🎂 𝙴𝚍𝚊𝚍: *${edad}* 𝚊ñ𝚘𝚜
🔑 𝚂𝚎𝚛𝚒𝚎: _${sn}_

━━━━━━━━━━━━━━━━━━━━━━
🗑️ 𝚃𝚞𝚜 𝚍𝚊𝚝𝚘𝚜 𝚑𝚊𝚗 𝚜𝚒𝚍𝚘 𝚎𝚕𝚒𝚖𝚒𝚗𝚊𝚍𝚘𝚜 𝚍𝚎 *${conn.getName(conn.user.jid)}*.

⚡ 𝚂𝚒 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚟𝚘𝚕𝚟𝚎𝚛 𝚊 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚛𝚝𝚎, 𝚞𝚜𝚊 𝚎𝚕 𝚌𝚘𝚖𝚊𝚗𝚍𝚘: *${usedPrefix}reg nombre.edad*
╰━━━━━━━━━━━━━━━━━━━━╯
`;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: pp },
      caption,
      contextInfo: {
        externalAdReply: {
          title: `${conn.getName(conn.user.jid)} Sistema`,
          body: `Datos eliminados de la base de datos`,
          thumbnailUrl: pp,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  );

  user.registered = false;
  user.name = '';
  user.age = '';
  user.regTime = 0;
};

handler.help = ['unregister'];
handler.tags = ['main'];
handler.command = /^unreg(ister)?$/i;
handler.register = true;

export default handler;
