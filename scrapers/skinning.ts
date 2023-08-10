import { Page } from "puppeteer";
import { Item } from "../types";

export async function scrapeAllSkinning(page: Page): Promise<Item[]> {
    await page.click("a[href=\"#skinning\"]");
    await page.click("xpath///div[@class=\"listview-nav\"]//a[contains(text(), \"First\")]");

    const results: Item[] = [];

    while(true) {
        results.push(...await scrapeSkinningTable(page));

        const nextBtn = await page.$("xpath///div[@class=\"listview-nav\"]//a[contains(text(), \"Next\")]");
        const isActive = await nextBtn?.evaluate(el => el.getAttribute("data-active") === "yes");

        if(nextBtn && isActive) {
            await nextBtn.click();
        } else {
            break;
        }
    }

    return results;
}

async function scrapeSkinningTable(page: Page): Promise<Item[]> {
    const results: Item[] = [];
    const tableRows = await page.$$("#tab-skinning tbody tr");

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
        // 10: loot count
        // 11: drop rate (percentage)
        const cells = await row.$$("td");

        const itemUrl = await cells[1].$eval("a", el => el.href);
        const itemId = parseInt(/wowhead.com\/classic\/item=(\d+)/.exec(itemUrl)![1]);
        const itemName = await cells[2].evaluate(el => el.textContent || "");
        const itemType = await cells[9].evaluate(el => el.textContent || "");
        const itemDropRate = parseFloat(await cells[11].evaluate(el => el.textContent) || "0");

        results.push({
            rate: itemDropRate,
            id: itemId,
            name: itemName,
            type: itemType,
        });
    }

    return results;
}
