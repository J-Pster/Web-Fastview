import { useState, useEffect, useContext, cloneElement } from "react";
import { cd, get_date } from '../../../_assets/js/global.js';

import Col from "../../../components/body/col";
import Dashboard from "../../../components/body/dashboard";
import Icon from "../../../components/body/icon";
import Row from "../../../components/body/row";
import SelectReact from "../../../components/body/select";
import Td from "../../../components/body/table/tbody/td";
import Th from "../../../components/body/table/thead/th";
import Tr from "../../../components/body/table/tr";
import CalendarTitle from "../../../components/body/calendarTitle";
import CalendarFilter from "../../../components/body/calendarTitle/calendarFilter";
import Input from "../../../components/body/form/input";
import { ChecklistContext } from "../../../context/Checklist.jsx";
import FilterCheckbox from "../../../components/body/filterCheckbox/index.jsx";
import { GlobalContext } from "../../../context/Global.jsx";
import Container from "../../../components/body/container";
import AtingimentoRedes from "./AtingimentoRedes/index.jsx";
import AtingimentoRegionais from "./AtingimentoRegionais/index.jsx";
import Categorias from "./Categoria/index.jsx";
import Subcategorias from "./Subcategoria/index.jsx";

export default function DashboardChecklist({ icons, filters }) {
    // CONTEXT
    const {
        handleSetFilterEmpreendimento,
        filterEmpreendimento,
        filterModule,
        handleSetFilterCategory,
        filterCategory,
        handleSetFilterSubCategory,
        filterSubCategory,
    } = useContext(ChecklistContext);

    // CONTEXT
    const { handleSetFilter, handleSetFilterDateMonth } = useContext(GlobalContext);

    // NECESSÁRIO PARA FUNCIONAR O CARREGAMENTO DA LISTA AO ENTRAR NA TELA (PRECISA AJUSTAR)
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    // ESTADOS FILTROS
    const [filterDashboard, setFilterDashboard] = useState('');
    const [filterPeriodo, setFilterPeriodo] = useState(1);
    const [monthSelected, setMonthSelected] = useState(window.currentMonth);
    const [yearSelected, setYearSelected] = useState(window.currentYear);
    //const [filterMonth, setFilterMonth] = useState(window.currentMonth + '/' + window.currentYear);
    const [filterMonth, setFilterMonth] = useState(new Date(window.currentYear, window.currentMonth - 1, '01'));
    const [filterDataInicio, setFilterDataInicio] = useState(new Date(window.currentYear, window.currentMonth - 1, '01'));
    const [filterDataFim, setFilterDataFim] = useState(new Date(window.currentYear, window.currentMonth - 1, get_date('last_date', new Date(window.currentYear, window.currentMonth - 1, window.currentDay)).slice(0, 2)));
    //
    const [categoriaActive, setCategoriaActive] = useState('');
    const [subcategoriaActive, setSubcategoriaActive] = useState('');

    //ALTERAR OS PERÍODOS PARA MÊS ANTERIOR, E ANTERIOR AO ANTERIOR 
    function formatDate(date) {
        const [day, month, year] = date.split('/');
        return `${day}/${month.padStart(2, '0')}/${year}`;
    }
    // corrigir se pesquisar no último dia do mês
    function getLastDayOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    // mês anterior
    function getLastDayOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function getPreviousMonth(date) {
        const [day, month, year] = date.split('/');
        const previousMonth = month === '01' ? '12' : (parseInt(month) - 1).toString().padStart(2, '0');
        const previousYear = month === '01' ? (parseInt(year) - 1).toString() : year;
        const lastDayOfPreviousMonth = getLastDayOfMonth(previousYear, parseInt(previousMonth));
        const adjustedDay = Math.min(parseInt(day), lastDayOfPreviousMonth);
        return formatDate(`${adjustedDay.toString().padStart(2, '0')}/${previousMonth}/${previousYear}`);
    }
    // mês anterior ao anterior
    function getMonthBeforePreviousMonth(date) {
        const oneMonthAgo = getPreviousMonth(date);
        return getPreviousMonth(oneMonthAgo);
    }
    const periodoAnteriorInicio = getPreviousMonth(cd(filterDataInicio));
    const periodoAnteriorFim = getPreviousMonth(cd(filterDataFim));
    const periodoAnteAnteriorInicio = getMonthBeforePreviousMonth(cd(filterDataInicio));
    const periodoAnteAnteriorFim = getMonthBeforePreviousMonth(cd(filterDataFim));

    //CALCULAR Mês atual / mês - 1 / mês -2 
    function calculateColumnDates(monthSelected, yearSelected, monthsToSubtract) {
        const currentDate = new Date(yearSelected, monthSelected - 1);
        currentDate.setMonth(currentDate.getMonth() - monthsToSubtract);

        const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const formattedYear = currentDate.getFullYear();

        return `${formattedMonth}/${formattedYear}`;
    };

    let month_aux_1 = calculateColumnDates(monthSelected, yearSelected, 0);
    let month_aux_2 = calculateColumnDates(monthSelected, yearSelected, 1);
    let month_aux_3 = calculateColumnDates(monthSelected, yearSelected, 2);

    // ESTADOS DASHBOARDS
    const [dashSupervisor1, setDashSupervisor1] = useState([]);
    const [dashSupervisor2, setDashSupervisor2] = useState([]);
    const [dashSupervisor3, setDashSupervisor3] = useState([]);
    const [supervisorActive, setSupervisorActive] = useState('');

    const [dashLoja1, setDashLoja1] = useState([]);
    const [dashLoja2, setDashLoja2] = useState([]);
    const [dashLoja3, setDashLoja3] = useState([]);
    const [lojaActive, setLojaActive] = useState('');

    const [dashChecklist1, setDashChecklist1] = useState([]);
    const [dashChecklist2, setDashChecklist2] = useState([]);
    const [dashChecklist3, setDashChecklist3] = useState([])
    const [checklistActive, setChecklistActive] = useState('');

    const [dashSecao1, setDashSecao1] = useState([]);
    const [dashSecao2, setDashSecao2] = useState([]);
    const [dashSecao3, setDashSecao3] = useState([]);
    const [secaoActive, setSecaoActive] = useState('');

    const [dashPergunta1, setDashPergunta1] = useState([]);
    const [dashPergunta2, setDashPergunta2] = useState([]);
    const [dashPergunta3, setDashPergunta3] = useState([]);
    const [perguntaActive, setPerguntaActive] = useState('');

    const [dashFuncionario1, setDashFuncionario1] = useState([]);
    const [dashFuncionario2, setDashFuncionario2] = useState([]);
    const [dashFuncionario3, setDashFuncionario3] = useState([]);
    const [funcionarioActive, setFuncionarioActive] = useState('');

    // FILTRA EMPREENDIMENTO
    const handleFilterEmp = (e) => {
        handleSetFilterEmpreendimento(e);
    }

    // FILTRA CATEGORIA
    const handleFilterCategory = (e) => {
        handleSetFilterCategory(e);
    }

    // FILTRA SUBCATEGORIA
    const handleFilterSubcategory = (e) => {
        handleSetFilterSubCategory(e);
    }

    const handleCallback = (setState) => (res) => {
        setState(res)
    }

    // FILTRO DASHBOARD SELECIONAR PADRÃO || RANKING
    const optionsDashboard = [ // => Não tem value na API
        { value: 10, label: "Dashboard Padrão" },
        { value: '', label: "Dashboard Ranking" }
    ]
    //FILTRO PARA SELECIONAR ENTRE MÊS || PERÍODO
    const optionsPeriodo = [
        { value: 1, label: "Por mês" },
        { value: 2, label: "Por período" },
        { value: 3, label: "Períodos" } // -> teste ? ? ?
    ]
    //
    const handleMes = (e) => {
        setFilterMonth(e);
        let arr_aux = cd(e).split("/");
        setMonthSelected(arr_aux[1]);
        setYearSelected(arr_aux[2]);
    }

    const handlePeriodo = (e) => { // não muda pq o valor esta fixo -- ???? 
        if (e.value == 0) {
            setFilterMonth("0" + monthSelected + "/" + yearSelected)
        } if (e.value == 1) {
            setFilterDataInicio(filterDataInicio ? cd(filterDataInicio) : '')
            setFilterDataFim(filterDataFim ? cd(filterDataFim) : '')
        }
    }

    // GET RESULTADOS DA PRIMEIRA COLUNA DE SUPERVISOR
    const handleSetDashSupervisor1 = (e) => {
        if (e.length > 0) {
            setDashSupervisor1(e);
        } else {
            setDashSupervisor1(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA SEGUNDA COLUNA DE SUPERVISOR
    const handleSetDashSupervisor2 = (e) => {
        if (e.length > 0) {
            setDashSupervisor2(e);
        } else {
            setDashSupervisor2(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA TERCEIRA COLUNA DE SUPERVISOR
    const handleSetDashSupervisor3 = (e) => {
        if (e.length > 0) {
            setDashSupervisor3(e);
        } else {
            setDashSupervisor3(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA PRIMEIRA COLUNA DE LOJAS
    const handleSetDashLoja1 = (e) => {
        if (e.length > 0) {
            setDashLoja1(e);
        } else {
            setDashLoja1(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA SEGUNDA COLUNA DE LOJAS
    const handleSetDashLoja2 = (e) => {
        if (e.length > 0) {
            setDashLoja2(e);
        } else {
            setDashLoja2(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA TERCEIRA COLUNA DE LOJAS
    const handleSetDashLoja3 = (e) => {
        if (e.length > 0) {
            setDashLoja3(e);
        } else {
            setDashLoja3(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA PRIMEIRA COLUNA CHECKLIST
    const handleSetDashChecklist1 = (e) => {
        if (e.length > 0) {
            setDashChecklist1(e);
        } else {
            setDashChecklist1(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA SEGUNDA COLUNA CHECKLIST
    const handleSetDashChecklist2 = (e) => {
        if (e.length > 0) {
            setDashChecklist2(e);
        } else {
            setDashChecklist2(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA TERCEIRA COLUNA CHECKLIST
    const handleSetDashChecklist3 = (e) => {
        if (e.length > 0) {
            setDashChecklist3(e);
        } else {
            setDashChecklist3(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA PRIMEIRA COLUNA SEÇÃO
    const handleSetDashSecao1 = (e) => {
        if (e.length > 0) {
            setDashSecao1(e);
        } else {
            setDashSecao1(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA SEGUNDA COLUNA SEÇÃO
    const handleSetDashSecao2 = (e) => {
        if (e.length > 0) {
            setDashSecao2(e);
        } else {
            setDashSecao2(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA TERCEIRA COLUNA SEÇÃO
    const handleSetDashSecao3 = (e) => {
        if (e.length > 0) {
            setDashSecao3(e);
        } else {
            setDashSecao3(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA PRIMEIRA COLUNA PERGUNTA
    const handleSetDashPergunta1 = (e) => {
        if (e.length > 0) {
            setDashPergunta1(e);
        } else {
            setDashPergunta1(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA SEGUNDA COLUNA PERGUNTA
    const handleSetDashPergunta2 = (e) => {
        if (e.length > 0) {
            setDashPergunta2(e);
        } else {
            setDashPergunta2(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADOS DA TERCEIRA COLUNA PERGUNTA
    const handleSetDashPergunta3 = (e) => {
        if (e.length > 0) {
            setDashPergunta3(e);
        } else {
            setDashPergunta3(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADO DA PRIMEIRA COLUNA FUNCIONARIO
    const handleSetDashFuncionario1 = (e) => {
        if (e.length > 0) {
            setDashFuncionario1(e);
        } else {
            setDashFuncionario1(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADO DA SEGUNDA COLUNA FUNCIONARIO
    const handleSetDashFuncionario2 = (e) => {
        if (e.length > 0) {
            setDashFuncionario2(e);
        } else {
            setDashFuncionario2(
                <Tr empty={true}></Tr>
            )
        }
    }
    // GET RESULTADO DA TERCEIRA COLUNA FUNCIONARIO
    const handleSetDashFuncionario3 = (e) => {
        if (e.length > 0) {
            setDashFuncionario3(e);
        } else {
            setDashFuncionario3(
                <Tr empty={true}></Tr>
            )
        }
    }

    // MANDA ÍCONES E FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons(<Icon type="print" />);
        }

        if (filters) {
            filters(
                <>
                    {(window.rs_id_grupo ?
                        <FilterCheckbox
                            name="filter_grupo"
                            api={window.host + "/api/sql.php?do=select&component=grupo_empreendimento&np=true&filial=true&limit=false"}
                            onChangeClose={(e) => handleFilterEmp(e)}
                            value={filterEmpreendimento}
                        >
                            Filtrar empreendimento
                        </FilterCheckbox>
                        : '')}
                    <SelectReact
                        options={optionsPeriodo}
                        placeholder="Por mês"
                        name="filtro-periodo"
                        value={filterPeriodo}
                        onChange={(e) => setFilterPeriodo(e.value)}
                    />

                    {(filterPeriodo == 1 ?
                        <Input
                            type="date"
                            format="mm/yyyy"
                            name="filter_date"
                            required={false}
                            value={filterMonth}
                            onChange={(e) => handleMes(e)}
                        />
                        : '')}

                    {(filterPeriodo == 2 ?
                        <Input
                            type="period"
                            name="filter_period"
                            required={false}
                            valueStart={filterDataInicio}
                            valueEnd={filterDataFim}
                            onChangeStart={(e) => setFilterDataInicio(e)}
                            onChangeEnd={(e) => setFilterDataFim(e)}
                        />
                        : '')}
                </>
            )
        }
    }, [filterPeriodo, filterMonth, filterDataInicio, filterDataFim]);
    // handleSetFilterEmpreendimento
    //console.log(categoriaActive)

    //CALCULAR PORCENTAGEM
    function porcentagem(num, total) {
        let result = (num / total) * 100;
        //return `${Math.floor(result)}%`
        return `${result.toFixed(2)}%`
    }

    return (
        <Container>
            <Row wrap={(window.isMobile ? true : false)}>
                {(global?.client === 'fastview' &&
                    <AtingimentoRedes
                        filters={{
                            monthSelected: monthSelected,
                            yearSelected: yearSelected,
                            categoriaActive: categoriaActive,
                            subcategoriaActive: subcategoriaActive
                            //usuarioActive: usuarioActive,
                        }}
                        callback={handleCallback}
                    />
                )}

                {(global?.client === 'fastview' &&
                    <AtingimentoRegionais
                        filters={{
                            monthSelected: monthSelected,
                            yearSelected: yearSelected,
                            categoriaActive: categoriaActive,
                            subcategoriaActive: subcategoriaActive
                            // usuarioActive: usuarioActive,
                        }}
                        callback={handleCallback}
                    />
                )}

                <Categorias
                    filters={{
                        monthSelected: monthSelected,
                        yearSelected: yearSelected,
                        categoriaActive: categoriaActive
                    }}
                    callback={handleCallback(setCategoriaActive)}
                />

                <Subcategorias
                    filters={{
                        monthSelected: monthSelected,
                        yearSelected: yearSelected,
                        categoriaActive: categoriaActive,
                        subcategoriaActive: subcategoriaActive
                        // usuarioActive: usuarioActive,
                        // categoriaActive: categoriaActive
                    }}
                    callback={handleCallback(setSubcategoriaActive)}
                />

                <Col>
                    <Dashboard
                        id="supervisor"
                        thead={
                            <Tr>
                                <Th>Supervisor</Th>
                                <Th>Part.</Th>
                                <Th align="center"><Icon type="check" className="text-success" /></Th>
                                <Th align="center"><Icon type="times" className="text-danger" /></Th>
                                <Th align="center"><Icon type="ban" className="text-warning" /></Th>
                                <Th align="center">Pontos</Th>
                            </Tr>
                        }
                        cols={{
                            col_1: {
                                title: "Supervisor - " + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? cd(filterDataInicio) + " a " + cd(filterDataFim) : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 0))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_supervisores',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? cd(filterDataInicio) : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? cd(filterDataFim) : ''),
                                        filtro_mes: (filterPeriodo == 1 ? month_aux_1 : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + filterDataInicio + filterDataFim + filterMonth + monthSelected + yearSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + filterDataInicio + filterDataFim + filterMonth + monthSelected + yearSelected),
                                    }
                                },
                                tbody: (
                                    dashSupervisor1.length > 0 ?
                                        dashSupervisor1?.map((item) => {
                                            return (
                                                <Tr
                                                    key={item.supervisor_id}
                                                    active={(supervisorActive == item.supervisor_id ? true : false)}
                                                    onClick={() => (
                                                        setSupervisorActive(supervisorActive == item.supervisor_id ? '' : item.supervisor_id),
                                                        setLojaActive(''),
                                                        setChecklistActive(''),
                                                        setSecaoActive(''),
                                                        setPerguntaActive(''),
                                                        setFuncionarioActive('')
                                                    )}
                                                    cursor="pointer"
                                                >
                                                    <Td>{item.supervisor_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.pontos}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashSupervisor1
                            },
                            col_2: {
                                title: "Supervisor - " + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteriorInicio + " a " + periodoAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 1))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_supervisores',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_2) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive+ subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        //reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                    },
                                },
                                tbody: (
                                    dashSupervisor2.length > 0 ?
                                        dashSupervisor2?.map((item) => {
                                            return (
                                                <Tr key={item.supervisor_id}>
                                                    <Td>{item.supervisor_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.pontos}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashSupervisor2
                            },
                            col_3: {
                                title: "Supervisor - " + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteAnteriorInicio + " a " + periodoAnteAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 2))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_supervisores',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_3) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                    }
                                },
                                tbody: (
                                    dashSupervisor3.length > 0 ?
                                        dashSupervisor3?.map((item) => {
                                            return (
                                                <Tr key={item.supervisor_id}>
                                                    <Td>{item.supervisor_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.pontos}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashSupervisor3
                            }
                        }}
                    ></Dashboard>
                </Col>

                <Col>
                    <Dashboard
                        id="loja"
                        thead={
                            <Tr>
                                <Th>Loja</Th>
                                <Th>Part.</Th>
                                <Th align="center"><Icon type="check" className="text-success" /></Th>
                                <Th align="center"><Icon type="times" className="text-danger" /></Th>
                                <Th align="center"><Icon type="ban" className="text-warning" /></Th>
                                <Th>Pontos</Th>
                            </Tr>
                        }
                        cols={{
                            col_1: {
                                title: 'Loja - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? cd(filterDataInicio) + " a " + cd(filterDataFim) : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 0))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_lojas',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? cd(filterDataInicio) : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? cd(filterDataFim) : ''),
                                        filtro_mes: (filterPeriodo == 1 ? month_aux_1 : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashLoja1.length > 0 ?
                                        dashLoja1?.map((item) => {
                                            return (
                                                <Tr
                                                    key={item.loja_id}
                                                    active={(lojaActive == item.loja_id ? true : false)}
                                                    onClick={() => (
                                                        setLojaActive(lojaActive == item.loja_id ? '' : item.loja_id),
                                                        setChecklistActive(''),
                                                        setSecaoActive(''),
                                                        setPerguntaActive(''),
                                                        setFuncionarioActive('')
                                                    )}
                                                    cursor="pointer"
                                                >
                                                    <Td>{item.loja_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_sim), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_nao), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_nao_aplica), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{item.pontos}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashLoja1
                            },
                            col_2: {
                                title: 'Loja - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteriorInicio + " a " + periodoAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 1))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_lojas',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_2) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashLoja2.length > 0 ?
                                        dashLoja2?.map((item) => {
                                            return (
                                                <Tr key={item.loja_id} >
                                                    <Td>{item.loja_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_sim), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_nao), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_nao_aplica), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{item.pontos}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashLoja2
                            },
                            col_3: {
                                title: 'Loja - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteAnteriorInicio + " a " + periodoAnteAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 2))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_lojas',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_3) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashLoja3.length > 0 ?
                                        dashLoja3?.map((item) => {
                                            return (
                                                <Tr key={item.loja_id} >
                                                    <Td>{item.loja_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_sim), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_nao), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{porcentagem(Number(item.qtd_nao_aplica), Number(item.qtd_sim) + Number(item.qtd_nao) + Number(item.qtd_nao_aplica))}</Td>
                                                    <Td align="center">{item.pontos}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashLoja3
                            }
                        }}
                    >
                    </Dashboard>
                </Col>

                <Col>
                    <Dashboard
                        id="checklist"
                        thead={
                            <Tr>
                                <Th>Checklist</Th>
                                <Th align="center">Part.</Th>
                                <Th align="center"><Icon type="check" className="text-success" /></Th>
                                <Th align="center"><Icon type="times" className="text-danger" /></Th>
                                <Th align="center"><Icon type="ban" className="text-warning" /></Th>
                                <Th align="center">Lojas</Th>
                            </Tr>
                        }
                        cols={{
                            col_1: {
                                title: 'Checklist - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? cd(filterDataInicio) + " a " + cd(filterDataFim) : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 0))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_checklists',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? cd(filterDataInicio) : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? cd(filterDataFim) : ''),
                                        filtro_mes: (filterPeriodo == 1 ? month_aux_1 : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashChecklist1.length > 0 ?
                                        dashChecklist1?.map((item) => {
                                            return (
                                                <Tr
                                                    key={item.checklist_id}
                                                    active={(checklistActive == item.checklist_id ? true : false)}
                                                    onClick={() => (
                                                        setChecklistActive(checklistActive == item.checklist_id ? '' : item.checklist_id),
                                                        setSecaoActive(''),
                                                        setPerguntaActive(''),
                                                        setFuncionarioActive('')
                                                    )}
                                                    cursor="pointer"
                                                >
                                                    <Td>{item.checklist_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashChecklist1
                            },
                            col_2: {
                                title: 'Checklist - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteriorInicio + " a " + periodoAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 1))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_checklists',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_2) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashChecklist2.length > 0 ?
                                        dashChecklist2?.map((item) => {
                                            return (
                                                <Tr key={item.checklist_id}>
                                                    <Td>{item.checklist_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashChecklist2
                            },
                            col_3: {
                                title: 'Checklist - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteAnteriorInicio + " a " + periodoAnteAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 2))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_checklists',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_3) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashChecklist3.length > 0 ?
                                        dashChecklist3?.map((item) => {
                                            return (
                                                <Tr key={item.checklist_id}>
                                                    <Td>{item.checklist_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashChecklist3
                            }
                        }}
                    >
                    </Dashboard>
                </Col>

                <Col>
                    <Dashboard
                        id="secao"
                        thead={
                            <Tr>
                                <Th>Seção</Th>
                                <Th align="center">Part.</Th>
                                <Th align="center"><Icon type="check" className="text-success" /></Th>
                                <Th align="center"><Icon type="times" className="text-danger" /></Th>
                                <Th align="center"><Icon type="ban" className="text-warning" /></Th>
                                <Th align="center">Lojas</Th>
                            </Tr>
                        }
                        cols={{
                            col_1: {
                                title: 'Seção - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? cd(filterDataInicio) + " a " + cd(filterDataFim) : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 0))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_secoes',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? cd(filterDataInicio) : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? cd(filterDataFim) : ''),
                                        filtro_mes: (filterPeriodo == 1 ? month_aux_1 : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashSecao1.length > 0 ?
                                        dashSecao1?.map((item) => {
                                            return (
                                                <Tr
                                                    key={item.secao_id}
                                                    active={(secaoActive == item.secao_id ? true : false)}
                                                    onClick={() => (
                                                        setSecaoActive(secaoActive == item.secao_id ? '' : item.secao_id),
                                                        setPerguntaActive(''),
                                                        setFuncionarioActive('')
                                                    )}
                                                    cursor="pointer"
                                                >
                                                    <Td>{item.secao_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashSecao1
                            },
                            col_2: {
                                title: 'Seção - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteriorInicio + " a " + periodoAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 1))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_secoes',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_2) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashSecao2.length > 0 ?
                                        dashSecao2?.map((item) => {
                                            return (
                                                <Tr key={item.secao_id} >
                                                    <Td>{item.secao_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashSecao2
                            },
                            col_3: {
                                title: 'Seção - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteAnteriorInicio + " a " + periodoAnteAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 2))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_secoes',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_3) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashSecao3.length > 0 ?
                                        dashSecao3?.map((item) => {
                                            return (
                                                <Tr key={item.secao_id} >
                                                    <Td>{item.secao_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })

                                        : <></>
                                ),
                                callback: handleSetDashSecao3
                            }
                        }}
                    ></Dashboard>
                </Col>

                <Col>
                    <Dashboard
                        id="pergunta"
                        thead={
                            <Tr>
                                <Th>Pergunta</Th>
                                <Th align="center">Part.</Th>
                                <Th align="center"><Icon type="check" className="text-success" /></Th>
                                <Th align="center"><Icon type="times" className="text-danger" /></Th>
                                <Th align="center"><Icon type="ban" className="text-warning" /></Th>
                                <Th align="center">Lojas</Th>
                            </Tr>
                        }
                        cols={{
                            col_1: {
                                title: 'Pergunta - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? cd(filterDataInicio) + " a " + cd(filterDataFim) : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 0))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_perguntas',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? cd(filterDataInicio) : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? cd(filterDataFim) : ''),
                                        filtro_mes: (filterPeriodo == 1 ? month_aux_1 : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashPergunta1.length > 0 ?
                                        dashPergunta1?.map((item) => {
                                            return (
                                                <Tr
                                                    key={item.pergunta_id}
                                                    active={perguntaActive == item.pergunta_id ? true : false}
                                                    onClick={() => (
                                                        setPerguntaActive(perguntaActive == item.pergunta_id ? '' : item.pergunta_id),
                                                        setFuncionarioActive('')
                                                    )}
                                                    cursor="pointer"
                                                >
                                                    <Td>{item.pergunta_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashPergunta1
                            },
                            col_2: {
                                title: 'Pergunta - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteriorInicio + " a " + periodoAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 1))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_perguntas',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_2) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashPergunta2.length > 0 ?
                                        dashPergunta2?.map((item) => {
                                            return (
                                                <Tr key={item.pergunta_id}>
                                                    <Td>{item.pergunta_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashPergunta2
                            },
                            col_3: {
                                title: 'Pergunta - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteAnteriorInicio + " a " + periodoAnteAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 2))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_perguntas',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_3) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashPergunta3.length > 0 ?
                                        dashPergunta3?.map((item) => {
                                            return (
                                                <Tr key={item.pergunta_id}>
                                                    <Td>{item.pergunta_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashPergunta3
                            }
                        }}
                    ></Dashboard>
                </Col>

                <Col>
                    <Dashboard
                        id="funcionarios"
                        thead={
                            <Tr>
                                <Th>Funcionários</Th>
                                <Th align="center">Part.</Th>
                                <Th align="center"><Icon type="check" className="text-success" /></Th>
                                <Th align="center"><Icon type="times" className="text-danger" /></Th>
                                <Th align="center"><Icon type="ban" className="text-warning" /></Th>
                                <Th align="center">Lojas</Th>
                            </Tr>
                        }
                        cols={{
                            col_1: {
                                title: 'Funcionario - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? cd(filterDataInicio) + " a " + cd(filterDataFim) : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 0))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_funcionarios',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? cd(filterDataInicio) : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? cd(filterDataFim) : ''),
                                        filtro_mes: (filterPeriodo == 1 ? month_aux_1 : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + perguntaActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + perguntaActive + monthSelected + yearSelected + filterDataInicio + filterDataFim),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashFuncionario1.length > 0 ?
                                        dashFuncionario1?.map((item) => {
                                            return (
                                                <Tr
                                                    key={item.funcionario_id}
                                                    active={(funcionarioActive == item.funcionario_id ? true : false)}
                                                    onClick={() => setFuncionarioActive(funcionarioActive == item.funcionario_id ? '' : item.funcionario_id)}
                                                    cursor="pointer"
                                                >
                                                    <Td>{item.funcionario_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashFuncionario1
                            },
                            col_2: {
                                title: 'Funcionario - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteriorInicio + " a " + periodoAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 1))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_funcionarios',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_2) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + perguntaActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + perguntaActive + periodoAnteriorInicio + periodoAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashFuncionario2.length > 0 ?
                                        dashFuncionario2?.map((item) => {
                                            return (
                                                <Tr key={item.funcionario_id}>
                                                    <Td>{item.funcionario_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashFuncionario2
                            },
                            col_3: {
                                title: 'Funcionario - ' + (filterPeriodo == 3 ? "teste" : filterPeriodo == 2 ? periodoAnteAnteriorInicio + " a " + periodoAnteAnteriorFim : get_date('month_name', get_date('date', '01/' + monthSelected + '/' + yearSelected, 'date_sub_month', 2))),
                                api: {
                                    url: window.host + '/systems/checklist/api/dashboard.php?do=get_funcionarios',
                                    params: {
                                        filter_id_emp_group: filterEmpreendimento,
                                        filtro_periodo: filterPeriodo,
                                        filtro_data_inicio: (filterPeriodo == 2 ? periodoAnteAnteriorInicio : ''),
                                        filtro_data_fim: (filterPeriodo == 2 ? periodoAnteAnteriorFim : ''),
                                        filtro_mes: (filterPeriodo == 1 ? (month_aux_3) : ''),
                                        filtro_supervisor: supervisorActive,
                                        filtro_loja: lojaActive,
                                        filtro_checklist: checklistActive,
                                        filtro_secao: secaoActive,
                                        filtro_pergunta: perguntaActive,
                                        filtro_funcionario: funcionarioActive,
                                        id_categoria: categoriaActive,
                                        id_subcategoria: subcategoriaActive,
                                        reload: (categoriaActive + subcategoriaActive + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + perguntaActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        // id_categoria: filterCategory,
                                        // id_subcategoria: filterSubCategory,
                                        // reload: (filterCategory + filterSubCategory + filterEmpreendimento + filterDashboard + filterPeriodo + supervisorActive + lojaActive + checklistActive + secaoActive + perguntaActive + periodoAnteAnteriorInicio + periodoAnteAnteriorFim + monthSelected),
                                        limit: 25
                                    }
                                },
                                tbody: (
                                    dashFuncionario3.length > 0 ?
                                        dashFuncionario3?.map((item) => {
                                            return (
                                                <Tr key={item.funcionario_id}>
                                                    <Td>{item.funcionario_nome}</Td>
                                                    <Td align="center">{item.participacao}</Td>
                                                    <Td align="center">{item.qtd_sim}</Td>
                                                    <Td align="center">{item.qtd_nao}</Td>
                                                    <Td align="center">{item.qtd_nao_aplica}</Td>
                                                    <Td align="center">{item.lojas}</Td>
                                                </Tr>
                                            )
                                        })
                                        : <></>
                                ),
                                callback: handleSetDashFuncionario3
                            }
                        }}
                    ></Dashboard>
                </Col>
            </Row>
        </Container>
    )
}