import { useState } from 'react';

import style from './InputContainer.module.scss';
import Icon from '../../icon';

export default function InputContainer(props){
    // ESTADOS
    const [collapse, setCollapse] = useState((props.show ? props.show : false));

    // AÇÕES AO FAZER O COLLAPSE
    const handleSetCollapse = () => {
        setCollapse(!collapse);
        if(props?.callback?.collapse){
            props.callback.collapse(!collapse);
        }
    }

    if(props?.float){
        document.getElementById(props?.id)?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.addEventListener('scroll', (e) => {
            setCollapse(false);
        });
    }

    return(
        <div
            id={props?.id}
            data-input_container={true}
            className={style.input__container + ' ' + (props?.float ? style.float : '') + ' ' +(props.display?style.d__block:'') + ' ' + (props.overflow=='visible'?style.overflow__visible:'') + ' ' + (props?.loading ? style.loading : '') }
            style={( props?.style_aux ? props?.style_aux : (props?.maxHeight ? {maxHeight: props?.maxHeight} : {}))}
        >
            <div className={((props.display == 'block' && window.isMobile) || props.wrap ? 'd-block' : 'd-flex') + ' align-items-center justify-content-between w-100'}>
                {(props.label ?
                    <span className={'d-flex align-items-center mb-3 mb-lg-0'}>
                        {props.label}
                        {(props.selected && !props?.no_selec?
                            <span className="text-secondary mb-0"> ({props.selected} selec.)</span>
                        :'')}
                    </span>
                :'')}

                {(!props.collapse ? 
                    <div className={'w-100'}>
                        {(props.wrap ? <hr /> : '')}
                        { props.children }
                    </div>
                :'')}

                {(props.collapse?
                    <>
                        <div
                            className="d-flex cursor-pointer"
                            onClick={handleSetCollapse}
                        >
                            {(!props?.minified &&
                                <span className="mb-0" style={{top:2}}>
                                    {(collapse?'Ocultar':'Mostrar')}
                                </span>
                            )}
                            <Icon
                                title={false}
                                disabled={true}
                                type={(collapse?'collapseOut':'collapseIn')}                                
                            />
                        </div>
                    </>
                :'')}
            </div>

            {(collapse && props.float !== true ?
                <hr /> 
            :'')}

            {(props.collapse ?
                <div
                    className={(props.collapse?'collapse '+(collapse ? ('show '+style.collapseContainer):''):'')}
                    style={props?.float ? {
                        width: document.getElementById(props?.id)?.clientWidth,
                        left: (document.getElementById(props?.id)?.offsetLeft + 18) - document.getElementById(props?.id)?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.scrollLeft + 35,
                        height: 100 + (document.getElementById('container_overflow')?.offsetHeight / 2)
                    } : {}}
                >
                    { props.children }
                </div>
            :'')}
        </div>
    )
}
