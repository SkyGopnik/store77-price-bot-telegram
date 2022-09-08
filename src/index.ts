import axios from "axios";
import https from "https";
import moment from "moment";
import 'moment/locale/ru';

import 'reflect-metadata';
import 'module-alias/register';

import Links from "@services/links";

import db from '@models';

import "@commands";

const CronJob = require('cron').CronJob;

// @ts-ignore
process.env.NTBA_FIX_319 = 1;

moment.locale('ru');

axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

(async () => {
  await db.sync({ force: false });

  console.log("Store77 Price Watcher Bot Started")
})();

const everyHour = new CronJob('0 * * * *', () => Links.checkPrices());

everyHour.start();
