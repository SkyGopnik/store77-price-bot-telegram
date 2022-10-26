import InfoService from "@services/info";
import Links from "@services/links";
import TelegramBot from "node-telegram-bot-api";

import watch from "@commands/watch";
import list from "@commands/list";
import remove from "@commands/remove";
import info from "@commands/info";
import help from "@commands/help";
import infoMore from "@commands/infoMore";

const keys = require("@config/keys.json");

export const bot = new TelegramBot(keys.token, {
  polling: true
});

bot.onText(/\/list/, list);

bot.onText(/\/help/, help);

bot.onText(/\/watch (.+)/, watch);

bot.onText(/\/info (.+)/, info);

bot.onText(/\/info_more (.+)/, infoMore);

bot.onText(/\/remove (.+)/, remove);

bot.onText(/\/sync/, () => Links.checkPrices());

bot.on('callback_query', async (callbackQuery) => {
  const { id, data } = callbackQuery;

  await bot.answerCallbackQuery(id);

  if (!data) {
    return;
  }

  if (/\/info (.+)/.test(data)) {
    const id = data.split(" ")[1];

    if (!callbackQuery.message) {
      return;
    }

    return InfoService.get(callbackQuery.message?.chat.id, id);
  }

  if (/\/info_more (.+)/.test(data)) {
    const id = data.split(" ")[1];

    if (!callbackQuery.message) {
      return;
    }

    const { message_id: replyId } = callbackQuery.message;

    return InfoService.more(callbackQuery.message?.chat.id, replyId, id);
  }
});
