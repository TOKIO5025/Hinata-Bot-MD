import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';
const haremFilePath = './src/database/harem.json';

const cooldowns = {};

// 👉 Aquí pones el número que tendrá rw infinitos (formato WhatsApp ID)
const premiumUser = "573142495895@s.whatsapp.net"; 

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('💋 No pude cargar la base de waifus, mi amor.');
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('💅 No pude guardar las waifus, drama detected.');
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('💔 No pude guardar tu harem, qué horror.');
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const now = Date.now();

    // ⏳ Solo aplica cooldown si NO es el número premium
    if (userId !== premiumUser) {
        if (cooldowns[userId] && now < cooldowns[userId]) {
            const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            return await conn.reply(
                m.chat,
                `💅 Relájate corazón, aún debes esperar *${minutes}m ${seconds}s* para otro rollito sensual. #rw`,
                m
            );
        }
    }

    try {
        const characters = await loadCharacters();
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)];

        const harem = await loadHarem();
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id);
        const isClaimed = !!randomCharacter.user;

        const status = isClaimed
            ? `💍 *Reclamado* por @${randomCharacter.user.split('@')[0]}`
            : '✨ *Disponible para el pecado* 😈';

        const message = `
💘 *¡Tiraste gacha, zorrito salvaje!*
────────────────────────
🍒 *Nombre:* ${randomCharacter.name}
💖 *Género:* ${randomCharacter.gender}
💎 *Valor:* ${randomCharacter.value}
🔐 *Estado:* ${status}
🌸 *Fuente:* ${randomCharacter.source}
🧬 *ID:* ${randomCharacter.id}
────────────────────────
*¡Cítala con #c si la quieres para ti, guapx!*`;

        const mentions = isClaimed ? [randomCharacter.user] : [];
        await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message.trim(), m, {
            mentions
        });

        // ⏳ Solo guarda cooldown si NO es premium
        if (userId !== premiumUser) {
            cooldowns[userId] = now + 15 * 60 * 1000;
        }

    } catch (error) {
        await conn.reply(m.chat, `🚨 Algo falló, drama incoming: ${error.message}`, m);
    }
};

handler.help = ['ver', 'rw', 'rollwaifu'];
handler.tags = ['gacha'];
handler.command = ['ver', 'rw', 'rollwaifu'];
handler.group = true;

export default handler;
