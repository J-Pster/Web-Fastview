import "./style.css";

export default function MainImageNews(props) {
    return (
        <img className="mainImage" src={props.src} alt={props.alt} onClick={props.onClick} />
    )
}