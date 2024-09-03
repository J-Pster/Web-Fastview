import Categorias from "./Categorias";
import Departamentos from "./Departamentos";
import Subcategorias from "./Subcategorias";

export default function SLA({filters}){
    // OPTIONS DO CHART
    const options ={
        isStacked: true,
        hAxis: {
            minValue: 0,
        },
        vAxis: {
            format: 'decimal',
            viewWindow: {
                min: 0, // Adjust as needed based on your data
              },
            textStyle: {
                fontSize: 14,
                color: '#898e94'
            },
        },       
        chartArea: {
            width: '70%',
            height: '80%',
            left: '25%',
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

    return(
        <>
            <Departamentos
                chartOptions={options}
                filters={filters}
            />

            <Categorias
                chartOptions={options}
                filters={filters}
            />

            <Subcategorias
                chartOptions={options}
                filters={filters}
            />
        </>
    )
}