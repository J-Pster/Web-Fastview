import style from './Toast.module.scss';
import Icon from '../icon';
import { useEffect, useState } from 'react';

export default function Toast(props){
    const [show, setShow] = useState(props.show);

    useEffect(() => {
        setShow(props.show)  
    },[props.show]);

    return(
        <div className={ style.toast + ' ' + (show?style.toast__show:'')}>
            <div className="d-flex align-items-center justify-content-between">
                <span>{ props.text }</span>
                <div className={ style.toast__btn_close } onClick={() => setShow(false)}>
                    <Icon type="reprovar" title="Fechar" />
                </div>
            </div>
        </div>
    )
}
