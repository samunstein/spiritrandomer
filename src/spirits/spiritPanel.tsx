import { useState } from "react";
import { SpiritData, statList } from "./spiritData";

export default function Spirit({spiritData, dim}: {spiritData: SpiritData, dim: boolean}) {
    const [hover, setHover] = useState(false);

    return (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`spirit-panel ${dim ? "dim" : ""}`}>
            <div className="spirit-name">{spiritData.name}</div>
            {hover ? 
                <div>
                    {statList.map(stat => <div>{stat}: {spiritData[stat]}</div>)}
                    <div>Complexity: {spiritData.complexity}</div>
                </div> : 
                <img src={`/spiritImages/${spiritData.image}`}></img> }
        </div>
    )
}