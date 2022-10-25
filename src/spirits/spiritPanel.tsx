import { useState } from "react";
import { maxDecimal } from "../globals";
import { getStatColor, MAX_STAT, SpiritData, Stat, statList } from "./spiritData";
import "./spiritPanel.css";
import { useDrag } from 'react-dnd';

export default function Spirit({spiritData, dim, onClick}: {spiritData: SpiritData, dim: boolean, onClick: (event: React.MouseEvent<HTMLElement>) => void}) {
    const [hover, setHover] = useState(false);

    function getStatDivStyle(stat: Stat): React.CSSProperties {
        const value = spiritData[stat]
        const len = Math.min(Math.max(value / MAX_STAT * 100, 0), 100);
        return {width: `${len}%`, backgroundColor: getStatColor(stat)};
    }

    const [{isDragging}, drag] = useDrag(() => ({
        type: "spirit",
        item: {name: spiritData.name},
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }), [spiritData]);

    return (
        <div ref={drag} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`spirit-panel ${dim ? "dim" : ""}`}>
            <div className="spirit-name">{spiritData.name}</div>
            {hover ? 
                <div className="spirit-stats">
                    <div className="spirit-stat-list">
                        <div className="spirit-stat-header">
                            {statList.map(stat => <div>{stat}</div>)}
                        </div>
                        <div className="spirit-stat-values">
                            {statList.map(stat => <div style={getStatDivStyle(stat)}>{maxDecimal(spiritData[stat])}</div>)}
                        </div>
                    </div>
                    <div className="spirit-stat-complexity">Complexity: {spiritData.complexity}</div>
                </div>
                 : <></>
            }
            <img className={hover ? "hover" : ""} src={`/spiritImages/${spiritData.image}`}></img>    
        </div>
    )
}