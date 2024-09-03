import { useEffect, useState } from "react";
import Container from "../../../components/body/container";
import Table from "../../../components/body/table";
import Thead from "../../../components/body/table/thead";
import Th from "../../../components/body/table/thead/th";
import Tr from "../../../components/body/table/tr";
import Tbody from "../../../components/body/table/tbody";
import Empreendimentos from "./Empreendimentos";
import axios from "axios";
import Input from "../../../components/body/form/input";
import { cd, get_date } from "../../../_assets/js/global";

export default function Regua({ icons, filters }){
    // ESTADOS
    const [secoes, setSecoes] = useState(null);
    const [loading, setLoading] = useState(true);

    // ESTADOS DE FILTROS
    const [filterDate, setFilterDate] = useState(new Date(get_date('date_sql', get_date('first_date', window.currentDateWithoutHour, 'date_sql')) + ' 00:00:00'));

    useEffect(() => {
        setLoading(true);
        setSecoes(null);

        axios({
            method: 'get',
            url: window.host+'/systems/checklist/api/lista.php',
            params: {
                do: 'getHorizontalList',
                filter_type: 'enterprise',
                id_checklist: 6528, // Réguas - 2024
                filter_year_month: get_date('date_sql', cd(filterDate))?.slice(0,7)
            }
        }).then((response) => {
            if(response?.data?.checklist[0]?.secao){
                setSecoes(response?.data?.checklist[0]?.secao);
            }

            setLoading(false);
        });
    },[filterDate]);

    // MANDA OS FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons('');
        }

        if (filters) {
            filters(
                <Input
                    type="date"
                    format="mm/yyyy"
                    label={false}
                    value={filterDate}
                    valueEnd={new Date(get_date('date_sql', get_date('first_date', window.currentDateWithoutHour, 'date_sql')) + ' 00:00:00')}
                    onChange={(e) => setFilterDate(e)}
                />
            )
        }
    }, [filterDate]);

    return(
        <Container>
            <Table text_limit={false}>
                {(!loading ?
                    <Thead>                    
                        <Tr>
                            <Th style={{backgroundColor: 'rgba(0,0,0,0.1)'}}></Th>
                            {(secoes?.map((secao, i) => {
                                let percentage_aux = (i+1) * 0.1;
                                return(
                                    <Th
                                        key={'secao_'+secao?.id}
                                        colspan={secao?.pergunta?.length}
                                        align="center"
                                        minWidth={100}
                                        style={{backgroundColor: 'rgba(0,0,0,'+percentage_aux+')', color: (percentage_aux > 0.3 ? '#fff' : '#81878d')}}
                                    >
                                        {secao?.nome}
                                    </Th>
                                )
                            }))}                        
                        </Tr>
                        <Tr>
                            <Th></Th>
                            {(secoes?.map((secao, i) => {
                                return(
                                    secao?.pergunta?.map((pergunta, i) => {
                                        return(
                                            <Th 
                                                key={'pergunta_'+pergunta?.id}
                                                text_limit={20}
                                                title={pergunta?.nome}
                                            >
                                                {pergunta?.nome}
                                            </Th>
                                        )
                                    })
                                )
                            }))}   
                        </Tr>
                    </Thead>
                :'')}

                <Tbody>
                    <Empreendimentos
                        secoes={secoes}
                        filters={{
                            filterDate: filterDate
                        }}
                    />
                </Tbody>
            </Table>
        </Container>
    )
}