import "./style.css";
import Input from "../form/input";
import Icon from "../icon";
// import Icon from "../icon";

export default function CardGaleria(props) {
    return (
        <>
            {(
                props.src ?
                    <>
                        <div className="galeria-div-container">
                            {(
                                props.icon ?
                                    <div className="div-delete-galeria2">
                                        <span className="span-delete-galeria">
                                            {props.icon}
                                        </span>
                                    </div>
                                    : ""
                            )}
                            <div className="galeria-first-container"
                                id={props.id}
                            >

                                <a
                                    onClick={props.onClick}
                                    className="galeria-image-a-link"
                                    href={props.href} target="_parent"
                                    rel="noreferrer"
                                    style={{ backgroundImage: `url(${props.src})`, zIndex: 0 }}
                                >
                                </a>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            )}
            {(
                props.callModal ?

                    <>
                        <div className="galeria-div-container" onClick={props.onClick}>
                            <div className="galeria-first-container cursor-pointer">
                                <Icon type="new" />
                            </div>
                        </div>
                    </>
                    : <></>
            )}
        </>
    )
}

{/* <Input
                                className="input-galeria"
                                type="new"
                                onClick={props.onClick}                                
                                // value={props.value}
                                // onChange={props.onChange}
                            /> */}