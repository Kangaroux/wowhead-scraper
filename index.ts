import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import { scrapeAllDrops } from "./scrapers/drops";
import { scrapeNPC } from "./scrapers/npc";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

(async() => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    const info = await scrapeNPC(page, 4949);
    console.log(info);

    // await page.goto("https://www.wowhead.com/classic/npc=3242");

    // const drops = await scrapeAllDrops(page);
    // console.log(drops)

    await browser.close();
})();
