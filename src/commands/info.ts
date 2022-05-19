import InfoService from "@services/info";

import { Message } from "node-telegram-bot-api";

export default async function info(msg: Message, match: RegExpMatchArray | null) {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const id = +match[1];

  return InfoService.get(chatId, id);
}
