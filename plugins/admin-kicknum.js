const handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin }) => {
  if (!args[0]) return m.reply(`*⚠️ Ingresa el prefijo del país, Ejemplo:* ${usedPrefix + command} +52`);
  if (isNaN(args[0])) return m.reply(`*⚠️ El prefijo debe ser un número válido, Ejemplo:* ${usedPrefix + command} +52`);

  const prefijo = args[0].replace(/[+]/g, '');
  const encontrados = participants.map(u => u.id).filter(v => v !== conn.user.jid && v.startsWith(prefijo));
  const numeros = encontrados.map(v => '⭔ @' + v.replace(/@.+/, ''));
  if (!encontrados.length) return m.reply(`*📵 No hay ningún número con prefijo +${prefijo} en este grupo.*`);

  switch (command) {
    case 'listanum':
    case 'listnum':
      return conn.reply(m.chat, `*📋 Números encontrados con prefijo +${prefijo}:*\n\n${numeros.join('\n')}`, m, { mentions: encontrados });

    case 'kicknum':
      if (!isBotAdmin) return m.reply('*⚠️ El bot no es administrador, no puedo eliminar usuarios.*');

      await conn.sendMessage(m.chat, {
        text: `🧹✨ *Limpiando números raros...*\n\nEliminando a los que tienen el prefijo +${prefijo} 😈\n\nPreparen las maletas, ratas...`,
        mentions: encontrados
      }, { quoted: m });

      await conn.sendMessage(m.chat, {
        audio: { url: 'https://d.uguu.se/rgTLuPzu.opus' },
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
      }, { quoted: m });

      const ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net';
      for (const user of encontrados) {
        const error = `@${user.split('@')[0]} ya fue eliminado o abandonó el grupo.`;
        const protegido = [ownerGroup, conn.user.jid, global.owner + '@s.whatsapp.net'];

        if (!protegido.includes(user)) {
          try {
            const r = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            if (r[0]?.status === '404') await m.reply(error, m.chat, { mentions: [user] });
          } catch (e) {
            await m.reply(`⚠️ No se pudo eliminar a @${user.split('@')[0]}`, m.chat, { mentions: [user] });
          }
          await delay(10000);
        }
      }

      return m.reply('*✅ Proceso de limpieza finalizado. Grupo libre de números sospechosos 🧼*');
  }
};

handler.help = ['kicknum', 'listnum'];
handler.tags = ['group'];
handler.command = /^(kicknum|listanum|listnum)$/i;
handler.group = handler.botAdmin = handler.admin = true;
export default handler;

const delay = ms => new Promise(res => setTimeout(res, ms));
