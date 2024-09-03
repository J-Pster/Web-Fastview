import "./style.css";

export default function TextNewsDivContainer(props) {
    return (
        <div className="textNewsDivContainer">
            {props.children}
        </div>
    )
}