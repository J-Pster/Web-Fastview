import { useEffect, useState, useRef } from "react";
import style from "./FilterCheckbox.module.scss";
import Input from "../form/input";
import axios from "axios";
import Icon from "../icon";
import Loader from "../loader";
import InfiniteScroll from "react-infinite-scroll-component";

export default function FilterCheckbox(props) {
  const [isFiltred, setIsFiltred] = useState(false);
  const [filterValue, setFilterValue] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [listCheckbox, setListCheckbox] = useState([]);
  const [selectedVals, setSelectedVals] = useState([]);
  const [reloadFilter, setReloadFilter] = useState("");
  const boxFilter = useRef(null);
  const [qtdSelected, setQtdSelected] = useState(0);
  const [hasMore, setHasMore] = useState((props.hasMore === false ? false : true));
  const [page, setPage] = useState(props?.api?.key_aux?.includes('data') ? 1 : 0);
  const [search, setSearch] = useState(true);
  const [loading, setLoading] = useState((props?.api ? true : false));

  //FUNÇÃO PARA DETECTAR O CLIQUE FORA DO ELEMENTO
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
  }, []);

  //FUNÇÃO PARA DETECTAR QUANDO O USUÁRIO PRESSIONAR A TECLA ESC
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
  }, []);

  //LISTA CHECKBOXS
  function get_checkbox(reload){
    let parametros;
    if(props?.api?.params){
      parametros = {...props?.api?.params, page: (reload ? props?.api?.key_aux?.includes('data') ? 1 : 0 : page), filter_search: filterValue};
    }else{
      parametros = {page};
    }

    if(props.api){
      if(reload){
        setHasMore(true);
          setPage(props?.api?.key_aux?.includes('data') ? 1 : 0)
      }

      axios({
        method: 'get',
        url: (props?.api?.url ? props?.api?.url : props?.api),
        // params: (reload ? props?.api?.params : parametros)
        params: parametros
      }).then((response) => {
        let key_aux = props?.api?.key_aux;
        let response_aux = response.data;

        for (let index = 0; index < key_aux?.length; index++) {
            response_aux = response_aux[key_aux[index]];
        }

        if(reload){
          setListCheckbox(response_aux);
          setPage(props?.api?.key_aux?.includes('data') ? 2 : 1);
        }else{
          setListCheckbox(options => [...options, ...response_aux]);
          setPage(page+1);
        }

        setSearch(false);
        setLoading(false);

        if(response_aux.length == 0 || response_aux.length < (props?.limit && props?.api?.url ? props?.limit : 50) || props.hasMore === false){
          setHasMore(false);                
        } 
      });
    }
    if (props.options) {
      setListCheckbox(props.options);
    }
  }

  // FAZ O GET SOMENTE QUANDO ABRIR O FILTRO
  useEffect(() => {
    if(filterActive && search){
      get_checkbox(true);
    }
  },[filterActive]);

  // BUSCA NOVAMENTE CASO RECEBA A PROPS "RELOAD"
  useEffect(() => {
    if(!search){
      setSearch(true);
      setLoading(true);

      if(filterActive){
        get_checkbox(true);
      }
    }
  },[props?.api?.reload]);

  // useEffect(() => {
  //   if(!firstLoad){
  //     get_checkbox();     
  //   }
  //   setFirstLoad(false);
  // }, [props?.api, props?.options, props?.reload]);

  const handleClickOutside = (e) => {
    if(boxFilter){
      if (!boxFilter?.current?.contains(e.target)) {
        setFilterActive(false);
      }
    }
  };

  const handleFilterActive = (e) => {
    if(filterActive){
      setFilterActive(false);
    }else{
      setFilterActive(true);
      if(props?.id && !window.isMobile){
        setTimeout(() => {
          document.getElementById('filter_header_'+props?.id).focus();
        },100);
      }
    }    
  }

  // SEMPRE QUE TIVER TROCA NO PROPS VALUE ATUALIZA O VALOR SELECIONADO DO COMPONENTE
  useEffect(() => {
    if(props?.value){
      setSelectedVals(props?.value);     
    }
    setQtdSelected(props?.value?.length);
  },[props?.value]);

  const escFunction = (e) => {
    if (e.key === "Escape") {
      setFilterActive(false);
    }
  };

  function handleCheck(e) {
    if (e.target.checked) {
        const newSelectedVals = [...selectedVals, e.target.value];

        setSelectedVals(newSelectedVals);
        props.onChangeClose(newSelectedVals);

        setQtdSelected(newSelectedVals.length);
    } else {
        const newSelectedVals = selectedVals.filter(
            (item) => item !== e.target.value
        );

        setSelectedVals(newSelectedVals);
        props.onChangeClose(newSelectedVals);

        setQtdSelected(newSelectedVals.length);
    }
  }

  // SETA VALOR DE BUSCA
  const handleBusca = (e) => {
    setFilterValue(e.target.value);
  }

  // SETA VALOR DE BUSCA
  const handleSetBusca = (e) => {
    if(props.name && !props.api && !props.items){
        // if(e.key === 'Enter'){
        //     handleSetFilter(true);
        //     props.onChange(e);
        // }
    }

    if(props?.options === false){
      if(e.key === 'Enter'){
        e.preventDefault();
        props.onChangeClose(e.target.value);   
      }      
    }

    if(props?.api?.url){
        if(e.key === 'Enter'){
            setListCheckbox([]);
            setHasMore(true);
            setLoading(true);
            setSearch(true);
            get_checkbox(true);
        }
    }
  }

  // SE O VALOR DO FILTRO SOFRER ALTERAÇÃO, EXECUTA A FUNÇÃO DE BUSCA DEPOIS DE 300 MS
  useEffect(() => {
    if(filterValue || filterValue === ''){
        const delayDebounceFn = setTimeout(() => {
          if(props?.options === false){
            props.onChangeClose(filterValue);   
          }

          if(props?.api?.url){
            setListCheckbox([]);
            setHasMore(true);
            setLoading(true);
            setSearch(true);
            get_checkbox(true);
          }
        },300);

        return () => clearTimeout(delayDebounceFn)
    }
  }, [filterValue]);

  return (
    <div data-filter={true} className={'position-relative '+(props.hide?'d-none':'d-flex d-lg-inline-block')}>
      <span
        className={style.filter + ' ' + (qtdSelected?style.filter__filtered:'') + ' ' + (filterActive === true ? style.filter__active : "") + ' ' + (isFiltred === true ? style.filter__filtred : '')}
        onClick={handleFilterActive}
      >
        {props.children}

        {(qtdSelected && props?.options !== false ?' ('+qtdSelected+' selec.)':'')}

        {(props?.options === false && filterValue ?' ('+filterValue+')':'')}

        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          focusable="false"
          className="css-tj5bde-Svg"
        >
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
      </span>

      <div
        className={
          style.boxFilter +
          " " +
          (filterActive === true ? style.boxFilter__active : "")
        }
        ref={boxFilter}
      >
        <div className={style.boxFilter__body}>
          <div className="d-flex align-items-center">
            <Input
              type="text"
              name="filtro"
              id={'filter_header_'+props?.id}
              placeholder="Buscar..."
              fullwith={true}
              icon="search"
              value={filterValue}
              onKeyDown={handleSetBusca}
              onChange={handleBusca}
              autocomplete="off"
              required={false}
            />

            {(window.isMobile?<Icon type="reprovar" title="Fechar" className="ms-3" onClick={() => setFilterActive(false)} />:'')}
          </div>
        </div>

        {(props?.api || props.options ?
          <InfiniteScroll
            dataLength={(props?.limit ? props?.limit : 50) * page}
            hasMore={hasMore}
            next={() => get_checkbox(false)}
            scrollableTarget={'chekbox_items_' + props?.id}
          >    
            <div
              className={style.checkbox__items + ' ' + (props?.textCapitalize === false ? style.no_capitalize : '')}
              id={'chekbox_items_'+props?.id}
            >
              {(loading ?
                <Loader />
              : 
                listCheckbox.filter((item) => {
                  if (!filterValue || props?.api?.url) return true;
                  if ((item.label ? item.label : item.nome).toLowerCase().includes(filterValue.toLowerCase())){
                    return true;
                  }
                }).map((item, i) => {
                  let value_aux;
                  let label_aux;

                  if(item.value){
                    value_aux = item.value;
                  }else{
                    value_aux = item.id;
                  }

                  if(item.label){
                    label_aux = item.label;
                  }else{
                    label_aux = item.nome
                  }

                  return (
                    <Input
                      key={'filter_checkbox_'+value_aux}
                      type="checkbox"
                      label={label_aux}
                      obs={(item?.nome_emp && props?.grupo ? '(' + item?.nome_emp + ')' : '')}
                      id={(props.name ? props.name+'_'+value_aux : 'filtro_'+value_aux)}
                      value={value_aux}
                      checked={(typeof selectedVals === 'object' ? (selectedVals.includes(value_aux.toString()) ? true : false) : false)}
                      onChange={handleCheck}
                    />
                  );
                })
              )}
            </div>
          </InfiniteScroll>
        :'')}
      </div>
    </div>
  );
}
