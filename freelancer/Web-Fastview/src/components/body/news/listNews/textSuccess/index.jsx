import "./style.css"

export default function TextSuccess(props) {
    return (
        <div className="mainSuccess">
            <div className="textSucess">
                {props.children}
            </div>      
        </div>

    )
}