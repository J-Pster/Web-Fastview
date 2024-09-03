import { useState, useEffect, useContext } from "react";

import Col from "../../../../components/body/col";
import Table from "../../../../components/body/table";
import Row from "../../../../components/body/row";
import Tbody from "../../../../components/body/table/tbody";
import ChartCustom from "../../../../components/body/chart";
import Tr from "../../../../components/body/table/tr";
import Td from "../../../../components/body/table/tbody/td";
import { GlobalContext } from "../../../../context/Global";
import SelectReact from "../../../../components/body/select";
import { cd, get_date } from "../../../../_assets/js/global";
import axios from "axios";
import Tfoot from "../../../../components/body/table/tfoot";
import Icon from "../../../../components/body/icon";
import Item from "./Item";
import FilterCheckbox from '../../../../components/body/filterCheckbox';
import { JobsContext } from "../../../../context/Jobs";
import Container from "../../../../components/body/container";

export default function Lista2({icons, filters}) {
    // GLOBAL CONTEXT
    const { handleSetFilter, loadingCalendar, handleSetFixFilterModule, handleSetFirstLoad, filterModule } = useContext(GlobalContext);

    // JOBS CONTEXT
    const { optionsEmpreendimentos, filterEmpreendimento } = useContext(JobsContext);

    // ESTADOS
    const [items, setItems] = useState([]);
    const [itemsChart, setItemsChart] = useState([]);
    const [loadingChart, setLoadingChart] = useState(true);
    const [total, setTotal] = useState([]);
    const [fontSize, setFontSize] = useState(15);
    const [active, setActive] = useState('');

    // ESTADOS FILTROS        
    const [filterMonth, setFilterMonth] = useState(window.currentMonth);
    const [filterYear, setFilterYear] = useState(window.currentYear);
    const [periodStart, setPeriodStart] = useState(new Date(window.currentYear, (window.currentMonth-1), 1));
    const [periodEnd, setPeriodEnd] = useState(new Date(window.currentYear, (window.currentMonth - 1), get_date('last_day', (window.currentYear + '-' + window.currentMonth + '-01'), 'date_sql')));
    const [filterStore, setFilterStore] = useState([]);
    const [filterUser, setFilterUser] = useState([]);
    const [filterEmp, setFilterEmp] = useState([]);
    const [filterTipo, setFilterTipo] = useState(2);
    const [filterCategory, setFilterCategory] = useState([]);
    const [filterSubcategory, setFilterSubcategory] = useState([]);

    // OPTIONS
    const optionsTipo = [
        {value: 1, label: 'Por loja'},
        {value: 2, label: 'Por supervisor'}
    ]

    // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
    useEffect(() => {
        handleSetFilter(true);
        loadingCalendar(true);
        handleSetFixFilterModule(false);
        handleSetFirstLoad(true);
    }, []);

    // FILTRO DE LOJA
    const handleFilterStore = (e) => {
        setFilterStore(e);
    }

    // FILTRO DE SUPERVISOR
    const handleFilterUser = (e) => {
        setFilterUser(e);
    }

    // FILTRO DE EMPREENDIMENTO
    const handleFilterEmp = (e) => {
        setFilterEmp(e);
    }

    // LISTA ITENS
    const handleSetItems = (e) => {
        setItems(e);
    }

    const handleFilterTipo = (e) => {
        setItems([]);
        setFilterTipo(e);
        setActive('');
    }

    // FILTRO DE MÊS
    const handleFilterMonth = (e) => {
        setFilterMonth(e);
        setPeriodStart(new Date(filterYear, (e - 1), 1));
        setPeriodEnd(new Date(filterYear, (e - 1), get_date('last_day', (filterYear + '-' + e + '-01'), 'date_sql')));
        setActive('');
    }

    // FILTRO DE ANO
    const handleFilterYear = (e) => {
        setFilterYear(e);
        setPeriodStart(new Date(e, (filterMonth - 1), 1));
        setPeriodEnd(new Date(e, (filterMonth - 1), get_date('last_day', (e + '-' + (filterMonth - 1) + '-01'), 'date_sql')));
        setActive('');
    }

    // FILTRO DE CATEGORIA
    const handleFilterCategory = (e) => {
        setFilterCategory(e);
    }

    // FILTRO DE SUBCATEGORIA
    const handleFilterSubcategory = (e) => {
        setFilterSubcategory(e);
    }

    // GET INFO GRÁFICO
    useEffect(() => {
        handleSetFilter(true);
        
        setLoadingChart(true);
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Dashboard&do=getVisit&filter_type=year_month_day',
            params: {
                filter_date_start: get_date('date_sql', cd(periodStart), 'date'),
                filter_date_end: get_date('date_sql', cd(periodEnd), 'date'),
                filter_category: filterCategory,
                filter_subcategory: filterSubcategory
            }
        }).then((response) => {
            setLoadingChart(false);
            setItemsChart(response.data.data);
        });
    },[periodStart, periodEnd, filterCategory, filterSubcategory]);

    // LOOP DE DATAS
    function dateLoop(date_start, date_end, items) {
        const di_aux = date_start.split('/');
        const df_aux = date_end.split('/');
        const data_inicio = new Date(di_aux[2], (di_aux[1] - 1), di_aux[0]);
        const data_fim = new Date(df_aux[2], (df_aux[1] - 1), df_aux[0]);
    
        let res = [];
    
        for (let day = data_inicio; day <= data_fim; day.setDate(day.getDate() + 1)) {
            const day_num = day.getDate();
            const day_format = day.toLocaleDateString('pt-BR');
            let weekday_short = day.toLocaleDateString('pt-BR', { weekday: 'short' });
            weekday_short = weekday_short.charAt(0).toUpperCase() + weekday_short.slice(1);
            let weekday_long = day.toLocaleDateString('pt-BR', { weekday: 'long' });
            weekday_long = weekday_long.charAt(0).toUpperCase() + weekday_long.slice(1);
            let realizadas = items.filter((elem) => elem.dia == day_num)[0]?.qtd_finalizado;
            let planejadas = items.filter((elem) => elem.dia == day_num)[0]?.qtd_total;
    
            res.push([
                day_format.slice(0,5),
                (planejadas ? planejadas : 0),
                (realizadas ? realizadas : 0),            
                ((planejadas + realizadas) / 2)
            ]);
        }
    
        return res;
    }

    // GET TOTAL
    function get_total(){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Dashboard&do=getVisit&filter_type=total_store',
            params: {
                filter_id_store: filterStore,
                filter_id_emp: filterEmp,
                filter_id_user: filterUser,
                filter_category: filterCategory,
                filter_subcategory: filterSubcategory,
                filter_date_start: get_date('date_sql', cd(periodStart), 'date'),
                filter_date_end: get_date('date_sql', cd(periodEnd), 'date')
            }
        }).then((response) => {
            if(response?.data?.data[0]){
                setTotal(response?.data?.data[0]);
            }
        });
    }

    useEffect(() => {
        get_total();
    },[filterStore, filterEmp, filterUser, periodStart, periodEnd, filterCategory, filterSubcategory]);

    // CONSTRÓI AS TH'S
    const thead = [
        { enabled: (filterTipo === 1 ? true : false), label: 'Loja', id: 'loja', name: 'loja', api: {url: window.host_madnezz + "/api/sql.php?do=select&component=loja&filial=true&np=true", params: {limit: 50}}, onChange: handleFilterStore, export: (filterTipo === 1 ? true : false) },
        { enabled: true, label: 'Regional', id: 'usuario', name: 'usuario', api: {url: window.host_madnezz + "/api/sql.php?do=select&component=supervisor_2", params: {limit: 50}}, onChange: handleFilterUser },
        { enabled: true, label: 'Rede', id: 'empreendimento', name: 'empreendimento', api: {url: window.host_madnezz + "/api/sql.php?do=select&component=grupo_empreendimento", params: {limit: 50}}, onChange: handleFilterEmp },
        { enabled: true, label: 'Visitas Planejadas', name: 'qtd_total', align: 'center', filter: false },
        { enabled: true, label: 'Visitas Realizadas', name: 'qtd_finalizado', align: 'center', filter: false },
        { enabled: true, label: '% Atingidas', align: 'center', export: false, filter: false }, // PASSANDO EXPORT FALSE POIS PRECISA CALCULAR A PORCENTAGEM NA EXPORTAÇÃO
        { enabled: true, label: 'Checklist Planejados', name: 'qtd_checklist_total', align: 'center', filter: false },
        { enabled: true, label: 'Checklists Realizados', name: 'qtd_checklist_finalizado', align: 'center', filter: false },
        { enabled: true, label: '% Checklists Atingidos', align: 'center', export: false, filter: false }, // PASSANDO EXPORT FALSE POIS PRECISA CALCULAR A PORCENTAGEM NA EXPORTAÇÃO
        { enabled: true, label: 'Visitas Avulsas', name: 'qtd_avulsa', align: 'center', filter: false }
    ]

    // TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    });

    // URL API TABLE
    const url = window.host_madnezz+'/systems/integration-react/api/request.php?type=Dashboard&do=getVisit';
    
    // PARAMS API TABLE
    const params = {
        filter_id_store: filterStore,
        filter_id_emp: filterEmp,
        filter_id_user: filterUser,
        filter_date_start: get_date('date_sql', cd(periodStart), 'date'),
        filter_date_end: get_date('date_sql', cd(periodEnd), 'date'),
        filter_type: (filterTipo === 1 ? 'store' : 'user'),
        filter_category: filterCategory,
        filter_subcategory: filterSubcategory,
        limit: 50,
        id_apl: window.rs_id_apl
    };

    // BODY DO EXPORTADOR
    const body = {
        titles: thead_export,
        url: url,
        name: 'Visitas - '+window.optionsMonths.filter((elem) => elem.value == filterMonth)[0].label+'/'+filterYear,
        filters: params,
        key: 'data',
        orientation: 'L',
        custom: [
            {
                name: '% Atingidas',
                keys: ['qtd_finalizado', 'qtd_total'],
                type: '%'
            },{
                name: '% Checklists Atingidos',
                keys: ['qtd_checklist_finalizado', 'qtd_checklist_total'],
                type: '%'
            }
        ]
    }

    // MANDA FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons(
                <>
                    <Icon type="excel" api={{ body: body }} />
                    <Icon type="pdf" api={{ body: body }} />
                </>
            );
        }

        if(filters){
            filters(
                <>
                    <SelectReact
                        options={optionsTipo}
                        placeholder="Tipo"
                        name="tipo"
                        value={filterTipo}
                        onChange={(e) => handleFilterTipo(e.value)}
                    />

                    <SelectReact
                        options={window.optionsMonths}
                        placeholder="Mês"
                        name="filter_month"
                        value={filterMonth}
                        onChange={(e) => handleFilterMonth(e.value)}
                    />

                    <SelectReact
                        placeholder="Ano"
                        options={window.optionsYear}
                        value={filterYear}
                        onChange={(e) => handleFilterYear(e.value)}
                    />

                    <FilterCheckbox
                        name="filter_category"
                        grupo={(optionsEmpreendimentos.length > 1 ? true : false)}
                        api={window.host_madnezz+"/systems/integration-react/api/registry.php?do=get_category&id_apl="+window.rs_id_apl+"&grupo_id=true&empreendimento_id="+filterEmpreendimento+"&filter_id_module="+filterModule+"&token="+window.token}
                        onChangeClose={handleFilterCategory}
                        value={filterCategory}
                    >
                        Categorias
                    </FilterCheckbox>

                    <FilterCheckbox
                        name="filter_subcategory"
                        grupo={(optionsEmpreendimentos.length > 1 ? true : false)}
                        api={{
                            url: window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_subcategory&id_apl="+window.rs_id_apl+"&grupo_id=true&token=" + window.token,
                            params:{
                                empreendimento_id: filterEmpreendimento,
                                filter_id_category: filterCategory,
                                filter_id_module: filterModule
                            },
                        }}
                        onChangeClose={handleFilterSubcategory}
                        value={filterSubcategory}
                        reload={filterCategory}
                    >
                        Subcategorias
                    </FilterCheckbox>
                </>
            )
        }
    },[filterMonth, filterYear, filterTipo, items, filterCategory, filterSubcategory]);

    // FONT SIZE CHART
    useEffect(() => {
        if(window.innerWidth < 1700){
            setFontSize(14);
        }
        
        if(window.innerWidth < 1600){
            setFontSize(12);
        }

        if(window.innerWidth < 1450){
            setFontSize(10);
        }

        if(window.innerWidth > 1700){
            setFontSize(15);
        }
    },[window.innerWidth]);

    // SETA ITEM ATIVO
    const handleCallback = (e) => {
        setActive(e);
    }

    return (
        <Container>
            <Row>
                <Col lg={12}>
                    <ChartCustom
                        title="Visitas Por Mês"
                        type="ComboChart"
                        headers={["Mês", "Visitas Realizadas", "Visitas Planejadas", 'Visitas Atingidas', { role: "annotation" }]}
                        colors={['bdc3cb', '10459e', 'f2383a']}
                        height={300}
                        body={{
                            content: dateLoop(cd(periodStart), cd(periodEnd), itemsChart)
                        }}
                        series={{ 1: { type: "line", lineWidth: 2 }, 2: { type: "line", lineWidth: 0 } }}
                        hAxis={{fontSize: fontSize}}
                        vAxis={{fontSize: fontSize}}
                        loading={loadingChart}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <Table
                        id="visitas"
                        api={url}
                        params={params}
                        key_aux_2={'data'}
                        thead={thead}
                        onLoad={handleSetItems}
                        text_limit={50}
                        reload={filterTipo}
                    >
                        <Tbody>
                            {(items.length > 0 ?
                                items.map((item, i) => {
                                    return(
                                        <Item
                                            key={'visita_'+item?.id_loja+'_'+item?.id_usuario+'_'+i}
                                            tipo={filterTipo}
                                            item={item}
                                            filter_date_start={get_date('date_sql', cd(periodStart), 'date')}
                                            filter_date_end={get_date('date_sql', cd(periodEnd), 'date')}
                                            callback={handleCallback}
                                            active={active}
                                        />
                                    )
                                })
                            :
                                <></>
                            )}
                        </Tbody>

                        <Tfoot>
                            <Tr>
                                <Td>Total</Td>
                                
                                {(filterTipo === 1 ?
                                    <Td align="center"></Td>
                                :<></>)}

                                <Td align="center"></Td>
                                <Td align="center">{total?.qtd_total}</Td>
                                <Td align="center">{total?.qtd_finalizado}</Td>
                                <Td align="center">{(total?.qtd_finalizado && total?.qtd_total ? (((total?.qtd_finalizado / total?.qtd_total) * 100).toFixed(0)) : 0)}%</Td>
                                <Td align="center">{total?.qtd_checklist_total}</Td>
                                <Td align="center">{total?.qtd_checklist_finalizado}</Td>
                                <Td align="center">{(total?.qtd_checklist_finalizado && total?.qtd_checklist_total ? (((total?.qtd_checklist_finalizado / total?.qtd_checklist_total) * 100).toFixed(0)) : 0)}%</Td>
                                <Td align="center">{total?.qtd_avulsa}</Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}