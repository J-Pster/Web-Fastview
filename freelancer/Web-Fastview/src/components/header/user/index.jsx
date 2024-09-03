import style from './User.module.scss';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FaCaretDown, FaCog, FaFile, FaPalette, FaBuilding, FaCode, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../../context/Auth';
import { useCookies } from 'react-cookie';
import Icon from '../../body/icon';
import axios from 'axios';

export default function User({mobile, template}){
    // COOKIES
    const [cookies] = useCookies(['template']);

    // AUTH CONTEXT
    const { authInfo } = useContext(AuthContext);

    // ESTADOS
    const [loadingLogout, setLoadingLogout] = useState(false);

    // NAVIGATE
    const navigate = useNavigate();
    const location = useLocation();
    
    //FUNÇÃO PARA DETECTAR O CLIQUE FORA DO ELEMENTO
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
    }, []);

    //FUNÇÃO PARA DETECTAR QUANDO O USUÁRIO PRESSIONAR A TECLA ESC
    useEffect(() => {
        document.addEventListener('keydown', escFunction, false)
    }, []);

    const [ menuUserActive, setMenuUserActive ] = useState(false);   
    const boxUser = useRef(null);

    const handleClickOutside = (e) => {
        if(!boxUser?.current?.contains(e.target)){
            setMenuUserActive(false);
        }
    }

    const escFunction = (e) => {
        if(e.key === 'Escape'){
            setMenuUserActive(false);
        }
    }

    // LOGOUT
    const handleLogOut = () => {
        setLoadingLogout(true);

        axios({
            method: 'get',
            url: window.backend+'/api/auth/user/logout'
        }).then((response) => {
            setLoadingLogout(false);
            setMenuUserActive(false);

            if(response){
                localStorage.clear();
                if(location.pathname == '/'){
                    navigate(0);
                }else{
                    navigate('/');
                    navigate(0);
                }
            }

            // RESETA VARIÁVEIS DE SESSÃO
            sessionStorage.setItem('sistema_id', '');
            sessionStorage.setItem('id_apl', '');
            sessionStorage.setItem('permission_apl', '');
            sessionStorage.setItem('pus', '');
        });
    }

    // CONFIGURAÇÕES
    const handleSettings = () => {
        navigate('/configuracoes');
        setMenuUserActive(false);
    }

    return(
        <div className={ style.user + ' ' + style.boxUser + ' ' + (template ? style.with_background : '') + ' ' + (menuUserActive===true?style.user__active:'') + ' ' + (mobile ? style.mobile : '')} ref={ boxUser }>            
            <div onClick={ () => setMenuUserActive((menuUserActive===true?false:true)) }>
                <div
                    className={ style.user__photo }
                    style={{backgroundImage: 'url('+window.upload+'/'+authInfo.pessoa.imagem+')'}}
                >
                    {(authInfo.pessoa.nome && !authInfo.pessoa.imagem ? 
                        authInfo.pessoa.nome.slice(0,1)
                    :'')}
                </div>

                <div className={ style.user__info_container }>
                    <span className={ style.user__name }>
                        { authInfo.pessoa.nome }
                    </span>
                    <span className={ style.user__info }>
                        { authInfo?.loja?.nome ? authInfo?.loja?.nome : authInfo.empreendimento.nome }
                    </span>                
                </div>

                {(!mobile ?
                    <FaCaretDown className={ style.arrow } />
                :'')}
            </div>            

            <div className={ style.user__menu }>
                <ul style={{backgroundColor: (cookies?.template ? cookies?.template : '')}}>
                    <li onClick={handleSettings}>Configurações <Icon type="cog" readonly title={false} /></li>
                    <li>Política de Privacidade <Icon type="document" readonly title={false} /></li>
                    {(authInfo?.troca_empreendimento == 1 && <li onClick={() => (navigate('/trocar-empreendimento'), setMenuUserActive(false))}>Trocar empreendimento <Icon type="enterprise" readonly title={false} /></li>)}
                    <li onClick={handleLogOut}>Sair <Icon type="logout" readonly title={false} loading={loadingLogout} /></li>
                </ul>
            </div>
        </div>
    );
}
