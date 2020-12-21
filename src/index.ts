import dotenv from "dotenv";
import { CronJob } from "cron";

import { sendNotification } from "./notification";
import { startBrowser, getProductInfo } from "./scraper";

dotenv.config();

export interface PriceTrackerConfig {
  amazonProductUrl: string;
  notificationPrice: number;
  cronInterval?: string;
  cronTimeZone?: string;
}

const startTracking = async ({
  amazonProductUrl,
  notificationPrice,
  cronInterval = "0 0 0 * * *", // will run every day at 12:00 AM by default
  cronTimeZone = "America/Los_Angeles",
}: PriceTrackerConfig) => {
  const productPage = await startBrowser(amazonProductUrl);

  const job = new CronJob(
    cronInterval,
    async () => {
      const product = await getProductInfo(productPage);
      if (product.price < notificationPrice) {
        sendNotification(product);
      }
    },
    null,
    true,
    cronTimeZone
  );

  job.start();
};

startTracking({
  amazonProductUrl:
    "https://www.amazon.com.mx/Philips-Hue-Equivalent-Assistant-California/dp/B07DPWJP35/ref=sr_1_4?__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=3277POW5MF2KB&dchild=1&keywords=philips+hue&qid=1608505668&sprefix=phili%2Caps%2C256&sr=8-4",
  notificationPrice: 2000,
  cronInterval: "*/50 * * * * *",
});
