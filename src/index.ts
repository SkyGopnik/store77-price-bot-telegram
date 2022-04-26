const CronJob = require('cron').CronJob;

// @ts-ignore
process.env.NTBA_FIX_319 = 1;

import moment from "moment";
import 'moment/locale/ru';

import 'reflect-metadata';
import 'module-alias/register';

import Links from "@services/links";

import db from '@models';

import "@commands";

moment.locale('ru');

(async () => {
  await db.sync({ force: false });

  console.log("Store77 Price Watcher Bot Started")
})();

const everyHour = new CronJob('0 * * * *', () => Links.checkPrices());

everyHour.start();
