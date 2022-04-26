import puppeteer from "puppeteer";

export default class Puppeteer {

  static async getContent(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--use-gl=egl', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto(url);

    const content = await page.content();

    await browser.close();

    return content;
  }

}
