import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

import { scrapeFullNPC } from "./scrapers/full";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

(async() => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    const data = await scrapeFullNPC(page, 4949);
    console.log(data);

    await browser.close();
})();
