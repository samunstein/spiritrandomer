import { Expansion, expansionList } from "../globals";
import AdversaryPanel from "./adversaryPanel";
import InvaderDropArea from "./dropArea";
import { adversaries, ChosenAdversary, InvadersViewState, RuleState, RuleType, Scenario, scenarios, showableRulesList } from "./invaderData";
import ScenarioPanel from "./scenarioPanel";

interface StateProps {
    state: InvadersViewState;
    updateState: (newState: InvadersViewState) => void
}

export function initialState(): InvadersViewState {
    return { 
        available: [...adversaries.map(adv => ({data: adv, disabled: false})), ...scenarios.map(sce => ({data: sce, disabled: false}))], 
        chosen: [], 
        difficultySliderMin: 0,
        difficultySliderMax: 15,
        rulesToShow: showableRulesList.filter(r => r !== RuleType.SpecialScenario),
        expansionsToShow: expansionList
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

    function doRandom(): void {
        // TODO
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

    function flipDisabled(toFlip: RuleState): void {
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
                                return <AdversaryPanel data={rule.data} dim={rule.disabled} onClick={() => flipDisabled(rule)} />
                            }
                            case RuleType.SpecialScenario:
                            case RuleType.Scenario: {
                                return <ScenarioPanel data={rule.data} dim={rule.disabled} onClick={() => flipDisabled(rule)} />
                            }
                        }})}
                    </div>
                </InvaderDropArea>
            </div>
            
            <div>
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
                    <div>Tähän se difficulty valinta</div>
                    <div className="randomer-execute">
                        <span className="randomer-button" onClick={doRandom}>Make me a game!</span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default InvadersView;