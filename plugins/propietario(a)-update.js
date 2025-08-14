import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// ⚙️ Configura tu repo
const REPO_URL = 'https://github.com/TOKIO5025/Hinata-Bot-MD.git';
const REPO_BRANCH = 'main';

let handler = async (m) => {
  const senderNumber = m.sender.split('@')[0];

  // 💥 Números con acceso exclusivo al comando
  const permitidos = ['50248019799', '15614809253', '573001533523', '573142495895'];

  if (!permitidos.includes(senderNumber)) {
    return m.reply('🚫 *¡Tú no tienes acceso a esta magia prohibida, mi cielito! 😾 Solo mis dioses pueden usar esto.*');
  }

  try {
    await m.reply('🌀 *Revisando si hay chismes nuevos en el repo... espera sabrosón(a)*');

    // Limpiar carpeta temporal
    await execPromise('rm -rf ./tmp-repo');

    // Clonar repositorio temporal
    await execPromise(`git clone --depth=1 --branch ${REPO_BRANCH} ${REPO_URL} ./tmp-repo`);

    // Comparar cambios
    const { stdout: diffOutput } = await execPromise(`diff -qr ./tmp-repo ./ | grep -vE ".git|node_modules" || true`);

    if (!diffOutput.trim()) {
      await execPromise('rm -rf ./tmp-repo');
      return m.reply('✅ *Ya estaba bien buenote el bot, no había nada que actualizar 😎.*');
    }

    // Aplicar cambios
    await execPromise('cp -ru ./tmp-repo/* ./');
    await execPromise('rm -rf ./tmp-repo');

    await m.reply('✅ *Listo bebé, tu bot quedó actualizado y más rico que nunca 💋.*');

  } catch (e) {
    console.error(e);
    await m.reply('❌ *Oops... algo salió mal mientras te ponía al día el bot 😿:*\n' + (e.message || e));
  }
};

handler.help = ['update'];
handler.tags = ['tools'];
handler.command = /^update$/i;

export default handler;
