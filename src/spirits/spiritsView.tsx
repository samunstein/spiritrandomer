import { Component } from "react";
import { SpiritData } from "./spiritData";

interface SpiritState {
    data: SpiritData;
    chosen: boolean;
    disabled: boolean;
}

export interface SpiritsViewState {
    spirits: ReadonlyArray<SpiritState>;
}

export function initialState(): SpiritsViewState {
    var spirits: ReadonlyArray<SpiritData> = [
        {name: "Lightning's Swift Strike", complexity: 1, offense: 20, control: 6.5, fear: 10, defense: 2, utility: 7.5, image: "lightning.png"},
        {name: "Shadows Flicker Like Flame", complexity: 1, offense: 13, control: 10, fear: 20, defense: 2, utility: 1.5, image: "shadows.png"},
        {name: "Vital Strength of the Earth", complexity: 1, offense: 6, control: 7.5, fear: 3, defense: 20, utility: 7.5, image: "earth.png"},
        {name: "River Surges in Sunlight", complexity: 1, offense: 13, control: 19, fear: 2, defense: 2, utility: 13, image: "river.png"},
        {name: "Bringer of Dreams and Nightmares", complexity: 3, offense: 1, control: 7.5, fear: 20, defense: 6.5, utility: 6.5, image: "bringer.png"},
        {name: "A Spread of Rampant Green", complexity: 2, offense: 11.5, control: 8.5, fear: 5, defense: 20, utility: 10, image: "spread.png"},
        {name: "Thunderspeaker", complexity: 2, offense: 16, control: 19, fear: 7, defense: 5, utility: 1, image: "thunderspeaker.png"},
        {name: "Ocean's Hungry Grasp", complexity: 3, offense: 18.5, control: 13, fear: 13, defense: 9.5, utility: 5, image: "ocean.png"}
    ];

    return { spirits: spirits.map(spirit => ({data: spirit, chosen: false, disabled: false})) };
}

interface StateProps {
    state: SpiritsViewState;
    updateState: (prev: SpiritsViewState) => void
}


function SpiritsView({state, updateState}: StateProps) {
    function removeSpirit() {
        updateState({
            spirits: state.spirits.slice(1)
        })
    }

    return (
        <div>
            <div>Tässä on niitä spirittejä</div>
            <ul>
                {state.spirits.map((spirit: SpiritState) => <li>{spirit.data.name}</li>)}
            </ul>
            <button onClick={removeSpirit}>Try!</button>
        </div>
    )
}

export default SpiritsView;