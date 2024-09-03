import "./style.css";

export default function NewsHashtag(props) {
    return (
        <h6 className="commentHashtag">
            {props.children}
        </h6>
    )
}