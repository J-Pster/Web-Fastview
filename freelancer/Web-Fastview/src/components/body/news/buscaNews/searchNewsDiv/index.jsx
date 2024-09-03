import "./style.css"

export default function SearchNewsDiv(props) {
    return (
        <div className="buscaNews">
            {props.children}
        </div>
    )
}