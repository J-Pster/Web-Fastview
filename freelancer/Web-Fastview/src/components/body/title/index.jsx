import style from './Title.module.scss';

export default function Title(props){
    return(
        <h1 className={ style.title + ' ' + (props?.wrap ? style.wrap : '') + ' ' + (props.loader ? style.loader : '') + ' ' + props.className + ' ' + (props.active?style.active:'') + ' ' + (props?.overflow===true?style.no__overflow:'') + ' ' + (props.border?style.bordered:'') + ' ' + (props.bold?style.bold:'')}>
            <span className={(props?.wrap ? 'd-block w-100' : '')}>
                <div className={(props?.wrap ? 'd-block' : 'd-flex')+ ' align-items-center'}>
                    { props.children }
                </div>
            </span>
            <div className={style.icon}>
                {props.icon}
            </div>
        </h1>
    );
}