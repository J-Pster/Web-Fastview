import Icon from "../../../../../../components/body/icon";
import style from './style.module.scss';

export default function IncluirModulo({callback, disabled}){
    // CALLBACK
    const handleNew = () => {
        if(callback){
            callback(true);
        }
    }
    return(
        <div className={style.container}>
            <Icon
                type="plus"
                title={disabled ? 'Confirme as configurações do módulo anterior antes de configurar um novo' : ''}
                disabled={disabled}
                onClick={handleNew}
            />
        </div>
    )
}