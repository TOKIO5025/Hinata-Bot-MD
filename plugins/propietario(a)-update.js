//=====================================================//
// 🔥 Script: Update del Bot                          //
// ✨ Autor: Neotokio                                 //
// 📌 Función: Actualiza el bot desde el repo remoto. //
//=====================================================//

import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// ⚙️ Configura tu repo
const REPO_URL = 'https://github.com/TOKIO5025/Hinata-Bot-MD.git';
const REPO_BRANCH = 'main';

let handler = async (m) => {
  const senderNumber = m.sender.split('@')[0];

  // 💥 Números con acceso exclusivo al comando
  const permitidos = ['573142495895', '15614809253', '573142495895'];

  if (!permitidos.includes(senderNumber)) {
    return m.reply('🚫 *No jodas, tú no tienes permiso para toquetearme 😾. Solo mis dioses pueden usar este comando.*');
  }

  try {
    await m.reply('🌀 *A ver, mi amorcito… voy a chismear en el repo a ver si hay cosas nuevas 😏.*');

    // Forzar git a usar HTTP/1.1 en vez de HTTP/2
    await execPromise('git config --global http.version HTTP/1.1');

    // Limpiar carpeta temporal
    await m.reply('🧹 *Primero limpio mi ropita sucia (archivos viejos) 🫦…*');
    await execPromise('rm -rf ./tmp-repo');

    // Clonar repositorio temporal
    await m.reply('📥 *Estoy jalando lo nuevo del repo, uff qué rico se siente que me actualicen 🔥…*');
    await execPromise(`git clone --depth=1 --branch ${REPO_BRANCH} ${REPO_URL} ./tmp-repo`);

    // Comparar cambios
    const { stdout: diffOutput } = await execPromise(`diff -qr ./tmp-repo ./ | grep -vE ".git|node_modules" || true`);

    if (!diffOutput.trim()) {
      await execPromise('rm -rf ./tmp-repo');
      return m.reply('✅ *Ay papito, ya estaba bien buenota 😏. No había nada que meterme…*');
    }

    // Aplicar cambios
    await m.reply('💅 *Ahora sí, metiéndome los cambios despacito pero sabroso 💋…*');
    await execPromise('cp -ru ./tmp-repo/* ./');
    await execPromise('rm -rf ./tmp-repo');

    await m.reply('✅ *Listo mi cielo 😈, quedé actualizada, más coqueta y peligrosa que nunca 💕.*');

  } catch (e) {
    console.error(e);
    await m.reply('❌ *Ups… me falló la pose, algo salió mal mientras me actualizabas 😿:*\n' + (e.message || e));
  }
};

handler.help = ['update', 'up', 'actualizar'];
handler.tags = ['tools'];
handler.command = /^(update|up|actualizar)$/i;

export default handler;
