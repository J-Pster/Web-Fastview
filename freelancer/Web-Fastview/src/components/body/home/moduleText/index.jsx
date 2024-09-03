import "./style.css"

export default function MainModuleText(props) {
    return (
        <h2 className="mainModulesText">
            {props.children}
        </h2>
    )
}