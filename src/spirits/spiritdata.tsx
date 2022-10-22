const MAX_STAT = 20;

export interface Stats {
    offense: number
    control: number
    fear: number
    defense: number
    utility: number
};

export interface SpiritData extends Stats {
    name: string
    complexity: Complexity
    offense: number
    control: number
    fear: number
    defense: number
    utility: number
    image: string
};

export enum Stat {
    Offense = "offense",
    Control = "control",
    Fear = "fear",
    Defemse = "defense",
    Utility = "utility"
};

export const statList = Object.values(Stat);

export function getMajorStatList(stats: Stats): ReadonlyArray<Stat> {
    return statList.filter(stat => stats[stat] >= MAX_STAT / 2);
};

export enum Complexity {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Very_High = "Very High"
};

export const complexityList = [Complexity.Low, Complexity.Medium, Complexity.High, Complexity.Very_High]

export const spirits: ReadonlyArray<SpiritData> = [
    {name: "Lightning's Swift Strike", complexity: Complexity.Low, offense: 20, control: 6.5, fear: 10, defense: 2, utility: 7.5, image: "lightning.png"},
    {name: "Shadows Flicker Like Flame", complexity: Complexity.Low, offense: 13, control: 10, fear: 20, defense: 2, utility: 1.5, image: "shadows.png"},
    {name: "Vital Strength of the Earth", complexity: Complexity.Low, offense: 6, control: 7.5, fear: 3, defense: 20, utility: 7.5, image: "earth.png"},
    {name: "River Surges in Sunlight", complexity: Complexity.Low, offense: 13, control: 19, fear: 2, defense: 2, utility: 13, image: "river.png"},
    {name: "Bringer of Dreams and Nightmares", complexity: Complexity.High, offense: 1, control: 7.5, fear: 20, defense: 6.5, utility: 6.5, image: "bringer.png"},
    {name: "A Spread of Rampant Green", complexity: Complexity.Medium, offense: 11.5, control: 8.5, fear: 5, defense: 20, utility: 10, image: "spread.png"},
    {name: "Thunderspeaker", complexity: Complexity.High, offense: 16, control: 19, fear: 7, defense: 5, utility: 1, image: "thunderspeaker.png"},
    {name: "Ocean's Hungry Grasp", complexity: Complexity.Medium, offense: 18.5, control: 13, fear: 13, defense: 9.5, utility: 5, image: "ocean.png"}
];
