import Links from "@services/links";

import { bot } from "@commands";

import { Message } from "node-telegram-bot-api";

export default async function remove(msg: Message, match: RegExpMatchArray | null) {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const id = +match[1];

  await Links.remove(id);

  return bot.sendMessage(chatId, `Мы удалили ссылку с ID - ${id}`);
}
