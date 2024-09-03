import style from './titleActions.module.scss';

export default function TitleActions(props){
    return(
        <div className={ style.titleActions }>
            { props.children }
        </div>
    );
}
