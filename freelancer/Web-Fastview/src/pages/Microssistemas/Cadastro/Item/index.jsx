import { useEffect, useState } from "react";
import Input from "../../../../components/body/form/input";
import SelectReact from "../../../../components/body/select";
import Textarea from "../../../../components/body/form/textarea";
import axios from "axios";
import InputContainer from "../../../../components/body/form/inputcontainer";

export default function Item({id, label, type, mask, maskChar, required, value, loja_id, callback, label_aux, valor_padrao, data_passada}){
    // ESTADOS
    const [options, setOptions] = useState([]);
    const [optionsSelect, setOptionsSelect] = useState([]);
    const [valueAux, setValueAux] = useState((value ? value : (valor_padrao ? valor_padrao : (type === 'checkbox-personalizado' ? [] : ''))));

    // SETA VALOR E MANDA PRO PARENT
    const handleSetValue = (e) => {
        if(type === 'select-loja' || type === 'select-personalizado' || type === 'select-funcionario' || type === 'select-usuario'){
            setValueAux(e.value);
            callback({
                id: id,
                value: e.value,
                required: required,
                loja_id: loja_id,
                validation: (e.value ? true : false)
            });
        }else if(type === 'checkbox-personalizado'){
            let value_aux = valueAux;
            if(e.target.checked){
                value_aux = [...valueAux, e.target.value];
            }else{
                value_aux = valueAux.filter((item) => item !== e.target.value);
            } 

            setValueAux(value_aux);
           
            callback({
                id: id,
                value: value_aux.toString(),
                required: required,
                loja_id: loja_id,
                validation: (value_aux.length > 0 ? true : false)
            });
        }else if(type === 'file'){
            let files = [];
            JSON.parse(e[0]).map((file) => {
                files.push(file?.id);
            });

            setValueAux(e[0]);
            callback({
                id: id,
                value: files?.toString(),
                required: required,
                loja_id: loja_id,
                validation: (files?.length > 0 ? true : false)
            });
        }else if(type === 'date'){
            setValueAux(e);
            callback({
                id: id,
                value: e,
                required: required,
                loja_id: loja_id,
                validation: (e ? true : false)
            });
        }else if(type === 'money'){
            setValueAux(e);
            callback({
                id: id,
                value: e,
                required: required,
                loja_id: loja_id,
                validation: (e ? true : false)
            });
        }else{
            setValueAux(e.target.value);
            callback({
                id: id,
                value: e.target.value,
                required: required,
                loja_id: loja_id,
                validation: (e.target.value ? true : false)
            });
        }
    }

    // GET OPTIONS CHECKBOX
    useEffect(() => {
        if(type === 'checkbox-personalizado'){
            if(options.length === 0){
                axios({
                    method: 'get',
                    url: window.host+'/systems/microssistemas-novo/api/novo.php?do=get_opcoes&item_id='+id
                }).then((response) => {
                    setOptions(response.data);
                });
            }
        }
    },[]);

    if(type === 'select-loja' || type === 'select-personalizado' || type === 'select-funcionario' || type === 'select-usuario'){
        let url_aux;

        if(type === 'select-loja'){
            url_aux = window.host+'/api/sql.php?do=select&component=loja';
        }else if(type === 'select-funcionario'){
            url_aux = window.host+'/api/sql.php?do=select&component=funcionario';
        }else if(type === 'select-usuario'){
            url_aux = window.host+'/api/sql.php?do=select&component=usuario';
        }else if(type === 'select-personalizado'){
            url_aux = window.host+'/systems/microssistemas-novo/api/novo.php?do=get_opcoes&item_id='+id;
        }

        let text_limit = (label.length > 25 || label_aux);

        useEffect(() => {
            if(valor_padrao){
                axios({
                    method: 'get',
                    url: window.host+'/systems/microssistemas-novo/api/novo.php?do=get_opcoes&item_id='+id
                }).then((response) => {
                    setOptionsSelect(response.data);
                });
            }
        },[]);

        return(
            <>
                {(text_limit ?
                    <p className="mb-2">{label}</p>
                :'')}

                {(valor_padrao ?
                    <SelectReact
                        label={text_limit ? 'Selecione' : label}
                        options={optionsSelect}
                        required={required}
                        value={valueAux}
                        onChange={handleSetValue}
                    /> 
                :
                    <SelectReact
                        label={text_limit ? 'Selecione' : label}
                        api={{
                            url: url_aux
                        }}
                        required={required}
                        value={valueAux}
                        onChange={handleSetValue}
                    />
                )}
            </>
        )
    }else if(type === 'checkbox-personalizado'){
        return(
            <InputContainer
                label={label + (required ? ' *' : '')}
                display={'block'}
                wrap={true}
            >
                {options.map((option) => {
                    return(
                        <Input
                            key={'option_'+id+'_'+option.id}
                            id={'options_'+option.id}
                            name={'options_'+option.id}
                            type="checkbox"
                            value={option.id}
                            label={option.label}
                            checked={(valueAux.includes(option.id) ? true : null)}
                            onChange={handleSetValue}
                            required={false}
                        />
                    )
                })}
            </InputContainer>
        );
    }else if(type === 'textarea'){
        return(
            <Textarea
                label={label}
                required={required}
                value={valueAux}
                onChange={handleSetValue}
                callback={handleSetValue}
            />
        )
    }else{
        return(
            <Input
                label={label}
                type={type}
                mask={mask}
                maskChar={maskChar}
                valueStart={data_passada===1 ? new Date() : false}
                required={required}
                multiple={false}
                value={valueAux}
                onChange={type === 'file' ? undefined : handleSetValue}
                callback={type === 'file' ? handleSetValue : undefined}
            />
        )
    }    
}
