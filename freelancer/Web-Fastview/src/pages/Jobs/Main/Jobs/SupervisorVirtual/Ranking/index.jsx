import { useEffect, useState } from 'react';
import style from '../style.module.scss';
import Table from '../../../../../../components/body/table';
import Thead from '../../../../../../components/body/table/thead';
import Tbody from '../../../../../../components/body/table/tbody';
import Tr from '../../../../../../components/body/table/tr';
import Th from '../../../../../../components/body/table/thead/th';
import Td from '../../../../../../components/body/table/tbody/td';
import Icon from '../../../../../../components/body/icon';
import { cd, get_date } from '../../../../../../_assets/js/global';
import axios from 'axios';
import Loader from '../../../../../../components/body/loader';

export default function Ranking({period}){
    // PEGA NÚMERO DA SEMANA
    function getWeekOfMonth(date) {
        let adjustedDate = date.getDate() + date.getDay();
        let prefixes = ['0', '1', '2', '3', '4', '5'];
        return (parseInt(prefixes[0 | adjustedDate / 7]) + 1);
    }

    // PEGA O DIA DA SEGUNDA-FEIRA DA SEMANA
    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? - 6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    // ESTADOS
    const [filter, setFilter] = useState('job_responsible');
    const [filterDate, setFilterDate] = useState(new Date());
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [week, setWeek] = useState(getWeekOfMonth(new Date()));

    // FILTROS
    const filters = [
        {id: 'job_responsible', nome: (window.innerWidth > 1300 ? 'Supervisores' : 'Superv.')},
        // {id: 'department', nome: (window.innerWidth > 1300 ? 'Departamentos' : 'Depart.')},
        {id: 'enterprise_stores', nome: (window.innerWidth > 1300 ? 'Empresas' : 'Empre.')},
        {id: 'store', nome: (window.innerWidth > 1300 ? 'Lojas' : 'Lojas')}
    ];

    // TROCA DATA
    const handleSetDate = (type) => {
        if(type === 'prev'){
            if(period === 1){ // SEMANAL
                let new_date_aux = filterDate;
                let days_in_month = new Date((new_date_aux.getFullYear()), (new_date_aux.getMonth()+1), 0).getDate();
                new_date_aux.setDate(new_date_aux.getDate() - (new_date_aux.getDay() + 6) % 7);
                new_date_aux = get_date('new_date', cd(new_date_aux), 'date_sub_day', 7);      

                if(new_date_aux.getDate() > (days_in_month === 31 ? 24 : (days_in_month === 29 ? 26 : 25))){
                    new_date_aux = get_date('new_date', cd(new_date_aux), 'date_add_month', 1);
                    new_date_aux = new Date((new_date_aux.getFullYear())+'-'+(new_date_aux.getMonth()+1)+'-01 00:00:00');
                }

                setFilterDate(new_date_aux);
                setWeek(getWeekOfMonth(new_date_aux));
            }else if(period === 2){ // MENSAL
                setFilterDate(get_date('new_date', cd(filterDate), 'date_sub_month', 1));
            }            
        }else if(type === 'next'){
            if(period === 1){ // SEMANAL
                let new_date_aux = filterDate;
                let days_in_month = new Date((new_date_aux.getFullYear()), (new_date_aux.getMonth()+1), 0).getDate();
                new_date_aux.setDate(new_date_aux.getDate() - (new_date_aux.getDay() + 6) % 7);
                new_date_aux = get_date('new_date', cd(new_date_aux), 'date_add_day', 7);      
                          
                if(new_date_aux.getDate() < 7){
                    new_date_aux = get_date('new_date', cd(new_date_aux), 'date_sub_month', 1);
                    new_date_aux = new Date((new_date_aux.getFullYear())+'-'+(new_date_aux.getMonth()+1)+'-'+days_in_month+' 00:00:00');
                }

                setFilterDate(new_date_aux);
                setWeek(getWeekOfMonth(new_date_aux));
            }else if(period === 2){ // MENSAL
                setFilterDate(get_date('new_date', cd(filterDate), 'date_add_month', 1));
            }   
        }        
    }

    // GET RANKING
    function get_ranking(type){
        if(type){
            setLoading(true);
            setItems([]);

            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    db_type: 'sql_server',
                    type: 'Job',
                    do: 'getVirtualSupervisionRanking',
                    filter_type: type,
                    filter_frequency: 'month',
                    month: cd(filterDate).split('/')[1],
                    year: cd(filterDate).split('/')[2],
                    limit: 500
                }
            }).then((response) => {
                if(response?.data?.data){
                    setItems(response.data?.data);
                }
                setLoading(false);
            });
        }
    }

    // FAZ A REQUISIÇÃO SEMPRE QUE ALTERA O TIPO
    useEffect(() => {
        get_ranking(filter);
    },[filter, filterDate]);

    return(
        <div className={style.ranking_container}>
            <div className={style.filter_container}>
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
                <div className={style.date}>
                    <Icon
                        type="left"
                        title={false}
                        onClick={() => handleSetDate('prev')}
                    />

                    {(period === 1 ? // SEMANAL
                        <span>
                            Semana {week} / {get_date('month_name_short', cd(filterDate))}
                        </span>
                    :
                        <span>
                            {get_date('month_name', cd(filterDate))}/{get_date('year', cd(filterDate))}
                        </span>
                    )}

                    <Icon
                        type="right"
                        title={false}
                        onClick={() => handleSetDate('next')}
                    />
                </div>
            </div>

            <div className={style.table_container}>
                {(loading ?
                    <Loader />
                :
                    (items.length > 0 ?
                        <Table
                            border={false}
                            className={style.table}
                            fixed={false}
                        >
                            <Thead>
                                <Th></Th>
                                <Th width={1} align="center">Jobs</Th>
                                <Th width={1} align="center">Posição</Th>
                                <Th width={1} align="center">Pontos</Th>
                                <Th width={1} align="end">Pontos Ating. %</Th>
                            </Thead>

                            <Tbody>
                                {items.map((item, i) => {
                                    let porc_aux = parseInt((parseInt(item?.pontos) / parseInt(item?.pontos_total)) * 100);
                                    let position_class;
                                    let position_icon; 
                                    let pontos_class;
                                    let pontos_icon;
                                    let qtd_class;
                                    let qtd_icon;

                                    // DEFINE INFORMAÇÕES SOBRE A QUANTIDADE DE JOBS
                                    if(parseInt(item?.qtd_atingido) > parseInt(item?.qtd_atingido_anterior)){
                                        qtd_class = 'text-success';
                                        qtd_icon = 'chevron-up';                                        
                                    }else if(parseInt(item?.qtd_atingido) < parseInt(item?.qtd_atingido_anterior)){
                                        qtd_class = 'text-danger';
                                        qtd_icon = 'chevron-down';
                                    }else{
                                        qtd_class = 'text-primary';
                                        qtd_icon = 'dash';
                                    }

                                    // DEFINE INFORMAÇÕES SOBRE A POSIÇÃO
                                    if(parseInt(item?.posicao) > parseInt(item?.posicao_ant)){
                                        position_class = 'text-danger';
                                        position_icon = 'chevron-down';
                                    }else if(parseInt(item?.posicao) < parseInt(item?.posicao_ant)){
                                        position_class = 'text-success';
                                        position_icon = 'chevron-up';
                                    }else{
                                        position_class = 'text-primary';
                                        position_icon = 'dash';
                                    }

                                    // DEFINE INFORMAÇÕES SOBRE A PONTUAÇÃO
                                    if(parseInt(item?.pontos) > parseInt(item?.pontos_ant)){
                                        pontos_class = 'text-success';
                                        pontos_icon = 'chevron-up';                                        
                                    }else if(parseInt(item?.pontos) < parseInt(item?.pontos_ant)){
                                        pontos_class = 'text-danger';
                                        pontos_icon = 'chevron-down';
                                    }else{
                                        pontos_class = 'text-primary';
                                        pontos_icon = 'dash';
                                    }
                                    
                                    return(
                                        <Tr
                                            key={item?.id}
                                            className={i < 3 ? 'text-danger font-weight-bold' : ''}
                                        >
                                            <Td disableView={false}>
                                                <span className={style.position + ' ' + (i < 3 ? style.alert : '')}>
                                                    {items.length - i}
                                                </span>

                                                {item?.nome}
                                            </Td>

                                            <Td disableView={false} width={1} align="center">
                                                <Icon
                                                    type={qtd_icon}
                                                    title={false}
                                                    readonly
                                                    className={qtd_class}
                                                />

                                                {item?.qtd}
                                            </Td>

                                            <Td disableView={false} width={1} align="center">
                                                <Icon
                                                    type={position_icon}
                                                    title={false}
                                                    readonly
                                                    className={position_class}
                                                />

                                                {item?.posicao}
                                            </Td>

                                            <Td disableView={false} width={1} align="center">                                        
                                                <Icon
                                                    type={pontos_icon}
                                                    title={false}
                                                    readonly
                                                    className={pontos_class}
                                                />

                                                {item?.pontos}
                                            </Td>

                                            <Td disableView={false} width={1} align="center" title={porc_aux+'%'}>
                                                <div className={style.progressbar}>
                                                    <div
                                                        className={style.bar + ' ' + (i < 3 ? style.alert : '')  }
                                                        style={{width:porc_aux+'%'}}
                                                    ></div>
                                                </div>
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    :
                        <p>Nenhuma informação disponível</p>
                    )
                )}
            </div>
        </div>
    )
}
