import { Expansion } from "../globals";

export enum RuleType {
    Scenario = "Scenario",
    SpecialScenario = "Special Scenario",
    Adversary = "Adversary"
};

export const showableRulesList = [RuleType.Scenario, RuleType.SpecialScenario, RuleType.Adversary];

export interface Adversary {
    name: string;
    image: string;
    difficulties: number[];
    expansion: Expansion;

    type: RuleType.Adversary;
};

export const adversaries: ReadonlyArray<Adversary> = [
    { name: "The Kingdom of Brandenburg-Prussia", image: "brandenburg_prussia.png", difficulties: [1, 2, 4, 6, 7, 9, 10], expansion: Expansion.Base, type: RuleType.Adversary },
    { name: "The Kingdom of England", image: "england.png", difficulties: [1, 3, 4, 6, 7, 9, 11], expansion: Expansion.Base, type: RuleType.Adversary },
    { name: "The Kingdom of Sweden", image: "sweden.png", difficulties: [1, 2, 3, 5, 6, 7, 8], expansion: Expansion.Base, type: RuleType.Adversary },
    { name: "The Kingdom of France (Plantation Colony)", image: "france.png", difficulties: [2, 3, 5, 7, 8, 9, 10], expansion: Expansion.Branch_and_Claw, type: RuleType.Adversary },
    { name: "The Habsburg Monarchy (Livestock Colony)", image: "habsburg.png", difficulties: [2, 3, 5, 6, 8, 9, 10], expansion: Expansion.Jagged_Earth, type: RuleType.Adversary },
    { name: "The Tsardom of Russia", image: "russia.png", difficulties: [1, 3, 4, 6, 7, 9, 11], expansion: Expansion.Jagged_Earth, type: RuleType.Adversary },
    { name: "The Kingdom of Scotland", image: "scotland.png", difficulties: [1, 3, 4, 6, 7, 8, 10], expansion: Expansion.Feather_and_Flame, type: RuleType.Adversary },
];

export interface Scenario {
    name: string;
    image: string;
    difficulty: number;
    expansion: Expansion;

    type: RuleType.Scenario | RuleType.SpecialScenario;
};

export const scenarios: ReadonlyArray<Scenario> = [
    { name: "Blitz", image: "blitz.png", difficulty: 0, expansion: Expansion.Base, type: RuleType.Scenario }, 
    { name: "Guard the Isle's Heart", image: "guard_heart.png", difficulty: 0, expansion: Expansion.Base, type: RuleType.Scenario }, 
    { name: "Rituals of Terror", image: "rituals_of_terror.png", difficulty: 3, expansion: Expansion.Base, type: RuleType.Scenario }, 
    { name: "Dahan Insurrection", image: "dahan_insurrection.png", difficulty: 4, expansion: Expansion.Base, type: RuleType.Scenario }, 
    { name: "Second Wave", image: "second_wave.png", difficulty: 0, expansion: Expansion.Branch_and_Claw, type: RuleType.SpecialScenario }, 
    { name: "Powers Long Forgotten", image: "powers_forgotten.png", difficulty: 1, expansion: Expansion.Branch_and_Claw, type: RuleType.Scenario }, 
    { name: "Ward the Shores", image: "ward_shores.png", difficulty: 2, expansion: Expansion.Branch_and_Claw, type: RuleType.Scenario }, 
    { name: "Rituals of the Destroying Flame", image: "rituals_of_flame.png", difficulty: 3, expansion: Expansion.Branch_and_Claw, type: RuleType.Scenario }, 
    { name: "Elemental Invocation", image: "elemental_invocation.png", difficulty: 1, expansion: Expansion.Jagged_Earth, type: RuleType.Scenario }, 
    { name: "Despicable Theft", image: "theft.png", difficulty: 2, expansion: Expansion.Jagged_Earth, type: RuleType.Scenario }, 
    { name: "The Great River", image: "great_river.png", difficulty: 3, expansion: Expansion.Jagged_Earth, type: RuleType.Scenario }, 
    { name: "A Diversity of Spirits", image: "diversity_of_spirits.png", difficulty: 0, expansion: Expansion.Feather_and_Flame, type: RuleType.SpecialScenario }, 
    { name: "Varied Terrains", image: "varied_terrains.png", difficulty: 2, expansion: Expansion.Feather_and_Flame, type: RuleType.Scenario }
];

export interface ChosenAdversary extends Adversary {
    chosenLevel: number;
};

export type RuleState = {
    data: Scenario | Adversary;
    disabled: boolean;
};

export interface InvadersViewState {
    available: ReadonlyArray<RuleState>;
    chosen: ReadonlyArray<ChosenAdversary | Scenario>;
    difficultySlider: {
        min: number;
        max: number;
    };
    rulesToShow: ReadonlyArray<RuleType>;
    expansionsToShow: ReadonlyArray<Expansion>;
};

export interface InvadersSaveState {
    difficultySlider: {
        min: number;
        max: number;
    };
    rulesToShow: ReadonlyArray<RuleType>;
    expansionsToShow: ReadonlyArray<Expansion>;
};
