import { useState, useEffect } from 'react';
import SelectReact from "../../../components/body/select";
import Table from '../../../components/body/table';
import Tr from '../../../components/body/table/tr';
import style from '../style.module.scss';
import Sidebar from '../Sidebar';
import Tbody from '../../../components/body/table/tbody';
import Td from '../../../components/body/table/tbody/td';
import ChartCustom from '../../../components/body/chart';
//import { items } from './data';
import Icon from '../../../components/body/icon';
import Input from '../../../components/body/form/input';
import axios from 'axios';
import toast from 'react-hot-toast';
import { cd } from '../../../_assets/js/global';
import "./style.css";

//
import useDashboardStore from './constants/dashboard.store';
import dayjs from 'dayjs';
import Empreendimento from './empreendimentos';
import FilterCheckbox from '../../../components/body/filterCheckbox';

export default function Lista({ filters, icons }) {
    // ESTADOS
    //ESTADO TABELA
    const [items, setItems] = useState([]);
    const [itemsThead, setItemsThead] = useState();
    //ESTADO GRÁFICO
    const [grafico, setGrafico] = useState();
    // ESTADOS DE FILTROS
    const [filtroSistema, setFiltroSistema] = useState(223);
    // const [filtroLoja, setFiltroLoja] = useState([]);
    const [filtroLoja, setFiltroLoja] = useState(null);
    // const [filtroDepartamento, setFiltroDepartamento] = useState([]);
    // const [filtroCategoria, setFiltroCategoria] = useState([]);
    // const [filtroSubcategoria, setFiltroSubcategoria] = useState([]);
    // const [filtroFrequencia, setFiltroFrequencia] = useState([]);
    // const [filtroStatus, setFiltroStatus] = useState([]);
    //const [filtroMes, setFiltroMes] = useState(new Date(window.currentMonth + '-01-' + window.currentYear)) // MêS ATUAL
    const [filtroData, setFiltroData] = useState(new Date()) // MêS ATUAL
    const [filtroMes, setFiltroMes] = useState(window.currentMonth) // MêS ATUAL
    const [filtroAno, setFiltroAno] = useState(window.currentYear)

    const [filtroRede, setFiltroRede] = useState(null);
    const [filtroRegional] = useState(null);
    const [, setOptionsSistema] = useState();

    const [showEmp, setShowEmp] = useState();

    //RECEBE O VALUE DA LOJA, SE JÁ ESTIVER NO ARRAY TIRA, SENÃO, FAZ PUSH
    const handleFilterLoja = (res) => {
        setFiltroLoja(res)
        if (filtroLoja === res) {
            setFiltroLoja(null)
        }
    }

    //RECEBE O VALUE DA LOJA, SE JÁ ESTIVER NO ARRAY TIRA, SENÃO, FAZ PUSH
    const handleFilterEmpreendimento = (res) => {
        setFiltroRede(res);
        if (filtroLoja) {
            setFiltroLoja(null)
        }
    }

    //FUNÇÕES FILTROS
    //FILTRO GERAL POR EVENT 
    const handleEvent = (setState) => (e) => {
        setState(e)
    };

    //FILTRO DE DATA
    const handleFilterDate = (e) => {
        let data = cd(e).split('/');
        setFiltroData(e)
        setFiltroMes(data[1])
        setFiltroAno(data[2])
    }

    // CONSTRÓI AS TH'S
    const thead = [
        // { enabled: true, export: true, label: 'Grupo', id: 'grupo', name: 'grupo', api: { url: window.backend + '/api/v1/utilities/filters/grupo-empreendimento', key_aux: ['data'] }, onChange: handleEvent(setFiltroRede), filter: false },
        { enabled: true, export: true, label: 'Empreendimento', filter: false, id: 'rede', name: 'rede', api: { url: window.backend + '/api/v1/utilities/filters/grupo-empreendimento', key_aux: ['data'] }, onChange: handleEvent(setFiltroRede)},
        // { enabled: true, export: true, label: 'Regional', id: 'regional', name: 'regional', api: window.host + '/api/sql.php?do=select&component=usuario', onChange: handleEvent(setFiltroRegional) },
        // { enabled: true, export: true, label: 'Loja', id: 'loja', name: 'loja', api: { url: window.backend + '/api/v1/utilities/filters/lojas', params: { sistema_id: window.rs_sistema_id, filter_id_enterprise: [window.rs_id_emp] }, key_aux: ['data'] }, onChange: handleEvent(setFiltroLoja), filter: true },
        ...(itemsThead ? itemsThead : []).map(item => ({
            enabled: true,
            export: true,
            label: item.nome,
            id: item.index,
            name: item.index,
            filter: false
        }))
    ]

    // TITLES EXPORT
    let thead_export = {};
    thead.map((item) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    })

    // URL API TABLE
    const url = `${window.backend}/api/v1/adesao/relatorios/empreendimentos`;

    const params = {
        sistema_id: filtroSistema,
        lojas: filtroLoja,
        empreendimentos: filtroRede,
        regional: filtroRegional,
        month: Number(filtroMes),
        year: Number(filtroAno),
    }

    const body = {
        titles: thead_export,
        url: url,
        name: 'Adesão',
        filters: params,
        orientation: 'L',
        key: 'data'
    }

    // SETA OS ITENS DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    //GRAFICO
    function getChartContent() {
        axios.get(`${window.backend}/api/v1/adesao/relatorios/days`, {
            params: params
        }).then((response) => {
            setGrafico(response.data.data)
        }).catch((error) => {
            toast(error.message)
        })
    }

    //TABELA - THEAD
    function getTableContent() {
        axios.get(url, {
            params: params
        }).then((response) => {
            setItemsThead(response.data.meta.items)
        }).catch((error) => {
            toast(error.message)
        })
    }

    //GRÁFICO E THEAD
    useEffect(() => {
        getChartContent();
        getTableContent();
    }, [filtroLoja, filtroData, filtroRede, filtroRegional, filtroSistema]);

    //lista de sistemas
    useEffect(() => {
        axios.get('https://v3.madnezz.com.br/api/sql.php?do=select&component=sistema')
            .then((response) => {
                setOptionsSistema(response.data)
            }).catch((error) => {
                toast(error.message)
            })
    }, []);

    //CORRIGIR O FORMATO DA DATA
    function correctFormat(date) {
        let data = date?.split('-');
        return `${data[2]}/${data[1]}`
    }

    //SELECIONAR COR DE ACORDO COM O VALOR
    // -> pra  %Meta
    // function selectColor(value) {
    //     let color_aux;
    //     if (value < 50) {
    //         color_aux = 'text-danger';
    //     } else if (value >= 50) {
    //         color_aux = 'text-success';
    //     } else {
    //         color_aux = '';
    //     }
    //     return color_aux
    // }

    //CORRIGIR A DATA DO GRÁFICO
    // const acessos_sistemas = useDashboardStore((state) => state.acessos_sistemas);
    const ticks = useDashboardStore(state => state.ticks);
    // Função para preencher os dados com zeros para todos os dias do mês que não vem na api
    const preencherDadosComZeros = (dados, dataInicial) => {
        const diasNoMes = dayjs(dataInicial).daysInMonth();
        const dadosCompletos = [];
        const mapaDados = new Map(dados.map((item) => [item.data, item]));

        for (let i = 1; i <= diasNoMes; i++) {
            const dataAtual = dayjs(dataInicial).date(i).format('YYYY-MM-DD');
            const itemExistente = mapaDados.get(dataAtual);

            if (itemExistente) {
                dadosCompletos.push([
                    correctFormat(dataAtual),
                    Number(itemExistente.esperados),
                    Number(itemExistente.realizados)
                ]);
            } else {
                dadosCompletos.push([correctFormat(dataAtual), 0, 0]);
            }
        }

        return dadosCompletos;
    };

    // Obter os dados preenchidos com zeros para todos os dias do mês
    const dadosPreenchidos = preencherDadosComZeros(grafico ? grafico : [], filtroData);

    const [optionsLoja, setOptionsLoja] = useState();
    //OPÇÕES LOJA
    function getLojas() {
        axios.get(`${window.backend}/api/v1/utilities/filters/lojas`, {
            params: params
        }).then(({ data }) => {
            setOptionsLoja(data.data)
        }).catch((error) => {
            toast(error.message)
        })
    }
    const [optionsEmpreendimentos, setOptionsEmpreendimentos] = useState();
    //OPÇÕES LOJAS
    function getEmpreendimentos() {
        axios.get(`${window.backend}/api/v1/utilities/filters/empreendimentos`, {
            // params: { grupo_id : window. }
        }).then(({ data }) => {
            setOptionsEmpreendimentos(data.data)
        }).catch((error) => {
            toast(error.message)
        })
    }

    useEffect(() => {
        getLojas();
        getEmpreendimentos();
    }, [])

    // MANDA OS FILTROS E ÍCONES PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons(
                <>
                    <Icon type="excel" api={{ body: body }} />
                    <Icon type="pdf" api={{ body: body }} />
                </>
            );
        }

        if (filters) {
            filters(
                <>
                    {/* <FilterCheckbox
                        id="filter_sistema"
                        name="filter_sistema"
                        api={{
                            url: window.host + '/api/sql.php?do=select&component=sistema'
                        }}
                        onChangeClose={(e) => setFiltroSistema(e)}
                        value={filtroSistema}
                    >
                        Sistemas
                    </FilterCheckbox> */}
                    {/* <SelectReact
                        id="filter_sistema"
                        name="filter_sistema"
                        label="Sistemas"
                        value={filtroSistema}
                        onChange={(e) => setFiltroSistema(e.value)}
                        options={optionsSistema}
                        required={false}
                    /> */}
                    <SelectReact
                        id="filter_sistema"
                        name="filter_sistema"
                        label="Sistemas"
                        value={filtroSistema}
                        onChange={(e) => setFiltroSistema(e.value)}
                        options={[{ value: 223, label: "Jobs" }]}
                        required={false}
                        allowEmpty={false}
                    />
                    {/* 
                    
                    api: { url: window.backend + '/api/v1/utilities/filters/lojas', params: { sistema_id: window.rs_sistema_id, filter_id_enterprise: [window.rs_id_emp] }, key_aux: ['data'] }
                    
                    */}
                    {/* <FilterCheckbox
                        id="filter_sistema"
                        name="filter_sistema"
                        // api={{
                        //     url: window.host + '/api/sql.php?do=select&component=empreendimento'
                        // }}
                        onChangeClose={(e) => setFiltroLoja(e)}
                        value={filtroLoja}
                    >
                        Empreendimento
                    </FilterCheckbox> */}

                    {/* <FilterCheckbox
                        id="filter_sistema"
                        name="filter_sistema"
                        api={{
                            url: window.host + '/api/sql.php?do=select&component=lojas'
                        }}
                        onChangeClose={(e) => setFiltroLoja(e)}
                        value={filtroLoja}
                    >
                        Lojas
                    </FilterCheckbox> */}
                    <FilterCheckbox
                        id="filter_sistema"
                        name="filter_sistema"
                        api={{
                            url: window.backend + '/api/v1/utilities/filters/lojas',
                            params: {paginated: 0 },
                        }}
                        options={optionsLoja}
                        onChangeClose={(e) => setFiltroLoja(e)}
                        value={filtroLoja}
                    >
                        Lojas
                    </FilterCheckbox>

                    <FilterCheckbox
                        id="filter_sistema"
                        name="filter_sistema"
                        api={{
                            url: window.host + '/api/sql.php?do=select&component=usuario'
                        }}
                        onChangeClose={(e) => setFiltroLoja(e)}
                        value={filtroLoja}
                    >
                        Usuário
                    </FilterCheckbox>

                    {/* <FilterCheckbox
                        id="filter_departamento"
                        name="filter_departamento"
                        api={{
                            url: window.host + '/api/sql.php?do=select&component=departamento'
                        }}
                        onChangeClose={(e) => setFiltroDepartamento(e)}
                        value={filtroDepartamento}
                    >
                        Departamentos
                    </FilterCheckbox> */}

                    {/* <FilterCheckbox
                        id="filter_categoria"
                        name="filter_categoria"
                        options={[
                            { id: 1, nome: 'Categoria 1' },
                            { id: 2, nome: 'Categoria 2' },
                            { id: 3, nome: 'Categoria 3' }
                        ]}
                        onChangeClose={(e) => setFiltroCategoria(e)}
                        value={filtroCategoria}
                    >
                        Categorias
                    </FilterCheckbox> */}
                    {/*
                    <FilterCheckbox
                        id="filter_subcategoria"
                        name="filter_subcategoria"
                        options={[
                            { id: 1, nome: 'Subcategoria 1' },
                            { id: 2, nome: 'Subcategoria 2' },
                            { id: 3, nome: 'Subcategoria 3' }
                        ]}
                        onChangeClose={(e) => setFiltroSubcategoria(e)}
                        value={filtroSubcategoria}
                    >
                        Subcategorias
                    </FilterCheckbox> */}

                    {/* <FilterCheckbox
                        id="filter_frequencia"
                        name="filter_frequencia"
                        options={[
                            { id: 1, nome: 'Frequência 1' },
                            { id: 2, nome: 'Frequência 2' },
                            { id: 3, nome: 'Frequência 3' }
                        ]}
                        onChangeClose={(e) => setFiltroFrequencia(e)}
                        value={filtroFrequencia}
                    >
                        Frequência
                    </FilterCheckbox> */}

                    {/* <FilterCheckbox
                        id="filter_status"
                        name="filter_status"
                        options={[
                            { id: 1, nome: 'Status 1' },
                            { id: 2, nome: 'Status 2' },
                            { id: 3, nome: 'Status 3' }
                        ]}
                        onChangeClose={(e) => setFiltroStatus(e)}
                        value={filtroStatus}
                    >
                        Status
                    </FilterCheckbox> */}

                    <Input
                        type="date"
                        format={'mm/yyyy'}
                        name="filtro_mes"
                        required={false}
                        value={filtroData}
                        onChange={(e) => handleFilterDate(e)}
                    />
                </>
            );
        }
    }, [items, filtroData, filtroSistema]);

    // CALLBACK DO COMPONENTE DE EMPREENDIMENTO
    const handleCallbackEmpreendimento = (e) => {
        console.log('e: ',e);

        if(e?.empreendimento_id){
            // PEGA TOP DO ELEMENTO CLICADO
            let top = document.getElementById('emp_'+e.empreendimento_id).offsetTop - 57;

            setTimeout(() => { // TEMO MÍNIMO PARA RENDERIZAR OS ITENS NA TELA
                document.getElementById('table_relatorio-adesao').scrollTop = top;

                setTimeout(() => { // TEMPO ATÉ TERMINAR O SCROLL
                    document.getElementById('table_relatorio-adesao').style.overflow = 'hidden';
                },200);
            },100);            
        }else{
            document.getElementById('table_relatorio-adesao').style.overflow = 'auto';
        }
    }

    return (
        <>
            <ChartCustom
                id="chart_adesao"
                title="Adesão"
                type="ColumnChart"
                headers={['Mês', 'Esperados', 'Realizados']}
                body={{
                    type: 'custom',
                    content: dadosPreenchidos,
                }}
                vAxis={{
                    ticks,
                    format: 'dd',
                }}
                isStacked={true}
                //series={{ 2: { type: 'line' } }}
                colors={['#10459e', '#bdc3cb', '#f2383a']}
                height={350}
            />

            <div
            //className={style.container}
            >
                {/* <Sidebar
                    handleFilterEmpreendimento={handleFilterEmpreendimento}
                    handleFilterLoja={handleFilterLoja}
                    filtroLoja={filtroLoja}
                    filtroRede={filtroRede}
                    sistema_id={filtroSistema}
                /> */}

                <Table
                    id="relatorio-adesao"
                    //className={style.table}
                    //fullwith={true}
                    api={url}
                    params={params}
                    loading={false}
                    onLoad={handleSetItems}
                    thead={thead}
                    key_aux={['data']}
                    reload={filtroLoja + filtroRede + filtroData}
                    limit={15}
                    pages={true}
                >
                    <Tbody>
                        {(items.length > 0 && itemsThead ?
                            items?.map((item) => {
                                // let color_aux;

                                // if (item?.porc_meta < 50) {
                                //     color_aux = 'text-danger';
                                // } else if (item?.porc_meta >= 50) {
                                //     color_aux = 'text-success';
                                // } else {
                                //     color_aux = '';
                                // }

                                return (
                                    <>
                                        {/* <Tr
                                            key={'adesao_' + item.id}
                                            disabled={showEmp === null ? false : showEmp === item.id ? false : true}
                                        >
                                            <Td>{item?.nome} <Icon type="sad" onClick={() => setShowEmp(showEmp === item.id ? null : item.id)} /> </Td>
                                            <Td>{item?.rede}</Td>
                                         
                                            {itemsThead.map((th, index) => (
                                                <Td key={index}>
                                                    {th.index === 'venda' || th.index === 'promedio_valor_venda_item' || th.index === 'promedio_item_venda' ?
                                                        `R$ ${item[th.index]}` :
                                                        th.index === 'porcentagem_concluido' ? `${item[th.index]}%` :
                                                            item[th.index]}
                                                </Td>
                                            ))}
                                        </Tr> */}
                                        {
                                            // showEmp === item.id &&

                                            <Empreendimento
                                                itemsThead={itemsThead}
                                                sistema_id={filtroSistema}
                                                lojas_id={filtroLoja}
                                                empreendimentos_id={filtroRede}
                                                regional_id={filtroRegional}
                                                month={Number(filtroMes)}
                                                year={Number(filtroAno)}
                                                callback={handleCallbackEmpreendimento}
                                            />
                                        }
                                    </>
                                )
                            })
                            : <></>)}
                    </Tbody>
                </Table>
            </div>
        </>
    )
}