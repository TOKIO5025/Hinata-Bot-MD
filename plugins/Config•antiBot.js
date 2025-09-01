export async function before(m, { participants, conn }) {
  if (m.isGroup) {
    let chat = global.db.data.chats[m.chat];

    if (!chat.antiBot2) {
      return
    }

    let botJid = global.conn.user.jid 

    if (botJid === conn.user.jid) {
      return
    } else {
      let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id))

      if (isBotPresent) {
        setTimeout(async () => {
          await conn.reply(m.chat, `Cativo`, m)

        }, 5000) 
      }
    }
  }
}
