import { useEffect, useState, useRef, useContext } from "react";
import { GlobalContext } from "../../../../../context/Global";

import { MdArrowDropDown } from "react-icons/md";
import style from './Th.module.scss';
import { FaTimes } from "react-icons/fa";
import Input from "../../../form/input";
import axios from "axios";
import Tippy from "@tippyjs/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../../loader";
import Button from "../../../button";
import toast from "react-hot-toast";

export default function Th(props){
    // CONTEXT
    const {
        handleSetFilter
    } = useContext(GlobalContext);

    // ESTADOS
    const [filterActive, setFilterActive] = useState(false);
    const boxFilter = useRef(null);
    const [leftPos, setLeftPos] = useState(0);
    const [topPos, setTopPos] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedVals, setSelectedVals] = useState([]);
    const [busca, setBusca] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const [hasMore, setHasMore] = useState((props.hasMore === false ? false : true));
    const [page, setPage] = useState(0);
    const [startValue, setStartValue] = useState(props?.start?.value);
    const [endValue, setEndValue] = useState(props?.end?.value);

    //FUNÇÃO PARA DETECTAR O CLIQUE FORA DO ELEMENTO
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        //inputFilter.current.focus()
    }, []);

    //FUNÇÃO PARA DETECTAR QUANDO O USUÁRIO PRESSIONAR A TECLA ESC
    useEffect(() => {
        document.addEventListener('keydown', escFunction, false)
    }, []);

    // DETECTA CLIQUE FORA DO BOX
    const handleClickOutside = (e) => {
        if(boxFilter.current){
            if(!boxFilter?.current?.contains(e.target)){
                setFilterActive(false);
            }
        }
    }

    const escFunction = (e) => { 
        if(e.key === 'Escape'){
            setFilterActive(false);
        }
    }

    // PEGAR POSIÇÃO DO FILTRO CLICADO
    function getPos(e){
        setLeftPos((e.pageX + 280 > window.outerWidth ? (window.outerWidth - 320) : e.pageX));
        setTopPos(e.pageY - window.scrollY);
    }

    // FUNÇÃO PARA LIMPAR FILTROS
    function handleClearFilter(){
        setStartValue('');
        setEndValue('');

        if(props?.start?.onChange){
            props?.start?.onChange('');
        }

        if(props?.end?.onChange){
            props?.end?.onChange('');
        }

        handleSetFilter(true);
    }

    // FUNÇÃO PARA BUSCAR ITENS DO CHECKBOX
    function get_options(reload){
        if(props?.api?.params){
            // VERIFICA SE NOS PARAMETROS DO FILTRO POSSUI O CAMPO "TABLES"
            if(props?.api?.params?.tables){
                let filter_aux = props?.api?.params?.tables[0];

                // VERIFICA SE POSSUI O CAMPO FILTER
                if(props?.api?.params?.tables[0]?.filter){
                    if(busca){                        
                        filter_aux.filter.nome = busca;
                    }else{
                        if(filter_aux.filter.nome){
                            delete filter_aux.filter.nome;
                        }
                    }
                }else{
                    if(busca){
                        filter_aux.filter = {};
                        filter_aux.filter.nome = busca;
                    }else{
                        if(filter_aux.filter){
                            delete filter_aux.filter.nome;
                        }
                    }
                }
            }
        }

        if(props?.api){
            if(reload){
                setHasMore(true);
                setPage(0);
            }

            let param_aux = {
                ...props?.api?.params,
                page: (props?.api?.url ? (reload ? 0 : page) : ''),
                limit: (props?.api?.url ? (props?.limit ? props?.limit : 50) : ''),
                filter_search: busca ? busca : undefined
            }

            axios({
                method: 'get',
                url: (props?.api?.url ? props?.api?.url : props?.api),
                params: param_aux
            }).then((response) => {        
                let key_aux = props?.api?.key_aux;
                let response_aux = response.data;

                for (let index = 0; index < key_aux?.length; index++) {
                    response_aux = response_aux[key_aux[index]];
                }

                if(reload){ 
                    setOptions(response_aux);
                    setPage(1);
                }else{
                    setOptions(options => [...options, ...response_aux]);
                    setPage(page+1);
                }
                
                reload = false;      
               
                if(response_aux.length == 0 || response_aux.length < (props?.limit && props?.api?.url ? props?.limit : 50) || props.hasMore === false){
                    setHasMore(false);                
                } 
            });
        }
    }

    useEffect(() => {  
        if(filterActive){
            if(page == 0){
                get_options(true);
            }
        }
    },[filterActive]);

    useEffect(() => {
        setPage(0);
        setOptions([]);
    },[props?.reload]);

    // SETA VALORES SELECIONADOS
    function handleCheck(e){
        if (e.target.checked) {
            const newSelectedVals = [...selectedVals, e.target.value];

            setSelectedVals(newSelectedVals);
            
            if(props.onChange){
                props.onChange(newSelectedVals);
            }
        } else {
            const newSelectedVals = selectedVals.filter(
                (item) => item !== e.target.value
            );
    
            setSelectedVals(newSelectedVals);
            
            if(props.onChange){
                props.onChange(newSelectedVals);
            }
        }        

        handleSetFilter(true);
    }

    // SETA VALORES PADRÃO QUE VEM PELA PROPS FILTER
    useEffect(() => {
        if(props.filtered && firstLoad){
            setSelectedVals(props.filtered);
            setFirstLoad(false);
        }
    },[]);

    // SETA VALOR DE BUSCA
    const handleBusca = (e) => {
        setBusca(e.target.value);
    }

    // SETA VALOR DE BUSCA
    const handleSetBusca = (e) => {
        if(props.name && !props.api && !props.items){
            // if(e.key === 'Enter'){
            //     handleSetFilter(true);
                
            //     if(props.onChange){
            //         props.onChange(busca);
            //     }
            // }
        }

        if(props?.api?.url){
            if(e.key === 'Enter'){
                setOptions([]);
                setHasMore(true);
                get_options(true);
            }
        }
    }

    // SE O VALOR DO FILTRO SOFRER ALTERAÇÃO, EXECUTA A FUNÇÃO DE BUSCA DEPOIS DE 300 MS
    useEffect(() => {
        if(busca || busca === ''){
            const delayDebounceFn = setTimeout(() => {
                if(props.name && !props.api && !props.items){
                    handleSetFilter(true);
                    props.onChange(busca);
                }

                if(props?.api?.url){
                    setOptions([]);
                    setHasMore(true);
                    get_options(true);
                }
            },300);

            return () => clearTimeout(delayDebounceFn)
        }
    }, [busca]);

    // SETA FILTRO ABERTO
    const handleSetFilterActive = (e) => {
        setFilterActive((filterActive===true?false:true));
        getPos(e);
        let table = document.getElementsByClassName('infinite-scroll-component__outerdiv');
        if(window.isMobile){
            table[0].style.zIndex = 6;
        }
    }

    const handleSetFilterInactive = () => {
        setFilterActive(false);
        let table = document.getElementsByClassName('infinite-scroll-component__outerdiv');
        table[0].style.zIndex = 4;
    }

    // ATUALIZA ESTADO DO START VALUE SE SOFRER ALTERAÇÃO NO COMPONENTE PAI
    useEffect(() => {
        setStartValue(props?.start?.value);
    },[props?.start?.value]);

    // ATUALIZA ESTADO DO END VALUE SE SOFRER ALTERAÇÃO NO COMPONENTE PAI
    useEffect(() => {
        setEndValue(props?.end?.value);
    },[props?.end?.value]);

    // STYLE CUSTOMIZADO
    let style_aux = {};

    if(props?.minWidth){
        style_aux = {
            ...style_aux,
            minWidth: props?.minWidth
        }
    }

    if(props?.style){
        style_aux = {
            ...style_aux,
            ...props?.style
        }
    }

    // CORPO DO COMPONENTE
    if(!window.isMobile || (window.isMobile && props?.mobile !== false)){
        return(
            <th
                id={props?.id ? 'th_'+props?.id : undefined}
                className={ style.tableCell + ' ' + (props.wrap ? style.wrap : '') + ' ' + (props?.disabled ? style.disabled : '') + ' ' + (props?.active === true ? style.active : '') + ' ' + props?.className + ' ' + (props.align?' text-'+props.align:'') + ' ' + (props.hide?'d-none':'')}
                width={props.width}
                colSpan={props?.colspan}
                onClick={props.disabled ? (() => toast('Ainda carregando, aguarde')) : props?.onClick}
                style={style_aux}
            >
                <span
                    className={ ((props.name || props.api || props.items || props.type === 'date') && props?.filter !== false ? style.filter : '')+ ' ' + (filterActive===true?style.filter__active:'') + ' ' + (selectedVals.length>0 || startValue || endValue ? style.filter__filtred:'') + ' ' + (props.filtered && selectedVals.length > 0 || (busca && !props.api && !props.items) ? style.filter__filtred : '') + ' ' + (props?.cursor === 'pointer' ? 'cursor-pointer': '') }
                    onClick={(e) => handleSetFilterActive(e)}
                >
                    <Tippy content={props?.title} disabled={(props.title ? false : true)}>
                        <span
                            className={props?.text_limit ? style.text_limit : ''}
                            style={{maxWidth: (props?.text_limit ? props?.text_limit+'ch' : '100%' )}}
                        >
                            {props.children}
                        </span>
                    </Tippy>
                    {((props.name || props.api || props.items || props.type === 'date') && props?.filter !== false ? <MdArrowDropDown /> : '')}
                </span>

                {((props.name || props.api || props.items || props.type === 'date') && props?.filter !== false ?
                    <div
                        className={ style.boxFilter + ' ' + (filterActive===true?style.boxFilter__active:'') }
                        ref={ boxFilter }
                        style={{top:topPos, left: leftPos}}
                    >
                        <div className={ style.boxFilter__header }>
                            <span className={ style.boxFilter__title }>Filtro</span>
                            <FaTimes className={ style.boxFilter__close } onClick={() => handleSetFilterInactive()} />
                        </div>

                        {(() => {
                            if(props.type==='date'){ //FILTRO DE DATA
                                return(
                                    <>
                                        <div className={ style.boxFilter__body }>
                                            <Input
                                                type="date"
                                                format={props?.format}
                                                name="filtro_inicio"
                                                label={(props?.end ? 'De' : 'Data')}
                                                fullwith={true}
                                                className={(props?.end ? 'mb-2' : '')}
                                                onChange={props?.start?.onChange}
                                                value={startValue} 
                                                required={false}
                                            />

                                            {(props?.end ?
                                                <Input
                                                    type="date"
                                                    name="filtro_fim"
                                                    format={props?.format}
                                                    label="Até"
                                                    fullwith={true}
                                                    onChange={props?.end?.onChange}
                                                    value={endValue} 
                                                    required={false}
                                                />
                                            :'')}

                                            <Button
                                                type="submit"
                                                className="mt-2"
                                                onClick={handleClearFilter}
                                            >
                                                Limpar
                                            </Button>
                                        </div>
                                    </>
                                )
                            }else{ //FILTRO PADRÃO
                                if(props.search!==false){
                                    return(
                                        <>
                                            <div className={ style.boxFilter__body }>
                                                <Input
                                                    placeholder="Busca..."
                                                    type='text'
                                                    mask={props?.mask}
                                                    maskChar=""
                                                    name={'busca_'+(props.name?props.name:'filtro')}
                                                    value={busca}
                                                    required={false}
                                                    onKeyDown={handleSetBusca}
                                                    onChange={handleBusca}
                                                />
                                            </div>
                                        </>
                                    )
                                }
                            }
                        })()}

                        {(() => {
                            if(props.type !== 'date'){
                                return(               
                                    <InfiniteScroll
                                        dataLength={(props?.limit ? props?.limit : 50) * page}
                                        hasMore={hasMore}
                                        next={() => get_options(false)}
                                        scrollableTarget={'th_options_' + props?.id}
                                    >          
                                        <div
                                            id={(props?.id ? 'th_options_' + props?.id : 'th_options')}
                                            className={style.checkbox__items}
                                            style={{display:(props.items||props.api?'block':'none'), borderTop:(props.search===false?'none':'')}}
                                        >
                                            {((props.api ? options : props.items)?.filter(item => {
                                                    if (!busca || props?.api?.url) return true
                                                    if ((item.label ? item.label : item.nome).toLowerCase().includes(busca.toLowerCase())) {
                                                        return true
                                                    }
                                                }).map((item)=>{
                                                    let label_aux;
                                                    let value_aux;

                                                    if(item.label){
                                                        label_aux = item.label;
                                                    }else{
                                                        label_aux = item.nome;
                                                    }

                                                    if(item.value){
                                                        value_aux = item.value;
                                                    }else{
                                                        value_aux = item.id;
                                                    }

                                                    if(label_aux && value_aux){
                                                        return(
                                                            <Input 
                                                                key={(props.name?props.name:'option')+'_'+value_aux}
                                                                id={(props.name?props.name:'option')+'_'+value_aux}
                                                                type='checkbox'
                                                                checked={(selectedVals.includes(value_aux.toString()) ? true : false)}
                                                                label={label_aux}
                                                                obs={(item.nome_aux ? item.nome_aux : '')}
                                                                value={value_aux}
                                                                onChange={handleCheck}
                                                            />
                                                        )
                                                    }
                                                })
                                            )}

                                            {(hasMore && (props?.api?.url || props?.api) ?
                                                <div className="d-block text-center w-100">
                                                    <Loader />
                                                </div>
                                            :'')}
                                        </div>
                                    </InfiniteScroll>
                                )
                            }
                        })()}
                    </div>
                :'')}
            </th>        
        );
    }
}
