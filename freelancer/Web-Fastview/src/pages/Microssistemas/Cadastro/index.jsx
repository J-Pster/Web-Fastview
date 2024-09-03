import { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";
import { set } from "react-hook-form";

export default function Cadastro({id, tipo, loja_id, relatorio_id, callback, item_condicional, componente_condicional, validacao_condicional, validation, className}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [values, setValues] = useState([]);
    const [outro, setOutro] = useState(false);

    let validacao_condicional_opcao = true;
    let validation_aux = false;
    
    // FUNÇÃO PARA BUSCAR ITENS DO MICROSSISTEMA
    function get_microssistema(){
        axios({
            method: 'get',
            url: window.host+'/systems/microssistemas-novo/api/novo.php?do=get_microssistema',
            params: {             
                microssistema_id: id,
                relatorio_id: relatorio_id,
                tipo: tipo,
                loja_id: loja_id
            }
        }).then((response) => {
            setItems(response.data.itens);

            let values_aux = [];
            if(response.data.itens){
                response.data.itens.map((item) => {
                    values_aux.push({
                        id: item?.id,
                        value: (item?.valor ? item?.valor : item?.valor_padrao),
                        required: (item?.obrigatorio == 1 ? true : false),
                        validation: (item?.obrigatorio == 1 ? false : true)
                    })
                });   
                
                setValues(values_aux);
            }

            if(callback){
                callback({
                    loaded: true
                })
            }
        });
    }

    // CHAMA FUNÇÃO PARA BUSCAR ITENS DO MICROSSISTEMA
    useEffect(() => {
        get_microssistema();
    },[id]);

    // PEGA VALORES DOS ITENS
    const handleCallback = (e) => {

        if(e?.id==524 && e?.value.includes('159')){
            setOutro(true);
        }else if((e?.id==524 && !e?.value.includes('159'))){
            setOutro(false);
        }

        setValues(values => [e, ...values.filter((elem) => elem.id !== e.id)]);
    }

    useEffect(() => {
        if(values.length > 0){
            let validation = true;

            values.map((item) => {
                if(!item.value && item.required && !validation_aux){
                    validation = false;
                }
            });            

            if(callback){
                callback({
                    validation: validation,
                    values: values
                }); 
            }
        }
    },[values]);

    useEffect(() => {
        if(!validacao_condicional){
            setOutro(false);
        }        
    },[validacao_condicional]);
    
    useEffect(() => {     
        if(callback){  
            callback({
                validation: validation,
            }); 
        }
    },[validation]);

    return (
        <div style={{marginBottom: 20}} className={className}>
            {(items.map((item) => {
                let type, mask, maskChar;

                if(item?.componente_id == global.componentes.dinheiro){ // VALOR
                    type = 'money';
                }else if(item?.componente_id == global.componentes.anexo){ // ARQUIVO
                    type = 'file';
                }else if(item?.componente_id == global.componentes.textarea){ // TEXTAREA
                    type = 'textarea';
                }else if(item?.componente_id == global.componentes.select_personalizado){ // SELECT PERSONALIZADO
                    type = 'select-personalizado';
                }else if(item?.componente_id == global.componentes.data){ // DATA
                    type = 'date';
                }else if(item?.componente_id == global.componentes.select_loja){ // SELECT LOJA
                    type = 'select-loja';
                }else if(item?.componente_id == global.componentes.select_funcionario){ // SELECT FUNCIONÁRIO
                    type = 'select-funcionario';
                }else if(item?.componente_id == global.componentes.select_usuario){ // SELECT USUÁRIO
                    type = 'select-usuario';
                }else if(item?.componente_id == global.componentes.email){ // E-MAIL
                    type = 'mail';
                }else if(item?.componente_id == global.componentes.cpf){ // CPF
                    type = 'text';
                    mask = '999.999.999-99';
                }else if(item?.componente_id == global.componentes.camera){ // CÂMERA
                    type = 'image';
                }else if(item?.componente_id == global.componentes.telefone){ // TELEFONE
                    type = 'tel';
                    mask = '(99) 9999-99999';
                }else if(item?.componente_id == global.componentes.checkbox_personalizado){ // CHECKBOX
                    type = 'checkbox-personalizado';
                }else{ // TEXT
                    type = 'text';
                    mask = '';
                }

                if(item?.item_id && item?.opcao_id){
                    validacao_condicional_opcao=false;
                    values.map((a) => {
                        if(a.id == item?.item_id && a.value == item?.opcao_id){
                            validacao_condicional_opcao=true;
                        }else if(a.id == item?.item_id && a.value){
                            validation_aux=true;
                        }
                    });
                }
                
                return(
                    <div style={{marginBottom: 10}} key={'item_'+item?.id+'_'+item?.nome}>
                        {/* CASO RECEBA A PROPS DE COMPONENTE_CONDICIONAL INSERE ELE JUNTO COM O ID DO ITEM_CONDICIONAL */}
                        {(item_condicional && componente_condicional && item_condicional == item?.id ?
                            componente_condicional
                        :'')}

                        {(

                            (outro && item?.id==525 && validacao_condicional) || 
                            item?.id!=525 && 
                            (
                                (item_condicional && componente_condicional && item_condicional == item?.id && validacao_condicional !== false) || 
                                !item_condicional || 
                                (item_condicional && item_condicional != item?.id)
                            ) && validacao_condicional_opcao?
                            <Item                                
                                id={item?.id}
                                label_aux={true}
                                loja_id={loja_id}
                                type={type}
                                mask={mask}
                                maskChar={maskChar}
                                data_passada={item?.data_passada}
                                label={item?.nome}
                                valor_padrao={item?.valor_padrao}
                                required={(item?.obrigatorio == 1 ||  (outro && item?.id==525 && validacao_condicional) ? true : false)}
                                value={item?.valor}
                                callback={handleCallback}
                                microssistema_id={id}
                            />
                        :'')}
                    </div>
                )
            }))}
        </div>
    )
}
