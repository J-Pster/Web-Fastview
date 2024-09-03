import { useState, useEffect, useContext, cloneElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { addDays, get_date } from "../../../_assets/js/global";
import style from './Qtd/quantidade.module.scss';

import SelectReact from "../../../components/body/select";
import Input from "../../../components/body/form/input";
import FilterCheckbox from "../../../components/body/filterCheckbox";
import Counter from '../../../components/body/counter';

import { GlobalContext } from "../../../context/Global";
import { JobsContext } from "../../../context/Jobs";
import PageError from "../../../components/body/pageError";
import Jobs from "./Jobs";
import Visitas from "./Visitas";
import Chamados from "./Chamados";
import Fases from "./Fases";
import { toast } from "react-hot-toast";
import Quantidade from "./Qtd";
import Button from "../../../components/body/button";
import Icon from "../../../components/body/icon";
import Modal from "../../../components/body/modal";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../components/body/modal/modalBody";
import Form from "../../../components/body/form";
import RelatorioEmail from "./Fases/RelatorioEmail";
import { useCookies } from "react-cookie";
import Alert from "../../../components/body/alert";

export default function Calendario(props) {
  const navigate = useNavigate();

  // PARAMS
  const params = useParams();

  // CONTEXT GLOBAL
  const { refresh, refreshCalendar, loadingCards, handleSetCardExternal, loadingCalendar, handleSetFilter, handleSetPrevIndex, filterModule, handleSetFilterModule, firstLoad, handleSetFirstLoad, handleSetDisabledFilter, disabledFilter } = useContext(GlobalContext);

  // CONTEXT JOBS
  const { handleSetFilterEmpreendimento, filterEmpreendimento, handleSetAutoSwiper, configuracoes, idUsuarioEmpresas, smallCard, handleSetSmallCard, permissaoPedidos } = useContext(JobsContext);

  var date = new Date();

  // HABILITA O LOAD DO RELATÓRIO NOVAMENTE
  useEffect(() => {
    handleSetFilter(true);
  }, []);

  // CONFIGURAÇÕES
  let conf_quantidade_modulos = true;
  let conf_filtro_tipo_operador = true;
  let conf_default_screen;

  // CONFIGURAÇÕES
  if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar){
    let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar;

    if(JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filterModule).length > 0){
      json_aux = JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filterModule)[0]?.values;

      // CONFIGURAÇÃO DE QUANTIDADE DE MÓDULOS
      if(json_aux.filter((elem) => elem.nome === 'quantidade_modulos').length > 0){
        if(json_aux.filter((elem) => elem.nome === 'quantidade_modulos')[0]?.value == 1){
          conf_quantidade_modulos = false;
        }else{
          conf_quantidade_modulos = true;
        }
      }

      // CONFIGURAÇÃO FILTRO TIPO OPERADOR
      if(json_aux.filter((elem) => elem.nome === 'filtro_tipo_operador').length > 0){
        if(json_aux.filter((elem) => elem.nome === 'filtro_tipo_operador')[0]?.value == 1){
          conf_filtro_tipo_operador = false;
        }else{
          conf_filtro_tipo_operador = true;
        }
      }
    }
  }

  if(configuracoes?.filter((elem) => elem.conf_tipo === 'preferencias')[0]?.conf_configuracao && !props?.chamados && !props?.fases && !props?.visitas && !props?.comunicados){
    // VERIFICA SE TEM PREFERÊNCIA DO USUÁRIO, SE NÃO, PEGA O DO EMPREENDIMENTO/GRUPO
    let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'preferencias');

    if(json_aux.filter((elem) => elem.id_usr && elem.id_usr == global.rs_id_usr).length > 0){
      json_aux = json_aux.filter((elem) => elem.id_usr)[0]?.conf_configuracao;
      conf_default_screen = JSON.parse(json_aux)?.default_screen;
    }else{
        if(json_aux.filter((elem) => elem?.id_emp == window?.rs_id_emp).length > 0){
            json_aux = json_aux[0]?.conf_configuracao;
            conf_default_screen = JSON.parse(json_aux)?.default_screen;
        }          
    }        
  }

  // DEFINE VALOR DE INÍCIO INICIAL DO CALENDÁRIO
  const periodStartInitial = () => {
    if (params['periodStart'] && params['periodStart'] != 0) {
      return new Date(get_date('date_sql', get_date('date_sql', params['periodStart'], 'date_sql_reverse'), 'date_add_day', 1));
    }else{
      if (props?.widget) {
        return new Date();
      } else {
        if (!props.chamados && !props.fases) { // SE FOR JOBS
          if (props.visitas) {
            return '';
          } else {
            if ((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && params['view'] != 1) {
              return new Date();
            } else {
              return new Date(get_date('date_sql', (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()), 'date_sub_day', 15));
            }
          }
        } else { // QUALQUER OUTRO SISTEMA ALÉM DE JOBS
          return '';
        }
      }
    }
  }

  // DEFINE VALOR FINAL INICIAL DO CALENDÁRIO
  const periodEndInitial = () => {
    if (params['periodEnd'] && params['periodEnd'] != 0) {
      return new Date(get_date('date_sql', get_date('date_sql', params['periodEnd'], 'date_sql_reverse'), 'date_add_day', 1));
    }else{
      if (props?.widget) {
        return new Date();
      } else {
        if (!props.chamados && !props.fases) { // SE FOR JOBS
          if (props.visitas) {
            return '';
          } else {
            if ((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && params['view'] != 1) {
              return new Date();
            } else {
              return new Date(get_date('date_sql', (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()), 'date_add_day', 15));
            }
          }
        } else { // QUALQUER OUTRO SISTEMA ALÉM DE JOBS
          return '';
        }
      }
    }
  }

  // DEFINE TIPO DO CALENDÁRIO INICIAL
  const tipoCalendarioInitial = () => {    
    if (params['view'] && params['view'] != 0) {
      return Number(params['view']);
    }else{
      if(conf_default_screen && window.rs_permission_apl !== 'lojista'){
        return conf_default_screen;
      }else{
        if((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && !props.chamados && !props.fases && !props.visitas){
          if(props?.widget){
            return 1;
          }else{
            return 2;
          }
        }else{
          return 1;
        }
      }
    }
  }

  // DEFINE SUBTIPO DO CALENDÁRIO INICIAL
  const subTipoCalendarioInitial = () => {
    if(window.rs_id_lja && window.rs_id_lja > 0){
      return 'user'; // PROVISÓRIO ATÉ ALGUÉM RECLAMAR
    }else{
      return 'user';  
    }
  }

  // DEFINE USUÁRIO INICIAL DO FILTRO
  const filterUserInitial = () => {
    if(props?.widget){
      return window.rs_id_usr;
    }else{
      if(props.chamados){
        return '';
      }else if(props.fases){
        if(window.rs_permission_apl !== 'master' && window.rs_permission_apl !== 'supervisor'){
          return (Array.isArray(window.rs_id_usr) ? window.rs_id_usr : [window.rs_id_usr]);
        }else{
          return '';
        }
      }else if(props.visitas){
        return window.rs_id_usr;
      }else{
        if(tipoCalendario == 1 && (!window.rs_id_lja || window.rs_id_lja == 0) && (!params['store'] || params['store'] == 0)){
          return (Array.isArray(window.rs_id_usr) ? window.rs_id_usr : [window.rs_id_usr]);
        }else{
          return '';
        } 
      }
    }
  }

  // DEFINE LOJA INICIAL DO FILTRO
  const filterStoreInitial = () => {
    if (params['store'] && params['store'] != 0 && (!window.rs_id_lja || window.rs_id_lja == 0)) {
      return params['store'];
    }else{
      if(props.chamados){
        return '';
      }else if(props.visitas){
        return '';
      }else{
        if((window.rs_permission_apl !== 'supervisor' && window.rs_permission_apl !== 'leitura' && window.rs_permission_apl !== 'master')){
          return window.rs_id_lja;        
        }else{                
          return '';
        }
      }
    }
  }

  // DEFINE CARGO INICIAL DO FILTRO
  const filterOfficeInitial = () => {
    if (params['office'] && params['office'] != 0) {
      return params['office'];
    }else{
      return '';
    }
  }

  // DEFINE DEPARTAMENTO INICIAL DO FILTRO
  const filterDepartmentInitial = () => {
    if (params['department'] && params['department'] != 0) {
      return params['department'];
    }else{
      return '';
    }
  }

  // DEFINE STATUS INICIAL DO FILTRO
  const filterStatusInitial = () => {
    if(params['status']){
      return [params['status']];
    }else{
      return [];
    }
  }

  // DEFINE CATEGORIA INICIAL DO FILTRO
  const filterCategoryInitial = () => {
    if(params['category']){
      return [params['category']];
    }else{
      return [];
    }
  }

  // DEFINE VALOR INICIAL DO DISPARO DE E-MAIL
  const emailAvulsoInitial = () => {
    return [];
  }

  // ESTADOS
  // var loading;  
  const [layout] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [jobsCols, setJobsCols] = useState([]);
  const [jobsColsAux, setJobsColsAux] = useState([]);
  const [periodStart, setPeriodStart] = useState(periodStartInitial);
  const [periodEnd, setPeriodEnd] = useState(periodEndInitial);
  const [tipoCalendario, setTipoCalendario] = useState(tipoCalendarioInitial);
  const [subTipoCalendario, setSubTipoCalendario] = useState(subTipoCalendarioInitial);
  const [lojaTipo, setLojaTipo] = useState(1);
  const [loja, setLoja] = useState(filterStoreInitial);
  const [usuario, setUsuario] = useState(filterUserInitial);
  const [cargo, setCargo] = useState(filterOfficeInitial);
  const [departamento, setDepartamento] = useState(filterDepartmentInitial);
  const [optionsModule, setOptionsModule] = useState([]);  
  const [optionsModuleUnfiltered, setOptionsModuleUnfiltered] = useState([]);
  const [multipleModules, setMultipleModules] = useState([]);  
  const [changeLayout, setChangeLayout] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [createNew, setCreateNew] = useState(true);
  const [page, setPage] = useState(0);
  const [reloadInternal, setReloadInternal] = useState(false);
  const [changePeriod, setChangePeriod] = useState(false);
  const [changeModule, setChangeModule] = useState(false);
  const [changeStore, setChangeStore] = useState(false);
  const [changeUser, setChangeUser] = useState(false);
  const [changeOffice, setChangeOffice] = useState(false);
  const [changeDepartment, setChangeDepartment] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [prepend, setPrepend] = useState(false);
  const [cardsLength, setCardsLength] = useState([]);
  const [checkStep, setCheckStep] = useState(false);
  const [operatorStep, setOperatorStep] = useState(false);
  const [firstCount, setFirstCount] = useState(true);
  const [currentCardsLength, setCurrentCardsLength] = useState(0);
  const [changeFilter, setChangeFilter] = useState(false);
  const [cardsOpened, setCardsOpened] = useState([]);
  const [permission, setPermission] = useState(null);
  const [optionsClientes, setOptionsClientes] = useState([]);
  const [showModalEmail, setShowModalEmail] = useState(false);
  const [countEmailAvulso, setCountEmailAvulso] = useState(1);
  const [emailAvulso, setEmailAvulso] = useState(emailAvulsoInitial);
  const [buttonEmailAvulso, setButtonEmailAvulso] = useState(null);

  // FILTROS
  const [filterSystemManutencao, setFilterSystemManutencao] = useState([]);
  const [filterCategory, setFilterCategory] = useState(filterCategoryInitial);
  const [filterFrequency, setFilterFrequency] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [filterSystem, setFilterSystem] = useState([]);
  const [filterMonth, setFilterMonth] = useState((props.visitas ? window.currentMonth : ''));
  const [filterYear, setFilterYear] = useState((props.visitas ? window.currentYear : ''));
  const [filterStatus, setFilterStatus] = useState(filterStatusInitial);
  const [filterSupervisor, setFilterSupervisor] = useState([]);
  const [filterModelo, setFilterModelo] = useState(false);
  const [filterAll,] = useState('');
  const [filterArchived, setFilterArchived] = useState(2);
  const [filterPriority, setFilterPriority] = useState(1);
  const [filterView, setFilterView] = useState(1);
  const [filterClient, setFilterClient] = useState([]);

  // BUSCA NÚMEROS DE CARDS EM CADA MÓDULO
  function get_cardsLength(){
    axios({
      method: 'get',
      url: window.host_madnezz+'/systems/integration-react/api/request.php',
      params: {
        db_type: 'sql_server',
        type: 'Job',
        do: 'getModuleJobsCount',
        id_apl: window.rs_id_apl
      }
    }).then((response) => {
      if(response?.data?.data){
        setCardsLength(response?.data?.data);
      }
    });
  }

  // let loadModules = true;
  // useEffect(() => {
  //   loadModules = true;
  // },[]);

  // FUNÇÃO PARA BUSCAR MÓDULOS
  useEffect(() => {
    if((window.rs_sistema_id == global.sistema.manutencao_madnezz && idUsuarioEmpresas) || window.rs_sistema_id != global.sistema.manutencao_madnezz || window?.location?.origin?.includes('madnezz') || window?.location?.origin?.includes('localhost')){
      if(props?.chamados || props?.fases || props?.visitas){
        let table_aux;

        if(props.chamados){
          table_aux = 'moduleChamados';
        }else if(props.fases){
          table_aux = 'moduleFases';
        }

        if(props.visitas){
          handleSetFilterModule(global.modulo.visitas);
        }else{
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
              if(response.data[table_aux]){
                setOptionsModule(response?.data?.data[table_aux]);
              }            

              if(props.chamados){
                setOptionsModule(response?.data?.data[table_aux]?.filter((elem) => (elem?.permissao !== 'sem_acesso' && !window.rs_id_lja) || (elem?.permissao !== 'sem_acesso' && window.rs_id_lja > 0) || window.rs_permission_apl === 'master'));
              }else{
                setOptionsModule(response?.data?.data[table_aux]);
              }  

              let first_module_aux;

              if(props.chamados){
                // SE ESTIVER DENTRO DO SISTEMA MANUTENÇÃO, SETA O MÓDULO "MADNEZZ"
                if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
                  let manutencao_aux;

                  if(window?.location?.origin.includes('fastview')){
                    manutencao_aux = global.modulo.manutencao_fastview;
                  }else if(window?.location?.origin.includes('malltech')){
                    manutencao_aux = global.modulo.manutencao_malltech;
                  }else{
                    if(window.rs_id_emp == 26){
                      manutencao_aux = global.modulo.manutencao_madnezz;
                    }else{
                      manutencao_aux = global.modulo.manutencao_madweb;
                    }
                  }

                  if(response?.data?.data[table_aux].filter((elem) => elem?.id == manutencao_aux)[0]?.permissao !== 'sem_acesso'){
                    first_module_aux = response?.data?.data[table_aux].filter((elem) => elem?.id == manutencao_aux)[0];
                  }else{
                    first_module_aux = response?.data?.data[table_aux].filter((elem) => elem?.permissao !== 'sem_acesso')[0];
                  }
                }else{
                  first_module_aux = response?.data?.data[table_aux].filter((elem) => (elem?.permissao !== 'sem_acesso' && !window.rs_id_lja) || (elem?.permissao !== 'sem_acesso' && window.rs_id_lja > 0) || window.rs_permission_apl === 'master')[0];
                }
              }else{
                first_module_aux = response?.data?.data[table_aux][0];
              }

              if(first_module_aux){
                handleSetFilterModule((first_module_aux ? first_module_aux.id : 0)); // SELECIONA O PRIMEIRO (CASO TENHA) COMO PADRÃO AO CARREGAR A PÁGINA
              }else{
                setPageError(true);
              }            
            }else{
              if(props.chamados || props.fases){
                setPageError(true);
              }
            }
          });
        }
      }
    }
  },[idUsuarioEmpresas]);

  // VARIÁVEL AUXILIAR PARA OS FILTROS
  global.filter_aux;

  // FUNÇÃO PARA LISTAR CARDS
  function loadCalendar(loading, swiper, id_group='', reload=undefined, refresh=undefined, filter_id_module, options_module_aux) {
    if(loading){
      loadingCalendar(true);
      handleSetAutoSwiper(true);
    }
    if(!swiper && loading){
      setJobs([]);
    }
    
    if((!props.chamados && !props.visitas && !props.fases) || (((props.chamados || props.visitas || props.fases) && (filterModule || filter_id_module)))){
      handleSetDisabledFilter(true); // DESABILITA OS FILTROS ENQUANTO CHAMA A REQUISIÇÃO

      // DEFINE A PAGE
      let page_aux;
      if(!props.chamados && !props.fases && !props.visitas){ // SE FOR SISTEMA JOBS
        if(tipoCalendario == 2 || tipoCalendario == 4){ // SE FOR TIPO LOJA (2) OU USUÁRIO (4)
          if(loading){
            page_aux = 0;
          }else{
            if(reload){
              page_aux = 0;
            }else{
              if(refresh){
                page_aux = 0;
              }else{
                page_aux = page;
              }
            }
          }
        }else{
          page_aux = undefined;
        }
      }else{
        page_aux = undefined;
      }

      // DEFINE LIMIT
      let limit_aux;
      let limit = 10;
      if(!props.chamados && !props.fases && !props.visitas){ // SE FOR SISTEMA JOBS
        if(tipoCalendario == 2 || tipoCalendario == 4){ // SE FOR TIPO LOJA (2) OU USUÁRIO (4)
          if(refresh){
            limit_aux = (page > 2 ? ((page - 1) * limit) : limit)
          }else{
            limit_aux = limit
          }
        }else if(tipoCalendario == 3){ // SE FOR TIPO PAINEL (3)
          limit_aux = 500;
        }else{
          limit_aux = undefined;
        }
      }else{
        limit_aux = undefined;
      }

      // VERIFICA SE RECEBEU ARRAY COM ID DE MÓDULOS
      let filter_id_module_aux = [];

      if(filter_id_module){
        filter_id_module_aux = filter_id_module;
      }else{
        filter_id_module_aux = [filterModule];
      }

      // PERCORRE ID DE MÓDULOS FAZENDO REQUISIÇÃO
      setJobsColsAux([]);

      // TYPE AUX
      let type_aux = '';

      if(props.chamados || props.fases || props.visitas){
        type_aux = 'phase';
      }else{        
        if(tipoCalendario == 1){
          type_aux = 'date';
        }else if(tipoCalendario == 2){
          type_aux = 'store';
        }else if(tipoCalendario == 3){
          type_aux = 'panel';
        }else if(tipoCalendario == 4){
          type_aux = 'user';
        }else if(tipoCalendario == 7){
          type_aux = 'frequency';
        }else if(tipoCalendario == 9){
          type_aux = 'model';
        }else if(tipoCalendario == 10){
          type_aux = 'office';
        }else if(tipoCalendario == 11){
          type_aux = 'department';
        }else{
          type_aux = tipoCalendario;
        }
      }

      // SUBTYPE AUX
      let subtype_aux = undefined;
      if(props.chamados || type_aux === 'panel' || type_aux === 'date'){
        if(type_aux === 'date'){
          if(usuario.length > 0 || usuario){
            subtype_aux = 'user';
          }else{
            subtype_aux = 'store';
          }
        }else{
          if(subTipoCalendario){
            subtype_aux = subTipoCalendario;
          }else{
            subtype_aux = undefined;
          }
        }
      }else if(props?.fases && filterModule && filterView !== 1){
        subtype_aux = 'emailReport';
      }

      // FILTER ID APL AUX
      let filter_id_apl_aux = [];

      if(type_aux === 'frequency' || type_aux === 'model'){
        filter_id_apl_aux = [];
      }else{
        if(props.chamados){
          filter_id_apl_aux = [224];
        }else if(props.fases){
          filter_id_apl_aux = [225];
        }else if(props.visitas){
          filter_id_apl_aux = [226];
        }else{
          filter_id_apl_aux = [223, 229, 231];
        }
      }    

      // SÓ FAZ A REQUISIÇÃO DOS CARDS SE NÃO ESTIVER EM CHAMADOS, OU ESTIVER EM CHAMADOS COM PERMISSÃO AO MÓDULO
      let filter_module_aux;

      if(filter_id_module){
        filter_module_aux = filter_id_module[0];
      }else{
        filter_module_aux = filterModule;
      }
      
      if(!props.chamados || (props.chamados && (options_module_aux ? options_module_aux : optionsModule).filter((elem) => elem.id == filter_module_aux)[0]?.permissao !== 'sem_acesso')){    
        if(props.chamados){
          if((options_module_aux ? options_module_aux : optionsModule).filter((elem) => elem.id == filter_module_aux)[0]?.permissao === null){
            setPermission(window.rs_permission_apl);
          }else{
            setPermission((options_module_aux ? options_module_aux : optionsModule).filter((elem) => elem.id == filter_module_aux)[0]?.permissao);
          }
          
          if(props.permission){
            if((options_module_aux ? options_module_aux : optionsModule).filter((elem) => elem.id == filter_module_aux)[0]?.permissao === null){
              props.permission(window.rs_permission_apl);
            }else{
              props.permission((options_module_aux ? options_module_aux : optionsModule).filter((elem) => elem.id == filter_module_aux)[0]?.permissao);
            }
          }
        }else{
          setPermission(true);

          if(props.permission){
            props.permission(true);
          }
        }

        filter_id_module_aux.map((id_modulo) => {
          // FILTROS DA REQUISIÇÃO
          global.filter_aux = {
            filter_month: (filterMonth ? filterMonth : undefined),
            filter_year: (filterYear ? filterYear : undefined),
            filter_id_system_slc: filterSystemManutencao,
            filter_id_category: (filterCategory ? filterCategory : undefined),
            filter_id_subcategory: (filterSubCategory ? filterSubCategory : undefined),
            filter_system: (filterSystem ? filterSystem : undefined),
            filter_date_start: (periodStart ? get_date('date_sql', periodStart.toString(), 'new_date') : undefined),
            filter_date_end: (periodEnd ? get_date('date_sql', periodEnd.toString(), 'new_date') : undefined),
            filter_id_store: (loja ? loja : undefined),
            filter_id_frequency: (filterFrequency ? filterFrequency : undefined),
            filter_id_module: ((props.chamados || props.fases || props.visitas) && id_modulo && window.rs_permission_apl !== 'operador' ? id_modulo : undefined),
            filter_id_user: (!props.chamados && !props.fases ? (usuario ? (Array.isArray(usuario) ? usuario : [usuario]) : undefined) : undefined),
            filter_id_user_jlote: (props.fases ? (usuario ? usuario : undefined) : undefined),
            filter_id_office: (cargo ? cargo : undefined),
            filter_id_department: (departamento ? departamento : undefined),
            filter_id_group: (id_group ? id_group : undefined),
            filter_id_apl: filter_id_apl_aux,
            filter_type: type_aux,
            filter_subtype: (!props.chamados ? subtype_aux : undefined),
            filter_type_operator: (props.chamados && window.rs_permission_apl !== 'operador' ? subtype_aux : undefined),            
            filter_id_emp: (filterEmpreendimento ? filterEmpreendimento : undefined),
            filter_id_supervisor: (filterSupervisor ? filterSupervisor : undefined),
            filter_status: (filterStatus ? filterStatus : undefined),
            filter_model: (filterModelo ? 1 : undefined),
            filter_multiple_columns: (filterAll ? filterAll : undefined),
            filter_active_status: filterArchived == 2 ? [1] : [1,2],
            filter_priority: props.fases ? (filterPriority == 2 ? [7] : [7,'NULL',0]) : undefined,
            filter_id_client: filterClient,
          }

          // VARIÁVEL AUXILIAR DOS PARAMETROS DA REQUISIÇÕES PARA ADICIONARMOS OS FILTROS SEPARADAMENTE
          let params_request = {
            db_type: global.db_type,
            type: 'Job',
            do: 'getCard',
            page: page_aux,
            limit: limit_aux,
            id_apl: props?.id_apl,
            message_internal: props.fases ? 'last' : undefined
          }
          
          // JUNTA A VARIÁVEL DOS PARAMETROS COM AS DO FILTRO
          Object.assign(params_request, global.filter_aux);

          axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: params_request,
          }).then((response) => {
            // NOTIFICAÇÃO DE NOVOS CHAMADOS (MANUTENÇÃO MADNEZZ)
            if(global.sistema.manutencao == window.rs_sistema_id && window.rs_id_emp == 26){
              let filter_aux;

              if(window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master'){
                filter_aux = response?.data?.data.filter((elem) => elem.type_phase === 'Operação')[0].group.filter((elem) => elem.id == window.rs_id_usr)[0];
              }else{
                filter_aux = response?.data?.data.filter((elem) => elem.type_phase === 'Operação')[0].group[0];
              }     

              setCurrentCardsLength(filter_aux?.cards?.length);

              if(!firstCount){ // VERIFICA SE É A PRIMEIRA CONTAGEM
                // VERIFICA SE A QUANTIDADE DE CARDS QUE VIERAM DA API É MAIOR DO QUE A ÚLTIMA CONTAGEM
                if(filter_aux?.cards?.length > currentCardsLength){
                  if (Notification.permission === "granted") {
                    const notification = new Notification('Você possui um novo chamado na fila de manutenção');
                  }
                }
              }

              setFirstCount(false);
            }

            if(filter_id_module && (filter_id_module ? filter_id_module : multipleModules).length > 1){ // SE VIER O MÓDULO ESPEFICICADO, ADICIONA NA COLUNA CORRESPONDENTE
              setJobs(undefined);
              let label_aux = (options_module_aux ? options_module_aux : optionsModule)?.filter((elem) => elem.id == id_modulo)[0].label;
              let id_aux = (options_module_aux ? options_module_aux : optionsModule)?.filter((elem) => elem.id == id_modulo)[0].value;
              setJobsColsAux(jobsColsAux => [...jobsColsAux, {module: label_aux, id_module: id_aux, data: response?.data?.data}]);
            }else{
              setJobsCols(undefined);
              
              if(!props.chamados && !props.fases && !props.visitas){
                if(tipoCalendario == 1 && !loadingCards){ // TIPO CALENDARIO (1)
                  if(reload || refresh){
                    setJobs(response.data.data);
                  }else{
                    if(prepend){
                      setJobs(jobs => [...response.data.data, ...jobs]);
                    }else{
                      setJobs(jobs => [...jobs, ...response.data.data]);
                    }
                  }
                }else if((tipoCalendario == 2 || tipoCalendario == 4) && page > 0 && !loading && !refresh){ // SE FOR TIPO LOJA (2) OU TIPO USUÁRIO (4) E PAGE MAIOR QUE 0 INCREMENTA OS CARDS AO INVÉS DE SUBSTITUIR
                  setJobs(jobs => [...jobs, ...response.data.data]);
                }else{
                  if (response.data.data.length>0) {
                    setJobs(response.data.data);
                  } else {
                    setJobs([]);
                  }
                }
              }else{
                if (response.data.data.length>0) {
                  setJobs(response.data.data);
                } else {
                  setJobs([]);
                }
              }
            }
              // SETA FALSE NO ESTADO PREPEND PARA OS PRÓXIMOS ADICIONAR À FRENTE DOS JOBS JÁ EXISTENTES
              setPrepend(false);

              if(loading || refresh){
                if (response?.data?.data[0]?.page) {
                  setPage(response?.data?.data[0]?.page + 1);
                } else {
                  setPage(1);
                }
              }else{
                if(!reload){
                  if(response?.data?.data[0]?.page){
                    setPage(response?.data?.data[0]?.page + 1);
                  }else{
                    if(response?.data?.data.length >= limit){
                      setPage(page + 1);
                    }
                  }
                }   
              }

              setTimeout(() => {
                loadingCalendar(false);
              },500);

              // CHECA SE O USUÁRIO POSSUI CARDS EM PÓS-VENDA (CHAMADOS)
              if(response.data && props.chamados){   
                let array = response?.data?.data?.findIndex((elem) => elem.type_phase === 'Pós-venda');

                if(array !== -1){
                  if(response?.data?.data[array].group[0]?.cards.length){
                    setCreateNew(false);
                  }else{
                    setCreateNew(true);
                  }
                }
              }

              // RESETA ESTADOS
              setChangePeriod(false);
              setChangeStore(false);
              setChangeUser(false);
              setChangeOffice(false);
              setChangeDepartment(false);

            handleSetDisabledFilter(false); // REABILITA OS FILTROS ENQUANTO CHAMA A REQUISIÇÃO
            setLoaded(true);

            // VERIFICA SE O CHAMADOS TEM FILA DE OPERAÇÃO
            let operatorStep_aux = false;
            response?.data?.data.map((item, i) => {
              if(item?.type_phase === 'Operação'){
                operatorStep_aux = true;
              }
            });
            setOperatorStep(operatorStep_aux);

              // VERIFICA SE O CHAMADOS TEM FILA DE CHECK
              let checkStep_aux = false;
              response?.data?.data.map((item, i) => {
                if(item?.type_phase === 'Check'){
                  checkStep_aux = true;
                }
              });
              setCheckStep(checkStep_aux);
          }).catch(() => {
            // handlePageError(true);
            setLoaded(true);
          });
        });
      }else{
        setPageError(true);
        setPermission(false);

        if(props.permission){
          props.permission(false);
        }
        handleSetDisabledFilter(false);
      }

      // BUSCA NÚMERO DE CARDS EM CADA MÓDULO
      if (conf_quantidade_modulos && !global.modulo.manutencao?.includes(parseInt(filterModule)) && props?.chamados && (window.rs_id_lja == 0 || !window.rs_id_lja) && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master')) {
        get_cardsLength();
      }
    }
    
    handleSetFirstLoad(false);
  }

  // BUSCA MÓDULOS
  useEffect(() => {
    setPageError(false);
    
    if(configuracoes){      
      if(optionsModule.length == 0 && (props?.chamados || props?.fases || props?.visitas)){
        let table_aux;

        if(props.chamados){
          table_aux = 'moduleChamados';
        }else if(props.fases){
          table_aux = 'moduleFases';
        }

        if(props.visitas){
          handleSetFilterModule(global.modulo.visitas);
        }else{
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
                  id_emp: filterEmpreendimento,
                  sistema_id: window.rs_sistema_id
                }
              }]
            }
          }).then((response) => {
            let options_module_aux;
            if(response.data){
              if(response.data[table_aux]){
                setOptionsModule(response?.data?.data[table_aux]);
              }          

              if(props.chamados){
                setOptionsModule(response?.data?.data[table_aux].filter((elem) => (elem?.permissao !== 'sem_acesso' && !window.rs_id_lja) || (elem?.permissao !== 'sem_acesso' && window.rs_id_lja > 0) || window.rs_permission_apl === 'master'));
                setOptionsModuleUnfiltered(response?.data?.data[table_aux]);
                options_module_aux = response?.data?.data[table_aux].filter((elem) => (elem?.permissao !== 'sem_acesso' && !window.rs_id_lja) || (elem?.permissao !== 'sem_acesso' && window.rs_id_lja > 0) || window.rs_permission_apl === 'master');
              }else{
                setOptionsModule(response?.data?.data[table_aux]);
                options_module_aux = response?.data?.data[table_aux];
              }

              let first_module_aux
              if(props.chamados){
                // SE ESTIVER DENTRO DO SISTEMA MANUTENÇÃO, SETA O MÓDULO "MADNEZZ"
                if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
                  let manutencao_aux;

                  if(window?.location?.origin.includes('fastview')){
                      manutencao_aux = global.modulo.manutencao_fastview;
                  }else if(window?.location?.origin.includes('malltech')){
                      manutencao_aux = global.modulo.manutencao_malltech;
                  }else{
                    if(window.rs_id_emp == 26){
                      manutencao_aux = global.modulo.manutencao_madnezz;
                    }else{
                      manutencao_aux = global.modulo.manutencao_madweb;
                    }
                  }

                  if(response?.data?.data[table_aux].filter((elem) => elem?.id == manutencao_aux)[0]?.permissao !== 'sem_acesso'){
                    first_module_aux = response?.data?.data[table_aux].filter((elem) => elem?.id == manutencao_aux)[0];
                  }else{
                    first_module_aux = response?.data?.data[table_aux].filter((elem) => elem?.permissao !== 'sem_acesso')[0];  
                  }
                }else{
                  first_module_aux = response?.data?.data[table_aux].filter((elem) => (elem?.permissao !== 'sem_acesso' && !window.rs_id_lja) || (elem?.permissao !== 'sem_acesso' && window.rs_id_lja > 0) || window.rs_permission_apl === 'master')[0];
                }
              }else{
                first_module_aux = response?.data?.data[table_aux][0];
              }

              if(first_module_aux){
                handleSetFilterModule((first_module_aux ? first_module_aux.id : 0)); // SELECIONA O PRIMEIRO (CASO TENHA) COMO PADRÃO AO CARREGAR A PÁGINA
              }else{
                setPageError(true);
              }   
            }else{
              if(props.chamados || props.fases){
                setPageError(true);
              }
            }

            // MÓDULOS QUE ABREM JUNTOS (CHAMADOS)  
            let modules_aux = [];    
            if(props.chamados){
              if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_multiple_col && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master')){
                let key_aux;

                if(key_aux !== undefined){
                  if(key_aux?.id_modulo != filterModule){
                    key_aux = undefined;
                  }
                }

                JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_multiple_col).map((item_conf, i_conf) => {                  
                  response?.data?.data[table_aux].map((item, i) => {
                    if(item_conf?.id_modulo.includes(item.id) && (key_aux?.index === i_conf || key_aux === undefined)){
                      modules_aux.push(item.id);
                      key_aux = {id_modulo: item_conf?.id_modulo, index: i_conf};
                    }
                  });

                  setMultipleModules(modules_aux);
                });
              }
            }

            // SE ALGUM CARD ESTIVER MAXIMIZADO ELE FECHA AQUI
            handleSetCardExternal({
              enabled: false
            });

            // FAZ A PRIMEIRA BUSCA DE CARDS PASSANDO O PRIMEIRO MÓDULO QUE RECEBE NA REQUISIÇÃO ACIMA
            if(props.chamados && sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
              let manutencao_aux;

              if(window.location.origin.includes('fastview')){
                manutencao_aux = global.modulo.manutencao_fastview;
              }else if(window.location.origin.includes('malltech')){
                manutencao_aux = global.modulo.manutencao_malltech;
              }else{
                if(window.rs_id_emp == 26){
                  manutencao_aux = global.modulo.manutencao_madnezz;
                }else{
                  manutencao_aux = global.modulo.manutencao_madweb;
                }
              }

              // CASO O USUÁRIO NÃO TENHA ACESSO A ALGUM DOS MÓDULOS ACIMA, SETA O PRIMEIRO DOS MÓDULOS QUE ELE TEM ACESSO
              if(options_module_aux?.filter((elem) => elem?.id == manutencao_aux).length == 0){
                manutencao_aux = options_module_aux[0]?.id;
              }

              loadCalendar((refresh?.loading === false ? false : true), true, '', refresh?.reload, undefined, [manutencao_aux], response?.data?.data[table_aux]);
            }else{
              if(modules_aux.includes(response?.data?.data[table_aux][0]?.id)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
                loadCalendar(true, undefined, undefined, undefined, undefined, modules_aux, response?.data?.data[table_aux]);
              }else{              
                loadCalendar((refresh?.loading === false ? false : true), true, '', refresh?.reload, undefined, [options_module_aux[0].id], response?.data?.data[table_aux]);
              }
            }
          });
        }
      }
    }
  },[configuracoes]);  

  useEffect(() => {
    if(jobsColsAux.length == multipleModules.length){
      setJobsCols(jobsColsAux);
    }
  },[jobsColsAux]);

  // PRIMEIRA CHAMADA DOS CARDS
  useEffect(() => {
    loadingCalendar(true);

    // CASO SEJA CHAMADOS, FASES OU VISITAS, A PRIMEIRA REQUISIÇÃO É FEITA APÓS A REQUISIÇÃO DOS MÓDULOS, NÃO AQUI
    if(firstLoad){
      if(!props.chamados && !props.fases && !props.visitas){
        //FIXME
       
          loadCalendar((refresh?.loading === false ? false : true), true, '', refresh?.reload);
      }

      if(conf_default_screen && window.rs_permission_apl !== 'lojista' && !params['view']){
        if(conf_default_screen){
          if(!props.chamados && !props.fases && !props.visitas){
            handleSetTipoCalendario({value: conf_default_screen});
          }
  
          if(!firstLoad && !props.chamados && !props.fases && !props.visitas){
            setChangeFilter(true);
          }
        }
      }
    }
    
    if(params['view']){
      if(!props.chamados && !props.fases && !props.visitas){
        handleSetTipoCalendario({value: params['view']});
      }

      if(!firstLoad && !props.chamados && !props.fases && !props.visitas){
        setChangeFilter(true);
      }
    }
  },[params['view']]);

  // FUNÇÃO PARA FILTRAR SEMPRE QUE SELECIONAR ALGUM FILTRO
  useEffect(() => {
    if(changeFilter){
      // RESETA ESTADO DE CARD MAXIMIZADO
      handleSetCardExternal({
        enabled: false
      });
      handleSetPrevIndex('');

      if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(true, undefined, undefined, undefined, undefined, multipleModules);
      }else{
        loadCalendar(true);
      }

      if(tipoCalendario == 3){
        setChangeLayout(true)
      }else{
        setChangeLayout(false);
      } 

      setChangeFilter(false);
      setCardsOpened([]);
    }
  }, [changeFilter]);

  useEffect(() => {
    if(changeUser){
      // RESETA ESTADO DE CARD MAXIMIZADO
      handleSetCardExternal({
        enabled: false
      });

      if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(true, undefined, undefined, undefined, undefined, multipleModules);
      }else{
        loadCalendar(true);
      }

      setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
    }
  },[usuario]);

  useEffect(() => {
    if(changeStore){
      // RESETA ESTADO DE CARD MAXIMIZADO
      handleSetCardExternal({
        enabled: false
      });

      if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(true, undefined, undefined, undefined, undefined, multipleModules);
      }else{
        loadCalendar(true);
      }

      setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
    }
  },[loja]);

  useEffect(() => {
    if(changeOffice){
      // RESETA ESTADO DE CARD MAXIMIZADO
      handleSetCardExternal({
        enabled: false
      });

      if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(true, undefined, undefined, undefined, undefined, multipleModules);
      }else{
        loadCalendar(true);
      }

      setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
    }
  },[cargo]);

  useEffect(() => {
    if(changeDepartment){
      // RESETA ESTADO DE CARD MAXIMIZADO
      handleSetCardExternal({
        enabled: false
      });

      if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(true, undefined, undefined, undefined, undefined, multipleModules);
      }else{
        loadCalendar(true);
      }

      setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
    }
  },[departamento]);
  
  // FUNÇÃO PARA RESETAR FILTROS (NO MOMENTO SÓ UTILIZADA QUANDO TROCAMOS O FILTRO DE EMPREENDIMENTO)
  function resetFilter(){
    if(tipoCalendario == 2){ // SE FOR TIPO LOJA LIMPA O FILTRO DE LOJA
      setLoja([]);
    }

    if(tipoCalendario == 4){ // SE FOR TIPO USUÁRIO LIMPA O FILTRO DE USUÁRIO
      setUsuario([]);
    }

    if(tipoCalendario == 10){ // SE FOR TIPO CARGO LIMPA O FILTRO DE CARGO
      setCargo([]);
    }

    if(tipoCalendario == 11){ // SE FOR TIPO DEPARTAMENTO LIMPA O FILTRO DE DEPARTAMENTO
      setDepartamento([]);
    }

    if(tipoCalendario != 8){ // SE FOR DIFERENTE DE PLANO DE AÇÃO LIMPA O FILTRO DE CATEGORIA (PLANO DE AÇÃO TEM UMA CATEGORIA FIXA PRA TODOS OS EMPREENDIMENTOS)
      setFilterCategory([]);
    }

    setFilterSubCategory([]);
    setFilterFrequency([]);
    setFilterSystem([]);
  }

  // FUNÇÃO PARA FILTRAR SEMPRE QUE SELECIONAR ALGUM FILTRO
  useEffect(() => {
    if(!firstLoad && changePeriod){
      // RESETA ESTADO DE CARD MAXIMIZADO
      handleSetCardExternal({
        enabled: false
      });

      if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(true, undefined, undefined, undefined, undefined, multipleModules);
      }else{
        loadCalendar(true);
      }

      setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
    }
  }, [periodStart, periodEnd, changePeriod]);

  // FUNÇÃO PARA RECARREGAR CARD ESPECÍFICO
  function refreshCard(id_job_status){
    // VERIFICA SE O USUÁRIO ESTÁ NO FASES
    let id_apl_aux;

    if(props.fases){
      id_apl_aux = [223, 225]
    }else{
      id_apl_aux = window.rs_id_apl
    }

    axios({
      method: 'get',
      url: window.host_madnezz+'/systems/integration-react/api/request.php',
      params: {
        db_type: global.db_type,
        type: 'Job',
        do: 'getReport',
        filter_id_job_status: id_job_status,
        id_apl: id_apl_aux,
        message_internal: 'last'
      }
    }).then((response) => {
      //Atualiza a matriz com o registro novo

      if(jobsCols){
        jobsCols.filter((elem) => {
          return elem.data.filter((elem0) => {
            return elem0.group.filter((elem1) => {
              return elem1.cards.filter((elem2, idx) => {
                if (elem2.id_job_status == id_job_status) {
                  return Object.assign(elem2, response?.data?.data[0]);
                } else {
                  return false;
                }
              }).length > 0;
            }).length > 0;
          }).length > 0;
        });
      }else{
        jobs.filter((elem) => {
          return elem.group.filter((elem1) => {
            return elem1.cards.filter((elem2) => {
              if (elem2.id_job_status == id_job_status) {
                if(response?.data?.data?.filter((elem) => elem?.id_apl == window.rs_id_apl).length > 0){
                  return Object.assign(elem2, response?.data?.data?.filter((elem) => elem?.id_apl == window.rs_id_apl)[0]);
                }else{
                  return Object.assign(elem2, response?.data?.data[0]);
                }
              } else {
                return false;
              }
            }).length > 0;
          }).length > 0;
        });
      }

      // RECARREGA QUANTIDADE DE CARDS (CHAMADOS)
      if(props?.chamados){
        get_cardsLength();
      }

      setReloadInternal(true);
      setTimeout(() => {
        setReloadInternal(false);
      },1000);
    });
  }

  // FUNÇÃO PARA ENVIAR MENSAGEM
  function set_message(id_job_status, message){
    axios({
      method: 'post',
      url: window.host_madnezz+'/systems/integration-react/api/list.php?do=set_msg&filter_id_module='+filterModule,
      data: {
        ativ: 'Enviou uma mensagem',
        id_mov: id_job_status,
        ativ_desc: message,
        // anexos: anexos,
        // nivel_msg: (props?.data?.nivel_msg ? props.data.nivel_msg : '' )
      }
    }).then(() => {

    });
  }
  
  //OPTIONS DO SELECT TITLE
  var optionsTipos = [
    { value: 1, label: (props.chamados||props.fases?'Fila':'Calendário') }
  ];

  if(!props.chamados&&!props.fases){
    optionsTipos.push({value: 4, label: "Usuário"});
  }

  if(!props.chamados && !props.fases && !props.visitas){
    optionsTipos.push({value: 10, label: "Cargo"});
    optionsTipos.push({value: 11, label: "Departamento"});
  }

  if((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master')){
    if(!props.chamados && !props.fases){
      optionsTipos.push({ value: 7, label: "Frequência" });
      optionsTipos.push({ value: 2, label: "Loja" });
      optionsTipos.push({ value: 3, label: "Painel" });
      optionsTipos.push({ value: 8, label: "Plano de Ação" });
      optionsTipos.push({ value: 9, label: "Modelo" });
    }
  }

  const optionsSubtipos = [
    { value: 'user', label: (props?.chamados ? 'Operadores' : 'Usuários') },
    { value: 'store', label: "Lojas" },
  ];

  const optionsLojaTipos = [
    { value: 1, label: "Loja" },
    { value: 2, label: "Usuário" },
  ];

  // OPTIONS MESES
  const optionsMonths = [
    { value: 1, label: 'Janeiro'},
    { value: 2, label: 'Fevereiro'},
    { value: 3, label: 'Março'},
    { value: 4, label: 'Abril'},
    { value: 5, label: 'Maio'},
    { value: 6, label: 'Junho'},
    { value: 7, label: 'Julho'},
    { value: 8, label: 'Agosto'},
    { value: 9, label: 'Setembro'},
    { value: 10, label: 'Outubro'},
    { value: 11, label: 'Novembro'},
    { value: 12, label: 'Dezembro'}
  ]

  // OPTIONS ANO
  var optionsYear = [];
  for(var i=0; i<5; i++){
      optionsYear.push(
          {value: window.currentYear-i, label: window.currentYear-i}
      )
  }

  // OPTIONS CLIENTE
  useEffect(() => {
    if(props.fases && window.rs_id_emp == 26){
      axios({
        method: 'get',
        url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
        params: {
          db_type: global.db_type,
          do: 'getTable',
          tables: [
            {table: 'client'}
          ]
        }
      }).then((response) => {
        if(response?.data?.data){
          setOptionsClientes(response?.data?.data?.client);
        }
      })
    }
  },[]);

  // PRIMEIRA CHAMADA DOS CARDS
  useEffect(() => {
    if(optionsModule.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
      loadCalendar((refresh?.loading === false ? false : true), true, '', refresh?.reload, undefined, optionsModule);
    }else{
      //TODO
      if(!loadingCards)
        {
          loadCalendar((refresh?.loading === false ? false : true), true, '', refresh?.reload);
        }
    }

    setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
  },[refresh]);

  // CARREGA O CALENDÁRIO SEMPRE QUE O SWIPER É MODIFICADO
  useEffect(() => {
    if(!firstLoad){
      if(optionsModule.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
        loadCalendar(undefined, undefined, undefined, undefined, undefined, optionsModule);
      }else{
        loadCalendar();
      }
    }

    setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
  },[])

  // FILTRA LOJA
  const handleFilterStore = (selectedVals) => {
    setUsuario([]);
    setCargo([]);
    setDepartamento([]);
    setLoja(selectedVals);    
    setChangeStore(true);
  }

  // FILTRA USUÁRIO
  const handleFilterUser = (selectedVals) => {
    setLoja([]);
    setCargo([]);
    setDepartamento([]);
    setUsuario(selectedVals);
    setChangeUser(true);
  }

  // FILTRA CARGO
  const handleFilterOffice = (selectedVals) => {
    setLoja([]);    
    setDepartamento([]);
    setUsuario([]);
    setCargo(selectedVals);
    setChangeOffice(true);
  }

  // FILTRA DEPARTAMENTO
  const handleFilterDepartment = (selectedVals) => {
    setLoja([]);
    setCargo([]);    
    setUsuario([]);
    setDepartamento(selectedVals);
    setChangeDepartment(true);
  }

  // FILTRA SISTEMA MANUTENÇÃO
  const handleFilterSystemManutencao = (selectedVals) => {
    setFilterSystemManutencao(selectedVals);
  }

  // FILTRA CATEGORIA
  const handleFilterCategory = (selectedVals) => {
    setFilterCategory(selectedVals);
    setChangeFilter(true);
  }

  // FILTRA CLIENTE
  const handleFilterClient = (selectedVals) => {
    setFilterClient(selectedVals);
    setChangeFilter(true);
  }

  // FILTRA SUBCATEGORIA
  const handleFilterSubcategory = (selectedVals) => {
    setFilterSubCategory(selectedVals);
    setChangeFilter(true);
  }

  // FILTRA FREQUÊNCIA
  const handleFilterFrequency = (selectedVals) => {
    setFilterFrequency(selectedVals);
    setChangeFilter(true);
  }

  // FILTRA STATUS
  const handleFilterStatus = (selectedVals) => {
    setFilterStatus(selectedVals);
    setChangeFilter(true);
  }

  // FILTRA SUPERVISOR
  const handleFilterSupervisor = (selectedVals) => {
    setFilterSupervisor(selectedVals);
    setChangeFilter(true);
  }

  // FILTRA SISTEMA
  const handleFilterSystem = (selectedVals) => {
    setFilterSystem(selectedVals);
    setChangeFilter(true);
  }

  // DETECTA INÍCIO DO SWIPER
  function reachBeginning(){
    // if(!props.chamados && !props.visitas && !props.fases){
    //   if(tipoCalendario==1){
    //     if(!loadingCards){
    //       setPeriodStart(new Date(subDays(periodStart, 15)));
    //       setPeriodEnd(new Date(subDays(periodStart, 1)));
    //       setPrepend(true);
    //     }
    //   }
    // }
  }

  // DETECTA FIM DO SWIPER
  const reachEnd = () => {
    if(!props.chamados && !props.visitas && !props.fases){
      if(tipoCalendario==1){
        if(!loadingCards && !params['periodEnd']){
          setPeriodStart(new Date(addDays(periodEnd, 1)));
          setPeriodEnd(new Date(addDays(periodEnd, 15)));
        }
      }
    }
  }

  // DETECTA FIM DO DA TRANSIÇÃO DO SWIPER
  const transitionEnd = () => {
    if(!props.chamados && !props.visitas && !props.fases && !params['periodEnd']){
      loadCalendar(false, true);

      setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
    }
  }

  // FUNÇÕES AO TROCAR O TIPO DE CALENDÁRIO
  function handleSetTipoCalendario(e){
    setTipoCalendario(Number(e.value)); // SETA O TIPO CALENDÁRIO COM O VALOR SELECIONADO

    if(e.value != 2 && e.value != 3){ // SE O CALENDARIO FOR DIFERENTE DO TIPO LOJA (2) E TIPO PAINEL (3), LIMPA O FILTRO DE SUPERVISOR
      setFilterSupervisor([]);
    }

    if (e.value == 1 || e.value == 7 || e.value == 9 || e.value == 4) { // SE O TIPO FOR CALENDARIO (1) OU FREQUÊNCIA (7) OU MODELO (9) OU USUÁRIO (4), REMOVE O FILTRO DE EMPREENDIMENTO
      handleSetFilterEmpreendimento([]);
    }

    if(e.value == 2 || e.value == 3 || e.value == 4 || e.value == 10 || e.value == 11){ // SE FOR TIPO LOJA (2), PAINEL (3), USUÁRIO (4), CARGO (10) OU DEPARTMANENTO (11) REMOVE O FILTRO DE USUÁRIO
      setUsuario([]);
    }    

    if(e.value == 2 || e.value == 4 || e.value == 10 || e.value == 11){ // SE FOR TIPO LOJA (2), USUÁRIO (4), CARGO (10) OU DEPARTAMENTO (11) SETA O PERIODO INICIAL E FINAL NA DATA DE HOJE, E O PAGE PRA 0
      setPeriodStart(new Date());
      setPeriodEnd(new Date());
      setPage(0);
    }else{
      setPeriodEnd(new Date(date.getFullYear(), date.getMonth() + 2, 0));
    }
 
    if(e.value != 3){ // SE FOR DIFERENTE DE PAINEL REMOVE O FILTRO DE LOJA
      setLoja([]);
    }

    if(e.value == 3){ // SE FOR TIPO PAINEL SETA PERÍODO INICIAL E FINAL NA DATA DE HOJE
      setPeriodStart(new Date(window.currentDate));
      setPeriodEnd(new Date(window.currentDate));
      setSubTipoCalendario('store');
    }

    if (e.value == 7 || e.value == 9) { // FREQÛENCIA OU MODELO
      setPeriodStart('');
      setPeriodEnd('');
    }

    if(e.value == 8){ // PLANO DE AÇÃO
      setFilterMonth(window.currentMonth);
      setFilterYear(window.currentYear);
    }else{
      if(!props.visitas){
        setFilterMonth('');
        setFilterYear('');
      }
    }

    // LIMPA FILTRO DE CARGO SE NÃO FOR TIPO "CARGO"
    if(e.value != 10){
      setCargo([]);
    }

    // LIMPA FILTRO DE DEPARTAMENTO SE NÃO FOR TIPO "DEPARTAMENTO"
    if(e.value != 11){
      setDepartamento([]);
    }

    if(e.value == 7 || e.value == 8){ // SE FOR TIPO FREQUÊNCIA OU PLANO DE AÇÃO REMOVE O FILTRO DE DATA INICIAL E DATA FINAL
      if((window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador') || e.value == 7){
        if(window.rs_id_lja && window.rs_id_lja > 0){ // SE TIVER LOJA ID FILTRA A LOJA DO USUÁRIO
          setLoja([window.rs_id_lja]);
        }else{
          setUsuario(window.rs_id_usr);
        }
      }else{
        setLoja([]);
        setUsuario([]);
      }

      if(e.value == 8){ // SE FOR TIPO PLANO DE AÇÃO CRAVA A CATEGORIA "PLANO DE AÇÃO"
        setFilterCategory(['2426']);
        setFilterStatus(0);
      }
    } 

    if(e.value != 8){ // REMOVE O FILTRO DE STATUS SE NÃO FOR TIPO PLANO DE AÇÃO
      setFilterCategory([]);
      setFilterStatus('');
    }

    loadingCalendar(true); // RECARREGA O CALENDÁRIO

    if(e.value == 1){ // SE FOR TIPO CALENDÁRIO SETA O USUÁRIO LOGADO, DATA DE INÍCIO DO MÊS ATUAL E DATA FINAL 1 MÊS PARA FRENTE
      if(((window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador') || (window.rs_permission_apl === 'gerente' || window.rs_permission_apl === 'checker'))){
        setUsuario([]);
        setLoja([window.rs_id_lja]);
      }else{
        setUsuario(window.rs_id_usr);
        setLoja([]);
      }
      
      setPeriodStart(new Date(get_date('date_sql', (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()), 'date_sub_day', 15)));
      setPeriodEnd(new Date(get_date('date_sql', (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()), 'date_add_day', 15)));
    }

    if(e.value==9){ // SE O TIPO FOR MODELO (9) SETA O FILTERMODELO COMO TRUE E LIMPA FILTROS DE USUÁRIO / LOJA
      setFilterModelo(true);
      setUsuario([]);
      setLoja([]);
    }else{
      setFilterModelo(false);
    }

    // RESETA FILTRO DE STATUS
    setFilterStatus([]);
  }

  function handleSetSubTipoCalendario(e){
    loadingCalendar(true);
    setSubTipoCalendario(e.value);
    setUsuario([]);
    setLoja([]);
    setChangeFilter(true);
  }

  function handleSetLojaTipo(e){
    setLojaTipo(e.value);
    if(e.value == 1){
      setUsuario([]);
      setLoja([window.rs_id_lja]);
      setChangeStore(true);
    }else{
      setUsuario(window.rs_id_usr);
      setLoja([]);
      setChangeUser(true);
    }

    setChangeFilter(true);
  }

  // RECARREGA CARD
  const handleRefreshCard = (e) => {
    refreshCard(e);
  }

  // RECARREGA CALENDAR
  const handleRefreshCalendar = (e) => {
    loadCalendar(e);
  }

  // CHANGE STATUS
  const handleChangeStatus = (e) => {
    // handleSetAutoSwiper(false);

    if(e.id_group){ // CASO TENHA ID GROUP CHAMA A FUNÇÃO PARA ATUALIZAR SOMENTE O CARD ESPECÍFICO
        let message = '';

        if(e.status == 1){
          message = window.rs_name_usr+' finalizou um card interno';
        }else if(e.status == 2){
          message = window.rs_name_usr+' sinalizou um card interno como "Não tem"';
        }else if(e.status == 3){
          message = window.rs_name_usr+' finalizou com atraso um card interno';
        }else if(e.status == 4){
          message = window.rs_name_usr+' adiou um card interno';
        }

        refreshCard(e.id_group);
        set_message(e.id_job_status_parent, message);
    }else{
        if(props.chamados || props.visitas){ // SE FOR CHAMADOS OU VISITAS ONDE É NECESSÁRIO ATUALIZAR TODA A FILA
          loadCalendar(false);
        }else if(props.fases){
          refreshCard(Number(e.id_job_status));
        }else{
          if(e.status == 1 || e.status == 2 || e.status == 3){ // SE O STATUS FOR FINALIZADO (1), NÃO TEM (2) OU FINALIZADO COM ATRASO (3) RECARREGA CARD ESPECÍFICO
            refreshCard(Number(e.id_job_status));
          }else{ // SE O STATUS FOR ADIADO (4) RECARREGA TODOS OS CARDS
            loadCalendar(false);
          }          
        }
        
        // handleRefreshChat(true);
    }

    if(e.cod_status){ // VERIFICA SE RECEBEU COD DE STATUS NO RETORNO DA API
      if(e.cod_status === 2){
        toast('Card finalizado e encaminhado ao setor responsável');
      }
    }
  }

  // CALLBACK DE TROCA DE OPERADOR
  const handleChangeOperator = () => {
    loadCalendar(false);
  }

  // CALLBACK DE TROCA DE MÓDULO
  const handleChangeModule = () => {
    loadCalendar(false);
  }

  // FILTRO DE MÊS
  const handleFilterMonth = (e) => {
    setFilterMonth(e);
    setPeriodStart(new Date(filterYear, (e-1), 1));
    setPeriodEnd(new Date(filterYear, (e-1), get_date('last_day', (filterYear + '-' + e +'-01'), 'date_sql')));
    setChangeFilter(true);
  }

  // FILTRO DE ANO
  const handleFilterYear = (e) => {
    setFilterYear(e);
    setPeriodStart(new Date(e, (filterMonth - 1), 1));
    setPeriodEnd(new Date(e, (filterMonth - 1), get_date('last_day', (e + '-' + (filterMonth - 1) +'-01'), 'date_sql')));
    setChangeFilter(true);
  }

  // FILTRO DE MÓDULO
  const handleFilterModulo = (e) => {
    setPermission(true);

    if(props.permission){
      props.permission(true);
    }
    
    handleSetFilterModule(e.value);
    setChangeModule(true);
    setChangeFilter(true);
  }

  // FILTRO DE VISUALIZAÇÃO (FASES)
  const handleFilterView = (e) => {
    setFilterView(e.value);
    setChangeFilter(true);
  }

  // FILTRO DE MÓDULO A PARTIR DO CALLBACK DO COMPONENTE DE QUANTIDADES
  const handleFilterModuloQtd = (e) => {
    handleSetFilterModule(e);
    setChangeModule(true);
    setChangeFilter(true);
  }

  // FUNÇÃO PARA RECARREGAR APÓS CADASTRAR/EDITAR
  const handleRefresh = () => {
    if(multipleModules.includes(filterModule)){ // VERIFICA SE O MÓDULO SELECIONA ESTÁ NO ARRAY DE MÓDULOS QUE ABREM JUNTOS
      loadCalendar(false, false, '', false, true, multipleModules);
    }else{
      loadCalendar(false, false, '', false, true);
    }

    setCardsOpened([]); // ZERA LISTA DE CARDS QUE ESTÃO ABERTOS
  }

  // ABRIR MODAL DE DISPARO DE E-MAIL (FASES)
  const handleShowModalEmail = () => {
    setShowModalEmail(true);
  }

  // FECHAR MODAL DE DISPARO DE E-MAIL (FASES)
  const handleCloseModalEmail = () => {
    setShowModalEmail(false);
    setCountEmailAvulso(1);
    setEmailAvulso(emailAvulsoInitial);    
  }

  // FILTRO DE SUBCATEGORIA (MANUTENÇÃO)
  let filter_subcategory;
  if(window?.location?.origin?.includes('fastview')){
    filter_subcategory = global.categoria.fastview;
  }else if(window?.location?.origin?.includes('malltech')){
    filter_subcategory = global.categoria.malltech;
  }else{
    filter_subcategory = global.categoria.madnezz;
  }

  // CLONA ELEMENTOS DOS FILTROS PRA MANDAR PRO ARQUIVO INDEX
  global.filters = cloneElement(
    <>
      {(props.fases ? // SOMENTE NO FASES
        <SelectReact
          options={[
            {id: 1, nome: 'Cards'},
            {id: 2, nome: 'Relatório'}
          ]}
          placeholder="Visualização"
          name="filter_view"
          value={filterView}
          allowEmpty={false}
          onChange={handleFilterView}
        />
      :'')}
       
      {((props.chamados || props.fases) && (window.rs_sistema_id != global.sistema.manutencao_madnezz || (window.rs_sistema_id == global.sistema.manutencao_madnezz && window.rs_id_emp == 26)) && (window.rs_id_lja == 0 || !window.rs_id_lja) ? // SE FOR CHAMADOS, E NÃO ESTIVER NO SISTEMA "CHAMADOS EMPRESA REACT" MOSTRA O FILTRO DE MÓDULO
        <SelectReact
          options={optionsModule}
          placeholder="Módulo"
          name="filter_module"
          value={filterModule}
          allowEmpty={false}
          onChange={handleFilterModulo}
        />
      :'')}

      {(props.fases && window.rs_id_emp == 26 ?
        <FilterCheckbox
            placeholder="Cliente"
            options={optionsClientes}
            id="filter_client"
            name="filter_client"
            value={filterClient}
            onChangeClose={handleFilterClient}
        >
          Cliente
        </FilterCheckbox>
      :'')}

      {(!props.chamados && !props.fases && !props.visitas?
        <SelectReact
            options={optionsTipos}
            name="filter_type"
            value={tipoCalendario}
            onChange={(e) => (handleSetTipoCalendario(e), setChangeFilter(true))}
            allowEmpty={false}
            hide={(window.rs_permission_apl !== 'lojista' && window.rs_permission_apl !== 'operador') ? false : true}
        />
      :
        ''
      )}

      {(window.rs_id_grupo > 0 && ((tipoCalendario != 1 && tipoCalendario != 7 && tipoCalendario != 9 && tipoCalendario != 4) || props.visitas) ?      
        <FilterCheckbox
          api={{
            url: window.host_madnezz+'/api/sql.php?do=select&component=grupo_empreendimento&token='+window.token
          }}
          placeholder="Empreendimento"
          name="filter_id_emp"
          value={filterEmpreendimento}
          onChangeClose={(e) => (
            handleSetFilterEmpreendimento(e), resetFilter(), setChangeFilter(true)
          )}
        >
          Empreendimentos
        </FilterCheckbox>
      :'')}

      {/* MOSTRA O SELECT DE SUBTIPOS SOMENTE SE ESTIVER EM CHAMADOS, A PRIMEIRA COLUNA NÃO SENDO "LIVRE", SE NÃO FOR SISTEMNA MANUTENÇÃO, SE ESTIVER EM VISITAS OU ESTIVER EM PAINEL DO JOBS */}
      {(conf_filtro_tipo_operador && ((props.chamados && (jobs?.length > 0 || jobsCols?.length > 0) && (jobs?.length > 0 && jobs[0]?.type_permission !== 'livre') && window.rs_sistema_id != global.sistema.manutencao_madnezz) || props.visitas || tipoCalendario == 3) ? // CHAMADOS OU PAINEL
        <SelectReact
            options={optionsSubtipos}
            placeholder="Filtrar colunas"
            name="filter_subtype"
            value={subTipoCalendario}
            allowEmpty={false}
            onChange={(e) => handleSetSubTipoCalendario(e)}
        />
      :
        ''
      )}

      {(!props.chamados?
        <SelectReact
          options={optionsLojaTipos}
          name="filter_store_type"
          defaultValue={1}
          value={optionsLojaTipos[lojaTipo - 1].value}
          onChange={(e) => handleSetLojaTipo(e)}
          allowEmpty={false}
          hide={window.rs_id_lja > 1 && ((window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador') || (window.rs_permission_apl === 'gerente' || window.rs_permission_apl === 'checker')) ? false : true}
        />
      :'')}

      {((!props.chamados && !props.fases && !props?.visitas) || (subTipoCalendario !== 'user' && props?.visitas) ?
        <SelectReact
          api={{
            url: window.host_madnezz + '/systems/integration-react/api/request.php',
            params: {
              type: 'Job',
              db_type: 'sql_server',
              do: 'getTable',
              tables: [{
                table: 'store',
                filter: {
                  // np: true,
                  // filial: true,
                  // id_grupo: (filterEmpreendimento.length > 0 ? false : true),
                  id_emp: filterEmpreendimento
                }
              }]
            },
            key_aux: ['data', 'store'],
            defaultValue: (loja?.length > 0 ? [{value: window.rs_id_lja, label: window.rs_name_lja}] : '')
          }}
          placeholder="Loja"
          name="filter_id_store"
          value={loja}
          onChange={(e) => (
            setUsuario([]), setCargo([]), setDepartamento([]), setLoja(e.value), setChangeStore(true), setChangeFilter(true)
          )}
          allowEmpty={false}
          hide={tipoCalendario == 1 || tipoCalendario == 7 || tipoCalendario == 8 || tipoCalendario == 9 ? false : true}
        />
      :'')}

      {((!props.chamados && !props.fases && !props?.visitas) || (subTipoCalendario !== 'store' && props?.visitas) ?
        <SelectReact
          api={{
            url: window.host_madnezz + '/systems/integration-react/api/request.php',
            params: {
              type: 'Job',
              db_type: 'sql_server',
              do: 'getTable',
              tables: [{
                table: 'user',
                filter: {
                  permission: true,
                  // filial: true,
                  // id_grupo: (filterEmpreendimento.length > 0 ? false : true),
                  id_emp: filterEmpreendimento
                }
              }]
            },
            key_aux: ['data', 'user'],
            defaultValue: (usuario.length > 0 ? [{value: window.rs_id_usr, label: window.rs_name_usr}] : '')
          }}
          placeholder="Usuário"
          name="filter_id_user"
          value={usuario}
          onChange={(e) => (
            setLoja([]), setCargo([]), setDepartamento([]), setUsuario(e.value), setChangeUser(true), setLoaded(false), setChangeFilter(true)
          )}
          allowEmpty={false}
          hide={tipoCalendario == 1 || tipoCalendario == 7 || tipoCalendario == 8 || tipoCalendario == 9 ? ((window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador') ? true : false) : true}
        />
      :'')}

      {(!props.chamados && !props.fases && !props?.visitas ?
        <SelectReact
          api={{
            url: window.host_madnezz + '/systems/integration-react/api/request.php',
            params: {
              type: 'Job',
              db_type: 'sql_server',
              do: 'getTable',
              tables: [
                {table: 'office', filter: {id_emp: filterEmpreendimento}}
              ]
            },
            key_aux: ['data','office'],
            reload: filterEmpreendimento
          }}
          placeholder="Cargo"
          name="filter_id_office"
          value={cargo}
          onChange={(e) => (
            setLoja([]), setUsuario([]), setDepartamento([]), setCargo(e.value), setChangeOffice(true), setLoaded(false), setChangeFilter(true)
          )}
          allowEmpty={false}
          hide={tipoCalendario == 1 || tipoCalendario == 7 || tipoCalendario == 8 || tipoCalendario == 9 ? ((window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador') ? true : false) : true}
        />
      :'')}

      <FilterCheckbox
        id="filter_store"
        name="filter_store"
        api={{
          url: window.host_madnezz + '/systems/integration-react/api/list.php?do=headerFilter',
          params: {
            filters: [{filter: 'store'}],
            empreendimento_id: filterEmpreendimento,
            limit: 50,
            np: true
          },
          key_aux: ['store'],
          reload: filterEmpreendimento
        }}
        onChangeClose={handleFilterStore}
        hide={(tipoCalendario == 3 && subTipoCalendario == 'store') || tipoCalendario == 2 ? false : (((window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'operador') || (window.rs_permission_apl === 'gerente' || window.rs_permission_apl === 'checker')) || (tipoCalendario != 3 && tipoCalendario != 2) || subTipoCalendario == 'user' ? true : false)}
        value={loja}
      >
        Lojas
      </FilterCheckbox>
      
      <FilterCheckbox
        id="filter_user"
        name="filter_user"
        api={{
          url: window.host_madnezz + '/systems/integration-react/api/list.php?do=headerFilter',
          params: {
            filters: [{filter: 'user'}],
            empreendimento_id: filterEmpreendimento,
            limit: 50,
            np: true
          },
          key_aux: ['user'],
          reload: filterEmpreendimento
        }}
        onChangeClose={handleFilterUser}
        hide={(tipoCalendario == 3 && subTipoCalendario == 'user') || tipoCalendario == 4 || (props.fases && window.rs_permission_apl === 'master') ? false : (((window.rs_permission_apl === 'gerente' || window.rs_permission_apl === 'checker') || tipoCalendario != 3 || tipoCalendario != 4 || subTipoCalendario == 'store' ? true : false))}
        value={usuario}
      >
        Usuários
      </FilterCheckbox>

      {(tipoCalendario == 10 ? // TIPO "CARGO"
        <FilterCheckbox
          id="filter_office"
          name="filter_office"
          api={{
            url: window.host_madnezz + '/systems/integration-react/api/request.php',
            params: {
              type: 'Job',
              db_type: 'sql_server',
              do: 'getTable',
              tables: [
                {table: 'office', filter: {id_emp: filterEmpreendimento}}
              ]
            },
            key_aux: ['data','office'],
            reload: filterEmpreendimento
          }}
          onChangeClose={handleFilterOffice}
          value={cargo}
        >
          Cargos
        </FilterCheckbox>
      :'')}

      {(tipoCalendario == 11 ? // TIPO "DEPARTAMENTO"
        <FilterCheckbox
          id="filter_department"
          name="filter_department"
          api={{
            url: window.host_madnezz + '/systems/integration-react/api/request.php',
            params: {
              type: 'Job',
              db_type: 'sql_server',
              do: 'getTable',
              tables: [
                {table: 'department', filter: {id_emp: filterEmpreendimento}}
              ]
            },
            key_aux: ['data','department'],
            reload: filterEmpreendimento
          }}
          onChangeClose={handleFilterDepartment}
          value={departamento}
        >
          Departamentos
        </FilterCheckbox>
      :'')}

      {(props.chamados && sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz ? 
        <FilterCheckbox
            name="filter_sistema"
            api={{
              url: window.host_madnezz+"/api/sql.php?do=select&component=sistema",
              params: {
                empreendimento_id: filterEmpreendimento
              }
            }}
            onChangeClose={handleFilterSystemManutencao}
            value={filterSystemManutencao}
        >
            Sistemas
        </FilterCheckbox>
      :'')}

      {(!props.visitas && sessionStorage.getItem('sistema_id') != global.sistema.manutencao_madnezz ? 
        <FilterCheckbox
            name="filter_category"
            grupo={(window.rs_id_grupo > 0 ? true : false)}
            api={{
              url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
              params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                  {table: 'category', filter: {id_emp: filterEmpreendimento}}
                ]
              },
              key_aux: ['data', 'category']
            }}
            onChangeClose={handleFilterCategory}
            value={filterCategory}
            hide={(tipoCalendario == 8 ? true : false)}
        >
            Categorias
        </FilterCheckbox>
      :'')}

      {(!props.visitas ?
        <FilterCheckbox
          name="filter_subcategory"
          grupo={(window.rs_id_grupo > 0 ? true : false)}
          api={{
            url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
            params: {
              db_type: global.db_type,
              do: 'getTable',
              tables: [
                {
                  table: 'subcategory',
                  filter: {
                    id_emp: filterEmpreendimento,
                    id_ite: sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz ? [global.categoria.madnezz] : (tipoCalendario == 8 || !props.chamados && !props.visitas ? filterCategory : undefined)
                  }
                }
              ]
            },
            key_aux: ['data', 'subcategory'],
            reload: [filterEmpreendimento, filterCategory].toString()
          }}
          onChangeClose={handleFilterSubcategory}
          value={filterSubCategory}
        >
          {(sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz ? 'Tipo' : 'Subcategorias')}
        </FilterCheckbox>
      : '')}

      {(!props.chamados && !props.fases && !props.visitas && tipoCalendario != 8 ?
        <FilterCheckbox
            name="filter_frequency"
            api={{
              url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
              params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                  {table: 'frequency', filter: {id_emp: filterEmpreendimento}}
                ]
              },
              key_aux: ['data', 'frequency'],
              reload: [filterCategory]
            }}

            onChangeClose={handleFilterFrequency}
            value={filterFrequency}
        >
            Frequência
        </FilterCheckbox>
      :'')}

      {(!props.chamados && tipoCalendario != 7 && tipoCalendario != 9 ?
        <FilterCheckbox
            name="filter_status"
            options={window.optionsStatus}
            onChangeClose={handleFilterStatus}
            value={filterStatus}
        >
            Status
        </FilterCheckbox>
      :'')}

      {(props.fases ?
      <>
        <SelectReact
          options={[
            {value: 1, label: 'Sim'},
            {value: 2, label: 'Não'}
          ]}
          label="Arquivados"
          name="filter_archived"
          defaultValue={''}
          value={filterArchived}
          allowEmpty={false}
          required={false}
          onChange={(e) => (setFilterArchived(e.value), setChangeFilter(true))}
        />
        <SelectReact
          options={[
            {value: 1, label: 'Todos'},
            {value: 2, label: 'Somente prioritários'}
          ]}
          label="Prioridade"
          name="filter_priority"
          defaultValue={''}
          value={filterPriority}
          allowEmpty={false}
          required={false}
          onChange={(e) => (setFilterPriority(e.value), setChangeFilter(true))}
        />
      </>
        
      :'')}

      {((tipoCalendario == 2 || tipoCalendario == 3) && window.rs_permission_apl === 'master' ? // SE FOR TIPO LOJA (2) OU PAINEL (3) E NÍVEL DE ACESSO MAIOR QUE GERENTE
        <FilterCheckbox
            name="filter_supervisor"
            api={window.host_madnezz+"/api/sql.php?do=select&component=supervisor_2&grupo_id=true&empreendimento_id="+filterEmpreendimento}
            onChangeClose={handleFilterSupervisor}
            value={filterSupervisor}
        >
            Regional
        </FilterCheckbox>
      :'')}

      {/* <FilterCheckbox
        options={false}
        id={'filter_all'}
        name="filter_all"
        value={filterAll}
        onChangeClose={(e) => (
          setFilterAll(e),
          setChangeFilter(true)
        )}
      >
        Procurar
      </FilterCheckbox> */}

      {(!props.chamados && !props.fases && !props.visitas ?
        <>
          <Input
              type="date"
              name="period_start"
              icon={false}
              required={false}
              value={periodStart}
              onChange={(e) => (
                setPeriodStart(e), setPeriodEnd(e), setChangePeriod(true)
              )}
              hide={tipoCalendario == 2 || tipoCalendario == 4 ? false : true}
          />
          
          <Input
              type="period"
              name="period_end"
              required={false}
              valueStart={periodStart}
              valueEnd={periodEnd}
              onChangeStart={(e) => (setPeriodStart(e), setChangePeriod(true))}
              onChangeEnd={(e) => (setPeriodEnd(e), setChangePeriod(true))}
              hide={tipoCalendario == 2 || tipoCalendario == 4 || tipoCalendario == 7 || tipoCalendario == 8 || tipoCalendario == 9 ? true : false}
          />
        </>
      :'')}

      {(props.visitas || tipoCalendario == 8 ?
        <>
          <SelectReact
            options={optionsMonths}
            placeholder="Mês"
            name="filter_month"
            defaultValue={''}
            value={filterMonth}
            allowEmpty={false}
            onChange={(e) => (
              handleFilterMonth(e.value)
            )}
          />

          <SelectReact
            placeholder="Ano"
            options={optionsYear}
            value={filterYear}
            allowEmpty={false}
            onChange={(e) => handleFilterYear(e.value)}
          />
        </>
      :'')}
    </>
  )

  // DEFINE URL DO BOTÃO BETA
  let url_aux;

  if(global.empreendimentos_sal?.includes(window.rs_id_emp)){
    const minCeiled = Math.ceil(10000);
    const maxFloored = Math.floor(99999);
    let rand= Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    url_aux = 'https://sal.madnezz.com.br/?v3='+rand+(rand*window.rs_id_usr)+'&redirect=pedidos';
  }else{
    url_aux = '/sistemas/pedido';
  }

  // MANDA OS FILTROS PRO COMPONENTE PAI
  useEffect(() => {
    if (props?.icons) {
        props.icons(
          <>
            {/* ALERTA AVISANDO SOBRE A VERSÃO BETA (SOMENTE CHAMADOS)*/}
            {(props.chamados && window.rs_sistema_id != global.sistema.manutencao_madnezz && permissaoPedidos ?
              <Alert url={url_aux} />
            :'')}

            {/* ÍCONE PARA DISPARAR E-MAIL (SOMENTE FASES E EMPREENDIMENTO MADNEZZ) */}
            {(props?.fases && window.rs_id_emp == 26 ?
              <Icon
                type="mail"
                title="Disparar e-mail"
                onClick={handleShowModalEmail}
                animated
              />   
            :'')}

            <Icon
              type={smallCard ? 'expand-card' : 'retract-card'}
              title={smallCard ? 'Aumentar cards' : 'Diminuir cards'}
              animated
              onClick={() => handleSetSmallCard(!smallCard)}
            />
          </>
        );
    }

    if (props?.filters) {
        props.filters('');
    }
  }, [filterMonth, filterYear, smallCard]);

  // BOTÃO DE AÇÃO (JOBS)
  const handleActionButton = () => {
    navigate('/systems/job-react/calendario/1/'+window.token);
    setFilterStatus([]);
    setFilterCategory([]);
  }

  // CALLBACK DO COLLAPSE
  const handleSetCollapse = (e) => {
    if(e.show){
      setCardsOpened(cardsOpened => [...cardsOpened, e]);
    }else{
      setCardsOpened(cardsOpened.filter((elem) => elem.id != e.id));
    }
  }

  // MUDA VALOR DOS E-MAILS AVULSOS
  const handleSetEmailAvulso = (nome, email, index) => {
    let value_aux = [];

    ([...Array(countEmailAvulso)].map(((item, i) => {
      if(index == i){
        value_aux.push({
          nome_usuario: nome || nome === '' ? nome : (emailAvulso[i]?.nome_usuario ? emailAvulso[i]?.nome_usuario : ''),
          email_usuario: email || email === '' ? email : (emailAvulso[i]?.email_usuario ? emailAvulso[i]?.email_usuario : '')
        });
      }else{
        if(emailAvulso[i]){
          value_aux.push(emailAvulso[i]);
        }else{
          value_aux.push({
            nome_usuario: '',
            email_usuario: '',
          });
        }        
      }
    })));

    // DESABILITA BOTÃO CASO ALGUM CAMPO DE E-MAIL NÃO TENHA SIDO PREENCHIDO
    let button_disabled_aux = false;
    let button_title_aux = '';
    
    value_aux.map((item, i) => {
      if(item?.nome_usuario && !item?.email_usuario){
        button_disabled_aux = true;
        button_title_aux = 'Verifique o campo de e-mail em branco';
      }
    });

    setButtonEmailAvulso({
      disabled: button_disabled_aux,
      title: button_title_aux,
      status: ''
    });

    setEmailAvulso(value_aux);
  }

  // FUNÇÃO PARA INCLUIR NOVOS INPUTS DE E-MAIL
  const handleIncludeEmail = () => {
    let new_value = countEmailAvulso + 1;

    setCountEmailAvulso(new_value);

    setTimeout(() => {
      document.getElementById('nome_avulso_'+new_value).focus(); // FOCA AUTOMATICAMENTE NO NOVO INPUT
    },50);
  }

  // FUNÇÃO PARA REMOVER INPUTS DE E-MAIL
  const handleSetRemoveEmailAvulso = (e) => {
    let new_value = countEmailAvulso - 1;

    setEmailAvulso(emailAvulso.filter((elem, i) => i != e));
    setCountEmailAvulso(new_value);
  }

  // VALORES DO FORMULÁRIO DE E-MAILS AVULSOS
  const data_emails = {}

  // JUNTA A VARIÁVEL DE DATA E-MAIL COM OS FILTROS
  Object.assign(data_emails, global.filter_aux, {
    type: 'Cron_jobs',
    do: 'sendEmailTemplate',
    filter_type: 'phase',
    filter_subtype: 'email',
    filter_manual: true,
    emails: emailAvulso
  });

  // PEGA STATUS DO FORMULÁRIO DE E-MAIL
  const handleStatusFormEmail = (e) => {
    setButtonEmailAvulso({
      disabled: '',
      title: '',
      status: e
    });
  }

  // RESPOSTA DO FORMULÁRIO DE E-MAIL
  const handleResponseFormEmail = () => {
    handleCloseModalEmail();
  }

  // SÓ EXECUTA O CÓDIGO DO DASHBOARD DEPOIS QUE TIVER UM MÓDULO SETADO OU NO SISTEMA JOBS
  if(filterModule || (!props.chamados && !props.fases && !props.visitas)){
    return (
      <>
        {/* MODAL DE DISPARO DE E-MAILS */}
        <Modal show={showModalEmail} md={true} onHide={handleCloseModalEmail}>
          <ModalHeader>
            <ModalTitle>Disparar e-mail</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <p>
              O e-mail será disparado para os donos dos cards filtrados, assim como os donos dos cards internos de cada um. <br /><br />
              Insira abaixo caso queira incluir algum outro e-mail no disparo:
            </p>
            
            <Form
              api={window.host_madnezz + '/systems/integration-react/api/request.php'}
              data={data_emails}
              status={handleStatusFormEmail}
              response={handleResponseFormEmail}
              className="w-100"
            >
              {([...Array(countEmailAvulso)].map(((item, i) => {
                let index_aux = i+1;
                return(
                  <div
                    className="d-block d-lg-flex w-100"
                    style={{gap:10}}
                    key={'container_email_'+i}
                  >
                    <div style={{marginBottom: 10, flex: 1}}>
                      <Input
                        key={'nome_avulso_'+index_aux}
                        name={'nome_avulso_'+index_aux}
                        id={'nome_avulso_'+index_aux}
                        label={'Nome' + (countEmailAvulso > 1 ? ' '+index_aux : '')}
                        type="Nome"
                        value={emailAvulso[i]?.nome_usuario}
                        onChange={(e) => handleSetEmailAvulso(e.target.value, undefined, i)}
                        required={false}                 
                      />
                    </div>

                    <div style={{marginBottom: 10, flex: 1}}>
                      <Input
                        key={'email_avulso_'+index_aux}
                        name={'email_avulso_'+index_aux}
                        id={'email_avulso_'+index_aux}
                        label={'E-mail' + (countEmailAvulso > 1 ? ' '+index_aux : '')}
                        type="email"
                        value={emailAvulso[i]?.email_usuario}
                        onChange={(e) => handleSetEmailAvulso(undefined, e.target.value, i)}
                        required={false} 
                        icon={
                          (i > 0 ?
                            <Icon type="trash" onClick={() => handleSetRemoveEmailAvulso(i)} />
                          :'')
                        }                     
                      />
                    </div>
                  </div>
                )
              })))}    

              <div className="d-flex align-items-center justify-content-end">
                <Icon
                  type="new"
                  title="Incluir outro e-mail"
                  onClick={handleIncludeEmail}
                />

                <Button
                  type="submit"
                  className="ms-3"
                  title={buttonEmailAvulso?.title}
                  disabled={buttonEmailAvulso?.disabled}
                  status={buttonEmailAvulso?.status}
                >
                  Enviar
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>

        {/* // CONTADOR PARA ATUALIZAR A LISTA DE CARDS AUTOMATICAMENTE (CHAMADOS) */}
        {(props.chamados?<Counter refreshCalendar={handleRefreshCalendar} paused={cardsOpened.length > 0} />:'')}

        {/* SE RECEBER A QUANTIDADE DE CARDS EM CADA MÓDULO */}
        {(conf_quantidade_modulos && sessionStorage.getItem('sistema_id') != global.sistema.manutencao_madnezz && cardsLength.length > 0 && permission && props?.chamados && (window.rs_id_lja == 0 || !window.rs_id_lja) && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') ?
          <div className={style.qtd_cards}>
            <Quantidade
              items={cardsLength}
              disabled={disabledFilter}
              callback={handleFilterModuloQtd}
              optionsModule={optionsModule}
              check={checkStep}
              operation={operatorStep}
            />
          </div>
        :'')}

        <div className={(layout == 1 ? "d-block" : "d-none") + ' position-relative'} id="swiper_container">       
          {(() => {
            if(props?.visitas){
              return(
                <Visitas 
                  jobs={jobs}
                  widget={props?.widget}
                  optionsModule={optionsModule}
                  refresh={handleRefresh}
                  reloadInternal={reloadInternal}
                  refreshCard={handleRefreshCard}
                  refreshCalendar={handleRefreshCalendar}
                  changeStatus={handleChangeStatus}
                  loaded={loaded}
                  usuario={usuario}
                  loja={loja}
                  filters={{
                    periodStart: periodStart,
                    periodEnd: periodEnd,
                    tipoCalendario: tipoCalendario,
                    subTipoCalendario: subTipoCalendario,
                    usuario: usuario,
                    loja: loja
                  }}
                  collapse={handleSetCollapse}
                />
              )
            }else if(props?.fases){
              if(filterView === 1){
                return(
                  <Fases
                    jobs={jobs}
                    widget={props?.widget}
                    optionsModule={optionsModule}
                    refresh={handleRefresh}
                    reloadInternal={reloadInternal}
                    refreshCard={handleRefreshCard}
                    refreshCalendar={handleRefreshCalendar}
                    changeStatus={handleChangeStatus}
                    loaded={loaded}
                    usuario={usuario}
                    createNew={createNew}
                    filters={{
                      periodStart: periodStart,
                      periodEnd: periodEnd,
                      tipoCalendario: tipoCalendario,
                      subTipoCalendario: subTipoCalendario,
                      usuario: usuario,
                      loja: loja,
                      archived: filterArchived,
                      priority: filterPriority
                    }}
                    collapse={handleSetCollapse}
                  />
                )
              }else{
                return(
                  <RelatorioEmail
                    jobs={jobs}
                    refreshCard={handleRefreshCard}
                    loading={loadingCards}
                    filters={{
                      periodStart: periodStart,
                      periodEnd: periodEnd,
                      tipoCalendario: tipoCalendario,
                      subTipoCalendario: subTipoCalendario,
                      usuario: usuario,
                      loja: loja,
                      archived: filterArchived,
                      priority: filterPriority
                    }}
                  />
                )
              }
            }else if(props?.chamados){
              return(
                <Chamados
                  jobs={jobs}
                  jobsCols={jobsCols}
                  widget={props?.widget}
                  optionsModule={optionsModule}
                  optionsModuleUnfiltered={optionsModuleUnfiltered}
                  refresh={handleRefresh}
                  reloadInternal={reloadInternal}
                  refreshCard={handleRefreshCard}
                  refreshCalendar={handleRefreshCalendar}
                  changeStatus={handleChangeStatus}
                  changeOperator={handleChangeOperator}
                  changeModule={handleChangeModule}
                  loaded={loaded}
                  usuario={usuario}
                  createNew={createNew}
                  filters={{
                    periodStart: periodStart,
                    periodEnd: periodEnd,
                    tipoCalendario: tipoCalendario,
                    subTipoCalendario: subTipoCalendario,
                    usuario: usuario,
                    loja: loja,
                    modulo: filterModule
                  }}
                  collapse={handleSetCollapse}
                  permission={permission}
                />
              )
            }else{
              return(
                <Jobs 
                  jobs={jobs}
                  widget={props?.widget}
                  optionsModule={optionsModule}
                  changeLayout={changeLayout}
                  refresh={handleRefresh}
                  reloadInternal={reloadInternal}
                  refreshCard={handleRefreshCard}
                  refreshCalendar={handleRefreshCalendar}
                  changeStatus={handleChangeStatus}
                  reachBeginning={reachBeginning}
                  reachEnd={reachEnd}
                  transitionEnd={transitionEnd}
                  filters={{
                    periodStart: periodStart,
                    periodEnd: periodEnd,
                    tipoCalendario: tipoCalendario,
                    subTipoCalendario: subTipoCalendario,
                    usuario: usuario,
                    loja: loja,
                    modelo: filterModelo,
                    status: filterStatus
                  }}
                  actionButton={handleActionButton}
                  collapse={handleSetCollapse}                  
                />
              )
            }
          })()}
        </div>
      </>
    );
  }else{
    if(pageError){
      return(
        <PageError
            title="Nenhum módulo configurado"
            text={`Tente novamente em alguns minutos.\nCaso o problema persista, entre em contato com o suporte.`}
        />
      )
    }
  }
}
