import style from './TitleFilter.module.scss';

export default function TitleFilter(props){
    let align;

    if(props.align){
        if(props.align=='left'){
            align = 'start';
        }else if(props.align=='center'){
            align = 'center';
        }else if(props.align=='right'){
            align = 'end';
        }else{
            align = 'start';
        }
    }
    return(
        <div className={ style.titleFilter + ' justify-content-'+align } style={{marginLeft:(props.margin===false?'0':'')}}>
            { props.children }
        </div>
    );
}
