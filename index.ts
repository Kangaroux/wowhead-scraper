import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

import { scrapeFullNPC } from "./scrapers/full";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    console.log("Starting scrape");

    const earlier = performance.now();
    const data = await scrapeFullNPC(page, 2244);

    console.log(data);
    console.log(
        "Finished scrape in",
        (performance.now() - earlier) / 1000,
        "seconds",
    );

    await browser.close();
})();
