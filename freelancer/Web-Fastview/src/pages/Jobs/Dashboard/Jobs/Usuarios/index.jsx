import { useState } from 'react';

import Col from '../../../../../components/body/col';
import Tr from "../../../../../components/body/table/tr";
import Th from "../../../../../components/body/table/thead/th";
import Dashboard from "../../../../../components/body/dashboard";
import Td from "../../../../../components/body/table/tbody/td";
import Icon from '../../../../../components/body/icon';
import { get_date } from '../../../../../_assets/js/global';

export default function Usuarios({filters, callback, chamados}){
    // ESTADOS
    const [dash1, setDash1] = useState([]);
    const [dash2, setDash2] = useState([]);
    const [dash3, setDash3] = useState([]);
    const [order, setOrder] = useState([{column: 'qtd_atrasado', type: 'desc'}]);
    const [order1, setOrder1] = useState(true);
    const [order2, setOrder2] = useState(false);
    const [order3, setOrder3] = useState(false);
    const [order4, setOrder4] = useState(false);

    // GET RESULTADOS DA PRIMEIRA COLUNA DE LOJAS
    const handleSetDash1 = (e) => {
        if(e.length > 0){
            setDash1(e);    
        }else{
            setDash1(
                <></>
            )
        }
    }

    // GET RESULTADOS DA SEGUNDA COLUNA DE LOJAS
    const handleSetDash2 = (e) => {
        if(e.length > 0){
            setDash2(e);    
        }else{
            setDash2(
                <></>
            )
        }     
    }

    // GET RESULTADOS DA TERCEIRA COLUNA DE LOJAS
    const handleSetDash3 = (e) => {
        if(e.length > 0){
            setDash3(e);    
        }else{
            setDash3(
                <></>
            )
        }       
    }

    // ORDENAÇÃO
    function handleOrder(order_1, order_2, order_3, order_4){
        let order_aux = [];

        if(order_1){
            order_aux.push({column: 'qtd_atrasado', type: order_1});
            setOrder1(true);
            setOrder2(false);
            setOrder3(false);
            setOrder4(false);
        }

        if(order_2){
            order_aux.push({column: 'qtd_feito', type: order_2});
            setOrder1(false);
            setOrder2(true);
            setOrder3(false);
            setOrder4(false);
        }

        if(order_3){
            order_aux.push({column: 'qtd_feito_com_atraso', type: order_3});
            setOrder1(false);
            setOrder2(false);
            setOrder3(true);
            setOrder4(false);
        }

        if(order_4){
            order_aux.push({column: 'qtd_nao_tem', type: order_4});
            setOrder1(false);
            setOrder2(false);
            setOrder3(false);
            setOrder4(true);
        }

        setOrder(order_aux);
    }

    // CLICK NÚMEROS
    function handleClickNumber(supervisor_id, loja_id, usuario_id, categoria_id, subcategoria_id, titulo, status){
        // setUsuarioActive('');

        if(callback){
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

    // CLICK USUÁRIOS
    function handleClickUsuario(usuario_id){
        if(callback){
            callback({
                getInfo: undefined,
                filterCol: {
                    supervisor_id: undefined,
                    loja_id: undefined,
                    usuario_id: usuario_id,
                    categoria_id: '',
                    subcategoria_id: ''
                }
            });
        }
    }

    return(
        <Col>
            <Dashboard
                id="usuarios"
                thead={
                    <Tr>
                        <Th>Nome</Th>   

                        {(!chamados ?
                            <Th
                                title="Atrasado"
                                cursor="pointer"
                                active={order1}
                                onClick={() => handleOrder((order[0]?.type === 'desc' ? 'asc' : 'desc'), undefined, undefined, undefined)}
                            >
                                Atra.
                                {(order1 ?
                                    <Icon type={'sort-'+(order[0]?.type === 'desc' ? 'asc' : 'desc')} className={(order1 ? 'text-primary' : '')} />
                                :'')}
                            </Th>
                        :'')}

                        <Th
                            title="Concluídos"
                            cursor="pointer"
                            active={order2}
                            onClick={() => handleOrder(undefined, (order[0]?.type === 'desc' ? 'asc' : 'desc'), undefined, undefined)}
                        >
                            Conc.
                            {(order2 ?
                                <Icon type={'sort-'+(order[0]?.type === 'desc' ? 'asc' : 'desc')} className={(order2 ? 'text-primary' : '')} />
                            :'')}
                        </Th>

                        {(!chamados ?
                            <Th
                                title="Concluídos com atraso"
                                cursor="pointer"
                                active={order3}
                                onClick={() => handleOrder(undefined, undefined, (order[0]?.type === 'desc' ? 'asc' : 'desc'), undefined)}
                            >
                                Conc. c/ Atr.
                                {(order3 ?
                                    <Icon type={'sort-'+(order[0]?.type === 'desc' ? 'asc' : 'desc')} className={(order3 ? 'text-primary' : '')} />
                                :'')}
                            </Th>
                        :'')}

                        <Th
                            title={chamados ? 'Recusados' : 'N/T'}
                            cursor="pointer"
                            active={order4}
                            onClick={() => handleOrder(undefined, undefined, undefined, (order[0]?.type === 'desc' ? 'asc' : 'desc'))}
                        >
                            {chamados ? 'Recus.' : 'N/T'}

                            {(order4 ?
                                <Icon type={'sort-'+(order[0]?.type === 'desc' ? 'asc' : 'desc')} className={(order4 ? 'text-primary' : '')} />
                            :'')}
                        </Th>
                    </Tr>
                }
                cols={
                    {
                        col_1: {
                            title: 'Usuários - '+get_date('month_name',get_date('date','01/'+filters?.monthSelected+'/'+filters?.yearSelected,'date_sub_month',0)),
                            api: {
                                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                                params: {
                                    db_type: global.db_type,
                                    do: 'getDashboard',
                                    type: 'Job',
                                    filter_type: 'user',
                                    filter_id_module: filters?.filterModule,
                                    filter_date_start: filters?.yearSelected+'-'+filters?.monthSelected+'-01',
                                    filter_date_end: get_date('date_sql', get_date('last_date', '01/'+filters?.monthSelected+'/'+filters?.yearSelected, 'date_sub_month', 0)),
                                    filter_id_supervisor: filters?.supervisorActive,
                                    filter_id_store: filters?.lojaActive,
                                    filter_active_2: [0, 1],
                                    reload: (filters?.filterModule + filters?.monthSelected + filters?.yearSelected + filters?.supervisorActive + filters?.lojaActive + JSON.stringify(order)),
                                    order_by: order,
                                    id_apl: window.rs_id_apl
                                },
                                key_aux: ['data']
                            },
                            tbody:(
                                dash1.length>0?
                                    dash1.map((item) => {
                                        return(
                                            <Tr
                                                key={item.id_usuario}
                                                active={(filters?.usuarioActive == item.id_usuario ? true : false)}                                                        
                                            >
                                                <Td
                                                    onClick={() => handleClickUsuario(filters?.usuarioActive == item.id_usuario ? '' : item.id_usuario)}
                                                    cursor="pointer"
                                                >
                                                    {item.nome_usuario}
                                                </Td>

                                                {(!chamados ?
                                                    <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, -2)}>{item.qtd_atrasado}</Td>
                                                :'')}

                                                <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 1)}>{item.qtd_feito}</Td>

                                                {(!chamados ?
                                                    <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 3)}>{item.qtd_feito_com_atraso}</Td>
                                                :'')}

                                                <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 2)}>{item.qtd_nao_tem}</Td>
                                            </Tr>
                                        )
                                    })
                                :
                                    <></>
                            ),
                            callback: handleSetDash1               
                        },
                        col_2: {
                            title: 'Usuários - '+get_date('month_name',get_date('date','01/'+filters?.monthSelected+'/'+filters?.yearSelected,'date_sub_month',1)),
                            api: {
                                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                                params: {
                                    db_type: global.db_type,
                                    do: 'getDashboard',
                                    type: 'Job',
                                    filter_type: 'user',
                                    filter_id_module: filters?.filterModule,
                                    filter_date_start: filters?.yearSelected+'-'+filters?.monthSelected+'-01',
                                    filter_date_end: get_date('date_sql', get_date('last_date', '01/'+filters?.monthSelected+'/'+filters?.yearSelected, 'date_sub_month', 1)),
                                    filter_id_supervisor: filters?.supervisorActive,
                                    filter_id_store: filters?.lojaActive,    
                                    filter_active_2: [0, 1],
                                    reload: (filters?.filterModule + filters?.monthSelected + filters?.yearSelected + filters?.supervisorActive + filters?.lojaActive + JSON.stringify(order)),      
                                    order_by: order,
                                    id_apl: window.rs_id_apl
                                },
                                key_aux: ['data']
                            },
                            tbody:(
                                dash2.length > 0?
                                    dash2.map((item) => {
                                        return(
                                            <Tr key={item.id_usuario}>
                                                <Td>{item.nome_usuario}</Td>
                                                
                                                {(!chamados ?
                                                    <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, -2)}>{item.qtd_atrasado}</Td>
                                                :'')}

                                                <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 1)}>{item.qtd_feito}</Td>

                                                {(!chamados ?
                                                    <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 3)}>{item.qtd_feito_com_atraso}</Td>
                                                :'')}

                                                <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 2)}>{item.qtd_nao_tem}</Td>
                                            </Tr>
                                        )
                                    })
                                :
                                    <></>
                            ),
                            callback: handleSetDash2                        
                        },
                        col_3: {
                            title: 'Usuários - '+get_date('month_name',get_date('date','01/'+filters?.monthSelected+'/'+filters?.yearSelected,'date_sub_month',2)),
                            api: {
                                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                                params: {
                                    db_type: global.db_type,
                                    do: 'getDashboard',
                                    type: 'Job',
                                    filter_type: 'user',
                                    filter_id_module: filters?.filterModule,
                                    filter_date_start: filters?.yearSelected+'-'+filters?.monthSelected+'-01',
                                    filter_date_end: get_date('date_sql', get_date('last_date', '01/'+filters?.monthSelected+'/'+filters?.yearSelected, 'date_sub_month', 2)),
                                    filter_id_supervisor: filters?.supervisorActive,
                                    filter_id_store: filters?.lojaActive,     
                                    filter_active_2: [0, 1],
                                    reload: (filters?.filterModule + filters?.monthSelected + filters?.yearSelected + filters?.supervisorActive + filters?.lojaActive + JSON.stringify(order)),
                                    order_by: order,
                                    id_apl: window.rs_id_apl
                                },
                                key_aux: ['data']
                            },
                            tbody:(
                                dash3.length > 0?
                                    dash3.map((item) => {
                                        return(
                                            <Tr key={item.id_usuario}>
                                                <Td>{item.nome_usuario}</Td>
                                                
                                                {(!chamados ?
                                                    <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, -2)}>{item.qtd_atrasado}</Td>
                                                :'')}

                                                <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 1)}>{item.qtd_feito}</Td>

                                                {(!chamados ?
                                                    <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 3)}>{item.qtd_feito_com_atraso}</Td>
                                                :'')}

                                                <Td align="center" cursor="pointer" onClick={() => handleClickNumber(undefined, undefined, item.id_usuario, undefined, undefined, undefined, 2)}>{item.qtd_nao_tem}</Td>
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
