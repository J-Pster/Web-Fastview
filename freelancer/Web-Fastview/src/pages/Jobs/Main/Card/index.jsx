import { useEffect, useState, useContext } from "react";

// INTEGRAÇÕES
import Checklist from "../../../Checklist/Lista/cadastro";
import Telefones from '../../../Lojas/Lista';

import { calcDistance, cd, cdh, diffDays, get_date } from "../../../../_assets/js/global";
import { JobsContext } from "../../../../context/Jobs";
import Tippy from "@tippyjs/react";
import { GlobalContext } from "../../../../context/Global";
import Icon from "../../../../components/body/icon";
import Form from "../../../../components/body/form";
import SelectReact from "../../../../components/body/select";
import Editar from "../../../../components/body/card/editar";
import Reabrir from "../../../../components/body/card/reabrir";
import Reprovar from "../../../../components/body/card/reprovar";
import Recusar from "../../../../components/body/card/recusar";
import Devolver from "../../../../components/body/card/devolver";
import Tutorial from "../../../../components/body/card/tutorial";
import axios from "axios";
import Cancelar from "../../../../components/body/card/cancelar";
import Card from "../../../../components/body/card";
import { toast } from "react-hot-toast";
import TrocaOperador from "../../../../components/body/card/trocaOperador";
import TrocaStatus from "../../../../components/body/card/trocaStatus";
import Check from "../../../../components/body/card/check";
import Finalizar from "../../../../components/body/card/finalizar";
import Avaliar from "../../../../components/body/card/avaliar";
import style from '../card.module.scss';
import Button from "../../../../components/body/button";
import Modal from "../../../../components/body/modal";
import ModalHeader from "../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../../components/body/modal/modalBody";
import Microssistema from '../../../Microssistemas/Cadastro';
import { useNavigate } from "react-router";

export default function CardJobs(props) {
    // CONTEXT GLOBAL
    const { refreshCalendar, filterModule, firstLoad } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { optionsStatus, optionsLoja, configuracoes, idUsuarioEmpresas } = useContext(JobsContext);

    // NAVIGATE
    const navigate = useNavigate();

    // ESTADOS    
    const [operatorSelected, setOperatorSelected] = useState('');
    const [categoriaSelected, setCategoriaSelected] = useState('');
    const [subcategoriaSelected, setSubcategoriaSelected] = useState('');
    const [categoriaNome, setCategoriaNome] = useState('');
    const [subcategoriaNome, setSubcategoriaNome] = useState('');
    const [subcategoriaModulo, setSubcategoriaModulo] = useState('');
    const [reloadInfo, setReloadInfo] = useState(false);
    const [message, setMessage] = useState(null);
    const [anexo, setAnexo] = useState(null);
    const [messageSubmit, setMessageSubmit] = useState(true);
    const [chatAlert, setChatAlert] = useState(null);
    const [statusFormCategoria, setStatusFormCategoria] = useState('');
    const [executando, setExecutando] = useState(props?.card?.executando == 1 ? props?.card?.id_job_status : '');
    const [loadingPrioridade, setLoadingPrioridade] = useState(false);
    const [status, setStatus] = useState(props?.card?.status);
    const [statusSupervisor, setStatusSupervisor] = useState(props?.card?.status_sup);
    const [dataHoraRealizacao, setDataHoraRealizacao] = useState(props?.card?.dataHora_realizacao);
    const [showModal, setShowModal] = useState(false);
    const [microssistemaValidation, setMicrossistemaValidation] = useState(false);
    const [microssistemaValues, setMicrossistemaValues] = useState(null);
    const [microssistema, setMicrossistema] = useState(false);
    const [microssistemaValuesModified, setMicrossistemaValuesModified] = useState(false);
    const [microssistemaButtonStatus, setMicrossistemaButtonStatus] = useState(false);
    const [loadingConformidade, setLoadingConformidade] = useState(false);

    // ATUALIZA INFORMAÇÕES DO CARD SEMPRE QUE SOFRE ALTERAÇÃO NO COMPONENTE
    useEffect(() => {
        setStatus(props?.card?.status);
        setStatusSupervisor(props?.card?.status_sup);
        setDataHoraRealizacao(props?.card?.dataHora_realizacao);
    },[props?.card]);

    // PERMISSÃO MÓDULO
    var permission_module;
    if(props.chamados){
        if(props?.optionsModule?.filter((elem) => elem.id == (props?.filterModule ? props.filterModule : filterModule)).length > 0){
            let permissao_aux=props?.optionsModule?.filter((elem) => elem.id == (props?.filterModule ? props.filterModule : filterModule))[0].permissao
            if(permissao_aux === null || permissao_aux == '-1'){
                permission_module = window.rs_permission_apl;
            }else{
                permission_module = props?.optionsModule?.filter((elem) => elem.id == (props?.filterModule ? props.filterModule : filterModule))[0].permissao;
            }
        }else{
            permission_module = window.rs_permission_apl;
        } 
    }else{
        permission_module = window.rs_permission_apl;
    }

    // VARIÁVEIS
    var
        background,
        title,
        obs1,
        obs2,
        obs3,
        obs4,
        obs5,
        circle,
        job_system_integration_type,
        job_system_integration_type_aux,
        distance = '',
        distance_aux = '',
        locationStore,
        nivel_msg,
        system_type,
        habilitarFinalizar,
        alertHour = false,
        tipo_fase_aux,
        tipo_permissao_aux

    var system_integration = props?.card?.mov_sistemas;

    var system_type_1;
    if (props?.card?.mov_sistemas) {
        var aux = JSON.parse(system_integration);
        system_type = aux.job_system_integration_type;
        system_type_1 = aux.job_system_integration_type_1;
    } else {
        system_type = 0;
        system_type_1 = 0;
    }

    // DEFINE ID DO USUÁRIO
    if(idUsuarioEmpresas){
        let id_madnezz = idUsuarioEmpresas?.id?.toString();
        let id_fastview = idUsuarioEmpresas?.id_fastview?.toString();
        let id_malltech = idUsuarioEmpresas?.id_malltech?.toString();

        global.rs_id_usr = [id_madnezz, id_fastview, id_malltech];
    }else{
        global.rs_id_usr = [window?.rs_id_usr?.toString()];
    }

    // DEFINE VARIÁVEL DO TIPO FASE
    if(props?.job?.type_phase){
        tipo_fase_aux = props?.job?.type_phase;
    }else if(props?.job?.tipo_fase){
        tipo_fase_aux = props?.job?.tipo_fase;
    }else{
        tipo_fase_aux = undefined;
    }

    // DEFINE VARIÁVEL DO TIPO PERMISSÃO
    if(props?.job?.type_permission){
        tipo_permissao_aux = props?.job?.type_permission;
    }else if(props?.job?.tipo_permissao_subcategoria){
        tipo_permissao_aux = props?.job?.tipo_permissao_subcategoria;
    }else{
        tipo_permissao_aux = undefined;
    }

    // CONFIGURAÇÕES DOS CARDS
    let conf_urgente = true;
    let conf_finalizar_txt_obrigatorio = false;
    let conf_subtitulo;
    let conf_mensagem_finaliza = false;
    let conf_receber = true;

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar){
        conf_urgente = (JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar).urgente == 1 ? false : true);
    }

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card){
        conf_subtitulo = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card)?.subtitle;
        conf_finalizar_txt_obrigatorio = (JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0].conf_card)?.actions?.finalizar?.txt_obrigatorio == 1 ? true : false);
        conf_receber = (JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0].conf_desabilitar)?.receber == 1 ? true : false);
    }

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao){
        conf_mensagem_finaliza = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao)?.mensagem_finaliza ? true : false;
    }

    // SE FOR O SISTEMA DE MANUTENÇÃO SOBRESCREVE AS CONFIGURAÇÕES DO CARD
    if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
        conf_finalizar_txt_obrigatorio = true;
        conf_mensagem_finaliza = false;
    }

    // DEFINE CORES
    if (props.chamados || props?.id_apl == 224) { // CHAMADOS
        if(props?.card?.urgente == 1 && conf_urgente){
            background = 'orange';
        }else{
            // VERIFICA SE O EMPREENDIMENTO TEM SLA CONFIGURADO NO BANCO, SE NÃO COLOCA O PADRÃO: 8
            let sla_aux;
            if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao){
                let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao);
                if(json_aux?.sla){
                    sla_aux = json_aux?.sla;
                }
            }
 
            let dias_aux;
            // SE RECEBER O VALOR DE DIAS DO BACK-END, SETA ELE, CASO CONTRÁRIO FAZ A COMPARAÇÃO DAS DATAS
            if(props?.card?.dias){
                dias_aux = props?.card?.dias;
            }else{
                dias_aux = (diffDays(window.currentDate, props?.card?.data.slice(0,10)+' 00:00:00'));
            }

            if(dias_aux >= sla_aux){ // SE FOI ABERTO A MAIS DE 7 DIAS FICA LARANJA
                background = 'dark_orange';
            }else{
                if(!props?.card?.recebido || props?.card?.recebido == 0){
                    background = 'blue';
                }else{
                    background = '';
                }
            }
        }
        
        // SE RECUSADO PELO OPERADOR FICA VERMELHO
        if (status == 2) {
            if(window.rs_sistema_id == global.sistema.manutencao_madnezz){ // SE FOR SISTEMA MANUTENÇÃO
                if(window.rs_id_emp == 26){ // SE FOR EMPREENDIMENTO MADNEZZ
                    background = optionsStatus.filter((el) => {
                        return el.nome_status == 'atrasado';
                    })[0]?.cor;
                }
            }else{
                background = optionsStatus.filter((el) => {
                    return el.nome_status == 'atrasado';
                })[0]?.cor;
            }
        }

        // SE RECUSADO PELO CHECKER FICA VERMELHO
        if (statusSupervisor == 2) {
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'atrasado';
            })[0]?.cor;
        }
    } else if (props.fases || props?.id_apl == 225) { //FASES
        if (status == 0 && props?.card?.data > get_date('datetime_sql', new Date())) { // PADRÃO
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'nao_feito';
            })[0]?.cor;
        } else if (status == 0 && props?.card?.data < get_date('datetime_sql', new Date()) && statusSupervisor != 3) { // ATRASADO
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'atrasado';
            })[0]?.cor;
        } else if (status == 0 && props?.card?.data < get_date('datetime_sql', new Date()) && statusSupervisor == 3) { // ATRASADO REABERTO
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'atrasado';
            })[0]?.cor;
        } else if (status == 1) { // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'feito';
            })[0]?.cor;
        } else if (status == 2) { // NÃO TEM
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'nao_tem';
            })[0]?.cor;
        } else if (status == 3) { // CONCLUÍDO COM ATRASO
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'feito_com_atraso';
            })[0]?.cor;
        } else if (status == 5) { // CONCLUÍDO COM RESSALVA
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'feito_com_ressalva';
            })[0]?.cor;
        } else {
            background = '';
        }
    } else if (props.visitas || props?.id_apl == 226) { // VISITAS
        if(status == 1){ // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'feito';
            })[0]?.cor;
        }else if(status == 3){ // CONCLUÍDO COM ATRASO
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'feito_com_atraso';
            })[0]?.cor;
        }else if(status == 0 && props?.card?.data < window.currentDateWithoutHour && statusSupervisor != 3) { // ATRASADO
            background = optionsStatus.filter((el) => {
                return el.nome_status == 'atrasado';
            })[0]?.cor;
        }else{
            background = '';
        }
    } else { // JOBS
        if (props?.tipoCalendario == 7 || props?.tipoCalendario == 9) { // FREQUÊNCIA
            background = '';
        } else if (props?.tipoCalendario == 3) { // PAINEL
            let qtd_feito = parseInt(props?.card?.qtd_feito);
            let qtd_feito_com_inconformidade = parseInt(props?.card?.qtd_feito_com_inconformidade);
            let qtd_feito_com_atraso = parseInt(props?.card?.qtd_feito_com_atraso);
            let qtd_atrasado = parseInt(props?.card?.qtd_atrasado);
            let qtd_total = parseInt(props?.card?.qtd_total);            

            if ((qtd_feito + qtd_feito_com_inconformidade) == qtd_total && qtd_feito_com_atraso == 0 && qtd_atrasado == 0) {
                background = optionsStatus.filter((el) => {
                    return el.nome_status == 'feito';
                })[0]?.cor;
            }else if(qtd_feito_com_atraso > 0 && qtd_atrasado == 0){
                background = optionsStatus.filter((el) => {
                    return el.nome_status == 'feito_com_atraso';
                })[0]?.cor;
            }else if(qtd_atrasado > 0){
                background = optionsStatus.filter((el) => {
                    return el.nome_status == 'atrasado';
                })[0]?.cor;
            }else{
                background = '';
            }   
        } else {
            if (status == 4) { // ADIADO
                background = optionsStatus.filter((el) => {
                    return el.nome_status == 'adiado';
                })[0]?.cor;
            } else {
                if(props?.card?.substatus > 0){
                    background = optionsStatus.filter((el) => {
                        return (el.substatus == props?.card?.substatus && el.status == status);
                    })[0]?.cor;
                }else{
                    if(props?.card?.id_apl.includes('224')){
                        if(status == 6){
                            background = optionsStatus.filter((el) => {
                                return el.nome_status == 'atrasado';
                            })[0]?.cor;
                        }else{
                            background = '';
                        }
                    }else{       
                        if(statusSupervisor == 3){
                            background = optionsStatus.filter((el) => {
                                return el.nome_status == 'reaberto';
                            })[0]?.cor; 
                        }else{             
                            if (status == 0 && props?.card?.data > get_date('datetime_sql', new Date())) { // PADRÃO
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'nao_feito';
                                })[0]?.cor;
                            } else if (status == 0 && props?.card?.data < get_date('datetime_sql', new Date()) && statusSupervisor != 3) { // ATRASADO
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'atrasado';
                                })[0]?.cor;
                            } else if (status == 0 && props?.card?.data < get_date('datetime_sql', new Date()) && statusSupervisor == 3) { // ATRASADO REABERTO
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'atrasado';
                                })[0]?.cor;
                            } else if (status == 1) { // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'feito';
                                })[0]?.cor;
                            } else if (status == 2) { // NÃO TEM
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'nao_tem';
                                })[0]?.cor;
                            } else if (status == 3) { // CONCLUÍDO COM ATRASO
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'feito_com_atraso';
                                })[0]?.cor;
                            } else if (status == 5) { // CONCLUÍDO COM RESSALVA
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'feito_com_ressalva';
                                })[0]?.cor;
                            } else if (status == 7) { // CONCLUÍDO COM INCONFORMIDADE
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'feito_com_inconformidade';
                                })[0]?.cor;
                            } else if (status == 8) { // BLOQUEADO
                                background = optionsStatus.filter((el) => {
                                    return el.nome_status == 'bloqueado';
                                })[0]?.cor;
                            } else {
                                background = '';
                            }
                        }
                    }
                }
            }
        }
    }

    // DEFINE SE O BOTÃO DE FINALIZAR DO CARD DE GRUPO VAI FICAR HABILITADO OU NÃO CASO TENHA JOB INTERNO SEM FINALIZAR                                                      
    if (props?.card?.card_qtd_total > props?.card?.card_qtd_finalizado) {
        habilitarFinalizar = true
    } else {
        habilitarFinalizar = false;
    }

    // INTEGRAÇÃO CHECKLIST
    job_system_integration_type = props?.card?.mov_sistemas ? props?.card?.mov_sistemas : 0;

    job_system_integration_type_aux = JSON.parse(
        job_system_integration_type
    );

    job_system_integration_type = JSON.parse(
        job_system_integration_type
    );

    if (props?.card?.sistema_job_id === 1) {
        if (job_system_integration_type) {
            job_system_integration_type = `${props?.card?.sistema_job_id}.${job_system_integration_type.job_system_integration_type}`;
        }
    } else if (props?.card?.sistema_job_id === 18) {
        system_type = '{"sistema_aux":"' + job_system_integration_type.job_system_integration_type + '","sistema_aux_1":"' + job_system_integration_type.job_system_integration_type_1 + '","sistema_aux_2":"' + job_system_integration_type.job_system_integration_type_2 + '"}';
    }

    obs1 = '';
    obs2 = '';
    obs3 = '';
    obs4 = '';
    obs5 = '';
    circle = '';

    // OBSERVAÇÃO 1 (CANTO INFERIOR ESQUERDO, PRIMEIRA INFO)
    if (props.chamados) {
        obs1 = {
            label: 'Protocolo',
            info: props?.card?.id_job_status.padStart(5, "0")
        };
    } else if (props.visitas) {
        obs1 = 'Data: ' + props?.card?.data.slice(0, 5);
    } else if (props.fases) {
        obs1 = (props?.card?.data ? get_date('date', props?.card?.data, 'date_sql') : '');
    } else {
        if(props?.tipoCalendario != 7){ // TIPO FREQUÊNCIA
            obs1 = props?.card?.frequencia + " " + (props?.card?.hora_limite ? props?.card?.hora_limite.slice(0,5) : '') + (status == 4 ? " (Adiado)" : "");
        }        
    }

    // OBSERVAÇÃO 2 (CANTO INFERIOR ESQUERDO, SEGUNDA INFO)
    if (props.chamados) {
        obs2 = '';
    } else if (props.fases) {
        obs2 = '';
    } else if (props.visitas) {
        obs2 = ((status == 1 || status == 3) && dataHoraRealizacao ? 'Feito em: ' + get_date('date', dataHoraRealizacao.slice(0, 10), 'date_sql') + dataHoraRealizacao.slice(10, 16) : '');
    } else {
        if (props?.tipoCalendario != 7) {
            if ((status == 1 || status == 3) && dataHoraRealizacao ) {
                obs2 = 'Feito em: ' + get_date('date', dataHoraRealizacao.slice(0, 10), 'date_sql') + dataHoraRealizacao.slice(10, 16);
            } else if (status == 2) {
                obs2 = (props?.card?.motivo ? props?.card?.motivo : 'Não tem');
            } else {
                obs2 = '';
            }
        }
    }

    // OBSERVAÇÃO 3 (CANTO INFERIOR ESQUERDO, TERCEIRA INFO)
    let dias_aux;
    if (props.chamados) {
        let dias;
        
        // SE RECEBER O VALOR DE DIAS DO BACK-END, SETA ELE, CASO CONTRÁRIO FAZ A COMPARAÇÃO DAS DATAS
        if(props?.card?.dias){
            dias_aux = props?.card?.dias;
        }else{
            dias_aux = (diffDays(window.currentDate, props?.card?.data.slice(0,10)+' 00:00:00'));
        }          

        if (dias_aux || dias_aux == 0) {
            if (dias_aux < 0) {
                dias = '(Agendado)';
            } else if (dias_aux > 0) {
                dias = '(' + dias_aux + ' dia' + (dias_aux == 1 ? '' : 's') + ')';
            } else if (dias_aux == 0) {
                dias = '(Hoje)';
            }
        }

        obs3 = {
            label: 'Data de Abertura',
            info: (props?.card?.data ? get_date('date', props?.card?.data.slice(0,10), 'date_sql').slice(0, 5) : '') + ' ' + dias,
            tippy: (props?.card?.data ? get_date('date', props?.card?.data.slice(0,10), 'date_sql') : '') + ' ' + dias
        };
    } else if (props.fases) {
        obs3 = '';
    } else if (props.visitas) {
        obs3 = '';
    } else {
        if (props?.tipoCalendario == 7) {
            if(props?.job.id_frequency == global.frequencia.unico){
                obs3 = (props?.card?.data_inicio ? get_date('date', props?.card?.data_inicio, 'date_sql') : '')
            }else if(props?.job.id_frequency == global.frequencia.semanal){
                obs3 = get_date('day_name', props?.card?.data_inicio, 'date');
            }else if(props?.job.id_frequency == global.frequencia.mensal){
                obs3 = 'Dia '+get_date('date', props?.card?.data_inicio, 'date_sql').slice(0,2);
            }else if(props?.job.id_frequency == global.frequencia.anual){
                obs3 = 'Dia '+get_date('date', props?.card?.data_inicio, 'date_sql');
            }else{
                obs3 = 'Início: '+get_date('date', props?.card?.data_inicio, 'date_sql');
            }
        } else {
            if (status == 4) { // SE FOR CARD ADIADO NÃO EXIBE TEXTO
                obs3 = '';
            } else {
                if (statusSupervisor == 1) {
                    obs3 = 'Aprovado';
                } else if (statusSupervisor == 2) {
                    obs3 = 'Reprovado';
                } else if (statusSupervisor == 3) {
                    obs3 = 'Reaberto';
                } else {
                    obs3 = '';
                }
            }
        }
    }

    // OBSERVAÇÃO 4 (CANTO SUPERIOR DIREITO)
    if (props.chamados) {
        if(props.print){
            obs4 = <Icon type="print" className="text-white" />
        }else{
            obs4 = '';
        }
    } else if (props.fases) {
        obs4 = '';
    } else if (props.visitas) {
        if(job_system_integration_type_aux.job_system_integration_type_1){
            // CALCULA DISTÂNCIA
            locationStore = optionsLoja.filter((element) => element.value == job_system_integration_type_aux.job_system_integration_type_1);
            if (locationStore.length > 0 && locationStore[0].localizacao && props?.card?.localizacao_realizado) {
                let coordenada = locationStore[0].localizacao.split(",");
                let coordenada_realizado = props?.card?.localizacao_realizado.split(",");
                distance = calcDistance(coordenada[0], coordenada[1], coordenada_realizado[0], coordenada_realizado[1]);

                if (distance !== '') {
                    if (distance < 1) { // SE FOR MAIOR QUE 1KM
                        distance = distance * 1000;
                        obs4 = Math.round(distance) + 'm';
                    } else {
                        obs4 = Math.round(distance) + 'km';
                    }
                }
            } else {
                obs4 = '';
            }
        }
    } else {
        if(status == 8){
            obs4 = <Icon type="lock" animated />;
        }else{
            if(props?.card?.arquivado){
                obs4 = '(Arquivado)';
            }else{
                obs4 = '';
            }
        }        
    }

    // ATUALIZA ESTADO DE EXECUÇÃO SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        if(props.execution){
            setExecutando(props.execution);
        }
    },[props.execution]);

    // ALERTA DE JOB EXPIRANDO (CALENDÁRIO JOBS)
    alertHour = false;
    if (!props.chamados && !props.fases && !props.visitas) {
        if (props?.tipoCalendario == 1 || props?.tipoCalendario == 2 || props?.tipoCalendario == 4) { // SE FOR CALENDÁRIO (1), LOJA (2) OU USUÁRIO (4)
            if (status == 0 && (global.rs_id_usr?.includes(props?.card?.id_usuario) || (window.rs_id_lja && props?.card?.id_loja == window.rs_id_lja))) {
                if (props?.card?.data.slice(0, 10) == window.currentDateWithoutHour && statusSupervisor != 3) {
                    if (props?.card?.hora_limite > (window.currentHour + ':' + window.currentMinutes)) {
                        let endDate = new Date(props?.card?.data);
                        let differenceValue = (new Date().getTime() - endDate.getTime()) / 1000;
                        differenceValue /= 60;
                        let result = Math.abs(Math.round(differenceValue))

                        if (result < 30) {
                            obs4 = 'Vence em breve';
                            alertHour = true;
                        } else {
                            alertHour = false;
                        }
                    }
                }
            }
        }
    }

    // DEFINE VALOR DA OBS5
    if(props?.card?.id_apl?.includes('224') && !props?.chamados && !props.fases && !props.visitas){
        if(props?.tipoCalendario == 1){
            if(status == 6){
                obs5 = 'Cancelado';
            }else{
                if(props?.card?.id_usuario_cad == props?.usuario || props?.card?.id_loja_cad == props?.loja){
                    obs5 = 'Solicitado'
                }
            }            
        }else if(props?.tipoCalendario == 2){
            if(status == 6){
                obs5 = 'Cancelado';
            }else{
                if(props?.card?.id_loja_cad == props?.job?.id_lja){
                    obs5 = 'Solicitado'
                }
            }
        }else if(props?.tipoCalendario == 4){
            if(status == 6){
                obs5 = 'Cancelado';
            }else{
                if(props?.card?.id_usuario_cad == props?.job?.id_usr){
                    obs5 = 'Solicitado'
                }
            }
        }
    }

    // DEFINE CIRCLE (CIRCULO COM SIGLA DO DEPARTAMENTO OU PESO DO JOB)
    if (!props.chamados && !props.fases && !props.visitas) {
        if (props?.card?.id_apl?.includes('224')) {
            if (props?.card?.nome_departamento_usuario_cad || props?.card?.modulo) {
                if (props?.card?.id_apl) {
                    let value_aux = (props?.card?.nome_departamento_usuario_cad ? props?.card?.nome_departamento_usuario_cad : props?.card?.modulo).slice(0,3).toUpperCase();
                    circle = {
                        title: 'Departamento: '+value_aux,
                        value: value_aux
                    }
                }
            }
        }else{
            if(window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master'){
                if(props?.card?.pontos){
                    circle = {
                        title: 'Peso: '+props?.card?.pontos,
                        value: props?.card?.pontos
                    }
                }else{
                    circle = {
                        title: 'Peso: 1',
                        value: 1
                    }
                }
            }
        }
    }

    // DEFINE TITULOS
    title = '';

    if(global.modulo.manutencao.includes(parseInt(filterModule)) && props.chamados){ // SE FOR MÓDULO MADNEZZ (MANUTENÇÃO)
        if(window.rs_id_emp == 26){
            if(props?.card?.nome_cliente){
                title = props?.card?.nome_cliente + ' - ';
            }else{
                title = props?.card?.nome_emp_cad + ' - ';
            }
        }        
        
        title += props?.card?.titulo;        

        if(props?.card?.nome_loja_cad){
            title += ' - '+props?.card?.nome_loja_cad;
        }else{
            title += ' - '+props?.card?.nome_usuario_cad;
        }
    }else{
        if(configuracoes && configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_titulo_tipo && configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.id_apl == window.rs_id_apl){
            title = '';
            let module_aux=(filterModule ? filterModule : props?.card?.id_modulo);

            let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_titulo_tipo);

            if(json_aux?.filter((elem) => elem.id_modulo == module_aux).length > 0){
                json_aux = json_aux?.filter((elem) => elem.id_modulo == module_aux)[0]?.value;
            }

            if(json_aux.includes('empreendimento') && props?.card?.nome_emp_cad){
                title += props?.card?.nome_emp_cad + ' - ';
            }

            if(json_aux.includes('luc') && props?.card?.luc_loja_cad){
                title += props?.card?.luc_loja_cad + ' - ';
            }

            if(json_aux.includes('loja')){
                if(props?.card?.nome_loja_cad){
                    title += props?.card?.nome_loja_cad + ' - ';
                }else{
                    title += props?.card?.nome_usuario_cad + ' - ';
                }
            }else{
                if(!configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_titulo_tipo){
                    title += props?.card?.titulo + ' - ';
                }
            }

            if(json_aux.includes('usuario') && props?.card?.nome_usuario_cad){
                title += props?.card?.nome_usuario_cad + ' - ';
            }

            if(json_aux.includes('titulo')){
                title += props?.card?.titulo + ' - ';
            }

            // REMOVE HÍFEN DO ÚLTIMO ITEM
            title = title?.slice(0, -3);
        }else{
            if(props?.card?.nome_cliente){
                title = props?.card?.nome_cliente + ' - ' + props?.card?.titulo;
            }else{
                title = props?.card?.titulo;
            }

            if(props?.card?.titulo_parent || props?.titulo_parent){
                title += ' - '+(props?.card?.titulo_parent ? props?.card?.titulo_parent : props?.titulo_parent);
            }
        }
    }

    // NÍVEL MENSAGENS CHAT (CHAMADOS)
    if(sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
        if(tipo_fase_aux){
            if(tipo_fase_aux === 'Início'){
                if(window.rs_id_emp == 26){ // SE FOR MADNEZZ CLIENTE NÃO PODE VER
                    nivel_msg = 1;
                }else{
                    nivel_msg = 0;
                }
            }else if(tipo_fase_aux === 'Operação'){
                if(window.rs_id_emp == 26){ // SE FOR MADNEZZ CLIENTE NÃO PODE VER
                    nivel_msg = 1;
                }else{
                    nivel_msg = 0;
                }
            }else if(tipo_fase_aux === 'Check'){
                nivel_msg = 0;
            }else if(tipo_fase_aux === 'Pós-Venda'){
                nivel_msg = 1;
            }
        }
    }else{
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DA API
            if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
                if(JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux]){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                    nivel_msg = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux].nivel_msg; // SETA O NÍVEL DAS MSGS
                }
            }
        }else{
            if(tipo_fase_aux == 'Operação' && props.chamados){
                nivel_msg = 2;
            }else if (tipo_fase_aux == 'Check'){
                nivel_msg = 1;
            }else{
                nivel_msg = '';
            }
        }
    }

    // DEFINE SUBTITULO
    let subtitle = '';
    if(conf_subtitulo && conf_subtitulo.length > 0){
        conf_subtitulo.map((item, i) => {
            if(props?.card[item]){
                subtitle += props?.card[item] + ' / ';
            }
        });
        subtitle = subtitle.slice(0, -2);
    }else{
        if (props.fases || props.fases_aux) { // SE ESTIVER NO SISTEMA FASES
            if (props?.card?.id_job_parent) {
                subtitle += props.fases_aux ? props.fases_aux : props?.card?.titulo;
            } else {
                if (props?.card?.categoria) {
                    subtitle += props?.card?.categoria + " / " + props?.card?.subcategoria;
                }
            }
        } else if(props.chamados && window.rs_sistema_id == global.sistema.manutencao_madnezz) { // SE ESTIVER EM CHAMADOS E NO SISTEMA "MANUTENÇÃO"
            if(props?.card?.sistema_slc){ // SE RECEBER O CAMPO "SISTEMA"
                subtitle += props?.card?.sistema_slc + " / " + props?.card?.subcategoria;
            }else{
                subtitle += props?.card?.categoria + " / " + props?.card?.subcategoria;
            }
        } else {
            subtitle += props?.card?.categoria + " / " + props?.card?.subcategoria;
        }
    }

    // HANDLE SET STATUS IFRAME
    const handleSetStatusIframe = () => {
        props.statusIframe((props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1));
    }

    // CALLBACK DO COMPONENTE CARD
    const handleChangeStatus = (e) => {
        setStatus(e?.status);
        setStatusSupervisor(null);
        setExecutando(0);
        setDataHoraRealizacao(get_date('datetime_sql', new Date(), 'new_date'));
    }

    // REFESH CARD
    const handleRefreshCard = (e) => {
        props.refreshCard(e);
    }

    // REFRESH CALENDAR
    const handleRefreshCalendar = (e) => {
        if(props.refreshCalendar){
            props.refreshCalendar(e);
        }
    }

    // FINALIZA JOB COM IFRAME
    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event?.data?.iframe_name) {
                if ((
                    event.origin === "http://madnezz.test" ||
                    event.origin === "http://fastview.test" ||
                    event.origin === "http://malltech.test" ||
                    event.origin === "http://localhost:3001" ||
                    event.origin === import.meta.env.VITE_URL_DEV_MADNEZZ ||
                    event.origin === import.meta.env.VITE_URL_DEV_FASTVIEW ||
                    event.origin === import.meta.env.VITE_URL_DEV_MALLTECH ||
                    event.origin === import.meta.env.VITE_URL_PROD_MADNEZZ ||
                    event.origin === import.meta.env.VITE_URL_PROD_FASTVIEW ||
                    event.origin === import.meta.env.VITE_URL_PROD_MALLTECH
                ) && event?.data?.iframe_name.split('_')[2] == props?.card?.id_job_status) {
                    if (event.data.function_type === "iframeFinishJob") {
                        changeStatus("Finalizou o job", props?.card?.id_job, props?.card?.id_job_status, (props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1), undefined, event.data.iframe_data, undefined, undefined, undefined, undefined, undefined, props?.card?.mov_prioridade, props?.card?.id_job_apl);
                        props.changeStatus({
                            status: (props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1),
                            id_group: undefined,
                            id_job_status_parent: undefined,
                            id_job_status: (event.data.iframe_name.split('_')[2] ? Number(event.data.iframe_name.split('_')[2]) : ''),
                        });
                    }
                }
            }
        });
    }, []);

    const [autoSubmit, setAutoSubmit] = useState(false);

    // FUNÇÃO PARA TROCA DE STATUS DOS CARDS
    function changeStatus(ativ_desc, id_job, id_job_status, status, msg = undefined, data_aux = undefined, tipo = undefined, type_phase = undefined, id_group = undefined, id_job_status_parent = undefined, nivel_msg = 0, prioridade = undefined, id_job_apl = undefined) {
        setStatus(status);
        setStatusSupervisor(null);
        setExecutando(0);
        setDataHoraRealizacao(get_date('datetime_sql', new Date(), 'new_date'));

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'status',
                    filter: {
                        mensagem: ativ_desc,
                        id_modulo: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                        id_job: id_job,
                        id_job_status: id_job_status,
                        id_job_apl: id_job_apl,
                        status: status,
                        motivo: msg,
                        dado_aux: data_aux,
                        acao_fase: tipo,
                        tipo_fase: type_phase,
                        mp: nivel_msg,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        prioridade: prioridade
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    // FUNÇÃO PARA TROCA DE STATUS SUPERVISOR DOS CARDS
    function changeStatusSupervisor(ativ_desc = undefined, id_job = undefined, id_job_status, status, msg = undefined, data_aux = undefined, tipo = undefined, type_phase = undefined, nivel_msg = 0, id_job_apl = undefined) {
        setStatusSupervisor(status);

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'status_sup',
                    filter: {
                        mensagem: ativ_desc,
                        id_modulo: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                        id_job: id_job,
                        id_job_status: id_job_status,
                        id_job_apl: id_job_apl,
                        status_sup: status,
                        motivo_sup: msg,
                        acao_fase: tipo,
                        tipo_fase: type_phase,
                        mp: nivel_msg,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                    }    
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            if (props.chamados || props.visitas) { // SE FOR CHAMADOS OU VISITAS ONDE É NECESSÁRIO ATUALIZAR TODA A FILA
                if(!props.report){
                    props.refreshCalendar();
                }
            }
        });
    }

    // FUNÇÃO PARA ADIAR
    function setDate(id_job_status, date, id_job, date_old) {
        let motivo_adiar=window.prompt('Motivo da alteração:');
        if(motivo_adiar){
            let mensagem_aux;

            if(props?.card?.data < get_date('date_sql', date.toString(), 'new_date')){
                mensagem_aux = 'Adiou o card de ' +(date ? get_date('date', props?.card?.data, 'date_sql') : '')+' para '+get_date('date', date.toString(), 'new_date');
            }else{
                mensagem_aux = 'Adiantou o card de ' +(date ? get_date('date', props?.card?.data, 'date_sql') : '')+' para '+get_date('date', date.toString(), 'new_date');
            }

            mensagem_aux += ' - Motivo: '+motivo_adiar;

            axios({
                method: 'post',
                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module=" + (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                data: {
                    db_type: global.db_type,
                    tables: [{
                        table: 'status',
                        filter: {
                            id_job: id_job,
                            id_job_status: id_job_status,
                            status: 4,
                            mensagem: mensagem_aux,
                            data: get_date('date_sql', date.toString(), 'new_date'),
                            data_old: (date_old ? date_old.slice(0,10) : undefined),
                            mp: 0,
                            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        }    
                    }]
                },
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(() => {
                if(props.changeStatus){
                    props.changeStatus({
                        status: 4,
                        id_group: undefined,
                        id_job_status_parent: undefined,
                        id_job_status: id_job_status,
                    });
                }
            });
        }
    }

    // TROCA DE MÓDULO (CHAMADOS)
    function changeModulo(id_job, id_job_status, id_module, ativ_desc, type_phase=undefined, id_job_apl) {
        if(props.report){
            handleRefreshCard(props?.card?.id_job_status);
        }else{
            if(props?.callback?.changeModule){
                props?.callback?.changeModule({
                    status: 'success',
                    index_group: props?.index_group,
                    index_job: props?.index_job ? props?.index_job : 0,
                    id_job_status: props?.card?.id_job_status,
                    tipo_fase: props?.card?.tipo_fase
                });
            } 
        }

        // CASO ESTEJA NO SISTEMA DE MANUTENÇÃO, AO TROCAR O MÓDULO O CARD PRECISA VOLTAR AO INÍCIO DA FILA
        if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
            type_phase = 'Início';
        }

        // VERIFICA SE NO BANCO O EMPREENDIMENTO POSSUI CONFIGURAÇÃO DE NÍVEL DE MSG CADASTRADO PARA A TROCA DE MÓDULOS
        let nivel_msg;
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DA API
            if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
                if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).troca_modulo){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                    nivel_msg = JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).troca_modulo?.nivel_msg; // SETA O NÍVEL DAS MSGS
                }
            }
        }

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'module',
                    filter: {
                        id_job: id_job,
                        id_job_status: id_job_status,
                        id_job_apl: id_job_apl,
                        id_apl: 224,
                        id_modulo: id_module,
                        tipo_fase: type_phase,
                        mp: nivel_msg,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        mensagem: ativ_desc
                    }
                }]
            },

            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            toast('Chamado encaminhado com sucesso');
            if(props.changeModule){
                props.changeModule();
            }
        });
    }

    // TROCA DE SUBCATEGORIA (CHAMADOS)
    function changeSubcategoria(id_subcategoria, message){
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                type: 'Job',
                do: 'insUpdJob',
                db_type: 'sql_server'
            },
            data: {
                id: props?.card?.id_job,
                id_subcategory: id_subcategoria,
                mensagem: message,
                mp: 0,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            toast('Subcategoria alterada com sucesso');
            handleRefreshCard(props?.card?.id_job_status);
            setSubcategoriaSelected('');
        })
    }

    // TOGGLE PRIORIDADE (FASES)
    function changePrioridade(prioridade){
        setLoadingPrioridade(true);
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                type: 'Job',
                do: 'insUpdJob',
                db_type: 'sql_server'
            },
            data: {
                id: props?.card?.id_job,
                id_priority: prioridade,
                mp: 0,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            toast('Prioridade alterada com sucesso');
            refreshCalendar(true,true);
            setLoadingPrioridade(false);
        })
    }

    // FUNÇÃO PARA MARCAR EM EXECUÇÃO
    function changeExecuting(ativ_desc, id_job_status, status, id_job, id_job_apl) {
        // MANDA INFORMAÇÃO PRO COMPONENTE PAI PARA ATUALIZAR INSTANTANEAMENTE SEM ESPERAR RETORNO DA API
        if(props?.callback?.execution){
            props?.callback?.execution(id_job_status);
        }
        toast('Novo chamado em execução');
        setExecutando(id_job_status);

        // FAZ A REQUISIÇÃO PARA A API
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'execution',
                    filter: {
                        id_modulo: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                        // tipo_fase: 'Operação',
                        mensagem: ativ_desc,
                        id_job: id_job,
                        id_job_status: id_job_status,
                        id_job_apl: id_job_apl,
                        executando: 1,
                        mp: 2,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        set_phase:0
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    // FUNÇÃO PARA MOSTRAR MAS
    function changeViewing(ativ_desc, id_job_status, status, id_job, id_job_apl) {
        if(window.rs_id_emp==26){
            // FAZ A REQUISIÇÃO PARA A API
            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                data: {
                    db_type: global.db_type,
                    type: 'Job',
                    do: 'setTable',
                    tables: [{
                        table: 'viewing',
                        filter: {
                            id_modulo: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                            // tipo_fase: 'Operação',
                            mensagem: ativ_desc,
                            id_job: id_job,
                            id_job_status: id_job_status,
                            id_job_apl: id_job_apl,
                            executando: 1,
                            mp: 2,
                            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                            set_phase:0
                        }
                    }]
                },
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
    }

    // FUNÇÃO PARA VOLTAR/AVANÇAR DE FASE
    function changePhase(ativ_desc, id_job, id_job_status, type, type_phase, alert = undefined, id_job_apl) {
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'phase',
                    filter: {
                        mensagem: ativ_desc,
                        id_modulo: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                        id_job_apl: id_job_apl,
                        id_job_status: id_job_status,
                        id_job: id_job,
                        id_apl: props?.card?.id_apl,
                        acao_fase: type,
                        tipo_fase: type_phase,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)                        
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            if (alert !== false) {
                toast('Fase alterada');
            }
            
            props.refreshCalendar();
        });
    }

    // CALLBACK DA AVALIAÇÃO
    const handleCallbackRate = (e) => {
        if(props.report){
            handleRefreshCard(props?.card?.id_job_status);
        }else{
            if(props?.callback?.rate){
                props?.callback?.rate(e);
            } 
        }
    }

    // FUNÇÃO PARA RECEBER CHAMADO
    function changeReceived(ativ_desc, id_job, id_job_status, id_job_apl) {
        // ENVIA INFORMAÇÃO PRO COMPONENTE PAI PARA ATUALIZAR INSTANTANEAMENTE SEM A NECESSIDADE DE ESPERAR RETORNO DA API
        if(props?.callback?.receive){
            props?.callback?.receive({
                index_job: props?.index_job,
                id_job_status: props?.card?.id_job_status
            });
        }

        // RETORNA INFORMAÇÃO PRO USUÁRIO
        toast('Card sinalizado como recebido');

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'received',
                    filter: {
                        id_modulo: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                        mensagem: ativ_desc,
                        id_job: id_job,
                        id_job_status: id_job_status,
                        id_job_apl: id_job_apl,
                        recebido: 1,
                        mp: 0,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                    }
                }]
            },

            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            // SE ESTIVER NA TELA DE RELATÓRIO
            if(props.report){
                props.refreshCard(props?.card?.id_job_status);
            }
        });
    }

    // FUNÇÃO AO TROCAR OPERADOR
    const handleChangeOperator = (e) => {
        if(props?.callback?.changeOperator){
            props?.callback?.changeOperator(e);
        }
        // if(!props?.report){
        //     refreshCalendar();

        //     if(props?.refreshCardChamados){
        //         props?.refreshCardChamados();
        //     }
        // }

        // if(props.changeOperator){
        //     props.changeOperator();
        // }
    }

    // FUNÇÃO PARA ARQUIVAR
    function handleArchive(id_job, id_job_status, status, id_job_apl) {
        if(window.confirm('Deseja ' + (status === 1 ? 'arquivar' : 'desarquivar') + ' esse card?')){
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
                toast("Card arquivado com sucesso!");
                refreshCalendar();
            })
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

    // DEFINE SE CARD FICA NO FORMATO INATIVO
    let disabled = false;
    if (props.chamados) {
        if (dias_aux < 0) {
            disabled = true;
        } else {
            disabled = false;
        }
    } else if (!props.chamados && !props.fases && !props.visitas) {
        if(props?.card?.arquivado){
            disabled = true;
        }
    } else {
        disabled = false;
    }

    let troca_operador = false;
    let troca_status = false;
    let troca_categoria = false;
    let troca_subcategoria = false;

    // SE RECEBER A PROPS DE TROCA_OPERADOR COM FALSE
    if (props?.troca_operador === false || props?.troca_status === false || props?.troca_categoria === false || props?.troca_subcategoria === false) {
        if(props?.troca_operador === false){
            troca_operador = false;
        }        

        if(props?.troca_status === false){
            troca_status = false;
        }        

        if(props?.troca_categoria === false){
            troca_categoria = false;
        }        

        if(props?.troca_subcategoria === false){
            troca_subcategoria = false;
        } 
    } else {
        if (props?.tipoCalendario == 9 || props?.card?.id_avaliacao) {
            troca_operador = false;
            troca_status = false;
            troca_categoria = false;
            troca_subcategoria = false;
        } else {
            // SE A FREQUÊNCIA FOR "ÚNICO"
            if (props?.card?.id_frequencia == global.frequencia.unico) {

                // SE FOR DO SISTEMA CHAMADOS
                if (props.chamados) {
                    if ((permission_module === 'supervisor' || permission_module === 'master') || ((permission_module === 'checker') && tipo_fase_aux == 'Check')) {
                        
                        // SE O CARD NÃO FOR AGENDADO E NÃO ESTIVER NA FASE DE PÓS-VENDA
                        if (dias_aux >= 0 && tipo_fase_aux !== 'Pós-venda') {
                            troca_operador = true;
                            troca_status = true;
                            troca_categoria = true;
                            troca_subcategoria = true;
                        }else{
                            troca_operador = false;
                            troca_status = false;  
                            troca_categoria = false;
                            troca_subcategoria = false;
                        }
                    } else {
                        troca_operador = false;
                        troca_status = false;
                        troca_categoria = false;
                        troca_subcategoria = false;
                    }
                } else if(props.fases){
                    // SE O STATUS DO CARD FOR 0 E NÃO SER USUÁRIO LOJISTA
                    if (status == 0 && window.rs_id_lja == 0 || !window.rs_id_lja) {
                        troca_operador = true;
                        troca_status = true;
                    } else {
                        troca_operador = false;
                        troca_status = false;
                    }
                }else{
                    troca_operador = false;
                    troca_status = false;
                }
            } else {
                troca_operador = false;
                troca_status = false;
            }
        }
    }

    // CALLBACK AO CLICAR EM EXPANDIR O CARD
    const handleExpandCallback = (e) => {
        if (props?.expand) {
            props?.expand?.callback(e)
        }
    }

    // CALLBACK DE RELOAD APÓS EDITAR
    const handleReload = () => {
        if (props?.reload) {
            props.reload();
        }
    }    

    // CALLBACK DO COLLAPSE
    const handleSetCollapse = (e) => {
        if(props.collapse){
            props.collapse(e);
        }

        if(e?.chat_alert === false){
            setChatAlert(false);
            setMessageSubmit(true); // REABILITA BOTÃO DE ENVIAR MENSAGEM
        }
    }

    // CALLBACK DO COMPONENTE DE REPROVAR
    const handleCallbackReprovar = (e) => {
        if(e.submit){
            setStatusSupervisor(2);
            setChatAlert(null);

            if(props.chamados){
                refreshCalendar();
            }else{
                handleRefreshCard(e.submit);
            }

            if(props?.refreshCardChamados){
                props?.refreshCardChamados();
            }

            setMessage(null);
            setAnexo(null);
            setMessageSubmit(true); // REABILITA BOTÃO DE ENVIAR MENSAGEM
        }else{
            if(e?.alert?.status == 2){
                setChatAlert('danger');
                setMessageSubmit(false); // DESABILITA BOTÃO DE ENVIAR MENSAGEM
            }
        }        
    }

    // CALLBACK DO COMPONENTE DE REABRIR
    const handleCallbackReabrir = (e) => {
        if(e.submit){
            setStatus(0);
            setStatusSupervisor(3);
            setChatAlert(null);

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
        }else{
            if(e?.alert?.status == 3){
                setChatAlert('primary');
                setMessageSubmit(false); // DESABILITA BOTÃO DE ENVIAR MENSAGEM
            }
        }        
    }

    // CALLBACK DO COMPONENTE DE FINALIZAR
    const handleCallbackFinalizar = (e) => {
        if(e.submit){
            setStatus(e?.status);
            setStatusSupervisor(null);
            setExecutando(0);
            setDataHoraRealizacao(get_date('datetime_sql', new Date(), 'new_date'));
            setChatAlert(null);
            setMessage(null);
            setAnexo(null);
            setMessageSubmit(true); // REABILITA BOTÃO DE ENVIAR MENSAGEM

            if(props.chamados){
                props?.refreshCalendar();
            }else{
                handleRefreshCard(e.submit);
            }

            if(props?.refreshCardChamados){
                props?.refreshCardChamados();
            }
        }else{
            if(e?.alert?.status){
                if(e?.alert?.status == 1 || e?.alert?.status == 3){
                    setChatAlert('primary');
                }else if(e?.alert?.status == 2){
                    setChatAlert('danger');
                }
                setMessageSubmit(false); // DESABILITA BOTÃO DE ENVIAR MENSAGEM
            }
        }        
    }

    // CALLBACK DO COMPONENTE DE CHECK
    const handleCallbackCheck = (e) => {
        if(e.submit){
            if(props.chamados){
                props?.refreshCalendar();
            }else{
                handleRefreshCard(e.submit);
            }

            if(props?.refreshCardChamados){
                props?.refreshCardChamados();
            }

            setMessage(null);
            setAnexo(null);
            setMessageSubmit(true); // REABILITA BOTÃO DE ENVIAR MENSAGEM
        }else{
            if(e?.alert?.status){
                if(e?.alert?.status == 1){
                    setChatAlert('primary');
                }else if(e?.alert?.status == 2){
                    setChatAlert('danger');
                }
                setMessageSubmit(false); // DESABILITA BOTÃO DE ENVIAR MENSAGEM
            }
        }        
    }

    // CALLBACK FORM TROCA DE CATEGORIA/SUB
    const handleCallbackFormCategoria = () => {
        refreshCalendar();
        setCategoriaSelected(null);
        setSubcategoriaSelected(null);
        setCategoriaNome('');
        setSubcategoriaNome('');
    }

    // CALLBACK DE STATUS DO FORM TROCA DE CATEGORIA/SUB
    const handleCallbackFormCategoriaStatus = (e) => {
        setStatusFormCategoria(e);
    }

    // VERIFICA SE TODOS OS CAMPOS OBRIGATÓRIOS DO MICROSSISTEMA FORAM PREENCHIDOS
    const handleMicrossistemaCallback = (e) => {
        setMicrossistemaValidation(e.validation);

        let data = [];

        if(e.values){
            e.values.map((item, i) => {
            data.push({
                valor: item.value,
                item_id: item.id
            });
            });
        } 

        setMicrossistemaValues({
            data: data,
            tipo: 'Outros',
            microssistema_id: microssistema,
            job_id: props?.card?.id_job,
            job_data: new Date().toISOString().slice(0, 10),
            type_system: 'microssistemas'
        });
        setMicrossistemaValuesModified(true);
    }

    // FECHA MODAL
    const handleCloseModal = () => {
        setShowModal(false);
    }

    // ENVIO DOS DADOS
    function submit(){
        if(microssistema){
            setMicrossistemaButtonStatus('loading');
            axios({
                method: 'post',
                url: window.host+'/systems/microssistemas-novo/api/novo.php?do=post_microssistema',
                data: microssistemaValues,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                handleCloseModal();
                setMicrossistemaButtonStatus('success');
                toast('Conformidade salva com sucesso');
            });
        }
    }

    const handleSetShowModal = () => {
        setLoadingConformidade(true);
        axios({
            method: 'get',
            url: window.host+'/systems/microssistemas-novo/api/novo.php?do=get_microssistema_fases',
        }).then((response) => {
            if(Array?.isArray(response.data) && response.data.length > 0){
                setMicrossistema(response.data[0].id);
                setShowModal(true);
                setLoadingConformidade(false);
            }else{
                toast('Não há microssistemas cadastrados para essa fase');
            }
        });        
    }       

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}> 
                <ModalHeader>
                    <ModalTitle>
                        Conformidade 
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Microssistema
                        id={microssistema}
                        valor_padrao={true}
                        className={'mt-4'}
                        callback={handleMicrossistemaCallback}
                        status={microssistemaButtonStatus}
                    />  

                    <Button
                        type="submit"
                        status={statusFormCategoria}
                        onClick={submit}
                    >
                        Confirmar
                    </Button>

                </ModalBody>
            </Modal>

            {props?.changeLayout ? (
            <Tippy
                content={
                    <div className="text-center">
                        {(props?.subTipoCalendario === 'user' ? props?.card?.nome_usuario : props?.card?.nome_loja)}<br />
                        Porc. Feitos:
                        {" "}
                        {(((Number(props?.card?.qtd_feito) + Number(props?.card?.qtd_feito_com_atraso)) * 100) / Number(props?.card?.qtd_total)).toFixed(0)}%<br /><br />

                        Jobs: {props?.card?.qtd_total}<br />
                        Feitos: {props?.card?.qtd_feito}<br />
                        Feitos com atraso: {props?.card?.qtd_feito_com_atraso}{" "}<br />
                        Feitos com inconformidade: {props?.card?.qtd_feito_com_inconformidade}{" "}<br />
                        Feitos com ressalva: {props?.card?.qtd_feito_com_ressalva}{" "}<br />
                        Não feitos: {props?.card?.qtd_nao_feito}<br />
                        Não tem: {props?.card?.qtd_nao_tem}<br />
                        Adiados: {props?.card?.qtd_adiado}<br />
                        Atrasados: {props?.card?.qtd_atrasado}<br />
                        Cancelados: {props?.card?.qtd_cancelado}<br />
                    </div>
                }
            >
                <div>
                    <a href={'/systems/'+window.link+'/calendario/2/'+props?.card?.id_loja+'/'+cd(props?.periodStart).replaceAll('/','-')+'/'+cd(props?.periodEnd).replaceAll('/','-')} target="_blank">
                        <Card
                            id={props?.card?.id_job}
                            widget={props?.widget}
                            title={(props?.subTipoCalendario === 'user' ? props?.card?.nome_usuario : props?.card?.nome_loja)}
                            subtitle={
                                (
                                    ((Number(props?.card?.qtd_feito) +
                                        Number(props?.card?.qtd_feito_com_atraso)) *
                                        100) /
                                    Number(props?.card?.qtd_total)
                                ).toFixed(0) + "%"
                            }
                            background={background}
                            size="smallest"
                            refreshCalendar={handleRefreshCalendar}
                        ></Card>
                    </a>
                </div>
            </Tippy>
        ) : (
            <Card
                // ref={props?.card?.id_job_status}
                dragging={props?.dragging}
                draggable={props?.draggable}
                separator={props?.separator}
                fullwith={props?.fullwith}
                shadow={props?.shadow}
                changeViewing={changeViewing}
                changeStatus={handleChangeStatus}
                opened={props?.opened}
                fases_aux={props?.fases_aux}
                autoSubmit={autoSubmit}
                setAutoSubmit={setAutoSubmit}
                border={props?.card?.prioridade==7 ? 'orange' : ''}
                position={{
                    enabled: (props.chamados && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && tipo_fase_aux == 'Operação' && (filterModule == 2361 && window.rs_id_emp == 26 || filterModule != 2361) ? true : false),
                    group: props?.group?.cards,
                    position: (props?.i + 1)
                }}
                expand={{
                    enabled: true,
                    index: props?.indexSlide,
                    callback: handleExpandCallback
                }}
                widget={props?.widget}
                permission_module={permission_module}
                optionsModule={props?.optionsModule}
                jobs={props?.jobs}
                jobsCols={props?.jobsCols}
                parent={props?.card}
                parents={props?.job}
                loadingConformidade={loadingConformidade}
                handleSetShowModal={handleSetShowModal}
                changeExecuting={changeExecuting}
                executando={executando}
                tipo_permissao={tipo_permissao_aux}
                id={'card_' + props?.card?.id_job_status}
                sortable={false}
                id_aux={props?.card?.id_job_status}
                id_group={props?.card?.id_job}
                focus={(executando == props?.card?.id_job_status ? true : false)}
                onClick={handleSetStatusIframe}
                title={title}
                tippy={title}
                filters={{
                    filter_type: props?.tipoCalendario,
                    filter_id_user: props?.usuario
                }}
                aux_form={props?.card?.aux_form}
                modal={props?.modal}
                swiper={props?.swiper}
                onSetDateInternal={setDate}
                subtitle={subtitle}
                view={(props.view === false ? false : (props?.tipoCalendario == 7 ? false : true))}
                obs1={obs1}
                obs2={obs2}
                obs3={obs3}
                obs4={obs4}
                obs5={obs5}
                print={props?.print}
                circle={circle}
                attention={(props?.card?.status_ant == 3 ? 'Atenção, job frequentemente feito em atraso' : false)}
                visualized={{
                    show: (props?.card?.id_apl?.includes('229') && props?.tipoCalendario != 7 ? true : false),
                    confirm: props?.card?.visualizado,
                    date: props?.card?.dataHora_visualizado
                }}
                condition={(props?.visitas || props?.tipoCalendario == 7 ? true : false)}
                internal={
                    (props.chamados && dias_aux < 0 ? false : {
                        new: (tipo_fase_aux == 'Check' || status == 1 || status == 2 ? false : true),
                        params: {
                            options: props?.optionsOperator,
                            ativ_desc: 'Trocou de operador para',
                            filterModule: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                            filter_subtype: props?.subTipoCalendario
                        }
                    })
                }
                reload={{
                    internal: props?.reloadInternal,
                    info: reloadInfo
                }}
                callback={(e) => (e === true ? props.refreshCard(props?.card?.id_job_status) : {})}
                refreshCalendar={handleRefreshCalendar}
                collapse={handleSetCollapse}
                status={status}
                status_sup={statusSupervisor}
                chat={
                    (props?.tipoCalendario == 9 ?
                        false
                    :
                        {
                            api: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable&db_type='+global.db_type,
                            anexo: (props?.card?.desabilitar?.split(',').includes('3') ? false : true),
                            alert: chatAlert,
                            nivel_msg: nivel_msg,
                            message: message,
                            mensagem_finaliza: conf_mensagem_finaliza,
                            id: props?.card?.id_job_status,
                            id_job: props?.card?.id_job,
                            submit_button: messageSubmit,
                            send: (() => { // CHECA SE O ENVIO DE MENSAGENS DEVE OU NÃO SER HABILITADO
                                if(chatAlert){
                                    return true;
                                }else{
                                    if (props?.card?.desabilitar?.split(',').includes('5') || props?.chat?.send === false) {
                                        return false;
                                    } else {
                                        if (props.chamados) { // SE ESTIVER EM CHAMADOS
                                            if (dias_aux < 0) {
                                                return false
                                            } else {
                                                if(tipo_fase_aux === 'Início'){
                                                    if(permission_module === 'operador' || permission_module === 'checker' || permission_module === 'leitura'){
                                                        return false;
                                                    } else {                                                        
                                                        return true;
                                                    }
                                                }else if(tipo_fase_aux === 'Operação'){
                                                    if (global.rs_id_usr?.includes(props?.card?.id_usuario)) {
                                                        if(permission_module === 'operador' || permission_module === 'supervisor' || permission_module === 'master'){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    } else {
                                                        return false;
                                                    }
                                                }else if(tipo_fase_aux === 'Check'){
                                                    if (global.rs_id_usr?.includes(props?.card?.id_usuario_sup) || window.rs_sistema_id == global.sistema.manutencao_madnezz) {
                                                        if(permission_module === 'checker' || permission_module === 'supervisor' || permission_module === 'master'){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    } else {
                                                        return false;
                                                    }
                                                }else if(tipo_fase_aux === 'Pós-venda'){
                                                    if(props?.card?.avaliacao){
                                                        return false;
                                                    }else{
                                                        return true;
                                                    }
                                                }
                                            }
                                        } else {
                                            if (status == 4) {
                                                return false;
                                            } else {
                                                if (status == 1 || status == 2 || status == 3) {
                                                    if(!statusSupervisor){
                                                        if(window.rs_permission_apl === 'checker' || window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master'){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    }else{
                                                        return false;
                                                    }
                                                } else {
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                }
                            })()
                        }
                    )
                }
                chatCallback={handleSetMessage}
                actions={
                    (props?.actions !== false ?
                        <>
                            {(() => {
                                if (props.fases && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master')) {
                                    return (
                                        <>
                                            {(props?.indexSlide != 0 && props?.actions?.prev !== false && (global.rs_id_usr?.includes(props?.card?.id_usuario) || props?.card?.id_loja == window.rs_id_lja || (!props?.card?.id_usuario && !props?.card?.id_loja) || window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ? // SE FOR DIFERENTE DA PRIMEIRA COLUNA
                                                (props?.indexSlide == props?.jobs.length - 1 && status != 0 ? // SE FOR A ÚLTIMA COLUNA E O STATUS FOR EM ANDAMENTO (0)
                                                    <Icon
                                                        type="prev"
                                                        title="Voltar fase"
                                                        animated
                                                        onClick={() => changeStatusSupervisor(
                                                            "Voltou o card depois de finalizado",
                                                            props?.card?.id_job,
                                                            props?.card?.id_job_status,
                                                            3,
                                                            undefined,
                                                            undefined,
                                                            'prev',
                                                            tipo_fase_aux,
                                                            props?.id_job_apl
                                                        )}
                                                    />
                                                    :
                                                    <Icon
                                                        type="prev"
                                                        title="Voltar fase"
                                                        animated
                                                        onClick={() => changePhase(
                                                            'Voltou a fase',
                                                            props?.card?.id_job,
                                                            props?.card?.id_job_status,
                                                            'prev',
                                                            tipo_fase_aux,
                                                            undefined,
                                                            props?.card?.id_job_apl
                                                        )}
                                                    />
                                                )
                                                : '')}                                            

                                            {(props?.indexSlide != props?.jobs.length - 1 && props?.actions?.next !== false && (global.rs_id_usr?.includes(props?.card?.id_usuario) || props?.card?.id_loja == window.rs_id_lja || (!props?.card?.id_usuario && !props?.card?.id_loja) || window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ?
                                                <Icon
                                                    type="next"
                                                    title={'Avançar fase'}
                                                    onClick={() => changePhase(
                                                        'Avançou de fase',
                                                        props?.card?.id_job,
                                                        props?.card?.id_job_status,
                                                        'next',
                                                        tipo_fase_aux,
                                                        undefined,
                                                        props?.card?.id_job_apl
                                                    )}
                                                    animated
                                                />
                                                : '')}

                                            {(props.fases && (status == 1 || status == 3) && window.rs_permission_apl === 'master'?
                                                (props?.card?.desabilitar?.split(',').includes('9') ?
                                                    <></>
                                                :
                                                    <Reabrir
                                                        id_job={props?.card?.id_job}
                                                        id_job_status={props?.card?.id_job_status}
                                                        card={props?.card}
                                                        message={message}
                                                        anexo={anexo}
                                                        callback={handleCallbackReabrir}
                                                    />
                                                )
                                            : '')}

                                            {/* BOTÃO DE ARQUIVAR SOMENTE PARA QUEM TEM NÍVEL DE ACESSO MASTER */}
                                            {(window.rs_permission_apl === 'master' ?
                                                <Icon
                                                    type={(props?.card?.ativo_job_status == 2 ? 'unarchive' : 'archive')}
                                                    title={(props?.card?.ativo_job_status == 2 ? 'Desarquivar' : 'Arquivar')}
                                                    onClick={() => handleArchive(props?.card.id_job, props?.card.id_job_status, (props?.card?.ativo_job_status == 2 ? 1 : 2), props?.card?.id_job_apl)}
                                                    animated
                                                />
                                            : '')}

                                            {((status == 0 || status == 4) && ((global.rs_id_usr?.includes(props?.card?.id_usuario) || props?.card?.id_loja === window.rs_id_lja || (!props?.card?.id_usuario && !props?.card?.id_loja))) ? // VERIFICA SE ESTÁ NA ÚLTIMA COLUNA PARA MOSTRAR O BOTÃO DE FINALIZAR
                                            <>
                                                <Icon
                                                    type="checklist"
                                                    title="Conformidade"
                                                    onClick={() => handleSetShowModal()}
                                                    loading={loadingConformidade}
                                                />

                                                {(executando == props?.card?.id_job_status ?
                                                    <Icon
                                                        type="check"
                                                        title={(habilitarFinalizar ? 'É necessário finalizar todos os cards internos antes de finalizar o job' : 'Finalizar')}
                                                        disabled={(habilitarFinalizar ? true : false)}
                                                        animated
                                                        onClick={() =>
                                                            changeStatus(
                                                                "Finalizou o card",
                                                                props?.card?.id_job,
                                                                props?.card?.id_job_status,
                                                                props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1,
                                                                undefined,
                                                                undefined,
                                                                undefined,
                                                                tipo_fase_aux,
                                                                undefined,
                                                                undefined,
                                                                undefined,
                                                                props?.card?.prioridade,
                                                                props?.id_job_apl
                                                            )
                                                        }
                                                    />
                                                : '')}
                                            </>
                                        : '')}
                                    </>
                                    )
                                }
                            })()}

                            {(() => {
                                if (tipo_fase_aux == 'Início' && dias_aux >= 0 && props.chamados && (!props?.card?.recebido || props?.card?.recebido == 0)) {
                                    if (global.rs_id_usr?.includes(props?.card?.id_usuario_cad)) { // SE A PERMISSÃO FOR MENOR/IGUAL A CHECKER E CAD USR SER IGUAL AO LOGADO OU PERMISSÃO MAIOR QUE CHECKER       
                                        return (
                                            <>
                                                <Cancelar
                                                    title={'Cancelar chamado'}
                                                    id_job={props?.card?.id_job}
                                                    id_job_status={props?.card?.id_job_status}
                                                    id_modulo={props?.card?.id_modulo}
                                                    job={props?.card?.titulo}
                                                    chamados={props.chamados}
                                                    callback={() => handleRefreshCalendar(false)}
                                                />
                                            </>
                                        )
                                    }

                                    if (
                                        (permission_module === 'supervisor' || permission_module === 'master') &&
                                        tipo_permissao_aux !== 'livre' &&
                                        (window.rs_id_lja == 0 || !window.rs_id_lja) &&
                                        !global.rs_id_usr?.includes(props?.card?.id_usuario_cad)
                                    ) {
                                        return (
                                            <>
                                                <Reprovar
                                                    title={'Reprovar chamado'}
                                                    id_job={props?.card?.id_job}
                                                    id_job_status={props?.card?.id_job_status}
                                                    job={props?.card?.job}
                                                    chamados={props.chamados}
                                                    tipo="present"
                                                    type_phase="Pós-venda" 
                                                    callback={(e) => (props.chamados ? props.refreshCalendar() : props.refreshCard(e))}
                                                />
                                            </>
                                        )
                                    }
                                }
                            })()}

                            {(() => {
                                // AÇÕES DA FILA DE "CHECK"
                                let acoes_check_aux = false;

                                if (tipo_fase_aux == 'Check' && (props?.card?.id_usuario_sup || window.rs_sistema_id == global.sistema.manutencao_madnezz) && props?.tipoCalendario != 7) {
                                    if (global.rs_id_usr?.includes(props?.card?.id_usuario_sup) || (window.rs_sistema_id == global.sistema.manutencao_madnezz && !props?.card?.id_usuario_sup)) {
                                        if(permission_module == 'checker' || permission_module == 'supervisor' || permission_module == 'master'){
                                            acoes_check_aux = true;
                                        }else{
                                            acoes_check_aux = false;
                                        }

                                        if(acoes_check_aux){
                                            return (
                                                <>
                                                    <Devolver
                                                        id_job={props?.card?.id_job}
                                                        id_job_status={props?.card?.id_job_status}
                                                        id_job_apl={props?.card?.id_job_apl}
                                                        id_job_lote={props?.card?.id_job_lote}
                                                        id_operador={(props?.card?.id_usuario ? props?.card?.id_usuario : props?.card?.id_loja)}
                                                        tipo_fase={props?.card?.tipo_fase}
                                                        id_fase={props?.card?.id_fase}
                                                        id_modulo={(props?.card?.id_modulo ? props?.card?.id_modulo : filterModule)}
                                                        filter_subtype={props?.subTipoCalendario}
                                                        chamados={props.chamados}
                                                        callback={(e) => (props?.report ? props.refreshCard(e) : props.refreshCalendar())}
                                                    />

                                                    {(props?.card?.desabilitar?.split(',').includes('8') ?
                                                        <></>
                                                    :
                                                        <Check
                                                            id_job={props?.card?.id_job}
                                                            id_job_status={props?.card?.id_job_status}
                                                            id_job_apl={props?.card?.id_job_apl}
                                                            chamados={props.chamados}
                                                            modules={props?.optionsModule}
                                                            status={2} // REPROVAR
                                                            motivo={true}
                                                            message={message}
                                                            anexo={anexo}
                                                            tipo="next"
                                                            nivel={nivel_msg}
                                                            card={props?.card}
                                                            callback={handleCallbackCheck}
                                                        />
                                                    )}

                                                    {(props?.card?.desabilitar?.split(',').includes('7') ?
                                                        <></>
                                                    :
                                                        <Check
                                                            id_job={props?.card?.id_job}
                                                            id_job_status={props?.card?.id_job_status}
                                                            id_job_apl={props?.card?.id_job_apl}
                                                            chamados={props.chamados}
                                                            modules={props?.optionsModule}
                                                            status={1} // APROVAR
                                                            motivo={window.rs_sistema_id == global.sistema.manutencao_madnezz ? true : false} // SE FOR SISTEMA "MANUTENÇÃO" OBRIGA TER MOTIVO
                                                            message={message}
                                                            anexo={anexo}
                                                            tipo="next"
                                                            nivel={nivel_msg}
                                                            tipo_fase={tipo_fase_aux}
                                                            card={props?.card}
                                                            callback={handleCallbackCheck}
                                                        />
                                                    )}
                                                </>
                                            )
                                        }
                                    }
                                }

                                // JOB FINALIZADO PELO OPERADOR, AINDA SEM AVALIAÇÃO DO SUPERVISOR
                                if ((status == 1 || status == 2 || status == 3 || status == 7 || props?.tipoCalendario == 7 || props?.tipoCalendario == 9) && (!statusSupervisor && props?.card?.tipo_fase !== 'Pós-venda') && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master')) {
                                    return (
                                        <>
                                            {props?.card?.url_video ? (
                                                <Tutorial url={props?.card?.url_video} title={props?.card?.titulo} />
                                            ) : (
                                                ""
                                            )}

                                            {(!props.chamados && !props.fases && status != 4 && !props.visitas ? (!window.rs_id_lja || window.rs_id_lja == 0) && window.rs_permission_apl === 'master' && ((!statusSupervisor || statusSupervisor == 3)) ?
                                                (
                                                    <>
                                                        <Editar
                                                            id={props?.card?.id_job}
                                                            id_emp={props?.job?.id_emp}
                                                            lote={props?.card?.lote}
                                                            disabled={(status == 0 || props?.tipoCalendario == 7 || props?.tipoCalendario == 9 ? 
                                                                false
                                                                // (/*props?.card?.card_qtd_total > 0*/ false ? true : false) 
                                                                : true)}
                                                            /*disabledTitle={(props?.card?.card_qtd_total > 0 ? 'Não é possível editar cards com jobs internos' : '')}*/
                                                            chamados={props.chamados}
                                                            permission_module={permission_module}
                                                            fases={props.fases}
                                                            visitas={props.visitas}
                                                            aux_form={props?.card?.aux_form}
                                                            model={(props?.tipoCalendario == 9 ? { edit: true } : false)}
                                                            reload={handleReload}
                                                            refreshCalendar={handleRefreshCalendar}
                                                        />

                                                        {(props?.tipoCalendario == 9 ?
                                                            <Editar
                                                                id={props?.card?.id_job}
                                                                id_emp={props?.job?.id_emp}
                                                                lote={props?.card?.lote}
                                                                disabled={(status == 0 || props?.tipoCalendario == 7 || props?.tipoCalendario == 9 ? 
                                                                    false
                                                                    // (/*props?.card?.card_qtd_total > 0*/ false ? true : false) 
                                                                    : true)}
                                                                chamados={props.chamados}
                                                                fases={props.fases}
                                                                visitas={props.visitas}
                                                                permission_module={permission_module}
                                                                aux_form={props?.card?.aux_form}
                                                                icon={'clone'}
                                                                iconTitle={'Copiar'}
                                                                model={{ edit: false }}
                                                                reload={handleReload}
                                                                refreshCalendar={handleRefreshCalendar}
                                                            />
                                                        : '')}
                                                    </>
                                                ) : (
                                                    ""
                                                )
                                                : '')}

                                            {(!props.chamados && status != 4 && !props.fases && !props.visitas && props?.tipoCalendario != 7 && props?.tipoCalendario != 9 ?
                                                <>
                                                    {(props?.card?.desabilitar?.split(',').includes('9') ?
                                                        <></>
                                                    :
                                                        <Reabrir
                                                            id_job={props?.card?.id_job}
                                                            id_job_status={props?.card?.id_job_status}
                                                            card={props?.card}
                                                            chamados={props.chamados}
                                                            message={message}
                                                            anexo={anexo}
                                                            callback={handleCallbackReabrir}
                                                        />
                                                    )}

                                                    {(props?.card?.desabilitar?.split(',').includes('8') ?
                                                        <></>
                                                    :
                                                        <Reprovar            
                                                            chamados={props.chamados}                                                            
                                                            id_job={props?.card?.id_job}
                                                            id_job_status={props?.card?.id_job_status}
                                                            id_job_apl={props?.card?.id_job_apl}     
                                                            motivo={true}
                                                            message={message}
                                                            anexo={anexo}
                                                            card={props?.card}                                                          
                                                            callback={handleCallbackReprovar}
                                                        />
                                                    )}

                                                    {(props?.card?.desabilitar?.split(',').includes('7') ?
                                                        <></>
                                                    :
                                                        <Icon
                                                            type="check"
                                                            title="Aprovar"
                                                            animated
                                                            onClick={() =>
                                                                changeStatusSupervisor(
                                                                    "Aprovou o job",
                                                                    props?.card?.id_job,
                                                                    props?.card?.id_job_status,
                                                                    1,
                                                                    undefined,
                                                                    undefined,
                                                                    'next',
                                                                    tipo_fase_aux,
                                                                    props?.id_job_apl
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </>
                                            : '')}
                                        </>
                                    );
                                }

                                // CARD EM PÓS-VENDA
                                if ((!props?.fases && !props?.visitas) && tipo_fase_aux == 'Pós-venda' && global.rs_id_usr?.includes(props?.card?.id_usuario_cad)) {
                                    return (                                        
                                        <>
                                            {props.iconAvaliacao.map((item, i) => {
                                                var iconColor = '';

                                                if(!props?.card?.id_avaliacao){
                                                    return (
                                                        <Avaliar
                                                            key={'icon_' + i}
                                                            index_job={props?.index_job}
                                                            item={item}
                                                            card={props?.card}
                                                            filterModule={filterModule}
                                                            callback={handleCallbackRate}
                                                        />
                                                    )
                                                }
                                            })}

                                            {(props?.card?.desabilitar?.split(',').includes('8') || props?.card?.id_avaliacao ? 
                                                <></> 
                                            :
                                                (!conf_mensagem_finaliza ?
                                                    <Reabrir
                                                        id_job={props?.card?.id_job}
                                                        id_job_status={props?.card?.id_job_status}
                                                        card={props?.card}
                                                        chamados={true}
                                                        message={message}
                                                        anexo={anexo}
                                                        disabled={(props?.card?.id_avaliacao ? true : false)}
                                                        callback={handleCallbackReabrir}
                                                    />
                                                :'')
                                            )}
                                        </>
                                    )
                                }

                                if (tipo_fase_aux == 'Check' && props?.card?.id_usuario_sup && props?.tipoCalendario != 7) {
                                    return <></>
                                } else {
                                    if ((status == 0 || status == 5) || props.fases) {
                                        return (
                                            <>
                                                {(() => {
                                                    if (
                                                        (props.chamados && conf_receber) &&
                                                        tipo_fase_aux == 'Início' &&
                                                        dias_aux >= 0 &&
                                                        (permission_module === 'supervisor' || permission_module === 'master') &&
                                                        (!props?.card?.recebido || props?.card?.recebido == 0) &&
                                                        (window.rs_id_lja == 0 || !window.rs_id_lja) &&
                                                        (filterModule == 2361 && window.rs_id_emp == 26 || filterModule != 2361)
                                                    ) {
                                                        return (
                                                            <Icon
                                                                type="receber"
                                                                title="Receber chamado"
                                                                animated
                                                                onClick={() => changeReceived(
                                                                    "Recebeu o chamado",
                                                                    props?.card?.id_job,
                                                                    props?.card?.id_job_status,
                                                                    props?.card?.id_job_apl,
                                                                )}
                                                            />
                                                        )
                                                    }
                                                })()}

                                                {(() => {
                                                    if (props?.card?.url_video) {
                                                        return (
                                                            <Tutorial url={props?.card?.url_video} title={props?.card?.titulo} />
                                                        )
                                                    }
                                                })()}

                                                {(() => {
                                                    if ((!window.rs_id_lja || window.rs_id_lja == 0) && status != 4 && window.rs_permission_apl === 'master' && !props.chamados && (!statusSupervisor || statusSupervisor == 3)) {
                                                        let disable_aux;
                                                        let disable_title_aux;

                                                        if(props?.card?.id_apl?.includes('224')){
                                                            disable_aux = true;
                                                            disable_title_aux = 'Não é possível editar um chamado';
                                                        }else{
                                                            disable_aux = false;
                                                            disable_title_aux = false;
                                                        }

                                                        return (
                                                            <>
                                                                <Editar
                                                                    id={props?.card?.id_job}
                                                                    id_emp={props?.job?.id_emp}
                                                                    lote={props?.card?.lote}
                                                                    id_card_user={props?.card?.id_usuario}
                                                                    disabled={disable_aux}
                                                                    disabledTitle={disable_title_aux}
                                                                    chamados={props.chamados}
                                                                    fases={props.fases}
                                                                    visitas={props.visitas}
                                                                    permission_module={permission_module}
                                                                    aux_form={props?.card?.aux_form}
                                                                    model={(props?.tipoCalendario == 9 ? { edit: true } : false)}
                                                                    modalTitle={(props?.tipoCalendario == 9 ? 'Editar Modelo' : '')}
                                                                    reload={handleReload}
                                                                    refreshCalendar={handleRefreshCalendar}
                                                                />

                                                                {(props?.tipoCalendario == 9 ?
                                                                    <Editar
                                                                        id={props?.card?.id_job}
                                                                        id_emp={props?.job?.id_emp}
                                                                        lote={props?.card?.lote}
                                                                        disabled={(status == 0 || props?.tipoCalendario == 7 ? 
                                                                            false
                                                                            //(/*props?.card?.card_qtd_total > 0*/ false ? true : false) 
                                                                            : true)}
                                                                        chamados={props.chamados}
                                                                        fases={props.fases}
                                                                        visitas={props.visitas}
                                                                        permission_module={permission_module}
                                                                        aux_form={props?.card?.aux_form}
                                                                        icon={'clone'}
                                                                        iconTitle={'Copiar'}
                                                                        modalTitle={'Copiar Modelo'}
                                                                        model={{ edit: false }}
                                                                        reload={handleReload}
                                                                        refreshCalendar={handleRefreshCalendar}
                                                                    />
                                                                    : '')}
                                                            </>
                                                        )
                                                    }
                                                })()}

                                                {(() => {
                                                    if(!disabled && (executando == props?.card?.id_job_status || window.rs_id_emp != 26)){                                                                                                          
                                                        if ((props.chamados && tipo_permissao_aux === 'livre' && (window.rs_id_lja === 0 || !window.rs_id_lja)) || (!props.fases && props?.tipoCalendario != 7 && !props?.card?.arquivado && !props?.card?.id_apl?.includes('231') && !props.visitas && status != 4 && !props?.card?.desabilitar?.split(',').includes('2') && ((window.rs_id_lja && props?.card?.id_loja == window.rs_id_lja) || global.rs_id_usr?.includes(props?.card?.id_usuario)))) {
                                                            if (props.chamados && tipo_fase_aux == 'Início' && tipo_permissao_aux !== 'livre') {
                                                                return <></>
                                                            } else {
                                                                if(((props.chamados && tipo_fase_aux === 'Operação' && (permission_module === 'operador' || permission_module === 'supervisor' || permission_module === 'master' || permission_module === 'checker')) || !props.chamados || (tipo_permissao_aux === 'livre' && permission_module !== 'leitura'))){
                                                                    let devolver = false;

                                                                    // VERIFICA SE O EMPREENDIMENTO TÁ CONFIGURADO PARA VOLTAR O CHAMADO AO SOLICITANTE QUANDO OPERADOR RECUSAR
                                                                    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card){
                                                                        if(JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_card)?.actions?.recusar?.devolver === 1){
                                                                            devolver = true;
                                                                        }
                                                                    }

                                                                    if(devolver && !conf_mensagem_finaliza){
                                                                        return (
                                                                            <Reprovar            
                                                                                chamados={props.chamados}                                                            
                                                                                id_job={props?.card?.id_job}
                                                                                id_job_status={props?.card?.id_job_status}
                                                                                id_job_apl={props?.card?.id_job_apl}     
                                                                                motivo={true}
                                                                                message={message}
                                                                                anexo={anexo}
                                                                                card={props?.card}
                                                                                tipo="next"
                                                                                type_phase="Operação"                                                             
                                                                                callback={handleCallbackReprovar}
                                                                            />
                                                                        )
                                                                    }else{
                                                                        if((executando || window.rs_id_emp != 26) && !conf_mensagem_finaliza){
                                                                            let acao_fase, tipo_fase;

                                                                            if(tipo_fase_aux === 'Início'){
                                                                                acao_fase = 'present';
                                                                                tipo_fase = 'Pós-venda';
                                                                            }else{
                                                                                acao_fase = 'next';
                                                                                tipo_fase = undefined;
                                                                            }

                                                                            if(window.rs_id_emp == 26 || (window.rs_id_emp != 26 && window.rs_sistema_id != global.sistema.manutencao_madnezz)){
                                                                                return (
                                                                                    <Finalizar
                                                                                        chamados={props.chamados}
                                                                                        fases={props.fases}
                                                                                        id_job={props?.card?.id_job}
                                                                                        id_job_status={props?.card?.id_job_status}
                                                                                        id_job_apl={props?.card?.id_job_apl}
                                                                                        jobsCols={props?.jobsCols}
                                                                                        jobs={props?.jobs}
                                                                                        title={(props.chamados ? 'Recusar' : 'Não tem')}
                                                                                        motivo={true} // SE FOR SISTEMA "MANUTENÇÃO" OBRIGA TER MOTIVO
                                                                                        message={message}
                                                                                        anexo={anexo}
                                                                                        tipo_permissao={tipo_permissao_aux}
                                                                                        modules={props?.optionsModule}
                                                                                        card={props?.card}
                                                                                        acao_fase={acao_fase}
                                                                                        tipo_fase={tipo_fase}
                                                                                        status={2} // REPROVAR
                                                                                        callback={handleCallbackFinalizar}
                                                                                    />
                                                                                )
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                })()}

                                                {(() => {
                                                    if(
                                                        (
                                                            !props.visitas &&
                                                            ((window.rs_id_lja && props?.card?.id_loja == window.rs_id_lja) || global.rs_id_usr?.includes(props?.card?.id_usuario))&&
                                                            status != 4 &&
                                                            !props?.card?.desabilitar?.split(',').includes('4') &&
                                                            !props.chamados &&
                                                            !props?.card?.id_apl?.includes('231') &&
                                                            props?.tipoCalendario != 7 && 
                                                            !props?.card?.arquivado
                                                        )
                                                        || 
                                                        (
                                                            props?.visitas &&
                                                            !props?.card?.desabilitar?.split(',').includes('4') &&
                                                            (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && 
                                                            (!configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar || (configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar && configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.id_par != props?.card?.id_categoria && configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar.includes('4')))
                                                        )
                                                        ||
                                                        (
                                                            props?.visitas &&
                                                            window.rs_permission_apl === 'master'
                                                        )
                                                        ||
                                                        (
                                                            props?.fases &&
                                                            window.rs_permission_apl === 'master'
                                                        )
                                                    ){
                                                        return(
                                                            <Icon
                                                                type="calendar"
                                                                title={(props?.visitas ? 'Adiantar/Adiar' : 'Adiar')}
                                                                animated
                                                                datepicker={true}
                                                                valueStart={(!props.visitas ? new Date(props?.card?.data) : '')} // SE FOR VISITAS NÃO SETA A DATA INICIAL DO CALENDÁRIO
                                                                onChange={(e) =>
                                                                    setDate(
                                                                        props?.card?.id_job_status,
                                                                        e,
                                                                        props?.card?.id_job,
                                                                        props?.card?.data             
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    }
                                                })()}

                                                {(() => {
                                                    if (props.visitas) {
                                                        if((window.rs_id_lja && props?.card?.id_loja == window.rs_id_lja) || global.rs_id_usr?.includes(props?.card?.id_usuario) || props?.subTipoCalendario === 'store'){
                                                            if((!configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar || (configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar && !configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar.includes('1') || (configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.id_par != props?.card?.id_categoria && configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar.includes('1')) || (configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.id_par == props?.card?.id_categoria && props?.card?.data > get_date('datetime_sql', new Date()))))){
                                                                let title_aux;
                                                                let disabled_aux;

                                                                if(global.allowLocation){
                                                                    if(props?.card?.data.slice(0,10) > window.currentDateWithoutHour){
                                                                        title_aux = 'Não é possível realizar visita em datas futuras';
                                                                        disabled_aux = true;
                                                                    }else{
                                                                        title_aux = 'Finalizar';
                                                                        disabled_aux = false;
                                                                    }
                                                                }else{
                                                                    title_aux = 'Habilite a localização no navegador antes de finalizar a visita';
                                                                    disabled_aux = true;
                                                                }

                                                                return (
                                                                    <Icon
                                                                        type="check"
                                                                        title={title_aux}
                                                                        disabled={disabled_aux}
                                                                        animated
                                                                        onClick={() =>
                                                                            changeStatus(
                                                                                "Finalizou o " + (props.chamados ? 'chamado' : 'job'),
                                                                                props?.card?.id_job,
                                                                                props?.card?.id_job_status,
                                                                                props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1,
                                                                                undefined,
                                                                                undefined,
                                                                                'next',
                                                                                tipo_fase_aux,
                                                                                undefined,
                                                                                undefined,
                                                                                undefined,
                                                                                props?.card?.prioridade,
                                                                                props?.card?.id_job_apl
                                                                            )
                                                                        }
                                                                    />
                                                                )
                                                            }
                                                        }
                                                    } else if (props.chamados) {
                                                        if (        
                                                            (tipo_permissao_aux === 'livre' && (window.rs_id_lja === 0 || !window.rs_id_lja)) ||                                                   
                                                            (((window.rs_id_lja && props?.card?.id_loja == window.rs_id_lja) || global.rs_id_usr?.includes(props?.card?.id_usuario)) &&
                                                            !props?.card?.url_sistema_job && 
                                                            tipo_fase_aux != 'Início')
                                                        ) {
                                                            if(!disabled){
                                                                if(permission_module === 'operador' || permission_module === 'checker' || permission_module === 'supervisor' || permission_module === 'master'){
                                                                    let nivel_aux;

                                                                    if(sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
                                                                        nivel_aux = 1;
                                                                    }else{
                                                                        if(tipo_permissao_aux === 'livre'){
                                                                            nivel_aux = 1;
                                                                        }else{
                                                                            nivel_aux = 2;
                                                                        }     
                                                                    }
                
                                                                    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DA API
                                                                        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
                                                                            if(JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux]){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                                                                                nivel_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).tipo_fase[tipo_fase_aux].nivel_msg; // SETA O NÍVEL DAS MSGS
                                                                            }
                                                                        }
                                                                    }

                                                                    if((executando == props?.card?.id_job_status || window.rs_id_emp != 26) && !conf_mensagem_finaliza){
                                                                        if(window.rs_id_emp == 26 || (window.rs_id_emp != 26 && window.rs_sistema_id != global.sistema.manutencao_madnezz)){
                                                                            return (
                                                                                <Finalizar
                                                                                    chamados={props.chamados}
                                                                                    fases={props.fases}
                                                                                    id_job={props?.card?.id_job}
                                                                                    id_job_status={props?.card?.id_job_status}      
                                                                                    id_job_apl={props?.card?.id_job_apl}     
                                                                                    jobsCols={props?.jobsCols}      
                                                                                    jobs={props?.jobs}                                               
                                                                                    modules={props?.optionsModule}
                                                                                    card={props?.card}
                                                                                    tipo="next"
                                                                                    message={message}
                                                                                    anexo={anexo}
                                                                                    tipo_permissao={tipo_permissao_aux}
                                                                                    nivel={nivel_aux}
                                                                                    motivo={conf_finalizar_txt_obrigatorio}
                                                                                    prioridade={props?.card?.prioridade}
                                                                                    tipo_fase={tipo_fase_aux}
                                                                                    status={props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1}
                                                                                    callback={handleCallbackFinalizar}
                                                                                />
                                                                            )
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        if ((executando==props?.card?.id_job_status || window.rs_id_emp != 26) && (!props.fases && !props.visitas && props?.card?.status != 4 && !props?.card?.arquivado && props?.tipoCalendario != 7 && !props?.card?.desabilitar?.split(',').includes('1') && (props?.card?.id_loja == window.rs_id_lja || global.rs_id_usr?.includes(props?.card?.id_usuario)) && !props?.card?.id_sistema_api)) {
                                                            return (
                                                                <Icon
                                                                    type="check"
                                                                    title={(habilitarFinalizar ? 'É necessário finalizar todos os cards internos antes de finalizar o job' : 'Finalizar')}
                                                                    disabled={(habilitarFinalizar ? true : false)}
                                                                    animated
                                                                    onClick={() =>
                                                                        changeStatus(
                                                                            "Finalizou o " + (props.chamados ? 'chamado' : 'job'),
                                                                            props?.card?.id_job,
                                                                            props?.card?.id_job_status,
                                                                            props?.card?.data < get_date('datetime_sql', new Date()) ? 3 : 1,
                                                                            undefined,
                                                                            undefined,
                                                                            'next',
                                                                            tipo_fase_aux,
                                                                            undefined,
                                                                            undefined,
                                                                            undefined,
                                                                            props?.card?.prioridade,
                                                                            props?.card?.id_job_apl
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    }
                                                })()}

                                                {(() => {
                                                    if(executando != props?.card?.id_job_status && global.rs_id_usr?.includes(props?.card?.id_usuario)){
                                                        if (!props.chamados || (props.chamados && tipo_fase_aux != 'Início')){
                                                            if(props?.fases || (!props?.fases && (permission_module === 'operador' || permission_module === 'checker' || permission_module === 'supervisor' || permission_module === 'master'))){
                                                                return (
                                                                    <>
                                                                        <Icon
                                                                            type="executar"
                                                                            title="Executar"
                                                                            animated
                                                                            onClick={() =>
                                                                                changeExecuting(
                                                                                    'Marcou como "Em execução"',
                                                                                    props?.card?.id_job_status,
                                                                                    1,
                                                                                    props?.card?.id_job,
                                                                                    props?.card?.id_job_apl
                                                                                )
                                                                            }
                                                                        />
                                                                    </>
                                                                )
                                                            }
                                                        }
                                                    }
                                                })()}

                                                {(window.rs_permission_apl === 'master' && props?.fases? 
                                                    <Icon
                                                        type={props?.card?.prioridade==7 ? "star-active" : "star"}
                                                        className={props?.card?.prioridade==7 ? 'text-danger' : ''}
                                                        onClick={()=>changePrioridade(props?.card?.prioridade==7?0:7)}
                                                        loading={loadingPrioridade}
                                                    /> 
                                                : '')}
                                            </>
                                        );
                                    }
                                }
                            })()}
                        </>
                    : '')
                }
                background={(props?.background !== false ? background : '')}
                alert={alertHour}
                disabled={disabled}
                fases={props?.fases}
                chamados={props?.chamados}
                visitas={props?.visitas}
                iframeName={"job_" + props?.card?.id_job + "_" + props?.card?.id_job_status + "_" + (props?.card?.data_job < get_date('datetime_sql', new Date()) ? 3 : 1)}
            >
                <div className="mt-3">
                    <Form>
                        {(troca_operador ? // VERIFICA SE PODE HAVER A TROCA DE OPERADOR
                            <TrocaOperador
                                label={(props?.indexSlide == 0 && props.chamados ? 'Encaminhar ao operador' : 'Trocar de operador')}
                                options={(tipo_fase_aux == 'Check' ? props?.optionsCheck : props?.optionsOperator)}
                                fases={props?.fases}
                                chamados={props?.chamados}
                                visitas={props?.visitas}
                                params={{
                                    index_job: props?.index_job,
                                    id_modulo: props?.card?.id_modulo,
                                    id_job: props?.card?.id_job,
                                    id_job_lote: props?.card?.id_job_lote,
                                    id_job_status: props?.card?.id_job_status,
                                    id_job_apl: props?.card?.id_job_apl,
                                    id_usuario: props?.card?.id_usuario,
                                    id_usuario_sup: props?.card?.id_usuario_sup,
                                    type_phase: tipo_fase_aux,
                                    id_fase: props?.card?.id_fase,
                                    ativ_desc: (props?.indexSlide == 0 ? 'Encaminhou o chamado a(o) operador(a)' : 'Trocou de operador para'),
                                    filterModule: (props?.card?.id_modulo ? props?.card?.id_modulo : filterModule),
                                    filter_subtype: props?.subTipoCalendario
                                }}
                                onChange={handleChangeOperator}
                            />
                        :'')}
                    </Form>

                    {(() => {
                        let encaminhar_aux;

                        // SE FOR CHAMADOS, O CARD NÃO TIVER AVALIAÇÃO E A FASE FOR DIFERENTE DE PÓS-VENDA
                        if(props.chamados && !props?.card?.id_avaliacao && props?.card?.tipo_fase !== 'Pós-venda'){
                            if(permission_module === 'supervisor' || permission_module === 'master'){
                                if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao){
                                    if(JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao).encaminhar){
                                        encaminhar_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao).encaminhar;
                                    }else{
                                        encaminhar_aux = 'modulo';
                                    }
                                }else{
                                    encaminhar_aux = 'modulo';
                                }
                            }
                        }
                        
                        // SE FOR SISTEMA MANUTENÇÃO
                        if(localStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
                            if(window.rs_id_emp == 26){
                                if(window.rs_permission_apl === 'operador'){
                                    encaminhar_aux = false;
                                }else{
                                    encaminhar_aux = 'modulo';
                                }
                            }else{
                                encaminhar_aux = false;
                            }
                        }else{
                            // VERIFRICAR SE NO BANCO ESTÁ CONFIGURADO QUE O MÓDULO NÃO TENHA ENCAMINHAMENTO
                            if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar){
                                let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar)?.filter((elem) => elem.id_modulo == filterModule)[0]?.values;
                                json_aux = json_aux?.filter((elem) => elem.nome === 'encaminhamento')[0];

                                if(json_aux){   
                                    encaminhar_aux = json_aux?.value == 1 ? false : true;
                                }
                            }
                        }        
                    
                        if(encaminhar_aux){
                            if(encaminhar_aux == 'modulo'){
                                return (
                                    <SelectReact
                                        label="Encaminhar à outra área"
                                        name="troca_modulo"
                                        options={props?.optionsModuleUnfiltered ? props?.optionsModuleUnfiltered : props?.optionsModule}
                                        value={categoriaSelected}
                                        isRtl={true}
                                        required={false}
                                        onChange={(e) => (
                                            setCategoriaSelected(e.value),                                        
                                            changeModulo(props?.card?.id_job, props?.card?.id_job_status, e.value, `Alterou o módulo: `+ (props?.optionsModuleUnfiltered ? props?.optionsModuleUnfiltered : props?.optionsModule).filter((item) => item.value === e.value)[0].label, props?.card?.tipo_fase, props?.card?.id_job_apl)                                    
                                        )}
                                    />
                                );
                            }else if(encaminhar_aux == 'categoria'){
                                return (
                                    <Form
                                        method="post"
                                        api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable'}
                                        data={{
                                            db_type: global.db_type,
                                            type: 'Job',
                                            do: 'setTable',
                                            tables: [
                                                {
                                                    table: 'module',
                                                    filter: {
                                                        id_job: props?.card?.id_job,
                                                        id_job_status: props?.card?.id_job_status,
                                                        id_job_apl: props?.card?.id_job_apl,
                                                        id_apl: 224,
                                                        id_modulo: subcategoriaModulo,
                                                        tipo_fase: props?.card?.tipo_fase,                                                        
                                                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                                                        mensagem: 'Trocou a categoria de '+props?.card?.categoria+'/'+props?.card?.subcategoria+' para '+categoriaNome+'/'+subcategoriaNome
                                                    }
                                                },{
                                                    table: 'job',
                                                    filter: {
                                                        id_job: props?.card?.id_job,
                                                        id_job_status: props?.card?.id_job_status,
                                                        id_category: categoriaSelected,
                                                        id_subcategory: subcategoriaSelected,
                                                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                                                        set_log: 'FALSE'                                                  
                                                    }
                                                }
                                            ]
                                        }}
                                        toast={'Categoria e Subcategoria alteradas com sucesso'}
                                        status={handleCallbackFormCategoriaStatus}
                                        callback={handleCallbackFormCategoria}
                                    >
                                        <div className={style.separator}>
                                            <span>Encaminhamento</span>
                                        </div>
    
                                        <SelectReact
                                            label="Categoria"
                                            name="troca_categoria"
                                            api={{
                                                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                                                params: {
                                                    db_type: global.db_type, do: 'getTable', tables: [{table: 'category'}]
                                                },
                                                key_aux: ['data', 'category']
                                            }}                                
                                            value={categoriaSelected}
                                            isRtl={true}
                                            required={false}
                                            onChange={(e) => (setCategoriaSelected(e.value), setCategoriaNome(e.label))}
                                        />
    
                                        <SelectReact
                                            label="Subcategoria"
                                            name="troca_subcategoria"
                                            api={{
                                                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                                                params: {
                                                    db_type: global.db_type, do: 'getTable', tables: [{table: 'subcategory', filter: {id_ite: categoriaSelected}}]
                                                },
                                                key_aux: ['data', 'subcategory']
                                            }}                                
                                            value={subcategoriaSelected}
                                            isRtl={true}
                                            required={false}
                                            reload={categoriaSelected}
                                            onChange={(e) => (setSubcategoriaSelected(e.value), setSubcategoriaNome(e.label), setSubcategoriaModulo(e.id_ite_aux))}
                                        />
    
                                        <Button
                                            type="submit"
                                            title={categoriaSelected && subcategoriaSelected ? false : 'Seleciona uma categoria e subcategoria para continuar'}
                                            disabled={categoriaSelected && subcategoriaSelected ? false : true}
                                            status={statusFormCategoria}
                                        >
                                            Encaminhar
                                        </Button>
                                    </Form>
                                );
                            }
                        }
                    })()}
                </div>
            </Card>
           )}
        </>
    )
}
