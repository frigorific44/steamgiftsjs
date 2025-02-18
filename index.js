const { default: puppeteer } = require("puppeteer");
const fs = require("node:fs");
const { authFile } = require("./setup");

async function loadCookies(page) {
  const cookieJson = fs.readFileSync(authFile);
  const cookies = JSON.parse(cookieJson);
  await page.setCookie(...cookies);
}

(async () => {
  const browser = await puppeteer.launch(
    // {headless: false}
  );
  const page = await browser.newPage();
  await page.goto("https://www.steamgifts.com/");
  await loadCookies(page);
  await page.goto("https://www.steamgifts.com/giveaways/search?type=wishlist");
  await browser.close();
})();
