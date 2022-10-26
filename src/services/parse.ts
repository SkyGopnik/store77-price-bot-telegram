import axios from "axios";

import cheerio from "cheerio";

export default class ParseService {

  static async getInfo(link: string) {
    const content = await axios.get(link);

    const $ = cheerio.load(content.data);

    const name = $('h1.title_card_product:first')
      .text();

    const price = $('p.price_title_product:first')
      .text()
      .replace("—", "")
      .replace(/\s/g, '')
      .replace("Р", '');

    if (+price <= 0) {
      throw Error("Price not valid");
    }

    const image = $('.slick-current:first').find('img').attr('src');

    return {
      name,
      price,
      image
    };
  }

}
