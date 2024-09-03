import { useState } from 'react';
import style from './CalendarFilter.module.scss';
import Icon from '../../icon';
import { toast } from 'react-hot-toast';

export default function CalendarFilter(props){
    let align;

    if(props.align){
        if(props.align=='left'){
            align = 'start';
        }else if(props.align=='center'){
            align = 'center';
        }else if(props.align=='right'){
            align = 'end';
        }else{
            align = 'start';
        }
    }

    const [collapse, setCollapse] = useState(false);

    // FUNÇÃO AO CLICAR NA DIV DO CALENDÁRIO
    const handleClick = () => {
        if(props?.disabled){
            toast('Ainda carregando. Aguarde alguns instantes');
        }
    }

    if(window.isMobile){
        return(
            <div className="d-flex align-items-start">
                <div className={style.filter__collapsing + ' ' + (collapse?style.active:'')}>
                    <div className={style.filter__collapsing_title + ' ' + (collapse?style.active:'')} onClick={() => setCollapse(!collapse)}>
                        <span>Filtros</span>
                        <Icon type={(collapse?'collapseOut':'collapseIn')} />
                    </div>
                    <div className={style.filter__collapsing_body + ' ' + (collapse?style.active:'')}>
                        <div className={ style.titleFilter + ' justify-content-'+align } style={{marginLeft:(props.margin===false?'0':'')}}>
                            { props.children }
                        </div>
                    </div>
                </div>            

                {(props.actions ? 
                    <div className={style.actions}>
                        { props?.actions }
                    </div>
                :'')}
            </div>
        );
    }else{
        return(
            <div
                className={ style.titleFilter + ' justify-content-'+align }
                style={{marginLeft:(props.margin===false?'0':'')}}
                id="calendar_filter"
                onClick={handleClick}
            >
                <div className={(props?.disabled ? style.disabled : '')}>
                    { props.children }
                    { props?.actions }
                </div>
            </div>
        );
    }    
}
