import { useState } from "react";
import "./rulePanel.css";
import { Adversary } from "./invaderData";
import AdversaryDifficultyBox from "./adversaryDifficultyBox";

export default function AdversaryPanel({data, dim, onClick, chosenDifficulty, changeLevel}: 
    {data: Adversary, dim: boolean, onClick: () => void, chosenDifficulty?: number, changeLevel?: (level: number) => void}) {
    const [hover, setHover] = useState(false);

    return (
        <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`rule-panel ${dim ? "dim" : ""}`}>
            <div className="rule-name">{data.name}{(chosenDifficulty !== undefined) ? `, Level: ${chosenDifficulty ? `${chosenDifficulty}` : `Base`}` : <></>}</div>
            <div className="rule-data">
                <img className={hover ? "hover" : ""} src={`/invaderImages/${data.image}`}></img>    
                {hover ? 
                    <div className="adversary-boxes">
                        {Array.from(data.difficulties.keys()).map(level => <AdversaryDifficultyBox level={level} data={data} onClick={() => changeLevel !== undefined ? changeLevel(level) : ""}></AdversaryDifficultyBox>)}
                    </div>
                    : <></>
                }
            </div>
        </div>
    )
}