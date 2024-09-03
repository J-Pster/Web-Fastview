import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./form.module.scss";
import axios from "axios";
import toast from "react-hot-toast";

import { GlobalContext } from "../../../context/Global";
import { useEffect } from "react";

export default function Form(props) {
    const { refresh, refreshCalendar, loadingCalendar, handleButtonState, handleRefreshChat, formSuccess, handleSetFormSuccess, handleShowModal} = useContext(GlobalContext);
    const navigate = useNavigate();

    //FUNÇÃO DE ENVIO
    function sendForm(api) {
        if(api || props.test){
            handleButtonState('loading');
        }

        if(props.status){
            props.status('loading');
        }

        if (props.test) {
            console.log(props.data);
            toast("Log de teste gerado com sucesso");
            handleSetFormSuccess(!formSuccess);
            if(props.callback){
                props.callback(true);
            }
            setTimeout(() => {
                handleButtonState('');
                if(props.status){
                    props.status('');
                }
            },3000);
        } else {
            if(props.api === false){ // SE O COMPONENTE VIER COM API FALSE O CÓDIGO SE DEVOLVE UM CALLBACK
                props.callback(true);
                
                setTimeout(() => {
                    handleButtonState('');
                    if(props.status){
                        props.status('');
                    }
                },3000);
            }else{
                if(api){
                    let headers_aux = '';

                    if(props.headers){
                        headers_aux = props.headers;
                    }else{
                        if(props.contentType){
                            headers_aux = {'Content-Type': props.contentType}
                        }else{
                            if(props.formData){
                                headers_aux = {'Content-Type': 'multipart/form-data'}
                            }else{
                                headers_aux = {'Content-Type': 'application/x-www-form-urlencoded'}
                            }
                        }
                    }

                    axios({
                        method: (props.method?props.method:'post'),
                        url: api,
                        data: props?.method !== 'get' ? props?.data : undefined,
                        params: props?.method === 'get' ? (props?.data ? props?.data : props?.params) : undefined,                     
                        headers: headers_aux,
                        withCredentials: props?.withCredentials,
                        withXSRFToken: props?.withXSRFToken
                    }).then((response) => {
                        if(props?.response){
                            props.response(response?.data); // MANDA O RETORNO PARA A CHAMADA DO COMPONENTE
                        }

                        if (props.redirect) {
                            navigate(props.redirect);
                        }
                
                        if(props.toast !== false){
                            if(props.toast){
                                toast(props.toast);                    
                            }
                        }
                        handleButtonState('success');    
                        if(props.status){  
                            props.status('success');       
                        }
        
                        if(props.callback){
                            props.callback(true);
                        }else{
                            handleSetFormSuccess(!formSuccess);
                            handleShowModal(false);
                            handleRefreshChat(true);
                        }
        
                        setTimeout(() => {
                            handleButtonState('');
                            if(props.status){
                                props.status('');
                            }
                        },2000);
                    }).catch((response) => {
                        console.error(response);                        
                        handleButtonState('error');

                        if(props.status){
                            props.status('error');
                        }

                        if(props?.response){
                            props.response(response); // MANDA O RETORNO PARA A CHAMADA DO COMPONENTE
                        }else{
                            toast("Erro ao enviar, tente novamente");
                        }
        
                        setTimeout(() => {
                            handleButtonState('');
                            if(props.status){
                                props.status('');
                            }
                        },3000);
                    });
                }
            }
        }
    }

    useEffect(()=>{
        if(props.autoSend == true){
            sendForm(props.api)
        }
    },[props.autoSend, props.api])

    return (
        <form
            id={props?.id}
            onSubmit={(e) => (e.preventDefault(), props?.submitAction ? props.submitAction() : sendForm(props.api))}
            className={style.form + ' ' + (props.className ? props.className : "") + ' ' + (props.fullHeight===true?style.full__height:'') + ' ' + (props.border === false ? style.no__border : '') + ' ' + (props.background === false ? style.no__background : '')}
            style={ props?.styleAux ? props?.styleAux : { width: props.width ? props.width : 450 }}
        >
            {props.children}
        </form>
    );
}
