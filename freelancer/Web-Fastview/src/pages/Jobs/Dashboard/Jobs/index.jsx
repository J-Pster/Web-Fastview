import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../../../context/Global.jsx";
import { cdh, get_date } from '../../../../_assets/js/global.js';
import axios from "axios";

import Row from "../../../../components/body/row/index.jsx";
import Col from "../../../../components/body/col/index.jsx";
import Dashboard from "../../../../components/body/dashboard/index.jsx";
import Tr from '../../../../components/body/table/tr/index.jsx';
import Th from '../../../../components/body/table/thead/th/index.jsx';
import Td from '../../../../components/body/table/tbody/td/index.jsx';
import SelectReact from "../../../../components/body/select/index.jsx";
import PageError from '../../../../components/body/pageError/index.jsx';
import Modal from "../../../../components/body/modal/index.jsx";
import ModalHeader from "../../../../components/body/modal/modalHeader/index.jsx";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle/index.jsx";
import ModalBody from "../../../../components/body/modal/modalBody/index.jsx";
import Table from "../../../../components/body/table/index.jsx";
import Tbody from "../../../../components/body/table/tbody/index.jsx";
import Thead from "../../../../components/body/table/thead/index.jsx";
import Usuarios from "./Usuarios";
import Lojas from "./Lojas";
import Supervisores from "./Supervisores/index.jsx";
import Categorias from "./Categorias";
import Subcategorias from "./Subcategorias/index.jsx";
import Container from "../../../../components/body/container/index.jsx";
import { JobsContext } from "../../../../context/Jobs.jsx";

export default function DashboardPage(props) {
    // CONTEXT GLOBAL
    const { loadingCalendar, handleSetFirstLoad, handleSetFixFilterModule, handleSetFilter, handleSetFilterModule, filterModule } = useContext(GlobalContext); 

    // CONTEXT JOBS
    const { configuracoes } = useContext(JobsContext);

    // ESTADOS
    const [monthSelected, setMonthSelected] = useState(window.currentMonth);
    const [yearSelected, setYearSelected] = useState(window.currentYear);
    const [supervisorActive, setSupervisorActive] = useState('');
    const [lojaActive, setLojaActive] = useState('');
    const [usuarioActive, setUsuarioActive] = useState('');
    const [categoriaActive, setCategoriaActive] = useState('');
    const [subcategoriaActive, setSubcategoriaActive] = useState('');
    const [optionsModule, setOptionsModule] = useState([]);
    const [pageError, setPageError] = useState(false);

    // ESTADOS MODAL
    const [showModal, setShowModal] = useState(false);
    const [supervisorId, setSupervisorId] = useState([]);
    const [lojaId, setLojaId] = useState([]);
    const [usuarioId, setUsuarioId] = useState([]);
    const [categoriaId, setCategoriaId] = useState([]);
    const [subcategoriaId, setSubcategoriaId] = useState([]);
    const [titulo, setTitulo] = useState([]);
    const [status, setStatus] = useState('');
    const [statusName, setStatusName] = useState('');
    const [itemsInfo, setItemsInfo] = useState([]);

    // CONFIGURAÇÕES
    let conf_filtro_tipo_operador = true;

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar){
        let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar;
        console.log("caiu aqui -2");

        if(JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filterModule).length > 0){
            json_aux = JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filterModule)[0]?.values;
            console.log("caiu aqui -1", json_aux);

            // CONFIGURAÇÃO FILTRO TIPO OPERADOR
            if(json_aux.filter((elem) => elem.nome === 'filtro_tipo_operador').length > 0){
                console.log("caiu aqui 0");
                if(json_aux.filter((elem) => elem.nome === 'filtro_tipo_operador')[0]?.value == 1){
                    console.log("caiu aqui 1");
                    conf_filtro_tipo_operador = false;
                }else{
                    console.log("caiu aqui 2");
                    conf_filtro_tipo_operador = true;
                }
            }
        }
    }

    // PEGA ID DO MÓDULO
    useEffect(() => {
        if(optionsModule == 0 && (props.chamados || props.fases || props.visitas)){
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
                        id_emp: window.rs_id_emp
                      }
                    }]
                  }
                }).then((response) => {      
                    if(response.data){
                        if(response.data?.data[table_aux]){
                            setOptionsModule(response?.data?.data[table_aux]);
                        }

                        let first_module_aux;
                        if(props.chamados){
                            // SE ESTIVER DENTRO DO SISTEMA MANUTENÇÃO, SETA O MÓDULO "MADNEZZ"
                            if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
                                first_module_aux = response?.data?.data[table_aux].filter((elem) => elem?.id == global.modulo.manutencao)[0];
                            }else{
                                first_module_aux = response?.data?.data[table_aux].filter((elem) => elem?.permissao !== 'sem_acesso')[0];
                            }
                        }else{
                            first_module_aux = response?.data?.data[table_aux][0];
                        }

                        if(props.visitas){
                            handleSetFilterModule(global.modulo.visitas);
                        }else{
                            if(first_module_aux){
                                handleSetFilterModule((first_module_aux ? first_module_aux.id : 0)); // SELECIONA O PRIMEIRO (CASO TENHA) COMO PADRÃO AO CARREGAR A PÁGINA
                            }else{
                                setPageError(true);
                            } 
                        }
                    }else{
                        if(props.chamados || props.fases){
                            setPageError(true);
                        }
                    }
                });
            }
        }
    },[]);

    // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
    useEffect(() => {
        handleSetFilter(true);
        loadingCalendar(true);
        handleSetFixFilterModule(false);
        handleSetFirstLoad(true);
    },[]);

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

    // MANDA OS FILTROS PRO COMPONENTE PAI E TRAVA OS FILTROS ENQUANTO AS COLUNAS CARREGAM
    useEffect(() => {
        if (props?.icons) {
            props.icons('');
        }

        if (props?.filters) {
            props.filters(
                <>
                    {((props.chamados || props.fases) && window.rs_sistema_id != global.sistema.manutencao_madnezz ? // SE FOR CHAMADOS, E NÃO ESTIVER NO SISTEMA "CHAMADOS EMPRESA REACT" MOSTRA O FILTRO DE MÓDULO
                        <SelectReact
                            options={optionsModule}
                            placeholder="Módulo"
                            name="filter_module"
                            allowEmpty={false}
                            value={filterModule}
                            onChange={(e) => (
                                handleSetFilterModule(e.value)
                            )}
                        />
                    :'')}

                    <SelectReact
                        placeholder="Mês"
                        options={optionsMonths}
                        value={monthSelected}
                        allowEmpty={false}
                        onChange={(e) => setMonthSelected(e.value)}
                    />

                    <SelectReact
                        placeholder="Ano"
                        options={optionsYear}
                        value={yearSelected}
                        allowEmpty={false}
                        onChange={(e) => setYearSelected(e.value)}
                    />
                </>
            )
        }
    }, [monthSelected, yearSelected, optionsModule, filterModule]);

    // BUSCA OS JOBS REFERENTE AO NÚMERO CLICADO
    function getInfo(supervisor_id, loja_id, usuario_id, categoria_id, subcategoria_id, titulo, status){
        setShowModal(true);
        setSupervisorId(supervisor_id);
        setLojaId(loja_id);
        setUsuarioId(usuario_id);
        setCategoriaId(categoria_id);
        setSubcategoriaId(subcategoria_id);
        setTitulo(titulo);
        setStatus(status);

        let status_aux = '';
        if(status === -2){
            status_aux = 'Atrasado';
        }else if(status === 1){
            status_aux = 'Concluído';
        }else if(status === 3){
            status_aux = 'Concluído c/ Atraso';
        }else if(status === 2){
            status_aux = 'Não tem';
        }

        setStatusName(status_aux);
    }
 
    // FECHA MODAL
    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setItemsInfo([]);
        },500);
    }

    // INFO MODAL
    const handleSetItemsInfo = (e) => {
        setItemsInfo(e);
    }

    const handleCallback = (e) => {
        if(e.getInfo){
            getInfo(
                e.getInfo?.supervisor_id,
                e.getInfo?.loja_id,
                e.getInfo?.usuario_id,
                e.getInfo?.categoria_id,
                e.getInfo?.subcategoria_id,
                e.getInfo?.titulo,
                e.getInfo?.status
            );
        }

        if(e.filterCol){
            if(e.filterCol.categoria_id || e.filterCol.categoria_id === ''){
                setCategoriaActive(e.filterCol.categoria_id);
            }

            if(e.filterCol.loja_id || e.filterCol.loja_id === ''){
                setLojaActive(e.filterCol.loja_id);
            }

            if(e.filterCol.subcategoria_id || e.filterCol.subcategoria_id === ''){
                setSubcategoriaActive(e.filterCol.subcategoria_id);
            }

            if(e.filterCol.supervisor_id || e.filterCol.supervisor_id === ''){
                setSupervisorActive(e.filterCol.supervisor_id);
            }

            if(e.filterCol.usuario_id || e.filterCol.usuario_id === ''){
                setUsuarioActive(e.filterCol.usuario_id);
            }
        }
    }

    // SÓ EXECUTA O CÓDIGO DO DASHBOARD DEPOIS QUE TIVER UM MÓDULO SETADO OU NO SISTEMA JOBS
    if(filterModule || (!props.chamados && !props.fases && !props.visitas)){
        return (  
            <Container> 
                <Modal show={showModal} onHide={handleCloseModal} xl={true}> 
                    <ModalHeader>
                        <ModalTitle>
                            Jobs
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <Table
                            id="jobs_info"
                            api={window.host_madnezz+'/systems/integration-react/api/request.php'}
                            params={{
                                db_type: global.db_type,
                                do: 'getReport',
                                type: 'Job',
                                filter_type: 'moreColumns',
                                filter_subtype: 'dashboard_info',
                                filter_date_start: yearSelected+'-'+monthSelected+'-01',
                                filter_date_end: get_date('date_sql', get_date('last_date', '01/'+monthSelected+'/'+yearSelected, 'date_sub_month', 0)),
                                filter_supervisor: [(supervisorActive ? supervisorActive : supervisorId)],
                                filter_id_store: [(lojaActive ? lojaActive : lojaId)],
                                filter_id_user: [(usuarioActive ? usuarioActive : usuarioId)],
                                filter_id_category: [(categoriaActive ? categoriaActive : categoriaId)],
                                filter_id_subcategory: [(subcategoriaActive ? subcategoriaActive : subcategoriaId)],
                                filter_title: titulo,
                                filter_id_module: filterModule,
                                filter_status: [status],
                                limit: 50,
                                id_apl: window.rs_id_apl
                            }}
                            key_aux={['data']}
                            // border={false}
                            onLoad={handleSetItemsInfo}
                            reload={showModal}
                        >
                            <Thead>
                                <Tr>
                                    {(lojaId || categoriaId || subcategoriaId ? 
                                        <Th>Loja</Th>
                                    :'')}

                                    {(usuarioId || categoriaId || subcategoriaId ? 
                                        <Th>Usuário</Th>
                                    :'')}

                                    <Th>Título</Th>
                                    <Th>Categoria</Th>
                                    <Th>Subcategoria</Th>
                                    <Th align="center">Data</Th>
                                    <Th align="center">Data Finalizado</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {itemsInfo.map((item, i) => {
                                    return(
                                        <Tr>
                                            {(lojaId || categoriaId || subcategoriaId ? 
                                                <Td>{(item?.nome_loja ? item?.nome_loja : '-')}</Td>
                                            :'')}

                                            {(usuarioId || categoriaId || subcategoriaId ? 
                                                <Td>{(item?.nome_usuario ? item?.nome_usuario : '-')}</Td>
                                            :'')}

                                            <Td>{item?.titulo}</Td>
                                            <Td>{item?.categoria}</Td>
                                            <Td>{item?.subcategoria}</Td>
                                            <Td align="center">{(item?.data ? get_date('date', item?.data, 'datetime_sql') : '-')}</Td>
                                            <Td align="center">{(item?.dataHora_realizacao ? get_date('date', item?.dataHora_realizacao, 'datetime_sql') : '-')}</Td>
                                            <Td>{statusName}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </ModalBody>
                </Modal>

                <Row wrap={(window.isMobile ? true : false)}>
                    {(!props.fases && !props.chamados ?
                        <Supervisores
                            filters={{
                                monthSelected: monthSelected,
                                yearSelected: yearSelected,
                                filterModule: filterModule,
                                supervisorActive: supervisorActive,
                                lojaActive: lojaActive,
                                usuarioActive: usuarioActive,
                                categoriaActive: categoriaActive
                            }}
                            callback={handleCallback}
                        />
                    :'')}

                    {(!props.fases && conf_filtro_tipo_operador ?
                        <Lojas
                            chamados={props.chamados}
                            filters={{
                                monthSelected: monthSelected,
                                yearSelected: yearSelected,
                                filterModule: filterModule,
                                supervisorActive: supervisorActive,
                                lojaActive: lojaActive,
                                usuarioActive: usuarioActive,
                                categoriaActive: categoriaActive
                            }}
                            callback={handleCallback}
                        />
                    :'')}

                    <Usuarios
                        chamados={props.chamados}
                        filters={{
                            monthSelected: monthSelected,
                            yearSelected: yearSelected,
                            filterModule: filterModule,
                            supervisorActive: supervisorActive,
                            lojaActive: lojaActive,
                            usuarioActive: usuarioActive,
                            categoriaActive: categoriaActive
                        }}
                        callback={handleCallback}
                    />

                    <Categorias
                        chamados={props.chamados}
                        filters={{
                            monthSelected: monthSelected,
                            yearSelected: yearSelected,
                            filterModule: filterModule,
                            supervisorActive: supervisorActive,
                            lojaActive: lojaActive,
                            usuarioActive: usuarioActive,
                            categoriaActive: categoriaActive
                        }}
                        callback={handleCallback}
                    />

                    <Subcategorias
                        chamados={props.chamados}
                        filters={{
                            monthSelected: monthSelected,
                            yearSelected: yearSelected,
                            filterModule: filterModule,
                            supervisorActive: supervisorActive,
                            lojaActive: lojaActive,
                            usuarioActive: usuarioActive,
                            categoriaActive: categoriaActive
                        }}
                        callback={handleCallback}
                    />
                </Row>
            </Container>
        )
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
