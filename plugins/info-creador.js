import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    await m.react('🎩');

    let username = await conn.getName(m.sender);

    // Lista de contactos (Creador y Asistencia)
    let list = [
        {
            displayName: "🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 (Creador)",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲
item1.TEL;waid=573142495895:573142495895
item1.X-ABLabel:Creador
item2.EMAIL;type=INTERNET:youremail@example.com
item2.X-ABLabel:Email
item3.URL:https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A
item3.X-ABLabel:Canal
item4.ADR:;;Guatemala;;;;
item4.X-ABLabel:Región
END:VCARD`,
        },
        {
            displayName: "📞 Staff David (Asistencia)",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:📞 Staff David
item1.TEL;waid=522219831926:522219831926
item1.X-ABLabel:Asistencia de la Bot
END:VCARD`,
        }
    ];

    // Enviar los contactos
    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contactos`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: '✨ Contacta a mi creador o al staff ✨',
                body: '🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 & 📞 Staff David',
                thumbnailUrl: 'https://cdnmega.vercel.app/media/c4hhgZgD@fGOHhRAM1CD-3_cpAQk-Q86yQnQLGHYKZ1M0P_heI9s',
                sourceUrl: 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    // Mensaje personalizado
    let txt = `👋 Hola, *@${m.sender.split('@')[0]}* ✨

Aquí tienes los contactos:
- 🐉 *Creador:* NeoTokyo Beats → wa.me/573142495895  
- 📞 *Asistencia:* Staff David → wa.me/522219831926`;

    let buttons = [
        { urlButton: { displayText: '🌟 Seguir mi canal', url: 'https://whatsapp.com/channel/0029Vaqe1Iv65yDAKBYr6z0A' } },
        { quickReplyButton: { displayText: '❌ Cerrar', id: 'close' } }
    ];

    await conn.sendMessage(m.chat, {
        text: txt,
        footer: '🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲',
        buttons: buttons,
        headerType: 1,
        mentions: [m.sender]
    }, { quoted: m });
};

handler.help = ['owner', 'creator', 'creador', 'dueño'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño)$/i;

export default handler;
