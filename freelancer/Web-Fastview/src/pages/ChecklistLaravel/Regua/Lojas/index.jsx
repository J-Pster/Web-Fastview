import { Fragment, useEffect, useState } from "react";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import axios from "axios";
import Icon from "../../../../components/body/icon";
import Usuarios from "../Usuarios";
import Loader from "../../../../components/body/loader";
import { cd, get_date } from "../../../../_assets/js/global";

export default function Lojas({empreendimento, filters, secoesAux}){
    // ESTADOS
    const [secoes, setSecoes] = useState(secoesAux);
    const [items, setItems] = useState([]);
    const [show, setShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lojas, setLojas] = useState([]);

    // GET SEÇÕES
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.backend + '/api/v1/checklists/regua/lojas',
            params: {
                id_checklist: 6528, // Réguas - 2024
                filter_year_month: get_date('date_sql', cd(filters?.filterDate))?.slice(0,7),       
                empreendimentos: [empreendimento]
            }
        }).then((response) => {
            if(response?.data?.lojas){
                setLojas(response?.data?.lojas);
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
                                        secao?.perguntas?.map((pergunta, i) => {
                                            let filter_loja = (lojas?.filter((elem) => elem?.id == item?.id)[0] ?? []);    
                                            let filter_pergunta = (filter_loja?.perguntas?.filter((pergunta2) => pergunta2?.pergunta_id == pergunta?.id)[0] ?? []);

                                            return(
                                                <Td
                                                    key={'resposta_'+(filter_pergunta?.pergunta_id ?? pergunta.id)}
                                                    align="center"
                                                >
                                                    {Math.round(filter_pergunta?.media_pontos ?? 0)}
                                                </Td>
                                            )
                                            
                                        })
                                    )
                                })}
                            </Tr>

                            {(show?.includes(item?.id) &&
                                <Usuarios
                                    secoesAux={secoes}
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