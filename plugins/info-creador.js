import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    await m.react('🎩');

    // Contacto del Creador
    let vcardCreador = `BEGIN:VCARD
VERSION:3.0
FN:🐉 NeoTokyo Beats
TEL;waid=573142495895:573142495895
END:VCARD`;

    // Contacto del Staff
    let vcardStaff = `BEGIN:VCARD
VERSION:3.0
FN:📞 Staff David
TEL;waid=522219831926:522219831926
END:VCARD`;

    // Enviar cada contacto en mensaje separado
    await conn.sendMessage(m.chat, { contacts: { displayName: "🐉 NeoTokyo Beats", contacts: [{ vcard: vcardCreador }] } }, { quoted: m });
    await conn.sendMessage(m.chat, { contacts: { displayName: "📞 Staff David", contacts: [{ vcard: vcardStaff }] } }, { quoted: m });
};

handler.help = ['owner', 'creator', 'creador', 'dueño'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño)$/i;

export default handler;
