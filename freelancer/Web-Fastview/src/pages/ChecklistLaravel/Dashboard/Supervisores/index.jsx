import { useState } from "react";

import { cd, get_date } from "../../../../_assets/js/global"
import Col from "../../../../components/body/col"
import Dashboard from "../../../../components/body/dashboard"
import Icon from "../../../../components/body/icon"
import Td from "../../../../components/body/table/tbody/td"
import Th from "../../../../components/body/table/thead/th"
import Tr from "../../../../components/body/table/tr"

export default function Supervisores({filter, callback, handleSetFilterDashboard}){
    // ESTADOS
    const [dash1, setDash1] = useState([]);
    const [dash2, setDash2] = useState([]);
    const [dash3, setDash3] = useState([]);

    // CALLBACK DA COLUNA 1
    const handleSetDash1 = (e) => {
        setDash1(e);
    }
    // CALLBACK DA COLUNA 2
    const handleSetDash2 = (e) => {
        setDash2(e);
    }
    // CALLBACK DA COLUNA 3
    const handleSetDash3 = (e) => {
        setDash3(e);
    }

    // DEFINE VARIÁVEL DA URL DA API
    let url_aux = window.backend + '/api/v1/checklists/relatorios/supervisores';

    // DEFINE VARIÁVEIS DE CADA COLUNA
    let title_aux_1, title_aux_2, title_aux_3, month_aux_1, month_aux_2, month_aux_3, date_start_aux_1, date_start_aux_2, date_start_aux_3, date_end_aux_1, date_end_aux_2, date_end_aux_3;

    if(filter?.periodo == 1){ // SE O FILTRO FOR POR MÊS
        title_aux_1 = get_date('month_name', get_date('date', '01/' + filter?.mes + '/' + filter?.ano));
        title_aux_2 = get_date('month_name', get_date('date', '01/' + filter?.mes + '/' + filter?.ano, 'date_sub_month', 1));
        title_aux_3 = get_date('month_name', get_date('date', '01/' + filter?.mes + '/' + filter?.ano, 'date_sub_month', 2));
        month_aux_1 = get_date('date', ('01/'+filter?.mes+'/'+filter?.ano)).slice(3,10);
        month_aux_2 = get_date('date', ('01/'+filter?.mes+'/'+filter?.ano), 'date_sub_month', 1).slice(3,10);
        month_aux_3 = get_date('date', ('01/'+filter?.mes+'/'+filter?.ano), 'date_sub_month', 2).slice(3,10);
        date_start_aux_1 = undefined;
        date_start_aux_2 = undefined;
        date_start_aux_3 = undefined;
        date_end_aux_1 = undefined;
        date_end_aux_2 = undefined;
        date_end_aux_3 = undefined;
    }else if(filter?.periodo == 2){ // SE O FILTRO FOR POR PERÍODO
        title_aux_1 = cd(filter?.data_inicio) + ' a ' + cd(filter?.data_fim);
        title_aux_2 = get_date('date', cd(filter?.data_inicio), 'date_sub_month', 1) + ' a ' + get_date('date', cd(filter?.data_fim), 'date_sub_month', 1);
        title_aux_3 = get_date('date', cd(filter?.data_inicio), 'date_sub_month', 2) + ' a ' + get_date('date', cd(filter?.data_fim), 'date_sub_month', 2);
        month_aux_1 = undefined;
        month_aux_2 = undefined;
        month_aux_3 = undefined;
        date_start_aux_1 = get_date('date_sql', cd(filter?.data_inicio));
        date_start_aux_2 = get_date('date', cd(filter?.data_inicio), 'date_sub_month', 1);
        date_start_aux_3 = get_date('date', cd(filter?.data_inicio), 'date_sub_month', 2);
        date_end_aux_1 = get_date('date_sql', cd(filter?.data_fim));
        date_end_aux_2 = get_date('date', cd(filter?.data_fim), 'date_sub_month', 1);
        date_end_aux_3 = get_date('date', cd(filter?.data_fim), 'date_sub_month', 2);
    }

    // MANDA O CLICK PRO COMPONENTE PAI
    function handleSetItem(id, title, status){
        if(callback){
            callback([
                {supervisor: id},
                {title: title},
                {status: [status]}
            ])
        }
    }

    return(
        <Col>
            <Dashboard
                id="supervisores"
                thead={
                    <Tr>
                        <Th title="Supervisor">Supervisor</Th>
                        <Th align="center" title="Participação">Part.</Th>
                        <Th align="center"><Icon title="Itens aprovados" type="check" className="text-success" /></Th>
                        <Th align="center"><Icon title="Itens reprovados" type="times" className="text-danger" /></Th>
                        <Th align="center"><Icon title="Itens que não se aplicam" type="ban" className="text-warning" /></Th>
                        <Th align="center" title="Pontos" >Pontos</Th>
                    </Tr>
                }
                cols={{
                    col_1: {
                        title: 'Supervisores - ' + title_aux_1,
                        api: {
                            url: url_aux,
                            params: {
                                month: month_aux_1 ? parseInt(month_aux_1.slice(0,2)) : undefined,
                                year: month_aux_1 ? parseInt(month_aux_1.slice(3,7))  : undefined,
                                empreendimentos: filter?.empreendimento,
                                filtro_periodo: filter?.periodo,
                                data_ini: date_start_aux_1,
                                data_fim: date_end_aux_1,
                                reload: (filter?.empreendimento + filter?.dashboard + filter?.periodo + filter?.mes + filter?.ano + filter?.data_inicio + filter?.data_fim),
                            },
                            key_aux: ['data']
                        },
                        tbody: (
                            dash1.length > 0 ?
                                dash1.map((item) => {
                                    return (
                                        <Tr
                                            key={item.supervisor_id}
                                            active={(filter?.supervisor == item.supervisor_id ? true : false)}
                                            onClick={() => (
                                                handleSetFilterDashboard({tipo:'supervisor', valor:item.supervisor_id})
                                            )}
                                            cursor="pointer"
                                        >
                                            <Td>{item.supervisor_nome}</Td>
                                            <Td align="center">{item.partipacao}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 1)}>{item.qtd_sim}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 2)}>{item.qtd_nao}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 3)}>{item.qtd_nao_aplica}</Td>
                                            <Td align="center">{item.pontos}</Td>
                                        </Tr>
                                    )
                                })
                                : <></>
                        ),
                        callback: handleSetDash1
                    },
                    col_2: {
                        title: 'Supervisores - ' + title_aux_2,
                        api: {
                            url: url_aux,
                            params: {
                                month: month_aux_2 ? parseInt(month_aux_2.slice(0,2)) : undefined,
                                year: month_aux_2 ? parseInt(month_aux_2.slice(3,7))  : undefined,
                                empreendimentos: filter?.empreendimento,
                                filtro_periodo: filter?.periodo,
                                data_ini: date_start_aux_1,
                                data_fim: date_end_aux_1,
                                reload: (filter?.empreendimento + filter?.dashboard + filter?.periodo + filter?.mes + filter?.ano + filter?.data_inicio + filter?.data_fim),
                            },
                            key_aux: ['data']
                        },
                        tbody: (
                            dash2.length > 0 ?
                                dash2.map((item) => {
                                    return (
                                        <Tr key={item.supervisor_id}>
                                            <Td>{item.supervisor_nome}</Td>
                                            <Td align="center">{item.partipacao}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 1)}>{item.qtd_sim}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 2)}>{item.qtd_nao}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 3)}>{item.qtd_nao_aplica}</Td>
                                            <Td align="center">{item.pontos}</Td>
                                        </Tr>
                                    )
                                })
                                : <></>
                        ),
                        callback: handleSetDash2
                    },
                    col_3: {
                        title: 'Supervisores - ' + title_aux_3,
                        api: {
                            url: url_aux,
                            params: {
                                month: month_aux_3 ? parseInt(month_aux_3.slice(0,2)) : undefined,
                                year: month_aux_3 ? parseInt(month_aux_3.slice(3,7))  : undefined,
                                empreendimentos: filter?.empreendimento,
                                filtro_periodo: filter?.periodo,
                                data_ini: date_start_aux_1,
                                data_fim: date_end_aux_1,
                                reload: (filter?.empreendimento + filter?.dashboard + filter?.periodo + filter?.mes + filter?.ano + filter?.data_inicio + filter?.data_fim),
                            },
                            key_aux: ['data']
                        },
                        tbody: (
                            dash3.length > 0 ?
                                dash3.map((item) => {
                                    return (
                                        <Tr key={item.supervisor_id}>
                                            <Td>{item.supervisor_nome}</Td>
                                            <Td align="center">{item.partipacao}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 1)}>{item.qtd_sim}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 2)}>{item.qtd_nao}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => handleSetItem(item.supervisor_id, item.supervisor_nome, 3)}>{item.qtd_nao_aplica}</Td>
                                            <Td align="center">{item.pontos}</Td>
                                        </Tr>
                                    )
                                })
                                : <></>
                        ),
                        callback: handleSetDash3
                    }
                }}
            >
            </Dashboard>
        </Col>
    )
}
