import axios from 'axios';
import { useState, useEffect } from 'react';
import Input from '../input';
import InputContainer from '../inputcontainer';
import Loader from '../../loader';
import Item from './Item';

export default function CheckboxGroup(props){
    // VARIÁVEIS
    var label = 'Todos';
    var url = '';
    var name = 'checkbox';

    // ESTADOS
    const [checkboxItems, setCheckboxItems] = useState((props?.items ? props?.items : []));
    const [values, setValues] = useState((props.value ? props.value : []));
    const [checkAll, setCheckAll] = useState(null);
    const [checkAllAux, setCheckAllAux] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [loading, setLoading] = useState(true);

    if(props.group == 'loja'){
        label = 'Todas as lojas';
        name = 'checkbox_loja';
        url = window.host+'/api/sql.php?do=select&component=loja&filial=true';
    }else if(props.group == 'departamento'){
        label = 'Todos os departamentos';
        name = 'checkbox_departamento';
        url = window.host+'/api/sql.php?do=select&component=departamento';
    }else if(props.group == 'usuario'){
        name = 'checkbox_usuario';
        label = 'Todos os usuários';
        url = window.host+'/api/sql.php?do=select&component=usuario';
    }else if(props.group == 'cargo'){
        name = 'checkbox_cargo';
        label = 'Todos os cargos';
        url = window.host+'/api/sql.php?do=select&component=cargo';
    }else if(props.group == 'funcionario'){
        name = 'checkbox_funcionario';
        label = 'Todos os funcionários';
        url = window.host+'/api/sql.php?do=select&component=funcionario';
    }else if(props.group == 'empreendimento'){
        name = 'checkbox_empreendimento';
        label = 'Todos os empreendimentos';
        url = window.host+'/api/sql.php?do=select&component=empreendimento';
    }else if(props.group == 'grupo_empreendimento'){
        name = 'checkbox_empreendimento';
        label = 'Todos os empreendimentos';
        url = window.host+'/api/sql.php?do=select&component=grupo_empreendimento';
    }else if(props.group == 'marca'){
        name = 'checkbox_marca';
        label = 'Todas as marcas';
        url = window.host+'/api/sql.php?do=select&component=marca';
    }else{
        name = (props?.name ? props?.name : 'checkbox_group');
        label = (props?.label ? props?.label : 'Todos');

        if(props?.api?.url){
            url = props?.api?.url;
        }else{
            url = (props?.url ? window.host+'/api/sql.php?do=select&component=marca' : '');
        }
    }

    // CAMPOS PERSONALIZADOS
    if(props?.label){
        label = props?.label;
    }

    if(props?.name){
        name = props?.name;
    }

    // GET DOS ITENS DO CHECKBOX
    useEffect(() => {
        if(url && !props?.options && !props?.items){
            if(props?.loadDefault !== false || (props?.loadDefault === false && collapse)){
                if(checkboxItems.length === 0){
                    setLoading(true);

                    axios({
                        method: 'get',
                        url: url,
                        params: props?.api?.params ? props?.api?.params : {}
                    }).then((response) => {
                        let key_aux = props?.api?.key_aux;
                        let response_aux = response.data;

                        for (let index = 0; index < key_aux?.length; index++) {
                            response_aux = response_aux[key_aux[index]];
                        }

                        setCheckboxItems(response_aux);
                        setLoading(false);
                    });
                }
            }
        }

        if(props?.options){
            setCheckboxItems(props?.options);
        }

        if(props?.items){
            setCheckboxItems(props?.items);
        }

        if(props?.options || props?.items){
            setLoading(false);
        }
    },[props?.options, props?.items, collapse]);

    // SELECIONAR ITENS
    function handleCheck(e){
        if (e.target.checked) {
            setValues([...values, e.target.value]);
            props.callback([...values, e.target.value]);
        } else {
            setValues(values.filter((item) => item != e.target.value));
            props.callback(values.filter((item) => item != e.target.value));
        }
    }

    // SELECIONAR TODOS OS ITENS
    function handleCheckAll(e){
        let values = [];

        if(e.target.checked){
            checkboxItems.map((item) => { 
                let id_aux;

                if(item?.id){
                    id_aux = item?.id;
                }else{
                    id_aux = item?.value;
                }

                values.push(id_aux);
            });
        }
        setCheckAllAux(false);
        setValues(values);
        props.callback(values);
    }

    // VERIFICA SE TODOS OS ITENS ESTÃO SELECIONADOS
    useEffect(() => {
        if(checkboxItems?.length > 0 || props?.items?.length > 0){
            if(values?.length == (checkboxItems.length || props?.items.length)){
                setCheckAll(true);
            }else{
                setCheckAll(null);
            }
        }
    },[values, props?.value, checkboxItems, props?.items]);

    // VERIFICA SE A PROPS "VALUE" SOFREU ALGUMA ALTERAÇÃO
    useEffect(() => {
        setValues(props?.value);
    },[props?.value]);

    // AÇÕES AO FAZER O COLLAPSE
    const handleSetCollapse = (e) => {
        setCollapse(e);

        if(props.collapse){
            props.collapse(e);
        }
    }

    return(
        <InputContainer
            display="block"
            id={props?.id}
            collapse={true}
            float={props?.float}
            no_selec={props?.no_selec ? true : false}
            style_aux={props?.style_aux}
            minified={props?.minified}
            maxHeight={props?.maxHeight}
            callback={{
                collapse: handleSetCollapse
            }}
            loading={props?.loading}
            label={
                (props?.all !== false ?
                    <Input
                        type="checkbox"
                        label={label}
                        id={name+'_all'}
                        className="mb-0 p-0"
                        checked={checkAll}
                        onChange={(e) => handleCheckAll(e)}
                        required={false}
                    />
                :
                    <div className="pe-1">
                        {label}
                    </div>
                )
            }
            show={(props.show ? props.show : false)}
            selected={values?.length}
        >
            {(collapse &&
                (props.loadingItems || loading ? 
                    <Loader className="mb-1" />
                :
                    (checkboxItems?.length > 0 ?
                        checkboxItems.map((item, i) => {
                            // DEFINE ID E NOME DO ITEM
                            let id = '';

                            if(item?.value){
                                id = item?.value;
                            }else if(item?.id){
                                id = item?.id;
                            }

                            return (
                                <Item
                                    key={name+'_'+id+'_'+i}
                                    item={item}
                                    name={name}
                                    aux={props?.aux}
                                    values={values}
                                    checkAllAux={checkAllAux}
                                    required={props?.required}
                                    callback={handleCheck}
                                />
                            )
                        })
                    :
                        <p className="mb-1">Nenhuma opção encontrada</p>
                    )
                )
            )}
        </InputContainer>
    )
}