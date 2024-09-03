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
import Lojas from "./lojas";

export default function Supervisores({ itemsThead, sistema_id, lojas_id, empreendimentos_id, regional_id, date, month, year, emp_id, callback }) {
    //ESTADOS
    const [lojas, setLojas] = useState();
    const [loading, setLoading] = useState(true);
    const [showUser, setShowUser] = useState(null);
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
            url: window.backend + '/api/v1/adesao/relatorios/supervisores',
            params: {
                // grupo_id : window.rs_id_grupo,
                sistema_id: sistema_id,
                lojas: lojas_id,
                empreendimentos: empreendimentos_id ? empreendimentos_id : [emp_id],
                regional: regional_id,
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
                    supervisor_id: showUser
                })
            }
        });
    }
    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR PARA ABRIR
    useEffect(() => {
        get_lojas(true);
    }, [emp_id, sistema_id, lojas_id, empreendimentos_id, regional_id, month, year]);

    // EXIBE/OCULTA LOJAS E MANDA INFORMAÇÃO PRO COMPONENTE PAI
    function handleShowStore(id){
        setShowUser(showUser === id ? null : id);

        // if(callback){
        //     callback({
        //         supervisor_id: showUser ? showUser : null
        //     })
        // }
    }

    // CALLBACK DAS LOJAS
    const handleCallbackStore = (e) => {
        if(e?.supervisor_id){
            // PEGA TOP DO ELEMENTO CLICADO
            let top = document.getElementById('sup_'+e?.supervisor_id).offsetTop + 2;

            setTimeout(() => { // TEMPO MÍNIMO PARA RENDERIZAR OS ITENS NA TELA
                document.getElementById('container_supervisores').scrollTop = top;
                

                setTimeout(() => { // TEMPO ATÉ TERMINAR O SCROLL
                    document.getElementById('container_supervisores').style.overflow = 'hidden';
                },200);
            },100);    
        }else{
            document.getElementById('container_supervisores').style.overflow = 'auto';
        }
    }

    return (
        <Tr>
            <Td colspan="100%" className="p-0 mw-none">
                <div id="container_supervisores" style={{scrollBehavior: 'smooth'}}>
                    {
                        <InfiniteScroll
                            dataLength={15 * page}
                            hasMore={hasMore}
                            next={() => get_lojas(false)}
                            className="w-100"
                            scrollableTarget={'container_supervisores'}
                        >
                            <Table
                                fixed={false}
                                text_limit={90}
                            >
                                <Tbody>
                                    {lojas?.length > 0 && itemsThead &&
                                        lojas?.map((item, i) => {
                                            return (
                                                <>
                                                    <Tr
                                                        disabled={showUser === null ? false : showUser === item?.id ? false : true}
                                                        id={'sup_'+item?.id}
                                                    >
                                                        {/* <Td> grupo </Td> */}
                                                        <Td>
                                                            <span
                                                                className="d-flex align-items-center justify-content-between cursor-pointer"
                                                                onClick={() => handleShowStore(item?.id)}
                                                            >
                                                                <span style={{paddingLeft:40}}>{item?.nome}</span>

                                                                <Icon
                                                                    type={showUser === item.id ? 'chevron-up' : 'chevron-down'}
                                                                    title={false}
                                                                    readonly={true}                                                                     
                                                                />
                                                            </span>
                                                        </Td>
                                                        {itemsThead.map((th, index) => (
                                                            <Td
                                                                key={'supervisor_'+index}
                                                                align="center"
                                                                width={150}
                                                            >
                                                                {item[th.index]}
                                                            </Td>
                                                        ))}
                                                    </Tr>

                                                    {showUser === item.id ?
                                                        <Lojas
                                                            itemsThead={itemsThead}
                                                            sistema_id={sistema_id}
                                                            empreendimentos_id={empreendimentos_id}
                                                            regional_id={showUser}
                                                            date={date}
                                                            month={month}
                                                            year={year}
                                                            callback={handleCallbackStore}
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