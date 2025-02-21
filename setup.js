import { join } from "path";
import { readFileSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer";

const authFile = join(import.meta.dirname, './puppeteer/.auth/user.json');

async function saveCookies(page) {
  const browser = await page.browser();
  const cookies = JSON.stringify(await browser.cookies());
  writeFileSync(authFile, cookies);
}

async function loadCookies(page) {
  const cookieJson = readFileSync(authFile);
  const cookies = JSON.parse(cookieJson);
  await page.setCookie(...cookies);
}

async function setup() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.steamgifts.com/?login', { waitUntil: 'networkidle0' });

  // Wait for manual authentication.
  await page.waitForFunction("window.location == 'https://www.steamgifts.com/'")
  // Save authentication state.
  await saveCookies(page);
  await browser.close();
}

if (process.argv[1] === import.meta.filename) {
  setup();
}

export { saveCookies, loadCookies }
