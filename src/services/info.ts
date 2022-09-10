import { bot } from "@commands";
import numberFormat from "@functions/numberFormat";
import LinkInfoModel from "@models/link.info.model";
import LinkModel from "@models/link.model";
import moment from "moment";

export default class InfoService {
  static async get(chatId: number, infoId: string | number) {
    const link = await LinkModel.findOne({
      include: [{
        model: LinkInfoModel,
        as: "info"
      }],
      order: [
        [
          {
            model: LinkInfoModel,
            as: "info"
          }, 'id', 'ASC'
        ]
      ],
      where: {
        id: infoId
      }
    });

    if (!link) {
      return;
    }

    const onlyPrices = [...link.get("info").map((item) => item.get("price"))];

    const currentPrice = onlyPrices[onlyPrices.length - 1];

    const lowestPrice = Math.min.apply(null, onlyPrices);
    const highestPrice = Math.max.apply(null, onlyPrices);

    return bot.sendMessage(
      chatId,
      `*Информация о ${link.get("name")}*\n\n*Текущая цена - ${numberFormat(currentPrice)} рублей*\n\n+ Максимальная - ${numberFormat(highestPrice)} рублей\n- Минимальная - ${numberFormat(lowestPrice)} рублей`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Изменение цены",
                callback_data: `/info_more ${infoId}`
              }
            ]
          ]
        }
      }
    );
  }

  static async more(chatId: number, replyId: number, infoId: string | number) {
    const link = await LinkModel.findOne({
      include: [{
        model: LinkInfoModel,
        as: "info"
      }],
      order: [
        [
          {
            model: LinkInfoModel,
            as: "info"
          }, 'id', 'ASC'
        ]
      ],
      where: {
        id: infoId
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
      `*Изменение цены*\n${prices.join("\n")}`,
      {
        parse_mode: 'Markdown',
        reply_to_message_id: replyId
      }
    );
  }
}
