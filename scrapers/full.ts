import { Page } from "puppeteer";
import { NPCWithItems } from "../types";
import { scrapeAllDrops } from "./drops";
import { scrapeNPCInfo } from "./npc";
import { scrapeAllSkinning } from "./skinning";
import { scrapeAllPickpocketing } from "./pickpocketing";

export async function scrapeFullNPC(page: Page, id: number): Promise<NPCWithItems> {
    const npc = await scrapeNPCInfo(page, 4949);
    const drops = await scrapeAllDrops(page);
    const pickpocketing = await scrapeAllPickpocketing(page);
    const skinning = await scrapeAllSkinning(page);

    return {
        drops,
        pickpocketing,
        skinning,
        ...npc
    };
}
