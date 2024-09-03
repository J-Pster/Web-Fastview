import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import './css/style.scss';
import icon from './images/icon.png';
import { JobsProvider } from "../../../context/Jobs";
import AtualizacaoCadastral from '../../../components/body/atualizacaoCadastral';
import { AuthContext } from '../../../context/Auth';
import { orderBy } from "lodash";
import { GlobalContext } from "../../../context/Global";
import Ferias from "../../../components/body/ferias";

export default function Home2(){
    // AUTH CONTEXT
    const { authInfo } = useContext(AuthContext);

     // CONTEXT GLOBAL
     const { handleSetFilterModule } = useContext(GlobalContext);

    // ESTADOS
    const [showSystems, setShowSystems] = useState(false);

    // NAVIGATE
    const navigate = useNavigate();

    // SE NÃO VIER DADO DO AUTH 
    if(!authInfo){  
        navigate('/');
    }

    // TIMEOUT PARA EXIBIR OS SISTEMAS PARA CORRIGIR BUG DA HOME DO JOBS QUE POSSUI UM REDIRECIONAMENTO
    useEffect(() => {
        setTimeout(() => {
            setShowSystems(true);
        },500);
    },[]);

    // SE NÃO VIER DADO DO AUTH 
    function handleNavigate(url, sistema_id, id_apl, permissao, pus){  
        // CASO O SISTEMA_ID SEJA DA "MANUTENÇÃO" CRAVA O 275 DA MADNEZZ
        if(sistema_id == global.sistema.manutencao){
            sistema_id = 275;
        }
        
        sessionStorage.setItem('sistema_id', sistema_id);
        sessionStorage.setItem('id_apl', (id_apl ? id_apl : ''));
        sessionStorage.setItem('permission_apl', permissao);
        sessionStorage.setItem('pus', pus);

        window.rs_sistema_id = sessionStorage.getItem('sistema_id');
        window.rs_id_apl = sessionStorage.getItem('id_apl');
        window.rs_permission_apl = sessionStorage.getItem('permission_apl');

        document.getElementById('page_title').innerHTML = global?.client_name;    

        handleSetFilterModule(''); // RESETA FILTRO DE MÓDULO

        navigate(url);
    }

    if(showSystems){
        return(
            <JobsProvider chamados={true}>
                {/* MODAL DE ATUALIZAÇÃO CADASTRAL (NOVO FORMATO CARREFOUR) */}
                <AtualizacaoCadastral />
                
                { global.client == 'fastview' ? <Ferias /> : null }

                <div className={'home_box_container'}>
                    {orderBy(authInfo?.acessos.filter((elem) => !elem.nome.includes('Desenvolvimento')), 'nome').map((item, i) => {
                        let link_aux = item?.url;
                        let manutencao = false;

                        if(item.id !== 33 && item.id !== 57 && item.id !== 61 && item.id !== 70 && item.id !== 256){
                                
                            // A FAMOSA GAMBIARRA PRA REMOVER OS SISTEMAS ANTIGOS DA FASTVIEW E MALLTECH ENQUANTO AINDA ESTÃO USANDO
                            if(global.client !== 'fastview' || (global.client === 'fastview' && item.id !== 223 && item.id !== 231 && item.id !== 230)){
                                if(global.client !== 'malltech' || (global.client === 'malltech' && item.id !== 221 && item.id !== 223 && item.id !== 224)){
                                    link_aux = link_aux?.replace('/v2','');

                                    // AJUSTA LINK DA NEWS PARA A FASTVIEW
                                    if(item?.id == 188){
                                        link_aux = 'systems/news'
                                    }

                                    return(
                                        <div
                                            key={item.id}
                                            className={'home_box_item'}
                                        >
                                            {(link_aux.includes('http') || manutencao ? // SE O LINK LINK FOR EXTERNO ABRE EM NOVA GUIA
                                                <a href={link_aux} target="_blank">
                                                    <img src={icon} alt={item.nome} className={'home_box_item_icon'} />
                                                    <span className={'home_box_item_txt'}>
                                                        {item.nome} 
                                                    </span>
                                                </a>
                                            :
                                                <div onClick={() => handleNavigate(link_aux, (item?.id_aux ? item?.id_aux : item?.id), item?.id_apl, item?.usuario_permissao, item?.pus)}>
                                                    <img src={icon} alt={item.nome} className={'home_box_item_icon'} />
                                                    <span className={'home_box_item_txt'}>
                                                        {item.nome} 
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                            }
                        }
                    })}
                </div>
            </JobsProvider>
        )
    }
}
