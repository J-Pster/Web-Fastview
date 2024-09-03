import style from './Tab.module.scss';

export default function Tab(props){
    return(
        <div
            className={style.tab + ' ' + (props.active?style.active:'')}
            onClick={props?.onClick}
        >
            {props.children}
        </div>
    )
}