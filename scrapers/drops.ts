import { ElementHandle, Page } from "puppeteer";
import { Item } from "../types";
import { scrapeTab } from "./util";

export async function scrapeAllDrops(page: Page): Promise<Item[]> {
    await page.click('a[href="#drops"]');
    return await scrapeTab(page, "#tab-drops", scrapeDropTable);
}

async function scrapeDropTable(view: ElementHandle): Promise<Item[]> {
    const results: Item[] = [];
    const tableRows = await view.$$("tbody tr");

    for (const row of tableRows) {
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

        const itemUrl = await cells[1].$eval("a", (el) => el.href);
        const itemId = parseInt(
            /wowhead.com\/classic\/item=(\d+)/.exec(itemUrl)![1],
        );
        const itemName = await cells[2].evaluate((el) => el.textContent || "");
        const itemType = await cells[9].evaluate((el) => el.textContent || "");
        const itemDropRate = parseFloat(
            (await cells[12].evaluate((el) => el.textContent)) || "0",
        );

        results.push({
            rate: itemDropRate,
            id: itemId,
            name: itemName,
            type: itemType,
        });
    }

    return results;
}
