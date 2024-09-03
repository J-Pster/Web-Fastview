import { useState, useEffect } from "react";
import axios from "axios";
import Td from "../../../components/body/table/tbody/td";
import Tr from "../../../components/body/table/tr";
import Loader from "../../../components/body/loader";
import Icon from "../../../components/body/icon";
import style from '../style.module.scss';
import Usuarios from "./usuarios";
import InfiniteScroll from "react-infinite-scroll-component";
import Tbody from "../../../components/body/table/tbody";
import Table from "../../../components/body/table";

export default function Lojas({ itemsThead, sistema_id, lojas_id, empreendimentos_id, regional_id, date, month, year, emp_id, callback }) {
    //ESTADOS
    const [lojas, setLojas] = useState();
    const [loading, setLoading] = useState(true);
    const [showUser, setShowUser] = useState();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // GET LOJAS
    function get_lojas(reload) {
        if (reload) {
            setHasMore(true);
            setPage(1);
        }

        axios({
            method: 'get',
            url: window.backend + '/api/v1/adesao/relatorios/lojas',
            params: {
                // grupo_id : window.rs_id_grupo,
                sistema_id: sistema_id,
                lojas: lojas_id,
                empreendimentos: empreendimentos_id ? empreendimentos_id : [emp_id],
                regional: [regional_id],
                date: date,
                month: month,
                year: year,
                page: reload ? 1 : page,
            }
        }).then(({ data }) => {
            setLoading(false);

            if (reload) {
                setLojas(data.data);
                setPage(2);
            } else {
                setLojas(lojas => [...lojas, ...data.data]);
                setPage(page + 1);
            }

            if(!data?.links?.next){
                setHasMore(false);
            }

            if (callback) {
                callback({
                    supervisor_id: regional_id
                })
            }
        });
    }
    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR PARA ABRIR
    useEffect(() => {
        get_lojas(true);
    }, [emp_id, sistema_id, lojas_id, empreendimentos_id, regional_id, month, year]);

    return (
        <Tr>
            <Td colspan="100%" className="p-0 mw-none">
                <div id="container_lojas">
                    {
                        <InfiniteScroll
                            dataLength={15 * page}
                            hasMore={hasMore}
                            next={() => get_lojas(false)}
                            className="w-100"
                            scrollableTarget={'container_lojas'}
                        >
                            <Table text_limit={70} fixed={false}>
                                <Tbody>
                                    {lojas?.length > 0 && itemsThead &&
                                        lojas?.map((item, i) => {
                                            return (
                                                <>
                                                    <Tr
                                                        className={'w-100'}
                                                    //disabled={showUser === null ? false : showUser === item.id ? false : true}
                                                    >
                                                        {/* <Td> grupo </Td> */}
                                                        <Td>
                                                            {/* <span
                                                            className="d-flex align-items-center justify-content-between cursor-pointer"
                                                            onClick={() => setShowUser(showUser === item.id ? null : item.id)}
                                                            > */}
                                                                <span style={{paddingLeft:80}}>{item.nome}</span>
    {/* 
                                                                <Icon
                                                                    type={showUser === item.id ? 'chevron-up' : 'chevron-down'}
                                                                    title={false}
                                                                    // readonly={true}
                                                                    onClick={() => setShowUser(showUser === item.id ? null : item.id)}
                                                                />
                                                            </span> */}
                                                        </Td>
                                                        {itemsThead.map((th, index) => (
                                                            <Td
                                                                key={'loja_'+index}
                                                                align="center"
                                                                width={150}
                                                            >
                                                                {item[th.index]}
                                                            </Td>
                                                        ))}
                                                    </Tr>

                                                    {showUser === item.id ?
                                                        <Usuarios
                                                            itemsThead={itemsThead}
                                                            sistema_id={sistema_id}
                                                            lojas_id={lojas_id}
                                                            empreendimentos_id={empreendimentos_id}
                                                            regional_id={regional_id}
                                                            month={month}
                                                            year={year}
                                                            callback={callback}
                                                        /> : <></>}

                                                </>
                                            )
                                        })
                                    }
                                    {hasMore &&

                                        <Td colspan="100%">
                                            <Loader show={true} />
                                        </Td>
                                    }
                                </Tbody>
                            </Table>
                        </InfiniteScroll>
                    }
                </div>
            </Td>
        </Tr>
    )
}