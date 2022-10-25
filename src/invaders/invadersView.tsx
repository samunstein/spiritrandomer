import { isMobile } from 'react-device-detect';
import { getTrackBackground, Range as InputRange } from 'react-range';
import { chooseRandom, Expansion, expansionList } from "../globals";
import AdversaryPanel from "./adversaryPanel";
import InvaderDropArea from "./dropArea";
import { adversaries, Adversary, ChosenAdversary, InvadersSaveState, InvadersViewState, RuleState, RuleType, Scenario, scenarios, showableRulesList } from "./invaderData";
import "./invadersView.css";
import ScenarioPanel from "./scenarioPanel";

interface StateProps {
    state: InvadersViewState;
    updateState: (newState: InvadersViewState) => void
}

const DIFFICULTY_MIN = 0;
const DIFFICULTY_MAX = 15;

export function initialState(): InvadersViewState {
    return { 
        available: [...adversaries.map(adv => ({data: adv, disabled: false})), ...scenarios.map(sce => ({data: sce, disabled: false}))], 
        chosen: [], 
        difficultySlider: {min: DIFFICULTY_MIN, max: DIFFICULTY_MAX},
        rulesToShow: showableRulesList.filter(r => r !== RuleType.SpecialScenario),
        expansionsToShow: expansionList
    };
}

export function toSaveState(state: InvadersViewState): InvadersSaveState {
    return {
        difficultySlider: state.difficultySlider,
        rulesToShow: state.rulesToShow,
        expansionsToShow: state.expansionsToShow,
        disabled: state.available.filter(av => av.disabled).map(av => av.data.name)
    };
}

export function fromSaveState(saved: InvadersSaveState): InvadersViewState {
    const initial = initialState();
    const disabled = saved.disabled || [];
    return {
        difficultySlider: saved.difficultySlider,
        rulesToShow: saved.rulesToShow,
        expansionsToShow: saved.expansionsToShow,
        available: initial.available.map(rule => disabled.includes(rule.data.name) ? {...rule, disabled: true} : rule),
        chosen: initial.chosen
    };
}

function InvadersView({state, updateState}: StateProps) {

    function changeChosenLevel(toChange: string, level: number) {
        updateState({
            ...state, 
            chosen: state.chosen.map(chosen => {
                if (chosen.name !== toChange) return chosen;
                else return {...chosen, chosenLevel: level}
            })
        });
    }

    function choose(toChoose: string, level?: number) {
        const ruleState = state.available.find(rule => rule.data.name === toChoose);
        if (ruleState !== undefined) {
            let toAdd: ChosenAdversary | Scenario;
            switch (ruleState.data.type) {
                case RuleType.Adversary: {
                    toAdd = {...ruleState.data, chosenLevel: level || 0}
                    break;
                }
                case RuleType.Scenario:
                case RuleType.SpecialScenario: {
                    toAdd = ruleState.data
                }
            }

            updateState({
                ...state, 
                available: state.available.filter(rule => rule.data.name !== ruleState.data.name),
                chosen: [...state.chosen.filter(rule => rule.name !== ruleState.data.name), toAdd]
            });
        }        
    }

    function unchoose(toUnchoose: string) {
        const rule = state.chosen.find(rule => rule.name === toUnchoose);

        if (rule !== undefined) {
            updateState({
                ...state, 
                available: [...state.available.filter(existing => existing.data.name !== rule.name), {data: rule, disabled: false}],
                chosen: state.chosen.filter(existing => existing.name !== rule.name)
            });
        }
    }

    function trashRules(): void {
        updateState({
            ...state, 
            available: [...state.available, ...state.chosen.map(rule => ({data: rule, disabled: false}))],
            chosen: []
        });
    }

    function distinct<T>(arr: ReadonlyArray<T>): ReadonlyArray<T> {
        return arr.filter((n, i) => arr.indexOf(n) === i);
    }

    function distanceFromRange(val: number, min: number, max: number): number {
        return Math.max(Math.max(0, min - val), Math.max(0, val - max));
    }

    function arrayValuesOverlap(arr1: ReadonlyArray<number>, arr2: ReadonlyArray<number>): boolean {
        return arr1.map(v => arr2.indexOf(v) !== -1).includes(true);
    }

    function doRandom(): void {
        const scenarioNotAlreadyChosen = state.chosen.map(rule => rule.type).filter(t => t === RuleType.Scenario || t === RuleType.SpecialScenario).length === 0;
        const adversaryNotAlreadyChosen = state.chosen.map(rule => rule.type).filter(t => t === RuleType.Adversary).length === 0;

        const available = state.available.filter(filterRulesByShowParameters).filter(rule => !rule.disabled).map(rule => rule.data)
        const scenariosToChooseFrom: ReadonlyArray<Scenario> = scenarioNotAlreadyChosen 
            ? available.filter((rule): rule is Scenario => rule.type === RuleType.Scenario || rule.type === RuleType.SpecialScenario)
            : [];
        const adversariesToChooseFrom: ReadonlyArray<Adversary> = adversaryNotAlreadyChosen
            ? available.filter((rule): rule is Adversary => rule.type === RuleType.Adversary).map(rule => rule as Adversary)
            : [];

        const targetAddedDifficulty = {min: state.difficultySlider.min - getTotalDifficulty(), max: state.difficultySlider.max - getTotalDifficulty()};

        const scenarioDifficulties = distinct([...scenariosToChooseFrom.map(sc => sc.difficulty), 0]);
        const adversaryDifficulties = distinct([...adversariesToChooseFrom.map(ad => ad.difficulties).flat(), 0]);

        const difficultyMatrix = scenarioDifficulties.map(sced => adversaryDifficulties.map(advd => ({
            scenario: sced, adversary: advd, score: distanceFromRange(sced + advd, targetAddedDifficulty.min, targetAddedDifficulty.max) + (advd ? 0 : 0.1)
        }))).flat();
        const bestScore = Math.min(...difficultyMatrix.map(dif => dif.score));
        const bestDifficulties = difficultyMatrix.filter(dif => dif.score === bestScore);

        const chosenScenario = scenariosToChooseFrom.length ? chooseRandom(scenariosToChooseFrom.filter(sce => bestDifficulties.map(dif => dif.scenario).includes(sce.difficulty))) : undefined;
        const adversaryDifficultiesShort = bestDifficulties.filter(dif => dif.scenario === (chosenScenario ? chosenScenario.difficulty : 0)).map(dif => dif.adversary);

        const chosenAdversary = adversariesToChooseFrom.length ? chooseRandom(adversariesToChooseFrom.filter(adv => arrayValuesOverlap(adv.difficulties, adversaryDifficultiesShort))) : undefined;
        const chosenAdversaryDifficulty = chosenAdversary ? chosenAdversary.difficulties.indexOf(chooseRandom(chosenAdversary.difficulties.filter(dif => adversaryDifficultiesShort.includes(dif)))) : undefined;

        const chosen: ReadonlyArray<Scenario | ChosenAdversary> = [chosenScenario, (chosenAdversaryDifficulty !== undefined ? {...chosenAdversary, chosenLevel: chosenAdversaryDifficulty} : undefined)].filter((v): v is Scenario | ChosenAdversary => v !== undefined);

        updateState({
            ...state,
            available: state.available.filter(av => !chosen.map(c => c.name).includes(av.data.name)),
            chosen: [...state.chosen.filter(ch => !chosen.map(c => c.name).includes(ch.name)), ...chosen]
        });
    }

    function filterRulesByShowParameters(rule: RuleState): boolean {
        if (!state.expansionsToShow.includes(rule.data.expansion)) return false;
        if (!state.rulesToShow.includes(rule.data.type)) return false;
        return true;
    }

    function flipExpansionShow(exp: Expansion): void {
        if (state.expansionsToShow.includes(exp)) {
            updateState({...state, expansionsToShow: state.expansionsToShow.filter(existing => exp !== existing)});
        } else {
            updateState({...state, expansionsToShow: [...state.expansionsToShow, exp]});
        }
    }

    function flipRuleShow(rule: RuleType): void {
        if (state.rulesToShow.includes(rule)) {
            updateState({...state, rulesToShow: state.rulesToShow.filter(existing => rule !== existing)});
        } else {
            updateState({...state, rulesToShow: [...state.rulesToShow, rule]});
        }
    }

    function maybeFlipDisabled(event: React.MouseEvent<HTMLElement>, toFlip: RuleState): void {
        // Don't disable on single click on mobile, since that is used for hover
        if (isMobile && event.detail === 1) return;

        updateState({...state, available: state.available.map(rule => {
            if (rule.data.name !== toFlip.data.name) {
                return rule;
            } else {
                return {...toFlip, disabled: !toFlip.disabled};
            } 
        })})
    }

    function getTotalDifficulty(): number {
        return state.chosen.map(rule => {
            switch (rule.type) {
                case RuleType.Adversary: {
                    return rule.difficulties[rule.chosenLevel];
                }
                case RuleType.Scenario:
                case RuleType.SpecialScenario: {
                    return rule.difficulty;
                }
            }
        }).reduce((acc, next) => acc + next, 0);
    }

    function difficultySliderChange([first, second]: [number, number]): void {
        updateState({...state, difficultySlider: {min: Math.min(first, second), max: Math.max(first, second)}})
    }

    return (
        <div className="spirit-page">
            <div className="unchosen-side">
                <div className="drop-area-heading">Rulesets to choose from</div>
                <div className="show-parameter-area">
                    <span>Expansion: </span>
                    {expansionList.map(exp => <span className={`parameter-choice ${state.expansionsToShow.includes(exp) ? "chosen" : ""}`} onClick={() => flipExpansionShow(exp)}>{exp}</span>)}
                </div>
                <div className="show-parameter-area">
                    <span>Rule types: </span>
                    {showableRulesList.map(rule => <span className={`parameter-choice ${state.rulesToShow.includes(rule) ? "chosen" : ""}`} onClick={() => flipRuleShow(rule)}>{rule}</span>)}
                </div>
                <InvaderDropArea state={state} dropFn={(name: string, _?: number) => unchoose(name)}>
                    <div className="unchosen-area">
                        {state.available.filter(filterRulesByShowParameters).map(rule => {switch(rule.data.type) {
                            case RuleType.Adversary: {
                                return <AdversaryPanel data={rule.data} dim={rule.disabled} onClick={(event:React.MouseEvent<HTMLElement>) => maybeFlipDisabled(event, rule)} />
                            }
                            case RuleType.SpecialScenario:
                            case RuleType.Scenario: {
                                return <ScenarioPanel data={rule.data} dim={rule.disabled} onClick={(event: React.MouseEvent<HTMLElement>) => maybeFlipDisabled(event, rule)} />
                            }
                        }})}
                    </div>
                </InvaderDropArea>
            </div>
            
            <div className="chosen-side">
                <div className="drop-area-heading">Rulesets chosen</div>
                <div className="show-parameter-button">
                    <span className="randomer-button" onClick={trashRules}>Trash rules</span>
                </div>
                <InvaderDropArea state={state} dropFn={(name: string, level?: number) => choose(name, level)}>
                    <div className="chosen-area">
                        {state.chosen.map(rule => {switch(rule.type) {
                            case RuleType.Adversary: {
                                return <AdversaryPanel data={rule} dim={false} onClick={() => ""} chosenDifficulty={rule.chosenLevel} changeLevel={(level: number) => changeChosenLevel(rule.name, level)} />
                            }
                            case RuleType.SpecialScenario:
                            case RuleType.Scenario: {
                                return <ScenarioPanel data={rule} dim={false} onClick={() => ""} />
                            }
                        }})}
                    </div>
                </InvaderDropArea>
            </div>

            <div>
                <div className="stats-result">
                    <div className="stats-heading">Rule stats</div>
                    <div className="stats-heading">
                        Difficulty: {getTotalDifficulty()}
                    </div>
                </div>
                
                <div className="randomer">
                    <div>Set wanted difficulty:</div>
                    <div className="difficulty-slider-area">
                        <div className="difficulty-slider">
                            <InputRange min={DIFFICULTY_MIN} max={DIFFICULTY_MAX} 
                                values={[state.difficultySlider.min, state.difficultySlider.max]} 
                                onChange={(values: any) => difficultySliderChange(values as [number, number])}
                                draggableTrack
                                renderTrack={({ props, children }) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '8px',
                                            background: `${getTrackBackground({
                                                min: DIFFICULTY_MIN,
                                                max: DIFFICULTY_MAX,
                                                values: [state.difficultySlider.min, state.difficultySlider.max],
                                                colors: ["#fff", "var(--theme-color)", "#fff"]
                                            })}`
                                            }}
                                        >
                                        {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '25px',
                                        width: '25px',
                                        borderRadius: "100%",
                                        backgroundColor: "var(--theme-color)"
                                    }}
                                    />
                            )} />
                        </div>
                        <div className="difficulty-slider-result">{state.difficultySlider.min}-{state.difficultySlider.max}</div>
                    </div>
                    <div className="randomer-execute">
                        <span className="randomer-button" onClick={doRandom}>Make me a game!</span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default InvadersView;