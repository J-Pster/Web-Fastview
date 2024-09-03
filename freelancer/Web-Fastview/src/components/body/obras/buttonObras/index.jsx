import "./style.css";

export default function ButtonObras(props){
    return(
        <div 
        className="button-obras-div-modal"
        >
            <button
            className="button-obras-modal"
            type={props.type}
            onClick={props.onClick}
            >
                {props.children}
            </button>
        </div>
    )
}