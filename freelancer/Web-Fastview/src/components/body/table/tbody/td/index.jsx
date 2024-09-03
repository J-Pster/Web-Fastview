import { useRef, useState, useEffect, useMemo } from 'react';

import Tippy from '@tippyjs/react';
import style from './Td.module.scss';

export default function Td(props){
     // REF
     const itemRef = useRef(null);
     const itemInView = useIsInViewport(itemRef);
 
     function useIsInViewport(ref) {
         const [inView, setInView] = useState(false);        
 
         const observer = useMemo(() =>
             new IntersectionObserver(([entry]) =>
             setInView(entry.isIntersecting),
             ),
         [itemRef],);
 
         useEffect(() => {
            observer.observe(ref.current);

            return () => {
                observer.disconnect();
            };
         }, [ref, observer]);
 
         return inView;
     }

    var padding = '';
    if(props.padding == 'lg'){
        padding = style.padding__lg;
    }

    if(!window.isMobile || (window.isMobile && props?.mobile !== false)){
        return(        
            <td
                className={ style.tableCell + (props.align?' text-'+props.align:'') + ' ' + (props?.boxed ? style.boxed : '') + ' ' + (props?.format?.input === false ? style.input_no_format : '') + ' ' + (props.padding ? padding : '') + ' ' + props?.className + ' ' + (props.hide?'d-none':'') + ' ' + (props.cursor?'cursor-'+props.cursor:'')}
                colSpan={ (props.empty?'100%':props.colspan) }
                width={props.width}
                onClick={props?.onClick}    
                ref={itemRef}        
                style={
                    (props?.width?
                        {
                            whiteSpace: 'nowrap',
                            verticalAlign: 'middle'
                        }
                    :
                        props.style
                    )
                }
            >
                {(itemInView || props?.disableView === false ?
                    <Tippy content={<div className="text-center" dangerouslySetInnerHTML={{__html: props.title}}></div>} disabled={(props.title ? false : true)}>
                        <span
                            style={(props?.width || props?.overflow === 'visible' ?{overflow: 'visible', maxWidth:(props?.colspan === '100%' ? '100%' : '')}:{})}
                            className={(props?.boxed?.background ? 'bg-'+props?.boxed?.background : '') + ' ' + (props?.boxed?.width === 'auto' ? style.boxed_widthAuto : '')}
                        >
                            { props.children }
                        </span>
                    </Tippy>
                :
                    <>&nbsp;</>
                )}
            </td>
        )
    }
}
