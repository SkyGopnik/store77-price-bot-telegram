import puppeteer from "puppeteer";

export default class Puppeteer {

  static async getContent(url: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const content = await page.content();

    await browser.close();

    return content;
  }

}
