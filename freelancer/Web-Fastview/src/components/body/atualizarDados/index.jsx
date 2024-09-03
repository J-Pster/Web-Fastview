import { useEffect, useState } from 'react';
import Button from '../button';
import style from './atualizarDados.module.scss';

import Item from "./item";
import axios from 'axios';

export default function AtualizarDados({callback, inputs}){
    // ESTADOS
    const [disabled, setDisabled] = useState(true);
    const [buttonStatus, setButtonStatus] = useState('');
    const [data, setData] = useState([]);

    // VALIDATION
    const handleValidation = (e) => {
        setData(data => [...data.filter((elem) => elem.id != e.id), e]);
    }

    useEffect(() => {
        let validation = true;
        data.map((item, i) => { // PERCORRE TODOS OS CAMPOS
            if(item.value && item.validation === false){ // SE ENCONTRAR ALGUM CAMPO QUE TENHA VALOR E QUE NÃO TENHA SIDO VALIDADO, SETA COMO FALSE
                validation = false;
            }
        });

        if(validation){ // SE A VALIDAÇÃO ESTIVER OK, DESBLOQUEIA O BOTÃO DE SUBMIT
            setDisabled(false);
        }else{
            setDisabled(true);
        }   
    },[data]);

    // SUBMIT
    function submit_info(){
        setButtonStatus('loading');

        let object_aux = {id: inputs.id};
        data.map((item, i) => {
            object_aux[item.id] = item.value
        });

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                type: 'Table',
                do: 'setUpdateTable'
            },
            data: object_aux,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            if(callback){
                callback();
                setButtonStatus('');
            }
        });
    }

    const handleSubmit = () => {
        if(window.confirm('Confirma que todos os dados estão corretos?')){
            submit_info();
        }
    }

    return(
        <div>
            <div className={style.container}>
                {(inputs?.columns.map((item, i) => {
                    let accept_aux;
                    let multiple_aux;
                    let mask_aux;
                    let value_aux = item.value;

                    if(item?.type === 'file'){
                        accept_aux = '.png, .jpeg, .jpg';
                        multiple_aux = false;

                        if(!item?.value.includes('{')){
                            value_aux = '[{"id":"'+item.value+'"}]';
                        }
                    }else if(item?.type === 'tel'){
                        mask_aux = '(99) 9999-99999'
                    }

                    return(
                        <Item
                            key={'atualizacao_'+i}
                            id={item?.name}
                            label={item.label ? item.label : item.name}
                            type={item.type ? item.type : 'text'}
                            accept={accept_aux}
                            multiple={multiple_aux}
                            mask={mask_aux}
                            value={value_aux}
                            required={false}
                            callback={handleValidation}
                        />
                    )
                }))}                
            </div>

            <Button
                type="submit"
                title={(disabled ? 'Preencha e confirme os dados antes de continuar' : '')}
                disabled={disabled}
                onClick={handleSubmit}
                status={buttonStatus}
                className="mt-3"
            >
                Salvar
            </Button>
        </div>
    )
}
