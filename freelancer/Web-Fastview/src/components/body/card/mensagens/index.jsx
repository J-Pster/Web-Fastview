import { useState, useContext, useEffect, useRef, useMemo } from 'react';

import Chat from '../../chat';
import Icon from '../../icon';
import style from '../Card.module.scss';
import axios from 'axios';
import { GlobalContext } from '../../../../context/Global';
import Message from '../../chat/message';
import { cd, cdh, get_date } from '../../../../_assets/js/global';
import Loader from '../../loader';
import TrocaOperador from '../trocaOperador';
import Tippy from '@tippyjs/react';
import Input from '../../form/input';
import TrocaStatus from '../trocaStatus';
import { JobsContext } from '../../../../context/Jobs';

export default function Mensagens({ props, job, callback, changeOperator, id_job2, id_job_status2, refreshCard, minimized, info, main, icones, filters }) {
    // CONTEXT JOBS
    const { optionsStatus, optionsStatusMensagem } = useContext(JobsContext);

    // VARIÁVEIS 
    let id_job_status, id_job, loja, usuario, data_formatada, data_nao_formatada, chat_id, title, id_job_apl;

    if (job) { // SE RECEBER A PROPS "JOB" PEGA AS INFORMAÇÕES DO QUE ESTÁ SENDO PASSADO
        id_job_status = job?.id_job_status;
        id_job = job?.id_job;
        loja = job?.nome_loja;
        usuario = job?.nome_usuario;        
        data_formatada = (job.data ? get_date('date', job?.data, 'datetime_sql') : '');
        data_nao_formatada = job?.data ? job?.data.replace('.000','') : '';
        chat_id = job?.id_job_status;
        title = job?.titulo;
        id_job_apl = job?.id_job_apl;
    } else {
        id_job_status = props?.parent?.id_job_status;
        id_job = props?.parent?.id_job;
        loja = props?.parent?.nome_loja;
        usuario = props?.parent?.nome_usuario;
        data_formatada = (props?.parent?.data ? get_date('date', props?.parent?.data, 'datetime_sql').replace('.000','') : '');
        data_nao_formatada = props?.parent?.data;
        chat_id = props.chat?.id;
        title = props?.parent?.titulo;
        id_job_apl = props?.parent?.id_job_apl
    }

    // GLOBAL CONTEXT
    const { filterModule } = useContext(GlobalContext);

    // ESTADOS
    const [viewHistory, setViewHistory] = useState(false);
    const [messages, setMessages] = useState([]);
    const [anexos, setAnexos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(data_nao_formatada ? new Date(data_nao_formatada) : '');
    const [adjustSize, setAdjustSize] = useState(false);
    const [cardStatus, setCardStatus] = useState(info?.id_card_status);
    const [cardOperator, setCardOperator] = useState(null);
    const [cardDate, setCardDate] = useState(null);
    const [cardStatusAux, setCardStatusAux] = useState(null);
    const [infoAux, setInfoAux] = useState('');

    // ATUALIZA ID CARD STATUS VINDOS DA PROP
    useEffect(() => {
        if(info){
            setCardStatus(info?.id_card_status);

        // SETA ANEXOS VINDOS DO CARD
        if (anexos.length == 0 && info?.anexo) {
            if (anexos.length == 0 && info?.anexo) {
                if(info?.anexo?.includes('{')){ // MODELO NOVO DE UPLOAD (TODAS AS INFORMAÇÕES DO ARQUIVO)
                    setAnexos(JSON.parse(info?.anexo));
                }else{ // MODELO ANTIGO DE UPLOAD (SOMENTE ID)
                    let anexosValues = [];
                    info?.anexo?.split(',').map((item, i) => {
                        anexosValues.push(item);
                    });
    
                    setAnexos(anexosValues);
                }
            }
        }

        }else if(infoAux){
            setCardStatus(infoAux?.id_card_status);

            // SETA ANEXOS VINDOS DO CARD
            if (anexos.length == 0 && infoAux?.anexo) {
                if (anexos.length == 0 && infoAux?.anexo) {
                    if(infoAux?.anexo?.includes('{')){ // MODELO NOVO DE UPLOAD (TODAS AS INFORMAÇÕES DO ARQUIVO)
                        setAnexos(JSON.parse(infoAux?.anexo));
                    }else{ // MODELO ANTIGO DE UPLOAD (SOMENTE ID)
                        let anexosValues = [];
                        infoAux?.anexo?.split(',').map((item, i) => {
                            anexosValues.push(item);
                        });
        
                        setAnexos(anexosValues);
                    }
                }
            }
        }
    },[info, infoAux]);

    // MANDA O COMANDO DE RELOAD PRO COMPONENTE PAI
    const reloadChat = (e) => {
        if(e.submit){
            if(cardOperator){
                axios({
                    method: 'post',
                    url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                    data: {
                        db_type: global.db_type,
                        tables: [{
                            table: 'operator',
                            filter: cardOperator
                        }]
                    },
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if(cardStatusAux){
                axios({
                    method: 'post',
                    url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module=" + filterModule,
                    data: {
                        db_type: global.db_type,
                        tables: [{
                            table: 'statusCard',
                            filter: cardStatusAux
                        }]
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }

            if(cardDate){
                axios({
                    method: 'post',
                    url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module=" + filterModule,
                    data: {
                        db_type: global.db_type,
                        tables: [{
                            table: 'status',
                            filter: cardDate   
                        }]
                    },
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            get_messages(false); 
        }
    }

    // GET INFO DOS CARDS INTERNOS 
    function get_info(){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&token='+window.token,
            params: {
                db_type: global.db_type,
                do: 'getJobAll',
                filter_id_job_status: [(job?.id_job_status ? job?.id_job_status : job?.id_job)],
                filter_id_user: props?.filters?.filter_id_user,
                filter_type: 'moreColumns',
                limit: 1
            }
        }).then((response) => {
            if(response.data){
                setInfoAux(response?.data?.data[0]);
            }

            // get_messages(true);
        });
    }

    useEffect(() => {
        if(!info){
            // get_info(id_job, id_job_status);
        }else{
            // get_messages(true);
        }
    },[]);

    // GET MESSAGES
    function get_messages(loading) {
        if (loading) {
            setLoading(true);
        }

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                    {
                        table: 'message',
                        filter: {
                            id_job: id_job,
                            id_job_status: id_job_status
                        }
                    }
                ]
            }
        }).then((response) => {
            setMessages(response?.data?.data?.message);

            setTimeout(() => {
                var divChat = document.getElementById('chat_' + id_job_status + '_maximized');

                if (divChat) {
                    divChat.scrollTop = divChat.scrollHeight;
                }
            }, 50);

            // CONCATENA ANEXOS
            if (response?.data?.data?.message) {                
                var messageFiles = [];
                var anexos_aux;
                var files = [];

                if(anexos.length > 0){
                    anexos_aux = anexos;
                }else{
                    anexos_aux = files;
                }

                response?.data?.data?.message.map((mensagem, i) => {
                    if (mensagem.anexo) {
                        if(mensagem?.anexo.includes('{')){ // MODELO NOVO DE UPLOAD (TODAS AS INFORMAÇÕES DO ARQUIVO)
                            JSON.parse(mensagem?.anexo).map((item, i) => {
                                if (!files.includes(item.id)) {
                                    anexos_aux.push(item);
                                }
                            });
                        }else{ // MODELO ANTIGO DE UPLOAD (SOMENTE ID)
                            mensagem?.anexo.split(',').map((item, i) => {
                                if (!files.includes(item)) {
                                    anexos_aux.push(item);
                                }
                            });
                        }
                    }
                });

                if (messageFiles) {
                    if (anexos.length > 0) {
                        anexos.map((anexo, i) => {
                            messageFiles.push(anexo);
                        });
                    }
                }

                setAnexos(messageFiles);
                setLoading(false);
            }
        });
    }

    // VISUALIZAR HISTÓRICO
    function handleSetViewHistory() {
        setViewHistory(!viewHistory);

        if (!viewHistory) {
            get_messages();

            setTimeout(() => {
                if (callback) {
                    callback({
                        offsetLeft: document.getElementById('card_historico_' + id_job_status).offsetLeft
                    });
                }
            }, 100);
        }
    }

    // MINIMIZAR HISTÓRICO
    function handleSetMinimize(){
        if(minimized){
            minimized(id_job_status);
        }
    }

    // TROCA DE OPERADOR
    const handleChangeOperator = () => {
        get_messages();
        refreshCard(id_job_status);

        if (changeOperator) {
            changeOperator();
        }
    }

    //Corrigir o cabeçalho do Chat
    let responsavel;

    if (loja && usuario) {
        responsavel = loja+' - '+usuario;
    } else if (loja || usuario) {
        responsavel = (loja || usuario);
    } else if (!loja || !usuario) {
        responsavel = '';
    }

    // GET MESSAGES AO INICIAR
    useEffect(() => {
        if(main){
            get_info();
        }
    },[main]);

    // ROLAR SCROLL HISTÓRICO PRO FINAL SEMPRE QUE ATUALIZAR O VALOR
    useEffect(() => {
        if(viewHistory){
            let div = document.getElementById('card_historico_' + id_job_status);
            div.scrollTop = div.scrollHeight;
        }
    },[viewHistory, messages]);

    let defaultValue_aux;


    if(messages.filter((elem) => elem.log_tipo === 'Mensagem').length > 0){
        defaultValue_aux = messages.filter((elem) => elem.log_tipo === 'Mensagem')[messages.filter((elem) => elem.log_tipo === 'Mensagem').length-1]?.mensagem
    }else{
        if(job?.mensagem_ult){
            defaultValue_aux = job?.mensagem_ult;
        }else{
            if(job?.descricao){
                defaultValue_aux = job?.descricao;
            }else{
                if(infoAux?.descricao){
                    defaultValue_aux = infoAux?.descricao;
                }else{
                    defaultValue_aux = '';
                }            
            }
        }
    }

    const [auxMensagem, setAuxMensagem] = useState(defaultValue_aux)

     // REFS
     const itemRef = useRef(null);
     const itemInIvew = useIsInViewport(itemRef);
 
     // CHECA SE O ITEM ESTÁ VISÍVEL NA TELA
     function useIsInViewport(ref) {
         const [inView, setInView] = useState(false);
 
         const observer = useMemo(() =>
             new IntersectionObserver(([entry]) =>
                 setInView(entry.isIntersecting),
             ),
         [],);
 
         useEffect(() => {
             if(itemRef !== null && ref.current){
                 observer.observe(ref.current);
 
                 return () => {
                     observer.disconnect();
                 };
             }
         }, [ref, observer]);
 
         return inView;
     }

     /** LOAD MENSAGEM LOGIC */

     const [loadingMsg, setLoadingMsg] = useState(false)
     const timerRef = useRef(null)
     const abortMessage = useRef(new AbortController());
 
     function handleLoadFullMessage(jobLogId) {
         setLoadingMsg(true);
         axios.get(window.host_madnezz+`/systems/integration-react/api/request.php`,
             {
                 params: {
                     db_type: 'sql_server',
                     type : 'Job',
                     do : 'getLastMsg',
                     jobLogId
                 },
                 headers: {
                   Accept: 'application/json',
                 },
                 signal: abortMessage.current.signal
             }
         ).then(({data}) => {
           if(data?.data?.Mensagem)
           {
            setAuxMensagem(data?.data?.Mensagem)
           }
         })
         .catch(err => console.error(err))
         .finally(() => setLoadingMsg(false));
     }
 
   const onMessageBoxFocus = () => {
     if(auxMensagem?.length === 255 && job?.last_msg_id)
       {
         timerRef.current = setTimeout(() => handleLoadFullMessage(job?.last_msg_id), 1000);
       }
   } 
   
   const onMessageBoxBlur = () => {
 
     if(timerRef.current !== null)
     {
       abortMessage.current.abort();
       clearTimeout(timerRef.current);
       abortMessage.current = new AbortController()
     }
   }
 
     useEffect(() => {
       if(itemInIvew)onMessageBoxFocus();
       else onMessageBoxBlur();
       
     }, [itemInIvew])
 
     /** END LOAD MENSAGEM */

    // FUNÇÃO PARA ADIAR CARD
    function setDate(ativ_desc, id_job_status, date, id_job, date_old, maximized=true) {
        let filter={
            id_job: id_job,
            id_job_status: id_job_status,
            status: 4,
            mensagem: ativ_desc,
            data: get_date('date_sql', date.toString(), 'new_date'),
            data_old: (date_old ? date_old.slice(0,10) : undefined),
            mp: 0,
            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
        };

        if (maximized){
            setCardDate(filter);
        }else{
            let motivo_adiar=window.prompt('Motivo da alteração:');
            if(motivo_adiar){
                ativ_desc += ' - Motivo: '+motivo_adiar;
                axios({
                    method: 'post',
                    url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module=" + filterModule,
                    data: {
                        db_type: global.db_type,
                        tables: [{
                            table: 'status',
                            filter: filter   
                        }]
                    },
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(() => {
                    get_messages(false);
                });
            }
        }
    }

    // VERIFICA SE O CARD ESTÁ ATRASADO
    let atrasado = false;

    if (get_date('date_sql', cd(data)) < window.currentDateWithoutHour && (job?.status == 0 || job?.status == 4)) {
        atrasado = true;
    }

    // AJUSTA TAMANHO BODY SE TIVER O SELECT DE STATUS
    const handleAdjustSize = (e) => {
        if (e.enabled) {
            setAdjustSize(true);
        }else{
            //SALVA O STATUS DO CARD PRA ENVIAR SOMENTE QUANDO ENVIAR A MENSAGEM
            setCardStatusAux(e);
        }       
    }

    const handleCardOperator = (e) => {
        setCardOperator(e);
    }

    //VERIFICAR STATUS PARA ESCOLHER A COR DO HEADER DA MENSAGEM
    let bg_aux;
    let background_aux;

    if (job?.status == 0 && data_nao_formatada > get_date('datetime_sql', new Date())) {
        bg_aux = optionsStatus.filter((el) => {
            return el.nome_status == 'nao_feito';
        })[0]?.cor;
    } else if (job?.status == 0 || job?.status == 4 && data_nao_formatada < get_date('datetime_sql', new Date())) {
        bg_aux = optionsStatus.filter((el) => {
            return el.nome_status == 'atrasado'
        })[0]?.cor;
    } else if (job?.status == 1) {
        bg_aux = optionsStatus.filter((el) => {
            return el.nome_status == 'feito';
        })[0]?.cor;
    } else if (job?.status == 2) {
        bg_aux = optionsStatus.filter((el) => {
            return el.nome_status == 'nao_tem';
        })[0]?.cor;
    } else if (job?.status == 3) {
        bg_aux = optionsStatus.filter((el) => {
            return el.nome_status == 'feito_com_atraso';
        })[0]?.cor;
    } else if (job?.status == 5) {
        bg_aux = optionsStatus.filter((el) => {
            return el.nome_status == 'feito_com_ressalva';
        })[0]?.cor;
    } else {
        bg_aux = '';
    }

    switch (bg_aux) {
        case 'blue':
            background_aux = style.bg__blue;
            break;
        case 'orange':
            background_aux = style.bg__orange;
            break;
        case 'dark_orange':
            background_aux = style.bg__dark_orange;
            break;
        case 'yellow':
            background_aux = style.bg__yellow;
            break;
        case 'green':
            background_aux = style.bg__green;
            break;
        case 'red':
            background_aux = style.bg__red;
            break;
        case 'dark':
            background_aux = style.bg__dark;
            break;
        case 'light_gray':
            background_aux = style.bg__light_gray;
            break;
        case 'dark_gray':
            background_aux = style.bg__dark_gray;
            break;
        case 'purple':
            background_aux = style.bg__purple;
            break;
        default:
            background_aux = '';
    }
    return (
        <div className="d-flex align-items-stretch h-100" style={{ gap: 24 }}>
            <div className={style.card__maximized_box}>
                <div>
                    <div className={style.card__maximized_header + ' ' + (background_aux ? background_aux : atrasado ? style.bg_red : '')}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-between" style={{ gap: 15, overflow: 'hidden' }}>
                                <Tippy content={title}>
                                    <span>{title}</span>
                                </Tippy>
                            </div>
                            
                            <span>
                                <span className="me-2">
                                    <Icon
                                        type="minus"
                                        title="Minimizar"
                                        className=" "
                                        onClick={() => handleSetMinimize()}                                
                                    />
                                </span>
                                <Icon
                                    type="view"
                                    className={(viewHistory ? 'text-primary' : '')}
                                    title={(viewHistory ? 'Ocultar histórico' : 'Ver histórico')}
                                    onClick={() => handleSetViewHistory()}
                                    animated
                                />

                                {icones}
                            </span>
                        </div>
                    </div>
                    <div style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}} className={style.card__maximized_header + ' ' + (background_aux ? background_aux : atrasado ? style.bg_red : '') + ' pt-0'} >
                        <div className="d-flex align-items-center justify-content-between">
                            <span className="d-flex align-items-center justify-content-between">
                                {(props?.internal?.params && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ?
                                    <TrocaOperador
                                        // label={(responsavel ? '' : 'Trocar de operador')}
                                        placeholder={responsavel}
                                        options={props?.internal?.params?.options}
                                        fases={props?.fases}
                                        chamados={props?.chamados}
                                        visitas={props?.visitas}
                                        maximized={true}
                                        margin={false}
                                        params={{
                                            id_modulo: job?.id_modulo,
                                            id_job2: id_job2,
                                            id_job_status2: id_job_status2,
                                            id_job_lote: (job?.id_job_lote ? job?.id_job_lote : props?.parent?.id_job_lote),
                                            id_job: id_job,
                                            id_job_status: id_job_status,
                                            id_job_apl: id_job_apl,
                                            tipo_fase: job?.type_phase,
                                            ativ_desc: props?.internal?.params?.ativ_desc,
                                            filterModule: props?.internal?.params?.filterModule,
                                            filter_subtype: props?.internal?.params?.filter_subtype
                                        }}
                                        onChange={handleChangeOperator}
                                        callback={handleCardOperator}
                                    />
                                : responsavel)}
                            </span>
                            <span>
                                <span className="mt-2">
                                    {(props?.internal?.params && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ?
                                        <TrocaStatus
                                            label={false}
                                            placeholder={'Status'}
                                            id_job_status={id_job_status}
                                            id_job={id_job}
                                            id_job_apl={id_job_apl}
                                            options={optionsStatusMensagem}
                                            id_cliente={props?.fases && job?.id_cliente ? job?.id_cliente :null}
                                            value={cardStatus}
                                            menuPlacement={'bottom'}
                                            maximized={true}
                                            callback={handleAdjustSize}
                                        />
                                    :'')}
                                </span>
                            </span>

                            <span>
                                <span className="mt-2">

                                {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ?
                                    <Input
                                        placeholder="Data"
                                        label={false}
                                        icon={false}
                                        background={false}
                                        border={false}
                                        padding={false}
                                        type="date"
                                        name="adiar"
                                        required={false}
                                        value={data}
                                        onChange={(e) => (
                                            setDate("Adiou o job de " + data_formatada + " para " + cd(e), id_job_status, e, id_job, (job?.data ? job?.data : props?.parent?.data)),
                                            setData(e)
                                        )}
                                    />
                                :
                                    <Tippy content={data_formatada}>
                                        <span className="pe-3">{data_formatada}</span>
                                    </Tippy>
                                )}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className={style.card__maximized_body + ' ' + (adjustSize ? style.adjust_size : '')} ref={itemRef}>
                    <Chat
                        fases={props.fases}
                        cardDate={cardDate}
                        cardOperator={cardOperator}
                        cardStatus={cardStatusAux}
                        api={props.chat?.api}
                        id={chat_id}
                        id_job={id_job}
                        data={props.chat?.data}
                        loadingMsg={loadingMsg}
                        border={false}
                        send={(props.chat?.send === false ? false : true)}
                        button={{
                            show: (props.chat?.send === false ? false : true)
                        }}
                        editor={{
                            size: true,
                            font: true
                        }}
                        clearMessage={false}
                        anexo={(props?.chat?.anexo === false ? false : { multiple: true })}
                        callback={reloadChat}
                        defaultValue={auxMensagem}
                    />
                </div>
            </div>

            {(viewHistory ?
                <div className={style.card__maximized_box} id={'card_historico_' + id_job_status}>
                    <div className={style.card__maximized_header}>
                        <div className="d-flex align-items-center justify-content-between">
                            <span>Mensagens</span>
                        </div>
                    </div>

                    {/* {(anexos.length > 0 ?
                        <div>
                            Anexos:
                            
                            <div className={style.files}>
                                {(anexos.map((item , i) => {
                                    return (
                                        <a href={window.upload + '/' + item.id} target="_blank" className={style.file__link} key={'file_' + i}>
                                            {item.name}
                                            <span className="text-secondary">{(info?.anexo ? (info?.anexo.includes(item.id) ? ' (Job)' : ' (Chat)') : ' (Chat)')}</span>
                                            <Icon type="external" />
                                        </a>
                                    )
                                }))}
                            </div>
                        </div>
                    :'')} */}

                    <div className={style.card__maximized_body}>
                        <Chat
                            fases={props.fases}
                            cardDate={cardDate}
                            cardOperator={cardOperator}
                            cardStatus={cardStatusAux}
                            id={chat_id + '_maximized'}
                            send={false}
                            border={false}                            
                            empty={(messages.length > 0 || props.chat?.defaultMessage ? false : true)}
                        >
                            {(loading ?
                                <Loader />
                            :
                                messages?.map((message, i) => {
                                    let message_aux;

                                    if(message.log_tipo === 'Cadastro'){
                                        message_aux = 'Cadastrou o card';
                                    }else if(message?.log_tipo === 'Edição'){
                                        message_aux = 'Editou o card';
                                    }else{
                                        message_aux = message.mensagem + (message.motivo ? '\nMotivo: ' + message.motivo + '' : '');
                                    }

                                    return (
                                        <Message
                                            key={'message_' + message.id}
                                            sender={message.nome_usuario}
                                            date={cdh(message.dataHora_cad)}
                                            text={message_aux}
                                            files={
                                                (message.anexo ?
                                                    (message?.anexo.includes('{') ?
                                                        JSON.parse(message?.anexo).map((item, i) => {
                                                            return (
                                                                <a href={window.upload + '/' + item.id} target="_blank" className={style.file__link + ' d-block'} key={'message_' + message.id + '_file_' + i}>
                                                                    {item.name}
                                                                    <Icon type="external" />
                                                                </a>
                                                            )
                                                        })
                                                        :
                                                        message?.anexo.split(',').map((item, i) => {
                                                            return (
                                                                <a href={window.upload + '/' + item} target="_blank" className={style.file__link + ' d-block'} key={'message_' + message.id + '_file_' + i}>
                                                                    Arquivo {i + 1}
                                                                    <Icon type="external" />
                                                                </a>
                                                            )
                                                        })
                                                    )
                                                : '')
                                            }
                                            align={(window.rs_id_usr == message.id_usuario ? 'right' : 'left')}
                                        />
                                    )
                                })
                            )}
                        </Chat>
                    </div>
                </div>
            : '')}
        </div>
    )
}
