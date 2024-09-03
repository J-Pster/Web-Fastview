import { useEffect, useState, useContext, useRef } from 'react';

import style from './Chat.module.scss';
import Form from "../form";
import Textarea from "../form/textarea";
import Button from '../button';

import { GlobalContext } from "../../../context/Global";
import Input from '../form/input';
import Message from './message';
import Finalizar from '../card/finalizar';
import { JobsContext } from '../../../context/Jobs';
import { get_date } from '../../../_assets/js/global';
import Reprovar from '../card/reprovar';
import Reabrir from '../card/reabrir';
import Loader from '../loader';
import Separator from '../separator';

export default function Chat(props){
    // CONTEXT GLOBAL
    const { refreshCalendar } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { configuracoes } = useContext(JobsContext);

    //ESTADOS
    const bottomRef = useRef(null);
    const { refreshChat, handleRefreshChat, handleChatLoaded, chatLoaded } = useContext(GlobalContext);
    const [message, setMessage] = useState(props?.defaultValue);
    const [anexos, setAnexos] = useState([]);
    const [buttonStatusFinalizar, setButtonStatusFinalizar] = useState('');
    const [buttonStatusRecusar, setButtonStatusRecusar] = useState('');
    const [mensagem, setMensagem] = useState(false);
    const [borderAux, setBorderAux] = useState((props?.fases && (props?.cardStatus || props?.cardOperator || props?.cardDate)));

    const data = props.data? props.data : {
        tables: [{
            table: 'message',
            filter: {
                id_job: props?.id_job,
                id_job_status: props?.id,
                mp: (props?.nivel_msg || props?.nivel_msg === 0 ? props?.nivel_msg : (props?.data?.nivel_msg ? props.data.nivel_msg : 0 )),
                mensagem: message,
                anexo: anexos,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            }    
        }],
    }

    if(refreshChat){
        setTimeout(() => {
            handleChatLoaded(!chatLoaded);
        },100);
        if(message){
            setMessage('');
        }
    }

    // KEY ALEATÓRIA
    const key = Math.random();

    useEffect(() => {
        setTimeout(() => {
            var divChat = document.getElementById('chat_'+key);
            if(divChat){
                divChat.scrollTop = divChat.scrollHeight;
            }
        },100);
    },[refreshChat, bottomRef, chatLoaded]); 

    useEffect(() => {
        if(props?.fases){
            if(buttonStatusFinalizar!='sucesso'){
                if(props?.cardStatus || props?.cardOperator || props?.cardDate){
                    setBorderAux(true);
                }else{
                    setBorderAux(false);
                }
            }else{
                setBorderAux(false);
            }            
        }        
    },[props?.cardStatus, props?.cardOperator, props?.cardDate,buttonStatusFinalizar]);

    useEffect(() => {
        if(props?.fases){
            if(buttonStatusFinalizar=='sucesso'){
               setButtonStatusFinalizar('');
            }            
        }        
    },[props?.cardStatus, props?.cardOperator, props?.cardDate]);

    useEffect(() => {
        if(props?.show){
            // handleRefreshChat(true);
        }
    },[props?.show]);

    function formCallback(){
        setAnexos([]);
        if(props?.clearMessage !== false){
            setMessage('');
        }

        if(props?.fases){
            setButtonStatusFinalizar('sucesso');
            setMensagem(false);
        }else{
            setButtonStatusFinalizar('');
        }        
        
        setButtonStatusRecusar('');

        props.callback({
            submit: true,
            finish: {
                status: buttonStatusFinalizar ? 1 : undefined,
                status_sup: buttonStatusRecusar ? 2 : undefined
            }
        });
        
        if(props.setAutoSubmit){
            props.setAutoSubmit(false);
        }
    }

    // SETAR ANEXO
    const handleSetAnexos = (response) => {
        setAnexos(response[0]);

        if(props?.callback){
            props?.callback({
                anexo: response[0]
            })
        }
    };

    // ATUALIZA DEFAULT VALUE DO CHAT SEMPRE O VALOR FOR ALTERADO NO COMPONENTE PAI
    useEffect(() => {
        setMessage(props?.defaultValue);
    },[props?.defaultValue]);

    // ATUALIZA DEFAULT VALUE DO CHAT SEMPRE O VALOR FOR ALTERADO NO COMPONENTE PAI
    // useEffect(() => {
    //     setMessage(props?.message);
    // },[props?.message]);

    // SETA MENSAGEM
    const handleSetMessage = (e) => {
        setMessage((props?.editor ? e : e.target.value));

        if(props.callback){
            props.callback({
                message: (props?.editor ? e : e.target.value)
            })
        }
    }

    const handleSetMensagem = () => {setMensagem(true)}

    // DEFINE URL DO UPLOAD
    let url_aux = window.upload;

    if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
        url_aux = window.upload_madnezz;
    }

    // DEFINE SE CARD FICA NO FORMATO INATIVO
    let disabled = false;
    if (props.chamados) {
        disabled = false;
    } else if (!props.chamados && !props.fases && !props.visitas) {
        if(props?.job?.arquivado){
            disabled = true;
        }
    } else {
        disabled = false;
    }

    // DEFINE VARIÁVEL DO TIPO FASE
    let tipo_fase_aux;
    if(props?.job?.type_phase){
        tipo_fase_aux = props?.job?.type_phase;
    }else if(props?.job?.tipo_fase){
        tipo_fase_aux = props?.job?.tipo_fase;
    }else{
        tipo_fase_aux = undefined;
    }

    // NÍVEL DA MENSAGEM DO BOTÃO DE FINALIZAR
    let nivel_aux;

    if(props?.tipo_permissao === 'livre'){
        nivel_aux = 1;
    }else{
        nivel_aux = 2;
    }

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DA API
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
            if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux]){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                nivel_aux = JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux].nivel_msg; // SETA O NÍVEL DAS MSGS
            }
        }
    }

    // CALLBACK DO COMPONENTE DE FINALIZAR
    const handleCallbackFinalizar = (e) => {
        if(e.submit){
            if(props.chamados){
                props?.refreshCalendar(false);
            }else{
                if(props?.refreshCard){
                    props?.refreshCard(e.submit);
                }
            }

            setMessage(null);
            setAnexos(null);
        }
    }

    // CALLBACK DO COMPONENTE DE REPROVAR
    const handleCallbackReprovar = (e) => {
        if(e.submit){
            if(props.chamados){
                props?.refreshCalendar(false);
            }else{
                if(props?.refreshCard){
                    props?.refreshCard(e.submit);
                }
            }

            setMessage(null);
            setAnexos(null);
        }
    }

    // CALLBACK DO COMPONENTE DE REABRIR
    const handleCallbackReabrir = (e) => {
        if(e.submit){
            if(props.chamados){
                props?.refreshCalendar(false);
            }else{
                if(props?.refreshCard){
                    props?.refreshCard(e.submit);
                }
            }

            setMessage(null);
            setAnexos(null);
        }
    }

    // VERIFICA SE O BOTÃO DE FINALIZAR FICARÁ DISPONÍVEL
    let finalizar_aux = false;

    if (        
        (props?.tipo_permissao === 'livre' && (window.rs_id_lja === 0 || !window.rs_id_lja)) ||                                                   
        ((props?.job?.id_loja == window.rs_id_lja || (Array.isArray(global.rs_id_usr) ? global.rs_id_usr?.includes(props?.job?.id_usuario) : global.rs_id_usr == props?.job?.id_usuario)) &&
        !props?.job?.url_sistema_job && 
        tipo_fase_aux != 'Início' && tipo_fase_aux != 'Pós-venda')
    ) {
        if(!disabled){
            if(props?.permission_module === 'operador' || props?.permission_module === 'checker' || props?.permission_module === 'supervisor' || props?.permission_module === 'master'){
                let nivel_aux;

                if(props?.tipo_permissao === 'livre'){
                    nivel_aux = 1;
                }else{
                    nivel_aux = 2;
                }

                if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DA API
                    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
                        if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux]){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                            nivel_aux = JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux].nivel_msg; // SETA O NÍVEL DAS MSGS
                        }
                    }
                }

                if(props?.mensagem_finaliza){
                    finalizar_aux = true;
                }
            }
        }
    }

    // VERIFICA SE O BOTÃO DE REPROVAR FICARÁ DISPONÍVEL
    let reprovar_aux = false;

    if(!disabled){                                                    
        if ((props.chamados && props?.tipo_permissao === 'livre' && (window.rs_id_lja === 0 || !window.rs_id_lja)) || (!props.fases && props?.tipoCalendario != 7 && !props?.job?.arquivado && !props?.job?.id_apl?.includes('231') && !props.visitas && props?.job?.status != 4 && !props?.job?.desabilitar?.split(',')?.includes('2') && (props?.job?.id_loja == window.rs_id_lja || (Array.isArray(global.rs_id_usr) ? global.rs_id_usr?.includes(props?.job?.id_usuario) : global.rs_id_usr == props?.job?.id_usuario)))) {
            if (props.chamados && tipo_fase_aux == 'Início' && props?.tipo_permissao !== 'livre') {
                return <></>
            } else {
                if(((props.chamados && tipo_fase_aux === 'Operação' && (props?.permission_module === 'operador' || props?.permission_module === 'supervisor' || props?.permission_module === 'master' || props?.permission_module === 'checker')) || !props.chamados || props?.tipo_permissao === 'livre')){
                    let devolver = false;

                    // VERIFICA SE O EMPREENDIMENTO TÁ CONFIGURADO PARA VOLTAR O CHAMADO AO SOLICITANTE QUANDO OPERADOR RECUSAR
                    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card){
                        if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0].conf_card)?.actions?.recusar?.devolver === 1){
                            devolver = true;
                        }
                    }

                    if(devolver && props?.mensagem_finaliza){
                        reprovar_aux = true;
                    }
                }
            }
        }
    }

    // VERIFICA SE O BOTÃO DE REABRIR FICARÁ DISPONÍVEL
    let reabrir_aux = false;
     
    if ((!props?.fases && !props?.visitas) && tipo_fase_aux == 'Pós-venda' && (Array.isArray(global.rs_id_usr) ? global.rs_id_usr?.includes(props?.job?.id_usuario_cad) : global.rs_id_usr == props?.job?.id_usuario_cad)) {
        if(!props?.card?.desabilitar?.split(',')?.includes('8') && !props?.card?.id_avaliacao){
            //SE FOR CHAMADO DO CARREFOUR FINALIZADO EM PREVENÇÃO LOJA NÃO PODE REABRIR
            if(props?.job?.id_modulo!=180 || !props?.job?.id_modulo){ 
                reabrir_aux = true;
            }
        }
    }

    // DEFINE TIPPY DO BUTTON E STATUS DE DISABLED
    let tippy_aux, disabled_aux;

    if(props?.button?.finalizar?.config?.disabled){
        disabled_aux = props?.button?.finalizar?.config?.disabled;
    }else{
        disabled_aux = props?.mensagem_finaliza && (!message || message === '<p><br></p>') ? true : false;
    }

    if(props?.button?.finalizar?.config?.tippy){
        tippy_aux = props?.button?.finalizar?.config?.tippy;
    }else{
        tippy_aux = props?.mensagem_finaliza && (!message || message === '<p><br></p>') ? 'Digite uma mensagem' : false;
    }

    return(
        <>
            {(!props.empty && (props.children || props.defaultMessage)?
                <div
                    className={style.message__container + ' ' + props?.className}
                    data-message_container
                    id={'chat_'+props?.id}
                    style={{marginBottom:(props.send!==false?10:''), maxHeight:(props?.maxHeight ? props?.maxHeight : '')}}
                >
                    
                    {(props.defaultMessage ? 
                        <>
                            <Message
                                date={props.defaultMessage?.date}
                                sender={props.defaultMessage?.sender}
                                text={props.defaultMessage?.text}
                                align={props.defaultMessage?.align}
                            />
                            <span style={{clear:'both', display: 'block'}}></span>
                        </>
                    :'')}
                    
                    {props.children}

                    <span style={{clear:'both', display: 'block'}}></span>
                    <div ref={bottomRef} />
                </div>
            :'')}

            {(props.send !== false ?
                <>
                    <Form
                        id={'form_chat_'+props?.id}
                        api={props?.api}
                        border={props?.border}
                        data={data}
                        toast="Mensagem enviada com sucesso"
                        callback={() => formCallback()}
                        autoSend={(props.autoSubmit && message ? true : false)}
                    >
                        {/* BOTÃO ESCONDIDO PARA DAR SUBMIT NO FORM, O BOTÃO VISÍVEL AO USUÁRIO FICA FORA DELE */}
                        <button type="submit" id={'form_submit_'+props?.id} style={{display: 'none'}}></button>

                        <div className='position-relative'>
                            <Textarea 
                                placeholder={(props.placeholder ? props.placeholder : 'Mensagem')}
                                value={message}
                                editor={props?.editor}
                                border={(borderAux ? 'danger' : props?.border)}
                                onKeyDown={handleSetMensagem}
                                onChange={handleSetMessage}
                            />

                            {props.loadingMsg && <Loader className="position-absolute bottom-0 end-0 translate-middle-x" />}
                        </div>

                        {(props.anexo !== false ? 
                            <Input
                                type="file"
                                api={{
                                    url: url_aux
                                }}
                                label="Anexo"
                                required={false}
                                value={anexos}
                                multiple={(props.anexo?.multiple?props.anexo.multiple:false)}
                                callback={handleSetAnexos}
                            />
                        :'')}
                    </Form>

                    {/* SE RECEBER O PARAMETRO DE BUTTON */}
                    {(props?.button?.show ?
                        <>
                            <div className={style.buttons + ' d-flex justify-content-end mt-3'} style={{gap: (props?.avaliacao_aux ? 0 : 10)}}>
                                <Button
                                    status={buttonStatusFinalizar}
                                    className={style.send + ' ' + style.button}
                                    disabled={(props?.mensagem_finaliza || (props?.fases && (!props?.cardStus || !props?.cardOperator || !props?.cardDate || !mensagem))) && (!mensagem || !message || message === '<p><br></p>') ? true : false}
                                    title={(props?.mensagem_finaliza || (props?.fases && (props?.cardStus || props?.cardOperator || props?.cardDate || mensagem))) && (!message || message === '<p><br></p>') ? 'Digite uma mensagem' : false}
                                    onClick={() => (setButtonStatusFinalizar('loading'), document.getElementById('form_submit_'+props?.id).click())}
                                >
                                    Enviar mensagem
                                </Button>

                                {/* SE A OPÇÃO DE ENVIAR MENSAGEM FINALIZAR O CARD ESTIVER HABILITADA NO BANCO */}
                                {(props?.mensagem_finaliza ?
                                    <>
                                        {(reprovar_aux ?
                                            <Reprovar
                                                chamados={props.chamados}                                                            
                                                id_job={props?.job?.id_job}
                                                id_job_status={props?.job?.id_job_status}
                                                id_job_apl={props?.job?.id_job_apl}     
                                                motivo={true}
                                                message={message}
                                                anexo={anexos}
                                                card={props?.job}
                                                tipo="next"
                                                type_phase="Operação"          
                                                button={true}
                                                disabled={disabled_aux}
                                                tippy={tippy_aux}    
                                                className={style.button}                                               
                                                callback={handleCallbackReprovar}
                                            />
                                        :'')}

                                        {(finalizar_aux ?
                                            <Finalizar
                                                chamados={props.chamados}
                                                fases={props.fases}
                                                id_job={props?.job?.id_job}
                                                id_job_status={props?.job?.id_job_status}      
                                                id_job_apl={props?.job?.id_job_apl}     
                                                jobsCols={props?.jobsCols}      
                                                jobs={props?.jobs}                                               
                                                modules={props?.optionsModule}
                                                card={props?.job}
                                                tipo="next"
                                                message={message}
                                                anexo={anexos}
                                                tipo_permissao={props?.tipo_permissao}
                                                nivel={nivel_aux}
                                                motivo={false}
                                                prioridade={props?.job?.prioridade}
                                                tipo_fase={tipo_fase_aux}
                                                status={props?.job?.data < get_date('datetime_sql', new Date()) ? 3 : 1}
                                                button={true}
                                                disabled={disabled_aux}
                                                tippy={tippy_aux}
                                                className={style.button}
                                                funcionarios={props?.funcionarios}
                                                callback={handleCallbackFinalizar}
                                            />
                                        :'')}
                                    </>
                                :'')}

                                {(reabrir_aux ?
                                    <Reabrir
                                        id_job={props?.job?.id_job}
                                        id_job_status={props?.job?.id_job_status}
                                        card={props?.job}
                                        chamados={true}
                                        message={message}
                                        anexo={anexos}
                                        button={true}
                                        disabled={props?.mensagem_finaliza && (!message || message === '<p><br></p>') ? true : false}
                                        tippy={props?.mensagem_finaliza && (!message || message === '<p><br></p>') ? 'Digite uma mensagem' : false}
                                        callback={handleCallbackReabrir}
                                    />
                                :'')}
                            </div>

                            {(() => {  
                                if(props?.actions && window.rs_id_grupo == 2 && window?.location?.origin?.includes('madnezz') && tipo_fase_aux == 'Pós-venda'){
                                    return(
                                        <>
                                            <Separator label="Avaliação" />

                                            <div className={style.rate}>                                
                                                {props?.actions}
                                            </div>
                                        </>
                                    )
                                }
                            })()} 
                        </>
                    :'')}
                </>
            :'')}
        </>
    )
}
