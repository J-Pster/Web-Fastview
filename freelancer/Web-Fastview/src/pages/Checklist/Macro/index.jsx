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
    const { filterLoja, filterStatus, filterStatusSupervisor, filterSupervisao, filterDateMonth } = useContext(ChecklistContext);

    // ESTADOS
    const [firstLoad, setFirstLoad] = useState(true);
    const [days, setDays] = useState(0);
    const [lojas, setLojas] = useState('');
    const [reload, setReload] = useState(false);

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
        if (!firstLoad && filterSupervisao) {
            setReload(true);
            setTimeout(() => {
                setReload(false);
            }, 1000);
        }
        if (firstLoad) {
            setFirstLoad(false);
        }
    }, [filterLoja, filterSupervisao, filterStatus, filterStatusSupervisor, filterDateMonth]);

    // RECARREGA RELATÓRIO APÓS AVALIAR ALGUMA FOTO
    const handleSetReload = (e) => {
        if (e) {
            setReload(true);
            setTimeout(() => {
                setReload(false);
            }, 1000);
        }
    }

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

    return (
        <Container>
            {/* RELATÓRIO */}
            {(filterSupervisao ?
                <Row>
                    <Col lg={12}>
                        <Table
                            id="lista_dias"
                            api={window.host+"/systems/"+global.sistema_url.checklist+"/api/lista.php?do=get_list"}                   
                            params={{
                                filter_type: 2,
                                filter_subtype: 'store',
                                filter_date_start: get_date('first_date', cd(filterDateMonth)),
                                filter_date_end: get_date('last_date', cd(filterDateMonth)),
                                filter_checklist_id: [filterSupervisao],
                                filter_store_id: filterLoja,
                                filter_status: filterStatus,
                                filter_status_supervisor: filterStatusSupervisor,
                            }}
                            onLoad={handleSetLojas}
                            leftFixed={true}
                            reload={reload}
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
                                                key={loja.id_lja}
                                            >
                                                <Td>{loja.title}</Td>

                                                {(loja.group.map((dia, i) => {
                                                    let type, readonly, className, title;
                                                    let reprovado = false;
                                                    let avaliado = false;

                                                    if (dia.cards.length > 0) {
                                                        dia.cards.map((card, i) => {
                                                            if (card.double_check) {
                                                                avaliado = true;

                                                                if (Number(card.qtd_reprovado_check) >= 1) {
                                                                    reprovado = true;
                                                                }
                                                            } else {
                                                                avaliado = false;
                                                            }
                                                        })
                                                    }

                                                    if (dia.cards.length > 0) {
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
                                                    } else {
                                                        type = 'reprovar2';
                                                        readonly = true;
                                                        className = 'text-secondary';
                                                        title = 'Foto não registrada';
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
                                                }))}
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
