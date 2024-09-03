export default function Row(props){
    if(props?.disabled){
        return props?.children;
    }else{
        return(
            <div
                className={'row' + ' ' + (props.wrap===false?'flex-nowrap':'') + ' ' + (props.direction?'flex-'+props.direction:'') + ' ' + props?.className + ' ' + (props.justifyContent?'justify-content-'+props.justifyContent:'')}
                width={(props.fixed ? '' : props?.width)}
                style={(props.fixed ? {position: 'sticky', left: -8, width: 'calc(100% + 16px)', zIndex: 9} : {})}
                data-row
            >
                { props.children }
            </div>
        );
    }
}
