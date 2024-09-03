import Container from '../../../../components/body/container';
import Row from '../../../../components/body/row';
import Col from '../../../../components/body/col';
import Departamentos from './EmAberto/Departamentos';
import Categorias from './EmAberto/Categorias';
import Subcategorias from './EmAberto/Subcategorias';
import SLA from './SLA';
import Ranking from './Ranking';

export default function Dashboard({filters}){
    // CHART OPTIONS
    const PieChartOptions = {
        pieHole: 0.6,
        is3D: false,
        chartArea: {
            width: '90%',
            height: '90%',
            left: '5%',
            top: '5%',
        },
        legend: {
            position: 'center',
            alignment: "center",
            bottom: 50,
            textStyle: {
                fontSize: 14,
                color: '#898e94'
            },
        }
    }

    return(
        <Container>
            <Row>
                <Col xl={4}>
                    <Departamentos
                        chartOptions={PieChartOptions}
                        filters={filters}
                    />
                </Col>

                <Col xl={4}>
                    <Categorias
                        chartOptions={PieChartOptions}
                        filters={filters}
                    />
                </Col>

                <Col xl={4}>
                    <Subcategorias
                        chartOptions={PieChartOptions}
                        filters={filters}
                    />
                </Col>
            </Row>

            <Row>
                <Col xl={4}>
                    <SLA filters={filters} />
                </Col>

                <Col xl={8}>
                    <Ranking filters={filters} />
                </Col>
            </Row>
        </Container>
    )
}