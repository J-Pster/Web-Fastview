import { useState } from 'react';

import Col from '../../../../components/body/col';
import Tr from "../../../../components/body/table/tr";
import Th from "../../../../components/body/table/thead/th";
import Dashboard from "../../../../components/body/dashboard";
import Td from "../../../../components/body/table/tbody/td";
import Icon from '../../../../components/body/icon';
import { cd, get_date } from '../../../../_assets/js/global';

export default function Categorias({ filters, callback }) {
    // ESTADOS
    const [dash1, setDash1] = useState([]);
    const [dash2, setDash2] = useState([]);
    const [dash3, setDash3] = useState([]);
    const [order, setOrder] = useState([{ column: 'qtd_sim', type: 'desc' }]);
    const [order1, setOrder1] = useState(true);
    const [order2, setOrder2] = useState(false);
    const [order3, setOrder3] = useState(false);
    const [order4, setOrder4] = useState(false);

    // GET RESULTADOS DA PRIMEIRA COLUNA DE ATINGIMENTO REDES
    const handleSetDash1 = (e) => {
        // console.log(e)
        if (e.length > 0) {
            setDash1(e);
        } else {
            setDash1(
                <></>
            )
        }
    }

    // GET RESULTADOS DA SEGUNDA COLUNA DE ATINGIMENTO REDES
    const handleSetDash2 = (e) => {
        if (e.length > 0) {
            setDash2(e);
        } else {
            setDash2(
                <></>
            )
        }
    }

    // GET RESULTADOS DA TERCEIRA COLUNA DE ATINGIMENTO REDES
    const handleSetDash3 = (e) => {
        if (e.length > 0) {
            setDash3(e);
        } else {
            setDash3(
                <></>
            )
        }
    }

    // ORDENAÇÃO
    function handleOrder(order_1, order_2, order_3, order_4) {
        let order_aux = [];

        if (order_1) {
            order_aux.push({ column: 'qtd_sim', type: order_1 });
            setOrder1(true);
            setOrder2(false);
            setOrder3(false);
            setOrder4(false);
        }

        if (order_2) {
            order_aux.push({ column: 'qtd_nao', type: order_2 });
            setOrder1(false);
            setOrder2(true);
            setOrder3(false);
            setOrder4(false);
        }

        setOrder(order_aux);
    }

    // CLICK NÚMEROS
    function handleClickNumber(supervisor_id, loja_id, usuario_id, categoria_id, subcategoria_id, titulo, status) {
        // setSupervisorActive('');

        if (callback) {
            callback({
                getInfo: {
                    supervisor_id: supervisor_id,
                    loja_id: loja_id,
                    usuario_id: usuario_id,
                    categoria_id: categoria_id,
                    subcategoria_id: subcategoria_id,
                    titulo: titulo,
                    status: status
                },
                filterCol: undefined
            });
        }
    }

    // CLICK SUPERVISORES
    function handleClickSupervisor(supervisor_id) {
        if (callback) {
            callback({
                getInfo: undefined,
                filterCol: {
                    supervisor_id: supervisor_id,
                    loja_id: '',
                    usuario_id: '',
                    categoria_id: '',
                    subcategoria_id: ''
                }
            });
        }
    }

    //AJUSTAR DATA PARA QUE SEJA DINAMICA AS MUDANÇAS DE MESES COMO JANEIRO/FEVEREIRO
    let data_aux0
    let data_aux1
    let data_aux2
    if(filters.monthSelected){
        data_aux0 = (get_date('date_sql',(cd(new Date(filters.yearSelected, filters.monthSelected-1, 1))))).split('-');
        data_aux1 = (get_date('date_sql',(cd(new Date(filters.yearSelected, filters.monthSelected-1, 1))), 'date_sub_month',1)).split('-');
        data_aux2 = (get_date('date_sql',(cd(new Date(filters.yearSelected, filters.monthSelected-1, 1))), 'date_sub_month',2)).split('-');
    }

    return (
        <Col>
            <Dashboard
                id="atingimento_redes"
                thead={
                    <Tr>
                        <Th>Nome</Th>

                        <Th
                            title="Aprovado"
                            cursor="pointer"
                            active={order1}
                            onClick={() => handleOrder((order[0]?.type === 'desc' ? 'asc' : 'desc'), undefined, undefined, undefined)}
                        >
                            Aprov.
                            {(order1 ?
                                <Icon type={'sort-' + (order[0]?.type === 'desc' ? 'asc' : 'desc')} className={(order1 ? 'text-primary' : '')} />
                                : '')}
                        </Th>

                        <Th
                            title="Reprovado"
                            cursor="pointer"
                            active={order2}
                            onClick={() => handleOrder(undefined, (order[0]?.type === 'desc' ? 'asc' : 'desc'), undefined, undefined)}
                        >
                            Reprov.
                            {(order2 ?
                                <Icon type={'sort-' + (order[0]?.type === 'desc' ? 'asc' : 'desc')} className={(order2 ? 'text-primary' : '')} />
                                : '')}
                        </Th>
                    </Tr>
                }
                cols={
                    {
                        col_1: {
                            title: 'Categoria - ' + get_date('month_name', get_date('date', '01/' + filters?.monthSelected + '/' + filters?.yearSelected, 'date_sub_month', 0)),
                            api: {
                                url: window.host + '/systems/checklist/api/lista.php',
                                params: {
                                    do: 'get_categoria_dashboard',
                                    filtro_mes: filters?.monthSelected ? `${data_aux0[1]}/${data_aux0[0]}` : null,
                                    reload: (filters?.monthSelected + filters?.yearSelected + JSON.stringify(order)),
                                    order_by: order
                                    // reload: (filters?.filterModule + filters?.monthSelected + filters?.yearSelected + JSON.stringify(order)),
                                }
                            },
                            tbody: (
                                dash1.length > 0 ?
                                    dash1.map((item) => {
                                        return (
                                            <Tr
                                                key={item.id_categoria}
                                                active={(filters?.categoriaActive == item.id_categoria ? true : false)}
                                            >
                                                <Td
                                                    onClick={() => callback(filters?.categoriaActive == item.id_categoria ? '' : item.id_categoria)}
                                                    cursor="pointer"
                                                >
                                                    {item.categoria}
                                                </Td>

                                                <Td align="center" //cursor="pointer" onClick={() => handleClickNumber(item.id_supervisor_loja, undefined, undefined, undefined, undefined, undefined, -2)}
                                                >{item.qtd_sim}</Td>
                                                <Td align="center" //cursor="pointer" onClick={() => handleClickNumber(item.id_supervisor_loja, undefined, undefined, undefined, undefined, undefined, 1)}
                                                >{item.qtd_nao}</Td>
                                            </Tr>
                                        )
                                    })
                                    :
                                    <></>
                            ),
                            callback: handleSetDash1
                        },
                        col_2: {
                            title: 'Categoria - ' + get_date('month_name', get_date('date', '01/' + filters?.monthSelected + '/' + filters?.yearSelected, 'date_sub_month', 1)),
                            api: {
                                url: window.host + '/systems/checklist/api/lista.php',
                                params: {
                                    do: 'get_categoria_dashboard',
                                    filtro_mes: filters?.monthSelected ? `${data_aux1[1]}/${data_aux1[0]}` : null,
                                    reload: (filters?.monthSelected + filters?.yearSelected + JSON.stringify(order)),
                                    order_by: order
                                    // reload: (filters?.filterModule + filters?.monthSelected + filters?.yearSelected + JSON.stringify(order)),
                                    // order_by: order
                                }
                            },
                            tbody: (
                                dash2.length > 0 ?
                                    dash2.map((item) => {
                                        return (
                                            <Tr key={item.id_categoria}>
                                                <Td>{item.categoria}</Td>

                                                <Td align="center" //cursor="pointer" onClick={() => handleClickNumber(item.id_supervisor_loja, undefined, undefined, undefined, undefined, undefined, -2)}
                                                >{item.qtd_sim}</Td>
                                                <Td align="center" //cursor="pointer" onClick={() => handleClickNumber(item.id_supervisor_loja, undefined, undefined, undefined, undefined, undefined, 1)}
                                                >{item.qtd_nao}</Td>
                                            </Tr>
                                        )
                                    })
                                    :
                                    <></>
                            ),
                            callback: handleSetDash2
                        },
                        col_3: {
                            title: 'Categoria - ' + get_date('month_name', get_date('date', '01/' + filters?.monthSelected + '/' + filters?.yearSelected, 'date_sub_month', 2)),
                            api: {
                                url: window.host + '/systems/checklist/api/lista.php',
                                params: {
                                    do: 'get_categoria_dashboard',
                                    filtro_mes: filters?.monthSelected ? `${data_aux2[1]}/${data_aux2[0]}` : null,
                                    reload: (filters?.monthSelected + filters?.yearSelected + JSON.stringify(order)),
                                    order_by: order
                                    // reload: (filters?.filterModule + filters?.monthSelected + filters?.yearSelected + JSON.stringify(order)),
                                    // order_by: order
                                }
                            },
                            tbody: (
                                dash3.length > 0 ?
                                    dash3.map((item) => {
                                        return (
                                            <Tr key={item.id_categoria}>
                                                <Td>{item.empreendimento}</Td>

                                                <Td align="center" //cursor="pointer" onClick={() => handleClickNumber(item.id_supervisor_loja, undefined, undefined, undefined, undefined, undefined, -2)}
                                                >{item.qtd_sim}</Td>
                                                <Td align="center" //cursor="pointer" onClick={() => handleClickNumber(item.id_supervisor_loja, undefined, undefined, undefined, undefined, undefined, 1)}
                                                >{item.qtd_nao}</Td>
                                            </Tr>
                                        )
                                    })
                                    :
                                    <></>
                            ),
                            callback: handleSetDash3
                        }
                    }
                }
            >
            </Dashboard>
        </Col>
    )
}

