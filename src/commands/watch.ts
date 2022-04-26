import Links from "@services/links";

import numberFormat from "@functions/numberFormat";

import { bot } from "@commands";

import { Message } from "node-telegram-bot-api";

export default async function watch(msg: Message, match: RegExpMatchArray | null) {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const link = match[1];

  const getLink = await Links.get(link);

  if (!getLink) {
    const [ linkInfo ] = await Promise.all([
      Links.create(chatId, link),
      bot.sendMessage(chatId, "Минуточку, пьем 🍻 и парсим сайтец 🙈")
    ]);

    await bot.sendMessage(chatId, `Теперь я наблюдаю за ${linkInfo.name}\nНачальная цена: ${numberFormat(+linkInfo.price)} золотых монет`);

    return;
  }

  await bot.sendMessage(chatId, `Ты золотая рыбка? ${getLink.get("name")} уже существует!`);
}
