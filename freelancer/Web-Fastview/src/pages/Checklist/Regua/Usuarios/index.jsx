import { Fragment, useEffect, useState } from "react";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import axios from "axios";
import Loader from "../../../../components/body/loader";
import { cd, get_date } from "../../../../_assets/js/global";

export default function Usuarios({loja, filters}){
    // ESTADOS
    const [secoes, setSecoes] = useState(null);
    const [items, setItems] = useState([]);
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
                filter_type: 'user',
                filter_search_loja_id: [loja],
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
                                        secao?.pergunta?.map((pergunta, i) => {
                                            let filter_usuario = pergunta?.resposta?.filter((elem) => elem?.id_usuario == item?.id);

                                            if(filter_usuario.length == 0){
                                                return(
                                                    <Td align="center">0</Td>
                                                )
                                            }else{
                                                return(
                                                    filter_usuario?.map((resposta, i) => {
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
                        </Fragment>
                    )
                })
            )
        }
    }
}