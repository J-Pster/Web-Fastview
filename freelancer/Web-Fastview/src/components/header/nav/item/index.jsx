import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import style from './Item.module.scss';
import { useRef } from 'react';
import { useCookies } from 'react-cookie';

export default function Item({id, link, title, onClick, callback}){
    // COOKIES
    const [cookies, setCookie] = useCookies(['template']);

    // LOCATION
    const location = useLocation();

    // REF
    const ref = useRef(null);
    
    let url_aux = '';
    let link_aux = link;
    url_aux += location?.pathname.split('/')[1]+'/';
    url_aux += location?.pathname.split('/')[2];

    useEffect(() => {
        if(ref?.current){
            callback({
                scroll: ref?.current?.offsetLeft - 140
            });
        }else{
            callback({
                scroll: 0
            });
        }
    },[ref?.current]);

    // VERIFICA SE É O SISTEMA MANUTENÇÃO SAL PARA ABRIR UMA NOVA ABA COM O SAL
    let manutencao = false;
    if(id == 111){ // SISTEMA MANUTENÇÃO SAL (111)
        manutencao = true;

        let random_number = parseInt(Math.random() * (99999 - 10000) + 10000);
        link_aux = 'https://sistema2.madnezz.com.br/accounts/login_v3.asp?v3='+random_number+(random_number*window.rs_id_usr);
    }

    return(
        <li
            ref={(link_aux === url_aux ? ref : undefined)}
            className={ style.item }
            onClick={onClick}
        >
            {(link_aux.includes('http') || manutencao ? // SE O LINK LINK FOR EXTERNO ABRE EM NOVA GUIA
                <a href={link_aux} target="_blank">
                    {title}
                </a>
            :
                <NavLink to={link_aux} className={(cookies?.template ? style.with_background : '')}>
                    {title}
                </NavLink>
            )}
        </li>
    );
}