import Chart from "react-google-charts";
import Box from "../../components/Box";
import style from '../../components/Box/style.module.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { cd, get_date } from "../../../../../../_assets/js/global";

export default function Categorias({chartOptions, filters}){
    // ESTADOS
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET DATA
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
                tipo: 'categoria_sla'
            }
        }).then((response) => {
            if(response?.data){
                let data_aux = [['', 'Em 7 dias úteis', 'Em mais de 7 dias úteis']];

                response?.data?.map((item, i) => {
                    data_aux.push([item?.categoria_descricao, parseInt(item?.qtd_inferior), parseInt(item?.qtd_superior)]);
                });

                setData(data_aux);
            }

            setLoading(false);
        })
    },[filters?.filter_date, filters?.filter_category, filters?.filter_subcategory, filters?.filter_module]);

    return(
        <Box
            title={<span className="text-primary font-weight-bold">SLA por Categoria</span>}
            subtitle={'SLA 7 dias úteis'}
            className={'mb-0 ' + style.borderTopRadiusNone + ' ' + style.borderBottomRadiusNone + ' ' + style.borderBottomNone}
            loading={loading}
            body={
                <Chart
                    chartType="BarChart"
                    width="100%"
                    height="300px"
                    data={data}
                    options={chartOptions}
                />
            }
        />
    )
}