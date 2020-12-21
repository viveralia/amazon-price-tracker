import puppeteer from "puppeteer";
import cheerio from "cheerio";

export const startBrowser = async (url: string) => {
  console.log("📡 Starting the browser...");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  return page;
};

export const getProductInfo = async (page: puppeteer.Page) => {
  console.log("🔗 Getting the product info...");

  await page.reload();
  const html = await page.evaluate(() => document.body.innerHTML);

  const $ = cheerio.load(html);
  const name = $("#productTitle").text().trim();
  const priceAsString = $("#price_inside_buybox").text().trim();
  const price = Number(priceAsString.replace(/[^0-9.-]+/g, ""));
  const url = page.url();
  const img = $("#landingImage").attr("src");

  return { name, price, url, img };
};
