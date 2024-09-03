import { useState, useEffect, useContext } from 'react';

import Icon from '../icon';
import style from './Counter.module.scss';
import { GlobalContext } from "../../../context/Global";

export default function Counter({paused}){
    var interval;
    let count_aux = 360;

    // CONTEXT
    const { refresh, refreshCalendar } = useContext(GlobalContext);

    // ESTADOS
    const [active, setActive] = useState(true);
    const [count, setCount] = useState(count_aux);
    const [pausedAux, setPausedAux] = useState(paused);

    useEffect(() => {
        if(window.isMobile){
            setTimeout(() => {
                setActive(false);
            },2000)
        }

        if(count > 0){
            interval = setTimeout(() => { 
                if(!pausedAux){
                    setCount(count - 1);
                }
            }, 1000);
        }else{
            if(refreshCalendar){
                refreshCalendar(false);
            }
            setCount(count_aux);
        }
    },[count, pausedAux]);

    // ALTERA O STATUS DE PAUSADO SEMPRE QUE RECEBE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setPausedAux(paused);
    },[paused]);

    return(
        <div className={style.counter + ' ' + (active?style.active:'')}>
            <div className={style.btn__hide}>
                <Icon
                    type={(active?'right':'left')}
                    title={false}
                    onClick={() => setActive(!active)}
                />
            </div>

            Atualiza em <span>{count}</span> segundos

            <Icon
                type="sync"
                title={false}
                onClick={() => (
                    refreshCalendar(false),
                    setCount(count_aux),
                    clearInterval(interval)
                )}
            />
        </div>
    )
}
