import { Fragment, useEffect, useState } from "react";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import axios from "axios";
import Loader from "../../../../components/body/loader";
import { cd, get_date } from "../../../../_assets/js/global";

export default function Usuarios({loja, filters, secoesAux}){
    // ESTADOS
    const [secoes, setSecoes] = useState(secoesAux);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);

    // GET SEÇÕES
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.backend + '/api/v1/checklists/regua/usuarios',
            params: {
                id_checklist: 6528, // Réguas - 2024
                lojas: [loja],
                filter_year_month: get_date('date_sql', cd(filters?.filterDate))?.slice(0,7)
            }
        }).then((response) => {
            if(response?.data?.usuarios){
                setUsuarios(response?.data?.usuarios);
            }
        });
    },[]);

    // GET ITEMS
    useEffect(() => {
        setLoading(true);

        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/usuarios',
            params: {
                filter_search_loja_id: [loja],
                ativo: [1]
            }
        }).then((response) => {
            if(response?.data?.data){
                setItems(response?.data?.data);
            }

            setLoading(false);
        });
    },[]);

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
                        <Fragment key={'usuario_'+item?.id}>
                            <Tr>
                                <Td disableView={false}>
                                    <div className={'d-flex align-items-center justify-content-between'} style={{paddingLeft: 60}}>
                                        <span style={{whiteSpace: 'nowrap'}}>{item?.nome}</span>
                                    </div>
                                </Td>

                                {secoes?.map((secao, i) => {
                                    return(
                                        secao?.perguntas?.map((pergunta, i) => {
                                            let filter_usuario = (usuarios?.filter((elem) => elem?.id == item?.id)[0] ?? []);    
                                            let filter_pergunta = (filter_usuario?.perguntas?.filter((pergunta2) => pergunta2?.pergunta_id == pergunta?.id)[0] ?? []);

                                            if(filter_pergunta){
                                                return(
                                                    <Td
                                                        key={'resposta_'+(filter_pergunta?.pergunta_id ?? pergunta.id)}     
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
                        </Fragment>
                    )
                })
            )
        }
    }
}