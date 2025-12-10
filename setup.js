import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer";

const authDir = join(import.meta.dirname, './puppeteer/.auth')
const authFile = join(authDir, 'user.json');

async function saveCookies(browser) {
  if (!existsSync(authDir)) {
    mkdirSync(authDir, { recursive: true });
  }
  const cookies = JSON.stringify(await browser.cookies());
  writeFileSync(authFile, cookies);
}

async function loadCookies(browser) {
  const cookieJson = readFileSync(authFile);
  const cookies = JSON.parse(cookieJson);
  await browser.setCookie(...cookies);
}

async function setup() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.steamgifts.com/?login', { waitUntil: 'networkidle0' });

  // Wait for manual authentication.
  await page.waitForFunction("window.location == 'https://www.steamgifts.com/'")
  // Save authentication state.
  await saveCookies(browser);
  await browser.close();
}

if (process.argv[1] === import.meta.filename) {
  setup();
}

export { saveCookies, loadCookies }
