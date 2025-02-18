const path = require("path");
const fs = require("node:fs");
const { default: puppeteer } = require("puppeteer");

const authFile = path.join(__dirname, './puppeteer/.auth/user.json');

async function setup() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.steamgifts.com/?login', {waitUntil: 'networkidle0'});
  
  // Wait for manual authentication.
  await page.waitForFunction("window.location == 'https://www.steamgifts.com/'")
  // Save authentication state.
  const cookies = JSON.stringify(await browser.cookies());
  fs.writeFileSync(authFile, cookies)
  // await page.context().storageState({ path: authFile });
  await browser.close();
}

if (require.main === module) {
  setup();
}

module.exports = { setup, authFile }
