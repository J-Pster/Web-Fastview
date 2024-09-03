import { useEffect, useState } from 'react';
import style from '../style.module.scss';
import axios from 'axios';
import Empreendimento from './Empreendimento';
import Loader from '../../../components/body/loader';

export default function Sidebar({handleFilterLoja, handleFilterEmpreendimento, filtroLoja, filtroRede, sistema_id}){
    // ESTADOS
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET EMPREENDIMENTOS
    function get_empreendimentos(){
        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/grupo-empreendimento'
        }).then((response) => {
            if(response?.data?.data){
                if(response.data.data.length > 0){
                    setEmpreendimentos(response.data?.data);
                }else{
                    setEmpreendimentos([{id: window.rs_id_emp, nome: window.rs_name_emp}]);
                }
            }

            setLoading(false);
        });
    }

    // CHAMA A FUNÇÃO DE GET EMPREENDIMENTOS AO ENTRAR NA PÁGINA
    useEffect(() => {
        get_empreendimentos();
    },[]);

    return(
        <ul className={style.sidebar}>
            {(loading ?
                <Loader />
            :
                (empreendimentos.map((item, i) => {
                    return(
                        <Empreendimento
                            key={'empreendimento_'+item?.id}
                            item={item}
                            handleFilterLoja={handleFilterLoja}
                            handleFilterEmpreendimento={handleFilterEmpreendimento}
                            filtroLoja={filtroLoja}
                            filtroRede={filtroRede}
                            sistema_id={sistema_id}
                        />
                    )
                }))
            )}
        </ul>
    )
}
