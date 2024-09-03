import { useEffect, useState, useContext, useRef, useMemo, Suspense, lazy } from 'react';

import style from './Card.module.scss';
const Icon = lazy(() => import('../../body/icon'));
import Tippy from '@tippyjs/react';
import Loader from '../loader';
import Chat from '../../../components/body/chat';
import Message from '../../../components/body/chat/message';
import axios from 'axios';
import './sharedStyles.scss';

// INTEGRAÇÕES
import Checklist from "../../../pages/Checklist/Lista/cadastro";
import ChecklistLaravel from "../../../pages/ChecklistLaravel/Lista/Cadastro";
import Telefones from '../../../pages/Lojas/Lista';
import Trade from '../../../pages/Trade/Card/TradeJobCard';

import { GlobalContext } from "../../../context/Global";
import { JobsContext } from "../../../context/Jobs";
import Editar from './editar';
import Recusar from './recusar';
import { cd, cdh, get_date } from '../../../_assets/js/global';
import Input from '../form/input';
import { toast } from 'react-hot-toast';
import TrocaOperador from './trocaOperador';
import Mensagens from './mensagens';
import Modal from '../modal';
import ModalHeader from '../modal/modalHeader';
import ModalTitle from '../modal/modalHeader/modalTitle';
import ModalBody from '../modal/modalBody';
import Form from '../form';
import Button from '../button';
import Reabrir from './reabrir';
import Liberacao from './editar/liberacaoAcesso';

export default function Card(props){
    // GLOBAL CONTEXT
    const { refreshCalendar, refreshChat, handleRefreshChat, filterModule, handleSetPrevIndex, refresh, cardExternal, handleSetCardExternal, firstLoad, handleSetOpenExternal, openExternal, handleSetSources, handleSetToggler } = useContext(GlobalContext);

    // JOBS CONTEXT
    const { optionsStatus, optionsSystems, configuracoes, smallCard } = useContext(JobsContext);

    // REF
    const cardRef = useRef(null);
    const cardInIvew = useIsInViewport(cardRef);

    function useIsInViewport(ref) {
        const [inView, setInView] = useState(false);

        const observer = useMemo(() =>
            new IntersectionObserver(([entry]) =>
            setInView(entry.isIntersecting),
            ),
        [],);

        useEffect(() => {
            if(cardRef !== null && ref.current){
                observer.observe(ref.current);

                return () => {
                    observer.disconnect();
                };
            }
        }, [ref, observer]);

        return inView;
    }

    // VARIÁVEIS
    var system_integration_aux;

    // ESTADOS
    const [collapse, setCollapse] = useState(false);
    const [hover, setHover] = useState(false);
    const [iframeHeightAux, setIframeHeightAux] = useState(false);
    const [searchMessages, setSearchMessages] = useState(true);
    const [showMessages, setShowMessages] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [message, setMessage] = useState(null);
    const [messageSubmit, setMessageSubmit] = useState(true);
    const [anexo, setAnexo] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [anexos, setAnexos] = useState([]);
    const [maximized, setMaximized] = useState(false);
    const [loadCardInternal, setLoadCardInternal] = useState(props.fases ? false : true);
    const [cardsInternal, setCardsInternal] = useState([]);
    const [position, setPosition] = useState((props?.position?.position ? props.position?.position : ''));
    const [hide, setHide] = useState([]);
    const [viewArchived, setViewArchived] = useState(false);
    const [microssistemaValues, setMicrossistemaValues] = useState([]);
    const [microssistemaCustomOptions, setMicrossistemaCustomOptions] = useState([]);
    const [microssistemaOptionsLoja, setMicrossistemaOptionsLoja] = useState([]);
    const [info, setInfo] = useState([]);
    const [infoLoading, setInfoLoading] = useState(true);
    const [infoLoja, setInfoLoja] = useState('');
    const [infoLojaLoading, setInfoLojaLoading] = useState(false);
    const [infoUsuario, setInfoUsuario] = useState('');
    const [modalArchive, setModalArchive] = useState(false);
    const [dateStartArchive, setDateStartArchive] = useState(new Date(window.currentDate));
    const [dateEndArchive, setDateEndArchive] = useState('');    
    const [buttonStateArchive, setButtonStateArchive] = useState('');
    const [chatAlert, setChatAlert] = useState(false);
    const [chatAlertFilho, setChatAlertFilho] = useState(false);
    const [buttonChatSubmit, setButtonChatSubmit] = useState(props?.chat?.submit_button);
    const [funcionariosValidation, setFuncionariosValidation] = useState(null);
    const [funcionariosValues, setFuncionariosValues] = useState([]);

    // ARQUIVAR CARDS INTERNO APÓS CLIQUE DO BOTÃO
    function handleArchive(id_job, id_job_status, status, title, date_start, period, id_job_apl) {
        if(period){
            setModalArchive({
                id_job: id_job,
                id_job_status: id_job_status,
                status: status,
                title: title,
                period: period,
                date_start: date_start,
                show: true
            });

            if(date_start){
                setDateStartArchive(new Date(get_date('add_days', date_start, 'date_sql', 1)));
            }
        }else{
            if (window.confirm('Deseja ' + (status == 2 ? 'arquivar' : 'desarquivar') + ' esse card?')) {
                axios({
                    method: 'post',
                    url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                    data: {
                        db_type: global.db_type,
                        tables: [{
                            table: 'activeStatus',
                            filter: {
                                id_modulo: filterModule,
                                mensagem: 'Arquivou o card',
                                id_job: id_job,
                                id_job_status: id_job_status,
                                id_job_apl: id_job_apl,
                                ativo: status,
                                mp: 0,
                                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
                            }
                        }]
                    },

                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(() => {
                    toast('Card '+(status == 2 ? 'arquivado' : 'desarquivado')+' com sucesso!');
                    get_card_internal(true, (viewArchived ? true : false));
                })
            }
        }
    }

     // CALLBACK DO ENVIO DE MENSAGENS
     const handleSetMessage = (e) => {
        if(e?.message){
            setMessage(e?.message);
        }
        if(e?.anexo){
            setAnexo(e?.anexo);
        }
    }
    // CALLBACK DO COMPONENTE DE REABRIR
    const handleCallbackReabrir = (e) => {
        if(e.submit){
            if(props.chamados){
                if(props?.report){
                    handleRefreshCard(e.submit);
                }else{
                    refreshCalendar();
                }
            }else{
                handleRefreshCard(e.submit);
            }
            if(props?.refreshCardChamados){
                props?.refreshCardChamados();
            }
            setMessage(null);
            setAnexo(null);
            setMessageSubmit(true); // REABILITA BOTÃO DE ENVIAR MENSAGEM
            get_card_internal(true,false,true);
            setChatAlertFilho(null);
        }else{
            if(e?.alert?.status == 3){
                setChatAlertFilho('primary');
                setMessageSubmit(false); // DESABILITA BOTÃO DE ENVIAR MENSAGEM
            }
        }        
    }

    // ESTADO BOTÃO DE ARQUIVAR
    const handleSetButtonState = (e) => {
        setButtonStateArchive(e);
    }

    // VER CARDS ARQUIVADOS
    const handleViewArchived = () => {
        setViewArchived(!viewArchived);
        get_card_internal(false, !viewArchived);
    }

    // ATUALIZA ESTADO SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setButtonChatSubmit(props?.chat?.submit_button);
    },[props?.chat?.submit_button]);

    // SETA ANEXOS VINDOS DO CARD
    useEffect(() => {
        if (anexos.length == 0 && info?.anexo) {
            if (anexos.length == 0 && info?.anexo) {
                if(info?.anexo?.includes('{')){ // MODELO NOVO DE UPLOAD (TODAS AS INFORMAÇÕES DO ARQUIVO)
                    setAnexos(JSON.parse(info?.anexo));
                    getMessage(props?.id_aux, undefined, JSON.parse(info?.anexo));
                }else{ // MODELO ANTIGO DE UPLOAD (SOMENTE ID)
                    let anexosValues = [];
                    info?.anexo?.split(',').map((item, i) => {
                        anexosValues.push(item);
                    });
    
                    setAnexos(anexosValues);
                    getMessage(props?.id_aux, undefined, anexosValues);
                }
            }
        }
    },[info]);

    // ATUALIZA POSIÇÃO INICIAL
    useEffect(() => {
        setPosition(props?.position?.position);
    },[props?.position?.position]);

    var border_aux;
    var bg_aux;
    var messageFiles = [];
    var title = '';
    const actions = (props.actions?props.actions:'');
    var iconesInternal = [];
    const icones=(
        <>
            {(() => {
                if((actions && (window.rs_id_grupo != 2 || !window?.location?.origin?.includes('madnezz'))) || props?.parents?.type_phase != 'Pós-venda'){
                    return actions;
                }
            })()}      
            {(props?.visualized?.show ?
            <Suspense>

                <Icon 
                    type="double-check"
                    className={(props?.visualized.confirm ? 'text-primary' : 'text-secondary')}
                    title={(props?.visualized.confirm ? 'Visualizado ('+cdh(props?.visualized.date)+')' : 'Não visualizado')}
                    readonly={true}
                    />
                    </Suspense>
            :'')} 
        </>
    );

    {(() => {
        switch(props.border){
            case 'blue':
                border_aux = style.border__blue;
                break;
            case 'orange':
                border_aux = style.border__orange;
                break;
            case 'green':
                border_aux = style.border__green;
                break;
            case 'red':
                border_aux = style.border__red;
                break;
            case 'dark':
                border_aux = style.border__dark;
                break;
            case 'light_gray':
                border_aux = style.border__light_gray;
                break;
            case 'dark_gray':
                border_aux = style.border__dark_gray;
                break;
            case 'purple':
                border_aux = style.border__purple;
                break;
            default:
                border_aux = '';
        }

        switch(props.background){
            case 'blue':
                bg_aux = style.bg__blue;
                break;
            case 'orange':
                bg_aux = style.bg__orange;
                break;
            case 'dark_orange':
                bg_aux = style.bg__dark_orange;
                break;
            case 'green':
                bg_aux = style.bg__green;
                break;
            case 'red':
                bg_aux = style.bg__red;
                break;
            case 'dark':
                bg_aux = style.bg__dark;
                break;
            case 'light_gray':
                bg_aux = style.bg__light_gray;
                break;
            case 'dark_gray':
                bg_aux = style.bg__dark_gray;
                break;
            case 'purple':
                bg_aux = style.bg__purple;
                break;
            case 'yellow':
                bg_aux = style.bg__yellow;
                break;
            default:
                bg_aux = '';
        }
    })()}

    // DEFINE TITLE
    if(props?.title){
        if(props?.position?.position && props?.position?.enabled){
            title = <>
                {(props?.position?.enabled ?
                    <Input
                        type="tel"
                        name="card_position"
                        value={position}
                        style={{width : (position > 9 ? 22 : 12)}}
                        onChange={(e) => setPosition(e.target.value)}
                        onKeyPress={(e) => (e.key === 'Enter' ? changePosition(props?.parent?.id_job_status, props?.parent?.id_job, position) : {})}
                        maxLength={2}
                        focusSelect={true}
                    />
                :
                    position
                )}
                <span className="me-2">.</span>
                {props.title}
            </>
        }else{
            title = props.title;
        }
    }else{
        title = 'Card';
    }
    
    let optionsSystems_aux = [{id: '223'}]; // POR PADRÃO O JOBS (223)
    if(optionsSystems){
        optionsSystems.map((option, i) => {
            let value_aux;

            if(option.value){
                value_aux = option.value;
            }else{
                value_aux = option.id;
            }

            if(value_aux != 227){ // SE FOR DIFERENTE DE OBRAS (227)
                optionsSystems_aux.push({id: value_aux.toString()});
            }
        });
    }    

    // BUSCA MENSAGENS
    function getMessage(id, forceReload, files=[]){
        if(props?.size !== 'smallest'){
            if(!collapse){
                setSearchMessages(true);
            }

            if(id){
                if(collapse || forceReload){
                    axios({
                        method: 'get',
                        url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                        params: {
                            db_type: global.db_type,
                            do: 'getTable',
                            tables: [
                                {table: 'message', filter: {id_job: props?.parent?.id_job ,id_job_status: id}}
                            ]
                        }
                    }).then((response) => {
                        setMessages(response?.data?.data?.message);
                        setSearchMessages(false);
                        handleRefreshChat(false);

                        setTimeout(() => {
                            var divChat = document.getElementById('chat_'+id);
                            if(divChat){     
                                divChat.scrollTop = divChat.scrollHeight;
                            }
                        },50);

                        // CONCATENA ANEXOS
                        if (response?.data?.data?.message) {
                            var messageFiles = [];
                            var anexos_aux;

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

                            if (anexos_aux.length > 0) {
                                if (files.length > 0 || anexos.length > 0) {
                                    (anexos.length > 0 ? anexos : files).map((anexo, i) => {
                                        const itemExists = messageFiles.some(item => item.id === anexo.id);
                                        if (!itemExists) {
                                            messageFiles.push(anexo);
                                        }
                                    });
                                }

                                setAnexos(messageFiles);
                            }
                        }

                        if(props.opened){
                            setShowMessages(true);
                        }
                    });    
                }
            }
        }
    }

    // CHAMA A FUNÇÃO DE BUSCAR MENSAGENS CASO RECEBA A PROPS "OPENED"
    useEffect(() => {
        if(props.opened && props?.id_aux){
            getMessage(props?.id_aux);
        }
    },[props?.opened]);

    // FUNÇÃO PARA FECHAR O CARD SE O CALENDÁRIO ATUALIZAR  
    useEffect(() => {
        setCollapse(false);
    }, [refresh]);

    // FUNÇÃO PARA FECHAR O CARD SE ELE ESTIVER SENDO ARRASTADO
    useEffect(() => {
        if(props?.dragging){
            setCollapse(false);
        }
    }, [props?.dragging]);

    // FUNÇÃO PARA RECARREGAR CHAT SEMPRE QUE RECEBER NOVA MENSAGEM
    useEffect(() => {
        if(props.header === false){
            // getMessage(props.id_aux)
        }
    },[refreshChat]);

    function handleSetExternal(id, id_job, id_job_status){
        if(!props?.fases_aux){
            handleSetCardExternal({
                enabled: !maximized,
                id: (!maximized ? props?.parent?.id_job_status : '')
            });
        }

        // ENVIA CALLBACK PRO COMPONENTE PAI PARA RECARREGAR O CARD
        if(maximized){
            if(props?.callback){
                props?.callback(true);
            }
        }

        if(!maximized){
            handleSetPrevIndex(props?.swiper?.activeIndex);
            get_card_internal();
        }

        setMaximized(!maximized);
        setCollapse(false);

        if(props?.expand){
            props?.expand.callback({
                index: props?.expand?.index,
                id: (!maximized ? props?.parent?.id_job_status : '')
            });
        }

        get_info(id_job, id_job_status);
    }

    const reloadChat = (e) => {
        if(e.submit){
            getMessage(props.id_aux, true);

            if(props?.chatCallback && e?.finish){
                props.chatCallback({
                    finish: e?.finish
                });
            }
        }

        if(e.message){
            if(props?.chatCallback){
                props.chatCallback({
                    message: e.message
                });
            }
        }

        if(e.anexo){
            if(props?.chatCallback){
                props.chatCallback({
                    anexo: e.anexo
                });
            }
        }
    }

    // REFRESH/RELOAD CARD
    const handleRefreshCard = (e) => {
        if(props?.refreshCard){
            props?.refreshCard(e);
        }
    }

    // MINIMIZAR
    const handleMinimize = (e) => {
        if(!hide.includes(e)){
            setHide(hide => [...hide, e]);
        }        
    }

    // RESETA O ESTADO DE HIDE QUANDO CLICAR PARA MAXIMIZAR (VOLTA A EXIBIR TODOS)
    useEffect(() => {
        setHide([]);
        setCardsInternal([]);
        if(props.fases){
            setLoadCardInternal(false);            
        }
        setViewArchived(false);
    },[maximized]);

    // GET CARDS INTERNOS
    function get_card_internal(reloadParent, viewArchived, reloadFilho=false) {      
        if(reloadFilho) {
            setCardsInternal(null);
            setLoadCardInternal(false);
        }

        if (props?.id_group && props.inner !== true && props.fases) {
            setCardsInternal([]);

            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    db_type: global.db_type,
                    type: 'Job',
                    do: 'getJobAll',
                    filter_id_group: props?.id_group,
                    filter_id_user: props?.filters?.filter_id_user,
                    card_internal: true,
                    filter_active_status: (viewArchived ? [1, 2] : [1]),
                    message_internal: 'last',                    
                    filter_type: 'moreColumns'
                }
            }).then((response) => {
                setCardsInternal(response?.data?.data);
                setLoadCardInternal(true);

                if (reloadParent) {
                    setTimeout(() => {
                        props?.callback(false);
                    }, 100);
                }
            });
        }
    }

    useEffect(() => {
        if(props?.reload?.internal && collapse && !props.chamados){
            get_card_internal();
        }
    },[props?.reload?.internal]);

    // SCROLL CHAT
    function scrollChat(){
        setTimeout(() => {
            if(props?.id_aux){
                var divChat = document.getElementById('chat_'+props.id_aux);
                if(divChat){     
                    divChat.scrollTop = divChat.scrollHeight;
                }
            }
        },50);
    }

    // GET PREENCHIMENTO MICROSSISTEMA (CADASTRO)
    function get_form_microssistema(aux_form){
        let microssistema_aux = JSON.parse(aux_form);
        
        if(microssistemaValues.length == 0){
            axios({
                method: 'get',
                url: window.host+'/systems/microssistemas-novo/api/novo.php?do=get_microssistema',
                params: {
                    tipo: microssistema_aux?.tipo,
                    microssistema_id: microssistema_aux?.microssistema_id,
                    relatorio_id: microssistema_aux?.id_aux_form
                }
            }).then((response) => {
                setMicrossistemaValues(response?.data?.itens);
                let custom_options_aux = [];

                // CHECA TIPOS DE COMPONENTES PARA FAZER CONSULTAS EXTRAS NECESSÁRIAS
                response?.data?.itens.map((item, i) => {
                    if(item.componente_id == global?.componentes?.select_personalizado || item.componente_id == global?.componentes?.checkbox_personalizado){ // CHECA SE EXISTE SELECT PERSONALIZADO
                        if(microssistemaCustomOptions.length == 0){
                            axios({
                                method: 'get',
                                url: window.host+'/systems/microssistemas-novo/api/novo.php?do=get_opcoes',
                                params: {
                                    item_id: item?.id
                                }
                            }).then((response) => {
                                if(response.data.length > 0){
                                    response.data.map((item, i) => {
                                        custom_options_aux.push(item);
                                    });
                                }

                                setMicrossistemaCustomOptions(custom_options_aux);
                            });
                        }
                    }else if(item.componente_id == global?.componentes?.select_loja){ // CHECA SE EXISTE SELECT PERSONALIZADO
                        if(microssistemaOptionsLoja.length == 0){
                            axios({
                                method: 'get',
                                url: window.host+'/api/sql.php?do=select&component=loja'
                            }).then((response) => {
                                setMicrossistemaOptionsLoja(response?.data);
                            });
                        }
                    }
                })
            });
        }
    }

    // FUNÇÃO PARA ABRIR IMAGENS DA DESCRIÇÃO NO LIGHTBOX
    useEffect(() => {        
        if(collapse && info){
            setTimeout(() => {
                [...document.querySelectorAll(`#description_${props?.parent?.id_job_status} img`)].map(
                    (element) => {
                        element.style = "cursor:pointer;";
                    
                        element.addEventListener(
                            "click",
                            function () {
                                handleSetToggler(true);
                                handleSetSources([element.src]);
                            },
                            false
                        );
                    }
                );
            },100);
        }
    },[collapse, info]);

    // VERIFICA SE O CARD RECEBEU CONTEÚDO NO AUX FORM PARA BUSCAR OS VALORES PREENCHIDOS NO MICROSSISTEMA
    useEffect(() => {
        if(info?.aux_form && microssistemaValues.length == 0){
            get_form_microssistema(info?.aux_form);
        }
    },[info?.aux_form]);

    function get_info(id_job, id_job_status=undefined){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getJobAll',
                filter_id_job_status: [(id_job_status ? id_job_status : id_job)],
                filter_type: 'moreColumns',
                id_subsubcategoria: props?.parent?.id_subsubcategoria ? props?.parent?.id_subsubcategoria : undefined,
                limit: 1
            }
        }).then((response) => {
            if(response.data){
                setInfo(response?.data?.data[0]);
            }
            getMessage(id_job_status, true);
            setInfoLoading(false);
        });
    }

    // BUSCA INFORMAÇÕES INTERNAS NOVAMENTE SE RECEBER A PROPS RELOAD INFO
    useEffect(() => {
        if(props?.reload?.info){
            setInfo([]);
            get_info(props?.parent?.id_job, props?.parent?.id_job_status);
        }
    },[props?.reload]);

    // GET INFOS LOJA
    function get_info_loja(loja_id){
        setInfoLojaLoading(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [{
                    table: 'store',
                    filter: {id: loja_id}
                }]
            }
        }).then((response) => {
            if(response?.data?.data?.store[0]){
                setInfoLoja(response?.data?.data?.store[0]);
            }
            setInfoLojaLoading(false);
        });
    }

    // GET INFOS USUÁRIO
    function get_info_usuario(usuario_id){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [{
                    table: 'user',
                    filter: {id: usuario_id}
                }]
            }
        }).then((response) => {
            if(response?.data?.data?.user[0]){
                setInfoUsuario(response?.data?.data?.user[0]);
            }
        });
    }

    // FUNÇÕES AO ABRIR CARD
    function handleSetCollapse(id_job, id_job_status=undefined, collapseAux){
        if(!collapse || collapseAux === true){
            setCollapse(true);
            get_card_internal();

            // BUSCA INFORMAÇÕES EXTRAS DO CARD
            if(info.length == 0){
                get_info(id_job, id_job_status);
            }else{
                getMessage(id_job_status, true);
            }

            if(props.collapse){
                props.collapse({
                    id: id_job_status,
                    chat_alert: true,
                    show: true
                })
            }
        }else{
            setCollapse(false);
            setShowMessages(false);
            setIframeHeightAux(false);

            if(props.fases){
                setLoadCardInternal(false);
            }

            if(props.collapse){
                props.collapse({
                    id: id_job_status,
                    chat_alert: false,
                    show: false
                })
            }
        }
    }

    // FECHA O CARD CASO RECEBA MUDANÇA NO STATUS
    useEffect(() => {
        if(collapse){
            setCollapse(false);
            setShowMessages(false);
            setIframeHeightAux(false);
        }
    },[props?.status, props?.status_sup]);

    // ABRE O CARD SEMPRE QUE SOFRE ALTERAÇÃO DA PROPS BORDER DO COMPONENTE CHAT
    useEffect(() => {
        setChatAlert(props?.chat?.alert);

        if(props?.chat?.alert){
            handleSetCollapse(props?.parent?.id_job, props?.parent?.id_job_status, true);
        }
    },[props?.chat?.alert]);

    // SE RECEBER A PROPS "OPENED" SETA COMO ABERTO
    useEffect(() => {
        if(props?.opened){
            handleSetCollapse(props?.parent?.id_job, props?.parent?.id_job_status);
        }
    },[props?.opened]);

    // FUNÇÃO PARA TROCA DE STATUS DOS CARDS INTERNOS
    function changeStatus(ativ_desc, id_job, id_job_status, status, msg = undefined, data_aux = undefined, tipo = undefined, type_phase = undefined, id_job_apl = undefined) {    
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'status',
                    filter: {
                        mensagem: ativ_desc,
                        id_modulo: filterModule,
                        id_job: id_job,
                        id_job_status: id_job_status,
                        id_job_apl: id_job_apl,
                        status: status,
                        motivo: msg,
                        dado_aux: data_aux,
                        acao_fase: tipo,
                        tipo_fase: type_phase,
                        mp: 0,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                    }
                }]
            },
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(() => {
            let message = '';

            if(status == 1){
                message = 'Finalizou um card interno';
            }else if(status == 2){
                message = 'Sinalizou um card interno como "Não tem"';
            }else if(status == 3){
                message = 'Finalizou com atraso um card interno';
            }

            set_message(props?.parent?.id_job_status, message, 'Trocou de operador interno', props?.parent?.id_job); // ENVIA MENSAGEM PRO CARD PAI
            get_card_internal(); // RECARREGA CARDS INTERNOS
            if(props.callback){
                props.callback(true)
            }
        });
    }

    // FUNÇÃO PARA ADIAR CARD INTERNO
    function setDate(ativ_desc, id_job_status, date, id_job, date_old) {      
        axios({
            url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module=" + filterModule,
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'status',
                    filter: {
                        id_job: id_job,
                        id_job_status: id_job_status,
                        status: 4,
                        mensagem: ativ_desc,
                        data: get_date('date_sql', date.toString(), 'new_date'),
                        data_old: (date_old ? date_old.slice(0,10) : undefined),
                        mp: 0,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
                    }    
                }]
            },

            headers: {'Content-Type': 'multipart/form-data'}
        }).then(() => {
            set_message(props?.parent?.id_job_status, 'Adiou um card interno', 'Adiou card interno', props?.parent?.id_job); // ENVIA MENSAGEM PRO CARD PAI
            get_card_internal(); // RECARREGA CARDS INTERNOS

            if(props?.changeStatus){
                props.changeStatus({
                    status: 4,
                    id_group: undefined,
                    id_job_status_parent: undefined,
                    id_job_status: id_job_status,
                });
            }
        });
    }

    // FUNÇÃO PARA ENVIAR MENSAGEM
    function set_message(id_job_status, message, id_job){
        axios({
        method: 'post',
        url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module='+filterModule,
        data: {
            tables: [{
                table: 'message',
                filter: {
                    id_job_status: id_job_status,
                    id_job: id_job,
                    mp: 0,
                    mensagem: message,
                    coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                }    
            }]
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            getMessage(props.id_aux, true);
        });
    }

    // FUNÇÃO PARA TROCAR POSIÇÃO
    function changePosition(id_job_status, id_job, posicao) {  
        let posicoes = [];
        let append = false;

        if(props?.position?.group){
            props.position.group.map((item, i) => {
                if(id_job_status ==  item.id_job_status){
                    posicoes.push({id: item.id_job_status, position: (Number(posicao) - 1)})
                }else{
                    if((Number(posicao) - 1) == i){
                        posicoes.push({id: item.id_job_status, position: (i + 1)})
                        append = true;
                    }else{
                        posicoes.push({id: item.id_job_status, position: (append ? (i + 1) : i)})
                    }
                }
            })

            // ORDENAÇÃO A PARTIR DO POSITION QUE FOI DEFINIDO
            posicoes = posicoes.sort(
                function(a, b){
                    if(a.position < b.position){
                        return -1;
                    }
                    if(a.position > b.position){
                        return 1;
                    }
                    return 0;
                }
            );
        }        

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            data: {
                db_type: global.db_type,
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'position',
                    filter: {
                        id_job: id_job,
                        id_job_status: id_job_status,
                        mensagem: 'Alterou a posição do card',
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        positions: posicoes
                    }
                }]
            },
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(() => {
            toast('Ordem da fila alterada');
            handleRefreshChat(true);
        });
    }

    // HANDLE REFRESH CALENDAR
    const handleRefreshCalendar = (e) => {
        if(props.refreshCalendar){
            props.refreshCalendar(e);
        }
    }

    // RETORNO DA TROCA DE OPERADOR
    const handleChangeOperator = () => {
        get_card_internal();
    }

    // CALLBACK DO COMPONENTE DE MENSAGENS (CARD MAXIMIZADO)
    const handleCallbackMensagens = (e) => {
        if(e?.offsetLeft){            
            let container = document.getElementById('card_maximized_container');
            container.scrollLeft = (e?.offsetLeft - 1120);
        }
    }

    // CALLBACK SUBMIT ARQUIVAR POR PERÍODO
    const handleCallbackArchive = () => {
        setModalArchive(false);
        setDateStartArchive(new Date(window.currentDate));
        setDateEndArchive('');
        if(props.refreshCalendar){
            props.refreshCalendar(undefined, true);
        }
    }

    // SCROLL HORIZONTAL ATÉ O ELEMENTO
    function handleScrollToElement(id) {
        let hide_aux = hide.filter((elem) => elem !== id);
        setHide(hide_aux);

        setTimeout(() => {
            let container = document.getElementById('card_maximized_container');
            let elements = document.getElementsByClassName('container_box');
            let element = document.getElementById('container_box_' + id);

            let elements2 = document.getElementsByClassName('card_element');
            let element2 = document.getElementById('card_internal_' + id);

            for(let i=0; i < elements.length; i++){
                elements[i].classList.remove('focus');
            }

            for(let i=0; i < elements2.length; i++){
                elements2[i].classList.remove('focus');
            }

            element.classList.add('focus');
            element2.classList.add('focus');

            container.scrollLeft = (element?.offsetLeft - 1120);
        },100);
    }

    // FINALIZA JOB DE API
    const finalizaJob = (id_job, id_job_status, status, data, id_job_apl) => {
        changeStatus("Finalizou o job", id_job, id_job_status, status, undefined, data, 'next', 'Operação', id_job_apl);

        if(props?.changeStatus){
            props.changeStatus({
                status: status,
                id_group: undefined,
                id_job_status_parent: undefined,
                tipo: 'next',
                id_job_status: id_job_status,
                id_job_apl: id_job_apl
            });
        }
    }

    // CALLBACK DO COMPONENTE DE LIBERAÇÃO DE ACESSO
    const handleCallbackLiberacao = (e) => {
        if(e?.values){
            let validation_aux = true;

            e?.values?.map((item, i) => {
                if(item?.approved === undefined || !item?.approved || item?.approved == '1'){
                    validation_aux = false;
                }
            });

            if(validation_aux === false){
                setFuncionariosValidation('Valide as liberações de acesso antes de continuar');
            }else{
                setFuncionariosValidation(null);
            }

            setFuncionariosValues(e?.values);
        }
    }

    // STATUS JOBS
    var job_status;
    if (props?.parent?.status == 1) {
        job_status = "Concluído";
    } else if (props?.parent?.status == 2) {
        job_status = "";
    } else if (props?.parent?.status == 3) {
        job_status = "ComAtraso";
    } else if (props?.parent?.status == 4) {
        job_status = "Adiado";
    } else {
        job_status = "";
    }

    //AJUSTA A ALTURA DO IFRAME
    function iframeHeight(window_name, window_height) {
        const iframe = document.querySelector(`iframe[name="${window_name}"]`);
        iframe.height = window_height;
    }

    useEffect(() => {
        if(info?.api_sistema_api == 0 && collapse){
            setTimeout(() => {
                window.addEventListener("message", (event) => {
                    if (event.data.function_type === "iframeHeight") {
                        iframeHeight(event.data.iframe_name, event.data.iframe_height);
                    }
                });
            },500);
        }
    }, [info, collapse, iframeHeightAux]);

    // BUTTON CHAT
    let button_chat = true;
    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar){
        if(JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar)?.chat?.enviar){
            button_chat = false;
        }
    }

    // INTEGRAÇÃO SISTEMAS
    let system_type, system_type_1;

    if (info?.aux_sistema_api) {
        var aux = JSON.parse(info?.aux_sistema_api);
        system_type = aux.job_system_integration_type;
        system_type_1 = aux.job_system_integration_type_1;
    } else {
        system_type = 0;
        system_type_1 = 0;
    }

    if(props.loading){
        return(
            <>
                {(!props.inner ?
                    <div className={ style.title__loading }></div>
                :'')}

                {[...Array(props.qtd)].map((card, i) => (
                    <div
                        key={'loading_card_'+i}
                        className={ style.card + ' ' + (smallCard ? style.smallCard : '') + ' ' + style.card__loading + ' ' + (props?.separator ? style.with_separator : '') + ' ' + (props?.widget ? style.widget : '') + ' ' + (props.size==='small'?style.card__small:'') + ' ' + (props.size==='smallest'?style.card__smallest:'') + ' ' + (props.inner?style.inner:'')}
                    ></div>
                ))}
            </>
        )
        
    }else if(props.empty){
        return(
            <div
                className={ style.card + ' ' + (smallCard ? style.smallCard : '') + ' ' + style.card__empty + ' ' + (props?.separator ? style.with_separator : '') + ' ' + (props?.widget ? style.widget : '') + ' ' + (props.size==='small'?style.card__small:'') + ' ' + (props.size==='smallest'?style.card__smallest:'')}
                // style={{width:(props.width?props.width:348)}}
            >
                {(props.title?props.title:'Nenhum')}
            </div>
        )
    }else{
        let showCard = true;
        // if((cardExternal?.id && cardExternal.enabled && cardExternal?.id == props?.parent?.id_job_status) || (!cardExternal || !cardExternal?.id || !cardExternal.enabled)){
        //     showCard = true;
        // }else{
        //     showCard = true;
        // }

        // DEFINE VARIÁVEL DOS CARDS INTERNOS
        let cards_internos_aux;        
        if(props?.internal !== false && props?.size !== 'smallest'){
            if(loadCardInternal && props.inner !== true){
                let cards_pendentes = cardsInternal;

                cards_internos_aux = <div className={(cardsInternal?.length > 0 ? 'mt-3' : '')}>
                                        {cards_pendentes?.map((card, i) => {
                                            let title;
                                            let subtitle;
                                            let background;

                                            // DEFINE TITLE
                                            if(card.nome_loja){
                                                title = card.nome_loja + ' - ' + card?.titulo;
                                            }else if(card.nome_usuario){
                                                title = props?.parent?.nome_cliente + ' - ' + card?.titulo;
                                            }else{
                                                title = card.titulo;
                                            }

                                            // DEFINE SUBTITLE
                                            if(card.nome_cliente){
                                                subtitle = (card.data ? get_date('date', card.data, 'datetime_sql') : '') + (card.nome_cliente ? ' - ' + card.nome_cliente : '');
                                            }else{
                                                subtitle = (card.data ? get_date('date', card.data, 'datetime_sql') : '');
                                            }

                                            if(card.status == 4) { // ADIADO
                                                background = optionsStatus.filter((el) => {
                                                return el.nome_status == 'adiado';
                                                })[0]?.cor;
                                            }else{
                                                if (card.status == 0 && card.data > window.currentDate) { // PADRÃO
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'nao_feito';
                                                })[0]?.cor;
                                                } else if (card.status == 0 && card.data < window.currentDate && card.status_sup != 3) { // ATRASADO
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'atrasado';
                                                })[0]?.cor;
                                                } else if (card.status == 0 && card.data < window.currentDate && card.status_sup == 3) { // ATRASADO REABERTO
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'atrasado';
                                                })[0]?.cor;
                                                } else if (card.status == 1) { // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'feito';
                                                })[0]?.cor;
                                                } else if (card.status == 2) { // NÃO TEM
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'nao_tem';
                                                })[0]?.cor;
                                                } else if (card.status == 3) { // CONCLUÍDO COM ATRASO
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'feito_com_atraso';
                                                })[0]?.cor;
                                                } else if (card.status == 5) { // CONCLUÍDO COM RESSALVA
                                                background = optionsStatus.filter((el) => {
                                                    return el.nome_status == 'feito_com_ressalva';
                                                })[0]?.cor;
                                                } else {
                                                background = '';
                                                } 
                                            }

                                            iconesInternal[i]=(
                                                <>
                                                    <Suspense>
                                                        <Icon
                                                            type="checklist"
                                                            title="Conformidade"
                                                            onClick={() => props?.handleSetShowModal()}
                                                            loading={props?.loadingConformidade}
                                                        />
                                                    </Suspense>
                                                    {/* BOTÃO DE ARQUIVAR SOMENTE PARA QUEM TEM NÍVEL DE ACESSO MASTER E NÃO ESTIVER NO SISTEMA CHAMADOS"*/}
                                                    {(window.rs_permission_apl === 'master' && !props.chamados ?
                                                    <Suspense>

                                                        <Icon
                                                            type={(card?.ativo_job_status == 2 ? 'unarchive' : 'archive')}
                                                            title={(card?.ativo_job_status == 2 ? 'Desarquivar' : 'Arquivar')}
                                                            onClick={() => handleArchive(card.id_job, card.id_job_status, (card?.ativo_job_status == 2 ? 1 : 2), undefined, undefined, false, card?.id_job_apl)}
                                                            animated
                                                            />
                                                            </Suspense>
                                                    : '')}
                                        
                                                    {(window.rs_permission_apl === 'master' || (props?.fases && (window.rs_permission_apl === 'supervisor' ||card.id_usuario == window.rs_id_usr)) ?
                                                    <>
                                                        <Editar
                                                            id={card?.id_job}
                                                            lote={card?.lote}
                                                            id_group={props?.parent?.id_job}
                                                            id_group_user={props?.parent?.id_job ? props?.parent?.id_usuario : undefined}
                                                            id_card_user={card?.id_usuario}
                                                            id_emp={props?.parents?.id_emp}
                                                            chamados={props.chamados}
                                                            fases={props.fases}
                                                            visitas={props.visitas}
                                                            disabled={(card.status != 0 && card.status != 4 ? true : false)}
                                                            disabledTitle={(card.status != 0 && card.status != 4 ? 'Não é possível editar um card já finalizado' : '')}
                                                            callback={(e) => (e === true ? get_card_internal(true) : {})}
                                                        />
                                                        
                                                        {(card?.status == 1 ?
                                                            (card?.desabilitar?.split(',').includes('9') ?
                                                                <></>
                                                            :
                                                                <Reabrir
                                                                    id_job={card?.id_job}
                                                                    id_job_status={card?.id_job_status}
                                                                    card={card}
                                                                    message={message}
                                                                    anexo={anexo}
                                                                    callback={handleCallbackReabrir}
                                                                />
                                                            )
                                                        : '')}
                                                    </>
                                                    :'')}
                                        
                                        {(card.status == 0 ?  
                                                        <>      
                                                            {(card.id_loja == window.rs_id_lja || card.id_usuario == window.rs_id_usr || window.rs_permission_apl === 'master' ? // RESPONSÁVEL PELO CARD OU NÍVEL DE ACESSO MASTER
                                                                <>
                                                                    <Suspense>
                                                                        <Icon
                                                                            type="calendar"
                                                                            title="Adiar"
                                                                            datepicker={true}
                                                                            valueStart={new Date(card.data)}
                                                                            animated
                                                                            onChange={(e) => setDate("Adiou o job de " +( card.data ? get_date('date', card.data, 'date_sql') : '') + " para " + cd(e), card.id_job_status, e, card.id_job, card?.data)}
                                                                        />
                                                                    </Suspense>

                                                                    {(props?.executando != card?.id_job_status && card?.executando!=1 ? 
                                                                        <Suspense>
                                                                            <Icon
                                                                                type="executar"
                                                                                title="Executar"
                                                                                animated
                                                                                onClick={() =>
                                                                                    props?.changeExecuting(
                                                                                        'Marcou como "Em execução"',
                                                                                        card?.id_job_status,
                                                                                        1,
                                                                                        card?.id_job,
                                                                                        card?.id_job_apl
                                                                                    )
                                                                                }
                                                                                />
                                                                        </Suspense>
                                                                    : '')}
                                                                </>
                                                            :'')}
                                        
                                                            {((window.rs_id_emp==26 && (props?.executando == card?.id_job_status || card?.executando==1)) && (card.id_loja == window.rs_id_lja || card.id_usuario == window.rs_id_usr) ? // RESPONSÁVEL PELO CARD
                                                                <>
                                                                    <Recusar
                                                                        chamados={props.chamados}
                                                                        fases={props.fases}
                                                                        id_job={card.id_job}
                                                                        id_job_status={card.id_job_status}
                                                                        title={(props.chamados ? 'Recusar' : 'Não tem')}
                                                                        modalTitle={(props.chamados ? 'Recusar' : 'Não tem') + ' - ' + card.titulo}
                                                                    />
                                                                
                                                                    <Suspense>
                                                                        <Icon
                                                                            type="check"
                                                                            title="Finalizar"
                                                                            onClick={() => changeStatus(
                                                                                "Finalizou o card",
                                                                                card.id_job,
                                                                                card.id_job_status,
                                                                                card.data < window.currentDate ? 3 : 1,
                                                                                undefined,
                                                                                undefined,
                                                                                undefined,
                                                                                props?.parents?.tipo_fase,
                                                                                card.id_job_apl
                                                                            )}
                                                                            animated
                                                                        />
                                                                    </Suspense>
                                                                </>
                                                            : '')}
                                                        </>
                                                    :'')}
                                                </>
                                            );

                                            return(
                                                <Card
                                                    key={'card_internal_'+card.id_job_status}
                                                    inner={true}
                                                    id={'card_internal_'+card.id_job_status}
                                                    id_aux={card.id_job_status}
                                                    background={background}
                                                    focus={((props?.executando == card?.id_job_status || card?.executando==1) ? true : false)}
                                                    parent={card}
                                                    title={title}                                                    
                                                    subtitle={subtitle}
                                                    id_user_group={props?.parent?.id_usuario}
                                                    email={card?.disparo_email == 1 ? true : false}
                                                    description={card.descricao}
                                                    files={card.anexo}
                                                    fullwidth={props?.fullwidth}
                                                    chatCallback={handleSetMessage}
                                                    chat={
                                                        {
                                                            alert: chatAlertFilho,
                                                            api: window.host_madnezz+'/systems/integration-react/api/list.php?do=set_msg&filter_id_module='+filterModule,
                                                            data: {
                                                                // nivel_msg: nivel_msg
                                                            },
                                                            id: card.id_job_status,
                                                            send: (() => { // CHECA SE O ENVIO DE MENSAGENS DEVE OU NÃO SER HABILITADO
                                                                if(props?.card?.desabilitar?.split(',').includes('5')){
                                                                    return false;
                                                                }else{
                                                                    if(props.chamados){ // SE ESTIVER EM CHAMADOS
                                                                        if(props?.card?.dias < 0){
                                                                            return false
                                                                        }else{
                                                                            if(props?.job.type_phase != 'Pós-venda' && (window.rs_id_lja == 0 || !window.rs_id_lja) && (filterModule == 2361 && window.rs_id_emp == 26 || filterModule != 2361)){
                                                                                if(props?.job.type_phase == 'Check'){ // SE ESTIVER NA FASE DE CHECK
                                                                                    if(props?.card?.id_usuario_sup){ // SE ESTIVER NA FILA DE UM OPERADOR NO CHECK
                                                                                        if(window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador'){ // SE A PERMISSÃO FOR MENOR QUE "CHECKER"
                                                                                            return false;
                                                                                        }else{                                                                  
                                                                                            if(window.rs_sistema_id == 238 && window.rs_id_emp != 26){ // VERIFICA SE ESTÁ NO CHAMADOS DE MANUTENÇÃO E SE O EMPREENDIMENTO É DIFERENTE DE 26
                                                                                                return false;
                                                                                            }else{
                                                                                                if(props?.card?.id_usuario == window.rs_id_usr){
                                                                                                    return true;
                                                                                                }else{
                                                                                                    return false;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }else{
                                                                                        return false;
                                                                                    }
                                                                                }else if(props?.job.type_phase == 'Início'){
                                                                                if(!props?.card?.recebido || props?.card?.recebido == 0){
                                                                                    return true;
                                                                                }else{
                                                                                    if(window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador'){
                                                                                    return false;
                                                                                    }else{
                                                                                    if(window.rs_sistema_id == 238 && window.rs_id_emp != 26){ // VERIFICA SE ESTÁ NO CHAMADOS DE MANUTENÇÃO E SE O EMPREENDIMENTO É DIFERENTE DE 26
                                                                                        return false;
                                                                                    }else{
                                                                                        return true;
                                                                                    }
                                                                                    }
                                                                                }
                                                                                }else{
                                                                                    if(window.rs_sistema_id == 238 && window.rs_id_emp != 26){ // VERIFICA SE ESTÁ NO CHAMADOS DE MANUTENÇÃO E SE O EMPREENDIMENTO É DIFERENTE DE 26
                                                                                        return false;
                                                                                    }else{
                                                                                        if(props?.card?.id_usuario == window.rs_id_usr){
                                                                                            return true;
                                                                                        }else{
                                                                                            return false;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }else{
                                                                                if(props?.job.type_phase == 'Início'){
                                                                                    if(!props?.card?.recebido || props?.card?.recebido == 0){
                                                                                        return true;
                                                                                    }else{
                                                                                        if(window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador'){
                                                                                            return false;
                                                                                        }else{
                                                                                            if(window.rs_sistema_id == 238 && window.rs_id_emp != 26){ // VERIFICA SE ESTÁ NO CHAMADOS DE MANUTENÇÃO E SE O EMPREENDIMENTO É DIFERENTE DE 26
                                                                                                return false;
                                                                                            }else{
                                                                                                return true;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }else{                                                              
                                                                                    if(window.rs_sistema_id == 238 && window.rs_id_emp != 26){ // VERIFICA SE ESTÁ NO CHAMADOS DE MANUTENÇÃO E SE O EMPREENDIMENTO É DIFERENTE DE 26
                                                                                        return false;
                                                                                    }else{
                                                                                        if(props?.job.type_phase == 'Pós-venda'){
                                                                                            return false;
                                                                                        }else{
                                                                                            return true;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }else{
                                                                        if(props?.card?.status == 4){
                                                                            return false;
                                                                        }else{
                                                                            if(props?.card?.status == 1 || props?.card?.status == 2 || props?.card?.status == 3){
                                                                                return false;
                                                                            }else{
                                                                                return true;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            })()
                                                        }
                                                    }
                                                    actions={
                                                        <>
                                                            {/* VISUALIZAÇÃO APÓS MAXIMIZAR */}
                                                            {(maximized && cardExternal.enabled ?
                                                            <Suspense>

                                                                <Icon
                                                                    type="view"
                                                                    title={(collapse?'Mostrar menos':'Mostrar mais')}
                                                                    animated
                                                                    active={collapse}
                                                                    onClick={() => handleScrollToElement(card?.id_job_status)} 
                                                                    />
                                                                    </Suspense>
                                                            :'')}

                                                            {iconesInternal[i]}
                                                        </>
                                                    }
                                                >
                                                    {(props?.internal?.params && window.rs_permission_apl !== 'leitura' ? 
                                                        <TrocaOperador
                                                            label={'Trocar de operador'}
                                                            options={props?.internal?.params?.options}
                                                            fases={props?.fases}
                                                            chamados={props?.chamados}
                                                            visitas={props?.visitas}
                                                            params={{
                                                                id_modulo: card?.id_modulo,
                                                                id_job: card?.id_job,
                                                                id_job_lote: card?.id_job_lote,
                                                                id_job_status: card?.id_job_status,
                                                                id_job_apl: card?.id_job_apl,
                                                                type_phase: card?.type_phase,
                                                                id_fase: card?.id_fase,
                                                                ativ_desc: props?.internal?.params?.ativ_desc,
                                                                filterModule: props?.internal?.params?.filterModule,
                                                                filter_subtype: props?.internal?.params?.filter_subtype
                                                            }}
                                                            onChange={handleChangeOperator}
                                                        />
                                                    :'')}
                                                </Card>
                                            );                                
                                        })}

                                        {(!props?.parent?.id_job_parent ?
                                            <div className={(cardsInternal?.length == 0 ? 'mt-3' : '') + ' d-flex align-items-center '+(props?.fases ? 'justify-content-end' : 'justify-content-end')}>
                                                {(window.rs_permission_apl === 'master' && !props?.parent?.id_grupo_mov && props?.internal?.new !== false && props.fases ?
                                                    <span className="me-1">
                                                        <Suspense>

                                                        <Icon
                                                            type="archived"
                                                            title={(viewArchived ? 'Ocultar arquivados' : 'Ver arquivados')}
                                                            active={viewArchived}
                                                            onClick={handleViewArchived}
                                                            animated
                                                            />
                                                            </Suspense>
                                                    </span>
                                                : '')}

                                                {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && !props?.parent?.id_job_parent && props?.internal?.new !== false && (props?.fases || props?.visitas) ? // SE A PERMISSÃO FOR MAIOR QUE GERENTE MOSTRA BOTÃO DE CRIAR CARDS INTERNOS                                                                                                 
                                                    <Editar
                                                        empty={true}
                                                        dateStart={(props?.parents?.date > window.currentDateWithoutHour ? props?.parents?.date : window.currentDateWithoutHour)}
                                                        frequency={{
                                                            id: global.frequencia.unico
                                                        }}
                                                        title="Criar novo card dentro do grupo"
                                                        tipo="usuario"
                                                        modulo={filterModule}
                                                        modalTitle="Novo card interno"
                                                        tipo_aux="card_internal"
                                                        id_group={props?.parent?.id_job}
                                                        id_job_status_parent={props?.parent?.id_job_status}
                                                        // id_system={optionsSystems_aux}
                                                        // job={props?.parent?.job}
                                                        category={{id:props?.parent?.id_categoria}}
                                                        subcategory={{id: props?.parent?.id_subcategoria}}
                                                        tipo_fase={props?.parent?.tipo_fase}
                                                        id_client={props?.parent?.id_cliente}    
                                                        chamados={props.chamados}
                                                        fases={props.fases}
                                                        visitas={props.visitas}
                                                        callback={(e) => (e === true ? get_card_internal(true) : {})}
                                                        refreshCard={handleRefreshCard}
                                                        refreshCalendar={handleRefreshCalendar}
                                                    />
                                                :'')}
                                            </div>
                                        :'')}
                                    </div>;
            }else{
                if(props.inner !== true && !props?.parent?.id_job_parent){
                    cards_internos_aux = <div className="mt-3">
                                            {[...Array(2)].map((card, i) => (
                                                <Card
                                                    key={'card_internal_loading_'+i}
                                                    inner={true}
                                                    loading={true}
                                                    fullwith={props?.fullwidth}
                                                />
                                            ))}
                                        </div>;
                }
            }
        }  

        // INTEGRAÇÃO DE SISTEMAS
        let interaction = true;
        let habilitarFinalizar;

        if (props?.parent?.card_qtd_total > props?.parent?.card_qtd_finalizado) {
            habilitarFinalizar = true
        } else {
            habilitarFinalizar = false;
        }

        if (props?.parent?.status_sup == 3 || props?.parent?.status_sup == 2) {
            if (props?.parent?.id_loja) {
                if (props?.parent?.id_loja != window.rs_id_lja) {
                    interaction = false;
                } else {
                    interaction = 'custom';
                }
            }
            if (props?.parent?.id_usuario) {
                if (props?.parent?.id_usuario != window.rs_id_usr) {
                    interaction = false;
                } else {
                    interaction = 'custom';
                }
            }
        } else { // SE FOR STATUS REABERTO PELO SUPERVISOR (3)
            if (props?.parent?.status == 1 || props?.parent?.status == 3) { // SE FOR STATUS FINALIZADO (1) OU FINALIZADO COM ATRASO (3)
                interaction = false;
            } else {
                if (props?.parent?.id_loja) {
                    if (props?.parent?.id_loja != window.rs_id_lja) {
                        interaction = false;
                    }
                }
                if (props?.parent?.id_usuario) {
                    if (props?.parent?.id_usuario != window.rs_id_usr) {
                        interaction = false;
                    }
                }
            }
        }

        if (props?.parent?.status != 4 && props?.integration !== false) {
            if ((props.chamados && props?.parents?.tipo_fase !== 'Início') || !props.chamados) {
                if (info?.aux_sistema_api && info?.sistema_visivel == 1) {
                    let aux_sistema_api = JSON.parse(info?.aux_sistema_api);
                    if (aux_sistema_api.job_system_integration == 1 || aux_sistema_api.job_system_integration == 25) { // CHECKLIST
                        let submit = true;
                        let submitInteraction = true;
                        let submitTitle = '';

                        if (habilitarFinalizar) {
                            submitInteraction = false;
                            submitTitle = 'É necessário finalizar todos os cards internos antes de enviar o checklist';
                        } else {
                            if (props?.parent?.status == 1 || props?.parent?.status == 3) {
                                submit = false;
                            } else {
                                if (props?.parent?.id_loja) {
                                    if (props?.parent?.id_loja != window.rs_id_lja) {
                                        submit = false;
                                    } else {
                                        submit = 'custom';
                                    }
                                }
                                if (props?.parent?.id_usuario) {
                                    if (props?.parent?.id_usuario != window.rs_id_usr) {
                                        submit = false;
                                    } else {
                                        submit = 'custom';
                                    }
                                }
                            }
                        }

                        system_integration_aux = (
                            <div className="mt-3">
                                <Checklist
                                    integration={true}
                                    checklist_id={aux_sistema_api?.job_system_integration_type}
                                    job_dado_aux1={aux_sistema_api?.dado_aux1}
                                    loja_id={(props?.parent?.id_loja ? props?.parent?.id_loja : aux_sistema_api?.job_system_integration_type_1)}
                                    callback={(e) => finalizaJob(props?.parent?.id_job, props?.parent?.id_job_status, (props?.parent?.data < window.currentDate ? 3 : 1), e, props?.parent?.id_job_apl)}
                                    submit={{
                                        enabled: submit,
                                        interaction: submitInteraction,
                                        title: submitTitle
                                    }}
                                    interaction={interaction}
                                    job={
                                        {
                                            job_id: props?.parent.job_status_id_old ? props?.parent.job_status_id_old : props?.parent?.id_job_status,
                                            data_job: props?.parent?.data.slice(0,10),
                                            sistema_dado_aux: props?.parent?.dado_aux
                                        }
                                    }
                                    job_status_supervisor={props?.parent?.status_sup}
                                    job_title={props?.parent?.titulo}
                                    btn_respondido={props?.visitas && !props?.parent?.job_dado_aux}
                                />
                            </div>
                        )
                    } else if (aux_sistema_api.job_system_integration == 28) { // CHECKLIST LARAVEL
                        let submit = true;
                        let submitInteraction = true;
                        let submitTitle = '';

                        if (habilitarFinalizar) {
                            submitInteraction = false;
                            submitTitle = 'É necessário finalizar todos os cards internos antes de enviar o checklist';
                        } else {
                            if (props?.parent?.status == 1 || props?.parent?.status == 3) {
                                submit = false;
                            } else {
                                if (props?.parent?.id_loja) {
                                    if (props?.parent?.id_loja != window.rs_id_lja) {
                                        submit = false;
                                    } else {
                                        submit = 'custom';
                                    }
                                }
                                if (props?.parent?.id_usuario) {
                                    if (props?.parent?.id_usuario != window.rs_id_usr) {
                                        submit = false;
                                    } else {
                                        submit = 'custom';
                                    }
                                }
                            }
                        }

                        system_integration_aux = (
                            <div className="mt-3">
                                <ChecklistLaravel
                                    integration={true}
                                    checklist_id={aux_sistema_api?.job_system_integration_type}
                                    job_dado_aux1={aux_sistema_api?.dado_aux1}
                                    loja_id={(props?.parent?.id_loja ? props?.parent?.id_loja : aux_sistema_api?.job_system_integration_type_1)}
                                    callback={(e) => finalizaJob(props?.parent?.id_job, props?.parent?.id_job_status, (props?.parent?.data < window.currentDate ? 3 : 1), e, props?.parent?.id_job_apl)}
                                    submit={{
                                        enabled: submit,
                                        interaction: submitInteraction,
                                        title: submitTitle
                                    }}
                                    interaction={interaction}
                                    job={
                                        {
                                            job_id: props?.parent?.id_job_status,
                                            status: props?.parent?.status,
                                            data_job: props?.parent?.data.slice(0,10),
                                            sistema_dado_aux: props?.parent?.dado_aux
                                        }
                                    }
                                    job_status_supervisor={props?.parent?.status_sup}
                                    job_title={props?.parent?.titulo}
                                    btn_respondido={props?.visitas && !props?.parent?.job_dado_aux}
                                />
                            </div>
                        )
                    } else if (aux_sistema_api.job_system_integration == 24) { // TELEFONE LOJAS
                        system_integration_aux = (
                            <div className="mt-3">
                                <Telefones
                                    integrated
                                    usuario={props?.parent?.id_usuario}
                                    loja={(props?.parent?.id_loja ? props?.parent?.id_loja : aux_sistema_api?.job_system_integration_type_1)}
                                    callback={(e) => finalizaJob(props?.parent?.id_job, props?.parent?.id_job_status, (props?.parent?.data < window.currentDate ? 3 : 1), e, props?.parent?.id_job_apl)}
                                    interaction={interaction}
                                />
                            </div>
                        )
                    } else if (aux_sistema_api.job_system_integration == global.integracao.trade) { // TRADE NOVO
                        system_integration_aux = (
                            <div className="mt-3">
                                <Trade
                                    integrated
                                    loja_id={props?.parent?.id_loja}
                                    job={{
                                        job_id: props?.parent?.id_job,
                                        job_status_id: props?.parent?.id_job_status,
                                        job_data: props?.parent?.data.slice(0,10),
                                        sistema_dado_aux: props?.parent?.dado_aux,
                                        status_sup: props?.parent?.status_sup,
                                    }}
                                    grupos={aux_sistema_api?.job_system_integration_type == 1 ? aux_sistema_api?.job_system_integration_type_1 : undefined}
                                    industrias={aux_sistema_api?.job_system_integration_type == 2 ? aux_sistema_api?.job_system_integration_type_1 : undefined}                                    
                                    produtos={aux_sistema_api?.job_system_integration_type == 2 ? aux_sistema_api?.job_system_integration_type_2 : undefined}
                                    callback={(nothingReturns) => finalizaJob(props?.parent?.id_job, props?.parent?.id_job_status, (props?.parent?.data < window.currentDate ? 3 : 1), nothingReturns, props?.parent?.id_job_apl)}
                                    interaction={interaction}
                                />
                            </div>
                        )
                    }
                }
            }
        }

        let card_visible = (cardRef && cardInIvew && (props.visitas || props.fases)) || (!props.visitas && !props.fases);
        
        // DEFINE VARIAVEL DOS CARDS
        let card_aux = <div
                            id={props.id}
                            ref={cardRef}
                            className={ style.card + ' ' + (smallCard ? style.smallCard : '') + ' ' + (props?.modal ? style.in_modal : '') + ' ' + (props?.draggable ? style.draggable : '') + ' ' + (props?.separator ? style.with_separator : '') + ' ' + (props.focus?style.focus:'') + ' ' + (props?.widget ? style.widget : '') + ' card_element ' + (props?.disabled ? style.disabled : '') + ' ' + (props.size==='small'?style.card__small:'') + ' ' + (props.size==='smallest'?style.card__smallest:'') + ' ' + (props.inner?style.inner:'') + ' ' + (props?.fullwidth ? style.full_width : '') + ' ' + (props?.shadow === false ? style.no__shadow : '')}
                            style={{
                                backgroundColor: (!card_visible ? 'transparent' : undefined),
                                boxShadow: (!card_visible ? 'none' : undefined),
                                opacity: (!card_visible ? 0 : undefined),
                            }}
                        >
                            {(card_visible ?
                                <>
                                    <Modal show={modalArchive?.show} onHide={() => (setModalArchive(false), setDateStartArchive(new Date(window.currentDate)), setDateEndArchive(''))}>
                                        <ModalHeader>
                                            <ModalTitle>
                                                {(modalArchive?.title ? modalArchive?.title : 'Selecionar período')}
                                            </ModalTitle>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form
                                                api={window.host_madnezz + '/systems/integration-react/api/list.php?do=closedJob'}
                                                data={{
                                                    id_job: modalArchive?.id_job,
                                                    ativ_desc: ((props?.parent?.ativo_job_status ? 'Desarquivou' : 'Arquivou') + ' o card de '+cd(dateStartArchive)+' até '+cd(dateEndArchive)),
                                                    date_start: get_date('date_sql', cd(dateStartArchive)),
                                                    date_end: get_date('date_sql', cd(dateEndArchive)),
                                                    closed: (props?.parent?.ativo_job_status ? 2 : 1)
                                                }}
                                                callback={handleCallbackArchive}                                
                                                status={handleSetButtonState}
                                                toast={'Card '+(props?.parent?.ativo_job_status ? 'desarquivado' : 'arquivado')+' de '+cd(dateStartArchive)+' até '+cd(dateEndArchive)}
                                            >
                                                <Input
                                                    type="date"
                                                    label="De"
                                                    name="data_inicio_arquivado"
                                                    value={dateStartArchive}
                                                    onChange={(e) => setDateStartArchive(e)}
                                                />

                                                <Input
                                                    type="date"
                                                    label="Até"
                                                    name="data_fim_arquivado"
                                                    value={dateEndArchive}
                                                    valueStart={(dateStartArchive ? dateStartArchive : '')}
                                                    valueEnd={(props?.parent?.data_fim_formatada ? new Date(get_date('date_sql', props?.parent?.data_fim_formatada)) : '')}
                                                    onChange={(e) => setDateEndArchive(e)}
                                                />

                                                <Button
                                                    type="submit"
                                                    status={buttonStateArchive}
                                                    disabled={(dateEndArchive ? false : true)}
                                                    title={(dateEndArchive ? '' : 'Selecione uma data antes de continuar')}
                                                >
                                                    {(props?.parent?.ativo_job_status ? 'Desarquivar' : 'Arquivar')}
                                                </Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>

                                    {(props.header !== false ?
                                        <div className={ style.card__header + ' ' + border_aux + ' ' + bg_aux + ' ' + (props?.alert ? style.bg__alert : '') }>
                                            <div 
                                                className={style.card__info + ' ' + (smallCard ? 'pb-0' : '')}
                                                // onClick={() => (getMessage(props.id_aux), handleSetCollapse())}
                                            >
                                                <div className={(props.size==='smallest' ? 'd-block' : 'd-flex') + ' align-items-start justify-content-between'}>

                                                    <Tippy content={(props.tippy?props.tippy:props.title)} disabled={(props?.size=='smallest' || props?.dragging ? true : false)}>
                                                        <h3 className={style.title + ' ' + (props?.avulso ? style.avulso : '')} style={(props?.wrap ? {whiteSpace:'initial',overflow:'visible'} : {})}>
                                                            <span className={(props.size === 'smallest' && props.subtitle && props?.bold ? 'font-weight-bold' : '')}>
                                                                {title}
                                                            </span>
                                                            {(props.size === 'smallest' ? <br /> : '')}
                                                            {(props.size === 'smallest' ? props.subtitle : '')}
                                                        </h3>
                                                    </Tippy>

                                                    {(props.obs4 || props.circle || props?.attention || props.email ?
                                                        <span className={style.small}>
                                                            <div className={'d-flex align-items-center '+style.obs4}>
                                                                {(props.obs4 ?
                                                                    <span style={{opacity:(props.print ? '1' : '.5')}}>
                                                                        {props.obs4}
                                                                    </span>
                                                                :'')}

                                                                {(props.circle ?

                                                                    <Tippy content={(props.circle?.title ? props.circle.title : props.circle)} disabled={props?.dragging ? true : false}>
                                                                        <span className={style.info_circle}>
                                                                            {props.circle?.value}
                                                                        </span>
                                                                    </Tippy>
                                                                :'')}

                                                                {(props?.attention ?
                                                                    <Suspense><Icon type="exclamation" className="text-warning" title={props.attention} animated /></Suspense>
                                                                :'')}

                                                                {(props?.email ?
                                                                <Suspense>

                                                                    <Icon
                                                                        type="envelope"
                                                                        title="Incluído no disparo de e-mail"
                                                                        readonly={true}
                                                                        animated
                                                                        />
                                                                        </Suspense>
                                                                :'')}
                                                            </div>
                                                        </span>
                                                    :'')}
                                                </div>

                                                {(() => {
                                                    if(!smallCard){
                                                        if(!props.size || (props.size !== 'small' && props.size !== 'smallest')){
                                                            return(
                                                                <div className={'d-flex align-items-start justify-content-between ' + style.subtitle_container}>
                                                                    <div>
                                                                        <Tippy content={props.subtitle} disabled={props?.dragging ? true : false}>
                                                                            <h4 className={ style.subtitle }>
                                                                                { props.subtitle }
                                                                            </h4>
                                                                        </Tippy>
                                                                    </div>

                                                                    {(props?.obs5 ?
                                                                        <div>
                                                                            <h4 className={ style.subtitle }>
                                                                                {props?.obs5}
                                                                            </h4>
                                                                        </div>
                                                                    :'')}
                                                                </div>
                                                            )
                                                        }
                                                    }
                                                })()}
                                            </div>

                                            {(props?.size !== 'smallest' ?
                                                <div className={ style.card__actions }>
                                                    <div className="d-flex align-items-center justify-content-between" style={{minHeight:24}}>
                                                        <div className={ style.left } onClick={() => (handleSetCollapse(props?.parent?.id_job, props?.parent?.id_job_status))}>
                                                            {(props.size!=='smallest' && !props?.inner && props.obs1 ?

                                                                <Tippy content={props?.obs1?.label ? (props?.obs1?.label+': '+(props?.obs1?.tippy ? props?.obs1?.tippy : props?.obs1?.info)) : props?.obs1} disabled={props?.dragging ? true : false}>
                                                                    <span className={ style.obs1 }>
                                                                        { props?.obs1?.info ? props?.obs1?.info : props?.obs1 }
                                                                    </span>
                                                                </Tippy>
                                                            :'')}

                                                            {(props.obs2?

                                                                <Tippy content={props?.obs2?.label ? (props?.obs2?.label+': '+(props?.obs2?.tippy ? props?.obs2?.tippy : props?.obs2?.info)) : props?.obs2} disabled={props?.dragging ? true : false}>
                                                                    <span className={ style.obs2 } style={(props?.condition ? {maxWidth:'100%'} : {})}>
                                                                        { props?.obs2?.info ? props?.obs2?.info : props?.obs2 }
                                                                    </span>    
                                                                </Tippy>
                                                            :'')}

                                                            {(props.obs3?

                                                                <Tippy content={props?.obs3?.label ? (props?.obs3?.label+': '+(props?.obs3?.tippy ? props?.obs3?.tippy : props?.obs3?.info)) : props?.obs3} disabled={props?.dragging ? true : false}>
                                                                    <span className={ style.obs3 } style={(props?.condition ? {maxWidth:'100%'} : {})}>
                                                                        { props?.obs3?.info ? props?.obs3?.info : props?.obs3 }
                                                                    </span>    
                                                                </Tippy>
                                                            :'')}
                                                        </div>
                                                        <div className={ style.right }>   
                                                            {/* VISUALIZAÇÃO NORMAL */}
                                                            {(!maximized && props.view !== false && !cardExternal.enabled ?
                                                            <Suspense>

                                                                <Icon
                                                                    type="view"
                                                                    title={(collapse?'Mostrar menos':'Mostrar mais')}
                                                                    animated
                                                                    active={collapse}
                                                                    onClick={() => (handleSetCollapse(props?.parent?.id_job, props?.parent?.id_job_status), (!hover?((props.iframe?setLoading(true):setLoading(false))):{}), props?.changeViewing('Clicou em "Mostrar mais"',props?.parent?.id_job_status,1,props?.parent?.id_job,props?.parent?.id_job_apl))}
                                                                    />
                                                                    </Suspense>
                                                            :'')}

                                                            {/* VISUALIZAÇÃO APÓS MAXIMIZAR */}
                                                            {(maximized && cardExternal.enabled ?
                                                            <Suspense>

                                                                <Icon
                                                                    type="view"
                                                                    title={(collapse?'Mostrar menos':'Mostrar mais')}
                                                                    animated
                                                                    active={collapse}
                                                                    onClick={() => handleScrollToElement(props?.parent?.id_job_status)} 
                                                                    />
                                                                    </Suspense>
                                                            :'')}

                                                            {(props?.fases_aux || (props.expand?.enabled && !window.isMobile && props?.parent?.card_qtd_total > 0 && props?.filters?.filter_type !== 7) ?
                                                                <Suspense>

                                                                <Icon
                                                                    type={maximized ? 'internal' : 'external'}
                                                                    title={maximized ? 'Minimizar' : 'Maximizar'}
                                                                    onClick={() => handleSetExternal(props?.id, props?.parent?.id_job, props?.parent?.id_job_status)}
                                                                    />
                                                                    </Suspense>
                                                            :'')}

                                                            {icones}                                        
                                                        </div>
                                                    </div>
                                                </div>       
                                            :'')}                         
                                        </div>
                                    :'')}

                                    {(props?.size !== 'smallest' && collapse ?
                                        <div className={ style.card__body }>
                                            <div onClick={() => (setCollapse(true), (!hover?setLoading(false):{}))}>
                                                {(anexos.length > 0 ?
                                                    <>
                                                        <p className="mb-1">Anexos:</p>
                                                        <div className={style.files}>
                                                            {anexos.map((item, i) => {
                                                                // DEFINE URL DO UPLOAD
                                                                let url_aux = window.upload;

                                                                if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
                                                                    url_aux = window.upload_madnezz;
                                                                }

                                                                if(typeof item === 'string'){ // MODELO ANTIGO DE UPLOAD (SOMENTE ID)
                                                                    return (
                                                                        <a href={url_aux + '/' + item} target="_blank" className={style.file__link} key={'file_' + i}>

                                                                            <Tippy content={'Arquivo '+anexos.length - i}>
                                                                                <span className={style.file_name}>
                                                                                    Arquivo {anexos.length - i}
                                                                                </span>
                                                                            </Tippy>

                                                                            <span className="text-secondary">{(info?.anexo ? (info?.anexo?.split(',').includes(item) ? ' (Job)' : ' (Chat)') : ' (Chat)')}</span>
                                                                            
                                                                            <Suspense><Icon type="external" /></Suspense>
                                                                        </a>
                                                                    )
                                                                }else{ // MODELO NOVO DE UPLOAD (TODAS AS INFORMAÇÕES DO ARQUIVO)
                                                                    return (
                                                                        <a href={url_aux + '/' + item.id} target="_blank" className={style.file__link} key={'file_' + i}>

                                                                            <Tippy content={item?.name}>
                                                                                <span className={style.file_name}>
                                                                                    {item.name}
                                                                                </span>
                                                                            </Tippy>
                                                                            
                                                                            <span className="text-secondary">{(info?.anexo ? (info?.anexo.includes(item.id) ? ' (Job)' : ' (Chat)') : ' (Chat)')}</span>

                                                                            <Suspense><Icon type="external" /></Suspense>
                                                                        </a>
                                                                    )
                                                                }
                                                            }).reverse()}
                                                        </div>
                                                    </>
                                                : '')}

                                                {(infoLoading ?
                                                    <Loader className="mb-3" />
                                                :'')}

                                                {(info?.descricao ?
                                                    <div
                                                        id={'description_'+props?.parent?.id_job_status}
                                                        className={style.description}
                                                        dangerouslySetInnerHTML={{__html: info?.descricao}}
                                                    />
                                                : '')}

                                                {/* LOADING DA BUSCA DE INFORMAÇÕES DA LOJA */}
                                                {(infoLojaLoading ? 
                                                    <Loader className="mb-3" />
                                                :'')}

                                                {/* INFORMAÇÕES DO SOLICITANTE */}
                                                {(infoUsuario?.telefone || infoUsuario?.email || infoLoja?.logradouro ? 
                                                    <div className="mt-3">
                                                        <p className="mb-2">
                                                            <span className="font-weight-bold">Informações do solicitante</span>
                                                        </p>

                                                        <table className={style.more_info}>
                                                            <tbody>
                                                                {(infoUsuario?.telefone ?
                                                                    <tr>
                                                                        <td>
                                                                            <p className={style.no_border}>Telefone</p>
                                                                            <p><a href={'tel:'+infoUsuario?.telefone}>{infoUsuario?.telefone}</a></p>
                                                                        </td>
                                                                    </tr>
                                                                :<></>)}

                                                                {(infoUsuario?.email ?
                                                                    <tr>
                                                                        <td>
                                                                            <p className={style.no_border}>E-mail</p>
                                                                            <p><a href={'mailto:'+infoUsuario?.email}>{infoUsuario?.email}</a></p>
                                                                        </td>
                                                                    </tr>
                                                                :<></>)}

                                                                {(infoLoja?.logradouro ?
                                                                    <tr>
                                                                        <td>
                                                                            <p className={style.no_border}>Endereço da loja</p>
                                                                            <p>
                                                                                {infoLoja?.logradouro + (infoLoja?.numero ? ', '+infoLoja?.numero : '') + (infoLoja?.bairro ? ', '+infoLoja?.bairro : '') + (infoLoja?.cidade ? ', '+infoLoja?.cidade : '') + (infoLoja?.cep ? ' - CEP: '+infoLoja?.cep : '') + (infoLoja?.estado ? ' - '+infoLoja?.estado : '')}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                :<></>)}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                :'')}

                                                {/* INSERE UM "SEPARADOR" CASO TENHA MICROSSISTEMA E INFORMAÇÕES DA LOJA NO MESMO CARD */}
                                                {(microssistemaValues.length > 0 && (infoLoja || infoUsuario) ?
                                                    <p className="mt-3 mb-2">
                                                        <span className="font-weight-bold">Outras informações</span>
                                                    </p>
                                                :'')}

                                                {(microssistemaValues.length > 0 ?
                                                    <table className={style.more_info}>
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    <p className="mb-0">
                                                                        <span className={style.small}>Tipo de liberação de acesso</span>
                                                                        Ar condicionado
                                                                    </p>
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {microssistemaValues.map((item, i) => {
                                                                let valor_aux;

                                                                if(item?.componente_id == global?.componentes?.select_personalizado){ // SE FOR SELECT PERSONALIZADO
                                                                    if(microssistemaCustomOptions.length > 0){
                                                                        if(microssistemaCustomOptions.filter((elem) => elem.id == item.valor).length > 0){
                                                                            valor_aux = microssistemaCustomOptions.filter((elem) => elem.id == item.valor)[0].label;
                                                                        }
                                                                    }else{
                                                                        valor_aux = item?.valor;
                                                                    }
                                                                }else if(item?.componente_id == global?.componentes?.checkbox_personalizado){ // SE FOR CHECKBOX PERSONALIZADO
                                                                    if(microssistemaCustomOptions.length > 0){
                                                                        valor_aux = '';
                                                                        item?.valor.split(',').map((item, i) => {
                                                                            if(microssistemaCustomOptions.filter((elem) => elem.id == item).length > 0){
                                                                                valor_aux += microssistemaCustomOptions.filter((elem) => elem.id == item)[0].label + ', ';
                                                                            }
                                                                        });

                                                                        valor_aux = valor_aux.slice(0,-2);
                                                                    }
                                                                }else if(item?.componente_id == global?.componentes?.select_loja){ // SE FOR SELECT DE LOJAS
                                                                    if(microssistemaOptionsLoja.length > 0){
                                                                        if(microssistemaOptionsLoja.filter((elem) => elem.id == item.valor).length > 0){
                                                                            valor_aux = microssistemaOptionsLoja.filter((elem) => elem.id == item.valor)[0].label;
                                                                        }else{
                                                                            valor_aux = item?.valor;
                                                                        }
                                                                    }else{
                                                                        valor_aux = item?.valor;
                                                                    }
                                                                }else if(item?.componente_id == global?.componentes?.data){ // SE FOR SELECT DE LOJAS
                                                                    valor_aux = cd(item.valor);
                                                                }else if(item?.componente_id == global?.componentes?.anexo){ 
                                                                    valor_aux = '<a href="https://upload.madnezz.com.br/'+item?.valor+'" target="_blank">Anexo</a>';
                                                                }else{
                                                                    valor_aux = item?.valor;
                                                                }

                                                                return(
                                                                    <tr key={'microssistema_item_'+item?.id}>
                                                                        <td>
                                                                            <p className={style.no_border}>{item?.nome}</p>

                                                                            {(item?.componente_id == global?.componentes?.anexo ? 
                                                                                <p dangerouslySetInnerHTML={{__html: valor_aux}}></p> 
                                                                            :
                                                                                <p>{valor_aux}</p>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                :'')}

                                                {/* INFORMAÇÕES DOS FUNCIONÁRIOS DO COMPONENTE DE LIBERAÇÃO DE ACESSO */}
                                                {(info?.funcionarios?.length > 0 &&
                                                    <Form>
                                                        <Liberacao
                                                            values={info?.funcionarios}
                                                            approval={true}
                                                            callback={handleCallbackLiberacao}
                                                            readonly={(props?.tipo_permissao === 'livre' && props?.parent?.tipo_fase !== 'Início') || (props?.tipo_permissao !== 'livre' && props?.parent?.tipo_fase !== 'Operação') ? true : false}
                                                        />
                                                    </Form>
                                                )}

                                                {(() => {
                                                    let placeholder_aux = undefined;
                                                    let nivel_aux = props?.chat?.nivel_msg;

                                                    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DE CARD DA API
                                                        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
                                                            if(props?.parents?.tipo_fase){ // VERIFICA SE O JOB TEM TIPO_FASE
                                                                if(JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[props?.parents?.tipo_fase]){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                                                                    placeholder_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[props?.parents?.tipo_fase].label; // SETA A LABEL
                                                                    nivel_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[props?.parents?.tipo_fase].nivel_msg; // SETA O NÍVEL DAS MSGS
                                                                }
                                                            }
                                                        }
                                                    }                                               

                                                    return(
                                                        <>                    
                                                            {(props.chat !== false ?
                                                                <Chat
                                                                    key={props.chat?.id + '_' + props.chat?.id_job + '_' + props.chat?.id_job_status}
                                                                    chamados={props?.chamados}
                                                                    autoSubmit={props.autoSubmit}
                                                                    setAutoSubmit={props.setAutoSubmit}
                                                                    api={props.chat?.api}
                                                                    id={props.chat?.id}
                                                                    id_job={props.chat?.id_job}
                                                                    jobs={props?.jobs}
                                                                    jobsCols={props?.jobsCols}
                                                                    job={props?.parent}
                                                                    optionsModule={props?.optionsModule}
                                                                    tipo_permissao={props?.tipo_permissao}
                                                                    border={chatAlert}
                                                                    editor={true}
                                                                    defaultValue={props?.fases || props?.parent?.id_job_parent ? messages?.filter((elem) => elem.log_tipo === 'Mensagem')[messages?.filter((elem) => elem.log_tipo === 'Mensagem').length - 1]?.mensagem : undefined}
                                                                    permission_module={props?.permission_module}
                                                                    send={(props.chat?.send === false ? false : true)}
                                                                    button={{
                                                                        show: button_chat === false ? false : buttonChatSubmit,
                                                                        finalizar: {
                                                                            config: {
                                                                                disabled: funcionariosValidation ? true : false,
                                                                                tippy: funcionariosValidation ? funcionariosValidation : undefined
                                                                            }
                                                                        }
                                                                    }}
                                                                    funcionarios={funcionariosValues}
                                                                    empty={(messages.length > 0 || props.chat?.defaultMessage ? false : true)}
                                                                    anexo={(props?.chat?.anexo === false ? false : {multiple: true})}
                                                                    callback={reloadChat}
                                                                    refreshCalendar={handleRefreshCalendar}
                                                                    refreshCard={handleRefreshCard}
                                                                    placeholder={placeholder_aux}
                                                                    nivel_msg={nivel_aux}
                                                                    message={props?.chat?.message}
                                                                    mensagem_finaliza={props?.chat?.mensagem_finaliza}
                                                                    actions={actions}
                                                                >
                                                                    {(showMessages ?
                                                                        (searchMessages===true?
                                                                            (props.iframe?'':<Loader show={true} className="mb-3" />)
                                                                        :
                                                                            ((collapse||hover||loaded)&&messages?
                                                                                messages?.map((message, i) => { 
                                                                                    if(message.anexo){
                                                                                        message?.anexo.split(',').map((item, i) => {
                                                                                            messageFiles.push(item);                                                                          
                                                                                        });
                                                                                    }

                                                                            let message_aux;
                                                                            let item_aux = 'o card';

                                                                            if(props.chamados){
                                                                                item_aux = 'o chamado';
                                                                            }else if(props.visitas){
                                                                                item_aux = 'a visita';
                                                                            }else if(props.fases){
                                                                                item_aux = 'o card';
                                                                            }else{
                                                                                item_aux = 'o job';
                                                                            }

                                                                            if(message?.log_tipo === 'Cadastro'){
                                                                                if(message?.mensagem){
                                                                                    message_aux = message?.mensagem;
                                                                                }else{
                                                                                    message_aux = 'Cadastrou '+item_aux;
                                                                                }
                                                                            }else if(message?.log_tipo === 'Edição'){
                                                                                if(message?.mensagem){
                                                                                    message_aux = message?.mensagem;
                                                                                }else{
                                                                                    message_aux = 'Editou '+item_aux;
                                                                                }
                                                                            }else{
                                                                                if(message.mensagem !== null){
                                                                                    message_aux = message?.mensagem + (message.motivo ? '\n' + (message?.status == 2 ? 'Motivo' : 'Observações')+': ' + message.motivo + '' : '');
                                                                                }else{
                                                                                    message_aux = '';
                                                                                }
                                                                            }
                                                                            
                                                                            // DEFINE URL DO UPLOAD
                                                                            let url_aux = window.upload;

                                                                            if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
                                                                                url_aux = window.upload_madnezz;
                                                                            }       

                                                                            return(
                                                                                <Message
                                                                                    key={'message_'+message.id}
                                                                                    sender={message.nome_usuario}
                                                                                    date={cdh(message.dataHora_cad)}
                                                                                    text={message_aux}
                                                                                    files={
                                                                                        (message.anexo ?
                                                                                            (message?.anexo.includes('{') ? 
                                                                                                JSON.parse(message?.anexo).map((item, i) => {
                                                                                                    return (
                                                                                                        <a href={url_aux + '/' + item.id} target="_blank" className={style.file__link + ' d-block'} key={'message_' + message.id + '_file_' + i}>
                                                                                                            {item.name}
                                                                                                            <Suspense><Icon type="external" /></Suspense>
                                                                                                        </a>
                                                                                                    )
                                                                                                })
                                                                                            :
                                                                                                message?.anexo.split(',').map((item, i) => {
                                                                                                    return (
                                                                                                        <a href={url_aux + '/' + item} target="_blank" className={style.file__link + ' d-block'} key={'message_' + message.id + '_file_' + i}>
                                                                                                            Arquivo {i + 1}
                                                                                                            <Suspense><Icon type="external" /></Suspense>
                                                                                                        </a>
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        : '')
                                                                                    }
                                                                                    align={(window.rs_id_usr == message.id_usuario?'right':'left')}
                                                                                />
                                                                            )
                                                                        })
                                                                    :'')
                                                                )
                                                            :
                                                                <div className={style.alert__messages} onClick={() => (setShowMessages(true), scrollChat())}>
                                                                    {messages.length} Mensage{(messages.length > 1 ? 'ns':'m')} enviada{(messages.length > 1 ? 's':'')}
                                                                </div>
                                                            )}
                                                        </Chat>
                                                    :'')}
                                                </>
                                            )
                                        })()}

                                                {(loading ? 
                                                    <div className="mt-3">
                                                        <Loader show={loading} />
                                                    </div>
                                                :'')}

                                                {(info?.api_sistema_api == 0 && props?.card?.status != 4 && info?.sistema_visivel == 1 && (collapse||hover) && (info?.aux_sistema_api && JSON.parse(info?.aux_sistema_api)?.job_system_integration != global.integracao.trade) ?
                                                    <div className="position-relative mt-3">
                                                        <iframe
                                                            name={'job_' + props?.parent?.id_job + '_' + props?.parent?.id_job_status + '_' + (props?.parent?.data < window.currentDate ? 3 : 1)}
                                                            src={
                                                                window.host + "/systems/integration-react/sistema.php?loja_id=" +
                                                                (props?.parent?.id_loja ? props?.parent?.id_loja : '') +
                                                                "&usuario_id=" + (props?.parent?.id_usuario ? props?.parent?.id_usuario : '') +
                                                                "&data=" + (props?.parent?.date ? get_date('date', props?.parent?.data, 'date_sql') : '') +
                                                                "&mes=" + props?.parent?.data.split('-')[1] +
                                                                "&ano=" + props?.parent?.data.split('-')[0] +
                                                                "&hora=" + props?.parent?.hora_limite +
                                                                "&sistema=" + info?.url_sistema_api +
                                                                "&sistema_job_id=" + info?.id_sistema_api +
                                                                "&sistema_aux=" + system_type +
                                                                "&system_integration=" + (info?.aux_sistema_api ? info?.aux_sistema_api.replaceAll('"', "'") : '') +
                                                                "&sistema_dado_aux=" + (info?.dado_aux ? info?.dado_aux : '') +
                                                                "&status_job=" + job_status +
                                                                "&aux_job=" + props?.parent?.id_job_status + "|||" + props?.parent?.data + "|||0" +
                                                                "&filter_id_module=" + filterModule +
                                                                "&aba=calendario" +
                                                                "&token=" + localStorage.getItem("token")
                                                            }
                                                            className="d-block w-100"
                                                            width={'100%'}
                                                            height={"100%"}
                                                            // onClick={() => (setCollapse(collapse?false:true), (!hover?((props.iframe?setLoading(true):setLoading(false))):{}))}
                                                            onLoad={(event) => {
                                                                setLoading(false);
                                                                setIframeHeightAux(true);
                                                            }}
                                                        ></iframe>
                                                    </div>
                                                    :
                                                    <></>
                                                )}

                                        {(system_integration_aux && collapse ?
                                            system_integration_aux
                                        :
                                            <></>
                                        )}

                                                {(!props.iframe?props.children:'')}  

                                                {cards_internos_aux}
                                            </div>
                                        </div>
                                    :'')}
                                </>
                            :'')}
                    </div>;

        return(
            <>            
                {(showCard ? card_aux : '')}

                {/* CARD MAXIMIZADO */}
                {(maximized ?
                    <div className={style.card__maximized}>
                        <div className={style.card__maximized_container} id="card_maximized_container">

                            {(props.integration ?
                                <div className={style.card__maximized_box + ' ' + style.width__auto}>
                                    <div className={style.card__maximized_header}>
                                        Integração
                                    </div>
                                    <div className={style.card__maximized_body}>
                                        <div style={{width:382, maxWidth:'100%'}}>
                                            {props.integration}
                                        </div>
                                    </div>
                                </div>
                            :'')}

                            <div className={style.card__maximized_box + ' ' + style.width__auto}>
                                <div className={style.card__maximized_header}>
                                    Job Principal
                                </div>
                                <div className={style.card__maximized_body}>
                                    {card_aux}

                                    <h3 className={style.card__maximized_body_subtitle}>Jobs secundários</h3>

                                    {cards_internos_aux}
                                </div>
                            </div>

                            {(!hide.includes(props?.parent?.id_job_status) ?
                                <div
                                    id={'container_box_' + props?.parent?.id_job_status}
                                    className="container_box"
                                >
                                    <Mensagens
                                        main={true} // CARD PAI
                                        job={props?.parent}
                                        status={props?.parent?.status}
                                        props={props}
                                        id_job2={props.id_group}
                                        id_job_status2={props.id_aux}
                                        filters={props?.filters}
                                        callback={handleCallbackMensagens}
                                        changeOperator={handleChangeOperator}
                                        minimized={handleMinimize}
                                        refreshCard={handleRefreshCard}
                                        reload={reloadChat}
                                        icones={icones}
                                    />
                                </div>
                            :'')}

                            {(cardsInternal?.length > 0 ?
                                cardsInternal?.filter((elem) => elem.status != 4).filter((elem) => {
                                    if(hide.includes(elem.id_job_status)){
                                        return false;
                                    }else{
                                        return true;
                                    }
                                }).map((interno, i) => {
                                    return (
                                        <div
                                            id={'container_box_' + interno?.id_job_status}
                                            key={'interno_' + interno?.id_job_status}
                                            className="container_box"
                                        >
                                            <Mensagens
                                                props={props}
                                                job={interno}
                                                info={interno}
                                                filters={props?.filters}
                                                reload={reloadChat}
                                                callback={handleCallbackMensagens}
                                                changeOperator={handleChangeOperator}
                                                minimized={handleMinimize}    
                                                refreshCard={handleRefreshCard}
                                                icones={iconesInternal[i]}
                                            />
                                        </div>
                                    )
                                })
                                : '')}
                        </div>
                    </div>
                :'')}
            </>     
        )
    }  
}
