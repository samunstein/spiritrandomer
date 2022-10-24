import { useDrop } from 'react-dnd'
import { InvadersViewState } from './invaderData'

export default function InvaderDropArea({children, dropFn, state}: {
    children?: 
          string 
        | number 
        | React.ReactElement<any, string | React.JSXElementConstructor<any>> 
        | string[] 
        | number[] 
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[],
    dropFn: (name: string, level?: number) => void,
    state: InvadersViewState,
}) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "rule",
        drop: (item: {name: string, level?: number}) => {
            dropFn(item.name, item.level);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        })
        }), [state])
    
    return (
        <div ref={drop} className={`drop-area ${isOver ? "dragging-over" : ""}`}>
            {children}
        </div>
    )
}