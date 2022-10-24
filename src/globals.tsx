export enum Expansion {
    Base = "Base",
    Branch_and_Claw = "B & C",
    Feather_and_Flame = "F & F",
    Jagged_Earth = "JE",
    Horizons = "Horizons"
};

export const expansionList = [Expansion.Base, Expansion.Branch_and_Claw, Expansion.Feather_and_Flame, Expansion.Jagged_Earth, Expansion.Horizons];

export function maxDecimal(value: number, dp: number = 1 ){
    return +parseFloat(value.toFixed(dp)).toFixed( dp );
};

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function chooseRandom<T>(arr: ReadonlyArray<T>): T {
    const i = getRandomInt(0, arr.length);
    return arr[i];
}