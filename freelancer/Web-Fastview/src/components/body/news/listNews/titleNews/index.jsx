import "./style.css";

export default function TitleNews(props) {
    return (
        <h1 className="titleNews" >
            <span>
                <div className="d-flex align-items-center">
                    <div>{ props.children }</div>
                    <div className="ms-3 d-flex">
                        { props?.filter }
                    </div>
                </div>
            </span>
            <div className="iconTitle">
                {props.icon}
            </div>
        </h1>
    )
}