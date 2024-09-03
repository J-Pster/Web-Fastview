import "./style.css"

export default function BoxImageVM (props){
    return(
        <div className="boxImageVM" onClick={props.onClick}>
            {props.children}
        </div>
    )
}