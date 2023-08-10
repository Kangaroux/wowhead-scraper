export interface Item {
    id: number;
    name: string;
    type: string;
    rate: number;
}

export type Hostility = "friendly" | "neutral" | "enemy";

export interface NPC {
    name: string;
    title: string;
    lvlMin: number;
    lvlMax: number;
    allianceHostility: Hostility;
    hordeHostility: Hostility;
}
