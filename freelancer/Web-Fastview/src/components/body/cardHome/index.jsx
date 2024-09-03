import style from "./CardHome.module.scss";
import Icon from "../icon";

export default function CardHome(props){
    return(
        <div
            className={style.card__home + ' ' + (props.resize?style.resize:'')}
        >
            <div>
                <Icon type={props.icon} className={style.icon} />
                <p className={style.textStyle}>{props.title}</p>
            </div>
        </div>
    )
}