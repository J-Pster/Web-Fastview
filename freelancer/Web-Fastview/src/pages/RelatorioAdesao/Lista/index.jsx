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
import { cd, get_date } from '../../../_assets/js/global';
import "./style.css";

//
import useDashboardStore from './constants/dashboard.store';
import dayjs from 'dayjs';
import Empreendimento from './empreendimentos';
import FilterCheckbox from '../../../components/body/filterCheckbox';
import { getDate } from 'date-fns';
import Tippy from '@tippyjs/react';
import Loader from '../../../components/body/loader';

export default function Lista({ filters, icons, sistema_id }) {
    // ESTADOS
    const [loading, setLoading] = useState(true);

    //ESTADO TABELA
    const [items, setItems] = useState([]);
    const [itemsThead, setItemsThead] = useState();
    //ESTADO GRÁFICO
    const [grafico, setGrafico] = useState();
    // ESTADOS DE FILTROS
    const [filtroSistema, setFiltroSistema] = useState(sistema_id ? sistema_id : 223); // CRAVADO JOBS PROVISÓRIAMENTE
    // const [filtroLoja, setFiltroLoja] = useState([]);
    const [filtroLoja, setFiltroLoja] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState(1);
    //const [filtroMes, setFiltroMes] = useState(new Date(window.currentMonth + '-01-' + window.currentYear)) // MêS ATUAL
    const [filtroData, setFiltroData] = useState(new Date()) // MêS ATUAL
    const [filtroMes, setFiltroMes] = useState(window.currentMonth) // MêS ATUAL
    const [filtroAno, setFiltroAno] = useState(window.currentYear) // ANO ATUAL

    const [filtroRede, setFiltroRede] = useState(null);
    const [filtroRegional, setFiltroRegional] = useState(null);
    const [, setOptionsSistema] = useState();
    const [regional, setRegional] = useState();

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
        setFiltroData(e);
        setFiltroMes(data[1]);
        setFiltroAno(data[2]);
    }

    // CONSTRÓI AS TH'S
    const thead = [
        // { enabled: true, export: true, label: 'Grupo', id: 'grupo', name: 'grupo', api: { url: window.backend + '/api/v1/utilities/filters/grupo-empreendimento', key_aux: ['data'] }, onChange: handleEvent(setFiltroRede), filter: false },
        { enabled: true, export: true, label: 'Empreendimento', filter: false, id: 'rede', name: 'rede'},
        // { enabled: true, export: true, label: 'Regional', id: 'regional', name: 'regional', api: window.host + '/api/sql.php?do=select&component=usuario', onChange: handleEvent(setFiltroRegional) },
        // { enabled: true, export: true, label: 'Loja', id: 'loja', name: 'loja', api: { url: window.backend + '/api/v1/utilities/filters/lojas', params: { sistema_id: window.rs_sistema_id, filter_id_enterprise: [window.rs_id_emp] }, key_aux: ['data'] }, onChange: handleEvent(setFiltroLoja), filter: true },
        ...(itemsThead ? itemsThead : []).map(item => ({
            enabled: true,
            export: true,
            label: item.abreviacao ? item.abreviacao : item.nome,
            title: item.nome,
            id: item.index,
            name: item.index,
            filter: false,
            align: 'center'
        }))
    ]

    // // TITLES EXPORT
    // let thead_export = {};
    // thead.map((item) => {
    //     if (item?.export !== false) {
    //         thead_export[item?.name] = item?.label;
    //     }
    // })

    let thead_export = {};
    thead_export['data'] = 'Data';
    thead_export['concluidos'] = 'Concluídos';
    thead_export['esperados'] = 'Esperados';
    thead_export['nao_concluidos'] = 'Não concluídos';
    thead_export['porcentagem'] = 'Porcentagem';

    // URL API TABLE
    const url = `${window.backend}/api/v1/adesao/relatorios/empreendimentos`;

    const params = {
        sistema_id: filtroSistema,
        lojas: filtroLoja,
        empreendimentos: filtroRede,
        supervisores: filtroRegional ? filtroRegional : regional,
        date: filtroTipo == 2 ? getDate('date_sql', filtroData, 'date') : undefined,
        month: filtroTipo == 1 ? Number(filtroMes) : undefined,
        year: filtroTipo == 1 ? Number(filtroAno) : undefined,
    }

    const body = {
        titles: thead_export,
        url: `${window.backend}/api/v1/adesao/relatorios/days`,
        name: 'Adesão',
        filters: params,
        orientation: 'L',
        key: 'data'
    }

    let thead_export_loja = {};
    thead_export_loja['nome_empreendimento'] = 'Empreendimento';
    thead_export_loja['nome_supervisor'] = 'Supervisor';
    thead_export_loja['nome'] = 'Loja';
    thead_export_loja['concluidos'] = 'Concluídos';
    thead_export_loja['concluidos_com_atraso'] = 'Concluídos com atraso';
    thead_export_loja['atrasados'] = 'Atrasados';
    thead_export_loja['em_andamento'] = 'Em aberto';
    thead_export_loja['porcentagem_concluido'] = '% Concluídos';
    thead_export_loja['esperados'] = 'Esperados';
    thead_export_loja['realizados'] = 'Realizados';
    thead_export_loja['porcentagem_concluido'] = 'Porcentagem';

    const body_loja = {
        titles: thead_export_loja,
        url: `${window.backend}/api/v1/adesao/relatorios/lojas`,
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
        setLoading(true);
        
        axios.get(`${window.backend}/api/v1/adesao/relatorios/days`, {
            params: params
        }).then((response) => {
            if(response?.data){
                if(response?.data?.data){
                    if(Array.isArray(response?.data?.data)){
                        setGrafico(response?.data?.data.map((item) => ({...item, tooltip: `${item.porcentagem}%`})));
                    }
                }else{
                    setGrafico(response?.data);
                }
            }        
            setLoading(false);    
        }).catch((error) => {
            setLoading(false);
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
        // getTableContent();
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
                    Number(itemExistente.concluidos),
                    Number(itemExistente.nao_concluidos),
                    Number(itemExistente.concluidos),
                    itemExistente.tooltip,
                    // Number(itemExistente.esperados),
                ]);
            } else {
                dadosCompletos.push([correctFormat(dataAtual), 0, 0, 0, '0%']);
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

    function getRegional() {
        axios.get(window.host+'/api/sql.php?do=select&component=supervisor_2', {
        }).then(({ data }) => {
            if(Array.isArray(data) && data?.length > 0){
                setRegional(data.map(item => item.id))    
            } 
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
        getRegional();
        // getEmpreendimentos();
    }, [])

    // MANDA OS FILTROS E ÍCONES PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons(
                <>
                    {/* <Icon type="pdf" api={{ body: body }} />  */}
                    <Icon type="print" />
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

                    {(!sistema_id ?
                        <SelectReact
                            id="filter_sistema"
                            name="filter_sistema"
                            placeholder="Sistema"
                            value={filtroSistema}
                            onChange={(e) => setFiltroSistema(e.value)}
                            options={[{ value: 223, label: "Jobs" }]}
                            required={false}
                            allowEmpty={false}
                        />
                    :'')}

                    {/* 
                    
                    api: { url: window.backend + '/api/v1/utilities/filters/lojas', params: { sistema_id: window.rs_sistema_id, filter_id_enterprise: [window.rs_id_emp] }, key_aux: ['data'] }
                    
                    */}

                    <FilterCheckbox
                        id="filtro_empreendimento"
                        name="filtro_empreendimento"
                        api={{
                            url: window.host+'/api/sql.php?do=select&component=grupo_empreendimento'
                        }}
                        onChangeClose={(e) => setFiltroRede(e)}
                        value={filtroRede}
                    >
                        Rede
                    </FilterCheckbox>

                    <FilterCheckbox
                        id="filter_supervisor"
                        name="filter_supervisor"
                        api={{
                            url: window.host+'/api/sql.php?do=select&component=supervisor_2',
                            params: {
                                empreendimento_id: filtroRede
                            },
                            reload: filtroRede
                        }}
                        onChangeClose={(e) => setFiltroRegional(e)}
                        value={filtroRegional}
                    >
                        Supervisor
                    </FilterCheckbox>

                    <FilterCheckbox
                        id="filter_loja"
                        name="filter_loja"
                        api={{
                            url: window.host+'/api/sql.php?do=select&component=loja',
                            params: {
                                empreendimento_id: filtroRede,
                                limit: 50,
                                supervisor_id: filtroRegional,
                                filial:true
                            },
                            reload: filtroRede + filtroRegional
                        }}
                        options={optionsLoja}
                        onChangeClose={(e) => setFiltroLoja(e)}
                        value={filtroLoja}
                    >
                        Lojas
                    </FilterCheckbox>                    

                    <SelectReact
                        id="filtro_tipo"
                        name="filtro_tipo"
                        options={[
                            {id: 1, nome: 'Por mês'},
                            {id: 2, nome: 'Por dia'}
                        ]}
                        allowEmpty={false}
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.value)}
                    />

                    {(filtroTipo == 1 ?
                        <Input
                            type="date"
                            format={'mm/yyyy'}
                            name="filtro_mes"
                            required={false}
                            value={filtroData}
                            onChange={(e) => handleFilterDate(e)}
                        />
                    :'')}

                    {(filtroTipo == 2 ? 
                        <Input
                            type="date"
                            name="filtro_dia"
                            required={false}
                            value={filtroData}
                            onChange={(e) => handleFilterDate(e)}
                        />
                    :'')}
                </>
            );
        }
    }, [items, filtroData, filtroSistema, filtroTipo, filtroRede, filtroRegional, filtroLoja]);

    // CALLBACK DO COMPONENTE DE EMPREENDIMENTO
    const handleCallbackEmpreendimento = (e) => {
        if(e?.empreendimento_id){
            // PEGA TOP DO ELEMENTO CLICADO
            let top = document.getElementById('emp_'+e.empreendimento_id).offsetTop - 57;

            setTimeout(() => { // TEMO MÍNIMO PARA RENDERIZAR OS ITENS NA TELA
                document.getElementById('table_relatorio-adesao').scrollTop = top;

                setTimeout(() => { // TEMPO ATÉ TERMINAR O SCROLL
                    document.getElementById('table_relatorio-adesao').style.overflowY = 'hidden';
                },200);
            },100);            
        }else{
            document.getElementById('table_relatorio-adesao').style.overflowY = 'auto';
        }
    }

    return (
        <>
            <ChartCustom
                id="chart_adesao"
                title="Adesão"
                type="ColumnChart"
                headers={[
                    'Mês',
                    'Concluídos',
                    'Não concluídos',
                    'Adesão',
                    {role: 'tooltip'}
                ]}
                body={{
                    type: 'custom',
                    content: dadosPreenchidos,
                }}
                vAxis={{
                    ticks,
                    format: 'dd',
                }}
                isStacked={true}
                series={{ 2: { type: 'line' } }}
                colors={['#10459e', '#bdc3cb', '#f2383a', '#f00']}
                height={350}
                loading={loading}
            />

            <div
            //className={style.container}
            >

                <div style={{display: 'flex', justifyContent: 'flex-end'}} className='mb-1'>
                    <Icon type="excel" api={{ body: body }} />
                </div>
                
                <Table className="mb-4" text_limit={false}>

                        
                    
                    <Tr>
                        {(loading ?
                            <Td empty={true} colspan="100%" align="center">
                                <Loader />
                            </Td>
                        :                           
                            (dadosPreenchidos.map((item, i) => {
                                if(i==0){
                                    return(
                                        <Td key={'legenda'} width={1} disableView={false}>
                                            <p></p>
                                            <p className="mb-0">Concluídos</p>  
                                            <p className="mb-0">Não Concluídos</p> 
                                            <p className="mb-0">Esperados</p>  
                                            <p className="mb-0">Porcentagem </p>
                                        </Td>
                                    )
                                }else{
                                    return(
                                        <Td key={'numeros_'+i} width={1} disableView={false}>
                                            <p className="mb-0">{item[0]}</p>
    
                                            <Tippy content="Concluídos">
                                                <p className="mb-0">{item[1]}</p>
                                            </Tippy>
    
                                            <Tippy content="Não concluídos">
                                                <p className="mb-0">{item[2]}</p>
                                            </Tippy>
    
                                            <Tippy content="Esperados">
                                                <p className="mb-0">{item[1] && item[2] ? item[1] + item[2] : '0'}</p>
                                            </Tippy>
    
                                            <Tippy content="Porcentagem">
                                                <p className="mb-0">{item[4]}</p>
                                            </Tippy>
                                        </Td>
                                    )
                                }
                            }))
                        )}
                    </Tr>
                </Table>

                <div style={{display: 'flex', justifyContent: 'flex-end'}} className='mb-1'>
                    <Icon type="excel" api={{ body: body_loja }} />
                </div>

                <Table
                    id="relatorio-adesao"
                    //className={style.table}
                    //fullwith={true}
                    // api={url}
                    loading={false}
                    // onLoad={handleSetItems}
                    thead={thead}
                    key_aux={['data']}
                    text_limit={false}
                    limit={15}
                    pages={true}
                >
                    <Tbody>
                        <Empreendimento
                            itemsThead={itemsThead}
                            setItemsThead={setItemsThead}
                            sistema_id={filtroSistema}
                            lojas_id={filtroLoja}
                            empreendimentos_id={filtroRede}
                            regional_id={filtroRegional}
                            date={filtroTipo == 2 ? get_date('date_sql', cd(filtroData), 'date') : undefined}
                            month={filtroTipo == 1 ? Number(filtroMes) : undefined}
                            year={filtroTipo == 1 ? Number(filtroAno) : undefined}
                            type={filtroTipo}
                            callback={handleCallbackEmpreendimento}
                        />
                    </Tbody>
                </Table>
            </div>
        </>
    )
}