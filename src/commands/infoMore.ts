import InfoService from "@services/info";

import { Message } from "node-telegram-bot-api";

export default async function infoMore(msg: Message, match: RegExpMatchArray | null) {
  const chatId = msg.chat.id;

  const { message_id: replyId } = msg;

  if (!match) {
    return;
  }

  const id = +match[1];

  return InfoService.more(chatId, replyId, id);
}
