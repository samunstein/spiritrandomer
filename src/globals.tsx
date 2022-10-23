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
