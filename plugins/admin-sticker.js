let handler = async (m, { conn, usedPrefix, command, args }) => {
    const chat = global.db.data.chats[m.chat] || {};
    const setting = args[0]?.toLowerCase();

    if (!m.isGroup) return m.reply('❌ Wacho, esto solo funciona en grupos, ¿ya pues? 😎');

    if (!setting) return m.reply(`✳️ Vos, usa así: *${usedPrefix + command} antisticker*, no hagás cagada`);

    if (setting !== 'antisticker') {
        return m.reply(`⚠️ Eh vos, eso no sirve 😒 Solo podés usar: *antisticker*`);
    }

    // --- CHEQUEO DE ADMIN DEL BOT ---
    const groupMeta = await conn.groupMetadata(m.chat);
    const botParticipant = groupMeta?.participants?.find(p => p.id === conn.user.jid);
    const botIsAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

    if (!botIsAdmin) return m.reply('❌ Chito, necesito ser admin en el grupo para poder activar el antisticker 😏');

    // --- ACTIVAR / DESACTIVAR ---
    const action = command === 'activar';
    chat.antisticker = action;
    global.db.data.chats[m.chat] = chat;

    m.reply(`✅ Listo pues, el *antisticker* ha sido ${action ? '🔥 ACTIVADO 🔥' : '💀 DESACTIVADO 💀'} correctamente. ¡A darle pues, wacho! 😎`);
};

handler.help = ['activar antisticker', 'desactivar antisticker'];
handler.tags = ['group', 'config'];
handler.command = ['activar', 'desactivar'];
handler.admin = true;  // Usuario debe ser admin
handler.group = true;

export default handler;
