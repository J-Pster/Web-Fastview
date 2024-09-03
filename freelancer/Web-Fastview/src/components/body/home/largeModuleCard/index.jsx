import "./style.css"
import Icon from "../../icon"

export default function LargeModuleCard(props) {
    return (
        <div className="largeModuleCard">
            <a href={props.link} target="_blank" rel="noreferrer" className="moduleRedirect" >
                <div className="largeModuleCardTitle">
                    <div className="largeModuleIconDiv">
                        <Icon type={props.icon} className="largeModuleIcon" />
                    </div>
                    <h4 className="h4-module">{props.title}</h4>                    
                </div>
                {props.children}
            </a>
        </div>
    )
}