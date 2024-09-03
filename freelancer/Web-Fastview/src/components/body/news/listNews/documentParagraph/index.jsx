import "./style.css";

export default function DocumentParagraph(props){
    return(
        <div className="documentPDiv">
            <p>{props.children}</p>
        </div>
    )
}