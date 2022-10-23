import { useState } from "react";
import "./rulePanel.css";
import { useDrag } from 'react-dnd';
import { Adversary } from "./invaderData";

export default function AdversaryDifficultyBox({data, level, onClick}: {data: Adversary, level: number, onClick: () => void}) {
    const [hover, setHover] = useState(false);

    const [{isDragging}, drag] = useDrag(() => ({
        type: "rule",
        item: {name: data.name, level: level},
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }), [data, level]);

    return (
        <div ref={drag} className={`adversary-difficulty-box ${hover ? "hover" : ""}`} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <span className="adversary-box-level">{level ? `L${level}` : "Base"}</span>
            <span className="adversary-box-difficulty">({data.difficulties[level]})</span>
        </div>
    )
}