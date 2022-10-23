import { useDrop } from 'react-dnd'
import { SpiritData, SpiritsViewState } from './spiritData'

export default function DropArea({children, dropFn, state}: {
    children?: 
        string 
        | number 
        | React.ReactElement<any, string | React.JSXElementConstructor<any>> 
        | string[] 
        | number[] 
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[],
    dropFn: (spirit: string) => void,
    state: SpiritsViewState,
}) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "spirit",
        drop: (item: {name: string}) => {
            dropFn(item.name);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        })
        }), [state])
    
    return (
        <div ref={drop} className={isOver ? "dragging-over" : ""}>
            {children}
        </div>
    )
}