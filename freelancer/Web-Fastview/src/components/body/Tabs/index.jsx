import style from './Tabs.module.scss';

export default function Tabs(props){
    return(
        <div className={style.tabs}>
            {props.children}
        </div>
    )
}