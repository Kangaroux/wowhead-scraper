import { Page } from "puppeteer";
import { NPC } from "../types";

export async function scrapeNPC(page: Page, id: number): Promise<NPC> {
    await page.goto(`https://www.wowhead.com/classic/npc=${id}`);

    let lvlMin = 0;
    let lvlMax = 0;
    const name = await page.$eval(".main-contents h1", el => el.textContent) || "";
    const quickFacts = await page.$$("#infobox-contents-0 li");

    // Extract the level range from the "quick facts" section
    for(const fact of quickFacts) {
        const text = await fact.evaluate(el => el.innerText);
        const match = /Level: (\d+) - (\d+)/.exec(text);

        if(match) {
            lvlMin = parseInt(match[1]);
            lvlMax = parseInt(match[2]);
            break;
        }
    }

    return {
        lvlMin,
        lvlMax,
        name,
    }
}
