import { useEffect, useState, useContext } from "react";
import { ChecklistContext } from "../../../context/Checklist";

import Table from "../../../components/body/table";
import Row from "../../../components/body/row";
import Col from "../../../components/body/col";
import Thead from '../../../components/body/table/thead';
import Tbody from '../../../components/body/table/tbody';
import Tr from '../../../components/body/table/tr';
import Th from '../../../components/body/table/thead/th';
import Td from '../../../components/body/table/tbody/td';
import Filter from "../Filter";
import Item from "./Item";
import { cd, get_date } from "../../../_assets/js/global";
import Container from "../../../components/body/container";

export default function Macro({ icons, filters }) {
    // CONTEXT
    const { filterLoja, filterStatus, filterStatusSupervisor, filterSupervisao, filterDateMonth, filterEmpreendimento, filterDate } = useContext(ChecklistContext);

    // ESTADOS
    const [firstLoad, setFirstLoad] = useState(true);
    const [days, setDays] = useState(0);
    const [lojas, setLojas] = useState('');
    const [reload, setReload] = useState(0);

    // GET LISTA
    const handleSetLojas = (e) => {
        setLojas(e);
    }

    // DIAS DO MÊS
    var daysCount = []
    useEffect(() => {
        var count = 1;
        var daysMonth = get_date('last_date', cd(filterDateMonth)).slice(0, 2);

        while (daysCount.length < daysMonth) {
            daysCount.push(count);
            count++;
        }

        setDays(daysCount);
    }, [filterDateMonth]);

    // RELOAD RELATÓRIO
    useEffect(() => {
        setLojas([]);

        if(filterSupervisao){
            setReload(Math.random() * 100);
        }
    },[filterEmpreendimento, filterLoja, filterStatus, filterStatusSupervisor, filterSupervisao, filterDate, filterDateMonth]);


    // MANDA OS FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons('');
        }

        if (filters) {
            filters(
                <Filter actions={false} relatorio={true} />
            )
        }
    }, []);

    // RELOAD TABLE
    const handleSetReload = (e) => {
        if(e){
            setReload(Math.random());
        }
    }

    return (
        <Container>
            {/* RELATÓRIO */}
            {(filterSupervisao ?
                <Row>
                    <Col lg={12}>
                        <Table
                            id="lista_dias"
                            api={window.backend+'/api/v1/checklists/supervisao/lojas/fotos/macro'}
                            params={{
                                data: get_date('date_sql', cd(filterDateMonth))?.slice(0,7),
                                checklists: filterSupervisao,
                                lojas: filterLoja,
                                empreendimentos: filterEmpreendimento,
                                foto_status: filterStatus,
                                avaliacao_status: filterStatusSupervisor,
                            }}
                            pages={true}
                            onLoad={handleSetLojas}
                            leftFixed={true}
                            reload={reload}
                            key_aux={['data']}
                        >
                            <Thead>
                                <Tr>
                                    <Th>Loja</Th>
                                    {(days.length ?
                                        (days.map((day, i) => {
                                            return (
                                                <Th
                                                    key={'day_' + i}
                                                    width={1}
                                                    align="center">{day}
                                                </Th>
                                            )
                                        }))
                                        :
                                        <></>
                                    )}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(lojas.length ?
                                    (lojas.map((loja, i) => {
                                        return (
                                            <Tr
                                                key={loja?.id}
                                            >
                                                <Td>{loja?.nome}</Td>

                                                {(days.length ?
                                                    (days.map((day, i) => {
                                                        let type, readonly, className, title;
                                                        let reprovado = false;
                                                        let avaliado = true;

                                                        if(loja?.checklists?.[day]){
                                                            let item = loja?.checklists?.[day];

                                                            item?.map((foto, i) => {
                                                                if(!foto?.double_check){
                                                                    avaliado = false;
                                                                }
                                                            });

                                                            if(avaliado){
                                                                item?.map((foto, i) => {
                                                                    if(foto?.double_check == 2){
                                                                        reprovado = true;
                                                                    }
                                                                });
                                                            }

                                                            if (reprovado) {
                                                                type = 'reprovar2';
                                                                className = 'text-danger';
                                                                title = 'Uma ou mais fotos inconforme(s)';
                                                            } else {
                                                                type = 'check';
                                                                if (avaliado) {
                                                                    className = 'text-success';
                                                                    title = 'Fotos em conformidade';
                                                                } else {
                                                                    className = 'text-primary';
                                                                    title = 'Foto(s) registrada(s), aguardando avaliação';
                                                                }
                                                            }
                                                            readonly = false;

                                                            console.log('item: ',item);

                                                            return(
                                                                <Td
                                                                    key={item?.id}
                                                                    width={1}
                                                                    align="center"
                                                                >
                                                                    <Item
                                                                        modalTitle={loja?.nome + ' - ' + item[0]?.checklist}
                                                                        type={type}
                                                                        readonly={readonly}
                                                                        className={className}
                                                                        title={title}
                                                                        loja={loja?.id}
                                                                        day={item?.date_day}
                                                                        month={item?.resposta_data?.slice(6,8)}
                                                                        year={item?.resposta_data?.slice(0,4)}
                                                                        items={item}
                                                                        callback={handleSetReload}
                                                                    />
                                                                </Td>
                                                            )
                                                        }else{
                                                            return(
                                                                <Td
                                                                    // key={item?.id}
                                                                    width={1}
                                                                    align="center"
                                                                >
                                                                    <Item
                                                                        type={'reprovar2'}
                                                                        readonly={true}
                                                                        className={'text-secondary'}
                                                                        title="Foto não registrada"
                                                                    />
                                                                </Td>
                                                            )
                                                        }
                                                    }))
                                                    :
                                                    <></>
                                                )}
                                                
                                                {/* {(loja?.checklists?.map((dia, i) => {
                                                    let type, readonly, className, title;
                                                    let reprovado = false;
                                                    let avaliado = false;

                                                    // if (dia.length > 0) {
                                                    //     dia.cards.map((card, i) => {
                                                    //         if (card.double_check) {
                                                    //             avaliado = true;

                                                    //             if (Number(card.qtd_reprovado_check) >= 1) {
                                                    //                 reprovado = true;
                                                    //             }
                                                    //         } else {
                                                    //             avaliado = false;
                                                    //         }
                                                    //     })
                                                    // }

                                                    if (dia.length > 0) {
                                                        // if (reprovado) {
                                                        //     type = 'reprovar2';
                                                        //     className = 'text-danger';
                                                        //     title = 'Uma ou mais fotos inconforme(s)';
                                                        // } else {
                                                        //     type = 'check';
                                                        //     if (avaliado) {
                                                        //         className = 'text-success';
                                                        //         title = 'Fotos em conformidade';
                                                        //     } else {
                                                        //         className = 'text-primary';
                                                        //         title = 'Foto(s) registrada(s), aguardando avaliação';
                                                        //     }
                                                        // }
                                                        // readonly = false;
                                                    } else {
                                                        // type = 'reprovar2';
                                                        // readonly = true;
                                                        // className = 'text-secondary';
                                                        // title = 'Foto não registrada';
                                                    }

                                                    return (
                                                        <Td
                                                            key={dia.date}
                                                            width={1}
                                                            align="center"
                                                        >
                                                            <Item
                                                                modalTitle={loja.title + ' - ' + dia.title}
                                                                type={type}
                                                                readonly={readonly}
                                                                className={className}
                                                                title={title}
                                                                loja={loja.id_lja}
                                                                day={dia.date.slice(8, 11)}
                                                                month={dia.date.slice(5, 7)}
                                                                year={dia.date.slice(0, 4)}
                                                                // callback={handleSetReload}
                                                            />
                                                        </Td>
                                                    )
                                                }))} */}
                                            </Tr>
                                        )
                                    }))
                                    :
                                    <></>
                                )}
                            </Tbody>
                        </Table>
                    </Col>
                </Row>
                : '')}
        </Container>
    )
}
