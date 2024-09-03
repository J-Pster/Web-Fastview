import { useState, useEffect} from 'react';
import Select from 'react-select';
import style from './Select.module.scss';
import axios from 'axios';
import Loader from '../loader';

export default function SelectReact(props){
    const [posTop, setPosTop] = useState(500);
    const [focus, setFocus] = useState(null);
    const [options, setOptions] = useState((props.options ? props.options : []));
    const [loading, setLoading] = useState(props?.api || props?.isLoading ? true : false);

    // ATUALIZA ESTADO DO LOADING SE RECEBER ALTERAÇÃO NO COMPONENTE PAI
    useEffect(() => {
        if(props?.isLoading !== undefined){
            setLoading(props?.isLoading);
        }
    },[props?.isLoading]);

    const customStyles = {     
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (base) => {
            return {
                ...base,
                width: 15,
                padding: '8px 0 8px 0',
            }
        },
        menu: (base) => {
            return {
                ...base,
                border: '1px solid #f9f9f9',
                boxShadow: '0 0 10px -5px rgb(0 0 0 / 50%)',
                padding: 0,
                width: "max-content",
                minWidth: "100%",
                zIndex:6
            };
        },
        loadingIndicator: (base) => {
            return {
                ...base,
                display: 'none!important',
            }
        },
        loadingMessage: (base) => {
            return {
                ...base,
                background: '#fff',
                minWidth:100
            }
        },
        menuList: (base) => {
            return {
                ...base,
                padding: 0,
                maxHeight: (props.smallList?400:'calc(100vh - 300px)'),
                marginRight: '0!important',
                background: '#fff'
            }
        },
        placeholder: (base) => {
            return {
                ...base,
                display: (props.placeholder?'':'none')
            }
        },
        valueContainer: (base) => {
            return {
                ...base,
                paddingLeft:0,
                paddingRight:4
            }
        },
        noOptionsMessage: (base) => {
            return {
                ...base,
                fontSize: 14,
                fontWeight: 400,
                background:'#fff'
            }
        },
        control: () => ({
            border: 0,
            boxShadow: 'none',
            backgroundColor: '#fff',
            borderRadius: 4,
            fontSize: (window.isMobile?16:13),
            fontWeight: 400,
            display: 'flex',
            cursor: 'pointer'
        }),
        option: (base, { isFocused }) => {
            return {
                ...base,
                borderBottom: 'none',
                padding: 10,
                fontSize: (window.isMobile?16:13),
                fontWeight: 400,
                cursor: 'pointer',
                backgroundColor: isFocused ? '#eff2f3' : '#fff',
                color: '#2a2e36!important',
                overflow: 'visible',
                minHeight: 40,
                maxWidth: 'none!important'
            };            
        }
    }

    // GET OPTIONS
    const handleGetOptions = () => {
        if(props?.api){
            if(options.length == 0){
                setLoading(true);

                axios({
                    method: 'get',
                    url: props?.api?.url,
                    params: props?.api?.params        
                }).then((response) => {
                    if(props?.api?.key_aux){
                        let key_aux = props?.api?.key_aux;
                        let response_aux = response.data;

                        for (let index = 0; index < key_aux?.length; index++) {
                            response_aux = response_aux[key_aux[index]];
                        }

                        setOptions(response_aux);
                    }else{
                        setOptions(response.data);
                    }

                    setLoading(false);
                });
            }
        }
    }

    // ZERA LISTA DE OPÇÕES PARA BUSCAR NOVAMENTE CASO RECEBA VALOR EM PROPS RELOAD
    useEffect(() => {
        if(props.reload && options.length > 0){
            setOptions([]);
            handleGetOptions();
        }
    },[props?.reload]);

    // VERIFICA SE A PROP OPTIONS RECEBEU ALTERAÇÃO PARA ATUALIZAR O ESTADO DAS OPTIONS
    useEffect(() => {
        if(props?.options){
            let options_aux = [];

            if(props.allowEmpty !== false){
                options_aux.push({value: '', label: ' '});
            }

            props.options.map((item, i) => {
                options_aux.push(item);
            });

            setOptions(options_aux);
        }
    },[props?.options]);

    // AJUSTE PARA FUNCIONAR CASO A API NÃO TRAGA UM VALUE E UM LABEL
    let tempOptions;
    if(options.length > 0){
        tempOptions = options;

        for (let index = 0; index < tempOptions.length; index++) {
            let element = tempOptions[index];
            
            if(props?.aux){
                element.value = element[props?.aux?.id];
                element.label = element[props?.aux?.nome];
            }else{
                element.value = (element?.id ? element?.id : element?.value);
                element.label = (element?.nome ? element?.nome : element?.label);
            }
        }
    }else{
        if(props?.api?.defaultValue){
            tempOptions = props?.api?.defaultValue;
        }
    }

    return(
        <div
            data-select
            className={
                style.box__select + ' ' + 
                (props.fullwith?'w-100':'') + ' ' + 
                (props.className?props.className:'') + ' ' + 
                (props.type=='checkbox'?style.checkbox:'') + ' ' +
                (focus?style.box__select_focus:'')+ ' ' +
                (props.disabled?style.disabled:'')+ ' ' +
                (props.readonly?style.readonly:'')+ ' ' +
                (props.loading ? style.loading : '') + ' ' +
                (props?.isRtl ? style.isRtl : '') + ' ' +
                'position-relative'
            }
            style={{
                display:(props.hide?'none':''),
            }}
            onClick={props?.onClick}
        >
            {(() => {
                if(!props?.loading){
                    return(
                        <>
                            {(() => {
                                if(props.label){
                                    return(
                                        <label htmlFor={ props.id }>
                                            { props.label }: { (props.required===false?'':'*') }
                                        </label>
                                    )
                                }
                            })()}

                            <Select
                                isSearchable={(window.isMobile?false:true)}
                                isLoading={loading}
                                openMenuOnFocus={true}
                                autoFocus={false}
                                defaultValue={ props.defaultValue }
                                options={ tempOptions }
                                className={props?.className}
                                styles={customStyles}
                                placeholder={ props.placeholder }
                                required={(props.required===false?false:true)}
                                menuPlacement={(props?.menuPlacement ? props?.menuPlacement : 'auto')}
                                isRtl={props?.isRtl}
                                value={ 
                                    (props.value && tempOptions?
                                        tempOptions.filter(option => 
                                            option.value == props.value
                                        )
                                    :
                                        ''
                                    )
                                }
                                onChange={props.onChange}
                                onMenuOpen={handleGetOptions}
                                onMenuClose={() => setPosTop(1000)}
                                noOptionsMessage={() => 'Nenhuma opção disponível'}
                                loadingMessage={() => <Loader />} 
                                // menuIsOpen={true} // QUANDO PRECISAR EDITAR O CSS, ESSE ATRIBUTO MANTÉM O SELECT ABERTO
                            />

                            <input
                                type="text"
                                name="hidden"
                                autoComplete="off"
                                style={{ opacity: 0, position: 'absolute', width: 'calc(100% - 20px)', height: '100%', pointerEvents: 'none' }}
                                value={ 
                                    (props.value&&options?
                                        options.filter(option => 
                                            option.value == props.value
                                        )
                                    :
                                        ''
                                    )
                                }
                                onChange={props.onChange}
                                required={(props.required===false?false:true)}
                            />
                        </>
                    )
                }
            })()}
        </div>
    );
}
