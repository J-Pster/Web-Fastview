import { useState, useContext } from "react";
import { ChecklistContext } from "../../../context/Checklist";
import { useNavigate } from "react-router-dom";


import FilterCheckbox from "../../../components/body/filterCheckbox";
import Input from "../../../components/body/form/input";
import SelectReact from "../../../components/body/select";
import { useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "../../../context/Global";
import { debounce } from "lodash";

export default function Filter(props){    
    const navigate = useNavigate();

    // CONTEXT
    const {
        editView,
        handleSetEditView,
        filterSupervisao,
        handleSetFilterSupervisao,
        filterDate,
        filterDateMonth,
        handleSetFilterDate,
        handleSetFilterDateMonth,
        handleSetFilterEmpreendimento,
        handleSetFilterLoja,
        handleSetFilterStatus,
        handleSetFilterStatusSupervisor,
        handleSetPageError,
        optionsSupervisao,
        handleSetOptionsSupervisao,
        view,
        handleSetView,
        filterEmpreendimento
    } = useContext(ChecklistContext);

    const {handleSetFilter} = useContext(GlobalContext);

    // AJUSTE RELATÓRIO
    useEffect(() => {
        handleSetFilter(true);
    },[]);

    // ESTADOS
    const [firstLoad, setFirstLoad] = useState(true);
    const [filterVisualizacao, setFilterVisualizacao] = useState(1);

    // OPTIONS STATUS
    const optionsStatus = [
        {value: '0', label: 'Sem avaliação'},
        {value: 1, label: 'Aprovado'},
        {value: 2, label: 'Reprovado'}
    ];

    // OPTIONS STATUS
    const optionsVisualizacao = [
        {value: 1, label: 'Fotos'},
        {value: 2, label: 'Macro'}
    ];

    // FILTRA EMPREENDIMENTO
    const handleFilterEmp = (e) => {
        handleSetFilterEmpreendimento(e);    
    }

    // FILTRA LOJA
    const handleFilterStore = (e) => {
        handleSetFilterLoja(e);    
    }

    // FILTRA STATUS
    const handleFilterStatus = (e) => {
        handleSetFilterStatus(e);    
    }

    // FILTRA STATUS
    const handleFilterStatusSupervisor = (e) => {
        handleSetFilterStatusSupervisor(e);    
    }

    // TROCA VISUALIZAÇÃO
    const handleSetVisualizacao = (e) => {
        handleSetView(e);
        if(e == 1){
            navigate("/systems/checklist-laravel-react/supervisao/");            
        }else if(e== 2){
            navigate("/systems/checklist-laravel-react/macro/");
        }
    }

    // OPTIONS DO SELECT CATEGORIAS
    useEffect(() => {        
        
        // GET OPTIONS SUPERVISÕES
        if(optionsSupervisao.length == 0){
            axios({
                method: 'get',
                url: window.backend+'/api/v1/checklists/',
                params: {
                    no_paginated: 1
                }
            }).then((response) => {
                if(response.data.data.length>0){
                    handleSetOptionsSupervisao(response?.data?.data);

                    if(firstLoad){
                        setFirstLoad(false);
                        handleSetFilterSupervisao([response?.data?.data[0]?.id?.toString()]);
                    }
                }else{
                    handleSetPageError(true);
                }
            });
        }
    },[]);

    // NÍVEL DE PERMISSÃO
    let np_aux;

    if(window.rs_permission_apl === 'lojista'){
        np_aux = 1;
    }else if(window.rs_permission_apl === 'gerente'){
        np_aux = 2;
    }else if(window.rs_permission_apl === 'supervisor'){
        np_aux = 3;
    }else if(window.rs_permission_apl === 'master'){
        np_aux = 4;
    }else{
        np_aux = 0;
    }

    return(
        <>
            <SelectReact
                placeholder="Visualização"
                options={optionsVisualizacao}
                value={view}
                allowEmpty={false}
                onChange={(e) => handleSetVisualizacao(e.value)}
            ></SelectReact>

            {(!window.rs_id_lja || window.rs_id_lja == 0 ?
                <FilterCheckbox
                    name="filter_store"
                    api={{
                        url: window.host_madnezz + '/systems/integration-react/api/list.php?do=headerFilter',
                        params: {
                          filters: [{filter: 'store'}],
                          empreendimento_id: filterEmpreendimento,
                          limit: 50,
                          np: true
                        },
                        key_aux: ['store']
                    }}
                    onChangeClose={debounce((e) => handleFilterStore(e), 500)}                    
                >
                    Loja
                </FilterCheckbox>
            :'')}

            {(window.rs_id_grupo > 0 && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ?
                <FilterCheckbox
                    name="filter_grupo"
                    api={{
                        url: window.backend + "/api/v1/utilities/filters/grupo-empreendimento?do=select&component=grupo_empreendimento&np="+np_aux+"&sistema_id="+window.rs_sistema_id+"&limit=false&key_aux=data",
                        key_aux: ['data']
                    }}
                    onChangeClose={debounce((e) => handleFilterEmp(e), 500)}
                    value={filterEmpreendimento}
                >
                    Empreendimento
                </FilterCheckbox>
            :'')}

            <FilterCheckbox
                name="filter_check"
                options={optionsSupervisao}
                value={filterSupervisao}
                onChangeClose={debounce((e) => handleSetFilterSupervisao(e), 500)}
            >
                Filtrar Supervisão
            </FilterCheckbox>

            {/* <SelectReact
                placeholder="Filtrar Supervisão"
                options={optionsSupervisao}
                value={filterSupervisao}
                allowEmpty={false}
                onChange={(e) => handleSetFilterSupervisao(e.value)}
            ></SelectReact> */}

            <FilterCheckbox
                name="filter_status"
                options={optionsStatus}
                onChangeClose={debounce(e => handleFilterStatus(e),500)}
            >
                Status da Foto
            </FilterCheckbox>

            <FilterCheckbox
                name="filter_status_supervisor"
                options={optionsStatus}
                onChangeClose={debounce((e) => handleFilterStatusSupervisor(e), 500)}
            >
                Status da Avaliação
            </FilterCheckbox>

            {(!props.relatorio ? 
                <Input
                    type="date"
                    icon={false}
                    required={false}
                    value={filterDate}
                    onChange={(e) => handleSetFilterDate(e)}
                />
            :'')}

            {(props.relatorio ? 
                <Input
                    type="date"
                    format="mm/yyyy"
                    icon={false}
                    required={false}
                    value={filterDateMonth}
                    onChange={(e) => handleSetFilterDateMonth(e)}
                />
            :'')}
        </>
    )
}
