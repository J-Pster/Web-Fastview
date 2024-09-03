import "./style.css"

export default function UserGretting(props) {
    return (
        <h1 className="userGrettingText">
            {props.children}
        </h1>
    )
}