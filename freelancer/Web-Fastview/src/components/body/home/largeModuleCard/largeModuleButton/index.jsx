import "./style.css";

export default function LargeModuleButton(props) {
    return (
        <button
            className="largeModuleButtom"
            onClick={props.onClick}
            type={props.type}
        >
            {props.children}
        </button>
    )
}