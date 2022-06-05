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
        as: "info",
        order: [
          ['id', 'ASC']
        ]
      }],
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
}
