import { useEffect, useState, useContext } from 'react';

import { GlobalContext } from "../../../../context/Global";
import { JobsContext } from '../../../../context/Jobs';
import axios from 'axios';
import { cd, diffDays, get_date } from '../../../../_assets/js/global';
import Row from '../../../../components/body/row';
import Col from '../../../../components/body/col';
import Table from '../../../../components/body/table';
import Tr from '../../../../components/body/table/tr';
import Tbody from '../../../../components/body/table/tbody';
import Td from '../../../../components/body/table/tbody/td';
import Icon from '../../../../components/body/icon';
import ModalListaJob from './modal';
import Container from '../../../../components/body/container';
import SelectReact from '../../../../components/body/select';
import Dev from '../../../../components/body/dev';

export default function Lista(props) {
    // GLOBAL CONTEXT
    const { handleSetFilter, loadingCalendar, handleSetFixFilterModule, handleSetFirstLoad, handleSetFilterModule, filterModule } = useContext(GlobalContext);

    // JOBS CONTEXT
    const { filterEmpreendimento, optionsSystems, optionsAvaliacao, configuracoes } = useContext(JobsContext);

    // VARIÁVEIS
    var fase;

    // FILTROS
    global.filters = '';

    // ESTADOS
    const [jobs, setJobs] = useState([]);
    const [optionsModule, setOptionsModule] = useState([]);

    // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
    useEffect(() => {
        // handleSetFilter(true);
        loadingCalendar(true);
        handleSetFilterModule(null);
        handleSetFixFilterModule(false);
        handleSetFirstLoad(true);
    }, []);

    // CHECKBOXS DE FASES
    const [optionsPhases, setOptionsPhases] = useState([]);

    // VALUE FILTROS
    const [status, setStatus] = useState([]);
    const [empreendimento, setEmpreendimento] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [loja, setLoja] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [usuarioSup, setUsuarioSup] = useState([]);
    const [loja_cad, setLojaCad] = useState([]);
    const [usuario_cad, setUsuarioCad] = useState([]);
    const [protocolo, setProtocolo] = useState('');
    const [titulo, setTitulo] = useState('');
    const [grupo, setGrupo] = useState('');
    const [integration, setIntegration] = useState([]);
    const [modulo, setModulo] = useState([]);
    const [aberto, setAberto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [aberturaInicio, setAberturaInicio] = useState('');
    const [aberturaFim, setAberturaFim] = useState('');
    const [checkInicio, setCheckInicio] = useState('');
    const [checkFim, setCheckFim] = useState('');
    const [finalizacaoInicio, setFinalizacaoInicio] = useState('');
    const [finalizacaoFim, setFinalizacaoFim] = useState('');
    const [sistemas, setSistemas] = useState('');
    const [frequencias, setFrequencias] = useState('');
    const [horalimite, setHoraLimite] = useState('');
    const [categorias, setCategorias] = useState('');
    const [sistemasManutencao, setSistemasManutencao] = useState('');
    const [subcategorias, setSubcategorias] = useState('');
    const [avaliacao, setAvaliacao] = useState('');
    const [fases, setFases] = useState([]);
    const [fasesAux, setFasesAux] = useState([]);
    const [pageError, setPageError] = useState(false);
    const [statusSupervisor, setStatusSupervisor] = useState('');
    const [urgente, setUrgente] = useState([]);
    const [filterModuleAux, setFilterModuleAux] = useState([]);
    const [filterOrdenacao, setFilterOrdenacao] = useState('sla');
    const [reload, setReload] = useState(0);

    // CONFIGURAÇÕES DO RELATÓRIO
    let conf_urgente = true;
    let conf_modulo = true;
    let conf_categoria = true;
    let conf_operador = true;
    let conf_checker = true;
    let conf_loja_solicitante = true;
    let conf_usuario_solicitante = true;
    let conf_titulo = true;
    
    if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
        conf_categoria = false;
        conf_loja_solicitante = false;

        if(window.rs_id_emp != 26){
            conf_operador = false;
            conf_checker = false;
        }
    }else{
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'relatorio')[0]?.conf_desabilitar){
            let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'relatorio')[0]?.conf_desabilitar);

            conf_urgente = json_aux.urgente == 1 ? false : true;
            conf_modulo = json_aux.modulo == 1 ? false : true;
            conf_categoria = json_aux.categoria == 1 ? false : true;
            conf_operador = json_aux.operador == 1 ? false : true;
            conf_checker = json_aux.checker == 1 ? false : true;
            conf_titulo = json_aux.titulo == 1 ? false : true;
            conf_usuario_solicitante = json_aux.usuario_solicitante == 1 ? false : true;
        }
    }

    // CONFIGURAÇÕES DE NOMES
    let nome_modulo = 'Módulo';

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'relatorio')[0]?.conf_configuracao){
        let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'relatorio')[0]?.conf_configuracao).nome;

        json_aux.map((item, i) => {
            if(item.modulo){
                nome_modulo = item.modulo;
            }
        });
    }

    // KEY AUX DO FILTRO DE MÓDULO
    let key_aux_modulo = '';
    if(props.chamados){
        key_aux_modulo = 'moduleChamados';
    }else if(props.fases){
        key_aux_modulo = 'moduleFases';
    }

    // BUSCA OPTIONS DE MÓDULOS
    useEffect(() => {
        if(props.chamados || props.fases){
            let table_aux;

            if(props.chamados){
            table_aux = 'moduleChamados';
            }else if(props.fases){
            table_aux = 'moduleFases';
            }

            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    db_type: global.db_type,
                    type: 'Job',
                    do: 'getTable',
                    tables: [{
                        table: table_aux,
                        filter: {
                            id_emp: filterEmpreendimento
                        }
                    }]
                }
            }).then((response) => {
                if(response.data){
                    setOptionsModule(response?.data?.data[table_aux]);

                    let filter_module_aux = [];
                    response?.data?.data[table_aux].map((item, i) => {
                        filter_module_aux.push(item?.id);
                    });

                    // SE FOR O SISTEMA MANUTENÇÃO CRAVA O ID DO MÓDULO "MADNEZZ" (405)
                    if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
                        setFilterModuleAux([global.modulo.manutencao]); 
                    }else{
                        setFilterModuleAux(filter_module_aux.filter((elem) => elem.id != global.modulo.manutencao));
                    }      
                }
            });
        }
    },[]);

    // FILTRO DE PROTOCOLO
    function handleProtocolo(e) {
        setProtocolo(e);
    }

    // FILTRO DE TÍTULO
    function handleTitulo(e) {
        setTitulo(e);
    }

    // FILTRO DE GRUPO
    function handleGrupo(e) {
        setGrupo(e.target.value);
    }

    // FILTRO DE DIAS DE ABERTURA
    function handleAberto(e) {
        setAberto(e.target.value);
    }

    // FILTRO DE DESCRIÇÃO
    function handleDescricao(e) {
        setDescricao(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX EMPREENDIMENTO
    function handleEmpreendimentos(e) {
        setEmpreendimento(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX CLIENTE
    function handleClientes(e) {
        setCliente(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX STATUS
    function handleStatus(e) {
        setStatus(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX LOJA
    function handleLojas(e) {
        setLoja(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX USUÁRIO
    function handleUsuarios(e) {
        setUsuario(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX USUÁRIO SUPERVISOR
    function handleUsuariosSup(e) {
        setUsuarioSup(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX LOJA CADASTRO
    function handleLojasCad(e) {
        setLojaCad(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX USUÁRIO CADASTRO
    function handleUsuariosCad(e) {
        setUsuarioCad(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX MÓDULO
    function handleModulos(e) {
        setModulo(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX INTEGRAÇÕES
    function handleIntegrations(e) {
        setIntegration(e);
    }

    // SETA DATA INÍCIO DA ABERTURA
    const handleSetAberturaInicio = (e) => {
        setAberturaInicio(e);
        handleSetFilter(true);
    }

    // SETA DATA FIM DA ABERTURA
    const handleSetAberturaFim = (e) => {
        setAberturaFim(e);
        handleSetFilter(true);
    }

    // SETA DATA INÍCIO DO CHECK
    const handleSetCheckInicio = (e) => {
        setCheckInicio(e);
        handleSetFilter(true);
    }

    // SETA DATA FIM DO CHECK
    const handleSetCheckFim = (e) => {
        setCheckFim(e);
        handleSetFilter(true);
    }

    // SETA DATA INÍCIO DA FINALIZAÇÃO
    const handleSetFinalizacaoInicio = (e) => {
        setFinalizacaoInicio(e);
        handleSetFilter(true);
    }

    // SETA DATA FIM DA FINALIZAÇÃO
    const handleSetFinalizacaoFim = (e) => {
        setFinalizacaoFim(e);
        handleSetFilter(true);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX FREQUÊNCIA
    function handleCheckSistema(e) {
        setSistemas(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX FREQUÊNCIA
    function handleCheckFrequencia(e) {
        setFrequencias(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX HORA LIMITE
    function handleCheckHourLimit(e) {
        setHoraLimite(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX CATEGORIA
    const handleCheckCategoria = (e) => {
        setCategorias(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX SISTEMAS (MANUTENÇÃO)
    const handleCheckSistemas = (e) => {
        setSistemasManutencao(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX FASES
    const handleCheckFase = (e) => {        
        if(e.includes('6')){
            setStatus([6]);
        }

        if(e.includes('-1')){
            let fases_aux = fases;      
            setFasesAux(fases_aux.push(optionsPhases.filter((elem) => elem.label === 'Pós-venda')[0].value.toString()));
        }else{
            setFases(fases.filter((elem) => elem != optionsPhases.filter((elem) => elem.label === 'Pós-venda')[0].value));
            setFasesAux([]);
        }
        
        setFases(e.filter((elem) => (elem !== '6' && elem !== '-1')));         
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX SUBCATEGORIA
    const handleCheckSubcategoria = (e) => {
        setSubcategorias(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX AVALIAÇÃO
    const handleCheckAvaliacao = (e) => {
        setAvaliacao(e);
    }

    // FUNÇÃO DE EXECUÇÃO DO CHECKBOX STATUS SUPERVISOR
    const handleCheckStatusSupervisor = (e) => {
        setStatusSupervisor(e);
    }

    // FILTRO DE EXECUÇÃO DO CHECKBOX URGENTE
    const handleSetUrgente = (e) => {
        setUrgente(e);
    }

    const handleSetOrdenacao = (e) => {
        setFilterOrdenacao(e);
        setReload(reload + 1);
    }

    // FILTRO DE STATUS (CHAMADOS)
    const handleCheckStatusChamados = (e) => {
        let filter_fases_aux = [];
        let filter_avaliation_aux = [];

        if(e.includes('1')){ // EM ABERTO
            filter_fases_aux.push(optionsPhases.filter((elem) => elem.nome === 'Início')[0].id); // FILA
            filter_fases_aux.push(optionsPhases.filter((elem) => elem.nome === 'Operação')[0].id); // OPERAÇÃO
        }

        if(e.includes('2')){ // RESPONDIDO
            filter_fases_aux.push(optionsPhases.filter((elem) => elem.nome === 'Pós-venda')[0].id); // PÓS-VENDA
            filter_avaliation_aux.push('-1');
        }

        if(e.includes('3')){ // AVALIADO
            optionsAvaliacao.map((item, i) => {
                filter_avaliation_aux.push(item.id);  
            });

            if(e.includes('1') || e.includes('2')){
                // filter_avaliation_aux.push('-1');
                filter_fases_aux.push(optionsPhases.filter((elem) => elem.nome === 'Pós-venda')[0].id);
            }
        }else{
            if(e.includes('2')){
                filter_avaliation_aux.push('-1');
            }
        }

        setFasesAux(filter_fases_aux);
        setAvaliacao(filter_avaliation_aux);
    }

    // LISTA ITENS
    const handleSetItems = (e) => {
        setJobs(e);
    }

    // GET PARA MONTAR FILTRO DE FASES
    useEffect(() => {
        if(props.fases || props.chamados){
            axios({
                // url: window.host_madnezz + '/systems/integration-react/api/list.php?do=get_phaseType'
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    db_type: 'sql_server',
                    type: 'Job',
                    do: 'getTable',
                    tables: [{
                        table: 'phaseType'
                    }]
                }
            }).then((response) => {
                if (response?.data?.data) {                
                    response.data.data.phaseType.push({value: '6', label: 'Cancelado'});
                    // response.data.push({value: '-1', label: 'Finalizado'});

                    setOptionsPhases(response.data.data.phaseType);
                }
            });
        }
    },[]);

    // OPTIONS STATUS CHAMADOS
    const optionsStatusChamados = [
        {value: 1, label: 'Em aberto'},
        {value: 2, label: 'Respondido'},
        {value: 3, label: 'Avaliado'}
    ]

    // CONSTRÓI AS TH'S
    const thead = [
        { enabled: true, label: 'Protocolo', id: 'id_job_status', name: 'id_job_status', mask: '999999999', onChange: handleProtocolo },
        { enabled: (conf_modulo && (props.fases || props.chamados) ? true : false), label: nome_modulo, id: 'modulo', name: 'modulo', api: {url: window.host_madnezz+'/systems/integration-react/api/request.php', params: {db_type: global.db_type, do: 'getTable', type: 'Job', tables: [{table: key_aux_modulo}]}, key_aux: ['data', key_aux_modulo]}, onChange: handleModulos, export: (conf_modulo && (props.fases || props.chamados) ? true : false) },
        { enabled: (props?.chamados && conf_urgente ? true : false), label: 'Urgente', id: "urgente", name: "urgente", items: [{ value: 1, label: "Sim" }, { value: '0', label: "Não" }], onChange: ((e) => handleSetUrgente(e)), search: false, export: (props?.chamados && conf_urgente ? true : false) },
        { enabled: (window.rs_id_grupo > 0 || (window.rs_id_emp == 26 && window.rs_sistema_id == global.sistema.manutencao_madnezz) ? true : false), export: (window.rs_id_grupo > 0 || (window.rs_id_emp == 26 && window.rs_sistema_id == global.sistema.manutencao_madnezz) ? true : false), label: 'Empreendimento', id: 'nome_emp_cad', name: 'nome_emp_cad', api: {url: window.host_madnezz + '/api/sql.php?do=select&component=' + (window.rs_id_emp == 26 ? 'empreendimento' : 'grupo_empreendimento')}, onChange: handleEmpreendimentos },
        { enabled: (window.rs_id_emp == 26 && window.rs_sistema_id == global.sistema.manutencao_madnezz ? true : false), export: window.rs_id_emp == 26 && window.rs_sistema_id == global.sistema.manutencao_madnezz ? true : false, label: 'Cliente', id: 'nome_cliente', name: 'nome_cliente', api: {url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job', params: {db_type: global.db_type, do: 'getTable', tables: [{table: 'client'}]}, key_aux: ['data', 'client']}, onChange: handleClientes },
        { enabled: (conf_loja_solicitante && props?.chamados ? true : false), export: (conf_loja_solicitante && props?.chamados ? true : false), label: 'Loja Solic.', id: 'nome_loja_cad', name: 'nome_loja_cad', api: { url: window.host_madnezz + "/api/sql.php?do=select&component=loja&filial=true", params: { limit: 50 } }, onChange: handleLojasCad },
        { enabled: (props?.chamados && conf_usuario_solicitante ? true : false), export: (props?.chamados && conf_usuario_solicitante ? true : false), label: 'Usuário Solic.', id: 'nome_usuario_cad', name: 'nome_usuario_cad', api: { url: window.host_madnezz + "/api/sql.php?do=select&component=usuario", params: { limit: 50 } }, onChange: handleUsuariosCad },
        { enabled: true, label: (props.chamados ? 'Data Abertura' : 'Data início'), id: 'data', type: 'date', name: 'data', start: { value: aberturaInicio, onChange: handleSetAberturaInicio }, end: { value: aberturaFim, onChange: handleSetAberturaFim } },
        { enabled: true, label: 'Data finalização', id: 'dataHora_realizacao', name: 'dataHora_realizacao', type: 'date', start: { value: finalizacaoInicio, onChange: handleSetFinalizacaoInicio }, end: { value: finalizacaoFim, onChange: handleSetFinalizacaoFim } },
        { enabled: (props?.chamados ? true : false), export: (props?.chamados ? true : false), label: 'Aberto', id: 'dias', name: 'dias', align: 'center', filter: false },
        { enabled: (conf_titulo ? true : false), export: (conf_titulo ? true : false), label: 'Título', id: 'titulo', name: 'titulo', onChange: handleTitulo },
        { enabled: true, label: 'Descrição', id: 'descricao', name: 'descricao', onChange: handleDescricao },        
        { enabled: (conf_categoria ? true : false), export: (conf_categoria ? true : false), label: 'Categoria', id: 'categoria', name: 'categoria', api: {url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job", params: {db_type: global.db_type, do: 'getTable', tables: [{table: 'category', filter: {id_emp: filterEmpreendimento}}]}, key_aux: ['data', 'category']}, onChange: handleCheckCategoria },
        { enabled: (window.rs_sistema_id == global.sistema.manutencao_madnezz ? true : false), export: (window.rs_sistema_id == global.sistema.manutencao_madnezz ? true : false), label: 'Sistema', id: 'sistema_slc', name: 'sistema_slc', api: {url: window.host_madnezz+"/api/sql.php?do=select&component=sistema&empreendimento_id="+window.rs_id_emp}, onChange: handleCheckSistemas },
        { enabled: true, label: (window.rs_sistema_id == global.sistema.manutencao_madnezz ? 'Tipo' : 'Subcategoria'), id: 'subcategoria', name: 'subcategoria', api: {url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job", params: {db_type: global.db_type, do: 'getTable', tables: [{table: 'subcategory', filter: {id_emp: filterEmpreendimento}}]}, key_aux: ['data', 'subcategory']}, onChange: handleCheckSubcategoria },
        { enabled: (!props.chamados && !props.fases && !props.visitas ? true : false), label: 'Peso', id: 'peso_subcategoria', name: 'peso_subcategoria', export: (!props.chamados && !props.fases && !props.visitas ? true : false) },
        { enabled: (!props.chamados && !props.fases && !props.visitas ? true : false), label: 'Integração', id: 'id_apl', name: 'id_apl', items: optionsSystems, onChange: handleIntegrations, export: (!props.chamados && !props.fases && !props.visitas ? true : false) },
        { enabled: (!props.chamados ? true : false), label: 'Status', id: 'status', name: 'status', items: window.optionsStatus, onChange: handleStatus, export: (!props.chamados ? true : false) },        
        { enabled: (props.fases ? true : false), label: 'Fase', id: 'fase', name: 'fase', items: optionsPhases, obs: 'modulo', onChange: handleCheckFase, export: (props.fases ? true : false) },
        { enabled: (props.chamados ? true : false), label: 'Status', id: 'status_nome', name: 'status_nome', items: optionsStatusChamados, onChange: handleCheckStatusChamados, export: (props.chamados ? true : false) },
        { enabled: (!props.chamados && !props.fases ? true : false), label: 'Loja', id: 'nome_loja', name: 'nome_loja', api: { url: window.host_madnezz + "/api/sql.php?do=select&component=loja&filial=true", params: { limit: 50 } }, onChange: handleLojas, export: (!props.chamados && !props.fases ? true : false) },
        { enabled: (conf_operador ? true : false), export: (conf_operador ? true : false), label: (props.chamados ? 'Operador' : 'Usuário'), id: 'nome_usuario', name: 'nome_usuario', api: { url: window.host_madnezz+'/systems/integration-react/api/request.php', params: {type: 'Job', db_type: 'sql_server', do: 'getTable', tables: [{table: (props.chamados ? 'operator' : 'user'), filter: {type_phase: (props.chamados ? 'Operação' : undefined), id_module: (props.chamados ? filterModuleAux : undefined), type_operator: (props.chamados ? 'user' : undefined)}}]}, key_aux: ['data', (props.chamados ? 'operator' : 'user')]}, onChange: handleUsuarios },        
        { enabled: (conf_checker ? true : false), export: (conf_checker ? true : false), label: 'Checker', id: 'nome_usuario_sup', name: 'nome_usuario_sup', api: { url: (props.chamados ? (window.host_madnezz+'/systems/integration-react/api/request.php') : (window.host_madnezz + "/api/sql.php?do=select&component=usuario")), params: (props.chamados ? {type: 'Job', db_type: 'sql_server', do: 'getTable', id_emp: window.rs_id_emp, tables: [{table: 'operator', filter: {type_phase: 'Check', id_module: filterModule, type_operator: 'user'}}]} : { limit: 50 }), key_aux: ['data', 'operator']}, onChange: handleUsuariosSup },        
        { enabled: (conf_checker ? true : false), export: (conf_checker ? true : false), type: 'date', label: 'Data Check', id: 'dataHora_sup', name: 'dataHora_sup',  start: { value: checkInicio, onChange: handleSetCheckInicio }, end: { value: checkFim, onChange: handleSetCheckFim } },        
        { enabled: (!props.chamados && !props.fases ? true : false), label: 'Sistema', id: 'sistema_job', name: 'sistema', api: {url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job", params: {db_type: global.db_type, do: 'getTable', tables: [{table: 'systemJob', filter: {id_emp: filterEmpreendimento}}]}, key_aux: ['data', 'systemJob']}, onChange: handleCheckSistema, export: (!props.chamados && !props.fases ? true : false) },
        { enabled: (!props.chamados && !props.fases ? true : false), label: 'Frequência', id: 'frequencia', name: 'frequencia', api: {url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job", params: {db_type: global.db_type, do: 'getTable', tables: [{table: 'frequency', filter: {id_emp: filterEmpreendimento}}]}, key_aux: ['data', 'frequency']}, onChange: handleCheckFrequencia, export: (!props.chamados && !props.fases ? true : false) },
        { enabled: (!props.chamados && !props.fases ? true : false), label: 'Hora limite', id: 'hora_limite_formatada', name: 'hora_limite_formatada', api: {url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job", params: {db_type: global.db_type, do: 'getTable', tables: [{table: 'hourLimit', filter: {id_emp: filterEmpreendimento}}]}, key_aux: ['data', 'hourLimit']}, onChange: handleCheckHourLimit, export: (!props.chamados && !props.fases ? true : false) },
        { enabled: (!props.chamados ? true : false), label: 'Grupo', id: 'id_job_parent', name: 'id_job_parent', onChange: handleGrupo, export: (!props.chamados ? true : false) },
        { enabled: (props.chamados ? true : false), label: 'Avaliação', id: 'avaliacao', name: 'avaliacao', api: {url: window.host_madnezz+'/systems/integration-react/api/request.php', params: {type: 'Job', db_type: 'sql_server', do: 'getTable', tables: [{table: 'assessment'}]}, key_aux: ['data', 'assessment']}, onChange: handleCheckAvaliacao, export: (props.chamados ? true : false) },
        { enabled: true, label: 'Ações', id: 'acoes', name: 'acoes', filter:false, export: false },
    ]

    // TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    })

    // URL API TABLE
    const url = window.host_madnezz+'/systems/integration-react/api/request.php';

    // PARAMS API TABLE
    let id_apl_aux;

    if(props.chamados){
        id_apl_aux = [224];
    }else if(props.fases){
        id_apl_aux = [225];
    }else if(props.visitas){
        id_apl_aux = [226];
    }else if(props.obras){
        id_apl_aux = [227];
    }else if(props.comunicados){
        id_apl_aux = [230];
    }else if(props.notificacoes){
        id_apl_aux = [231];
    }else{
        id_apl_aux = [223];
    }

    const params = {
        db_type: global.db_type,
        do: 'getReport',
        type: 'Job',
        filter_protocol: protocolo,
        filter_status: status,
        filter_type: 'moreColumns',
        filter_date_start: (aberturaInicio ? get_date('date_sql', cd(aberturaInicio)) : ''),
        filter_date_end: (aberturaFim ? get_date('date_sql', cd(aberturaFim)) : ''),
        filter_date_start_execution: (finalizacaoInicio ? cd(finalizacaoInicio) : ''),
        filter_date_end_execution: (finalizacaoFim ? cd(finalizacaoFim) : ''),
        filter_date_start_sup: (checkInicio ? get_date('date_sql', cd(checkInicio)) : ''),
        filter_date_end_sup: (checkFim ? get_date('date_sql', cd(checkFim)) : ''),
        filter_id_system_api: sistemas,
        filter_id_frequency: frequencias,
        filter_id_category: categorias,
        filter_id_subcategory: subcategorias,
        filter_description: descricao,
        filter_title: titulo,
        filter_protocol_title_parent: grupo,
        filter_id_enterprise: empreendimento,
        filter_id_client: cliente,
        filter_id_user: usuario,
        filter_id_user_sup: usuarioSup,
        filter_id_store: loja,
        filter_id_user_cad: usuario_cad,
        filter_id_store_cad: loja_cad,
        filter_days: aberto,
        filter_hour_limit: horalimite,
        filter_id_phase_type: (fasesAux.length > 0 ? fasesAux : fases),
        filter_id_avaliation: avaliacao,
        filter_id_module: modulo, // SE ESTIVER DENTRO DO SISTEMA "MANUTENÇÃO" CRAVA O MÓDULO "MADNEZZ"
        filter_status_supervisor: statusSupervisor,
        filter_id_system_slc: sistemasManutencao,
        filter_id_apl: id_apl_aux,
        filter_urgent: urgente,        
        limit: 50,
        id_apl: window.rs_id_apl,
        order_by_chamados: filterOrdenacao
    };

    // BODY DO EXPORTADOR
    let name_aux;

    if(props.chamados){
        name_aux = 'Chamados';
    }else if(props.fases){
        name_aux = 'Fases';
    }else if(props.visitas){
        name_aux = 'Visitas';
    }else{
        name_aux = 'Jobs';
    }

    const body = {
        titles: thead_export,
        url: url,
        name: name_aux,
        filters: params,
        orientation: 'L',
        key: 'data'
    }

    //TIRAR TAGS DO HTML 
    function removeHTMLTags(text) {
        return text?.replace(/<[^>]*>/g, '');
    }

    // MANDA OS FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (props?.icons) {
            props.icons(
                <>
                    <Icon type="excel" api={{ body: body }} />
                    <Icon type="pdf" api={{ body: body }} />
                </>
            );
        }

        if (props?.filters) {
            const optionsOrdenacao = [
                { value: 'sla', label: 'SLA' },
                { value: 'data_abertura', label: 'Data de Abertura' }
            ];

            props.filters(
                <SelectReact
                    options={optionsOrdenacao}
                    placeholder="Ordenação"
                    name="ordenacao"
                    value={filterOrdenacao}
                    allowEmpty={false}
                    onChange={(e) => handleSetOrdenacao(e.value)}
                />
            );
        }
    }, [jobs]);

    // REFRESH LIST
    const handleRefreshCard = () => {
        handleSetFilter(true);
    }

    return (
        <>
            <Container>
                <Row>
                    <Col lg={12}>
                        <Table
                            id="jobs"
                            api={url}
                            params={params}
                            rightFixed={true}
                            onLoad={handleSetItems}
                            thead={thead}
                            key_aux={['data']}
                            reload={reload}
                    >
                            <Tbody>
                                {(jobs.length > 0 ?
                                    jobs?.map((item, i) => {
                                        var status = '';
                                        var cor = '';
                                        var background = undefined;

                                        // STATUS DO JOBS
                                        if (!props.chamados) {
                                            if (item.status == 0 && item.data > window.currentDate) {
                                                status = 'Em andamento';
                                                cor = '';
                                                background = 'secondary'; 
                                            } else if (item.status == 0 && item.data < window.currentDate) {
                                                status = 'Atrasado';
                                                cor = 'text-danger';
                                                background = 'danger'; 
                                            } else if (item.status == 1) {
                                                status = 'Finalizado';
                                                cor = 'text-primary';
                                                background = 'primary-dark'; 
                                            } else if (item.status == 2) {
                                                status = 'Não tem';
                                                cor = 'text-dark';
                                                background = 'dark'; 
                                            } else if (item.status == 3) {
                                                status = 'C/ com Atraso';
                                                cor = 'text-warning';
                                                background = 'warning'; 
                                            } else if (item.status == 4) {
                                                status = 'Adiado';
                                                cor = 'text-secondary';
                                                background = 'secondary'; 
                                            }
                                        }

                                // STATUS DO CHAMADOS
                                if (props.chamados) {
                                    if (item.status === 0 && !item.recebido && !item.id_usuario) {
                                        status = 'Na fila';
                                        cor = '';
                                    } else if (item.status === 0 && item.recebido && !item.id_usuario) {
                                        status = 'Recebido';
                                        cor = '';
                                    } else if (item.status === 0 && item.recebido && item.id_usuario) {
                                        status = 'Em andamento';
                                        cor = '';
                                    } else if (item.tipo_fase === 'Check') {
                                        status = 'Check';
                                        cor = '';
                                    } else if (item.tipo_fase === 'Pós-venda' && !item.avaliacao) {
                                        status = 'Pós-venda';
                                        cor = '';
                                    } else if (item.tipo_fase === 'Pós-venda' && item.avaliacao) {
                                        status = 'Finalizado';
                                        cor = '';
                                    }

                                    if(item?.status_nome=='Em aberto'){
                                        cor = '';
                                        background = 'secondary'; 
                                    }else if(item?.status_nome=='Avaliado'){
                                        cor = 'white';
                                        background = 'success'; 
                                    }else if(item?.status_nome=='Recusado'){
                                        cor = 'text-danger';
                                        background = 'danger'; 
                                    }else if(item?.status_nome=='Finalizado'){
                                        cor = 'text-primary';
                                        background = 'primary-dark'; 
                                    }
                                }

                                    // INTEGRAÇÕES
                                    let integrations = '';
                                    item?.id_apl.split(',').map((integration, i) => {
                                        if (integration == 223) {
                                            if (!integrations.includes('Jobs')) {
                                                integrations += 'Jobs, ';
                                            }
                                        } else if (integration == 224) {
                                            if (!integrations.includes('Chamados')) {
                                                integrations += 'Chamados, ';
                                            }
                                        } else if (integration == 225) {
                                            if (!integrations.includes('Fases')) {
                                                integrations += 'Fases, ';
                                            }
                                        } else if (integration == 226) {
                                            if (!integrations.includes('Visitas')) {
                                                integrations += 'Visitas, ';
                                            }
                                        } else if (integration == 227) {
                                            if (!integrations.includes('Obras')) {
                                                integrations += 'Obras, ';
                                            }
                                        } else if (integration == 229) {
                                            if (!integrations.includes('Comunicados')) {
                                                integrations += 'Comunicados, ';
                                            }
                                        }
                                    });

                                    if (integrations) {
                                        integrations = integrations.slice(0, -2); 
                                    }

                                    //  DIAS NA FILA         
                                    let dias_aux = '';
                                    
                                    if(item?.dias){
                                        dias_aux = item?.dias
                                    }else{
                                        if(item?.dataHora_realizacao){
                                            dias_aux = (diffDays(item?.dataHora_realizacao, item?.data.slice(0,10)+' 00:00:00') - 1);
                                        }else{
                                            dias_aux = (diffDays(window.currentDate, item?.data.slice(0,10)+' 00:00:00') - 1);
                                        }
                                    }                                   

                                    return (
                                        <>
                                            <Tr key={'lista_' + item.id_job_status + '_' + i}>

                                                <Td title={item.id_job_status.padStart(5, "0")}>
                                                    {item.id_job_status.padStart(5, "0")}
                                                </Td>

                                                {(conf_modulo && (props.fases || props.chamados) ?
                                                    <Td title={item?.modulo}>
                                                        {item?.modulo}
                                                    </Td>
                                                : '')}

                                                {(props.chamados && conf_urgente ?
                                                    <Td>
                                                        {item.urgente ? "Sim" : "Não"}
                                                    </Td>
                                                :'')}

                                                {(window.rs_id_grupo > 0 || (window.rs_id_emp == 26 && window.rs_sistema_id == global.sistema.manutencao_madnezz) ?
                                                    <Td title={item?.nome_emp_cad}>
                                                        {item.nome_emp_cad}
                                                    </Td>
                                                :'')}

                                                {(window.rs_id_emp == 26 && window.rs_sistema_id == global.sistema.manutencao_madnezz ?
                                                    <Td title={item?.nome_cliente}>
                                                        {item.nome_cliente}
                                                    </Td>
                                                :'')}

                                                {(props?.chamados && conf_loja_solicitante ?
                                                    <Td title={item?.nome_loja_cad}>
                                                        {item?.nome_loja_cad}
                                                    </Td>
                                                : '')}

                                                {(props?.chamados && conf_usuario_solicitante ?
                                                    <Td title={item?.nome_usuario_cad}>
                                                        {item?.nome_usuario_cad}
                                                    </Td>
                                                : '')}

                                                <Td align="center" title={(item.data ? get_date('date', item.data, 'date_sql') : '')}>
                                                    {(item.data ? get_date('date', item.data, 'date_sql'): '')}
                                                </Td>

                                                <Td align="center" title={(item?.dataHora_realizacao ? get_date('datetime', item?.dataHora_realizacao, 'datetime_sql') : '')}>
                                                    {(item?.dataHora_realizacao ? get_date('datetime', item?.dataHora_realizacao, 'datetime_sql') : '-')}
                                                </Td>

                                                {(props.chamados ?
                                                    <Td align="center" title={(dias_aux == 0 ? '0 dias' : (dias_aux < 0 ? 'Agendado' : (dias_aux + (dias_aux == 1 ? ' dia' : ' dias'))))}>
                                                        {(dias_aux == 0 ? '0 dias' : (dias_aux < 0 ? 'Agendado' : (dias_aux + (dias_aux === 1 ? ' dia' : ' dias'))))}
                                                    </Td>
                                                : '')}

                                                {(conf_titulo ?
                                                    <Td title={item?.titulo}>
                                                        {item.titulo}
                                                    </Td>
                                                :'')}

                                                <Td title={item?.descricao}>
                                                    {removeHTMLTags(item.descricao)}
                                                </Td>

                                                {(conf_categoria ?
                                                    <Td title={item?.categoria}>
                                                        {item.categoria}
                                                    </Td>
                                                :'')}

                                                {(window.rs_sistema_id == global.sistema.manutencao_madnezz ?
                                                    <Td title={item?.sistema_slc}>
                                                        {item.sistema_slc ? item.sistema_slc : '-'}
                                                    </Td>
                                                :'')}

                                                <Td title={item?.subcategoria}>
                                                    {item.subcategoria}
                                                </Td>

                                                {(!props.chamados && !props.fases && !props.visitas ?
                                                    <Td>
                                                        {item?.peso_subcategoria}
                                                    </Td>
                                                :'')}

                                                {(!props.chamados && !props.fases && !props.visitas ?
                                                    <Td title={integrations}>
                                                        {integrations}
                                                    </Td>
                                                :'')}

                                                {(!props.chamados ?
                                                    <Td
                                                        title={status}
                                                        className={cor}
                                                        boxed={{
                                                            background: background
                                                        }}
                                                    >
                                                        {status}
                                                    </Td>
                                                : '')}

                                                {(props.fases ?
                                                    <Td title={item.tipo_fase}>
                                                        {item.tipo_fase}
                                                    </Td>
                                                : '')}

                                            {(props.chamados ?
                                                <Td
                                                    title={item?.status_nome}
                                                    className={cor}
                                                    boxed={{
                                                        background: background
                                                    }}
                                                >
                                                    {item?.status_nome}
                                                </Td>
                                            : '')}

                                                {(!props.chamados && !props.fases ?
                                                    <Td>
                                                        {item.nome_loja}
                                                    </Td>
                                                : '')}

                                                {(conf_operador ?
                                                    <Td title={item?.nome_usuario}>
                                                        {item.nome_usuario}
                                                    </Td>                                                
                                                :'')}

                                                {(conf_checker ?
                                                    <Td title={item?.nome_usuario_sup}>
                                                        {item.nome_usuario_sup}
                                                    </Td>                                                
                                                :'')}

                                                {(conf_checker ?
                                                    <Td title={(item?.dataHora_sup ? get_date('datetime', item?.dataHora_sup, 'datetime_sql') : '-')}>
                                                        {(item?.dataHora_sup ? get_date('datetime', item?.dataHora_sup, 'datetime_sql') : '-')}
                                                    </Td>                                                
                                                :'')}

                                                {(!props.chamados && !props.fases ?
                                                    <Td title={item?.sistema_job}>
                                                        {item.sistema_job}
                                                    </Td>
                                                    : '')}

                                                {(!props.chamados && !props.fases ?
                                                    <Td title={item?.frequencia}>
                                                        {item.frequencia}
                                                    </Td>
                                                    : '')}

                                                {(!props.chamados && !props.fases ?
                                                    <Td title={item?.hora_limite_formatada}>
                                                        {item.hora_limite_formatada}
                                                    </Td>
                                                    : '')}

                                                {(!props.chamados ?
                                                    <Td title={item?.id_job_status_parent}>
                                                        {item?.job_parent}
                                                        {(item?.id_job_parent ?
                                                            <span className="text-secondary"> ({item?.id_job_status_parent})</span>
                                                            : '')}
                                                    </Td>
                                                    : '')}

                                                {(props.chamados ?
                                                    <Td align="center" title={item?.avaliacao}>
                                                        {item.avaliacao}
                                                    </Td>
                                                    : '')}

                                                <Td
                                                    width={1}
                                                    align="center"
                                                    className="hide_print"
                                                >
                                                    <ModalListaJob
                                                        id={item.id_job_status}
                                                        fases={props.fases}
                                                        chamados={props.chamados}
                                                        refreshCard={handleRefreshCard}
                                                        optionsModule={optionsModule}
                                                    />
                                                </Td>
                                            </Tr>
                                        </>
                                    )
                                })
                                : <></>)}
                            </Tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
    
}