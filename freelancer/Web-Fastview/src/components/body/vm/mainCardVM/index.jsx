import "./style.css"

export default function CardVM(props) {
    return (
        <div className="cardContainerVM"
            onClick={props.onClick}>
            {props.children}
        </div>
    )
}