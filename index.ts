import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

(async() => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto("https://www.wowhead.com/classic/npc=3242");
    await page.click("a[href=\"#drops\"]");
    const tableRows = await page.$$("#tab-drops tbody tr");

    for(const row of tableRows) {
        // 0: checkbox to select row
        // 1: icon
        // 2: name
        // 3: item lvl
        // 4: required lvl
        // 5: versions
        // 6: side
        // 7: slot
        // 8: source
        // 9: type
        // 10: SoM phase
        // 11: loot count
        // 12: drop rate (percentage)
        const cells = await row.$$("td");

        const itemUrl = await cells[1].$eval("a", el => el.href);
        const itemId = /wowhead.com\/classic\/item=(\d+)/.exec(itemUrl)![1];
        const itemName = await cells[2].evaluate(el => el.textContent || "");
        const itemType = await cells[9].evaluate(el => el.textContent || "");
        const itemDropRate = parseFloat(await cells[12].evaluate(el => el.textContent) || "0");

        console.log(
            itemId,
            itemName,
            itemType,
            itemDropRate
        );
    }

    await browser.close();
})();
