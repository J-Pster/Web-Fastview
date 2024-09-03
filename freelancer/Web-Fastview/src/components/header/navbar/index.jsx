import { useState } from 'react';
import style from './navbar.module.scss';
import Icon from '../../body/icon';
import { toast } from 'react-hot-toast';

export default function Navbar(props){
    // ESTADOS
    const [collapse, setCollapse] = useState(false);

    // FUNÇÃO AO CLICAR NA DIV DO CALENDÁRIO
    const handleClick = () => {
        if(props?.disabled){
            toast('Ainda carregando. Aguarde alguns instantes');
        }
    }

    return(
        <div className={style.navbar} id="system_navbar" onClick={handleClick}>
            <div className={style.menu + ' ' + (props?.disabled ? style.disabled : '')}>
                <ul>
                    {props?.children}
                </ul>

                <div className={style.actions}>
                    {(!window.isMobile ?
                        <div className={style.filters}>
                            {props?.filters}
                        </div>
                    :'')}

                    {(props?.icons ? 
                        <div className={style.icons}>
                            {props?.icons}
                        </div>
                    :'')}
                </div>
            </div>

            {(window.isMobile && props?.filters ?
                <div className={style.filters}>
                    <div
                        className={'d-flex align-items-center justify-content-between w-100 ' + (collapse ? style.active : '')}
                        onClick={() => setCollapse(!collapse)}
                    >
                        <span>
                            Filtros
                        </span>
                        <Icon type={(collapse ? 'chevron-up' : 'chevron-down')} />
                    </div>

                    {(collapse ? 
                        <div className={style.items}>
                            {props?.filters}
                        </div>
                    :'')}
                </div>
            :'')}
        </div>
    )
}