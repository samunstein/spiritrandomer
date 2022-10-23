import { Expansion, expansionList, maxDecimal } from "../globals";
import { Complexity, complexityList, getMajorStatList, getStatColor, MAX_STAT, SpiritData, spirits, SpiritState, SpiritsViewState, Stat, statList } from "./spiritData";
import Spirit from "./spiritPanel"
import "./spiritsView.css";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import SpiritDropArea from "./dropArea";

const MAD_SLIDER_SMOOTHNESS = 40;

export function initialState(): SpiritsViewState {
    return { 
        available: spirits.map(spirit => ({data: spirit, disabled: false})), 
        chosen: [], 
        madSliderRawValue: MAD_SLIDER_SMOOTHNESS / 4, 
        randomTowardsBalance: true, 
        numberOfSpiritsToRandomize: 4,
        complexitiesToShow: complexityList,
        prominentStatsToShow: statList,
        expansionsToShow: expansionList
    };
}

interface StateProps {
    state: SpiritsViewState;
    updateState: (newState: SpiritsViewState) => void
}

function SpiritsView({state, updateState}: StateProps) {
    function flipDisabled(toFlip: SpiritState) {
        updateState({
            ...state,
            available: state.available.map(spirit => {
                if (spirit !== toFlip) return spirit
                else return {...spirit, disabled: !spirit.disabled};
            }),
            chosen: state.chosen.map(spirit => {
                if (spirit !== toFlip) return spirit
                else return {...spirit, disabled: !spirit.disabled};
            })
        })
    }

    function choose(toChoose: string) {
        const spiritState = state.available.find(spirit => spirit.data.name === toChoose);
        if (spiritState !== undefined) {
            updateState({
                ...state, 
                available: state.available.filter(spirit => spirit.data.name !== spiritState.data.name),
                chosen: [...state.chosen.filter(spirit => spirit.data.name !== spiritState.data.name), {...spiritState, disabled: false}]
            });
        }        
    }

    function unchoose(toUnchoose: string) {
        const spiritState = state.chosen.find(spirit => spirit.data.name === toUnchoose);

        if (spiritState !== undefined) {
            updateState({
                ...state, 
                available: [...state.available.filter(spirit => spirit.data.name !== spiritState.data.name), spiritState],
                chosen: state.chosen.filter(spirit => spirit.data.name !== spiritState.data.name)
            });
        }
    }

    function getSpiritsStatAverage(stat: Stat, spirits: ReadonlyArray<SpiritState>): number {
        const stats = spirits.map(chosen => chosen.data[stat]);
        const len = stats.length;
        return stats.reduce((acc, curr) => acc + curr / len, 0);
    }

    function getSpiritStatsMAD(spirits: ReadonlyArray<SpiritState>): number {
        const avgs = statList.map(stat => getSpiritsStatAverage(stat, spirits));
        return meanAvgDev(avgs);
    }

    function meanAvgDev(nums: ReadonlyArray<number>): number {
        const len = nums.length;
        const avg = nums.reduce((acc, curr) => acc + curr / len, 0);
        const variance = nums.reduce((acc, curr) => acc + (Math.abs(curr - avg)) / len, 0);
        return variance;
    }

    function sliderMoved(event: React.ChangeEvent<HTMLInputElement>): void {
        updateState({...state, madSliderRawValue: parseInt(event.target.value)});
    }

    function actualMADTargetValue(): number {
        return state.madSliderRawValue / MAD_SLIDER_SMOOTHNESS * 10;
    }

    function randomTowardsBalance(is: boolean): void {
        updateState({...state, randomTowardsBalance: is});
    }

    function spiritNumberChange(num: number): void {
        updateState({...state, numberOfSpiritsToRandomize: num});
    }

    function filterSpiritByShowParameters(spirit: SpiritState): boolean {
        if (!state.complexitiesToShow.includes(spirit.data.complexity)) return false;
        if (!getMajorStatList(spirit.data).map(stat => state.prominentStatsToShow.includes(stat)).includes(true)) return false;
        if (!state.expansionsToShow.includes(spirit.data.expansion)) return false;
        return true;
    }

    function flipStatShow(stat: Stat): void {
        if (state.prominentStatsToShow.includes(stat)) {
            updateState({...state, prominentStatsToShow: state.prominentStatsToShow.filter(existing => stat !== existing)});
        } else {
            updateState({...state, prominentStatsToShow: [...state.prominentStatsToShow, stat]});
        }
    }

    function flipComplexityShow(complexity: Complexity): void {
        if (state.complexitiesToShow.includes(complexity)) {
            updateState({...state, complexitiesToShow: state.complexitiesToShow.filter(existing => complexity !== existing)});
        } else {
            updateState({...state, complexitiesToShow: [...state.complexitiesToShow, complexity]});
        }
    }

    function flipExpansionShow(exp: Expansion): void {
        if (state.expansionsToShow.includes(exp)) {
            updateState({...state, expansionsToShow: state.expansionsToShow.filter(existing => exp !== existing)});
        } else {
            updateState({...state, expansionsToShow: [...state.expansionsToShow, exp]});
        }
    }

    function getRandomableSpirits(): ReadonlyArray<SpiritState> {
        return state.available.filter(filterSpiritByShowParameters).filter(spirit => !spirit.disabled);
    }

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    function calculateWouldBeMAD(chosen: Array<SpiritState>, spirit: SpiritState): number {
        const stats = statList.map(stat => getSpiritsStatAverage(stat, [...chosen, spirit]));
        return meanAvgDev(stats);
    }

    function mutableChoose(chosen: Array<SpiritState>, available: Array<SpiritState>, spirit: SpiritState): void {
        chosen.push(spirit);
        available.splice(available.indexOf(spirit), 1);
    }

    function chooseFullRandom(chosen: Array<SpiritState>, available: Array<SpiritState>): void {
        if (available.length > 0) {
            const i = getRandomInt(0, available.length);
            mutableChoose(chosen, available, available[i]);
        }
    }

    function chooseCarefulRandom(chosen: Array<SpiritState>, available: Array<SpiritState>): void {
        if (available.length > 0) {
            const wouldBeMADValues = available.map(spirit => ({spirit: spirit, mad: calculateWouldBeMAD(chosen, spirit)}))

            let wouldBeAcceptable;
            if (state.randomTowardsBalance) {
                wouldBeAcceptable = wouldBeMADValues.filter(withValue => withValue.mad < actualMADTargetValue())
            } else {
                wouldBeAcceptable = wouldBeMADValues.filter(withValue => withValue.mad > actualMADTargetValue())
            }

            if (wouldBeAcceptable.length > 0) {
                const i = getRandomInt(0, wouldBeAcceptable.length);
                mutableChoose(chosen, available, wouldBeAcceptable[i].spirit);
            } else {
                
                wouldBeMADValues.sort((a, b) => a.mad - b.mad);

                if (state.randomTowardsBalance) {
                    mutableChoose(chosen, available, wouldBeMADValues[0].spirit);
                } else {
                    mutableChoose(chosen, available, wouldBeMADValues[wouldBeMADValues.length - 1].spirit);
                }
            }
        }
    }

    function chooseSelectiveRandom(chosen: Array<SpiritState>, available: Array<SpiritState>): void {
        if (state.randomTowardsBalance) {
            if (getSpiritStatsMAD(chosen) < actualMADTargetValue()) {
                chooseFullRandom(chosen, available);
            } else {
                chooseCarefulRandom(chosen, available);
            }
        } else {
            if (getSpiritStatsMAD(chosen) > actualMADTargetValue()) {
                chooseFullRandom(chosen, available);
            } else {
                chooseCarefulRandom(chosen, available);
            }
        }
    }

    function trashTeam(): void {
        updateState({
            ...state,
            chosen: [],
            available: [...state.available, ...state.chosen]
        });
    }

    function doRandom(): void {
        let spiritsLeftToRandom = Math.max(state.numberOfSpiritsToRandomize - state.chosen.length, 0);
        
        const carefulRandom = Math.min(1, spiritsLeftToRandom);
        spiritsLeftToRandom -= carefulRandom;

        const selectiveRandom = Math.min(Math.ceil(state.numberOfSpiritsToRandomize / 2) - 1, spiritsLeftToRandom);
        spiritsLeftToRandom -= selectiveRandom;

        const fullRandom = spiritsLeftToRandom;

        let chosenMutable = [...state.chosen];
        let availableMutable = [...getRandomableSpirits()];

        for (let i = 0; i < fullRandom; i++) {
            chooseFullRandom(chosenMutable, availableMutable);
        }
        for (let i = 0; i < selectiveRandom; i++) {
            chooseSelectiveRandom(chosenMutable, availableMutable);
        }
        for (let i = 0; i < carefulRandom; i++) {
            chooseCarefulRandom(chosenMutable, availableMutable);
        }

        updateState({
            ...state, 
            chosen: [...chosenMutable], 
            available: state.available.filter(available => !chosenMutable.map(chosen => chosen.data.name).includes(available.data.name))
        });
    }

    function getStatDivStyle(stat: Stat): React.CSSProperties {
        const value = getSpiritsStatAverage(stat, state.chosen);
        const len = Math.min(Math.max(value / MAX_STAT * 100, 0), 100);
        return {width: `${len}%`, backgroundColor: getStatColor(stat)};
    }

    return (
        <div className="spirit-page">
            <div className="unchosen-side">
                <div className="drop-area-heading">Spirits to choose from</div>
                <div className="show-parameter-area">
                    <span>Expansion: </span>
                    {expansionList.map(exp => <span className={`parameter-choice ${state.expansionsToShow.includes(exp) ? "chosen" : ""}`} onClick={() => flipExpansionShow(exp)}>{exp}</span>)}
                </div>
                <div className="show-parameter-area">
                    <span>Complexities: </span>
                    {complexityList.map(complexity => <span className={`parameter-choice ${state.complexitiesToShow.includes(complexity) ? "chosen" : ""}`} onClick={() => flipComplexityShow(complexity)}>{complexity}</span>)}
                </div>
                <div className="show-parameter-area">
                    <span>Stats good at: </span>
                    {statList.map(stat => <span className={`parameter-choice ${state.prominentStatsToShow.includes(stat) ? "chosen" : ""}`} onClick={() => flipStatShow(stat)}>{stat}</span>)}
                </div>
                <SpiritDropArea state={state} dropFn={(name: string) => unchoose(name)}>
                    <div className="unchosen-area">
                        {state.available.filter(filterSpiritByShowParameters).map((spirit: SpiritState) => <Spirit spiritData={spirit.data} dim={spirit.disabled} onClick={() => flipDisabled(spirit)} />)}
                    </div>
                </SpiritDropArea>
            </div>
            
            <div>
                <div className="drop-area-heading">Spirits chosen</div>
                <div className="show-parameter-button">
                    <span className="randomer-button" onClick={trashTeam}>Trash team</span>
                </div>
                <SpiritDropArea state={state} dropFn={(name: string) => choose(name)}>
                    <div className="chosen-area">
                        {state.chosen.map((spirit: SpiritState) => <Spirit spiritData={spirit.data} dim={spirit.disabled} onClick={() => ""} />)}
                    </div>
                </SpiritDropArea>
            </div>

            <div>
                <div className="stats-result">
                    <div className="stats-heading">Team stats</div>
                    <div className="stats-area">
                        <div className="spirit-stat-list">
                            <div className="spirit-stat-header">
                                {statList.map(stat => <div>{stat}</div>)}
                            </div>
                            <div className="spirit-stat-values">
                                {statList.map(stat => <div style={getStatDivStyle(stat)}>{maxDecimal(getSpiritsStatAverage(stat, state.chosen))}</div>)}
                            </div>
                        </div>
                        <div className="mad-result">MAD: {maxDecimal(getSpiritStatsMAD(state.chosen))}</div>
                    </div>
                </div>
                
                <div className="randomer">
                    <div className="numbers">
                        <div className="randomer-parameter-heading">How many spirits do you want (in total)?</div>
                        {[1, 2, 3, 4, 5, 6].map(num => <span className={`parameter-choice ${state.numberOfSpiritsToRandomize === num ? "chosen" : ""}`} onClick={() => spiritNumberChange(num)}>{num}</span>)}
                    </div>
                    <div className="slider">
                        <div className="randomer-parameter-heading">Treshold Mean Absolute Deviation (MAD)?</div>
                        <input type="range" min="0" max={MAD_SLIDER_SMOOTHNESS} step="1" onChange={sliderMoved} value={state.madSliderRawValue}></input>
                        <span>{maxDecimal(actualMADTargetValue())}</span>
                    </div>
                    <div className="balance-direction">
                        <div className="randomer-parameter-heading">Direction from MAD treshold?</div>
                        <div>
                            <span onClick={() => randomTowardsBalance(true)} className={`parameter-choice ${state.randomTowardsBalance ? "chosen" : ""}`}>Balance</span> 
                            <span className={`parameter-choice ${!state.randomTowardsBalance ? "chosen" : ""}` } onClick={() => randomTowardsBalance(false)}>Imbalance</span>
                        </div>
                    </div>
                    <div className="randomer-execute">
                        <span className="randomer-button" onClick={doRandom}>Make me a team!</span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default SpiritsView;