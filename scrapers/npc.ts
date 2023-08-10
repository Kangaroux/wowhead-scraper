import { ElementHandle, Page } from "puppeteer";
import { Hostility, NPC } from "../types";

export async function scrapeNPC(page: Page, id: number): Promise<NPC> {
    await page.goto(`https://www.wowhead.com/classic/npc=${id}`);

    let allianceHostility: Hostility = "enemy";
    let hordeHostility: Hostility = "enemy";
    let lvlMin = 0;
    let lvlMax = 0;
    const name = await page.$eval(".main-contents h1", el => el.textContent) || "";
    const quickFacts = await page.$$("#infobox-contents-0 li");

    // Extract the level range from the "quick facts" section
    for(const fact of quickFacts) {
        const text = await fact.evaluate(el => el.innerText);

        if(text.includes("Level:")) {
            const range = getLevelRange(text);
            lvlMin = range.min;
            lvlMax = range.max;
        } else if(text.includes("React:")) {
            const hostility = await getFactionHostility(fact);
            allianceHostility = hostility.alliance;
            hordeHostility = hostility.horde;
        }
    }

    return {
        allianceHostility,
        hordeHostility,
        lvlMin,
        lvlMax,
        name,
    }
}

interface levelRange {
    min: number;
    max: number;
}

function getLevelRange(text: string): levelRange {
    if(text === "Level: ??") {
        return {min: 63, max: 63};
    }

    const rangeMatch = /Level: (\d+) - (\d+)/.exec(text);

    if(rangeMatch) {
        return {
            min: parseInt(rangeMatch[1]),
            max: parseInt(rangeMatch[2]),
        }
    }

    return {min: 0, max: 0};
}

interface factionHostility {
    alliance: Hostility;
    horde: Hostility;
}

const classNameToHostility: Readonly<Record<string, Hostility>> = {
    q: "neutral",
    q10: "enemy",
    q2: "friendly",
}

async function getFactionHostility(el: ElementHandle<HTMLElement>): Promise<factionHostility> {
    const spans = await el.$$("span");

    const alliance = await spans[0].evaluate(el => el.getAttribute("class")) as string;
    const horde = await spans[1].evaluate(el => el.getAttribute("class")) as string;

    return {
        alliance: classNameToHostility[alliance],
        horde: classNameToHostility[horde],
    }
}
