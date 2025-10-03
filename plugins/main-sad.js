const audios = [
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad1.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad2.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad3.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad4.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad5.mp3',
  'https://raw.githubusercontent.com/TOKIO5025/Audios/main/sad6.mp3'
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
handler.customPrefix = /^(sad|triste)$/i;
handler.command = new RegExp;

export default handler;
