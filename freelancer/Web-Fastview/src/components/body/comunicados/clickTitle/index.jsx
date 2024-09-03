import "./style.css";

export default function ClickTitleComunicados (props){
    return( 
    <div 
    onClick={props.onClick}
    className="clickTitleComunicados">
        {props.children}
        </div>
        )
}