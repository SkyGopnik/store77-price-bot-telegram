import { bot } from "@commands";

import { Message } from "node-telegram-bot-api";

export default async function help(msg: Message) {
  const chatId = msg.chat.id;

  return bot.sendMessage(
    chatId,
    `*Информация о всех командах*\n\n/help - все команды\n/list - просмотр всех отслеживаемых ссылок\n/watch _url_ - слежение за ссылкой\n/info _id_ - вся история цен\n/remove _id_ - удаление ссылки из отслеживания`,
    {
      parse_mode: 'Markdown'
    }
  );
}
