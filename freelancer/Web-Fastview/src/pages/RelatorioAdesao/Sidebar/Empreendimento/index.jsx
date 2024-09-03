import { useEffect, useState } from "react";
import axios from "axios";
import Loja from "../Loja";
import Icon from '../../../../components/body/icon';
import Loader from "../../../../components/body/loader";
import Button from "../../../../components/body/button";

export default function Empreendimento({item,handleFilterLoja, handleFilterEmpreendimento, filtroLoja, filtroRede, sistema_id}){
    // ESTADOS
    const [lojas, setLojas] = useState([]);
    const [show, setShow] = useState(item?.id == window.rs_id_emp ? true : false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingButton, setLoadingButton] = useState(false);

    // GET LOJAS
    function get_lojas(reload){
        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/lojas',
            params: {
                sistema_id: sistema_id,
                filter_id_enterprise: [item?.id],
                page: page
            }
        }).then((response) => {
            if(response.data){
                if(page === 1 || reload){
                    setLojas(response.data?.data);
                }else{
                    setLojas(lojas => [...lojas, ...response.data.data])
                }
            }

            setLoading(false);
            setLoadingButton(false);
        });
    }

    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR PARA ABRIR
    useEffect(() => {
        if(filtroRede){
            get_lojas(true);
            setPage(1);
        }
    },[filtroRede]);

    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR EM VER MAIS
    useEffect(() => {
        if(page > 1){
            get_lojas();
        }
    },[page]);
    
    return(
        <li>
            <span className={(filtroRede === item.value ? 'text-primary' : '') + ' cursor-pointer'} onClick={() => (setShow(!show), handleFilterEmpreendimento( filtroRede === item.value ? null : item.value))}>
                {item.nome}

                <Icon
                    type={filtroRede === item.value  ? 'chevron-up' : 'chevron-down'}
                    title={false}
                    readonly={true}
                />
            </span>

            {filtroRede === item.value  ?
                (loading ?
                    <Loader className="mt-2" />
                :
                <>
                    <ul style={{paddingLeft:20}}>
                        {(lojas.length > 0 ?
                            lojas.map((item, i) => {
                                return(
                                    <Loja
                                        key={'loja_'+item?.id}
                                        item={item}
                                        handleFilterLoja={handleFilterLoja}
                                        filtroLoja={filtroLoja}   
                                        sistema_id={sistema_id}                                  
                                    />
                                );
                            })
                        :
                            <li>
                                <span className="text-secondary">
                                    Nenhuma loja
                                </span>
                            </li>
                        )}
                    </ul>
                    <div className="text-center my-3">
                        <Button status={loadingButton ? 'loading' : ''} onClick={()=> setPage(page+1)} >Ver Mais</Button>
                    </div>
                </>
                )
            :''}
        </li>
    )
}
