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

  const onlyPrices = [...link.get("info").map((item) => item.get("price"))];

  const lowestPrice = Math.min.apply(null, onlyPrices);
  const highestPrice = Math.max.apply(null, onlyPrices);

  return bot.sendMessage(
    chatId,
    `*Информация о ${link.get("name")}* _(ID - ${link.get("id")})_\n\n*Пики цен*\n+ Максимальная - _${numberFormat(highestPrice)}_ рублей\n- Минимальная - *${numberFormat(lowestPrice)}* рублей\n\n*Изменение цен*\n${prices.join("\n")}`,
    {
      parse_mode: 'Markdown'
    }
  );
}
