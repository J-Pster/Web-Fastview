import "./style.css";

export default function LargeModuleCardInfo(props){
    return(
        <div className="largeModuleCardInfo">
            <span className="spanInfoTitle">{props.title}</span>
            {props.children}
        </div>
    )
}