import { useState, useEffect, useRef, useContext } from 'react';
import { GlobalContext } from "../../../context/Global";

import style from './Table.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../loader';
import axios from 'axios';
import Tbody from './tbody';
import Tr from './tr';
import Td from './tbody/td';
import Th from './thead/th';
import Thead from './thead';

export default function Table(props){
    // CONTEXT
    const { filter, handleSetFilter } = useContext(GlobalContext);   

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    },[]);
    
    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }

    const tableRef = useRef();
    const [overflow, setOverflow] = useState(false);
    var class_text_limit;       

    if(props.text_limit===false){
        class_text_limit = '';
    }else{
        if(props.text_limit == 10) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_10;
        }else if(props.text_limit == 20) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_20;
        }else if(props.text_limit == 30) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_30;
        }else if(props.text_limit == 40) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_40;
        }else if(props.text_limit == 50) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_50;
        }else if(props.text_limit == 60) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_60;
        }else if(props.text_limit == 70) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_70;
        }else if(props.text_limit == 80) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_80;
        }else if(props.text_limit == 90) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_90;
        }else if(props.text_limit == 100) {
            class_text_limit = style.text__limit + ' ' + style.text__limit_100;
        }else{
            class_text_limit = style.text__limit + ' ' + style.text__limit_30;
        }
    }

    // VERIFICA SE A TABELA É MENOR QUE WINDOW E REMOVE O OVERFLOW
    useEffect(() => {
        let windowHeight = window.innerHeight - 380;    

        if(tableRef?.current?.clientHeight && tableRef?.current?.clientHeight < windowHeight){
            setOverflow(false);
        }else{
            setOverflow(true);
        }
    },[tableRef?.current?.clientHeight]);

    // VAR
    var reload = true;

    // ESTADOS
    const [hasMore, setHasMore] = useState((props.hasMore === false ? false : true));
    const [items, setItems] = useState('');
    const [page, setPage] = useState((props.pages ? 1 : 0)); // SE RECEBER A PROPS PAGES (LARAVEL)
    const [refresh, setRefresh] = useState(props?.reload);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(filter){
            if(props?.onLoad){
                props.onLoad([]);
            }
            loadList(true);
            setPage(props.pages ? 1 : 0);

            if(props?.callback){
                props.callback({
                    page: props.pages ? 1 : 0
                });
            }
        }
    },[filter]);

    useEffect(() => {
        if(props?.search || props?.search === ''){
            const delayDebounceFn = setTimeout(() => {
                loadList(true);
                setPage(props.pages ? 1 : 0);
            },300);

            return () => clearTimeout(delayDebounceFn)
        }
    }, [props?.search]);

    useEffect(() => {
        if(!filter){
            if(refresh || refresh === ''){
                loadList(true);
                setPage(props.pages ? 1 : 0);

                if(props?.callback){
                    props.callback({
                        page: props.pages ? 1 : 0
                    });
                }
            }
        }
    },[refresh]);

    useEffect(() => {
        if(props?.reload || props?.reload === ''){
            setItems([]);
            props.onLoad([]);
            setItems([]);
            setRefresh(props.reload);
        }
    },[props?.reload])

    let parametros;
    if(props.params){
        parametros = {...props.params, page};
    }else{
        parametros = page;
    }

    // CARREGA REGISTROS
    function loadList(reload){
        handleSetFilter(false);

        if(reload){
            setHasMore(true);
            setPage(props.pages ? 1 : 0);            

            if(props?.callback){
                props.callback({
                    page: props.pages ? 1 : 0
                });
            }
        }

        // SETA ESTADO DE CARREGANDO PARA DESABILITAR TH'S
        setLoading(true);

        axios({
            method: 'get',
            url: props?.api,
            params: (reload ? props.params : parametros)
        }).then((response) => {
            // REMOVE ESTADO DE CARREGANDO PARA HABILITAR AS TH'S NOVAMENTE
            setLoading(false);

            let key_aux = props?.key_aux;
            let response_aux = response.data;

            for (let index = 0; index < key_aux?.length; index++) {
                response_aux = response_aux[key_aux[index]];
            }

            if(reload){
                if(props?.key_aux){
                    setItems(response_aux);
                    props.onLoad(response_aux);
                }else{
                    setItems(response.data);
                    props.onLoad(response.data);
                }
                setPage(props.pages ? 2 : 1);

                if(props?.callback){
                    props.callback({
                        page: props.pages ? 2 : 1
                    });
                }
            }else{
                if(props?.key_aux){
                    setItems(items => [...items, ...response_aux]);
                    props.onLoad(items => [...items, ...response_aux]);
                }else{
                    setItems(items => [...items, ...response.data]);
                    props.onLoad(items => [...items, ...response.data]);
                }
                setPage(page+1);

                if(props?.callback){
                    props.callback({
                        page: page+1
                    });
                }
            }
            
            reload = false;         

            // VERIFICA SE RECEBE A PROPS "PAGES", ESPECÍFICA PARA O LARAVEL
            if(props.pages){
                if(!response?.data?.links?.next && !response?.data?.next_page_url){
                    setHasMore(false);
                }
            }else{
                if(props?.key_aux){
                    if(response.data[props?.key_aux].data.length == 0 || response.data[props?.key_aux].data.length < (props.limit ? props.limit : 50) || props.hasMore === false){
                        setHasMore(false);                
                    }
                }else if(props?.key_aux_2){
                    if(response.data[props?.key_aux_2].length == 0 || response.data[props?.key_aux_2].length < (props.limit ? props.limit : 50) || props.hasMore === false){
                        setHasMore(false);                
                    }
                }else{
                    if(response.data.length == 0 || response.data.length < (props.limit ? props.limit : 50) || props.hasMore === false){
                        setHasMore(false);                
                    }
                }
            }
            
            setRefresh(false);
            handleSetFilter(false);
        }).catch(() => {
            // toast('Erro na requisição. Tente novamente em alguns minutos.');
            setHasMore(false);
        });
    }

    return(
        <>
            <InfiniteScroll
                dataLength={(props.limit ? props.limit : 50) * page}
                hasMore={hasMore}
                next={() => loadList(reload=false)}
                scrollableTarget={'table_'+props.id}
            >
                <div
                    ref={tableRef}
                    id={'table_'+props?.id}
                    data-fullheight={(props.fullHeight?true:false)}
                    className={style.tableContainer + ' ' + (props.fixed===false?style.tableContainerNoFixed:style.tableContainerFixed) + ' ' + (props.border === false ? style.no__border : '') + ' ' + (props.fullHeight===true?style.tableContainerFullHeight:'') + ' ' + (props.fullwith===true?'w-100':'') + ' ' + (props.search===false?style.without__search:'') + ' ' + (props.rightFixed?style.rightFixed:'') + ' ' + (props.leftFixed ? style.leftFixed : '') + ' ' + (props.className?props.className:'')}
                >
                    <table
                        className={'w-100 ' + (props?.bordered ? style.bordered : '') + ' ' + (props.text_limit === false ? '' : style.text__limit) + ' ' + class_text_limit + ' ' + (props.text_limit===false?style.without__overflow:'')}
                        onLoad={props?.onLoad}
                    >
                        {(props?.thead ? 
                            <Thead>
                                <Tr>
                                    {props?.thead.map((item, i) => {
                                        if(item.enabled !== false){
                                            return(
                                                <Th
                                                    key={'th_'+i}
                                                    api={item?.api}
                                                    items={item?.items}
                                                    id={item?.id}
                                                    align={item?.align}
                                                    name={item?.name}
                                                    mask={item?.mask}
                                                    format={item?.format}
                                                    type={item?.type}
                                                    start={item?.start}
                                                    end={item?.end}
                                                    onChange={item?.onChange}
                                                    width={item?.width}
                                                    className={item?.className}
                                                    filter={item?.filter}
                                                    filtered={item?.filtered}
                                                    colspan={item?.colspan}
                                                    search={item?.search}
                                                    disabled={loading}
                                                    onClick={item?.onClick}
                                                >
                                                    {item?.label}
                                                </Th>
                                            )
                                        }
                                    })}
                                </Tr>

                                {(props?.thead2 ? 
                                    <Tr>
                                        {props?.thead2.map((item, i) => {
                                            if(item.enabled !== false){
                                                return(
                                                    <Th
                                                        key={'th_'+i}
                                                        api={item?.api}
                                                        items={item?.items}
                                                        id={item?.id}
                                                        align={item?.align}
                                                        name={item?.name}
                                                        mask={item?.mask}
                                                        format={item?.format}
                                                        type={item?.type}
                                                        start={item?.start}
                                                        end={item?.end}
                                                        onChange={item?.onChange}
                                                        width={item?.width}
                                                        className={item?.className}
                                                        filter={item?.filter}
                                                        filtered={item?.filtered}
                                                        colspan={item?.colspan}
                                                        hide={item?.hide}
                                                        limit={item?.limit}
                                                        params={item?.params}
                                                        reload={item?.reload}
                                                        disabled={props?.api === false ? false : loading}
                                                    >
                                                        {item?.label}
                                                    </Th>
                                                )
                                            }
                                        })}
                                    </Tr>
                                :'')}
                            </Thead>
                        :'')}

                        {props.children}

                        {(hasMore && props.api?
                            <Tbody>
                                <Tr>
                                    <Td colspan="100%" width={1} align="center">
                                        <Loader show={true} align={props?.loadAlign} />
                                    </Td>
                                </Tr>
                            </Tbody>
                        :'')}
                        {(props?.api && !hasMore && items?.length == 0 ? 
                            <Tbody>
                                <Tr empty={true}></Tr>
                            </Tbody>
                        :'')}
                    </table>  
                </div>
            </InfiniteScroll>
        </>
    );
}
