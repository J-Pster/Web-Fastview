import { Fragment, useEffect, useState } from "react";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import axios from "axios";
import Icon from "../../../../components/body/icon";
import Lojas from "../Lojas";
import Loader from "../../../../components/body/loader";

export default function Empreendimentos({secoes, filters}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [show, setShow] = useState([]);
    const [loading, setLoading] = useState(false);

    // GET ITEMS
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/grupo-empreendimento',
            params: {
                ativo: [1]
            }
        }).then((response) => {
            if(response?.data?.data){
                setItems(response?.data?.data);
            }

            setLoading(false);
        });
    },[]);

    // EXIBE/OCULTA LOJAS
    const handleShow = (id) => {
        if(show?.includes(id)){
            setShow(show?.filter((elem) => elem !== id));
        }else{
            setShow(show => [...show, id]);
        }
    }

    if(loading || !secoes){
        return (
            <Tr colspan="100%">
                <Td align="center">
                    <Loader />
                </Td>
            </Tr>
        )
    }else{
        if(items?.length === 0){
            return <Tr empty></Tr>
        }else{
            return(
                items?.map((item, i) => {
                    return(
                        <Fragment key={'empreendimento_'+item?.id}>
                            <Tr>
                                <Td cursor="pointer" onClick={() => handleShow(item?.id)} disableView={false}>
                                    <div className={'d-flex align-items-center justify-content-between'}>
                                        <span style={{whiteSpace: 'nowrap'}}>{item?.nome}</span>

                                        <Icon
                                            type={show?.includes(item?.id) ? 'up' : 'down'}
                                            className="ms-4"
                                            readonly
                                            title={false} 
                                        />
                                    </div>
                                </Td>

                                {secoes?.map((secao, i) => {
                                    return(
                                        secao?.pergunta?.map((pergunta, i) => {
                                            let filter_empreendimento = pergunta?.resposta?.filter((elem) => elem?.id_empreendimento == item?.id);

                                            if(filter_empreendimento.length == 0){
                                                return(
                                                    <Td align="center">0</Td>
                                                )
                                            }else{
                                                return(
                                                    filter_empreendimento?.map((resposta, i) => {
                                                        return(
                                                            <Td
                                                                key={'resposta_'+resposta?.id_relatorio}
                                                                align="center"
                                                            >
                                                                {resposta?.pontos}
                                                            </Td>
                                                        )
                                                    })
                                                )
                                            }
                                        })
                                    )
                                })}
                            </Tr>

                            {(show?.includes(item?.id) &&
                                <Lojas
                                    empreendimento={item?.id}
                                    filters={filters}
                                />
                            )}
                        </Fragment>
                    )
                })
            )
        }
    }
}