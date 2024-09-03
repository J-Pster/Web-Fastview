import { useState, useRef, useEffect } from "react";
import style from './item.module.scss';
import Input from "../../form/input";
import Icon from "../../icon";
import { toast } from "react-hot-toast";
import { valida_email } from "../../../../_assets/js/global";

export default function Item({id, name, label, placeholder, required, mask, type, accept, multiple, callback, value, loading}){
    // ESTADOS
    const [valueAux, setValueAux] = useState((value ? value : ''));
    const [readOnly, setReadOnly] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [removed, setRemoved] = useState(false);

    // REF
    const inputRef = useRef(null);

    // CONFIRMAR
    const handleCheck = () => {        
        if(type === 'mail' && valueAux && !valida_email(valueAux)){
            toast('Digite um e-mail válido');
        }else{
            if(window.confirm((valueAux ? 'Confirma que o dado está correto?' : 'Confirma o envio do campo em branco?'))){
                setConfirmed(true);
                setReadOnly(true);

                let value_aux = '';
                if(type === 'file'){
                    if(valueAux){
                        value_aux = JSON.parse(valueAux)[0].id;
                    }
                }else{
                    value_aux = valueAux;
                }

                let callback_aux = {
                    id: id,
                    value: value_aux,
                    validation: true
                }

                if(callback){
                    callback(callback_aux)
                }
            }
        }
    }

    // EXCLUIR
    const handleDelete = () => {
        if(window.confirm('Confirma exclusão do dado?')){
            setValueAux('');
            setRemoved(true);

            let value_aux = '';
            if(type === 'file'){
                if(valueAux){
                    value_aux = JSON.parse(valueAux)[0].id;
                }
            }else{
                value_aux = valueAux;
            }

            if(callback){
                callback({
                    id: id,
                    value: value_aux,
                    validation: false
                })
            }
        }
    }

    // HABILITAR EDIÇÃO
    const handleEdit = () => {
        setReadOnly(!readOnly);
    }

    // VERIFICA SE O VALUE RECEBIDO DO COMPONENTE PAI FOI ALTERADO
    useEffect(() => {
        setValueAux(value);
    },[value]);

    // VERIFICA SE HOUVE TROCA DE VALOR DO INPUT PARA SETAR A VALIDAÇÃO COMO TRUE CASO O CAMPO FIQUE EM BRANCO
    useEffect(() => {
        if(callback){
            let value_aux = '';
            if(type === 'file'){
                if(valueAux){
                    value_aux = JSON.parse(valueAux)[0].id;
                }
            }else{
                value_aux = valueAux;
            }

            let callback_aux = {
                id: id,
                value: value_aux,
                validation: false
            }
            callback(callback_aux);
        }
    },[valueAux]);

    // CALLBACK INPUT
    const handleCallback = (e) => {
        if(type === 'file'){
            setValueAux(e[0]);
        }
    }

    return(
        <div className={style.item}>
            <div ref={inputRef}>
                <Input
                    id={id}
                    name={(name ? name : id)}
                    type={(type ? type : 'text')}
                    accept={(accept ? accept : '')}
                    multiple={(multiple === false ? false : null)}
                    label={(window.isMobile ? '' : label)}
                    placeholder={(window.isMobile ? label : placeholder)}
                    mask={mask}
                    align={(type === 'file' ? 'left' : '')}
                    icon={false}
                    value={valueAux}
                    required={required}
                    readonly={readOnly}
                    disabled={removed}
                    autoFocus={!readOnly}
                    className={(confirmed || removed ? style.input_confirmed : '')}
                    loading={loading}
                    onChange={(e) => setValueAux(e.target.value)}
                    callback={handleCallback}
                />                
            </div>

            <div className={style.actions}>
                {(!loading ?
                    <div>
                        {(!removed ?
                            <Icon
                                type="check"
                                title={(confirmed ? 'Confirmado' : 'Confirmar')}
                                className={(confirmed ? 'text-success' : '')}
                                readonly={confirmed}
                                onClick={handleCheck}
                                animated
                            />
                        :'')}

                        {(!confirmed ?
                            <Icon
                                type="reprovar2"
                                title={(removed ? 'Excluído' : 'Excluir')}
                                className={(removed ? 'text-danger' : '')}        
                                readonly={removed}                    
                                onClick={handleDelete}
                                animated
                            />
                        :'')}

                        {/* {(!confirmed && !removed ?
                            <Icon
                                type="edit"
                                active={!readOnly}
                                animated
                                onClick={handleEdit}
                            />
                        :'')} */}
                    </div>
                :'')}
            </div>
        </div>
    )
}
