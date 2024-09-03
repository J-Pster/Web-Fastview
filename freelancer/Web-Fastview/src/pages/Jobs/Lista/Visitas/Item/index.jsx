import { useState } from "react";

import axios from "axios";
import Icon from "../../../../../components/body/icon";
import Td from "../../../../../components/body/table/tbody/td";
import Tr from "../../../../../components/body/table/tr";
import Loader from "../../../../../components/body/loader";

export default function Item({item, tipo, filter_date_start, filter_date_end, callback, active}){
    // ESTADOS
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [lojas, setLojas] = useState([]);

    // VARIÁVEIS
    let porc_1 = (item?.qtd_finalizado && item?.qtd_total ? (((item?.qtd_finalizado / item?.qtd_total) * 100).toFixed(0)) : 0);
    let porc_2 = (item?.qtd_checklist_finalizado && item?.qtd_checklist_total ? (((item?.qtd_checklist_finalizado / item?.qtd_checklist_total) * 100).toFixed(0)) : 0);
    let className_aux_1 = (porc_1 < 70 ? 'text-danger' : 'text-success');
    let className_aux_2 = (porc_1 < 70 ? 'text-danger' : 'text-success');

    // TIPO 1 = LOJA
    // TIPO 2 = SUPERVISOR

    function get_lojas(id_usuario){
        if(tipo === 2){
            if(show){
                setShow(false);
                setTimeout(() => {
                    setLoading(true);
                },100);

                // MANDA ID ATIVO PRO COMPONENTE PAI
                if(callback){
                    callback('');
                }
            }else{
                if(id_usuario){
                    setShow(true);

                    axios({
                        method: 'get',
                        url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Dashboard&do=getVisit',
                        params: {
                            filter_id_user: id_usuario,
                            filter_date_start: filter_date_start,
                            filter_date_end: filter_date_end,
                            filter_type: 'store'
                        }
                    }).then((response) => {
                        setLoading(false);
                        
                        if(response?.data?.data){
                            setLojas(response?.data?.data);
                        }
                    });

                    // MANDA ID ATIVO PRO COMPONENTE PAI
                    if(callback){
                        callback(id_usuario);
                    }
                }
            }
        }
    }

    return(
        <>
            <Tr disabled={(active === item?.id_usuario || active === '' ? false : true)}>
                {(tipo === 1 ?
                    <Td>{(item?.id_filial ? 'Filial '+item?.id_filial+' - '+item?.loja : item?.loja)}</Td>
                :<></>)}

                <Td overflow="visible" disableView={false}>
                    {(item?.usuario ?
                        <div className={'d-flex align-items-center justify-content-between '+(tipo === 2 ? 'cursor-pointer' : '')} onClick={() => get_lojas(item?.id_usuario)}>
                            {item?.usuario}

                            {(tipo === 2 ?
                                <Icon type={(show ? 'chevron-up' : 'chevron-down')} />
                            :'')}
                        </div>
                    :'-')}
                </Td>

                <Td>{item?.empreendimento}</Td>
                <Td align="center">{item?.qtd_total}</Td>
                <Td align="center">{item?.qtd_finalizado}</Td>
                <Td align="center" className={className_aux_1}>{porc_1}%</Td>
                <Td align="center">{item?.qtd_checklist_total}</Td>
                <Td align="center">{item?.qtd_checklist_finalizado}</Td>
                <Td align="center" className={className_aux_2}>{porc_2}%</Td>
                <Td align="center">{item?.qtd_avulsa}</Td>
            </Tr>

            {(show ? 
                (loading ? 
                    <Tr>
                        <Td colspan="100%" align="center" overflow={'visible'}>
                            <Loader />
                        </Td>
                    </Tr>
                :
                    lojas.map((item, i) => {
                        return(
                            <Tr key={'visita_'+item?.id_usuario+'_'+item?.id_loja+'_'+i}>
                                <Td className="ps-5" disableView={false}>{(item?.id_filial ? 'Filial '+item?.id_filial+' - '+item?.loja : item?.loja)}</Td>            
                                <Td>{item?.empreendimento}</Td>
                                <Td align="center">{item?.qtd_total}</Td>
                                <Td align="center">{item?.qtd_finalizado}</Td>
                                <Td align="center" className={className_aux_1}>{porc_1}%</Td>
                                <Td align="center">{item?.qtd_checklist_total}</Td>
                                <Td align="center">{item?.qtd_checklist_finalizado}</Td>
                                <Td align="center" className={className_aux_2}>{porc_2}%</Td>
                                <Td align="center">{item?.qtd_avulsa}</Td>
                            </Tr>
                        )
                    })
                )
            :<></>)}
        </>
    )
}