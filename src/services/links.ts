import { bot } from "@commands";

import LinkInfoModel from "@models/link.info.model";
import LinkModel from "@models/link.model";

import PuppeteerService from "@services/puppeteer";

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
      include: [ LinkInfoModel ]
    });
  }

  static async create(chatId: number, link: string) {
    const { name, price, image } = await PuppeteerService.getInfo(link);

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
        const { price } = await PuppeteerService.getInfo(item.get("link"));

        const info = item.get("info");

        const lastPrice = info[info.length - 1].get("price");

        if (lastPrice === +price) {
          return;
        }

        const newPrice = numberFormat(+price);
        const oldPrice = numberFormat(lastPrice);

        await Promise.all([
          bot.sendMessage(
            item.get("chatId"),
            `🔥 *${item.get("name")}* 🔥\n\n*Новая цена:* ${newPrice} рублей\n_Старая цена:_ ${oldPrice} рублей`,
            {
              parse_mode: 'Markdown'
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
