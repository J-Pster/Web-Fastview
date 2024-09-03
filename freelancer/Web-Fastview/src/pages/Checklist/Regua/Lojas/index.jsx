import { Fragment, useEffect, useState } from "react";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import axios from "axios";
import Icon from "../../../../components/body/icon";
import Usuarios from "../Usuarios";
import Loader from "../../../../components/body/loader";
import { cd, get_date } from "../../../../_assets/js/global";

export default function Lojas({empreendimento, filters}){
    // ESTADOS
    const [secoes, setSecoes] = useState(null);
    const [items, setItems] = useState([]);
    const [show, setShow] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET SEÇÕES
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.host+'/systems/checklist/api/lista.php',
            params: {
                do: 'getHorizontalList',
                id_checklist: 6528, // Réguas - 2024
                filter_type: 'store',
                filter_id_enterprise: empreendimento,
                filter_year_month: get_date('date_sql', cd(filters?.filterDate))?.slice(0,7)
            }
        }).then((response) => {
            if(response?.data?.checklist[0]?.secao){
                setSecoes(response?.data?.checklist[0]?.secao);
            }
        });
    },[]);

    // GET ITEMS
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/lojas',
            params: {
                filter_id_enterprise: [empreendimento],
                ativo: [1]
            }
        }).then((response) => {
            if(response?.data?.data){
                setItems(response?.data?.data);
            }

            setLoading(false);
        });
    },[]);

    // EXIBE/OCULTA USUÁRIOS
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
                        <Fragment key={'loja_'+item?.id}>
                            <Tr>
                                <Td cursor="pointer" onClick={() => handleShow(item?.id)} disableView={false}>
                                    <div className={'d-flex align-items-center justify-content-between'} style={{paddingLeft: 30}}>
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
                                            let filter_loja = pergunta?.resposta?.filter((elem) => elem?.id_loja == item?.id);

                                            if(filter_loja.length == 0){
                                                return(
                                                    <Td align="center">0</Td>
                                                )
                                            }else{
                                                return(
                                                    filter_loja?.map((resposta, i) => {
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
                                <Usuarios
                                    loja={item?.id}
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