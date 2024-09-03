import { useNavigate } from "react-router";
import Button from "../button";
import Icon from "../icon";
import style from './style.module.scss';
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Alert({url}){
    // ESTADOS
    const [active, setActive] = useState(false);

    // COOKIES
    const [cookie, setCookie, removeCookie] = useCookies(['beta']);

    // NAVIGATE
    const navigate = useNavigate();

    // ATIVA O ALERTA CASO NÃO TENHA SALVADO O ACEITE NO COOKIE
    useEffect(() => {
        if(!cookie?.beta?.includes(window.rs_sistema_id)){
            setTimeout(() => {
                setActive(true);
            },3000);
        }
    },[]);

    // SALVA COOKIE
    const handleCookie = () => {
        let system_aux = cookie?.beta ? cookie?.beta : [];
        system_aux.push(window.rs_sistema_id);
        removeCookie('beta', {path: '/'})
        setCookie('beta', system_aux, {path: '/', expires: new Date('2024-12-31')});
        setActive(false);
    }

    // AÇÃO DO LINK
    const handleNavigate = () => {
        if(url && url?.includes('http')){
            window.open(url, "_blank");
        }else{
            navigate(url);
        }        
    }

    if(url){
        return(
            <>
                <div className={style.overlay + ' ' + (active ? style.active : '')}></div>

                <div className="position-relative">
                    <div className={style.message + ' ' + (active ? style.active : '')}>
                        <div className="text-center">
                            <p>
                                Você está acessando uma versão <b>beta</b> do sistema. <br />
                                Caso encontre algum problema ou queira ver o histórico anterior, clique aqui para acessar
                            </p>

                            <Button onClick={handleCookie}>
                                Entendido
                            </Button>
                        </div>
                    </div>

                    <Button
                        className={style.button}
                        onClick={handleNavigate}
                    >
                        Ver histórico

                        <Icon type="history" animated />
                    </Button>            
                </div>
            </>
        )
    }
}
