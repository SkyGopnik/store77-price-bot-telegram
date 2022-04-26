import Links from "@services/links";

import { bot } from "@commands";

import { Message } from "node-telegram-bot-api";

export default async function list(msg: Message) {
  const chatId = msg.chat.id;

  const list = await Links.list();

  const text = list.map((item) => `[${item.get("name")}](${item.get("link")}) _(ID - ${item.get("id")})_`);

  return bot.sendMessage(
    chatId,
    `*Информация о всех отслеживаемых ссылках*\n\n${text.join("\n")}`,
    {
      parse_mode: 'Markdown'
    }
  );
}
