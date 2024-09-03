import { useEffect, useContext} from 'react';
import style from './Message.module.scss';
import { GlobalContext } from "../../../../context/Global";
export default function Message(props) {
    
    const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

    useEffect(() => {
        [...document.querySelectorAll(`#${props.id ? props.id : "inner-html"} img`)].map(
            (element) => {
                element.style = "max-width:100%;height:auto;cursor:pointer;"; //Deixa a imagem responsiva no chat
                //Adiciona um evento de clique na imagem
                element.addEventListener(
                    "click",
                    function () {
                        handleSetToggler(true);
                        handleSetSources([element.src]);
                    },
                    false
                );
            }
        );
    }, []);
    
    return(
        <div className={style.message+ ' ' +(props.align=='left'?style.message__left:style.message__right)}>
            <div className={style.message__header}>
                <span className={style.message__date}>
                    {props.date}
                </span>
                <span className={style.message__sender}>
                    {props.sender}
                </span>
            </div>
            <div className={style.message__body}>
                <div id={props.id ? props.id : "inner-html"} dangerouslySetInnerHTML={{__html: props.text}} />
                
                {(props.files ?
                    <div className="d-block">
                        {props.files}
                    </div>
                :'')}
            </div>
        </div>
    )
}
