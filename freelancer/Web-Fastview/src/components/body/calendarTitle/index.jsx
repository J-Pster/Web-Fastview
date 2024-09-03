import style from './CalendarTitle.module.scss';

export default function CalendarTitle(props){
    return(
        <h1 className={ style.calendar__title + ' ' + props.className + ' ' + (props.active?style.active:'')}>
            <span>{ props.children }</span>
            {props.icon}
        </h1>
    );
}