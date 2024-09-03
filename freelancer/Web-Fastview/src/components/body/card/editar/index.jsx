import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { cd, addDays, get_date, diffDays } from "../../../../_assets/js/global";  
import style from './editar.module.scss';

import Modal from "../../modal";
import ModalHeader from "../../modal/modalHeader";
import ModalTitle from "../../modal/modalHeader/modalTitle";
import ModalBody from "../../modal/modalBody";
import Icon from "../../icon";
import Form from "../../form";
import Textarea from "../../form/textarea";
import Button from "../../button";
import SelectReact from "../../select";
import Title from "../../title";
import InputContainer from "../../form/inputcontainer";
import Input from "../../form/input";
import Row from "../../row";
import Col from "../../col";
import Loader from "../../loader";
import icon_home from '../../../../pages/Homes/Systems/images/icon.png';
import icon_envelope from '../../../../_assets/img/envelope.png';
import PlanilhaExemplo from '../../../../_assets/img/planilha_exemplo.png';

import { GlobalContext } from "../../../../context/Global";
import { JobsContext } from "../../../../context/Jobs";
import CheckboxUser from "./checkboxUser";
import Card from "..";
import CheckboxGroup from "../../form/checkboxGroup";
import CardJobs from "../../../../pages/Jobs/Main/Card";
import Microssistema from '../../../../pages/Microssistemas/Cadastro';
import Tippy from "@tippyjs/react";
import toast from "react-hot-toast";
import Liberacao from "./liberacaoAcesso";
import Separator from '../../separator';

export default function Editar(props) {
  // CONTEXT GLOBAL
  const { buttonState, filterModule, refreshCalendar, loadingCalendar } = useContext(GlobalContext);

  // CONTEXT JOBS
  const { optionsSystems, configuracoes, handleSetOptionsSystems } = useContext(JobsContext);

  // ESTADOS
  const [showModal, setShowModal] = useState(false);
  const [showModalAtalhos, setShowModalAtalhos] = useState(false);
  const [shortcutSelected, setShortcutSelected] = useState(false);
  const [alertUsers, setAlertUsers] = useState('');

  // REF
  const leftCol = useRef(null);
  const filterCol = useRef(null);
  const importerRef = useRef(null);

  // CONTROLLER LISTA DE CHECKBOX'S
  const abortUsers = useRef(new AbortController());

  // CONFIGURAÇÕES DE CADASTRO
  let conf_urgente = true;
  let conf_agendar = true;
  let conf_com_risco = true;
  let conf_tipo = true;
  let conf_sistemas = true;
  let conf_box_usuarios = true;
  let conf_integracao = true;
  let conf_title = true;  
  let conf_tipo_comercial = false;
  let conf_microssistema = '';

  if(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar){
    let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_desabilitar)?.filter((elem) => elem.id_modulo == filterModule)[0]?.values;

    if(json_aux?.filter((elem) => elem.nome === 'agendar').length > 0){
      conf_agendar = (json_aux?.filter((elem) => elem.nome === 'agendar')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'urgente').length > 0){
      conf_urgente = (json_aux?.filter((elem) => elem.nome === 'urgente')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'com_risco').length > 0){
      conf_com_risco = (json_aux?.filter((elem) => elem.nome === 'com_risco')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'tipo').length > 0){
      conf_tipo = (json_aux?.filter((elem) => elem.nome === 'tipo')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'sistemas').length > 0){
      conf_sistemas = (json_aux?.filter((elem) => elem.nome === 'sistemas')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'box_usuarios').length > 0){
      conf_box_usuarios = (json_aux?.filter((elem) => elem.nome === 'box_usuarios')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'integracao').length > 0){
      conf_integracao = (json_aux?.filter((elem) => elem.nome === 'integracao')[0]?.value == 1 ? false : true);
    }

    if(json_aux?.filter((elem) => elem.nome === 'titulo').length > 0){
      conf_title = (json_aux?.filter((elem) => elem.nome === 'titulo')[0]?.value == 1 ? false : true);
    }
  }

  if(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_configuracao){
    conf_tipo_comercial = (JSON.parse(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_configuracao).tipo_comercial == filterModule ? true : false);
  }

  // VERIFICA SE NA CONFIGURAÇÃO DO CARD O TÍTULO POSSUI O CAMPO "TÍTULO", CASO CONTRÁRIO, NÃO EXIBE O INPUT E CADASTRA COM NOME "CHAMADO" POR PADRÃO
  if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_titulo_tipo){
    if(!configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_titulo_tipo.includes('titulo')){
      conf_title = false;
    }
  }

  // VERIFICA SE TEM MICROSSISTEMA CONFIGURADO NO MÓDULO
  if(props?.optionsModule?.filter((elem) => elem.id == filterModule)[0]?.ite_atalho){
    if(props?.optionsModule?.filter((elem) => elem.id == filterModule)[0]?.ite_atalho){
      conf_microssistema = JSON.parse(props?.optionsModule?.filter((elem) => elem.id == filterModule)[0]?.ite_atalho)?.microssistema_id;
    }
  }

  // SE O MÓDULO FOR MADNEZZ (MANUTENÇÃO) IGNORA AS CONFIGURAÇÕES DO BANCO
  if(global.modulo.manutencao?.includes(parseInt(filterModule))){
    conf_com_risco = false;
    conf_tipo = false;
    conf_sistemas = false;
    conf_box_usuarios = false;
    conf_integracao = false;
    conf_title = true;
    conf_urgente = true;
    conf_agendar = true;
    conf_tipo_comercial = false;
  }

  // ABRE MODAL AUTOMATICAMENTE SE TIVER PROPS SHOW
  useEffect(() => {
    if(configuracoes){
      if(configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_atalho_categoria == 1){
        if (props.show) {
          handleShowModalAtalhos();
        } 
      }else{
        if (props.show) {
          handleShowModal();
        }
      }
    }else{
      if (props.show) {
        handleShowModal();
      }
    }
  }, [props.show]);
 
  // DEFINE VALOR INICIAL DA FREQUÊNCIA
  const frequencyInitial = () => {
    if (props?.frequency?.id) {
      return props?.frequency?.id;
    } else {
      if (props.chamados || props.fases) {
        return global.frequencia.unico;
      } else if (props.visitas) {
        return global.frequencia.mensal;
      } else {
        return '';
      }
    }
  }

  // DEFINE VALOR INICIAL DA FREQUÊNCIA AUX
  const frequencyAuxInitial = () => {
    if(props.frequency_aux){
      return props.frequency_aux;
    }else{
      return '';
    }
  }

  // DEFINE VALOR INICIAL DA CATEGORIA
  const categoryInitial = () => {
    if (window.rs_sistema_id == global.sistema.manutencao_madnezz) { // SE ESTIVER NO SISTEMA "MANUTENÇÃO" CRAVA A CATEGORIA "MADNEZZ"
      if(global.client === 'fastview'){
        return global.categoria.fastview;
      }else if(global.client === 'malltech'){
        return global.categoria.malltech;
      }else{
        if(window.rs_id_emp == 26){
          return global.categoria.madnezz;
        }else{
          return global.categoria.madweb;
        }
      }
    } else {
      if(props?.category?.id){
        return props?.category?.id;
      }else{
        return '';
      }
    }
  }

  // DEFINE VALOR INICIAL DA DATA DE INÍCIO
  const dateStartInitial = () => {
    if(props?.dateStart){
      return new Date(get_date('date_sql', props?.dateStart, 'date_add_day', 1));
    }else{
      if(props.chamados){
        return new Date();
      }else{
        return '';
      }
    }
  }

  // DEFINE VALOR INICIAL DA DATA FINAL
  const dateEndInitial = () => {
    if (props?.dateEnd) {
      return new Date(get_date('date_sql', props?.dateEnd, 'date_add_day', 1));
    } else {
      if(props.visitas){
        return new Date(get_date('date_sql', get_date('last_date', window.currentYear+'-'+window.currentMonth+'-01', 'date_sql'), 'date')+' 00:00:00');
      }else if(props.chamados){
        return new Date();
      }else{
        return '';
      }
    }
  }

  // DEFINE VALOR INICIAL DA HORA LIMITE
  const hourLimitInitial = () => {
    if(props.chamados || props?.comunicados){
      return '23:59:59';
    }else{
      return '';
    }
  }

  // DEFINE VALOR INICIAL DO MÓDULO FASES
  const moduloFasesInitial = () => {
    if(props?.modulo){
      return props?.modulo;
    }else{
      if(props.fases || props?.id_system == '225'){
        return filterModule;
      }else{
        return '';
      }
    }
  }

  // DEFINE VALOR INICIAL DO MÓDULO FASES
  const moduloChamadosInitial = () => {
    if(props?.moduloChamados){
      return props?.moduloChamados;
    }else{
      if(props.chamados || props?.id_system == '224'){
        return filterModule;
      }else{
        return '';
      }
    }
  }

  // DEFINE VALOR INICIAL DOS SISTEMAS 
  const systemInitial = () => {
    if(props?.id_system?.id){
      return props?.id_system?.id;
    }else{
      if(props.chamados){
        return [{id: '223'}, {id: '224'}];
      }else if(props.fases){
        return [{id: '223'}, {id: '225'}]; 
      }else if(props.visitas){
        return [{id: '223'}, {id:'226'}]; 
      }else if (props.comunicados){
        return [{id: '223'}, {id: '229'}];
      }else if (props.notificacoes){
        return [{id: '223'}, {id: '231'}];
      }else{
        return [{id: '223'}];
      }
    }
  }

  // DEFINE VALOR INICIAL DOS USUÁRIOS SELECIONADOS
  const userInitial = () => {
    if(props.id_usr){
      return [{id: props.id_usr, date_start: dateStart, hour_limit: hourLimit}];
    }else{
      return [];
    }
  }

  // DEFINE VALOR INICIAL DAS LOJAS SELECIONADAS
  const storeInitial = () => {
    if(props.id_lja){
      return [{id: props.id_lja, date_start: dateStart, hour_limit: hourLimit}];
    }else{
      return [];
    }
  }

  // DEFINE VALOR INICIAL DOS CARGOS SELECIONADOS
  const officeInitial = () => {
    if(props.id_office){
      return [{id: props.id_office, date_start: dateStart, hour_limit: hourLimit}];
    }else{
      return [];
    }
  }

  // DEFINE VALOR INICIAL DAS DEPARTAMENTOS SELECIONADAS
  const departmentInitial = () => {
    if(props.id_department){
      return [{id: props.id_department, date_start: dateStart, hour_limit: hourLimit}];
    }else{
      return [];
    }
  }

  // DEFINE VALOR INICIAL DO TIPO (LOJA OU USUÁIRO)
  const tipoInitial = () => {
    if(props?.tipo){
      return props?.tipo;
    }else{
      if(props.id_lja){
        return 'loja';
      }

      if(props.id_usr){
        return 'usuario';
      }

      if(props.chamados || props.visitas || props.fases){
        return 'usuario';
      }else{
        if(props.id_lja){
        return 'loja'; 
        }
        
        if(props.id_usr){
          return 'usuario';
        }else{
          return 'loja';
        }
      }
    }
  }

  // DEFINE O SISTEMA DE INTEGRAÇÃO INICIAL 
  const idJobSystemInitial = () => {
    if(props?.id_job_system){
      return props?.id_job_system;
    }else{
      return '';
    }
  }

  // DEFINE O TIPO DE SISTEMA DE INTEGRAÇÃO
  const idJobSystemTypeInitial = () => {
    if(props?.id_job_system_type){
      return props?.id_job_system_type;
    }else{
      return '';
    }
  }

  // DEFINE A LOJA INICIAL DA INTEGRAÇÃO
  const idJobSystemType1Initial = () => {
    if(props?.id_job_system_type1){
      return props?.id_job_system_type1;
    }else{
      return [];
    }
  }

  // DEFINE ALERT INICIAL DO BUTTON
  const alertInitial = () => {
    if(props?.button){
      return props?.button?.title;
    }else{
      if(props.chamados || props.fases || props.visitas){
        return '';
      } else {
        return 'É necessário selecionar alguma loja, usuário, cargo ou departamento antes de salvar';
      }
    }
  }

  // DEFINE MICROSSISTEMA INICIAL
  const microssistemaInitial = () => {
    if(conf_microssistema){
      return conf_microssistema;
    }else{
      return null;
    }
  }

  // DEFINE VALIDATION INICIAL DO BUTTON
  const validationInitial = () => {
    if(props?.button){
      return props?.button?.validation;
    }else{
      if(props.chamados || props.fases || props.visitas){
        return true;
      }else{
        return false;
      }
    }
  }

  // DEFINE VALOR INICIAL DO PESO
  const pesoInitial = () => {
    if(!props.chamados && !props.fases && !props.visitas){
      return 1;
    }else{
      return undefined;
    }
  }

  // DEFINE VALOR INICIAL DO RESPONSÁVEL
  const responsavelInitial = () => {
    return '';
  }

  const [loaded, setLoaded] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [hideTipo, setHideTipo] = useState(false);
  const [optionsCliente, setOptionsCliente] = useState([]);
  const [optionsLojaSolicitante, setOptionsLojaSoliciante] = useState([]);
  const [optionsFrequency, setOptionsFrequency] = useState([]);
  const [optionsFrequencyAux, setOptionsFrequencyAux] = useState([]);
  const [optionsSystemManutencao, setOptionsSystemManutencao] = useState([]);
  const [optionsTipoComercial, setOptionsTipoComercial] = useState([]);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [optionsSubCategory, setOptionsSubCategory] = useState([]);
  const [optionsTypeAuthorization, setOptionsTypeAuthorization] = useState([]);
  const [optionsHourLimit, setOptionsHourLimit] = useState([]);
  const [optionsJobApi, setOptionsJobApi] = useState([]);
  const [optionsModuloChamados, setOptionsModuloChamados] = useState([]);
  const [optionsModuloFases, setOptionsModuloFases] = useState([]);
  const [optionsJobSystem, setOptionsJobSystem] = useState([]);
  const [optionsJobSystemType, setOptionsJobSystemType] = useState([]);
  const [optionsJobSystemType1, setOptionsJobSystemType1] = useState([]);
  const [optionsJobSystemAux, setOptionsJobSystemAux] = useState([]);
  const [optionsJobSystemAux2, setOptionsJobSystemAux2] = useState([]);
  const [optionsJobSystemAux3, setOptionsJobSystemAux3] = useState([]);
  const [optionsResponsavel, setOptionsResponsavel] = useState([]);
  const [checkboxs, setCheckboxs] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterValue, setFilterValue] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [tipo, setTipo] = useState(tipoInitial);
  const [id, setId] = useState("");
  const [idFrequency, setIdFrequency] = useState(frequencyInitial);
  const [idFrequencyAux, setIdFrequencyAux] = useState(frequencyAuxInitial);
  const [dateStart, setDateStart] = useState(dateStartInitial);
  const [dateEnd, setDateEnd] = useState(dateEndInitial);
  const [idSystem, setIdSystem] = useState('');
  const [idCategory, setIdCategory] = useState(categoryInitial);
  const [idSubcategory, setIdSubcategory] = useState((props?.subcategory?.id ?props?.subcategory?.id : ''));
  const [idTypeAuthorization, setIdTypeAuthorization] = useState(props?.subsubcategory?.id ? props?.subsubcategory?.id : '');
  const [hourLimit, setHourLimit] = useState(hourLimitInitial);
  const [title, setTitle] = useState((props.job ? props.job : ''));
  const [description, setDescription] = useState((props.description?props.description:''));
  const [urlVideo, setUrlVideo] = useState("");
  const [idModuloChamado, setIdModuloChamado] = useState(moduloChamadosInitial);
  const [idModuloFase, setIdModuloFase] = useState(moduloFasesInitial);
  const [moduloChamadoVisible, setModuloChamadoVisible] = useState(false);
  const [idModulo, setIdModulo] = useState([(props.fases ? filterModule : '')]);
  const [idJobApi, setIdJobApi] = useState('');
  const [idJobSystem, setIdJobSystem] = useState(idJobSystemInitial);
  const [nomeIntegracao, setNomeIntegracao] = useState('');
  const [idJobSystemType, setIdJobSystemType] = useState(idJobSystemTypeInitial);
  const [idJobSystemType1, setIdJobSystemType1] = useState(idJobSystemType1Initial);
  const [idJobSystemType2, setIdJobSystemType2] = useState("");
  const [disableJob, setDisableJob] = useState('');
  const [idUsers, setIdUsers] = useState(userInitial);
  const [idStore, setIdStore] = useState(storeInitial);
  const [idOffice, setIdOffice] = useState(officeInitial);
  const [idDepartment, setIdDepartment] = useState(departmentInitial);
  const [idGroup, setIdGroup] = useState((props.id_group ? props.id_group : ''));
  const [cliente, setCliente] = useState('');
  const [lojaSolicitante, setLojaSolicitante] = useState('');
  const [anexo, setAnexo] = useState([]);
  const [system, setSystem] = useState(systemInitial);
  const [ativo, setAtivo] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [risk, setRisk] = useState(false);
  const [agendar, setAgendar] = useState(false);
  const [validation, setValidation] = useState(validationInitial);
  const [alert, setAlert] = useState(alertInitial);
  const [cardsList, setCardsList] = useState([]);
  const [microssistema, setMicrossistema] = useState(microssistemaInitial);
  const [microssistemaValidation, setMicrossistemaValidation] = useState(false);
  const [microssistemaValues, setMicrossistemaValues] = useState(null);
  const [atalhosCategoria, setAtalhosCategoria] = useState([]);
  const [atalhosSubcategoria, setAtalhosSubcategoria] = useState([]);
  const [loadImporter, setLoadImporter] = useState(false);
  const [showModalPlanilha, setShowModalPlanilha] = useState(false);
  const [limitarCargos, setLimitarCargos] = useState([]);
  const [peso, setPeso] = useState(pesoInitial);
  const [responsavel, setResponsavel] = useState(responsavelInitial);
  const [idTipoComercial, setIdTipoComercial] = useState('');
  const [loading, setLoading] = useState({});
  const [idUsuarioResponsavel, setIdUsuarioResponsavel] = useState('');
  const [optionsUsuariosResponsaveis, setOptionsUsuariosResponsaveis] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // ESTADOS DE FILTROS USUÁRIOS E LOJAS
  const [filterCargo, setFilterCargo] = useState(null);
  const [filterDepartamento, setFilterDepartamento] = useState(null);
  const [filterMarca, setFilterMarca] = useState(null);
  const [filterRegiao, setFilterRegiao] = useState(null);
  const [filterSegmento, setFilterSegmento] = useState(null);

  // VERIFICA SE TODOS OS CAMPOS OBRIGATÓRIOS DO MICROSSISTEMA FORAM PREENCHIDOS
  const handleMicrossistemaCallback = (e) => {
    setMicrossistemaValidation(e.validation);

    let data = [];

    if(e.values){
      e.values.map((item, i) => {
        data.push({
          valor: item.value,
          opcao_id: '',
          secao_id: item.loja_id,
          loja_id_aux: '',
          item_id: item.id
        });
      });
    } 

    setMicrossistemaValues({
      data: data,
      tipo: 'Loja',
      microssistema_id: microssistema,
      job_id: '',
      job_data: '',
      type_system: 'microssistemas'
    });
    setMicrossistemaValuesModified(true);
  }

  // SETAR ANEXO
  const handleSetAnexo = (response) => {
    setAnexo(response[0]);
    setAnexoModified(true);
  };

  // SETAR LIMITAÇÃO POR CARGO
  const handleSetLimitarCargos = (e) => {
    setLimitarCargos(e);
    setLimitarCargosModified(true);
  }

  // VERIFICA ANEXO E MANDA PRO CALLBACK
  useEffect(() => {
    if(props?.callback && props?.button){
      props?.callback({
        file: (anexo.length > 0 ? true : false)
      });
    }
  }, [anexo]);

  // BOX DE USUÁRIOS
  function listUsers(tipo, clear) {
    if((!props.avulso && box_user_aux) || conf_tipo_comercial){
      setCheckboxs([]);
      setLoadingUser(true);
      if(!props?.id_job_system_type1){
        setIdJobSystemType1([]);
      }
      setIdJobSystemType2([]);

      // DEFINE URL DE USUÁRIOS
      let url;
      let params;
      let table_aux;
      let type_phase_aux;
      let type_operator_aux;
      let filter_id_module_aux;
      let limit_aux;

      limit_aux = {limit: 10000};

      // FILTROS
      let filter_aux = {
        type_phase: type_phase_aux,
        id_module: filter_id_module_aux,
        type_operator: type_operator_aux,
        limit: limit_aux
      }

      if(props.chamados){
        table_aux = 'operator';
        type_phase_aux = 'Operação';
        filter_id_module_aux = filterModule;
        type_operator_aux = tipo === 'loja' ? 'store' : 'user';

        filter_aux = {
          ...filter_aux,
          table_aux: 'operator',
          type_phase: 'Operação',
          id_module: filterModule,
          type_operator: tipo === 'loja' ? 'store' : 'user'
        }
      }else{
        if(tipo === 'loja'){
          table_aux = 'store';

          // ADICIONA FILTROS EXTRAS À REQUISIÇÃO DE LOJAS
          filter_aux = {
            ...filter_aux,
            id_marca: filterMarca,
            id_regiao: filterRegiao,
            id_segmento: filterSegmento
          }
        }else if(tipo === 'usuario'){
          table_aux = 'user';

          // FAZ SPLIT NOS ID'S DE DEPARTAMENTOS
          let departamento_aux = [];
          filterDepartamento?.map((item, i) => {
            item?.split(',')?.map((item, i) => {
              departamento_aux.push(item);
            })
          });

          // ADICIONA FILTROS EXTRAS À REQUISIÇÃO DE USUÁRIOS
          filter_aux = {
            ...filter_aux,
            id_cargo: filterCargo,
            id_departamento: departamento_aux
          }
        }else if(tipo === 'cargo'){
          table_aux = 'office';
        }else if(tipo === 'departamento'){
          table_aux = 'department';
        }
      }

      url = window.host_madnezz+"/systems/integration-react/api/request.php?type=Job";
      params = {
        db_type: global.db_type,
        do: 'getTable',
        tables: [{
          table: table_aux,
          filter: filter_aux
        }]
      }

      axios({
        method: 'get',
        url: url,
        params: params,
        signal: abortUsers.current.signal
      }).then((response) => {
        setLoadingUser(false);

        if(response.data){
          if(props.chamados){
            setCheckboxs(response?.data?.data?.operator);
          }else{
            if(tipo === 'loja'){  
              setCheckboxs(response?.data?.data?.store);

              // OPÇÕES DE LOJAS NA INTEGRAÇÃO DE SISTEMA
              if(optionsJobSystemType1.length == 0){
                setOptionsJobSystemType1(response?.data?.data?.store);
              }
            }else if(tipo === 'usuario'){
              setCheckboxs(response?.data?.data?.user);
              setOptionsUsuariosResponsaveis(response?.data?.data?.user);
            }else if(tipo === 'cargo'){
              setCheckboxs(response?.data?.data?.office);
            }else if(tipo === 'departamento'){
              setCheckboxs(response?.data?.data?.department);
            }else{
              setCheckboxs(response?.data?.data?.operator);
            }
          }          
        }      

        if(!clear){
          if(props.id_usr){        
            setIdUsers([...idUsers?.filter((elem) => elem?.id != props.id_usr), { id: props.id_usr, date_start: dateStart, hour_limit: hourLimit }]);
          }

          if(props.id_lja){
            setIdStore([...idStore?.filter((elem) => elem?.id != props.id_lja), { id: props.id_lja, date_start: dateStart, hour_limit: hourLimit }]);
          }

          if(props.id_office){
            setIdOffice([...idOffice?.filter((elem) => elem?.id != props.id_office), { id: props.id_office, date_start: dateStart, hour_limit: hourLimit }]);
          }

          if(props.id_department){
            setIdDepartment([...idDepartment?.filter((elem) => elem?.id != props.id_department), { id: props.id_department, date_start: dateStart, hour_limit: hourLimit }]);
          }
        }
      })
    }
  }

  // FAZ A BUSCA DOS CHECKBOX'S SEMPRE QUE SOFRE ALTERAÇÃO NOS FILTROS
  useEffect(() => {
    if(filterCargo || filterDepartamento || filterMarca || filterRegiao || filterSegmento){
      abortUsers.current.abort();
      abortUsers.current = new AbortController();
      listUsers(tipo);
    }
  },[filterCargo, filterDepartamento, filterMarca, filterRegiao, filterSegmento]);

  // BUSCA SUBCATEGORIAS SE VIER SETADO ALGUMA CATEGORIA
  useEffect(() => {
    if(props?.category && showModal){
      changeCategory(props?.category);
    }
  },[props?.category, showModal]);

  const loadUsers = (users) => {
    const usuarios = {};
    for (let i = 0; i < users.length; i += 1) {
      usuarios[users[i].value] = {
        value: Number(users[i].value),
        label: users[i].label,
        hour: hourLimit,
      };
    }
  };

  useEffect(() => {
    loadUsers(checkboxs);
  },[checkboxs, hourLimit]); 

  const optionsDisableJob = [
    {value: 1, label: 'Finalizar'},
    {value: 2, label: 'Não tem'},
    {value: 3, label: 'Anexo'},
    {value: 4, label: 'Adiar'},
    {value: 5, label: 'Chat'},
    // {value: 6, label: 'Notificações de WhatsApp'},
    { value: 7, label: "Aprovar" },
    { value: 8, label: "Reprovar" },
    { value: 9, label: "Reabrir" }
  ]

  // PRIORIDADES
  const optionsPriority = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
  ];

  // TIPOS TRADE
  const optionsTiposTrade = [
    { value: 1, label: 'Grupo' },
    { value: 2, label: 'Indústria/Produto'}
  ]

  // ESTADOS PARA VERIFICAR SE OS CAMPOS DO FORMULÁRIO SOFRERAM ALTERAÇÃO
  const [anexoModified, setAnexoModified] = useState(false);
  const [idFrequencyModified, setIdFrequencyModified] = useState(false);
  const [idFrequencyAuxModified, setIdFrequencyAuxModified] = useState(false);
  const [disableJobModified, setDisablejobModified] = useState(false);
  const [idModuloModified, setIdModuloModified] = useState(false);
  const [idSystemModified, setIdSystemModified] = useState(false);
  const [idCategoryModified, setIdCategoryModified] = useState(false);
  const [idSubcategoryModified, setIdSubcategoryModified] = useState(false);
  const [idTypeAuthorizationModified, setIdTypeAuthorizationModified] = useState(false);
  const [idjobApiModified, setIdJobApiModified] = useState(false);
  const [idJobSystemModified, setIdJobSystemModified] = useState(false);
  const [urlVideoModified, setUrlVideoModified] = useState(false);
  const [hourLimitModified, setHourLimitModified] = useState(false);
  const [descriptionModified, setDescriptionModified] = useState(false);
  const [dateStartModified, setDateStartModified] = useState(false);
  const [dateEndModified, setDateEndModified] = useState(false);
  const [titleModified, setTitleModified] = useState(false);
  const [idUsersModified, setIdUsersModified] = useState(false);
  const [idStoreModified, setIdStoreModified] = useState(false);
  const [idOfficeModified, setIdOfficeModified] = useState(false);
  const [idDepartmentModified, setIdDepartmentModified] = useState(false);
  const [systemModified, setSystemModified] = useState(false);
  const [ativoModified, setAtivoModified] = useState(false);
  const [urgentModified, setUrgentModified] = useState(false);
  const [sendEmailModified, setSendEmailModified] = useState(false);
  const [clienteModified, setClienteModified] = useState(false);
  const [lojaSolicitanteModified, setLojaSolicitanteModified] = useState(false);
  const [microssistemaValuesModified, setMicrossistemaValuesModified] = useState(false);
  const [riskModified, setRiskModified] = useState(false);
  const [limitarCargosModified, setLimitarCargosModified] = useState(false);
  const [pesoModified, setPesoModified] = useState(false);
  const [responsavelModified, setResponsavelModified] = useState(false);

  // RESETA ESTADOS DAS MODIFICAÇÕES
  function resetModifiers(){
    setAnexoModified(false);
    setIdFrequencyModified(false);
    setIdFrequencyAuxModified(false);
    setDisablejobModified(false);
    setIdModuloModified(false);
    setIdSystemModified(false);
    setIdCategoryModified(false);
    setIdSubcategoryModified(false);
    setIdTypeAuthorizationModified(false);
    setIdJobApiModified(false);
    setIdJobSystemModified(false);
    setUrlVideoModified(false);
    setHourLimitModified(false);
    setDescriptionModified(false);
    setDateStartModified(false);
    setDateEndModified(false);
    setTitleModified(false);
    setIdUsersModified(false);
    setIdStoreModified(false);
    setSystemModified(false);
    setAtivoModified(false);
    setUrgentModified(false);
    setSendEmailModified(false);
    setClienteModified(false);
    setLojaSolicitanteModified(false);
    setRiskModified(false);
    setMicrossistemaValuesModified(false);
    setLimitarCargosModified(false);
    setPesoModified(false);
    setResponsavelModified(false);
  }

  // AUXILIAR DE CONDIÇÃO PARA ENVIAR DADOS
  let condition_aux = (props?.model?.edit === false || props.empty);

  // VALORES PARA ENVIO DO FORMULÁRIO
  const data = {
    files: ((anexoModified && !props.empty) || condition_aux ? [anexo] : undefined),
    id: (props?.model?.edit === false || props.empty || condition_aux ? undefined : id),
    id_frequency: idFrequency,
    id_frequency_aux: idFrequencyAux,
    disable_job: ((disableJobModified && !props.empty) || condition_aux ? disableJob : undefined),
    apl: ((idModuloModified && !props.empty) || condition_aux ? (idModulo?.length > 0 ? JSON.stringify(idModulo) : undefined) : undefined),
    id_system: ((idSystemModified && !props.empty) || condition_aux ? idSystem : undefined),
    id_category: ((idCategoryModified && !props.empty) || condition_aux ? idCategory : undefined),
    id_subcategory: ((idSubcategoryModified && !props.empty) || condition_aux ? idSubcategory : undefined),
    id_subsubcategory: ((idTypeAuthorizationModified && !props.empty) || condition_aux ? idTypeAuthorization : undefined),
    id_group: idGroup,
    job_api: ((idjobApiModified && !props.empty) || condition_aux ? idJobApi : undefined),
    id_system_api: ((idJobSystemModified && !props.empty) || condition_aux ? idJobSystem : undefined),
    aux_system_api: (((idJobSystemModified && !props.empty) || condition_aux) && (idJobSystem?.length > 0 || idJobSystemType?.length > 0 || idJobSystemType1?.length > 0 || idJobSystemType2?.length > 0) ? JSON.stringify({job_system_integration: idJobSystem, job_system_integration_type: idJobSystemType, job_system_integration_type_1: idJobSystemType1, job_system_integration_type_2: idJobSystemType2}) : undefined),
    url_video: ((urlVideoModified && !props.empty) || condition_aux ? urlVideo : undefined),
    hour_limit: ((hourLimitModified && !props.empty) || condition_aux ? (hourLimit ? hourLimit : '23:59:59') : undefined),
    description: ((descriptionModified && !props.empty) || condition_aux ? description : undefined),
    date_start: ((dateStartModified && !props.empty) || condition_aux ? (dateStart ? get_date('date_sql', cd(dateStart)) : '') : undefined),
    date_end: ((dateEndModified && !props.empty) || condition_aux ? (dateEnd ? get_date('date_sql', cd(dateEnd)) : '') : undefined),
    title: ((titleModified && !props.empty) || condition_aux ? (conf_title ? title : 'Chamado') : undefined),
    id_user: (idUsers.length > 0 ? JSON.stringify(idUsers) : undefined),
    id_store: (idStore.length > 0 ? JSON.stringify(idStore) : undefined),
    id_office: (idOffice.length > 0 ? JSON.stringify(idOffice) : undefined),
    id_department: (idDepartment.length > 0 ? JSON.stringify(idDepartment) : undefined),
    id_not: (idUsers.length == 0 && idStore.length == 0 && idOffice.length == 0 && idDepartment.length == 0 ? JSON.stringify([{id: 0, date_start: (dateStart ? get_date('date_sql', cd(dateStart)) : ''), hour_limit: hourLimit}]) : undefined),
    access_permission: ((limitarCargosModified && !props.empty) || condition_aux ? (limitarCargos.length > 0 ? JSON.stringify(limitarCargos) : undefined) : undefined),
    ativo: ((ativoModified && !props.empty) || condition_aux ? (ativo ? 1 : 0) : undefined),
    urgent: ((urgentModified && !props.empty) || condition_aux ? (urgent ? 1 : undefined) : undefined),
    send_email: ((sendEmailModified && !props.empty) || condition_aux ? (sendEmail ? 1 : 0) : undefined),
    id_client: ((clienteModified && !props.empty) || condition_aux ? cliente : undefined),
    id_loja: ((lojaSolicitanteModified && !props.empty) || condition_aux ? lojaSolicitante : undefined),
    form_system_integration: ((microssistemaValuesModified && !props.empty) || condition_aux ? (microssistemaValues ? JSON.stringify(microssistemaValues) : undefined) : undefined),
    model: ((props?.model && props.empty) || props?.model?.edit ? 1 : undefined),
    coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
    id_priority: ((riskModified && !props.empty) || condition_aux ? (risk ? 7 : 0) : undefined), // COM RISCO (7), SEM RISCO (0),
    points: ((pesoModified && !props.empty) || condition_aux ? peso : undefined),
    id_user_responsible: ((responsavelModified && !props.empty) || condition_aux ? responsavel : undefined),
    id_type: idTipoComercial,
    id_user_responsible: idUsuarioResponsavel,
    funcionarios: funcionarios?.length > 0 ? funcionarios : undefined
  };

  // ZERA O VALOR DA DATA DE INÍCIO E FIM SE MUDAR A FREQUÊNCIA
  useEffect(() => {
    if(loaded){
      if(idFrequency == global.frequencia.unico){
        setDateEnd(dateStart);
        setDateEndModified(true);
      }

      setIdFrequencyAux(''); // ZERA OPÇÃO DA FREQUÊNCIA SE ALTERAR ELA
    }    
  },[idFrequency]);

  // VALIDAÇÃO FORM
  function validacaoForm() {
    let validation_aux = true;
    let toast_aux = false;

    // VERIFICAÇÕES SE FOR JOBS
    if(!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length && !system.filter((elem) => elem.id == '229').length && !system.filter((elem) => elem.id == '231').length){

      // SE NÃO TIVER NENHUMA LOJA OU USUÁRIO SELECIONADO
      if(idStore.length === 0 && idUsers.length === 0 && idOffice.length === 0 && idDepartment.length === 0){
        toast_aux = 'É necessário selecionar alguma loja, usuário, cargo ou departamento antes de salvar';
        validation_aux = false;
      }
    }

    // VERIFICAÇÕES SE FOR CHAMADOS
    if(system.filter((elem) => elem.id == '224').length){

      // SE A FREQUÊNCIA FOR DIFERENTE DE ÚNICA
      if (idFrequency != global.frequencia.unico) {
        toast_aux = 'Para que o card seja incluído em Chamados, Fases ou Comunicados, a frequência precisa ser única';
        validation_aux = false;
      }  

      // SE NÃO TIVER NENHUMA LOJA OU USUÁRIO SELECIONADO
      if((!microssistemaValidation) && (microssistema) && (risk) && window.rs_id_grupo == 2 ){
        toast_aux = 'Preencha todos os campos obrigatórios antes de enviar.';
        validation_aux = microssistemaValidation;
      }
    }

    // VERIFICAÇÕES SE FOR FASES
    if(system.filter((elem) => elem.id == '225').length){

      // SE A FREQUÊNCIA FOR DIFERENTE DE ÚNICA
      if (idFrequency != global.frequencia.unico) {
        toast_aux = 'Para que o card seja incluído em Chamados, Fases ou Comunicados, a frequência precisa ser única';
        validation_aux = false;
      }
    }

    // VERIFICAÇÕES SE FOR VISITAS
    if(system.filter((elem) => elem.id == '226').length){

      // SE NÃO TIVER NENHUMA LOJA OU USUÁRIO SELECIONADO
      if (idStore.length === 0 && idUsers.length === 0 && idOffice.length === 0 && idDepartment.length === 0) {
        toast_aux = 'É necessário selecionar alguma loja, usuário, cargo ou departamento antes de salvar';
        validation_aux = false;
      }

      // SE A FREQUÊNCIA FOR DIFERENTE DE MENSAL E O CARD NÃO FOR AVULSO OU ESTIVER SENDO EDITADO
      if (idFrequency != global.frequencia.mensal && idFrequency != global.frequencia.unico) {
        toast_aux = 'Para que o card seja incluído em Visitas, a frequência precisa ser única ou mensal';
        validation_aux = false;
      }
    }

    // VERIFICAÇÕES SE FOR COMUNICADOS
    if(system.filter((elem) => elem.id == '229').length){

      // SE A FREQUÊNCIA FOR DIFERENTE DE ÚNICA
      if (idFrequency != global.frequencia.unico) {
        toast_aux = 'Para que o card seja incluído em Comunicados, a frequência precisa ser única';
        validation_aux = false;
      }

      // SE ESTIVER SELECIONADO OS SISTEMAS CHAMADOS, FASES OU VISITAS
      if(system.filter((elem) => elem.id == '224').length || system.filter((elem) => elem.id == '225').length || system.filter((elem) => elem.id == '226').length){
        toast_aux = 'Não é possível gerar um comunicado se o card estiver vinculado a Chamados, Fases ou Visitas';
        validation_aux = false;
      }

      // SE NÃO TIVER NENHUMA LOJA OU USUÁRIO SELECIONADO
      if(idStore.length === 0 && idUsers.length === 0){
        toast_aux = 'É necessário selecionar algum usuário antes de salvar';
        validation_aux = false;
      }
    }

    // VERIFICAÇÕES SE FOR NOTIFICAÇÕES
    if(system.filter((elem) => elem.id == '231').length){

      // SE A FREQUÊNCIA FOR DIFERENTE DE ÚNICA
      if (idFrequency != global.frequencia.unico) {
        toast_aux = 'Para que o card seja incluído em Notificações, a frequência precisa ser única';
        validation_aux = false;
      }

      // SE ESTIVER SELECIONADO OS SISTEMAS CHAMADOS, FASES OU VISITAS
      if(system.filter((elem) => elem.id == '224').length || system.filter((elem) => elem.id == '225').length || system.filter((elem) => elem.id == '226').length){
        toast_aux = 'Não é possível gerar uma Notificação se o card estiver vinculado a Chamados, Fases ou Visitas';
        validation_aux = false;
      }

      // SE NÃO TIVER NENHUMA LOJA OU USUÁRIO SELECIONADO
      if(idStore.length === 0 && idUsers.length === 0){
        toast_aux = 'É necessário selecionar algum usuário antes de salvar';
        validation_aux = false;
      }
    }

    // DEFINE VALIDAÇÃO
    setAlert(toast_aux);
    setValidation(validation_aux);
  }

  // CHECA VALIDAÇÃO PELO COMPONENTE PAI
  useEffect(() => {
    if(props?.button){
      setValidation(props?.button?.validation);
    }
  },[props?.button?.validation]);

  useEffect(() => {
    validacaoForm();
  },[showModal, idUsers, idStore, idFrequency, system, tipo, microssistemaValidation, microssistema, risk, idTypeAuthorization]);

  // REMOVE OPÇÕES DE SELECIONAR LOJA OU USUÁRIO CASO O SISTEMA "FASES" ESTEJA SELECIONADO
  useEffect(() => {
    if(system.filter((elem) => elem.id == '225').length){
      if(loaded){
        setIdStore([]);      
        setIdStoreModified(true);
        setIdUsers([]);
        setIdUsersModified(true);
      }
    }
  },[system]);

  // REMOVE MÓDULOS SELECIONADOS CASO O CHAMADOS OU FASES SEJAM DESATIVADOS
  useEffect(() => {
    if(!system.filter((elem) => elem.id == '224').length){
      setIdModuloChamado('');
    }

    if(!system.filter((elem) => elem.id == '225').length){
      setIdModuloFase('');
    }
  },[system]);

  // FUNÇÕES AO ABRIR MODAL
  function handleShowModal(tipo=undefined){
    setShowModal(true);    
    setLoadingForm(true);
    
    if(props?.get_formOptions !== false){
      axios({
        method: 'get',
        url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
        params: {
          db_type: global.db_type,
          do: 'getTable',
          tables: [
            {table: 'job', filter: {id: (id ? id : 0)}},
            {table: 'jobStatus', filter: {id_job: (id ? id : 0)}},
            {table: 'frequency'},
            {table: 'frequencyAux'},
            {table: 'category', filter: {id_sistema_not_is_null: window.rs_sistema_id == global.sistema.manutencao_madnezz ? 1 : undefined}},
            {table: 'hourLimit'},
            {table: 'APIJob'},
            {table: 'systemJob'},
            {table: 'moduleChamados'},
            {table: 'moduleFases'},
            {table: 'client'},
            (props.chamados ? {table: 'store', filter: {permission:'true',limit: {limit: 10000}}} : {}),
            {table: 'enterprise'},
            {table: 'jobAccessPermission', filter: {id_job: (id ? id : 0)}},
            {table: 'jobAPL', filter: {id_job: (id ? id : 0)}},
            {table: 'jobLote', filter: {id_job: (id ? id : 0)}},
            {table: 'APLjob'},
            (!props.chamados && !props.fases && !props.visitas ? {table: 'user', filter: {limit: {limit: 10000}}} : {}),
            (conf_tipo_comercial ? {table: 'optionAux'} : {})
          ]
        }
      }).then((response) => {        
        if(response?.data?.data?.APLjob){
          let system_aux = response?.data?.data?.APLjob;
          if(props.chamados){
              system_aux.unshift({value: 224, label: 'Chamados', disabled: true});
          }

          if(props.fases){
              system_aux.unshift({value: 225, label: 'Fases', disabled: true});
          }

          if(props.visitas){
              system_aux.unshift({value: 226, label: 'Visitas', disabled: true});
          }

          if(props.comunicados){
              system_aux.unshift({value: 229, label: 'Comunicados', disabled: true});
          }

          if(props.notificacoes){
              system_aux.unshift({value: 231, label: 'Notificações', disabled: true});
          }

          handleSetOptionsSystems(system_aux);
        }

        setOptionsFrequency((window.rs_id_emp==26 && !props.notificacoes && !props.comunicados && !props.visitas && !props.fases && !props.chamados && window.rs_permission_apl !== 'master'?  response?.data?.data?.frequency?.filter((elem) => elem.id != 4) : response?.data?.data?.frequency));
        setOptionsFrequencyAux(response?.data?.data?.frequencyAux);
        setOptionsTipoComercial(response?.data?.data?.optionAux);
        let categories_aux=response?.data?.data?.category;
        if(response?.data?.data?.category?.length > 0){
          categories_aux=categories_aux.filter((elem) => elem.id != 745);
        }
        setOptionsCategory(categories_aux);
        setOptionsResponsavel(response?.data?.data?.user);

        // NECESSÁRIO PARA REMOVER OS DOIS "00" DO FINAL DA HORA
        let hourLimit_aux = [];
        if(response?.data?.data?.hourLimit){
          response?.data?.data?.hourLimit.map((item, i) => {
            hourLimit_aux.push(
              {value: item?.id, label: item?.nome.slice(0,5)}
            );
          });
        }
        setOptionsHourLimit(hourLimit_aux);

        setOptionsJobApi(response?.data?.data?.APIJob);
        setOptionsJobSystem(response?.data?.data?.systemJob);
        setOptionsModuloChamados(response?.data?.data?.moduleChamados);
        setOptionsModuloFases(response?.data?.data?.moduleFases);
        setOptionsCliente(response?.data?.data?.client);
        setOptionsLojaSoliciante(response?.data?.data?.store);

        // PARAMETRO DO VISITAS PARA CRIAR VISITAS AVULSAS
        if(props?.avulso && response?.data?.hour_limit.length > 0){
          setHourLimit(response?.data?.data?.hourLimit[response?.data?.data?.hourLimit.length - 1].value);
        }

        setLoadingForm(false);
      },[]);
    }
    
    // SE PASSAR O VALOR DIRETAMENTE NA FUNÇÃO
    if(tipo){
      setTimeout(() => {
        setTipo(tipo);
        listUsers(tipo);
      }, 500);
    }else{
      setTimeout(() => {
        if (props?.tipo) {
          setTipo(props?.tipo);
          listUsers(props?.tipo);
        } else {
          setTipo((props.chamados || props.visitas || props.fases ? 'usuario' : (props.id_lja ? 'loja' : (props.id_usr ? 'usuario' : 'loja'))), false);
          listUsers((props.chamados || props.visitas || props.fases ? 'usuario' : (props.id_lja ? 'loja' : (props.id_usr ? 'usuario' : 'loja'))), false);
        }
      }, 500);
    }

    setShortcutSelected(false);
  }

  // SE ESTIVER NO SISTEMA "MANUTENÇÃO" MONTA O SELECT DE SISTEMAS
  useEffect(() => {
    if(showModal && window.rs_sistema_id == global.sistema.manutencao_madnezz){
      if(optionsSystemManutencao.length == 0){
        axios({
          method: 'get',
          url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
          params: {
            db_type: global.db_type,
            do: 'getTable',
            tables: [{table: 'enterpriseSystem',
              filter: {
                // id_emp: window.rs_id_emp,
                id_sistema: '|NOT VALUE|'
              }
            }]
          }
        }).then((response) => {
          if(response?.data?.data?.enterpriseSystem){
            setOptionsSystemManutencao(response.data?.data?.enterpriseSystem);         
          }
        });
      }
    }
  },[showModal, cliente]);

  // FUNÇÕES AO FECHAR MODAL
  function handleCloseModal(submit, internal){    
    setShowModal(false); 
    setAnexo([]);
    setId("");
    setTipo("");
    setIdUsers([]);
    setIdStore([]);
    setIdFrequency(frequencyInitial);
    setIdFrequencyAux(frequencyAuxInitial);
    setDateStart(dateStartInitial);
    setDateEnd(dateEndInitial);
    setHourLimit(hourLimitInitial);
    setIdModuloChamado(moduloChamadosInitial);
    setIdModuloFase(moduloFasesInitial);
    setTitle((props.job ? props.job : ''));
    setDescription((props.description?props.description:''));
    setUrlVideo("");
    setIdJobApi("");
    setIdJobSystem(idJobSystemInitial);
    setIdJobSystemType1(idJobSystemType1Initial);
    setIdJobSystemType2([]);
    setSystem(systemInitial);
    setAtivo(true);
    setUrgent(false);
    setSendEmail(false);
    setRisk(false);
    setAgendar(false);
    setDisableJob([]);
    setCliente('');
    setLojaSolicitante('');
    setHideTipo(false);
    setIdGroup((props.id_group ? props.id_group : undefined));
    setPeso(pesoInitial);
    setResponsavel(responsavelInitial);
    setIdTipoComercial('');
    setIdUsuarioResponsavel('');
    setFuncionarios([]);
    setFilterCargo(null);
    setFilterDepartamento(null);
    setFilterMarca(null);
    setFilterRegiao(null);
    setFilterSegmento(null);

    if(submit){
      if(submit){
        setTimeout(() => {
          if(!props?.id_group){
            // refreshCalendar(false); // FALSE PARA NÃO FAZER A ANIMAÇÃO DE LOADING
            // loadingCalendar();  

            if(props?.reload){
              props?.reload(props?.id_job_status);
            }
          }else{
            // SE TIVER ID GROUP MANDA O REFRESH CARD COM O ID DELE
            props?.refreshCard(props?.id_job_status_parent);
          }

          if(internal){ // SE O CARD CADASTRADO FOR INTERNO
            if(props.onCloseAux){
              props?.onCloseAux(true);
            }
          }else{
            if(props.onCloseAux){
              props?.onCloseAux(false);
            }
          }
        },500);
      }

      if(props.onClose){ // SE TIVER RETORNANDO ALGO NO CALLBACK
        props.onClose(false);
        if(!props?.id_group){
          if(props?.refreshCalendar){
            props.refreshCalendar(false);
          }
          loadingCalendar();  
        }
      }

      if(props?.id_group){ // SE ESTIVER CADASTRANDO UM JOB INTERNO RETORNA UM CALLBACK PARA RECARREGAR OS CARDS INTERNOS
        props?.callback(true);

        setTimeout(() => {
          props?.callback(false);
        },100);
      }
    }

    // RESETA SELECTS
    setSystem(systemInitial);
    setIdSystem('');
    setIdCategory(categoryInitial);
    setIdSubcategory((props?.subcategory?.id ? props?.subcategory?.id : ''));
    setIdTypeAuthorization((props?.subsubcategory?.id ? props?.subsubcategory?.id : ''));
    setMicrossistema(microssistemaInitial);
    setMicrossistemaValidation(false);
    setMicrossistemaValues(null);

    if(props.onClose){ // SE TIVER RETORNANDO ALGO NO CALLBACK
      props.onClose(false);
    }

    if(!submit){
      setShowModal(false); 
    }

    setLoaded(false);

    // CHAMA FUNÇÃO QUE RESETA MODIFICADORES
    resetModifiers();
  }

  // FUNÇÕES AO ABRIR MODAL DE ATALHOS
  function handleShowModalAtalhos() {
    setShowModalAtalhos(true);

    axios({
      method: 'get',
      url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
      params: {
        db_type: global.db_type,
        do: 'getTable',
        tables: [
          {table: 'category', filter: {filter_has_shortcut: 1}}
        ]
      }
    }).then((response) => {
      if(response.data){
        setAtalhosCategoria(response?.data?.data?.category);
      }
    });

    axios({
      method: 'get',
      url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
      params: {
        db_type: global.db_type,
        do: 'getTable',
        tables: [
          {table: 'subcategory', filter: {filter_has_shortcut: 1}}
        ]
      }
    }).then((response) => {
      if(response.data){
        setAtalhosSubcategoria(response?.data?.data?.subcategory);
      }
    });
  }

  // FUNÇÕES AO FECHAR MODAL DE ATALHOS
  function handleCloseModalAtalhos(){
    setShowModalAtalhos(false);
  }

  // FUNÇÃO PARA TROCAR DE FASE APÓS CADASTRAR CARD INTERNO
  function handleResponse(e){
    if(props.onCloseAux){
      props?.onCloseAux(e[0].lote);
    }
  }

  function editarJob(id, lote) {
    setLoaded(false); // ESTADO PARA INFORMAR QUE AS INFORMAÇÕES AINDA NÃO FORAM CARREGADAS
    setLoadingForm(true); // ATIVA ANIMAÇÃO DE CARREGAMENTO DOS CAMPOS DO FORM

    if (props?.get_formOptions !== false) {
      if(id){
        setId(id);
      }

      // DEFINE FILTRO DE APL
      let id_apl_aux;

      if(props.chamados){
        id_apl_aux = 224;
      }else if(props.fases){
        id_apl_aux = 225;
      }else if(props.visitas){
        id_apl_aux = 226;
      }else if(props.comunicados){
        id_apl_aux = 229;
      }else{
        id_apl_aux = 223;
      }

      axios({
        method: 'get',
        url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
        params: {
          db_type: global.db_type,
          do: 'getTable',
          tables: [
            {table: 'job', filter: {id: (id ? id : 0)}},
            {table: 'frequency'},
            {table: 'frequencyAux'},
            {table: 'category', filter: {id_apl: id_apl_aux, id_sistema_not_is_null: window.rs_sistema_id == global.sistema.manutencao_madnezz ? 1 : undefined}},
            {table: 'hourLimit'},
            {table: 'APIJob'},
            {table: 'systemJob'},
            {table: 'moduleChamados'},
            {table: 'moduleFases'},
            {table: 'client'},
            (props.chamados ? {table: 'store', filter: {permission:'true',limit: {limit: 10000}}} : {}),
            {table: 'enterprise'},
            {table: 'jobAPL', filter: {id_job: (id ? id : 0)}},
            {table: 'jobLote', filter: {id_job: (id ? id : 0)}},
            {table: 'APLjob'},
            (!props.chamados && !props.fases && !props.visitas ? {table: 'user', filter: {limit: {limit: 10000}}} : {})       
          ]
        }
      }).then((response) => {
        setLoadingForm(false); // DESATIVA ANIMAÇÃO DE CARREGAMENTO DOS CAMPOS DO FORM

        if(response?.data?.data?.APLjob){
          let system_aux = response?.data?.data?.APLjob;
          if(props.chamados){
              system_aux.unshift({value: 224, label: 'Chamados', disabled: true});
          }

          if(props.fases){
              system_aux.unshift({value: 225, label: 'Fases', disabled: true});
          }

          if(props.visitas){
              system_aux.unshift({value: 226, label: 'Visitas', disabled: true});
          }

          if(props.comunicados){
              system_aux.unshift({value: 229, label: 'Comunicados', disabled: true});
          }

          if(props.notificacoes){
              system_aux.unshift({value: 231, label: 'Notificações', disabled: true});
          }

          handleSetOptionsSystems(system_aux);
        }

        setOptionsFrequency((window.rs_id_emp==26 && !props.notificacoes && !props.comunicados && !props.visitas && !props.fases && !props.chamados && window.rs_permission_apl !== 'master'?  response?.data?.data?.frequency?.filter((elem) => elem.id != 4) : response?.data?.data?.frequency));
        setOptionsFrequencyAux(response?.data?.data?.frequencyAux);
        setOptionsTipoComercial(response?.data?.data?.optionAux);
        setOptionsCategory(response?.data?.data?.category);
        setOptionsSubCategory(response?.data?.data?.subcategory);
        setOptionsTypeAuthorization(response?.data?.data?.subsubcategory);
        setOptionsResponsavel(response?.data?.data?.user);

        // NECESSÁRIO PARA REMOVER OS DOIS "00" DO FINAL DA HORA
        let hourLimit_aux = [];
        if(response?.data?.data?.hourLimit){
          response?.data?.data?.hourLimit.map((item, i) => {
            hourLimit_aux.push(
              {value: item?.id, label: item?.nome.slice(0,5)}
            );
          });
        }
        setOptionsHourLimit(hourLimit_aux);

        setOptionsJobApi(response?.data?.data?.APIJob);
        setOptionsJobSystem(response?.data?.data?.systemJob);
        setOptionsModuloChamados(response?.data?.data?.moduleChamados);
        setOptionsModuloFases(response?.data?.data?.moduleFases);
        setOptionsCliente(response?.data?.data?.client);
        setOptionsLojaSoliciante(response?.data?.data?.store);

        // ESCONDE BOTÃO DE TIPO SE TIVER USUÁRIO, LOJA, CARGO OU DEPARTAMENTO JÁ VINCULADO
        if(response?.data?.data?.job[0]?.ID_usuario || response?.data?.data?.job[0]?.ID_loja || response?.data?.data?.job[0]?.ID_cargo || response?.data?.data?.job[0]?.ID_departamento){
          setHideTipo(true);
        }
   
        setIdFrequency(response?.data?.data?.job[0]?.ID_frequencia);
        setIdFrequencyAux(response?.data?.data?.job[0]?.ID_frequencia_aux);
        setDateStart(props?.fases && response?.data?.data?.jobStatus ? new Date(get_date('date_sub_day', response?.data?.data?.jobStatus[0]?.DataHora, 'date_sql', 1)) : response?.data?.data?.job[0]?.Data_inicio ? new Date(get_date('date_sub_day', response?.data?.data?.job[0]?.Data_inicio, 'date_sql', 1)) : "");
        setDateEnd(response?.data?.data?.job[0]?.Data_fim? new Date(get_date('date_sub_day', response?.data?.data?.job[0]?.Data_fim, 'date_sql', 1)) : "");
        setAtivo((response?.data?.data?.job[0]?.Ativo == 1 ? true : false));
        setUrgent((response?.data?.data?.job[0]?.Urgente == 1 ? true : false));
        setSendEmail((response?.data?.data?.job[0]?.Disparo_email == 1 ? true : false));
        setRisk((response?.data?.data?.job[0]?.Prioridade == 7 ? true : false));

        let system_aux = [];
        if(response?.data?.data?.jobAPL){
          response?.data?.data?.jobAPL.map((item, i) => {
            system_aux.push({id: item?.ID_apl});
          });          
        }
        setSystem(system_aux);

        // LIMITAÇÃO DE CARGOS
        let access_permission_aux = [];
        if(response?.data?.data?.jobAccessPermission){
          response?.data?.data?.jobAccessPermission.map((item, i) => {
            access_permission_aux.push(item?.ID_cargo);
          });          
        }
        setLimitarCargos(access_permission_aux);

        setHourLimit((response?.data?.data?.job[0]?.Hora_limite ? response?.data?.data?.job[0]?.Hora_limite : ''));
        setIdGroup(response?.data?.data?.job[0]?.ID_job);
        
        // SETA ITENS DESABILITADOS
        if(response?.data?.data?.job[0]?.Desabilitar){
          let desabilitar_aux = [];

          // NECESSÁRIO FAZER ESSE MAP ANTES PARA VERIFICAR SE O ID DO ITEM JÁ EXISTE, ALGUNS JOBS ENTRARAM ENVIANDO ID'S REPETIDOS
          response?.data?.data?.job[0]?.Desabilitar.split(',').map((disable, i) => {
            if(disable){
              if(!desabilitar_aux.includes(Number(disable))){
                desabilitar_aux.push(Number(disable));
              }
            }
          });   

          setDisableJob(desabilitar_aux);
        }

        // SETA LOJAS OU USUÁRIOS SELECIONADOS
        let usuarios = [];
        let lojas = [];
        let cargos = [];
        let departamentos = [];

        if (response?.data?.data?.jobLote) {
          response?.data?.data?.jobLote.map((item, i) => {
            if(item.ID_usuario){
              usuarios.push({
                id: item.ID_usuario,
                date_start: (item.Data_inicio ? item.Data_inicio.slice(0,10) : ''),
                hour_limit: (item.Hora_limite ? item.Hora_limite : '')
              });
              
            }else if(item.ID_loja){
              lojas.push({
                id: item.ID_loja,
                date_start: (item.Data_inicio ? item.Data_inicio.slice(0,10) : ''),
                hour_limit: (item.Hora_limite ? item.Hora_limite : '')
              });
            }else if(item.ID_cargo){
              cargos.push({
                id: item.ID_cargo,
                date_start: (item.Data_inicio ? item.Data_inicio.slice(0,10) : ''),
                hour_limit: (item.Hora_limite ? item.Hora_limite : '')
              });
            }else if(item.ID_departamento){
              departamentos.push({
                id: item.ID_departamento,
                date_start: (item.Data_inicio ? item.Data_inicio.slice(0,10) : ''),
                hour_limit: (item.Hora_limite ? item.Hora_limite : '')
              });
            }
          });
        }

        setIdUsers(usuarios);
        setIdStore(lojas);
        setIdOffice(cargos);
        setIdDepartment(departamentos);

        if (usuarios.length > 0) {
          setTipo("usuario");
          listUsers("usuario", true);
        } else if (lojas.length > 0) {
          setTipo("loja");
          listUsers("loja", true);
        } else if (cargos.length > 0) {
          setTipo("cargo");
          listUsers("cargo", true);
        } else if (departamentos.length > 0) {
          setTipo("departamento");
          listUsers("departamento", true);
        }

        setIdCategory(response?.data?.data?.job[0]?.ID_categoria);
        setIdSubcategory(response?.data?.data?.job[0]?.ID_subcategoria);
        setIdTypeAuthorization(response?.data?.data?.job[0]?.ID_subsubcategoria);
        setIdUsuarioResponsavel(response?.data?.data?.job[0]?.ID_usuario_responsavel);
        setTitle(response?.data?.data?.job[0]?.Titulo);
        setDescription(response?.data?.data?.job[0]?.Descricao);
        setUrlVideo(response?.data?.data?.job[0]?.Url_video);
        setIdJobApi(response?.data?.data?.job[0]?.ID_api);
        setAnexo(response?.data?.data?.job[0]?.Anexo);  
        setCliente(response?.data?.data?.job[0]?.ID_cliente);
        setLojaSolicitante(response?.data?.data?.job[0]?.ID_loja_solicitante);
        setPeso(response?.data?.data?.job[0]?.Pontos);
        setResponsavel(response?.data?.data?.job[0]?.ID_usuario_responsavel);

        // FAZ A BUSCA POR SUBCATEGORIAS SE VIER CATEGORIA SELECIONADA DA API
        if(response?.data?.data?.job[0]?.ID_categoria){
          changeCategory(response?.data?.data?.job[0]?.ID_categoria);
        }

        if(response?.data?.data?.job[0]?.Aux_sistema_api){            
          let aux = JSON.parse(response?.data?.data?.job[0]?.Aux_sistema_api);
          let system_job = aux.job_system_integration;
          let system_type = aux.job_system_integration_type;
          let system_type_1 = aux.job_system_integration_type_1;
          let system_type_2 = aux.job_system_integration_type_2;

          setIdJobSystem(system_job);

          axios({
            method: 'get',
            url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
            params: {
              db_type: global.db_type,
              do: 'getTable',
              tables: [
                {table: 'systemTypeJob', filter: {id_system_api: system_job}},
                {table: 'store'}
              ]
            }
          }).then((response) => {
            setOptionsJobSystemType(response?.data?.data?.systemTypeJob);

            if(system_job == global?.integracao?.trade || system_job == global?.integracao?.trade_legado){ // TRADE
              changeSystemAux(system_job, system_type);
              setOptionsJobSystemType(optionsTiposTrade);
              setIdJobSystemType(parseInt(system_type));
            }else{
              setIdJobSystemType(parseInt(system_type)); 
            }

            setIdJobSystemType1(system_type_1);
            setIdJobSystemType2(system_type_2);

            setOptionsJobSystemType1(response?.data?.data?.store);
          }, []);
        }

        // MÓDULOS CHAMADOS/FASES
        if(response?.data?.data?.jobAPL.length > 0){
          response?.data?.data?.jobAPL.map((item, i) => {
            if(item.ID_apl == 224){
              setIdModuloChamado(item?.ID_modulo);
            }else if(item.ID_apl == 225){
              setIdModuloFase(item?.ID_modulo);
            }
          })
        }
        
        setTimeout(() => {
          setLoaded(true); // ESTADO PARA INFORMAR QUE AS INFORMAÇÕES FORAM CARREGADAS
        },1000);
      }, []);

      setShowModal(true);
    }
  }

  // FUNÇÃO PARA TROCA SELECT CATEGORIA
  function changeCategory(id) {
    if(conf_tipo_comercial){
      setIdUsers([]);
    }

    // ZERA OPÇÕES DE SUBCATEGORIAS
    setOptionsSubCategory([]);
    setLoading(loading => ({...loading, subcategory: true})); 

    // DEFINE FILTRO DE APL
    let id_apl_aux;
    
    if(props.chamados){
      id_apl_aux = 224;
    }else if(props.fases){
      id_apl_aux = 225;
    }else if(props.visitas){
      id_apl_aux = 226;
    }else if(props.comunicados){
      id_apl_aux = 229;
    }else{
      id_apl_aux = 223;
    }
    
    axios({
      url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
      params: {
        db_type: 'mysql',
        do: 'getTable',
        tables: [
          {table: 'subcategory', filter: {id_ite: id, id_apl: id_apl_aux, id_sistema_not_is_null: window.rs_sistema_id == global.sistema.manutencao_madnezz ? 1 : undefined}}
        ]
      }
    }).then((response) => {
      setOptionsSubCategory(response?.data?.data?.subcategory);
      setLoading(loading => ({...loading, subcategory: false})); 
    },[]);
  }

  // FUNÇÃO PARA TROCA SELECT SISTEMA
  function changeSystem(id) {
    if(!props.id_job_system_type1){
      setIdJobSystemType1([]); // RESETA SELECT DE LOJA DO CHECKLIST
    }
    setIdJobSystemType2([]);
    setOptionsJobSystemType([]);

    if(id == global?.integracao?.trade || id == global?.integracao?.trade_legado){ // SISTEMA TRADE
      setOptionsJobSystemType(optionsTiposTrade);
    }else{ // OUTROS SISTEMAS
      axios({
        method: 'get',
        url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
        params: {
          db_type: global.db_type,
          do: 'getTable',
          tables: [
            {table: 'systemTypeJob', filter: {id_system_api: id}},
          ]
        }
      }).then((response) => {
        setOptionsJobSystemType(response.data?.data?.systemTypeJob);
      }, []);
    }
  }

  // CORREÇÃO PROVISÓIA PARA CARDS DE VISITAS AVULSAS
  useEffect(() => {
    if(props?.avulso && showModal){
      axios({
        method: 'get',
        url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
        params: {
          db_type: global.db_type,
          do: 'getTable',
          tables: [
            {table: 'systemTypeJob', filter: {id_system_api: 1}},
          ]
        }
      }).then((response) => {
        setOptionsJobSystemType(response.data?.data?.systemTypeJob);
      }, []);
    }
  },[props?.avulso, showModal]);

  // FUNÇÃO PARA TROCA SELECT SISTEMA AUX
  function changeSystemAux(system_job, id){
    axios({
      method: 'get',
      url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
      params: {
        db_type: global.db_type,
        do: 'getTable',
        tables: [
          {table: 'systemTypeJob', filter: {id_system_api: system_job, system_job_aux: id}},
        ]
      }
    }).then((response) => {
      if(id==1){
        setOptionsJobSystemAux(response?.data?.data?.systemTypeJob);
      }else if(id==2){
        setOptionsJobSystemAux2(response?.data?.data?.systemTypeJob?.data1); // AJUSTAR
        setOptionsJobSystemAux3(response?.data?.data?.systemTypeJob?.data2); // AJUSTAR
      }
    }, []);
  }

  // FUNÇÃO DE EXECUÇÃO DO RADIO
  function setRadios(e) {    
    setTipo(e.target.value);    

    setIdUsers([]);
    setIdUsersModified(true);
    setIdStore([]);
    setIdStoreModified(true);
    setIdOffice([]);
    setIdOfficeModified(true);
    setIdDepartment([]);
    setIdDepartmentModified(true);
    setLimitarCargos([]);
    setLimitarCargosModified(true);

    listUsers(e.target.value, true);
  }

  // SETA ITENS DESABILITADOS
  const handleSetDisabledJob = (e) => {
    setDisableJob(e);
    setDisablejobModified(true);
  }
  
  function handleCheck(e, date, hour) {
    if(e === undefined && (date || hour)){ // SE NÃO TIVER ALTERAÇÃO NO CHECKBOX DE USUÁRIOS SELECIONADOS SÓ TROCA A DATA
      if(tipo == 'usuario'){
        let usuarios = [];
        if(idUsers){
          idUsers.map((user, i) => {
            usuarios.push({
              id: user.id,
              date_start: get_date('date_sql', cd(date), 'date'),
              hour_limit: (hour ? hour : hourLimit)
            })
          });    
        }
        setIdUsers(usuarios);
        setIdUsersModified(true);
      }

      if(tipo == 'loja'){
        let lojas = [];
        idStore.map((loja, i) => {
          lojas.push({
            id: loja.id,
            date_start: get_date('date_sql', cd(date), 'date'),
            hour_limit: (hour ? hour : hourLimit)
          })
        });    
        setIdStore(lojas);
        setIdStoreModified(true);
      }

      if(tipo == 'cargo'){
        let cargos = [];
        idOffice.map((cargo, i) => {
          cargos.push({
            id: cargo.id,
            date_start: get_date('date_sql', cd(date), 'date'),
            hour_limit: (hour ? hour : hourLimit)
          })
        });    
        setIdOffice(cargos);
        setIdOfficeModified(true);
      }

      if(tipo == 'departamento'){
        let departamentos = [];
        idDepartment.map((departamento, i) => {
          departamentos.push({
            id: departamento.id,
            date_start: get_date('date_sql', cd(date), 'date'),
            hour_limit: (hour ? hour : hourLimit)
          })
        });    
        setIdDepartment(departamentos);
        setIdDepartmentModified(true);
      }
    }else{
      if(system.filter((elem) => elem.id == '224').length || system.filter((elem) => elem.id == '225').length || props.id_group || system.filter((elem) => elem.id == '226').length){ // SE TIVER EM FASES (225) OU VISITAS (226) SELECIONADOS SETA SÓ UM
        if (tipo === "usuario") {
          if(e?.id_fase){
            setIdUsers([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour, id_fase: e?.id_fase}]);
          }else{
            setIdUsers([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour}]);
          }          
          setIdUsersModified(true);
        }else if(tipo === "loja"){
          if(e?.id_fase){
            setIdStore([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour, id_fase: e?.id_fase}]);
          }else{
            setIdStore([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour}]);
          }          
          setIdStoreModified(true);
        }else if(tipo === "cargo"){
          if(e?.id_fase){
            setIdOffice([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour, id_fase: e?.id_fase}]);
          }else{
            setIdOffice([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour}]);
          }
          setIdOfficeModified(true);
        }else if(tipo === "departamento"){
          if(e?.id_fase){
            setIdDepartment([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour, id_fase: e?.id_fase}]);
          }else{
            setIdDepartment([{id: e.id, date_start: get_date('date_sql', cd(e.date)), hour_limit: e.hour}]);
          }
          setIdDepartmentModified(true);
        }

        if(system.filter((elem) => elem.id == '226').length && props?.subTipoCalendario === 'store'){
          setTitle(e.label);
          setTitleModified(true);
        }
      }else{
        if (e.checked) {
          if (tipo === "usuario") {      
            setIdUsers([...idUsers.filter((item) => item.id != e.id), {id: e.id, date_start: (e.date ? get_date('date_sql', cd(e.date), 'date') : ''), hour_limit: e.hour}]);
            setIdUsersModified(true);
          } else if (tipo === "loja") {
            setIdStore([...idStore.filter((item) => item.id != e.id), {id: e.id, date_start: (e.date ? get_date('date_sql', cd(e.date), 'date') : ''), hour_limit: e.hour}]);
            setIdStoreModified(true);
          } else if (tipo === "cargo") {
            setIdOffice([...idOffice.filter((item) => item.id != e.id), {id: e.id, date_start: (e.date ? get_date('date_sql', cd(e.date), 'date') : ''), hour_limit: e.hour}]);
            setIdOfficeModified(true);
          } else if (tipo === "departamento") {
            setIdDepartment([...idDepartment.filter((item) => item.id != e.id), {id: e.id, date_start: (e.date ? get_date('date_sql', cd(e.date), 'date') : ''), hour_limit: e.hour}]);
            setIdDepartmentModified(true);
          }
        } else {
          if (tipo === "usuario") {
            setIdUsers(idUsers.filter((item) => item.id !== e.id));
            setIdUsersModified(true);
          } else if (tipo === "loja") {
            setIdStore(idStore.filter((item) => item.id !== e.id));
            setIdStoreModified(true);
          } else if (tipo === "cargo") {
            setIdOffice(idOffice.filter((item) => item.id !== e.id));
            setIdOfficeModified(true);
          } else if (tipo === "departamento") {
            setIdDepartment(idDepartment.filter((item) => item.id !== e.id));
            setIdDepartmentModified(true);
          }
        }
      }
    }
    
    if(idFrequency == global.frequencia.unico){ // SE A FREQUÊNCIA FOR ÚNICA, SETA A MESMA DATA NA DATA FINAL
      setDateEnd(date);
    }

    validacaoForm();
  }

  function handleCheckDate(e, date) {
    handleCheck(e, date, hourLimit);
  }

  function handleCheckHour(e, hour) {
    handleCheck(e, dateStart, hour);
  }

  // FUNÇÃO PARA JUNTAR ID MÓDULO CHAMADOS E FASES EM UM ARRAY
  useEffect(() => {
    let modulos = [];

    if((props.fases && !idModuloFase) || props.visitas){
      modulos.push(filterModule);
    }

    modulos.push({id_apl: 223, id_module: ''});

    if(idModuloChamado){
      if(idUsers[0]?.id_fase){
        modulos.push({id_apl: 224, id_module: idModuloChamado, id_fase: idUsers[0]?.id_fase});
      }else{
        modulos.push({id_apl: 224, id_module: idModuloChamado});
      }
    }
    
    if(idModuloFase){
      if(!props?.id_group){
        modulos.push({id_apl: 225, id_module: idModuloFase});
      }
    }
    
    // SE TIVER COMUNICADOS SELECIONADO
    if(system.filter((item) => item.id == 229).length > 0){
      modulos.push({id_apl: 229, id_module: ''});
    }

    // SE TIVER VISITAS SELECIONADO
    if(system.filter((item) => item.id == 226).length > 0 && !props.visitas){
      modulos.push({id_apl: 226, id_module: global.modulo.visitas});
    }

    // SE TIVER NOTIFICAÇÕES SELECIONADO
    if(system.filter((item) => item.id == 231).length > 0){
      modulos.push({id_apl: 231, id_module: ''});
    }

    setIdModulo(modulos);
  },[idModuloChamado, idModuloFase, system, idStore, idUsers]);

  // FUNÇÃO PARA SELECIONAR CHECKBOX SYSTEM TYPE 1 DE INTEGRAÇÃO (TRADE)
  function handleSetIdJobSystemType1(e) {
    if (e.target.checked) {
      setIdJobSystemType1([...idJobSystemType1, e.target.value]);
    } else {
      setIdJobSystemType1(idJobSystemType1.filter((item) => item !== e.target.value));
    } 
    setIdJobSystemModified(true);
  }

  // FUNÇÃO PARA SELECIONAR CHECKBOX SYSTEM TYPE 2 DE INTEGRAÇÃO (TRADE)
  function handleSetIdJobSystemType2(e) {
    if (e.target.checked) {
      setIdJobSystemType2([...idJobSystemType2, e.target.value]);
    } else {
      setIdJobSystemType2(idJobSystemType2.filter((item) => item !== e.target.value));
    }
    setIdJobSystemModified(true);
  }

  // FUNÇÃO PARA SELECIONAR SISTEMAS QUE O JOB FARÁ PARTE
  function handleSystem(e){
    if (e.target.checked) {
      setSystem([...system, {id: e.target.value}]);
      setSystemModified(true);
      
      if(e.target.value == 226){ // SE SELECIONAR VISITAS ZERA, OS USUÁRIOS/LOJAS SELECIONADOS
        setIdUsers([]);
        setIdStore([]);
        listUsers(tipo, true);
      }

      if (e.target.value == 229 || e.target.value == 231) { // SE SELECIONAR COMUNICADOS OU NOTIFICAÇÕES, ZERA OS CAMPOS DE INTEGRAÇÃO E OPCIONAIS
        setUrlVideo('');
        setIdJobSystem('');
        setIdJobSystemType('');
        setIdJobSystemType1('');
        setIdJobSystemType2('');
        setIdJobApi('');
      }
    } else {
      setSystem(system.filter((item) => item.id !== e.target.value));
    }
  }

  // FUNÇÃO PARA SELECIONAR TODOS
  function checkAll(e) {
    // DEFINE ESTADO DE ACORDO COM O TIPO
    let type_aux;

    if(tipo === 'usuario'){
      type_aux = idUsers;
    }else if(tipo === 'loja'){
      type_aux = idStore;
    }else if(tipo === 'cargo'){
      type_aux = idOffice;
    }else if(tipo === 'depatamento'){
      type_aux = idDepartment;
    }

    // LISTA DE ITENS FILTRADOS
    let ids_aux = [];
    let items_aux = checkboxs.filter((item) => {
      if (!filter) return true;
      if (item.nome.toLowerCase().includes(filter.toLowerCase())){
        return true;
      }
    });

    // ID'S SELECIONADOS
    items_aux.map((item, i) => {
      ids_aux.push(item?.id);
    });
    
    // SELECIONA ITENS
    let selected_aux = [];
    items_aux.map((item) => {
      if(type_aux?.filter((elem) => elem?.id == item?.id).length == 0){
        selected_aux.push({id: item.id, date_start: get_date('date_sql', dateStart.toString(), 'new_date'), hour_limit: hourLimit});
      }
    });

    if (e.target.checked) {
      if(tipo === "usuario"){
        setIdUsers(idUsers => [...idUsers, ...selected_aux]);
      }else if (tipo === "loja"){        
        setIdStore(idStore => [...idStore, ...selected_aux]);
      }else if (tipo === "cargo"){        
        setIdOffice(idOffice => [...idOffice, ...selected_aux]);
      }else if (tipo === "departamento"){        
        setIdDepartment(idDepartment => [...idDepartment, ...selected_aux]);
      }
    } else {
      if(tipo === "usuario"){
        setIdUsers(idUsers.filter((elem) => !ids_aux.includes(elem?.id)));
      }else if (tipo === "loja"){        
        setIdStore(idStore.filter((elem) => !ids_aux.includes(elem?.id)));
      }else if (tipo === "cargo"){        
        setIdOffice(idOffice.filter((elem) => !ids_aux.includes(elem?.id)));
      }else if (tipo === "departamento"){        
        setIdDepartment(idDepartment.filter((elem) => !ids_aux.includes(elem?.id)));
      }
    }
  }

  // SETA MENSAGEM DE ALERTA CASO SELECIONE MUITOS CHECKBOX'S
  useEffect(() => {
    if(idUsers.length > 60 || idStore.length > 60 || idOffice.length > 60 || idDepartment.length > 60 || (dateStart && dateEnd)){
      let label_aux = '';

      if(idUsers.length > 60){
        label_aux = 'selecionados  muitos usuários';
      }else if(idStore.length > 60){
        label_aux = 'selecionadas  muitas lojas';
      }else if(idOffice.length > 60){
        label_aux = 'selecionados  muitos cargos';
      }else if(idDepartment.length > 60){
        label_aux = 'selecionados  muitos departamentos';
      }
      
      if(label_aux){
        setAlertUsers('OBS: Foram '+label_aux+', pode ser que a criação dos cards leve até 1 minuto para conclusão.');
      }

      if(dateStart && dateEnd){
        let date_start_aux = get_date('date_sql', cd(dateStart), 'date');
        let date_end_aux = get_date('date_sql', cd(dateEnd), 'date');
        let diff_days = diffDays(date_end_aux, date_start_aux);
  
        if(diff_days > 60){
          setAlertUsers('OBS: Foi selecionado um intervalo muito grande de datas, pode ser que a criação dos cards leve até 1 minuto para conclusão.')
        }else{
          if(label_aux){
            setAlertUsers('OBS: Foram '+label_aux+', pode ser que a criação dos cards leve até 1 minuto para conclusão.');
          }else{
            setAlertUsers('');
          }
        }
      }
    }else{
      setAlertUsers('');
    }
  },[idUsers, idStore, idOffice, idDepartment, dateStart, dateEnd]);

  // TÍTULO MODAL
  var modalTitle;
  if(props.modalTitle){
    modalTitle = props.modalTitle;
  }else{
    if(props.chamados){
      modalTitle = (props.empty?'Novo':'Editar') + ' Chamado';
    }else if(props.fases){
      modalTitle = (props.empty?'Nova':'Editar') + ' Fase';
    }else if(props.visitas){
      modalTitle = (props.empty?'Nova':'Editar') + ' Visita';
    }else{
      modalTitle = (props.empty?'Novo':'Editar') + ' Job';
    } 
  }

  // FUNÇÃO PARA DEFINIR TEXTO DO TOAST
  const handleToast = () => {
    if(props?.toast){
      return props?.toast
    }else{
      if(props.empty){
        return 'Card cadastrado com sucesso';
      }else{
        if(ativo){
          if(props.plano){
            return 'Plano de ação criado com sucesso';
          }else{
            return 'Card editado com sucesso';
          }
        }else{
          return 'Card desativado com sucesso';
        }
      }
    }
  }

  // FUNÇÕES AO TROCAR SISTEMA
  const handleSetSystem = (e) => {
    setIdSystem(e);
    setIdSystemModified(true);
  }

  // FUNÇÕES AO TROCAR CATEGORIA
  function handleSetCategory(id){
    setIdCategory(id);
    setIdSubcategory('');
    setFuncionarios([]);
    setIdTypeAuthorization('');
    setIdCategoryModified(true);
    changeCategory(id);

    if(conf_tipo_comercial){
      setIdUsers([]);
    }

    if(props.chamados){
      setIdModuloChamado(filterModule);
    }

    if(filterModule){
      setIdModuloModified(true);
    }
  }

  // SE ESTIVER NO SISTEMA MANUTENÇÃO, JÁ EXECUTA A FUNÇÃO QUE SETA A CATEGORIA
  useEffect(() => {
    if(showModal){
      if(global.sistema.manutencao_madnezz == window.rs_sistema_id){
        if(global.client === 'fastview'){
          changeCategory(global.categoria.fastview);
        }else if(global.client === 'malltech'){
          changeCategory(global.categoria.malltech);
        }else{
          if(window.rs_id_emp == 26){
            changeCategory(global.categoria.madnezz);
          }else{
            changeCategory(global.categoria.madweb);
          }
        }
      }
    }
  },[showModal]);

  // FILTRAR USUÁRIOS PELO CARGO
  const handleFilterCargo = (e) => {
    setFilterCargo(e);
  }

  // FILTRAR USUÁRIOS PELO DEPARTAMENTO
  const handleFilterDepartamento = (e) => {
    setFilterDepartamento(e);
  }

  // FILTRAR USUÁRIOS PELA MARCA
  const handleFilterMarca = (e) => {
    setFilterMarca(e);
  }

  // FILTRAR USUÁRIOS PELA REGIÃO
  const handleFilterRegiao = (e) => {
    setFilterRegiao(e);
  }

  // FILTRAR USUÁRIOS PELO SEGMENTTO
  const handleFilterSegmento = (e) => {
    setFilterSegmento(e);
  }

  // FUNÇÕES AO TROCAR SUBCATEGORIA
  const handleSetSubcategory = (e) => {
    setIdSubcategory(e.value);
    setIdSubcategoryModified(true);
    setIdTypeAuthorization('');
    setFuncionarios([]);

    if(props.chamados && e.id_ite_aux){ // SE ESTIVER EM CHAMADOS E RECEBER O VALOR "ID_ITE_AUX" SETA O MESMO COMO MÓDULO
      setIdModuloChamado(e.id_ite_aux);
      setModuloChamadoVisible(false);
      setIdModuloModified(true);
    }else{      
      if(window.rs_id_lja > 0){
        setModuloChamadoVisible(true);
      }
      setIdModuloModified(true);
    }

    // CASO NÃO VENHA CONFIGURAÇÃO DE MICROSSISTEMA DO MÓDULO USA O DA SUBCATEGORIA
    if(!conf_microssistema){
      if (e?.par_aux) { // SE RECEBER VALOR DO PAR_AUX
        let id = JSON.parse(e.par_aux).id;
        setMicrossistema(id);
      } else {
        setMicrossistema(microssistemaInitial);
      }

      setMicrossistemaValidation(false);
      setMicrossistemaValues(null);
    }
  }

  // FUNÇÃO AO TROCAR TIPO DE LIBERAÇÃO DE ENTRADA
  const handleSetTypeAuthorization = (e) => {
    setIdTypeAuthorization(e?.value);
  }

  // AÇÕES AO SELECIONAR A OPÇÃO DE AGENDAR (CHAMADO)
  const handleSetAgendar = () => {
    if(agendar){
      setAgendar(false);
      setDateStart(dateStartInitial);
      setDateEnd(dateEndInitial);
    }else{
      setAgendar(true);
    }
  }

  // SELECT DE TIPO COMERCIAL (CARREFOUR)
  const handleSetTipoComercial = (e) => {
    setIdTipoComercial(e.value);
  }

  // SELECIONA OPERADOR DE ACORDO COM O TIPO COMERCIAL SELECIONADO (CARREFOUR)
  useEffect(() => {
    if(checkboxs && idTipoComercial){
      let user_aux = '';

      checkboxs.map((item_1, i) => {
        if(item_1?.par_descricao){
          let json_aux_1 = JSON.parse(item_1?.par_descricao)[0];

          if(json_aux_1?.id_type.filter((elem) => elem == idTipoComercial).length > 0){
            json_aux_1?.data.map((item_2, i) => {
              if(idCategory){
                if(item_2?.id_category.filter((elem) => elem == idCategory).length > 0){                  
                  if(optionsTipoComercial.filter((elem) => elem.id == idTipoComercial)[0]?.ite_aux == 1){
                    if(optionsSubCategory.length > 0){                    
                      if(idSubcategory){
                        if(item_2?.id_subcategory?.filter((elem) => elem == idSubcategory).length > 0){
                          user_aux =  item_1?.id;
                        }
                      }else{
                        user_aux = '';
                      }
                    }else{
                      user_aux =  item_1?.id;
                    }                    
                  }else{
                    user_aux =  item_1?.id;
                  }                  
                }
              }
            })
          }   
        }        
      });

      // MONTA O OBJETO DO USUÁRIO SELECIONADO
      if(user_aux){
        setIdUsers([{
          id: user_aux,
          date_start: get_date('date_sql', cd(dateStart)),
          hour_limit: hourLimit,
          id_fase: checkboxs?.filter((elem) => elem?.id == user_aux)[0]?.id_fase
        }]);
      }else{
        setIdUsers([]);
      }
    }
  },[idCategory, idSubcategory, idTipoComercial, optionsSubCategory]);

  // LIMPA A SUBCATEGORIA SEMPRE QUE ALTERA O TIPO COMERCIAL (CARREFOUR)
  useEffect(() => {
    if(optionsTipoComercial?.filter((elem) => elem.id == idTipoComercial)[0]?.ite_aux == 2){
      setIdSubcategory('');
    }
  },[idTipoComercial]);

  function handleClickShortcut(categoria_id, subcategoria_id, categoria_nome, subcategoria_nome, config){
    if(config && config != 1 && config != 0){
      let config_aux = JSON.parse(config)[0];
      
      if(config_aux?.category){
        handleSetCategory(config_aux?.category);
      }

      if(config_aux?.subcategory){
        setIdSubcategory(config_aux?.subcategory);
      }

      if(config_aux?.subsubcategory){
        setIdTypeAuthorization(config_aux?.subsubcategory);
      }

      if(config_aux?.date_start){
        setDateStart(config_aux?.date_start ? new Date(cd(config_aux?.date_start)) : '');
      }

      if(config_aux?.description){
        setDescription(config_aux?.description);
      }

      if(config_aux?.disable_actions){
        setDisableJob(config_aux?.disable_actions);
      }

      if(config_aux?.file){
        setAnexo(config_aux?.file);
      }

      if(config_aux?.frequency){
        setIdFrequency(config_aux?.frequency);
      }

      if(config_aux?.hour_limit){
        setHourLimit(config_aux?.hour_limit);
      }

      if(config_aux?.system_job){
        setIdJobSystem(config_aux?.system_job);
        changeSystem(config_aux?.system_job);
      }

      if(config_aux?.job_system_type){
        setIdJobSystemType(config_aux?.job_system_type);    
      }

      if(config_aux?.title){
        setTitle(config_aux?.title);        
      }      

      if(config_aux?.frequency_aux){
        setIdFrequencyAux(config_aux?.frequency_aux);        
      }

      if(config_aux?.type){
        setTipo(config_aux?.type);
        listUsers(config_aux?.type);
      }

      setShowModalAtalhos(false);
      setShortcutSelected(config_aux?.type ? config_aux?.type : true);
    }else{      
      handleSetCategory(categoria_id);
      setIdSubcategory(subcategoria_id);
      setIdTypeAuthorization(props?.subsubcategory?.id);
      setIdFrequency(global.frequencia.unico);
      setHourLimit('23:00:00');
      setTitle(categoria_nome + ' - ' + subcategoria_nome);
      setDateStart(new Date());
      setShowModalAtalhos(false);
      setShortcutSelected(true);
    }
  }

  useEffect(() => {
    if(shortcutSelected){
      setTimeout(() => {
        if(shortcutSelected === true){
          handleShowModal();
        }else{
          handleShowModal(shortcutSelected);
        }
      },200);
    }
  },[shortcutSelected]);

  // CLICK ÍCONE IMPORTADOR (ABRIR MODAL DE EXEMPLO)
  const handleSetImporter = () => {
    setShowModal(false);
    setTimeout(() => {
      setShowModalPlanilha(true);
    },100);
  }

  // CLICK BOTÃO IMPORTADOR (SELECIONAR ARQUIVO)
  const handleSetImporterFile = () => {
    if(importerRef){
      importerRef.current.click();
    }
  }

  // SETA VALOR PLANILHA DE LOJAS
  const handleSetLojas = (response) => {
    setIdStore([]);
    setLoadImporter(true);
    setShowModalPlanilha(false);
    setTimeout(() => {
      setShowModal(true);
    },100);
    
    axios({
      method: 'post',
      url: window.host_madnezz+'/systems/integration-react/api/registry.php',
      params: {
        do: 'importCheckStore',
        type: 'store'        
      },
      data: {
        excel: response?.target?.files[0]
      },
      cache: false,
      processData: false,
      contentType: false,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      setLoadImporter(false);
      
      if(response?.data?.data.length > 0){
        setIdStore(response?.data?.data.map((item) => {
          return { id: item?.id, date_start: dateStart, hour_limit: hourLimit }
        }));
      }else{
        toast('Nenhuma loja importada, verifique a planilha e tente novamente');
      }
    })
  }

  // FUNÇÃO PARA BUSCAR CARDS
  function get_cards(){
    axios({
      method: 'get',
      url: window.host_madnezz+'/systems/integration-react/api/list.php',
      params: props?.get?.params,
    }).then((response) => {
      setCardsList(response.data);
    });
  }

  // CHAMA FUNÇÃO PARA BUSCAR CARDS CASO RECEBA A PROPS GET
  useEffect(() => {
    if(showModal && props?.get && props?.get?.params){
      get_cards();
    }
  },[showModal]);

  // BUSCA TIPOS DE LIBERAÇÃO DE ACESSO
  useEffect(() => {
    setOptionsTypeAuthorization([]);

    // SÓ FAZ A REQUISIÇÃO SE TIVER SUBCATEGORIA SELECIONADA, ESTIVER NO SISTEMA DE CHAMADOS E NÃO ESTIVER EM MANUTENÇÃO
    if(idSubcategory && props?.chamados && window.rs_sistema_id != global.sistema.manutencao){
      setLoading(loading => ({...loading, subsubcategory: true})); 

      axios({
        method: 'get',
        url: window.host_madnezz+'/systems/integration-react/api/request.php',
        params: {
          type: 'Job',
          db_type: global.db_type,
          do: 'getTable',
          tables: [{
            table: 'subsubcategory',
            filter: {
              id_par_parent: idSubcategory
            }
          }]
        }
      }).then((response) => {
        if(response.data){
          setOptionsTypeAuthorization(response?.data?.data?.subsubcategory);
          setLoading(loading => ({...loading, subsubcategory: false})); 
        }
      });
    }
  },[idSubcategory]);

  // DEFINE TAMANHO DO MODAL
  let modal_large = true;
  let box_user_aux = true;
  
  if(global.modulo.manutencao?.includes(parseInt(filterModule))){
    if(window.rs_id_emp == 26){
      modal_large = true;
      box_user_aux = true;
    }else{
      modal_large = false;
      box_user_aux = false;
    }
  }else{
    if(conf_box_usuarios === false){
      modal_large = false;
      box_user_aux = false;
    }else{
      if(props?.avulso || props?.modalLarge === false || !conf_box_usuarios || (window.rs_id_lja > 0 && props.chamados && !global.message)){
        modal_large = false;
      }    
  
      if(!props?.avulso && props?.boxUser !== false && conf_box_usuarios && (((window.rs_id_lja == 0 || !window.rs_id_lja) && props.chamados) || !props.chamados)){
        box_user_aux = true;
      }else{
        box_user_aux = false;
      }
    }
  }

  // DEFINE URL DO INPUT DE UPLOAD
  let url_upload = window.upload;

  if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
    url_upload = window.upload_madnezz;
  }

  // CALLBACK DO COMPONENTE DE LIBERAÇÃO DE ACESSO
  const handleCallbackLiberacao = (e) => {
    let values_aux = [];

    if(e){
      e?.values?.map((item, i) => {
        if(item?.status === true){
          values_aux.push({
            loja_id: item?.values?.filter(({loja}) => loja)[0]?.loja ? item?.values?.filter(({loja}) => loja)[0]?.loja : (window?.rs_id_lja > 0 ? window?.rs_id_lja : undefined),
            nome: item?.values?.filter(({nome}) => nome)[0]?.nome ? item?.values?.filter(({nome}) => nome)[0]?.nome : undefined,
            cpf: item?.values?.filter(({documento}) => documento)[0]?.documento ? item?.values?.filter(({documento}) => documento)[0]?.documento : undefined,
            rg: undefined,
            inicio: item?.values?.filter(({inicio}) => inicio)[0]?.inicio ? item?.values?.filter(({inicio}) => inicio)[0]?.inicio : undefined,            
            fim: item?.values?.filter(({fim}) => fim)[0]?.fim ? item?.values?.filter(({fim}) => fim)[0]?.fim : undefined,  
            email: item?.values?.filter(({email}) => email)[0]?.email ? item?.values?.filter(({email}) => email)[0]?.email : undefined,  
          })
        }
      });

      setFuncionarios(values_aux);
    }else{
      setFuncionarios([]);
    }
  } 

  return (
    <>
      <Modal show={showModalPlanilha} onHide={() => setShowModalPlanilha(false)}>
        <ModalHeader>
          <ModalTitle>Importar Lojas</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="d-flex">
            <div>
              <img src={PlanilhaExemplo} />
            </div>
            <div className="pt-4 pt-lg-0 ps-0 ps-lg-4">
              <p>
                A planilha enviada precisa seguir o mesmo padrão do exemplo ao lado, em uma única coluna, listar o número de todos os LUC's que precisam ser importados.
              </p>
              <Button
                onClick={handleSetImporterFile}
              >
                Selecionar planilha <Icon type="upload" className="ms-1 text-white" readonly={true} title={false} />
              </Button>

              <input
                ref={importerRef}
                type="file"
                className={'d-none'}
                accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}
                onChange={handleSetLojas}
              />
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal show={showModalAtalhos} onHide={() => handleCloseModalAtalhos(false)} large={true}>
        <ModalHeader>
          <ModalTitle>Atalhos</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className={style.shortcut_container}>
            {(atalhosSubcategoria.length > 0 ?
              atalhosSubcategoria.map((item, i) => {
                if(item?.par_atalho){
                  let categoria_aux = atalhosCategoria.filter((elem) => elem.id == item?.id_ite);
                  let title_aux;
                  let subtitle_aux;

                  // SE VIER TÍTULO E SUBTITULO DA CONFIGURAÇÃO SETA ELES, SE NÃO, SETA COMO CATEGORIA E SUBCATEGORIA POR PADRÃO
                  if(item?.par_atalho && item?.par_atalho != 1){
                    let config_aux;

                    // SE A SUB TEM CONFIGURAÇÃO DE ATALHO, PEGA A CONFIGURAÇÃO DELA, SE NÃO PEGA A CONFIGURAÇÃO DA CATEGORIA
                    if(item?.par_atalho){
                      config_aux = JSON.parse(item?.par_atalho)[0];
                    }else{
                      config_aux = JSON.parse(categoria_aux[0].ite_atalho)[0];
                    }

                    title_aux = config_aux?.shortcut_title;
                    subtitle_aux = config_aux?.shortcut_subtitle;
                  }else{
                    title_aux = (categoria_aux[0]?.nome ? categoria_aux[0]?.nome : '');
                    subtitle_aux = item?.nome;
                  }

                  return(
                    <div
                      key={'shortcut_'+item?.id}
                      className={style.shortcut}
                      onClick={() => handleClickShortcut(categoria_aux[0]?.value, item?.value, categoria_aux[0]?.nome, item?.nome, (item?.par_atalho ? item?.par_atalho : categoria_aux[0]?.ite_atalho))}
                    >
                      <Card       
                        title={title_aux}
                        subtitle={subtitle_aux}
                        size="smallest"
                        wrap={true}     
                        bold={true}      
                      />
                    </div>
                  )
                }
              })             
            :'')}
          </div>
        </ModalBody>
      </Modal>

      <Modal show={showModal} centered onHide={() => handleCloseModal(false)} large={modal_large} id={props.id?props.id:''}>
        <ModalHeader>
          <ModalTitle>{modalTitle}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {(window.isMobile && !props.visitas && !props?.avulso && props?.tipo !== false && conf_tipo && conf_box_usuarios && (((window.rs_id_lja == 0 || !window.rs_id_lja) && props.chamados) || !props.chamados) ?
            <>
              {(!hideTipo ? 
                <InputContainer loading={loadingForm}>
                  <Input
                    type="radio"
                    required={false}
                    name="tipo"
                    id="lojas"
                    label="Lojas"
                    value="loja"
                    checked={tipo === "loja"}
                    onChange={setRadios}
                  />

                  <Input
                    type="radio"
                    required={false}
                    name="tipo"
                    id="usuarios"
                    label="Usuários"
                    value="usuario"
                    checked={tipo === "usuario"}
                    onChange={setRadios}
                  />                

                  {/* SÓ É EXIBIDO NO SISTEMA JOBS */}
                  {(!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length ?
                    <Input
                      type="radio"
                      required={false}
                      name="tipo"
                      id="cargos"
                      label="Cargos"
                      value="cargo"
                      checked={tipo === "cargo"}
                      onChange={setRadios}
                    />  
                  :'')}

                  {/* SÓ É EXIBIDO NO SISTEMA JOBS */}
                  {(!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length ?
                    <Input
                      type="radio"
                      required={false}
                      name="tipo"
                      id="departamentos"
                      label="Departamentos"
                      value="departamento"
                      checked={tipo === "departamento"}
                      onChange={setRadios}
                    />          
                  :'')}
                </InputContainer>
              :'')}
            </>
          :'')}

          <Row direction={window.isMobile?'column-reverse':''}>

            {(global.message ? // MENSAGEM CARREFOUR CRAVADA PROVISORIAMENTE
              <Col lg={6} className={'mb-4 mb-lg-0 ' + style.message}>
                  <div className="h-100 d-flex align-items-center text-center">
                    <div>
                      <img src={icon_envelope} alt="Envelope" width={70} className="mb-4" />
                      <p className="mb-0">
                        Para nós do Carrefour Property é sempre uma satisfação atendê-lo.<br /><br />
                        Sua Avaliação é muito importante e pedimos que faça a avaliação disponível na entrega do atendimento<br />
                        Obrigado pelo seu contato!
                      </p>
                    </div>
                  </div>
              </Col>
            :'')}

            <Col className="mb-4 mb-lg-0"> 
              <div ref={leftCol}>
                <Form
                  api={window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=insUpdJob&db_type="+global.db_type}
                  data={data}
                  className={(!props?.avulso ? 'mb-4' : '')}
                  callback={() => handleCloseModal(true)}
                  response={(e) => handleResponse(e)}
                  toast={handleToast}
                >
                  {(!window.isMobile && !props.visitas && !props?.avulso && !props.id_group && props?.tipo !== false && conf_tipo && conf_box_usuarios && (((window.rs_id_lja == 0 || !window.rs_id_lja) && props.chamados) || !props.chamados) ?
                    <>
                      {(!hideTipo ? 
                        <InputContainer
                          loading={loadingForm}
                        >
                          <Input
                            type="radio"
                            required={false}
                            name="tipo"
                            id="lojas"
                            label="Lojas"
                            value="loja"
                            checked={tipo === "loja"}
                            onChange={setRadios}
                          />

                          <Input
                            type="radio"
                            required={false}
                            name="tipo"
                            id="usuarios"
                            label="Usuários"
                            value="usuario"
                            checked={tipo === "usuario"}
                            onChange={setRadios}
                          />       

                          {/* SÓ É EXIBIDO NO SISTEMA JOBS */}
                          {(!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length ?
                            <Input
                              type="radio"
                              required={false}
                              name="tipo"
                              id="cargos"
                              label="Cargos"
                              value="cargo"
                              checked={tipo === "cargo"}
                              onChange={setRadios}
                            />  
                          :'')}

                          {/* SÓ É EXIBIDO NO SISTEMA JOBS */}
                          {(!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length ?
                            <Input
                              type="radio"
                              required={false}
                              name="tipo"
                              id="departamentos"
                              label="Departamentos"
                              value="departamento"
                              checked={tipo === "departamento"}
                              onChange={setRadios}
                            />          
                          :'')}               
                        </InputContainer>
                      :'')}
                    </>
                  :'')}

                  {(!props.visitas && !props.avulso && !props.id_group && props?.systems?.show !== false && props?.id_system?.show !== false && conf_sistemas && (window.rs_id_lja == 0 || !window.rs_id_lja) ?
                    <InputContainer display={(window.isMobile ? 'block' : '')} loading={loadingForm}>
                      <Input
                        type="checkbox"
                        required={false}
                        name="sistemas"
                        id={'sistema_1'}
                        label={'Jobs'}
                        value={1}
                        checked={true}
                        onChange={() => console.log('')}
                        disabled={true}
                      />
                      
                      {optionsSystems.filter((elem) => elem.nome !== 'Manutenção').map((item, i) => {     
                        let label_aux;
                        let value_aux;
                        
                        if(item.label){
                          label_aux = item.label
                        }else {
                          label_aux = item.nome
                        }

                        if(item.value){
                          value_aux = item.value
                        }else {
                          value_aux = item.id
                        }
                        
                        return(
                          <Input
                            key={'sistema_'+value_aux}
                            type="checkbox"
                            required={false}
                            name="sistemas"
                            id={'sistema_'+value_aux}
                            label={label_aux}
                            value={value_aux}
                            checked={(system.filter((elem) => elem.id == value_aux).length > 0 ? true : null)}
                            onChange={(e) => handleSystem(e)}
                            disabled={item?.disabled}
                          />
                        )
                      })}
                    </InputContainer>
                  :'')}

                  {(!props.chamados && !props.fases && !props.plano && !props.id_group && !props.avulso && props?.frequency?.show !== false ?
                    <SelectReact
                      label="Frequência"
                      name="id_frequency"
                      options={optionsFrequency}
                      value={idFrequency}
                      onChange={(e) => (setIdFrequency(e.value), setIdFrequencyModified(true))}     
                      loading={loadingForm}                 
                    />
                  :'')}

                  {((idFrequency && optionsFrequencyAux.filter((elem) => elem.id_ite == idFrequency).length > 0) && !props.avulso ?
                    <SelectReact
                      label="Opção frequência"
                      name="id_frequency_aux"
                      options={(idFrequency ? optionsFrequencyAux.filter((elem) => elem.id_ite == idFrequency) : [])}
                      value={idFrequencyAux}
                      onChange={(e) => (setIdFrequencyAux(e.value), setIdFrequencyAuxModified(true))}
                      loading={loadingForm}   
                    />
                  :'')}

                  {/* SE ESTIVER EM CHAMADOS O CAMPO ABAIXO NÃO É EXIBIDO */}
                  {(!props.chamados?
                    <Input
                      type="date"
                      label="Data"
                      name="date_start"
                      value={dateStart}
                      disabled={(window.rs_permission_apl !== 'master' && props?.avulso ? true : false)}
                      valueStart={(props.empty ? (props.chamados || system.filter((elem) => elem.id == '224').length ? new Date() : '') : new Date())}
                      noWeekend={
                        (
                          (idFrequency == global.frequencia.diario && optionsFrequencyAux.filter((elem) => elem.value == idFrequencyAux)[0]?.par_aux == 'todos_dias') || 
                          (idFrequency == global.frequencia.mensal && optionsFrequencyAux.filter((elem) => elem.value == idFrequencyAux)[0]?.par_aux == 'manter_sabado_ou_domingo') || 
                          (idFrequency == global.frequencia.sabado || idFrequency == global.frequencia.domingo) 
                        ? 
                          false 
                        : 
                          true
                        )
                      }
                      onlySaturday={idFrequency == global.frequencia.sabado ? true : false}
                      onlySunday={idFrequency == global.frequencia.domingo ? true : false}
                      onChange={(e) => (setDateStart(e), setDateStartModified(true), handleCheckDate(undefined, e))}
                      loading={loadingForm}
                    />
                  :                
                    ''
                  )}

                  <Input
                    type="date"
                    label="Data Final"
                    name="date_end"
                    id="date_end"
                    value={dateEnd}
                    valueStart={(dateStart?addDays(dateStart, 1):'')}
                    disabled={(window.rs_permission_apl !== 'master' && props?.avulso ? true : false)}
                    noWeekend={(idFrequency == global.frequencia.diario && optionsFrequencyAux.filter((elem) => elem.value == idFrequencyAux)[0]?.par_aux == 'todos_dias' ? false : true)}
                    onChange={(e) => (setDateEnd(e), setDateEndModified(true))}
                    required={idFrequency == global.frequencia.unico || !idFrequency ? false : true}
                    hide={idFrequency == global.frequencia.unico || !idFrequency ? true : false}
                    loading={loadingForm}
                  />

                  {(!props.chamados && !props?.avulso && !props.comunicados?
                    <SelectReact
                      label="Hora limite"
                      name="hour_limit"
                      options={optionsHourLimit}
                      value={hourLimit}
                      onChange={(e) => (setHourLimit(e.value), setHourLimitModified(true), handleCheckHour(undefined, e.value))}
                      loading={loadingForm}
                    /> 
                  :'')}

                  {(props.fases ?
                    <SelectReact
                      label="Usuário responsável"
                      name="ID_usuario_responsavel" 
                      value={idUsuarioResponsavel}
                      options={optionsUsuariosResponsaveis}
                      onChange={(e) => (setIdUsuarioResponsavel(e.value))}
                      loading={loadingForm}
                      required={false}
                    /> 
                  :'')}

                  {/* SE FOR DO EMPREENDIMENTO MADNEZZ, NÃO FOR AVULSO (VISITAS) E NÃO SER CARD INTERNO */}
                  {(window.rs_id_emp == 26 && (!window.rs_id_lja || window.rs_id_lja == 0) && !props.avulso && !props?.id_group && props?.client !== false ? 
                    <SelectReact
                      label="Cliente"
                      name="cliente"
                      options={optionsCliente}
                      value={cliente}
                      required={false}
                      onChange={(e) => (setCliente(e.value), setClienteModified(true), setOptionsSystemManutencao([]))}
                      loading={loadingForm}
                    />
                  :'')}

                  {(props.chamados && (!window.rs_id_lja || window.rs_id_lja == 0) &&
                    <SelectReact
                      label="Loja solicitante"
                      name="loja_solicitante"
                      options={optionsLojaSolicitante}
                      value={lojaSolicitante}
                      required={false}
                      onChange={(e) => (setLojaSolicitante(e.value), setLojaSolicitanteModified(true))}
                      loading={loadingForm}
                    />
                  )}

                  {(conf_tipo_comercial  ?
                    <SelectReact
                      label="Tipo"
                      id="tipo_comercial"
                      name="tipo_comercial"
                      options={optionsTipoComercial}
                      allowEmpty={false}
                      value={idTipoComercial}
                      onChange={handleSetTipoComercial}
                      loading={loadingForm}
                    />
                  :'')}

                  {(!props.plano && !props?.id_group && props?.category?.show !== false && window.rs_sistema_id != global.sistema.manutencao_madnezz ?
                    <SelectReact
                      label="Categoria"
                      name="id_category"
                      options={optionsCategory ? optionsCategory.filter((elem) => elem?.id != global.categoria.plano_de_acao) : []} // NÃO INSERE A CATEGORIA PLANO DE AÇÃO POR SER UMA CATEGORIA DE INTEGRAÇÃO
                      allowEmpty={false}
                      value={idCategory}
                      disabled={(window.rs_permission_apl !== 'master' && props?.avulso ? true : false)}
                      onChange={(e) => handleSetCategory(e?.id)}
                      loading={loadingForm}
                    />
                  :'')}

                  {/* CAMPO "SISTEMA" PARA O SISTEMA "MANUTENÇÃO", LISTA OS SISTEMAS AO INVÉS DAS CATEGORIAS */}
                  {(window.rs_sistema_id == global.sistema.manutencao_madnezz ?
                    <SelectReact
                      label="Sistema"
                      name="id_sistema"
                      aux={{
                        id: 'id_sistema',
                        nome: 'nome_sistema'
                      }}
                      options={optionsSystemManutencao}
                      allowEmpty={false}
                      value={idSystem}
                      onChange={(e) => handleSetSystem(e.value)}
                      loading={loadingForm}
                    />
                  :'')}

                  {idCategory && ((conf_tipo_comercial && optionsSubCategory.length > 0 && optionsTipoComercial?.filter((elem) => elem.id == idTipoComercial)[0]?.ite_aux == 1) || !conf_tipo_comercial) && !props.plano && !props?.id_group && props?.subcategory?.show !== false ? (
                    <SelectReact
                      label={window.rs_sistema_id == global.sistema.manutencao_madnezz ? 'Tipo' : 'Subcategoria'}
                      name="id_subcategory"
                      options={optionsSubCategory ? optionsSubCategory.filter((elem) => elem.value != global.subcategoria.checklist) : []} // NÃO INSERE A SUBCATEGORIA CHECKLIST POR SER UMA CATEGORIA DE INTEGRAÇÃO
                      allowEmpty={false}
                      value={idSubcategory}
                      disabled={(window.rs_permission_apl !== 'master' && props?.avulso ? true : false)}
                      onChange={handleSetSubcategory}
                      loading={loadingForm}
                      isLoading={loading?.subcategory}
                    />
                  ) : (
                    <></>
                  )}

                  {(idSubcategory && optionsTypeAuthorization?.length > 0 &&
                    <SelectReact
                      label="Tipo de Liberação"
                      name="id_type_authorization"
                      options={optionsTypeAuthorization} // NÃO INSERE A SUBCATEGORIA CHECKLIST POR SER UMA CATEGORIA DE INTEGRAÇÃO
                      allowEmpty={false}
                      value={idTypeAuthorization}
                      onChange={handleSetTypeAuthorization}
                      loading={loadingForm}
                      isLoading={loading?.subsubcategory}
                    />
                  )}

                  {((system.filter((elem) => elem.id == '224').length) && !props?.id_group && (!props.chamados || (window.rs_id_lja > 0 && window.rs_id_lja && moduloChamadoVisible)) ?
                    <SelectReact
                      label="Módulo Chamados"
                      name="id_modulo_chamado"
                      options={optionsModuloChamados}
                      value={idModuloChamado}
                      onChange={(e) => (setIdModuloChamado(e.value), setIdModuloModified(true))}
                      loading={loadingForm}
                    />
                  :'')}

                  {(system.filter((elem) => elem.id == '225').length && !props?.id_group ?
                    <SelectReact
                      label="Módulo Fases"
                      name="id_modulo_fase"
                      options={optionsModuloFases} 
                      value={idModuloFase}
                      onChange={(e) => (setIdModuloFase(e.value), setIdModuloModified(true))}
                      loading={loadingForm}          
                    />
                  :'')}

                  {(props?.title !== false && conf_title ?
                    <Input
                      type="text"
                      label="Título"
                      name="title"
                      disabled={(window.rs_permission_apl !== 'master' && props?.avulso ? true : false)}
                      value={title}
                      onChange={(e) => (setTitle(e.target.value), setTitleModified(true))}
                      loading={loadingForm}
                    />
                  :'')}

                  <Textarea
                    name="description"
                    placeholder="Descrição"
                    editor={true}
                    value={description}
                    onChange={(e) => (setDescription(e), setDescriptionModified(true))}
                    required={(system.filter((elem) => elem.id == '224').length > 0 || system.filter((elem) => elem.id == '229').length > 0 || system.filter((elem) => elem.id == '231').length > 0 ? true : false)}
                    loading={loadingForm}
                  />

                  {(!props.chamados && !props.fases && !props?.id_group && !props.avulso && props?.actions !== false ?
                    <CheckboxGroup
                      name="disable_job"
                      label="Desabilitar ações"
                      all={false}
                      items={optionsDisableJob}
                      value={disableJob}
                      callback={handleSetDisabledJob}
                      required={false}
                      loading={loadingForm}
                    />
                  :'')}

                  {/* LIMITAÇÃO DE CARGOS SÓ APARECE SE O TIPO "CARGO" NÃO ESTIVER SELECIONADO E ESTIVER NO SISTEMA JOBS */}
                  {(tipo !== 'cargo' && !props.chamados && !props.fases && !props.visitas && props?.limitation !== false ?
                    <CheckboxGroup 
                      id="limitacao_cargo"
                      group="cargo"
                      label={
                        <>
                          Limitação por cargo

                          <Icon
                            title={'Ao selecionar algum cargo, os usuários que não estiverem vinculados a ele não poderão visualizar o card.'}
                            type="help"
                            className="ms-2"
                            readonly
                          />
                        </>
                      }
                      all={false}
                      required={false}
                      value={limitarCargos}
                      loading={loadingForm}
                      callback={handleSetLimitarCargos}
                    />
                  :'')}

                  {(props?.attachment !== false ?
                    <Input
                      type="file"
                      api={{
                        url: url_upload
                      }}
                      label="Anexo"
                      value={anexo}
                      multiple={true}
                      required={(props?.attachmentRequired ? true : false)}
                      callback={handleSetAnexo}
                      loading={loadingForm}
                    />
                  :'')}

                  {/* LIBERAÇÃO DE ACESSO */}
                  {(idTypeAuthorization && 
                    <Liberacao
                      callback={handleCallbackLiberacao}
                    />
                  )}

                  {(!props.chamados && !props.fases && !props.visitas && props?.weight !== false ?
                    <SelectReact
                      id="peso"
                      name="peso"
                      label="Peso"
                      value={peso}
                      allowEmpty={false}
                      required={false}
                      options={[
                        {id: '0', nome: '0'},
                        {id: 1, nome: '1'},
                        {id: 2, nome: '2'},
                        {id: 3, nome: '3'},
                        {id: 4, nome: '4'},
                        {id: 5, nome: '5'},
                        {id: 6, nome: '6'},
                        {id: 7, nome: '7'},
                        {id: 8, nome: '8'},
                        {id: 9, nome: '9'},
                        {id: 10, nome: '10'}
                      ]}
                      onChange={(e) => (setPeso(e.value, setPesoModified(true)))}
                      loading={loadingForm}
                    />
                  :'')}

                  {(!props.chamados && !props.fases && !props.visitas && props?.weight !== false ?
                    <SelectReact
                      id="responsavel"
                      name="responsavel"
                      label="Responsável"
                      value={responsavel}
                      required={false}
                      options={optionsResponsavel}
                      onChange={(e) => (setResponsavel(e.value, setResponsavelModified(true)))}
                      loading={loadingForm}
                    />
                  :'')}

                  {/* O CAMPO ABAIXO SÓ É EXIBIDO SE ESTIVER EM CHAMADOS E O CHECKBOX DE AGENDAR ESTIVER MARCADO */}
                  {(props.chamados && agendar ?
                    <Input
                      type="date"
                      label="Data"
                      name="date_start"
                      value={dateStart}
                      valueStart={new Date()}
                      onChange={(e) => (setDateStart(e), setDateEnd(e))}
                      loading={loadingForm}
                    />
                  :                
                    ''
                  )}

                  {(microssistema && !loadingForm ?
                    <>
                      <div className={style.separator}>
                        <span>Informações complementares</span>
                      </div>         

                      <Microssistema
                        id={microssistema}
                        tipo="loja"
                        loja_id={(window.rs_id_lja && window.rs_id_lja > 0 ? window.rs_id_lja : '')}
                        relatorio_id={(props?.aux_form ? Number(JSON.parse(props?.aux_form).id_aux_form) : undefined)}
                        callback={handleMicrossistemaCallback}
                        item_condicional={524}
                        validation={!risk}
                        validacao_condicional={risk ? true : false}
                        componente_condicional={
                          (props.chamados && props?.risk !== false && conf_com_risco ?
                            <Input
                              type="checkbox"
                              name="risco"
                              id="risco"
                              label="Com risco"
                              padding={false}
                              checked={risk}
                              required={false}
                              className="me-2 mb-2"
                              loading={loadingForm}
                              onChange={() => (setRisk(!risk), setRiskModified(true))}
                            />
                          :'')
                        }
                      />
                    </>
                  :'')}

                  {/* MENSAGEM DE ALERTA CASO SELECIONE MUITOS CHECKBOX'S */}
                  {(alertUsers ? 
                    <p className="mt-3">{alertUsers}</p>
                  :'')}

                  <div className="d-flex align-items-center w-100 justify-content-between">
                    <div>
                      {(!props.empty && !props.plano ? 
                        <Input
                          type="checkbox"
                          name="ativo"
                          id="ativo"
                          label="Ativo"
                          padding={false}
                          checked={ativo}
                          required={false}
                          className="me-2 mb-0"
                          onChange={() => (setAtivo(!ativo), setAtivoModified(true))}
                          loading={loadingForm}
                        />
                      :'')}

                      {(props.chamados && props?.urgent !== false && conf_urgente ? 
                        <Input
                          type="checkbox"
                          name="urgente"
                          id="urgente"
                          label="Urgente"
                          padding={false}
                          checked={urgent}
                          required={false}
                          className="me-2 mb-0"
                          loading={loadingForm}
                          onChange={() => (setUrgent(!urgent), setUrgentModified(true))}
                        />
                      :'')}

                      {(props.chamados && props?.agendar !== false && conf_agendar ?
                        <Input
                          type="checkbox"
                          name="agendar"
                          id="agendar"
                          label="Agendar"
                          padding={false}
                          checked={agendar}
                          required={false}
                          loading={loadingForm}
                          onChange={handleSetAgendar}
                        />
                      :'')}

                      {/* SÓ APARECE NO FASES, SE FOR UM CARD NOVO OU SE ESTIVER EDITANDO E FOR O DONO DO CARD */}
                      {(props.fases && ((props.empty || (!props.empty && (props?.id_group_user == window.rs_id_usr || (!props?.id_group_user && props?.id_card_user == window.rs_id_usr))))) ?
                        <Input
                          type="checkbox"
                          name="send_email"
                          id="send_email"
                          label="Incluir no e-mail"
                          padding={false}
                          checked={sendEmail}
                          required={false}
                          loading={loadingForm}
                          onChange={() => (setSendEmail(!sendEmail), setSendEmailModified(true))}
                        />
                      :'')}
                    </div>

                    <Button
                      type="submit"
                      status={buttonState}
                      disabled={(validation?false:true)}
                      title={alert}
                      float={false}
                      loading={loadingForm}
                    >
                      Salvar
                    </Button>
                  </div>
                </Form>

                {(!props.chamados && !props.fases && !props.visitas && !system.filter((elem) => elem.id == '229').length && !system.filter((elem) => elem.id == '231').length && !props?.id_group && !props?.avulso && props?.optional !== false ?
                  <>
                    <Title>Opcionais</Title>
                    
                    <Form className="mb-4">                    
                      <Input
                        type="text"
                        label="URL Vídeo (Tutorial)"
                        name="url_video"
                        value={urlVideo}
                        onChange={(e) => (setUrlVideo(e.target.value), setUrlVideoModified(true))}
                        onFocusOut={() => (urlVideo?.includes('youtube') || urlVideo?.includes('youtu.be')) ? {} : (setUrlVideo(null), toast('URL de vídeo inválida'))}
                        required={false}
                        loading={loadingForm}
                      />

                      {(() => {
                        if(urlVideo){  
                          let link;
                          if(urlVideo.includes('shorts')){
                            link = urlVideo.split('shorts/')[1];
                          }else if(urlVideo.includes('.be/')){
                            link = urlVideo.split('.be/')[1];
                          }else{
                            link = urlVideo.split('?v=')[1];                      
                          }

                          if((urlVideo.includes('youtube') || urlVideo.includes('youtu.be')) && link){
                            return(
                              <iframe
                                  className="d-block w-100"
                                  style={{height:250, borderRadius: 4, marginTop: 10}}
                                  src={'https://www.youtube.com/embed/'+link.split('&t=')[0]}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                              ></iframe>
                            )
                          }
                        }
                      })()}
                    </Form>
                  </>
                :'')}             

                {(!props.fases && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '231').length && props?.integration !== false && conf_integracao && (!window.rs_id_lja || window.rs_id_lja == 0)?
                  <>
                    <Title>Integração</Title>
                    <Form>
                      <SelectReact
                        label="Sistema"
                        name="id_job_system"
                        options={
                          (system.filter((elem) => elem.id == '229').length > 0 ? // CASO ESTEJA CRIANDO UM COMUNICADO SÓ PERMITE A INTEGRAÇÃO COM MICROSSISTEMAS
                            optionsJobSystem.filter((elem) => elem.id == global.integracao.microssistemas_old)
                          :
                            optionsJobSystem
                          )
                        }
                        value={idJobSystem}
                        onChange={(e) => (
                          setIdJobSystem(e.value),
                          setIdJobSystemModified(true),
                          changeSystem(e.value),
                          setNomeIntegracao(e.label)
                        )}
                        required={false}
                        loading={loadingForm}
                      />
                      {idJobSystem ? (
                        <>
                          {(optionsJobSystemType.length > 0 ? 
                            <SelectReact
                              label={(nomeIntegracao ? nomeIntegracao : 'Tipo')}
                              name="id_job_system_type"
                              options={optionsJobSystemType}
                              value={idJobSystemType}
                              onChange={(e) => (
                                setIdJobSystemType(e.value),
                                setIdJobSystemModified(true),
                                (idJobSystem==global?.integracao?.trade?changeSystemAux(global?.integracao?.trade, e.value):{}) // TRADE
                                (idJobSystem==global?.integracao?.trade_legado?changeSystemAux(global?.integracao?.trade_legado, e.value):{}) // TRADE LEGADO
                              )}
                              required={true}
                              loading={loadingForm}
                            />
                          :'')}

                          {((idJobSystem==1 || idJobSystem==25 || idJobSystem==28) && tipo == 'usuario' ? // CHECKLIST E CHECKLIST LARAVEL
                            <SelectReact
                              label="Loja"
                              name="id_job_system_type1"
                              options={optionsJobSystemType1}
                              value={idJobSystemType1}
                              onChange={(e) => (
                                setIdJobSystemModified(true),
                                setIdJobSystemType1(e.value) 
                              )}
                              required={false} 
                              loading={loadingForm}
                            />
                          :'')}
                        </>
                      ) : (
                        <></>
                      )}

                      {/* SISTEMA TRADE E TIPO DE TRADE = GRUPO */}
                      {(idJobSystem == global?.integracao?.trade || idJobSystem == global?.integracao?.trade_legado) && idJobSystemType==1? (
                        <SelectReact
                          label="Grupo"
                          name="sistema_aux_1"
                          options={optionsJobSystemAux}
                          value={idJobSystemType1}
                          onChange={(e) => (
                            setIdJobSystemModified(true),
                            setIdJobSystemType1([e.value])
                          )}
                          required={false}
                          loading={loadingForm}
                        />
                      ) : (
                        <></>
                      )}

                      {/* SISTEMA TRADE E TIPO DE TRADE = INDÚSTRIA */}
                      {(idJobSystem == global?.integracao?.trade || idJobSystem == global?.integracao?.trade_legado) && idJobSystemType==2? (
                        <>
                          <InputContainer display="block" label="Indústria" collapse={true} loading={loadingForm}>
                            {(optionsJobSystemAux2.length>0?
                              optionsJobSystemAux2.map((item, i) => {
                                  return(
                                      <Input 
                                          key={item?.id}
                                          type="checkbox"
                                          label={item?.nome}
                                          id={item?.id}
                                          value={item?.id}
                                          checked={(idJobSystemType1.includes(item?.id?.toString()) ? true : null)}
                                          onChange={(e) => {handleSetIdJobSystemType1(e)}}
                                      />
                                  )
                              })
                          :'')}
                          </InputContainer>

                          <InputContainer display="block" label="Produto" collapse={true} loading={loadingForm}>
                            {(optionsJobSystemAux3.length>0?
                              optionsJobSystemAux3.map((item, i) => {
                                  return(
                                      <Input 
                                          key={item?.id}
                                          type="checkbox"
                                          label={item?.nome}
                                          id={item?.id}
                                          value={item?.id}
                                          checked={(idJobSystemType2.includes(item?.id?.toString())?true:null)}
                                          onChange={(e) => {handleSetIdJobSystemType2(e)}}
                                      />
                                  )
                              })
                          :'')}
                          </InputContainer>
                        </>
                      ) : (
                        <></>
                      )}

                      {(!props.visitas && !props.avulso ? 
                        <SelectReact
                          required={false}
                          label="Job API"
                          name="job_api"
                          options={optionsJobApi}
                          value={idJobApi}
                          onChange={(e) => (
                            setIdJobApi(e.value),
                            setIdJobApiModified(true),
                            setDisableJob(disableJob => [...disableJob, '1'])
                          )}
                          loading={loadingForm}
                        />
                      :'')}
                    </Form>
                  </>
                :'')}
              </div>
            </Col>

            {(box_user_aux ?
              <Col>                
                <Form>
                  <div ref={filterCol}>
                    {((tipo === 'loja' || tipo === 'usuario') && !loadingForm ?
                      <Separator
                        label="Filtros"
                        marginTop={false}
                        marginBottom={10}
                      />
                    :'')}

                    {/* FITLROS PARA O TIPO "LOJA" */}
                    {(tipo === 'loja' &&
                      <div className={style.filters}>
                        <CheckboxGroup
                          name="filter_marca"
                          label="Filtrar por marca"
                          api={{
                            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                            params: {
                              db_type: global.db_type,
                              do: 'getTable',
                              tables: [{
                                table: 'brand'
                              }]
                            },
                            key_aux: ['data', 'brand']
                          }}
                          maxHeight={300}
                          loadDefault={false}
                          value={filterMarca ? filterMarca : []}
                          all={false}
                          loading={loadingForm}
                          callback={handleFilterMarca}
                        />

                        <CheckboxGroup
                          name="filter_regiao"
                          label="Filtrar por região"
                          api={{
                            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                            params: {
                              db_type: global.db_type,
                              do: 'getTable',
                              tables: [{
                                table: 'region'
                              }]
                            },
                            key_aux: ['data', 'region']
                          }}
                          maxHeight={300}
                          loadDefault={false}
                          value={filterRegiao ? filterRegiao : []}
                          all={false}
                          loading={loadingForm}
                          callback={handleFilterRegiao}
                        />

                        <CheckboxGroup
                          name="filter_segmento"
                          label="Filtrar por segmentos"
                          api={{
                            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                            params: {
                              db_type: global.db_type,
                              do: 'getTable',
                              tables: [{
                                table: 'item',
                                name: 'segmento',
                                filter: {
                                  id_cfg: 32
                                }
                              }]
                            },
                            key_aux: ['data', 'segmento', 'data']
                          }}
                          maxHeight={300}
                          loadDefault={false}
                          value={filterSegmento ? filterSegmento : []}
                          all={false}
                          loading={loadingForm}
                          callback={handleFilterSegmento}
                        />
                      </div>
                    )}  

                    {/* FITLROS PARA O TIPO "USUÁRIO" */}
                    {(tipo === 'usuario' &&
                      <div className={style.filters}>
                        <CheckboxGroup
                          name="filter_cargo"
                          label="Filtrar por cargos"
                          api={{
                            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                            params: {
                              db_type: global.db_type,
                              do: 'getTable',
                              tables: [{
                                table: 'office'
                              }]
                            },
                            key_aux: ['data', 'office']
                          }}
                          maxHeight={300}
                          loadDefault={false}
                          value={filterCargo ? filterCargo : []}
                          all={false}
                          loading={loadingForm}
                          callback={handleFilterCargo}
                        />

                        <CheckboxGroup
                          name="filter_departamento"
                          label="Filtrar por departamentos"
                          api={{
                            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                            params: {
                              db_type: global.db_type,
                              do: 'getTable',
                              tables: [{
                                table: 'department'
                              }]
                            },
                            key_aux: ['data', 'department']
                          }}
                          maxHeight={300}
                          loadDefault={false}
                          value={filterDepartamento ? filterDepartamento : []}
                          all={false}
                          loading={loadingForm}
                          callback={handleFilterDepartamento}
                        />
                      </div>
                    )}  
                  </div>

                  <InputContainer
                    display="block"
                    style_aux={{
                      maxHeight: (leftCol && filterCol ? (leftCol?.current?.offsetHeight - filterCol?.current?.offsetHeight - 15) : undefined),
                      minHeight: (leftCol && filterCol ? (leftCol?.current?.offsetHeight - filterCol?.current?.offsetHeight - 15) : undefined)
                    }}
                    loading={loadingForm}
                  >
                    {(() => {
                      if(tipo){
                        let label_aux;

                        if(tipo === 'usuario'){
                          label_aux = 'usuários ' + '('+(idUsers.length === 0 ? 'Nenhum' : idUsers.length)+' selecionado'+(idUsers.length > 1 ? 's' : '')+')';
                        }else if(tipo === 'loja'){
                          label_aux = 'lojas ' + '('+(idStore.length === 0 ? 'Nenhuma' : idStore.length)+' selecionada'+(idStore.length > 1 ? 's' : '')+')';
                        }else if(tipo === 'cargo'){
                          label_aux = 'cargos ' + '('+(idOffice.length === 0 ? 'Nenhum' : idOffice.length)+' selecionado'+(idOffice.length > 1 ? 's' : '')+')';
                        }else if(tipo === 'departamento'){
                          label_aux = 'departamentos ' + '('+(idDepartment.length === 0 ? 'Nenhum' : idDepartment.length)+' selecionado'+(idDepartment.length > 1 ? 's' : '')+')';
                        }

                        return (
                          <Separator
                            label={'Seleção de ' + label_aux}
                            marginTop={false}
                            marginBottom={10}
                          />
                        )
                      }
                    })()}

                    {(() => {
                      if (loadingUser) {
                        return <Loader show={loadingUser} />;
                      } else {
                        // LISTA DE OPÇÕES FILTRADAS
                        let checkbox_filtered = checkboxs.filter((item) => {
                          if (!filter) return true;
                          if (item.nome.toLowerCase().includes(filter.toLowerCase())){
                            return true;
                          }
                        });

                        // VERIFICA SE TODOS OS ITENS FILTRADOS ESTÃO SELECIONADOS
                        let all_selected = true;
                        
                        checkbox_filtered.map((item, i) => {
                          if(idUsers.filter((elem) => elem?.id == item?.id).length == 0 && tipo === 'usuario'){
                            all_selected = false;
                          }

                          if(idStore.filter((elem) => elem?.id == item?.id).length == 0 && tipo === 'loja'){
                            all_selected = false;
                          }

                          if(idOffice.filter((elem) => elem?.id == item?.id).length == 0 && tipo === 'cargo'){
                            all_selected = false;
                          }

                          if(idDepartment.filter((elem) => elem?.id == item?.id).length == 0 && tipo === 'departamento'){
                            all_selected = false;
                          }
                        });

                        return (
                          <>
                            {(checkboxs?.length>0?
                              <>
                                <div className={'d-flex justify-content-between'}>
                                  {(!props.fases && !props.visitas && !props.id_group && (!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length)?
                                    <Input
                                      type="checkbox"
                                      name="select_all"
                                      id="select_all"
                                      label="Selecionar todos"
                                      value="select_all"
                                      className="pt-1 mb-0 ps-0"
                                      checked={all_selected}
                                      onClick={checkAll}
                                      onChange={() => console.log('')}
                                    />
                                  :'')}

                                  {(tipo === 'loja' && !props.id_group && (!props.fases && !props.visitas && (!system.filter((elem) => elem.id == '224').length && !system.filter((elem) => elem.id == '225').length && !system.filter((elem) => elem.id == '226').length)) ?
                                    <div className={style.importer}>
                                      <Icon
                                        type="upload"
                                        title="Importar planilha de lojas"
                                        onClick={handleSetImporter}
                                        loading={loadImporter}
                                      />
                                    </div>
                                  :'')}
                                </div>

                                <Input
                                  type="text"
                                  name="filtro"
                                  placeholder="Buscar..."
                                  required={false}
                                  value={filterValue}
                                  onChange={(e) => (
                                    setFilter(e.target.value),
                                    setFilterValue(e.target.value)
                                  )}
                                  autocomplete="off"
                                  className="mb-2"
                                />

                                  {checkbox_filtered.map((item, i) => {
                                    let checked;
                                    let hour;
                                    let date;

                                    if(tipo == 'loja'){
                                      if(idStore.length > 0){
                                        checked = idStore.filter((elem) => elem.id == item.id).length > 0;
                                      }else{
                                        checked = false;
                                      }

                                      if (idStore.length > 0) {
                                        hour = idStore.filter((elem) => elem.id == item.id)[0]?.hour_limit;
                                        date = idStore.filter((elem) => elem.id == item.id)[0]?.date_start;
                                      } else {
                                        hour = '';
                                        date = '';
                                      }
                                    }else if(tipo == 'usuario'){
                                      if(idUsers.length > 0){
                                        checked = idUsers.filter((elem) => elem.id == item.id).length > 0;
                                      }else{
                                        checked = false;
                                      }

                                      if (idUsers.length > 0) {
                                        hour = idUsers.filter((elem) => elem.id == item.id)[0]?.hour_limit;
                                        date = idUsers.filter((elem) => elem.id == item.id)[0]?.date_start;
                                      } else {
                                        hour = '';
                                        date = '';
                                      }
                                    }else if(tipo == 'cargo'){
                                      if(idOffice.length > 0){
                                        checked = idOffice.filter((elem) => elem.id == item.id).length > 0;
                                      }else{
                                        checked = false;
                                      }

                                      if (idOffice.length > 0) {
                                        hour = idOffice.filter((elem) => elem.id == item.id)[0]?.hour_limit;
                                        date = idOffice.filter((elem) => elem.id == item.id)[0]?.date_start;
                                      } else {
                                        hour = '';
                                        date = '';
                                      }
                                    }else if(tipo == 'departamento'){
                                      if(idDepartment.length > 0){
                                        checked = idDepartment.filter((elem) => elem.id == item.id).length > 0;
                                      }else{
                                        checked = false;
                                      }

                                      if (idDepartment.length > 0) {
                                        hour = idDepartment.filter((elem) => elem.id == item.id)[0]?.hour_limit;
                                        date = idDepartment.filter((elem) => elem.id == item.id)[0]?.date_start;
                                      } else {
                                        hour = '';
                                        date = '';
                                      }
                                    }else{
                                      if(idUsers.length > 0){
                                        checked = idUsers.filter((elem) => elem.id == item.id).length > 0;
                                      }else{
                                        checked = false;
                                      }

                                      if (idUsers.length > 0) {
                                        hour = idUsers.filter((elem) => elem.id == item.id)[0]?.hour_limit;
                                        date = idUsers.filter((elem) => elem.id == item.id)[0]?.date_start;
                                      } else {
                                        hour = '';
                                        date = '';
                                      }
                                    }                                  

                                    return (
                                      <CheckboxUser
                                        key={item.id}
                                        type={(system.filter((elem) => elem.id == '224').length || system.filter((elem) => elem.id == '225').length || system.filter((elem) => elem.id == '226').length || props.id_group ? 'radio' : 'checkbox')} // SE FOR FASE OU VISITA VIRA RADIO BUTTON
                                        name="id_user[]"
                                        emp={(window.rs_id_grupo > 0 ? item?.nome_emp : '')}
                                        fullwidth={true}
                                        id={item.id}
                                        id_fase={item?.id_fase}
                                        value={Number(item.id)}
                                        date={(system.filter((elem) => elem.id == '224').length || system.filter((elem) => elem.id == '225').length || props.id_group || system.filter((elem) => elem.id == '226').length ? false : true)} // SE FOR CHAMADO, FASE OU VISITA DESATIVA O INPUT DE DATA PERSONALIZADA
                                        dateStart={(date ? new Date(date+' 00:00:00') : dateStart)}
                                        frequency={idFrequency}
                                        optionsHourLimit={optionsHourLimit}
                                        hourLimit={(hour ? hour : hourLimit)}
                                        label={item?.luc ? item?.luc + ' - ' + item?.nome : item.nome}
                                        required={true}
                                        className="p-0"
                                        checked={checked}
                                        onChange={handleCheck}
                                        onChangeDate={handleCheckDate}
                                        onChangeHour={handleCheckHour}
                                      />
                                    );
                                  })
                                }
                              </>
                            :
                              <p>{'Nenhum(a) '+tipo+' disponível'}</p>
                            )}
                          </>
                        );
                      }
                    })()}
                  </InputContainer>
                </Form>
              </Col>
            :'')}
          </Row>

          {(props.get && cardsList.length > 0 ?
            cardsList.map((card, i) => {
              return(
                <CardJobs
                  key={'home_card_' + card?.id_job_status}
                  card={card}
                  jobs={cardsList}
                  job={card}
                  modal={true}
                  chat={{
                    send: props?.get?.chat?.send
                  }}
                  troca_operador={props?.get?.troca_operador}
                  integration={props?.get?.integration}
                  actions={props?.get?.actions}
                  background={props?.get?.background}
                  fullwidth={true}
                  // tipoCalendario={filters?.tipoCalendario}
                  // subTipoCalendario={filters?.subTipoCalendario}
                />
              )
            })
          :'')}
        </ModalBody>
      </Modal>

      {(() => {
        if (props.empty) {
          let title;          

          if(props?.title){
            title = props.title
          }else{
            if(props.chamados){
              title = 'Novo chamado';
            }else if(props.fases){
              title = 'Nova fase';
            }else if(props.visitas){
              title = 'Nova visita';
            }else{
              title = 'Novo job';
            }
          }

          if(props?.format == 'box_home'){
            return(
              <div className={'home_box_item'}>
                  <a href="#" onClick={() => handleShowModal()}>
                      <img src={icon_home} alt={'Solicitação de troco'} className={'home_box_item_icon'} />
                      <span className={'home_box_item_txt'}>
                          Solicitação de Desconto
                      </span>
                  </a>
              </div>
            )
          }else{
            if(props.icon!==false){
              if(props?.avulso){ // PARAMETRO DO VISITAS PARA CRIAR UMA VISITA AVULSA
                return(
                  <Tippy content={props?.cardTitle}>
                    <div onClick={() => handleShowModal()}>
                      <Card
                        title={(props?.cardTitle)}
                        size="smallest"
                        avulso={true}
                      />
                    </div>
                  </Tippy>
                )
              }else{
                if(((window.rs_id_emp==26 && !props.notificacoes && !props.comunicados && !props.visitas && !props.fases && !props.chamados && window.rs_permission_apl === 'master') 
                  || (props.notificacoes || props.comunicados || props.visitas || props.fases || props.chamados)
                  || (window.rs_id_emp!=26))
                  && (!props.fases || (props.fases && window.rs_permission_apl=='master') || (props.fases && props?.tipo_aux=='card_internal' && window.rs_permission_apl=='supervisor'))){
                  return (
                    <Icon
                      type="new"
                      title={(props.disabled ? 'É preciso avaliar os chamados pendentes de avaliação no Pós-venda' : title)}
                      disabled={props.disabled}                
                      onClick={() => (configuracoes?.filter((elem) => elem.conf_tipo === 'cadastro')[0]?.conf_atalho_categoria == 1 ? handleShowModalAtalhos() : handleShowModal())}
                    />
                  );
                }
              }            
            }  
          }
        } else {
          if(props.icon!==false){
            let title;
            let icon;

            if(props?.disabledTitle){
              title = props.disabledTitle;
            }else{
              if(props.disabled){
                title = 'Não é possível editar um '+(props.chamados?'chamado':'job')+' já finalizado';
              }else{
                if(props?.iconTitle){
                  title = props?.iconTitle;
                }else{
                  title = 'Editar';
                }
              }
            }

            if(props?.icon){
              icon = props?.icon;
            }else{
              icon = 'edit';
            }

            return (
              <Icon
                type={icon}
                title={title}
                disabled={props.disabled}
                animated
                onClick={() => (setShowModal(true), editarJob(props.id, props.lote))}
              />
            );
          }
        }
      })()}
    </>
  );
}
