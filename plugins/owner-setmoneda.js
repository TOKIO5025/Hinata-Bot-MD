import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { text }) => {
    if (!text) throw '❌ Debes proporcionar un nombre para la moneda.';

    const data = JSON.parse(fs.readFileSync(filePath));

    // Validar si existe el campo global
    if (!data.global) data.global = { botName: null, currency: null, videos: [] };

    // Actualizar la moneda global
    data.global.currency = text;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    m.reply(`✅ Moneda global actualizada a: *${text}*`);
};

handler.help = ['setmoneda <nombre de la moneda>'];
handler.tags = ['config'];
handler.command = /^setmoneda$/i;
handler.owner = true; // Solo el owner puede usar este comando
export default handler;