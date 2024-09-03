import "./style.css";

export default function DescriptionParagraph(props){
    return (
        <div
            className="descricaoNews"
            dangerouslySetInnerHTML={{__html: props.children}}
            style={{whiteSpace: 'pre-line', color: '#8b91a0'}}
        ></div>
    )
}