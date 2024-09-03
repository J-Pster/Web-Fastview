import style from "./newsLiContainer.module.scss"

export default function NewsLiContainer(props){
    return(
        <li className={style.newsMainContainer + ' ' + (props?.widget ? 'mb-4' : '') + ' ' + (props?.loading ? style.loading : '')}>
            {props.children}
        </li>
    )
}