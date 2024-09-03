import { useState, useContext } from "react";
import { ChecklistContext } from "../../../context/Checklist";
import { useNavigate } from "react-router-dom";


import FilterCheckbox from "../../../components/body/filterCheckbox";
import Input from "../../../components/body/form/input";
import SelectReact from "../../../components/body/select";
import { useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "../../../context/Global";

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
        {value: -1, label: 'Sem avaliação'},
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
            navigate("/systems/checklist-react/supervisao/");            
        }else if(e== 2){
            navigate("/systems/checklist-react/macro/");
        }
    }

    // OPTIONS DO SELECT CATEGORIAS
    useEffect(() => {        
        // GET OPTIONS SUPERVISÕES
        if(optionsSupervisao.length == 0){
            axios({
                method: 'get',
                url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=get_select_checklist',
                params: {
                    filter_type_system: ['supervisao', 'antes_depois'],
                }
            }).then((response) => {
                if(response.data.length>0){
                    handleSetOptionsSupervisao(response.data);

                    if(firstLoad){
                        setFirstLoad(false);
                        handleSetFilterSupervisao(response.data[0].value);
                    }
                }else{
                    handleSetPageError(true);
                }
            });
        }
    },[]);

    return(
        <>
            <SelectReact
                placeholder="Visualização"
                options={optionsVisualizacao}
                value={view}
                onChange={(e) => handleSetVisualizacao(e.value)}
            ></SelectReact>

            {(!window.rs_id_lja || window.rs_id_lja == 0 ?
                <FilterCheckbox
                    name="filter_store"
                    api={window.host+"/api/sql.php?do=select&component=loja&np=true&filial=true&limit=false"}
                    onChangeClose={handleFilterStore}
                >
                    Loja
                </FilterCheckbox>
            :'')}

            {(window.rs_id_grupo > 0 ?
                <FilterCheckbox
                    name="filter_grupo"
                    api={window.host+"/api/sql.php?do=select&component=grupo_empreendimento&np=true&filial=true&limit=false"}
                    onChangeClose={handleFilterEmp}
                    value={filterEmpreendimento}
                >
                    Empreendimento
                </FilterCheckbox>
            :'')}

            <SelectReact
                placeholder="Filtrar Supervisão"
                options={optionsSupervisao}
                value={filterSupervisao}
                onChange={(e) => handleSetFilterSupervisao(e.value)}
            ></SelectReact>

            <FilterCheckbox
                name="filter_status"
                options={optionsStatus}
                onChangeClose={handleFilterStatus}
            >
                Status da Foto
            </FilterCheckbox>

            <FilterCheckbox
                name="filter_status_supervisor"
                options={optionsStatus}
                onChangeClose={handleFilterStatusSupervisor}
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
