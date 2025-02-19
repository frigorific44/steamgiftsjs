import puppeteer from "puppeteer";
import { readFileSync } from "node:fs";
import { authFile } from "./setup.js";

async function loadCookies(page) {
  const cookieJson = readFileSync(authFile);
  const cookies = JSON.parse(cookieJson);
  await page.setCookie(...cookies);
}

// Enter a giveaway.
async function enter(page, url) {
  await page.goto('https://www.steamgifts.com' + url);
  await page.locator('.sidebar__entry-insert').click();
  // const title = await page.title();
  // console.log(title);
}

(async () => {
  const browser = await puppeteer.launch(
    // {headless: false}
  );
  const page = await browser.newPage();
  await page.goto("https://www.steamgifts.com/");
  await loadCookies(page);
  await page.goto("https://www.steamgifts.com/giveaways/search?type=wishlist");
  const selector = '.page__heading + div .giveaway__row-inner-wrap:not(.is-faded) .giveaway__heading__name';
  const urls = await page.$$eval(selector, headers => {
    return headers.map(header => header.getAttribute('href'));
  })
  // console.log(urls)
  for (const url of urls) {
    await enter(page, url);
  }
  await browser.close();
})();
