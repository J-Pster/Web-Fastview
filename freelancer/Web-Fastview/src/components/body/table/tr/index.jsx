import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import style from './Tr.module.scss';
import Icon from '../../icon';
import Td from '../tbody/td';
import { createRef } from 'react';

export default function Tr(props){
    var align;
    
    if(props.align){
        if(props.align==='left'){
            align='text-lg-start';
        }else if(props.align==='right'){
            align='text-lg-end';
        }else if(props.align==='center'){
            align='text-lg-center';
        }else {
            align='text-lg-center';
        }
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        handle 
    } = useSortable({id: props.id});
    
    const styleSortable = {
        transform: CSS.Transform.toString(transform),
        transition,
        display:(props.hide===true?'none':'')
    };

    const inputRef = (props?.innerRef ? createRef() : null);

    return(
        <tr
            // ref={(props?.sortable?setNodeRef:props.innerRef)}
            ref={inputRef}
            onClick={props?.onClick}
            className={ style.tableRow + ' ' + (props.active?style.active:'') + ' ' + (props.disabled?style.disabled:'') + ' ' + (props?.cursor?'cursor-'+props.cursor:'') + ' ' + (props.className?props.className:'') + ' ' + (props.background?'bg-'+props.background:'') + ' ' + (props.background?style.text__white:'')}
            style={(props?.sortable ? styleSortable : props?.style)}
            id={props?.id}
        >
            {(() => {
                if(props.empty){
                    return(
                        <Td colspan="100%" className={align + ' text-secondary'}>{(props.text?props.text:'Nenhum resultado encontrado')}</Td>
                    )
                }else{
                    return(
                        <>
                            {(props.sortable?
                                <Td className={style.draggable} width={1}>
                                    <span
                                    {...attributes}
                                    {...listeners}
                                    {...handle}
                                    >
                                        <Icon type="draggable" title={false} />  
                                    </span>        
                                </Td>
                            :'')}
                            {props.children}
                        </>
                    )
                }
            })()}            
        </tr>
    );
}