import { useState, useContext } from "react";
import { GlobalContext } from "../../../context/Global";
import { TradeContext } from "../../../context/Trade";
import { useNavigate } from "react-router-dom";

import Row from "../../../components/body/row";
import Col from "../../../components/body/col";
import CalendarTitle from "../../../components/body/calendarTitle";
import CalendarFilter from "../../../components/body/calendarTitle/calendarFilter";
import FilterCheckbox from "../../../components/body/filterCheckbox";
import Input from "../../../components/body/form/input";
import Icon from "../../../components/body/icon";
import SelectReact from "../../../components/body/select";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Filter(props){    
    // CONTEXT
    const {
        filterSupervisao,
        handleSetFilterSupervisao,
        filterDate,
        filterDateMonth,
        handleSetFilterDate,
        handleSetFilterDateMonth,
        handleSetFilterLoja,
        handleSetFilterStatus,
        handleSetPageError,
        optionsSupervisao,
        handleSetOptionsSupervisao,
    } = useContext(TradeContext);

    const {handleSetFilter} = useContext(GlobalContext);

    // NAVIGATE
    const navigate = useNavigate();

    // AJUSTE RELATÓRIO
    useEffect(() => {
        handleSetFilter(true);
    },[]);

    // ESTADOS
    const [firstLoad, setFirstLoad] = useState(true);

    // OPTIOSN STATUS
    const optionsStatus = [
        {value: -1, label: 'Sem avaliação'},
        {value: 1, label: 'Aprovado'},
        {value: 2, label: 'Reprovado'}
    ];

    // FILTRA LOJA
    const handleFilterStore = (e) => {
        handleSetFilterLoja(e);    
    }

    // FILTRA STATUS
    const handleFilterStatus = (e) => {
        handleSetFilterStatus(e);    
    }

    // OPTIONS DO SELECT CATEGORIAS
    useEffect(() => {        
        // GET OPTIONS SUPERVISÕES
        if(optionsSupervisao.length == 0){
            axios({
                method: 'get',
                url: window.host+'/systems/checklist/api/lista.php?do=get_checklist_supervision'
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
        <Row fixed={true}>
            <Col lg={12}>
                <CalendarTitle>
                    <CalendarFilter margin={false}>
                        <FilterCheckbox
                            name="filter_store"
                            api={window.host+"/api/sql.php?do=select&component=loja&np=true&filial=true&limit=false"}
                            onChangeClose={handleFilterStore}
                        >
                            Filtrar lojas
                        </FilterCheckbox>

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
                            Filtrar status
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

                        <Icon
                            type={(props?.relatorio ? 'th' : 'list')}
                            title={'Visualização em '+(props?.relatorio ? 'blocos' : 'lista')}
                            onClick={() => navigate('/systems/trade-react/'+(props?.relatorio ? 'fotos' : 'lista'))}
                        />
                        <Icon type="print" />

                        {(props.relatorio ?
                            <Icon
                                type="expandir"
                                // expanded={!hide}
                                // onClick={() => { setHide(!hide) }}
                            />
                        :'')}
                    </CalendarFilter>
                </CalendarTitle>  
            </Col>
        </Row>
    )
}
