import { useContext, useState} from 'react';

import style from './Nav.module.scss';
import Item from './item';
import User from '../user';
import { Link, useNavigate  } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth';
import { useEffect } from 'react';
import axios from 'axios';
import { orderBy } from 'lodash';
import { useCookies } from 'react-cookie';
import { GlobalContext } from '../../../context/Global';
import toast from 'react-hot-toast';

export default function Nav(){
    // COOKIES
    const [cookies, setCookie] = useCookies(['template']);

    // AUTH CONTEXT
    const { authInfo } = useContext(AuthContext);

    // CONTEXT GLOBAL
    const { handleSetFilterModule } = useContext(GlobalContext);

    // ESTADOS
    const [menuActive, setMenuActive] = useState(false);

    // NAVIGATE
    const navigate = useNavigate();

    // SE NÃO VIER DADO DO AUTH 
    if(!authInfo){  
        navigate('/');
    }

    var scroll = 0;  
    function scrollNav(scroll){
        var speed = 0;
        var container = document.getElementById('ul-navbar');
        var container_w = container.offsetWidth;
        var max_scroll = container.scrollWidth - container.offsetWidth + 100;

        container.addEventListener('mousemove', (e) => {    
            var mouse_x = e.pageX - container.offsetLeft;
            var mouseperc = 100 * mouse_x / container_w;
            if (mouseperc < 10 || mouseperc > 90) {
                speed = mouseperc - 50;
            } else if (mouseperc > 10 && mouseperc > 90 || mouseperc < 90 && mouseperc > 10) {
                speed = 0;
            }
        });

        container.addEventListener('mouseleave', (e) => {
            speed = 0;
        });    

        function updatescroll() {
            if (speed !== 0) {
                scroll += speed / 5;
                if (scroll < 0) scroll = 0;
                if (scroll > max_scroll) scroll = max_scroll;
                container.scrollLeft = scroll;
            }
            window.requestAnimationFrame(updatescroll);
        }
        window.requestAnimationFrame(updatescroll);
    }
    
    // LOGO EMPREENDIMENTO
    let logo_aux;
    if(authInfo?.empreendimento?.logo){
        logo_aux = window.upload+'/'+authInfo?.empreendimento?.logo;
    }else{
        // DEFINE CLIENTE DE ACORDO COM A URL
        if(global.client === 'fastview'){
            logo_aux = '/logo_fastview.png';
        }else if(global.client === 'malltech'){
            logo_aux = '/logo_malltech.png';
        }else{
            logo_aux = '/logo_malltech.png';
        }
    }

    // SETA INFORMAÇÕES DO SISTEMA CLICADO
    function handleSetSystem(sistema_id, id_apl, permissao, pus){
        if(authInfo?.senha_fraca){ // TROCAR POR "SENHA FRACA"
            toast('Redefina sua senha antes de continuar');
        }else{
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

            document.getElementById('page_title').innerHTML = global?.client_name;

            if(pus){
                window.rs_permission_apl = sessionStorage.getItem('pus');
            }else{
                window.rs_permission_apl = sessionStorage.getItem('permission_apl');
            }

            handleSetFilterModule(''); // RESETA FILTRO DE MÓDULO
            setMenuActive(false);
        }
    }

    useEffect(() => {
        if(sessionStorage.getItem('sistema_id') || sessionStorage.getItem('id_apl') || sessionStorage.getItem('permission_apl')){
            // TOKEN CONFIGURATIONS
            const tokenConfigurations = {            
                sistema_id: sessionStorage.getItem('sistema_id'),
                id_apl: sessionStorage.getItem('id_apl'),
                permission_apl: sessionStorage.getItem('permission_apl'),
                pus: sessionStorage.getItem('pus'),
            }

            global.tokenConfigurations = JSON.stringify(tokenConfigurations);
            
            axios.defaults.headers.common['Tokenconfigurations'] = JSON.stringify(tokenConfigurations);
        }
    },[sessionStorage.getItem('sistema_id'), sessionStorage.getItem('id_apl'), sessionStorage.getItem('permission_apl')]);

    // ATUALIZA SCROLL
    const handleCallback = (e) => {
        if(e){
            let container = document.getElementById('ul-navbar');
            if(container.scrollLeft == 0){
                scrollNav(e.scroll);
                container.scrollLeft = e.scroll;
            }
        }else{
            scrollNav(0);
        }
    }

    // MENU MOBILE
    const handleMenu = () => {
        setMenuActive(!menuActive);
    }

    // LISTA DE SISTEMAS
    let systems_aux = authInfo?.acessos.filter((elem) => elem.nome !== 'Desenvolvimento');

    return(
        <nav
            className={ style.navbar + ' ' + (cookies?.template ? style.with_background : '') }
            style={{backgroundColor: (cookies?.template ? cookies.template : '')}}
        >
            <div className={ style.logo } onClick={() => (navigate('/'), sessionStorage.setItem('sistema_id', 1), document.getElementById('page_title').innerHTML = global?.client_name)}>
                <img src={logo_aux} alt="Logo" />
            </div>
            
            <div className={style.container_menu}>
                <ul id="ul-navbar">
                    {(orderBy(systems_aux, 'nome').map((item, i) => {
                        // IGNORA O SISTEMA PEDIDOS" (33) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                        // IGNORA O SISTEMA "DOCAS." (57) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                        // IGNORA O SISTEMA FUNCIONÁRIOS." (61) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                        // IGNORA O SISTEMA "COMUNICADO." (70) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                        // IGNORA O SISTEMA "DOCUMENTOS." (92) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                        // IGNORA O SISTEMA "NOTIFICAÇÕES" (256) POIS ELE FICA DENTRO DO JOBS (PROVISÓRIO)
                        if(item.id !== 33 && item.id !== 57 && item.id !== 61 && item.id !== 70 && item.id !== 92 && item.id !== 256){
                            
                            // A FAMOSA GAMBIARRA PRA REMOVER OS SISTEMAS ANTIGOS DA FASTVIEW E MALLTECH ENQUANTO AINDA ESTÃO USANDO
                            if(global.client !== 'fastview' || (global.client === 'fastview' && item.id !== 223 && item.id !== 231 && item.id !== 230)){
                                if(global.client !== 'malltech' || (global.client === 'malltech' && item.id !== 221 && item.id !== 223 && item.id !== 224)){
                                    let url_aux = item?.url?.replace('/v2','');

                                    // AJUSTA LINK DA NEWS PARA A FASTVIEW
                                    if(item?.id == 188){
                                        url_aux = 'systems/news'
                                    }

                                    return(
                                        <Item
                                            key={'modulo_usuario_'+(item?.id_aux ? item?.id_aux : item?.id)}
                                            title={item?.nome}
                                            id={(item?.id_aux ? item?.id_aux : item?.id)}
                                            link={url_aux}
                                            onClick={() => handleSetSystem((item?.id_aux ? item?.id_aux : item?.id), item?.id_apl, item?.usuario_permissao, item?.pus)}
                                            callback={handleCallback}
                                        />
                                    )
                                }
                            }
                        }
                    }))}
                </ul>
            </div>

            {(!window.isMobile ?
                <User template={(cookies?.template ? true : false)} />
            :'')}

            {/* MENU HAMBURGER MOBILE */}
            {(window.isMobile ?
                <div className={style.hamburger_container} onClick={handleMenu}>
                    <div className={style.hamburger + ' ' + (menuActive ? style.active : '')}></div>
                </div>
            :'')}

            {(menuActive ? 
                <div className={style.menu_mobile}>
                    <ul>
                        {(orderBy(systems_aux, 'nome').map((item, i) => {
                            // IGNORA O SISTEMA PEDIDOS" (33) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                            // IGNORA O SISTEMA "DOCAS." (57) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                            // IGNORA O SISTEMA FUNCIONÁRIOS." (61) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                            // IGNORA O SISTEMA "COMUNICADO." (70) POIS ESTAMOS MIGRANDO PARA O NOVO EM REACT
                            // IGNORA O SISTEMA "NOTIFICAÇÕES" (256) POIS ELE FICA DENTRO DO JOBS (PROVISÓRIO)
                            if(item.id !== 33 && item.id !== 57 && item.id !== 61 && item.id !== 70 && item.id !== 256){
                                
                                // A FAMOSA GAMBIARRA PRA REMOVER OS SISTEMAS ANTIGOS DA FASTVIEW E MALLTECH ENQUANTO AINDA ESTÃO USANDO
                                if(global.client !== 'fastview' || (global.client === 'fastview' && item.id !== 223 && item.id !== 231 && item.id !== 230)){
                                    if(global.client !== 'malltech' || (global.client === 'malltech' && item.id !== 221 && item.id !== 223 && item.id !== 224)){
                                        let url_aux = item?.url?.replace('/v2','');

                                        // AJUSTA LINK DA NEWS PARA A FASTVIEW
                                        if(item?.id == 188){
                                            url_aux = 'systems/news'
                                        }

                                        return(
                                            <Item
                                                key={'modulo_usuario_'+(item?.id_aux ? item?.id_aux : item?.id)}
                                                title={item?.nome}
                                                id={(item?.id_aux ? item?.id_aux : item?.id)}
                                                link={url_aux}
                                                onClick={() => handleSetSystem((item?.id_aux ? item?.id_aux : item?.id), item?.id_apl, item?.usuario_permissao, item?.pus)}
                                                callback={handleCallback}
                                            />
                                        )
                                    }
                                }
                            }
                        }))}
                    </ul>

                    {(window.isMobile ?
                        <User mobile={true} template={(cookies?.template ? true : false)} />
                    :'')}
                </div>
            :'')}
        </nav>
    );
}
