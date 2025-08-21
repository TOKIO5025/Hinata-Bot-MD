const handler = async (m, { conn }) => {
  const audios = [
    'https://files.cloudkuimages.guru/videos/vYq79D4X.mp4', // Primer audio
    'https://files.cloudkuimages.guru/videos/vYq79D4X.mp4', // Segundo audio
    'https://files.cloudkuimages.guru/videos/vYq79D4X.mp4'  // Tercer audio (puedes cambiarlo)
  ];

  const randomAudio = audios[Math.floor(Math.random() * audios.length)];

  await conn.sendMessage(m.chat, {
    audio: { url: randomAudio },
    mimetype: 'audio/mpeg',
    ptt: true,
  }, { quoted: m });
};

// Sin prefijo
handler.customPrefix = /^(nico nico ni)$/i;
handler.command = new RegExp;

export default handler;
