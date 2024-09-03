import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../../components/body/loader";
import Icon from "../../../../components/body/icon";
import Usuario from "../Usuario";

export default function Loja({item,handleFilterLoja, filtroLoja, sistema_id}){

    // ESTADOS
    const [usuarios, setUsuarios] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    // GET USUÁRIOS
    function get_usuarios(){
        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/usuarios',
            params: {
                sistema_id: sistema_id,
                filter_search_loja_id: [item?.id]
            }
        }).then((response) => {
            if(response.data){
                setUsuarios(response.data?.data);
            }

            setLoading(false);
        });
    }

    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR PARA ABRIR
    useEffect(() => {
        if(filtroLoja && usuarios.length == 0){
            get_usuarios();
        }
    },[filtroLoja]);

    return(
        <li>
            <span className={(filtroLoja === item.value  ? 'text-primary' : '') + ' cursor-pointer'} onClick={() => (setShow(!show), handleFilterLoja(filtroLoja === item.value ? null : item.value))}>
                {item.nome}

                {/* <Icon
                    type={filtroLoja === item.value  ? 'chevron-up' : 'chevron-down'}
                    title={false}
                    readonly={true}
                /> */}
            </span>

            {/* {filtroLoja === item.value  ?
                (loading ?
                    <Loader />
                :
                    <ul style={{paddingLeft:40}}>
                        {(usuarios.length > 0 ?
                            usuarios.map((item, i) => {
                                return(
                                    <Usuario
                                        key={'usuario_'+item?.id}
                                        item={item}
                                    />
                                );
                            })
                        :
                            <li>
                                <span className="text-secondary">
                                    Nenhum usuário
                                </span>
                            </li>
                        )}
                    </ul>
                )
            :''} */}            
        </li>
    )
}
