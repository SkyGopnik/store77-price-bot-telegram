import moment from "moment";

import LinkInfoModel from "@models/link.info.model";
import LinkModel from "@models/link.model";

import numberFormat from "@functions/numberFormat";

import { bot } from "@commands";

import { Message } from "node-telegram-bot-api";

export default async function info(msg: Message, match: RegExpMatchArray | null) {
  const chatId = msg.chat.id;

  if (!match) {
    return;
  }

  const id = +match[1];

  const link = await LinkModel.findOne({
    include: [ LinkInfoModel ],
    where: {
      id
    }
  });

  if (!link) {
    return;
  }

  const prices = link.get("info").map((item) => {
    const price = numberFormat(item.get("price"));

    return `${price} рублей - ${moment(item.get("createdAt")).format('LL')}`;
  });

  return bot.sendMessage(
    chatId,
    `*Информация о ${link.get("name")}*\n\nЦены:\n${prices.join("\n")}`,
    {
      parse_mode: 'Markdown'
    }
  );
}
