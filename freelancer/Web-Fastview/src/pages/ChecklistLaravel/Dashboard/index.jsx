import { useState, useEffect, useContext, cloneElement } from "react";
import { cd, get_date } from '../../../_assets/js/global.js';

import Icon from "../../../components/body/icon";
import Row from "../../../components/body/row";
import SelectReact from "../../../components/body/select";
import Input from "../../../components/body/form/input";
import { ChecklistContext } from "../../../context/Checklist.jsx";
import FilterCheckbox from "../../../components/body/filterCheckbox/index.jsx";
import { GlobalContext } from "../../../context/Global.jsx";
import Container from "../../../components/body/container";
import Checklists from './Checklists';
import Supervisores from './Supervisores';
import Lojas from './Lojas';
import Secoes from './Secoes';
import Perguntas from './Perguntas';
import Funcionarios from './Funcionarios';
import Modal from './Modal';

export default function DashboardChecklist({ icons, filters }) {
    // CONTEXT
    const {
        handleSetFilterEmpreendimento,
        filterEmpreendimento
    } = useContext(ChecklistContext);

    // CONTEXT
    const { handleSetFilter, handleSetFilterDateMonth } = useContext(GlobalContext);

    // NECESSÁRIO PARA FUNCIONAR O CARREGAMENTO DA LISTA AO ENTRAR NA TELA (PRECISA AJUSTAR)
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    // ESTADOS FILTROS
    const [filterDashboard, handleSetFilterDashboard] = useState({});
    const [filterPeriodo, setFilterPeriodo] = useState(1);
    const [monthSelected, setMonthSelected] = useState(window.currentMonth);
    const [yearSelected, setYearSelected] = useState(window.currentYear);
    const [filterMonth, setFilterMonth] = useState(new Date(window.currentYear, window.currentMonth - 1, '01'));
    const [filterDataInicio, setFilterDataInicio] = useState(new Date(window.currentYear, window.currentMonth - 1, '01'));
    const [filterDataFim, setFilterDataFim] = useState(new Date(window.currentYear, window.currentMonth - 1, get_date('last_date', new Date(window.currentYear, window.currentMonth - 1, window.currentDay)).slice(0, 2)));
    const [filterModal, setFilterModal] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ESTADOS DASHBOARDS
    const [supervisorActive, setSupervisorActive] = useState('');
    const [lojaActive, setLojaActive] = useState('');    
    const [checklistActive, setChecklistActive] = useState('');
    const [secaoActive, setSecaoActive] = useState('');
    const [perguntaActive, setPerguntaActive] = useState('');
    const [funcionarioActive, setFuncionarioActive] = useState('');

    //FILTROS DASHBOARD
    useEffect((e) => {
        switch(filterDashboard?.tipo){
            case "supervisor":
                setSupervisorActive(filterDashboard?.valor);
                setLojaActive('');
                setFuncionarioActive('');
                setChecklistActive('');
                setSecaoActive('');
                setPerguntaActive('');
                break;
            case "loja":
                setLojaActive(filterDashboard?.valor);
                setFuncionarioActive('');
                setChecklistActive('');
                setSecaoActive('');
                setPerguntaActive('');
                break;
            case "funcionario":
                setFuncionarioActive(filterDashboard?.valor);
                setChecklistActive('');
                setSecaoActive('');
                setPerguntaActive('');
                break;  
            case "checklist":
                setChecklistActive(filterDashboard?.valor);
                setSecaoActive('');
                setPerguntaActive('');
                break;
            case "secao":
                setSecaoActive(filterDashboard?.valor);
                setPerguntaActive('');
                break;
        }
    }, [supervisorActive, lojaActive, checklistActive, secaoActive, funcionarioActive, filterDashboard]);
    
    // FILTRA EMPREENDIMENTO
    const handleFilterEmp = (e) => {
        handleSetFilterEmpreendimento(e);    
    }

    //FILTRO PARA SELECIONAR ENTRE MÊS || PERÍODO
    const optionsPeriodo = [
        { value: 1, label: "Por mês" },
        { value: 2, label: "Por período" },
    ]
    
    const handleMes = (e) => {
        setFilterMonth(e);
        let arr_aux = cd(e).split("/");
        setMonthSelected(arr_aux[1]);
        setYearSelected(arr_aux[2]);
    }

    // MANDA ÍCONES E FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons(<Icon type="print" />);
        }

        if (filters) {
            filters(
                <>
                    {(window.rs_id_grupo > 0 ?
                        <FilterCheckbox
                            name="filter_grupo"
                            api={{
                                url: window.backend + "/api/v1/utilities/filters/grupo-empreendimento?do=select&component=grupo_empreendimento&ativo[]=1",
                                key_aux:["data"]
                            }}
                            onChangeClose={(e) => handleFilterEmp(e)}
                            value={filterEmpreendimento}
                            
                        >
                            Filtrar empreendimento
                        </FilterCheckbox>
                        : '')}

                    <SelectReact
                        options={optionsPeriodo}
                        placeholder="Por mês"
                        name="filtro-periodo"
                        value={filterPeriodo}
                        allowEmpty={false}
                        onChange={(e) => setFilterPeriodo(e.value)}
                    />

                    {(filterPeriodo == 1 ?
                        <Input
                            type="date"
                            format="mm/yyyy"
                            name="filter_date"
                            required={false}
                            value={filterMonth}
                            onChange={(e) => handleMes(e)}
                        />
                        : '')}

                    {(filterPeriodo == 2 ?
                        <Input
                            type="period"
                            name="filter_period"
                            required={false}
                            valueStart={filterDataInicio}
                            valueEnd={filterDataFim}
                            onChangeStart={(e) => setFilterDataInicio(e)}
                            onChangeEnd={(e) => setFilterDataFim(e)}
                        />
                        : '')}
                </>
            )
        }
    }, [filterEmpreendimento, filterPeriodo, filterMonth, filterDataInicio, filterDataFim]);

    // FILTROS
    const filter_aux = {
        periodo: filterPeriodo,
        data_inicio: filterDataInicio,
        data_fim: filterDataFim,
        mes: monthSelected,
        ano: yearSelected,
        empreendimento: filterEmpreendimento,
        supervisor: supervisorActive,
        loja: lojaActive,
        checklist: checklistActive,
        funcionario: funcionarioActive,
        secao: secaoActive,
        pergunta: perguntaActive,
        dashboard: filterDashboard
    }

    // CALLBACK DASHBOARDS
    const handleCallback = (e) => {
        let filter_modal_aux = filter_aux;

        if(e){
            e.map((item, i) => {
                let key_aux = Object.keys(item)[0];
                filter_modal_aux[key_aux] = item[key_aux];
            });
        }

        setFilterModal(filter_modal_aux);
        setShowModal(true);
    }

    // CALLBACK MODAL
    const handleCallbackModal = (e) => {
        if(e){
            setShowModal(e.show);
        }
    }

    return (
        <>
            {/* MODAL DE RESPOSTAS */}
            <Modal
                filters={filterModal}
                show={showModal}
                callback={handleCallbackModal}
            />

            <Container>
                <Row wrap={(window.isMobile ? true : false)}>
                    <Supervisores
                        filter={filter_aux}
                        callback={handleCallback}
                        handleSetFilterDashboard={handleSetFilterDashboard}
                    />

                    <Lojas
                        filter={filter_aux}
                        callback={handleCallback}
                        handleSetFilterDashboard={handleSetFilterDashboard}
                    />

                    <Funcionarios
                        filter={filter_aux}
                        callback={handleCallback}
                        handleSetFilterDashboard={handleSetFilterDashboard}
                    />

                    <Checklists
                        filter={filter_aux}
                        handleSetFilterDashboard={handleSetFilterDashboard}
                    />

                    <Secoes
                        filter={filter_aux}
                        handleSetFilterDashboard={handleSetFilterDashboard}
                    />

                    <Perguntas
                        filter={filter_aux}
                    />
                </Row>
            </Container>
        </>
    )
}