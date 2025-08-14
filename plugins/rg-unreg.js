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

  if (!args[0]) {
    let info = `╔════════════════════╗
  ║   ⚠️ *DESREGISTRO* ⚠️   ║
  ╚════════════════════╝

  👤 *Nombre:* ${nombre}
  🎂 *Edad:* ${edad} años
  🔑 *Serie:* ${sn}

  Para confirmar tu desregistro, responde con:
  ${usedPrefix}${command} ${sn}
  `;

    await conn.sendFile(m.chat, pp, 'pp.jpg', info, m);
    return;
  }

  if (args[0] !== sn) throw '❌ *¡Número de serie incorrecto!*\nVerifica tu SN.';

  let caption = `
╔══✦══❖•ೋ° °ೋ•❖══✦══╗
      *DESREGISTRO COMPLETADO*
╚══✦══❖•ೋ° °ೋ•❖══✦══╝

👤 *Usuario:* ${nombre}
🎂 *Edad:* ${edad} años
🔑 *Serie:* _${sn}_

🗑️ Tus datos han sido eliminados del sistema *${conn.getName(conn.user.jid)}*.

⚠️ Si deseas volver a registrarte, usa el comando de registro.
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
