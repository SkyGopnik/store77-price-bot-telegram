import Links from "@services/links";
import TelegramBot from "node-telegram-bot-api";

import watch from "@commands/watch";
import list from "@commands/list";
import remove from "@commands/remove";
import info from "@commands/info";
import help from "@commands/help";

const keys = require("@config/keys.json");

export const bot = new TelegramBot(keys.token, {
  polling: true
});

bot.onText(/\/list/, list);

bot.onText(/\/help/, help);

bot.onText(/\/watch (.+)/, watch);

bot.onText(/\/info (.+)/, info);

bot.onText(/\/remove (.+)/, remove);

bot.onText(/\/test/, () => Links.checkPrices());

bot.on('callback_query', async (callbackQuery) => {
  await bot.answerCallbackQuery(callbackQuery.id);

  console.log(callbackQuery.message);
});
