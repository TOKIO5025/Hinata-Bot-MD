//=====================================================//
// 🔥 Script: Update + IDs del Bot                     //
// ✨ Autor: Neotokio                                 //
// 📌 Función: Actualiza el bot y muestra IDs/LIDs.  //
//=====================================================//

import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

let handler = async (m, { conn }) => {
  const senderNumber = m.sender.split('@')[0];

  // 💥 Números con acceso exclusivo al comando
  const permitidos = ['573142495895', '50248019799'];

  if (!permitidos.includes(senderNumber)) {
    return m.reply('🚫 *No tienes permiso para usar este comando.*');
  }

  try {
    // ==================== UPDATE ==================== //
    await m.reply('🌀 Actualizando el bot…');

    await execPromise('git config --global http.version HTTP/1.1');
    await execPromise('rm -rf ./tmp-repo');
    await execPromise('git clone --depth=1 --branch main https://github.com/TOKIO5025/Hinata-Bot-MD.git ./tmp-repo');

    const { stdout: diffOutput } = await execPromise(`diff -qr ./tmp-repo ./ | grep -vE ".git|node_modules" || true`);

    if (!diffOutput.trim()) {
      await execPromise('rm -rf ./tmp-repo');
      await m.reply('✅ El bot ya estaba actualizado.');
    } else {
      await execPromise('cp -ru ./tmp-repo/* ./');
      await execPromise('rm -rf ./tmp-repo');
      await m.reply('✅ Bot actualizado correctamente.');
    }

    // ==================== IDs/LIDs ==================== //
    const users = [
      { id: '50248019799@s.whatsapp.net', lid: '236391074132098@lid', number: '+50248019799' },
      { id: '573142495895@s.whatsapp.net', lid: '54649784684755@lid', number: '+573142495895' }
    ];

    let text = users.map((u, index) =>
      `*${index + 1}.*\n` +
      `   🆔️ ID: ${u.id}\n` +
      `   🏷 LID: ${u.lid}\n` +
      `   👤 ${u.number}`
    ).join('\n\n');

    await conn.sendMessage(m.chat, { text }, { quoted: m });

  } catch (e) {
    console.error(e);
    await m.reply('❌ Ocurrió un error al actualizar el bot.\n' + (e.message || e));
  }
};

handler.help = ['update', 'up', 'actualizar', 'ids'];
handler.tags = ['tools', 'main'];
handler.command = /^(update|up|actualizar|ids)$/i;

export default handler;
