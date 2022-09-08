import Links from "@services/links";

import { bot } from "@commands";

import { Message } from "node-telegram-bot-api";

export default async function list(msg: Message) {
  const chatId = msg.chat.id;

  const list = await Links.list();

  const text = list.map((item) => `[${item.get("name")}](${item.get("link")})`);

  const buttons = list.map((item) => ({
    text: item.get("id"),
    callback_data: `/info ${item.get("id")}`
  }));

  return bot.sendMessage(
    chatId,
    `*Информация о всех отслеживаемых ссылках*\n\n${text.join("\n\n")}`,
    {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [...buttons]
        ]
      }
    }
  );
}
