import Tippy from '@tippyjs/react';
import {
    FaPaperPlane,
    FaExclamationTriangle,
    FaSave,
    FaCheck,
    FaSearch,
    FaTimes
} from 'react-icons/fa';
import style from './Button.module.scss';

export default function Button(props){
    var class_aux, status_aux, icon, color_aux;

    switch(props?.color){
        case 'white':
            class_aux = style.button__primary;
            break;
        case 'red':
            class_aux = style.button__default;
            color_aux = style.button__danger;
            break;
        default:
            class_aux = style.button__default;
            break;
    }

    switch(props?.status){
        case 'error':
        case 'erro':
            status_aux = style.error;
            break;
        default:
            status_aux = '';
            break;
    }

    switch(props?.icon){
        case 'send':
            icon = <FaPaperPlane />
            break;
        case 'save':
            icon = <FaSave />
            break;
        case 'search':
            icon = <FaSearch />
            break;
        default:
            icon = <FaExclamationTriangle />
            break;
    }

    return(
        <>
            <Tippy disabled={(props?.title?false:true)} content={props?.title}>
                <div data-button={true} className={props?.className + ' ' + (props?.type=='submit'?'float-end':'')}>
                    <button onClick={ props?.onClick } className={ style.button + ' ' + class_aux + ' ' + color_aux + ' ' + status_aux + ' ' + props?.className + ' ' + (props?.disabled===true?style.button__disabled:'') + ' ' + (props?.loading?style.button__loading:'') + ' ' + (props?.status==='loading'||props?.status==='carregando'?style.button__disabled:'')} type={ props?.type } style={props?.style}>
                        {(() => {
                            if(props?.status==='loading'||props?.status==='carregando'){
                                return(
                                    <>
                                    Carregando

                                        <div className="spinner-border ms-2" role="status"></div>
                                    </>
                                )
                            }if(props?.status==='success'||props?.status==='sucesso'){
                                return(
                                    <>
                                        {(props?.text?.success ? props?.text?.success : 'Enviado')}

                                        <FaCheck className="ms-2" />
                                    </>
                                )
                            }if(props?.status==='erro'||props?.status==='error'){
                                return(
                                    <>
                                        {(props?.text?.error ? props?.text?.error : 'Erro ao salvar')}

                                        <FaTimes className="ms-2" />
                                    </>
                                )
                            }else{
                                return(
                                    <span>
                                    {props?.children}
                                    </span>
                                )
                            }
                        })()}

                        {(() => {
                            if(props?.icon&&(props?.status!=='loading'&&props?.status!=='carregando')){
                                return(
                                    icon
                                )
                            }
                        })()}
                    </button>
                </div>
            </Tippy>
            {(props?.type=='submit' && props?.float!==false?<div style={{'clear':'both'}}></div>:'')}
        </>
    );
}
