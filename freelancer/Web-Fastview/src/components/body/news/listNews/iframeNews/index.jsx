import "./style.css";

export default function IframeNews(props) {
    return (
        <iframe
            className="videoPlayer"
            src={props.src}
            title={props.title}
            allow={props.allow}
            allowFullScreen={props.allowFullScreen}
        >
            {props.children}
        </iframe>
    )
}