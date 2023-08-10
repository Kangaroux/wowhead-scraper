import { ElementHandle, Page } from "puppeteer";
import { Hostility, NPC, NPCWithItems } from "../types";

export async function scrapeNPCInfo(page: Page, id: number): Promise<NPC> {
    await page.goto(`https://www.wowhead.com/classic/npc=${id}`);

    let factionHostility: FactionHostility = {alliance: "enemy", horde: "enemy"};
    let levelRange: LevelRange = {min: 0, max: 0};
    const nameAndTitle = await getNameAndTitle(page);
    const quickFacts = await page.$$("#infobox-contents-0 li");

    // Extract the level range from the "quick facts" section
    for(const fact of quickFacts) {
        const text = await fact.evaluate(el => el.innerText);

        if(text.includes("Level:")) {
            levelRange = getLevelRange(text);
        } else if(text.includes("React:")) {
            factionHostility = await getFactionHostility(fact);
        }
    }

    return {
        allianceHostility: factionHostility.alliance,
        hordeHostility: factionHostility.horde,
        lvlMin: levelRange.min,
        lvlMax: levelRange.max,
        name: nameAndTitle.name,
        title: nameAndTitle.title,
    }
}

interface LevelRange {
    min: number;
    max: number;
}

function getLevelRange(text: string): LevelRange {
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

interface FactionHostility {
    alliance: Hostility;
    horde: Hostility;
}

const classNameToHostility: Readonly<Record<string, Hostility>> = {
    q: "neutral",
    q10: "enemy",
    q2: "friendly",
}

async function getFactionHostility(el: ElementHandle<HTMLElement>): Promise<FactionHostility> {
    const spans = await el.$$("span");

    const alliance = await spans[0].evaluate(el => el.getAttribute("class")) as string;
    const horde = await spans[1].evaluate(el => el.getAttribute("class")) as string;

    return {
        alliance: classNameToHostility[alliance],
        horde: classNameToHostility[horde],
    }
}

interface NameAndTitle {
    name: string;
    title: string;
}

async function getNameAndTitle(page: Page): Promise<NameAndTitle> {
    const text = await page.$eval(".main-contents h1", el => el.textContent) as string;
    const natMatch = /(.*?)<(.*?)>/.exec(text);

    if(natMatch) {
        return {
            name: natMatch[1].trim(),
            title: natMatch[2],
        };
    }

    return {
        name: text,
        title: "",
    }
}
