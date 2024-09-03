import Chart from "react-google-charts";
import Box from "../../components/Box";
import boxStyle from '../../components/Box/style.module.scss';
import { useEffect, useState } from "react";
import Table from "../../../../../../components/body/table";
import Thead from "../../../../../../components/body/table/thead";
import Tr from "../../../../../../components/body/table/tr";
import Th from "../../../../../../components/body/table/thead/th";
import Icon from "../../../../../../components/body/icon";
import Tbody from "../../../../../../components/body/table/tbody";
import Td from "../../../../../../components/body/table/tbody/td";
import style from '../style.module.scss';
import { cd, get_date } from "../../../../../../_assets/js/global";
import axios from "axios";

export default function Lojas({chartOptions, filters, callback}){
    // ESTADOS
    const [order, setOrder] = useState('desc');
    const [data, setData] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET CHART
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: window.db_type,
                do: 'getDashboardChamados',
                type: 'Job',
                mes: filters?.filter_date ? get_date('month', cd(filters?.filter_date)) : window.currentMonth,
                ano: filters?.filter_date ? get_date('year', cd(filters?.filter_date)) : window.currentYear,
                categoria: filters?.filter_category?.length > 0 ? filters?.filter_category : undefined,
                subcategoria: filters?.filter_subcategory?.length > 0 ? filters?.filter_subcategory : undefined,
                modulo: filters?.filter_module?.length > 0 ? filters?.filter_module : undefined,
                tipo: 'loja_sla',
                limit: 10
            }
        }).then((response) => {
            if(response?.data){
                let data_aux = [['', 'Em 7 dias úteis', 'Em mais de 7 dias úteis']];

                response?.data?.map((item, i) => {
                    data_aux.push([(item?.loja_nome?.slice(0,10)+'...'), parseInt(item?.qtd_inferior), parseInt(item?.qtd_superior)]);
                });

                setData(data_aux);
            }

            setLoading(false);
        })
    },[filters?.filter_date, filters?.filter_category, filters?.filter_subcategory, filters?.filter_module]);

    // SETA ITENS VINDOS DO COMPONENTE TABLE
    const handleSetItems = (e) => {
        setItems(e);
    }

    // TROCA VISUALIZAÇÃO
    const handleChange = (e) => {
        if(callback){
            callback({
                changeStore: 'gallery'
            });
        }
    }

    return(
        <>
            <Box
                title={
                    <>
                        Ranking de Chamados por

                        <span className="ms-1 cursor-pointer" onClick={handleChange}>
                            <span className="text-primary font-weight-bold">Lojas</span> <Icon type="change" className="mx-1" title={false} readonly /> Galerias
                        </span>
                    </>
                }
                className={'mb-0 ' + boxStyle.borderBottomRadiusNone + ' ' + boxStyle.borderBottomNone}
                loading={loading}
                body={
                    <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="300px"
                        data={data}
                        options={chartOptions}
                    />
                }
            />

            <Table
                api={window.host_madnezz+'/systems/integration-react/api/request.php'}
                params={{
                    db_type: window.db_type,
                    do: 'getRanking',
                    type: 'Job',
                    mes: filters?.filter_date ? get_date('month', cd(filters?.filter_date)) : window.currentMonth,
                    ano: filters?.filter_date ? get_date('year', cd(filters?.filter_date)) : window.currentYear,
                    categoria: filters?.filter_category?.length > 0 ? filters?.filter_category : undefined,
                    subcategoria: filters?.filter_subcategory?.length > 0 ? filters?.filter_subcategory : undefined,
                    modulo: filters?.filter_module?.length > 0 ? filters?.filter_module : undefined,
                    tipo: 'loja',
                    ordenacao: (order === 'asc' ? 1 : 2)
                }}
                onLoad={handleSetItems}
                reload={order + filters?.filter_date + filters?.filter_category + filters?.filter_subcategory + filters?.filter_module}
                bordered={true}
                className={style.table}
            >
                <Thead>
                    <Tr>
                        <Th>
                            Ranking de Lojas
                        </Th>
                        <Th
                            align="center"
                            width={1}
                            className="cursor-pointer"
                            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                        >
                            Chamados

                            <Icon
                                type={order === 'asc' ? 'sort-asc2' : 'sort-desc2'}
                                title={false}
                                readonly
                                className={'ms-2 ' + ' ' + (order === 'asc' ? 'text-danger' : 'text-primary')}
                            />
                        </Th>

                        <Th
                            align="center"
                            width={1}
                        >
                            Mês anterior
                        </Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {items?.map((item, i) => {
                        // DEFINE ÍCONE DE MAIOR/MENOR
                        let icon_aux, class_aux;

                        if(parseInt(item?.qtd) < parseInt(item?.qtd_mes_anterior)){
                            icon_aux = 'up';
                            class_aux = 'text-success';
                        }else if(parseInt(item?.qtd) > parseInt(item?.qtd_mes_anterior)){
                            icon_aux = 'down';
                            class_aux = 'text-danger';
                        }else if(parseInt(item?.qtd) == parseInt(item?.qtd_mes_anterior)){
                            icon_aux = 'minus';
                            class_aux = 'text-primary';
                        }

                        return(
                            <Tr key={'loja_'+i}>
                                <Td>
                                    <div className={style.number}>{i+1}</div>

                                    {item?.loja}
                                </Td>

                                <Td align="center" width={1}>
                                    {item?.qtd}
                                </Td>

                                <Td align="center" width={1}>
                                    <span>{item?.qtd_mes_anterior}</span>

                                    <Icon
                                        type={icon_aux}
                                        title={false}
                                        readonly
                                        className={style.icon + ' ' + class_aux}
                                    />
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </>
    )
}