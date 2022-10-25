import { Expansion } from "../globals";

export const MAX_STAT = 23;

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
    image: string,
    expansion: Expansion
};

export enum Stat {
    Offense = "offense",
    Control = "control",
    Fear = "fear",
    Defense = "defense",
    Utility = "utility"
};

export function getStatColor(stat: Stat): string {
    switch (stat) {
        case Stat.Offense: {
            return "#4b7364";
        }
        case Stat.Control: {
            return "#45653c";
        }
        case Stat.Fear: {
            return "#524556";
        }
        case Stat.Defense: {
            return "#a8653a";
        }
        case Stat.Utility: {
            return "#51473d";
        }
    }
}

export const statList = Object.values(Stat);

export function getMajorStatList(stats: Stats): ReadonlyArray<Stat> {
    const epsilon = 0.00001;
    return statList.filter(stat => stats[stat] >= MAX_STAT / 2 - epsilon);
};

export enum Complexity {
    Low = "Low",
    Medium = "Moderate",
    High = "High",
    Very_High = "Very High"
};

export const complexityList = [Complexity.Low, Complexity.Medium, Complexity.High, Complexity.Very_High]

export const spirits: ReadonlyArray<SpiritData> = [
    {name: "Lightning's Swift Strike", complexity: Complexity.Low, offense: 20, control: 6.5, fear: 10, defense: 2, utility: 7.5, image: "lightning.png", expansion: Expansion.Base},
    {name: "Shadows Flicker Like Flame", complexity: Complexity.Low, offense: 13, control: 10, fear: 20, defense: 2, utility: 1.5, image: "shadows.png", expansion: Expansion.Base},
    {name: "Vital Strength of the Earth", complexity: Complexity.Low, offense: 6, control: 7.5, fear: 3, defense: 20, utility: 7.5, image: "earth.png", expansion: Expansion.Base},
    {name: "River Surges in Sunlight", complexity: Complexity.Low, offense: 13, control: 19, fear: 2, defense: 2, utility: 13, image: "river.png", expansion: Expansion.Base},
    {name: "Bringer of Dreams and Nightmares", complexity: Complexity.High, offense: 1, control: 7.5, fear: 20, defense: 6.5, utility: 6.5, image: "bringer.png", expansion: Expansion.Base},
    {name: "A Spread of Rampant Green", complexity: Complexity.Medium, offense: 11.5, control: 8.5, fear: 5, defense: 20, utility: 10, image: "spread.png", expansion: Expansion.Base},
    {name: "Thunderspeaker", complexity: Complexity.High, offense: 16, control: 19, fear: 7, defense: 5, utility: 1, image: "thunderspeaker.png", expansion: Expansion.Base},
    {name: "Ocean's Hungry Grasp", complexity: Complexity.Medium, offense: 18.5, control: 13, fear: 13, defense: 9.5, utility: 5, image: "ocean.png", expansion: Expansion.Base},

    {name: "Sharp Fangs Behind the Leaves", complexity: Complexity.Medium, offense: 12, control: 12, fear: 14, defense: 6.5, utility: 1.5, image: "fangs.png", expansion: Expansion.Branch_and_Claw},
    {name: "Keeper of the Forbidden Wilds", complexity: Complexity.Medium, offense: 19, control: 10, fear: 4, defense: 16, utility: 10, image: "keeper.png", expansion: Expansion.Branch_and_Claw},
    
    {name: "Heart of the Wildfire", complexity: Complexity.High, offense: 20, control: 9, fear: 11, defense: 1.5, utility: 4, image: "wildfire.png", expansion: Expansion.Feather_and_Flame},
    {name: "Serpent Slumbering Beneath the Island", complexity: Complexity.High, offense: 6.5, control: 6.5, fear: 6.5, defense: 10, utility: 19, image: "serpent.png", expansion: Expansion.Feather_and_Flame},
    
    {name: "Lure of the Deep Wilderness", complexity: Complexity.Medium, offense: 13, control: 13, fear: 13, defense: 8, utility: 1, image: "lure.png", expansion: Expansion.Jagged_Earth},
    {name: "Vengeance as a Burning Plague", complexity: Complexity.High, offense: 23, control: 4, fear: 8.5, defense: 6.5, utility: 1, image: "vengeance.png", expansion: Expansion.Jagged_Earth},
    {name: "Stone's Unyielding Defiance", complexity: Complexity.Medium, offense: 18, control: 3, fear: 1.5, defense: 23, utility: 3, image: "stone.png", expansion: Expansion.Jagged_Earth},
    {name: "Starlight Seeks Its Form", complexity: Complexity.Very_High, offense: MAX_STAT / 4, control: MAX_STAT / 4, fear: MAX_STAT / 4, defense: MAX_STAT / 2, utility: MAX_STAT / 2, image: "starlight.png", expansion: Expansion.Jagged_Earth},
    {name: "Volcano Looming High", complexity: Complexity.Medium, offense: 23, control: 3, fear: 5, defense: 2.5, utility: 11.5, image: "volcano.png", expansion: Expansion.Jagged_Earth},
    {name: "Many Minds Move as One", complexity: Complexity.Medium, offense: 1.5, control: 21, fear: 13.5, defense: 13, utility: 1.5, image: "manyminds.png", expansion: Expansion.Jagged_Earth},
    {name: "Fractured Days Split the Sky", complexity: Complexity.Very_High, offense: 1.5, control: 3, fear: 1.5, defense: 15, utility: 28, image: "fractureddays.png", expansion: Expansion.Jagged_Earth},
    {name: "Shroud of Silent Mist", complexity: Complexity.High, offense: 13, control: 13, fear: 15.5, defense: 5, utility: 1, image: "shroud.png", expansion: Expansion.Jagged_Earth},
    {name: "Shifting Memory of Ages", complexity: Complexity.Medium, offense: 1, control: 3, fear: 3, defense: 7.5, utility: 9.5, image: "memory.png", expansion: Expansion.Jagged_Earth},
    {name: "Grinning Trickster Stirs Up Trouble", complexity: Complexity.Medium, offense: 10.5, control: 8, fear: 5, defense: 13, utility: 10, image: "trickster.png", expansion: Expansion.Jagged_Earth},

    {name: "Downpour Drenches the World", complexity: Complexity.High, offense: 5, control: 10.5, fear: 2.5, defense: 19, utility: 10.5, image: "downpour.png", expansion: Expansion.Feather_and_Flame},
    {name: "Finder of Paths Unseen", complexity: Complexity.Very_High, offense: -6, control: 46, fear: 1, defense: 3, utility: 3, image: "finder.png", expansion: Expansion.Feather_and_Flame},

    {name: "Devouring Teeth Lurk Underfoot", complexity: Complexity.Low, offense: 20, control: 8, fear: 8, defense: 4, utility: 4, image: "teeth.png", expansion: Expansion.Horizons},
    {name: "Eyes Watch From the Trees", complexity: Complexity.Low, offense: 8, control: 12, fear: 16, defense: 20, utility: 4, image: "eyes.png", expansion: Expansion.Horizons},
    {name: "Fathomless Mud of the Swamp", complexity: Complexity.Low, offense: 12, control: 8, fear: 12, defense: 12, utility: 8, image: "mud.png", expansion: Expansion.Horizons},
    {name: "Rising Heat of Stone and Sand", complexity: Complexity.Low, offense: 20, control: 12, fear: 4, defense: 8, utility: 12, image: "heat.png", expansion: Expansion.Horizons},
    {name: "Sun-Bright Whirlwind", complexity: Complexity.Low, offense: 12, control: 20, fear: 4, defense: 4, utility: 12, image: "whirlwind.png", expansion: Expansion.Horizons},
];

export interface SpiritState {
    data: SpiritData;
    disabled: boolean;
}

export interface SpiritsViewState {
    available: ReadonlyArray<SpiritState>;
    chosen: ReadonlyArray<SpiritState>;
    madSliderRawValue: number;
    randomTowardsBalance: boolean;
    numberOfSpiritsToRandomize: number;
    complexitiesToShow: ReadonlyArray<Complexity>;
    prominentStatsToShow: ReadonlyArray<Stat>;
    expansionsToShow: ReadonlyArray<Expansion>;
}

export interface SpiritsSaveState {
    madSliderRawValue: number;
    randomTowardsBalance: boolean;
    numberOfSpiritsToRandomize: number;
    complexitiesToShow: ReadonlyArray<Complexity>;
    prominentStatsToShow: ReadonlyArray<Stat>;
    expansionsToShow: ReadonlyArray<Expansion>;
    disabled?: ReadonlyArray<string>;
}