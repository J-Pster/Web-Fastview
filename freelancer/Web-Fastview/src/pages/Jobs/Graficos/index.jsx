import { useContext, useEffect, useState } from "react";

import Chart from "../../../components/body/chart";
import Col from "../../../components/body/col";
import Row from "../../../components/body/row";
import SelectReact from "../../../components/body/select";
import { JobsContext } from "../../../context/Jobs";
import FilterCheckbox from "../../../components/body/filterCheckbox";
import { GlobalContext } from "../../../context/Global";
import axios from "axios";
import { cd, get_date } from "../../../_assets/js/global";
import Container from "../../../components/body/container";

export default function Graficos(props){
    // CONTEXT GLOBAL
    const { handleSetFilter, handleSetFixFilterModule, loadingCalendar, filterModule, handleSetFilterModule, handleSetFirstLoad } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { handleSetFilterEmpreendimento, filterEmpreendimento } = useContext(JobsContext);

    // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
    useEffect(() => {
        handleSetFilter(true);
        loadingCalendar(true);
        handleSetFixFilterModule(false);
        handleSetFirstLoad(true);
    }, []);

    var date = new Date();

    // ESTADOS OPTIONS
    const [optionsModule, setOptionsModule] = useState([]);

    // OPTIONS MESES
    const optionsMonths = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ]

    // OPTIONS ANO
    var optionsYear = [];
    for (var i = 0; i < 5; i++) {
        optionsYear.push(
        { value: window.currentYear - i, label: window.currentYear - i }
        )
    }

    // ESTADOS
    const [pageError, setPageError] = useState(false);
    const [loja, setLoja] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [subcategoria, setSubcategoria] = useState([]);
    const [frequencia, setFrequencia] = useState([]);
    const [status, setStatus] = useState([]);
    const [supervisor, setSupervisor] = useState([]);
    const [mes, setMes] = useState(window.currentMonth);
    const [ano, setAno] = useState(window.currentYear);
    const [monthJobs, setMonthJobs] = useState([]);
    const [loadingMonth, setLoadingMonth] = useState(true);
    const [dataInicial, setDataInicial] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
    const [dataFinal, setDataFinal] = useState(new Date());
    const [filterMonth, setFilterMonth] = useState(window.currentMonth);
    const [filterYear, setFilterYear] = useState(window.currentYear);

    // FILTRA SUPERVISOR
    const handleSetSupervisor = (e) => {
        setSupervisor(e);
    }

    // FILTRA LOJA
    const handleSetLoja = (e) => {
        setLoja(e);
    }

    // FILTRA USUÁRIO
    const handleSetUsuario = (e) => {
        setUsuario(e);
    }

    // FILTRA CATEGORIA
    const handleSetCategoria = (e) => {
        setCategoria(e);
    }

    // FILTRA SUBCATEGORIA
    const handleSetSubcategoria = (e) => {
        setSubcategoria(e);
    }

    // FILTRA FREQUÊNCIA
    const handleSetFrequencia = (e) => {
        setFrequencia(e);
    }

    // FILTRA STATUS
    const handleSetStatus = (e) => {
        setStatus(e);
    }

    // BUSCA MÓDULOS
    if (optionsModule.length == 0 && (props?.chamados || props?.fases || props?.visitas)) {
        axios.get(window.host_madnezz + "/systems/integration-react/api/list.php?do=get_module&&id_apl="+window.rs_id_apl+"&empreendimento_id=" + filterEmpreendimento).then((response) => {
          if (response.data.length > 0) {
            setOptionsModule(response.data);
  
            if (props.chamados || props.fases || props.visitas) {
              if (props.visitas) {
                handleSetFilterModule(global.modulo.visitas);
              } else {
                if (window.rs_sistema_id != 238) { // SE O SISTEMA ID FOR DIFERENTE DO "CHAMADOS EMPRESA REACT" TROCA
                  handleSetFilterModule((response.data[0] ? response.data[0].value : 0)); // SELECIONA O PRIMEIRO (CASO TENHA) COMO PADRÃO AO CARREGAR A PÁGINA
                } else { // SE O SISTEMA ID FOR DO "CHAMADOS EMPRESA REACT" CRAVA O ID DO MÓDULO
                  handleSetFilterModule(2361);
                }
              }
            }
          } else {
            if (props.chamados || props.fases || props.visitas) {
              if (window.rs_sistema_id != 238) {
                setPageError(true);
              } else {
                if (props.chamados) {
                  handleSetFilterModule(2361);
                } else {
                  setPageError(true);
                }
              }
            }
          }
        });
    }

    // FILTRO DE MÊS
    const handleFilterMonth = (e) => {
        setFilterMonth(e);
        setDataInicial(new Date(filterYear, (e - 1), 1));
        setDataFinal(new Date());
    }

    // FILTRO DE ANO
    const handleFilterYear = (e) => {
        setFilterYear(e);
        setDataInicial(new Date(e, (filterMonth - 1), 1));
        setDataFinal(new Date(e, (filterMonth - 1), get_date('last_day', (e + '-' + (filterMonth - 1) + '-01'), 'date_sql')));
    }

    // GET ÚLTIMOS 6 MESES
    function get_months(system){
        setLoadingMonth(true);

        let do_aux;

        if(system === 'jobs'){
            do_aux = 'getJob';
        }else if(system === 'chamados'){
            do_aux = 'getCalled';
        }else if(system === 'comunicados'){
            do_aux = 'getCommunication';
        }else if(system === 'checklist'){
            do_aux = 'getChecklist';
        }

        axios({
            url: window.host_madnezz + '/systems/integration-react/api/request.php?type=Dashboard',
            params: {
                do: do_aux,
                filter_type: 'year_month',
                filter_date_start: (dataInicial ? get_date('date_sql', cd(dataInicial), 'date_sub_month', 5) : ''),
                filter_date_end: (dataFinal ? get_date('date_sql',cd(dataFinal)) : ''),
                filter_id_enterprise: filterEmpreendimento,
                filter_id_supervisor: supervisor,
                filter_id_store: loja,
                filter_id_user: usuario,
            }
        }).then((response) => {
            if(response?.data?.data[0]){
                if(system === 'jobs'){
                    setMonthJobs(response.data.data);
                }             
            }
            setLoadingMonth(false);
        });
    }

    // CHAMADAS INICIAIS
    useEffect(() => {
        get_months('jobs');
    },[filterEmpreendimento, loja, categoria, subcategoria, frequencia, status, supervisor, dataInicial, dataFinal]);

    useEffect(() => {
        if (props?.filters) {
            props.filters(
                <>
                    {(window.rs_id_grupo > 0 ?
                        <FilterCheckbox
                            api={{
                                url: window.host_madnezz+'/api/sql.php?do=select&component=grupo_empreendimento&token='+window.token
                            }}
                            placeholder="Empreendimento"
                            name="filter_id_emp"
                            value={filterEmpreendimento}
                            onChangeClose={(e) => (
                                handleSetFilterEmpreendimento(e)
                            )}
                        >
                            Empreendimentos
                        </FilterCheckbox>
                    :
                        ''
                    )}

                    <FilterCheckbox
                        id="filter_store"
                        name="filter_store"
                        api={{
                            url: window.host_madnezz + '/systems/integration-react/api/list.php?do=headerFilter',
                            params: {
                                filters: [{ filter: 'store' }],
                                empreendimento_id: filterEmpreendimento,
                                limit: 50,
                                np: true
                            },
                            key: 'store',
                            reload: filterEmpreendimento
                        }}
                        onChangeClose={handleSetLoja}
                        value={loja}
                    >
                        Lojas
                    </FilterCheckbox>

                    <FilterCheckbox
                        name="filter_category"
                        grupo={(window.rs_id_grupo > 0 ? true : false)}
                        api={window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_category&grupo_id=true&id_apl="+window.rs_id_apl+"&empreendimento_id=" + filterEmpreendimento + "&filter_id_module=" + filterModule}
                        onChangeClose={handleSetCategoria}
                        value={categoria}
                    >
                        Categorias
                    </FilterCheckbox>

                    <FilterCheckbox
                        name="filter_subcategory"
                        grupo={(window.rs_id_grupo > 0 ? true : false)}
                        api={{
                            url: window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_subcategory&id_apl="+window.rs_id_apl+"&empreendimento_id=" + filterEmpreendimento + "&grupo_id=true",
                            params: {
                                filter_category: categoria,
                                filter_id_module: filterModule
                            },
                            reload: categoria
                        }}
                        onChangeClose={handleSetSubcategoria}
                        value={subcategoria}
                    >
                        Subcategorias
                    </FilterCheckbox>

                    <FilterCheckbox
                        name="filter_frequency"
                        api={window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_frequency&empreendimento_id=" + filterEmpreendimento + "&filter_id_module=" + filterModule}
                        onChangeClose={handleSetFrequencia}
                        value={frequencia}
                    >
                        Frequência
                    </FilterCheckbox>

                    <FilterCheckbox
                        name="filter_status"
                        options={window.optionsStatus}
                        onChangeClose={handleSetStatus}
                        value={status}
                    >
                        Status
                    </FilterCheckbox>
            
                    <FilterCheckbox
                        name="filter_id_supervisor"
                        api={window.host_madnezz + "/api/sql.php?do=select&component=supervisor_2&grupo_id=true&empreendimento_id=" + filterEmpreendimento}
                        onChangeClose={handleSetSupervisor}
                        value={supervisor}
                    >
                        Regional
                    </FilterCheckbox>
                    
                    <SelectReact
                        options={optionsMonths}
                        placeholder="Mês"
                        name="filter_month"
                        defaultValue={''}
                        value={filterMonth}
                        onChange={(e) => (
                        handleFilterMonth(e.value)
                        )}
                    />

                    <SelectReact
                        placeholder="Ano"
                        options={optionsYear}
                        value={filterYear}
                        onChange={(e) => handleFilterYear(e.value)}
                    />
                </>
            )
        }

        if(props?.icons){
            props?.icons('');
        }
    },[filterEmpreendimento, loja, categoria, subcategoria, frequencia, status, supervisor, dataInicial, dataFinal]);

    return(
        <Container>
            <Row>
                {/* TOTAL */}
                <Col lg={3}>
                    <Chart
                        title="Total"
                        headers={['Qtd.', 'Total']}
                        body={{
                            type: 'custom',
                            content: [['Atrasados', 'qtd_atrasado'], ['Feitos', 'qtd_feito']]
                        }}
                        api={{
                            url: window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list',
                            params: {
                                filter_type: 6,
                                filter_enterprise: filterEmpreendimento,
                                filter_month: mes,
                                filter_year: ano,
                                filter_id_supervisor: supervisor,
                                filter_id_store: loja,
                                filter_id_user: usuario,
                                filter_id_module: filterModule,
                                filter_category: categoria,
                                filter_subcategory: subcategoria,
                                filter_status: status,
                                filter_frequency: frequencia,
                                filter_active_2: [0, 1],
                                id_apl: window.rs_id_apl
                            }
                        }}
                    />
                </Col>

                {/* SUPERVISORES */}
                <Col lg={3}>
                    <Chart
                        title="Supervisores"
                        headers={['Supervisores', 'Qtd. Atrasados']}
                        body={{
                            type: 'default',
                            content: ['supervisor_loja', 'qtd_atrasado']
                        }}
                        api={{
                            url: window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list',
                            params: {
                                filter_type: 6,
                                filter_subtype: 'supervisor',
                                filter_enterprise: filterEmpreendimento,
                                filter_month: mes,
                                filter_year: ano,
                                filter_id_supervisor: supervisor,
                                filter_id_store: loja,
                                filter_id_user: usuario,
                                filter_id_module: filterModule,
                                filter_category: categoria,
                                filter_subcategory: subcategoria,
                                filter_status: status,
                                filter_frequency: frequencia,
                                filter_active_2: [0, 1],
                                id_apl: window.rs_id_apl
                            }
                        }}
                    />
                </Col>

                {/* LOJAS */}
                <Col lg={3}>
                    <Chart
                        title="Lojas"                
                        headers={['Lojas', 'Qtd. Atrasados']}
                        body={{
                            content: ['loja', 'qtd_atrasado']
                        }}
                        api={{
                            url: window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list',
                            params: {
                                filter_type: 6,
                                filter_subtype: 'store',
                                filter_enterprise: filterEmpreendimento,
                                filter_month: mes,
                                filter_year: ano,
                                filter_id_supervisor: supervisor,
                                filter_id_store: loja,
                                filter_id_user: usuario,
                                filter_id_module: filterModule,
                                filter_category: categoria,
                                filter_subcategory: subcategoria,
                                filter_status: status,
                                filter_frequency: frequencia,
                                filter_active_2: [0, 1],
                                id_apl: window.rs_id_apl
                            }
                        }}
                    />
                </Col>

                {/* CATEGORIAS */}
                <Col lg={3}>
                    <Chart
                        title="Categorias"
                        headers={['Categoria', 'Qtd. Atrasados']}
                        body={{
                            content: ['categoria', 'qtd_atrasado']
                        }}
                        api={{
                            url: window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list',
                            params: {
                                filter_type: 6,
                                filter_subtype: 'category',
                                filter_enterprise: filterEmpreendimento,
                                filter_month: mes,
                                filter_year: ano,
                                filter_id_supervisor: supervisor,
                                filter_id_store: loja,
                                filter_id_user: usuario,
                                filter_id_module: filterModule,
                                filter_category: categoria,
                                filter_subcategory: subcategoria,
                                filter_status: status,
                                filter_frequency: frequencia,
                                filter_active_2: [0, 1],
                                id_apl: window.rs_id_apl
                            }
                        }}
                    />
                </Col>

                {/* SUBCATEGORIAS */}
                <Col lg={3}>                    
                    <Chart
                        title="Subcategorias"
                        headers={['Subcategoria', 'Qtd. Atrasados']}
                        body={{
                            content: ['subcategoria', 'qtd_atrasado']
                        }}
                        api={{
                            url: window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list',
                            params: {
                                filter_type: 6,
                                filter_subtype: 'subcategory',
                                filter_enterprise: filterEmpreendimento,
                                filter_month: mes,
                                filter_year: ano,
                                filter_id_supervisor: supervisor,
                                filter_id_store: loja,
                                filter_id_user: usuario,
                                filter_id_module: filterModule,
                                filter_category: categoria,
                                filter_subcategory: subcategoria,
                                filter_status: status,
                                filter_frequency: frequencia,
                                filter_active_2: [0, 1],
                                id_apl: window.rs_id_apl
                            }
                        }}
                    />
                </Col>

                {/* ÚLTIMOS 6 MESES */}
                <Col lg={9}>                    
                    <Chart
                        id="seis"
                        title="Últimos 6 meses"
                        type="AreaChart"
                        headers={['Mês', 'Feitos no prazo', 'Atrasados', 'Feitos c/ atraso']}
                        body={{
                            type: "custom",
                            content: [
                                [get_date('month_name', get_date('date_sql', cd(dataInicial), 'date_sub_month', 0), 'date_sql'), (monthJobs[0]?.qtd_feito ? monthJobs[0]?.qtd_feito : 0), (monthJobs[0]?.qtd_atrasado ? monthJobs[0]?.qtd_atrasado : 0), (monthJobs[0]?.qtd_feito_com_atraso ? monthJobs[0]?.qtd_feito_com_atraso : 0)],
                                [get_date('month_name', get_date('date_sql', cd(dataInicial), 'date_sub_month', 1), 'date_sql'), (monthJobs[1]?.qtd_feito ? monthJobs[1]?.qtd_feito : 0), (monthJobs[1]?.qtd_atrasado ? monthJobs[1]?.qtd_atrasado : 0), (monthJobs[1]?.qtd_feito_com_atraso ? monthJobs[1]?.qtd_feito_com_atraso : 0)],
                                [get_date('month_name', get_date('date_sql', cd(dataInicial), 'date_sub_month', 2), 'date_sql'), (monthJobs[2]?.qtd_feito ? monthJobs[2]?.qtd_feito : 0), (monthJobs[2]?.qtd_atrasado ? monthJobs[2]?.qtd_atrasado : 0), (monthJobs[2]?.qtd_feito_com_atraso ? monthJobs[2]?.qtd_feito_com_atraso : 0)],
                                [get_date('month_name', get_date('date_sql', cd(dataInicial), 'date_sub_month', 3), 'date_sql'), (monthJobs[3]?.qtd_feito ? monthJobs[3]?.qtd_feito : 0), (monthJobs[3]?.qtd_atrasado ? monthJobs[3]?.qtd_atrasado : 0), (monthJobs[3]?.qtd_feito_com_atraso ? monthJobs[3]?.qtd_feito_com_atraso : 0)],
                                [get_date('month_name', get_date('date_sql', cd(dataInicial), 'date_sub_month', 4), 'date_sql'), (monthJobs[4]?.qtd_feito ? monthJobs[4]?.qtd_feito : 0), (monthJobs[4]?.qtd_atrasado ? monthJobs[4]?.qtd_atrasado : 0), (monthJobs[4]?.qtd_feito_com_atraso ? monthJobs[4]?.qtd_feito_com_atraso : 0)],
                                [get_date('month_name', get_date('date_sql', cd(dataInicial), 'date_sub_month', 5), 'date_sql'), (monthJobs[5]?.qtd_feito ? monthJobs[5]?.qtd_feito : 0), (monthJobs[5]?.qtd_atrasado ? monthJobs[5]?.qtd_atrasado : 0), (monthJobs[5]?.qtd_feito_com_atraso ? monthJobs[5]?.qtd_feito_com_atraso : 0)]
                            ]
                        }}
                        loading={loadingMonth}
                    />
                </Col>
            </Row>
        </Container>
    )
}
