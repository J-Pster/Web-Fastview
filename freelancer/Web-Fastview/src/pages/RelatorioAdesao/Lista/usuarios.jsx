import { useState, useEffect } from "react";
import axios from "axios";
import Td from "../../../components/body/table/tbody/td";
import Tr from "../../../components/body/table/tr";
import Loader from "../../../components/body/loader";
import Icon from "../../../components/body/icon";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Usuarios({ itemsThead, sistema_id, lojas_id, empreendimentos_id, regional_id, month, year, emp_id, callback }) {

    //ESTADOS
    const [usuarios, setUsuarios] = useState();
    const [loading, setLoading] = useState(true);
    const [showUser, setShowUser] = useState();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // GET USUARIOS
    function get_usuarios(reload) {
        if (reload) {
            setHasMore(true);
            setPage(1);
        }
        axios({
            method: 'get',
            url: window.backend + '/api/v1/adesao/relatorios/usuarios',
            params: {
                // grupo_id : window.rs_id_grupo,
                sistema_id: sistema_id,
                lojas: lojas_id,
                empreendimentos: empreendimentos_id ? empreendimentos_id : [emp_id],
                regional: regional_id,
                year: year,
                page: reload ? 1 : page,
            }
        }).then(({ data }) => {
            setLoading(false);

            if (reload) {
                setUsuarios(data.data);
                setPage(2);
            } else {
                setUsuarios(usuarios => [...usuarios, ...data.data]);
                setPage(page + 1);
            }

            if (callback) {
                callback({
                    empreendimento_id: emp_id
                })
            }
        });
    }
    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR PARA ABRIR
    useEffect(() => {
        get_usuarios();
    }, [emp_id, sistema_id, lojas_id, empreendimentos_id, regional_id, month, year]);

    return (
        <>{
            usuarios?.length > 0 && itemsThead ?
                //PRA NÃO QUEBRAR A TELA
                <Tr>
                    <Td colspan="100%" className="p-0 mw-none">
                        <div id="container_lojas">
                            {
                                <InfiniteScroll
                                    dataLength={15 * page}
                                    hasMore={hasMore}
                                    next={() => get_usuarios(false)}
                                    className="w-100"
                                    scrollableTarget={'container_usuarios'}
                                >
                                    {usuarios?.length > 0 && itemsThead &&
                                        usuarios?.map((item, i) => {
                                            return (
                                                <>
                                                    <Tr
                                                    //disabled={showUser === null ? false : showUser === item.id ? false : true}
                                                    >
                                                        {/* <Td> grupo </Td> */}
                                                        <Td className="pl-4">
                                                            {item.nome}
                                                            {/* <Icon
                                            type={ showUser === item.id ? 'chevron-up' : 'chevron-down'}
                                            title={false}
                                            // readonly={true}
                                            onClick={() => setShowUser(showUser === item.id ? null : item.id)}
                                        /> */}
                                                        </Td>
                                                        {itemsThead.map((th, index) => (
                                                            <Td key={index}
                                                            //className={th.nome === '%Meta'}
                                                            // align="center"
                                                            >
                                                                {th.index === 'venda' || th.index === 'promedio_valor_venda_item' || th.index === 'promedio_item_venda' ?
                                                                    `R$ ${item[th.index]}` :
                                                                    th.index === 'porcentagem_concluido' ? `${item[th.index]}%` :
                                                                        item[th.index]}
                                                            </Td>
                                                        ))}
                                                    </Tr>
                                                </>
                                            )
                                        })}
                                    {hasMore &&
                                        <Td>
                                            <Loader show={true} />
                                        </Td>
                                    }
                                </InfiniteScroll>
                            }
                        </div>
                    </Td>
                </Tr>
                : <Tr>Nenhum usuário encontrado</Tr>
        }

        </>
    )
}