import "./style.css"
import Icon from "../../icon"
export default function ButtonVM(props){
    return (
        <Icon type={props.type} className={"btnVM "+props?.className} onClick={props.onClick} />
    )
}