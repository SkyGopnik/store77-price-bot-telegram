import { bot } from "@commands";

import LinkInfoModel from "@models/link.info.model";
import LinkModel from "@models/link.model";

import ParseService from "@services/parse";

import numberFormat from "@functions/numberFormat";

export default class Links {

  static async get(link: string) {
    return LinkModel.findOne({
      where: {
        link
      }
    });
  }

  static async list() {
    return LinkModel.findAll({
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
    });
  }

  static async create(chatId: number, link: string) {
    const { name, price, image } = await ParseService.getInfo(link);

    const linkModel = await LinkModel.create({
      chatId,
      link,
      name,
      image
    });

    await LinkInfoModel.create({
      price: +price,
      linkId: linkModel.id
    });

    return {
      name,
      price,
      image
    };
  }

  static async remove(id: number) {
    return LinkModel.destroy({
      cascade: true,
      where: {
        id
      }
    });
  }

  static async checkPrices() {
    const list = await Links.list();

    await Promise.all(
      list.map(async (item) => {
        const { price } = await ParseService.getInfo(item.get("link"));

        const info = item.get("info");

        const lastPrice = info[info.length - 1].get("price");

        if (lastPrice === +price) {
          return;
        }

        const newPrice = numberFormat(+price);
        const oldPrice = numberFormat(lastPrice);

        const priceIsUp = newPrice > oldPrice;

        await Promise.all([
          bot.sendMessage(
            item.get("chatId"),
            `🔥 *${item.get("name")}* _(ID - ${item.get("id")})_ 🔥\n\nЦена *${priceIsUp ? "повысилась" : "понизилась"}*\n_Старая цена:_ ${oldPrice} рублей\n*Новая цена:* ${newPrice} рублей`,
            {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Подробнее",
                      callback_data: `/info ${item.get("id")}`
                    }
                  ]
                ]
              }
            }
          ),
          LinkInfoModel.create({
            price: +price,
            linkId: item.get("id")
          })
        ]);
      })
    );
  }

}
