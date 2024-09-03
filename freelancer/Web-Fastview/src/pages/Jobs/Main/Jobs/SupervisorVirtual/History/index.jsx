import { useEffect, useState } from "react";
import style from '../style.module.scss';
import { cd, diffDays, get_date } from "../../../../../../_assets/js/global";
import Icon from "../../../../../../components/body/icon";
import Row from "../../../../../../components/body/row";
import Chart from "react-google-charts";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../../../../../components/body/loader";
import Item from "./Item";

export default function History(){
    // ESTADOS
    const [dataChart, setDataChart] = useState([]);
    const [filter, setFilter] = useState('job_responsible');
    const [filterDateStart, setFilterDateStart] = useState(get_date('new_date', cd(new Date()), 'date_sub_month', 3));
    const [filterDateEnd, setFilterDateEnd] = useState(new Date());
    const [filterDateStartDisabled, setFilterDateStartDisabled] = useState(false);
    const [filterDateEndDisabled, setFilterDateEndDisabled] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date());
    const [loadingChart, setLoadingChart] = useState(true);
    const [lastPosition, setLastPosition] = useState([]);
    const [items, setItems] = useState([]);

    // FILTROS
    const filters = [
        {id: 'job_responsible', nome: (window.innerWidth > 1300 ? 'Supervisores' : 'Superv.')},
        // {id: 'department', nome: (window.innerWidth > 1300 ? 'Departamentos' : 'Depart.')},
        {id: 'enterprise_stores', nome: (window.innerWidth > 1300 ? 'Empresas' : 'Empre.')},
        {id: 'store', nome: (window.innerWidth > 1300 ? 'Lojas' : 'Lojas')}
    ];

    // ITENS FAKES
    // const items = [
    //     {id: 1, nome: 'Ariana Souza de Moraes', jobs: '+12', posicao: '+1', pontos: '+165', history: [{id: 1, date: 'Jan/24', position: '-18', description: 'Aceita ajuda técnica'}, {id: 2, date: 'Fev/24', position: '+17', description: 'Sobe 1 posição'},{id: 3, date: 'Mar/24', position: '+15', description: 'Sobe 2 posições'},{id: 4, date: 'Abr/24', position: '-16', description: 'Aceita nova ajuda técnica'}]},
    //     {id: 2, nome: 'Fernando Costa Frias', jobs: '-16', posicao: '-1', pontos: '+180', history: [{id: 1, date: 'Jan/24', position: '-18', description: 'Aceita ajuda técnica'}, {id: 2, date: 'Fev/24', position: '+17', description: 'Sobe 1 posição'},{id: 3, date: 'Mar/24', position: '+15', description: 'Sobe 2 posições'},{id: 4, date: 'Abr/24', position: '-16', description: 'Aceita nova ajuda técnica'}]},
    //     {id: 3, nome: 'Mauro Fernandes', jobs: '-28', posicao: '+1', pontos: '+195', history: [{id: 1, date: 'Jan/24', position: '-18', description: 'Aceita ajuda técnica'}, {id: 2, date: 'Fev/24', position: '+17', description: 'Sobe 1 posição'},{id: 3, date: 'Mar/24', position: '+15', description: 'Sobe 2 posições'},{id: 4, date: 'Abr/24', position: '-16', description: 'Aceita nova ajuda técnica'}]}
    // ];
    
    // TROCA DATA INICIAL
    const handleSetDateStart = (type) => {
        if(type === 'prev'){
            setFilterDateStart(get_date('new_date', cd(filterDateStart), 'date_sub_month', 1));
        }else if(type === 'next'){
            if(cd(filterDateStart) != cd(filterDateEnd)){
                setFilterDateStart(get_date('new_date', cd(filterDateStart), 'date_add_month', 1));
            }
        }        
    }

    // TROCA DATA FINAL
    const handleSetDateEnd = (type) => {
        if(type === 'prev'){
            if(cd(filterDateStart) != cd(filterDateEnd)){
                setFilterDateEnd(get_date('new_date', cd(filterDateEnd), 'date_sub_month', 1));
            }
        }else if(type === 'next'){
            setFilterDateEnd(get_date('new_date', cd(filterDateEnd), 'date_add_month', 1));
        }        
    }

    // BLOQUEIO DO FILTRO DE DATA
    useEffect(() => {
        if(cd(filterDateStart) == cd(filterDateEnd)){
            setFilterDateStartDisabled(true);
            setFilterDateEndDisabled(true);
        }else{
            setFilterDateStartDisabled(false);
            setFilterDateEndDisabled(false);
        }
    },[filterDateStart, filterDateEnd]);

    // GET RANKING
    function get_ranking(type){
        let date_start_aux = get_date('date_sql', get_date('first_date', cd(filterDateStart), 'date'), 'date');
        let date_end_aux = get_date('date_sql', get_date('first_date', cd(filterDateEnd), 'date'), 'date');
        let diff_days = diffDays(date_end_aux, date_start_aux);
        let month_interval = parseInt((diff_days / 30 + 1));
        let data_aux;

        // HABILITA LOADING DO CHART
        setLoadingChart(true);

        // PEGA OS ÚLTIMOS DO MÊS FINAL FILTRADO
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'sql_server',
                type: 'Job',
                do: 'getVirtualSupervisionRanking',
                filter_type: type,
                filter_frequency: 'month',
                month: cd(filterDateEnd).split('/')[1],
                year: cd(filterDateEnd).split('/')[2],
                limit: 3
            }
        }).then(async(response) => { 
            if(response?.data?.data){
                let response_aux = response?.data?.data;
                let array_aux = ['Mês'];
                let id_aux = [];

                // MONTA O CABEÇALHO DO GRÁFICO
                response_aux.map((item, i) => {
                    array_aux.push(item?.nome);
                    id_aux?.push(item?.id);
                });
                data_aux = array_aux;                
                
                // SETA ESTADOS COM O ID DOS ÚLTIMOS 3
                let id_position = [];
                response_aux?.map((item, i) => {
                    id_position.push({id: item?.id, nome: item?.nome, pontos: item?.pontos, posicao: item?.posicao});
                });

                setLastPosition(id_position);
                
                // ARRAY QUE ESPERA RECEBER TODAS AS REQUISIÇÕES NA ORDEM CERTA
                let await_away = [data_aux];

                // FAZ AS REQUISIÇÕES DE CADA MÊS
                [...Array(month_interval)].map((item, i) => {
                    let month_aux = get_date('date_sql', get_date('date', date_start_aux, 'date_sql'), 'date_add_month', i).split('-')[1];
                    let year_aux = get_date('date_sql', get_date('date', date_start_aux, 'date_sql'), 'date_add_month', i).split('-')[0];
                    let month_name = get_date('month_name', get_date('date_sql', get_date('date', date_start_aux, 'date_sql'), 'date_add_month', i), 'date_sql');
                    
                    const request = axios({ 
                        method: 'get',
                        url: window.host_madnezz+'/systems/integration-react/api/request.php',
                        params: {
                            db_type: 'sql_server',
                            type: 'Job',
                            do: 'getVirtualSupervisionRanking',
                            filter_type: type,
                            filter_frequency: 'month', 
                            month: month_aux,
                            year: year_aux,
                            limit: 500
                        }
                    }).then(({data}) => { 
                        let array_aux = [];
                        array_aux.push(month_name);

                        [...Array(id_aux?.length)].map((item, i) => { 
                            if(parseInt(data?.data?.filter((elem) => elem.id == id_aux[i])[0]?.posicao)){
                                array_aux.push(parseInt(data?.data?.filter((elem) => elem.id == id_aux[i])[0]?.posicao));
                            }else{
                                array_aux.push(data?.data?.length);
                            }
                        });

                        if(data?.data){
                            return array_aux;
                        }
                    });

                    if(request){
                        await_away.push(request); 
                    }
                });

                // RESPOSTA FINAL DE TODAS AS REQUISIÇÕES
                const res = await Promise.all(await_away);   

                setDataChart(res.filter((elem) => elem !== undefined));
                setLoadingChart(false);
            }else{
                setLoadingChart(false);
                setLastPosition([]);
            }
        });
    }

    // FAZ A REQUISIÇÃO SEMPRE QUE ALTERA O TIPO
    useEffect(() => {
        setDataChart([]);
        setLastPosition([]);
        setItems([]);

        get_ranking(filter);
    },[filter, filterDateStart, filterDateEnd]);

    // CHAMADA DO HISTÓRICO
    useEffect(() => {
        setItems([]);
    },[lastPosition]);

    return(
        <div className={style.ranking_container + ' ' + style.no_border}>
            <div onClick={() => loadingChart ? toast('Ainda carregando, aguarde') : {}}>
                <div className={style.filter_container + ' mb-3'} style={loadingChart ? {pointerEvents : 'none', opacity: '0.5'} : {}}>
                    <div className={style.items}>
                        {(filters.map((item, i) => {
                            return(
                                <div
                                    key={item?.id}
                                    className={style.item + ' ' + (filter === item?.id ? style.active : '')}
                                    onClick={() => setFilter(item?.id)}
                                >
                                    {item?.nome}
                                </div>
                            )
                        }))}
                    </div>

                    <div className={style.date_container}>
                        <div className={style.date}>
                            <Icon
                                type="left"
                                title={false}
                                onClick={() => handleSetDateStart('prev')}
                            />

                            <span>
                                {get_date('month_name', cd(filterDateStart))}/{get_date('year', cd(filterDateStart))}
                            </span>

                            <Icon
                                type="right"
                                title={false}
                                onClick={() => handleSetDateStart('next')}
                                disabled={filterDateStartDisabled}
                            />            
                        </div>

                        Até

                        <div className={style.date}>
                            <Icon
                                type="left"
                                title={false}
                                onClick={() => handleSetDateEnd('prev')}
                                disabled={filterDateEndDisabled}
                            />

                            <span>
                                {get_date('month_name', cd(filterDateEnd))}/{get_date('year', cd(filterDateEnd))}
                            </span>

                            <Icon
                                type="right"
                                title={false}
                                onClick={() => handleSetDateEnd('next')} 
                            />              
                        </div>
                    </div>
                </div>
            </div>

            {(loadingChart ? 
                <div className={style.loader_chart}>
                    <Loader />
                </div>
            :
                (dataChart.length > 0 ?
                    <Chart
                        chartType="LineChart"
                        data={dataChart}
                        options={{
                            legend: { position: "bottom" },
                            chartArea: {
                                width: '100%',
                                height: '60%',
                                left: '5%',
                                top: '5%' 
                            },
                            pointSize: 10,
                            backgroundColor: 'transparent',
                            vAxis: {
                                format: '#'
                            }
                        }}
                        width={'100%'}
                        height={300}
                    />
                :
                    <div className={style.chart_empty}>
                        {(lastPosition?.length > 0 ?
                            <p className="mb-0">
                                Nenhum dado encontrado
                            </p>
                        :
                            <p className="mb-0">
                                Nenhum dado para o mês atual. Tente filtrar o mês anterior
                            </p>
                        )}
                    </div>
                )
            )}

            <Row className={style.row + ' mt-4 flex-1'}>
                {(lastPosition?.map((item, i) => {
                    return(
                        <Item
                            key={'historico_'+item?.id}
                            type={filter}
                            item={item}
                        />
                    )
                }))}
            </Row>
        </div>
    )
}
