const audios = [
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/en%20donde%20estas%20misa.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/en%20donde%20estas%20misaa.mp3',
  'https://files.cloudkuimages.guru/audios/fuLSWe1T.mp3',
  'https://files.cloudkuimages.guru/audios/snoK1XUl.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/en%20donde%20estas%20misada.mp3'
];

const handler = async (m, { conn, text }) => {
  const randomAudio = audios[Math.floor(Math.random() * audios.length)];

  await conn.sendMessage(m.chat, {
    audio: { url: randomAudio },
    mimetype: 'audio/mpeg',
    ptt: true,
  }, { quoted: m });
};

// Comandos sin prefijo
handler.customPrefix = /^(en donde estas misa|takada)$/i;
handler.command = new RegExp;

export default handler;
