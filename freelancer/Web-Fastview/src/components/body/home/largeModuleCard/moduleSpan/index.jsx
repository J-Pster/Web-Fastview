import "./style.css";

export default function LargeModuleSpan(props) {
   // MUDAR DE ACORDO COM O QUE RECEBER POR PROPS
    var color 
    switch (props.className) {
        case "red-module":
            color = "redModuleSpan";
            break;
        case "blue-module":
            color = "blueModuleSpan";
            break;
        case "gray-module":
            color = "grayModuleSpan";
            break;
        case "black-module":
            color = "blackModuleSpan";
            break
            default:
                color = "blueModuleSpan"
    }
    return (
        <span className={color}>
            {props.children}
        </span>
    )
}