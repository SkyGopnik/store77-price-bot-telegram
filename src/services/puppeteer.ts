import cheerio from "cheerio";

import Puppeteer from "@helpers/puppeteer";

export default class PuppeteerService {

  static async getInfo(link: string) {
    const content = await Puppeteer.getContent(link);

    const $ = cheerio.load(content);

    const name = $('h1.title_card_product:first')
      .text();

    const price = $('p.price_title_product:first')
      .text()
      .replace("—", "")
      .replace(/\s/g, '');

    const image = $('.slick-current:first').find('img').attr('src');

    return {
      name,
      price,
      image
    };
  }

}
