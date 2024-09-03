import { useNavigate } from 'react-router-dom'
import style from './PageError.module.scss';
import Button from '../button';
import Icon from '../icon';

export default function PageError({title, text, icon, button}){
    const navigate = useNavigate();

    return(
        <div className={ style.error }>
            <div>
                <div className={style.big__icon_container}>
                    <Icon type={(icon ? icon : 'sad')} className={style.big__icon}/>
                </div>

                <h2 className={style.title}>
                    {(title?title:'Algo está errado...')}
                </h2>

                {(text !== false ?
                    <p className={style.info}>
                        {(text ?
                            text
                        :
                            `Não foi possível completar a sua solicitação.
                            Tente novamente em alguns minutos.
                            Caso o problema persista, entre em contato com o suporte.`
                        )}
                    </p>
                :'')}
                
                {(button !== false ?
                    (button ?
                        button
                    :
                        <Button onClick={() => navigate(0)}>
                            Recarregar
                            <Icon type="reload" />
                        </Button>
                    )
                :'')}
            </div>
        </div>
    )
}
