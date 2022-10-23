import { useState } from "react";
import "./rulePanel.css";
import { Adversary, Scenario } from "./invaderData";
import AdversaryDifficultyBox from "./adversaryDifficultyBox";
import {useDrag} from "react-dnd";

export default function AdversaryPanel({data, dim, onClick}: 
    {data: Scenario, dim: boolean, onClick: () => void}) {
    const [hover, setHover] = useState(false);

    const [{isDragging}, drag] = useDrag(() => ({
        type: "rule",
        item: {name: data.name},
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }), [data]);

    return (
        <div ref={drag} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`rule-panel ${dim ? "dim" : ""}`}>
            <div className="rule-name">{data.name}</div>
            {hover ? 
                <div className="scenario-difficulty">
                    Difficulty: {data.difficulty}
                </div>
                 : <></>
            }
            <img className={hover ? "hover" : ""} src={`/invaderImages/${data.image}`}></img>    
        </div>
    )
}