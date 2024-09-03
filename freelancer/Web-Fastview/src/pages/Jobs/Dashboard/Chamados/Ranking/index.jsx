import { useState } from "react";
import Col from "../../../../../components/body/col";
import Row from "../../../../../components/body/row";
import Categorias from "./Categorias";
import Lojas from "./Lojas";
import Galerias from "./Galerias";
import Subcategorias from "./Subcategorias";

export default function Ranking({filters}){
    // ESTADOS
    const [viewStore, setViewStore] = useState('store');
    const [viewCategory, setViewCategory] = useState('category');

    // OPTIONS DO CHART
    const options ={
        isStacked: true,
        hAxis: {
            minValue: 0,
        },
        vAxis: {
            textStyle: {
                fontSize: 14,
                color: '#898e94'
            },
        },       
        chartArea: {
            width: '85%',
            height: '65%',
            left: '10%',
            top: '5%',
        },
        legend: {
            position: 'bottom',
            alignment: 'left',
            textStyle: {
                fontSize: 14,
                color: '#898e94'
            },
        }
    }

    // TROCA VISUALIZAÇÃO
    const handleChange = (e) => {
        if(e?.changeStore){
            setViewStore(e?.changeStore);
        }

        if(e?.changeCategory){
            setViewCategory(e?.changeCategory);
        }
    }

    return(
        <Row>
            <Col lg={6}>
                {(viewStore === 'store' ?
                    <Lojas
                        chartOptions={options}
                        filters={filters}
                        callback={handleChange}
                    />
                :
                    <Galerias
                        chartOptions={options}
                        filters={filters}
                        callback={handleChange}
                    />
                )}
            </Col>

            <Col lg={6}>
                {(viewCategory === 'category' ?
                    <Categorias
                        chartOptions={options}
                        filters={filters}
                        callback={handleChange}
                    />
                :
                    <Subcategorias
                        chartOptions={options}
                        filters={filters}
                        callback={handleChange}
                    />
                )}
            </Col>
        </Row>
    )
}