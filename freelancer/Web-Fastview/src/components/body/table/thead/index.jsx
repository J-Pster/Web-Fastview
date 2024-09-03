import style from './Thead.module.scss';

export default function Thead(props){
    return(
        <thead className={ style.tableHead }>
            { props.children }
        </thead>
    );
}