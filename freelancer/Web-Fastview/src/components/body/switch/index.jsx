import { useEffect, useState } from 'react';
import style from './switch.module.scss';
import Tippy from '@tippyjs/react';

export default function Switch({checked, onChange, value, className, label, disabled, title}){
    const [checkedAux, setCheckedAux] = useState((checked ? checked : false));

    // TROCA STATUS
    const handleClick = () => {
        setCheckedAux(!checkedAux);

        if(onChange){
            onChange({
                target: {
                    value: value,
                    checked: !checkedAux
                }
            });
        }
    }

    // VERIFICA SE O CHECKED FOI ALTERADO
    useEffect(() => {
        setCheckedAux(checked);
    },[checked]);

    return(
        <Tippy disabled={(title===false || window.isMobile ? true : false) || !title} content={ title }>
            <div
                className={style.switcher_container + ' ' + className + ' ' + (label ? 'w-100' : '') + ' ' + (label ? 'ms-0' : '') + ' ' + (disabled ? style.disabled : '')}
            >
                <div className="d-flex align-items-center justify-content-between">
                    {(label ?
                        <span className="pe-2 mb-0">
                            {label}
                        </span>
                    :'')}

                    <div
                        className={style.switcher + ' ' + (checkedAux ? style.on : '')}
                        onClick={handleClick}
                    >
                        <div className={style.switch}></div>
                    </div>
                </div>
            </div>
        </Tippy>
    )
}