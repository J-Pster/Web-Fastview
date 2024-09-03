import { Fragment, useEffect, useState } from "react";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import axios from "axios";
import Icon from "../../../../components/body/icon";
import Lojas from "../Lojas";
import Loader from "../../../../components/body/loader";

export default function Empreendimentos({secoes, filters, empreendimentos}){
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
                                        secao?.perguntas?.map((pergunta, i) => {
                                            let filter_empreendimento = (empreendimentos?.filter((elem) => elem?.id == item?.id)[0] ?? []);    
                                            let filter_pergunta = (filter_empreendimento?.perguntas?.filter((pergunta2) => pergunta2?.pergunta_id == pergunta?.id)[0] ?? []);

                                            if(filter_pergunta){
                                                return(
                                                    <Td
                                                        key={'resposta_'+filter_pergunta?.pergunta_id}
                                                        align="center"
                                                    >
                                                        {Math.round(filter_pergunta?.media_pontos ?? 0)}
                                                    </Td>
                                                )
                                            }else{
                                                return(
                                                    <Td align="center">0</Td>
                                                )
                                            }
                                        })
                                    )
                                })}
                            </Tr>

                            {(show?.includes(item?.id) &&
                                <Lojas
                                    secoesAux={secoes}
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