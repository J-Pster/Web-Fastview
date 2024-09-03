import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
import Table from '../../../../../components/body/table';
import Tbody from '../../../../../components/body/table/tbody';
import Tr from '../../../../../components/body/table/tr';
import Td from '../../../../../components/body/table/tbody/td';
import Form from '../../../../../components/body/form';
import Icon from '../../../../../components/body/icon';
import Button from '../../../../../components/body/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Switch from '../../../../../components/body/switch';
import { get_date, cd } from '../../../../../_assets/js/global';
import Textarea from '../../../../../components/body/form/textarea';
import SelectReact from '../../../../../components/body/select';

export default function Periodo({disabled, handleCallbackChangeSystem, changeSystem}){

    //OPÇÕES DE ANO
    function options_year() {
        let array_year = [{ value: 0, label: 'Ano' }];
        const start = window.currentYear - 4;      
        for (let year = start; year <= window.currentYear; year++) {
          array_year.push({ value: year, label: year.toString() });
        }      
        return array_year;
      }

    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterAno, setFilterAno] = useState(window.currentYear);
    const [optAno, setOptAno] = useState(options_year);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(true);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form(){
        setNome('');
        setDataInicio('');
        setDataFim('');
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome) => {
        if(id){
            setEdit(id);
            setId(id);
            setLoading(true);

            axios({
                method: 'get',
                url: window.backend+'/api/v1/checklists/gerenciador/periodos/'+id
            }).then((response) => {
                if(response?.data){
                    var dataIniAux = new Date(response?.data?.inicio);
                    var dataFimAux = new Date(response?.data?.fim);

                    dataIniAux.setDate(dataIniAux.getDate() + 1);
                    dataFimAux.setDate(dataFimAux.getDate() + 1);

                    setNome(response?.data?.nome);
                    setDataInicio(dataIniAux);
                    setDataFim(dataFimAux);
                }

                setLoading(false);
            });
        }else{
            setEdit(true);
            reset_form();
        }

    }

    // AÇÕES AO FECHAR FORM DE CADASTRO
    const handleCloseForm = () => {
        setEdit(false);
        reset_form();
    }

    // AÇÕES AO ENVIAR FORM DE CADASTRO
    const handleSendForm = () => {              
        setEdit(false);
        reset_form();
    }

    // VERIFICA STATUS DO FORM
    const handleFormStatus = (e) => {
        setButtonStatus(e);
    }

    // RECARREGA LISTA AO RECEBER O RETORNO DA API DE CADASTRO
    const handleReloadForm = (e) => {
        setReload(!reload);
    }

    // RECARREGA O COMPONENTE TABLE
    useEffect(() => {
        setReload(!reload);
    }, [changeSystem]);

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, ativo) => {
        toast('Período ' + (ativo ? 'ativado' : 'desativado'));

        axios({
            method: 'put',
            url: window.backend+'/api/v1/checklists/gerenciador/periodos/'+id+'/?status='+ativo,
            headers: { "Content-Type": "multipart/form-data" }
        }).then(() => {
            handleReloadForm();
        })
    }

    // FILTRO DE INATIVOS
    const handleSetFilterInactive = () => {
        setFilterInactive(!filterInactive);
        handleReloadForm();
    }

    //CALCULAR ANOS PARA CRIAR AS OPÇÕES DO SELECT
    function options_year (){
        let array_year = [{value: 0,label: 'Ano'}];
        
        const start = window.currentYear - 5;

        for(let year = start; year<= window.currentYear; year++){
            array_year.push({value: year, label: year.toString()});
        }

        return array_year        
    }

    // TOAST
    const handleToast = () => {
        if(id){
            return 'Período editado com sucesso!';
        }else{
            return 'Período cadastrado com sucesso!';
        }
    }

    // DATA FORM
    const data = {
        periodo: id ? id : undefined,
        nome: nome,
        inicio: get_date('date_sql', cd(dataInicio)),
        fim: get_date('date_sql', cd(dataFim)),
    }

    return(
        <>
            <Gerenciador 
                id="periodos"
                title={<>
                    Período
                    <SelectReact
                        value={filterAno}
                        onChange={(e) => setFilterAno(e.value)}
                        options={optAno}
                        required={false}
                    />
                </>}
                search={
                    <Input
                        name="filter_periodo"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <>
                        <Icon type="enter" onClick={() => handleCallbackChangeSystem('checklist')} />
                        <Icon
                            type="new"
                            title="Novo Período"
                            onClick={() => handleOpenForm()}
                        />
                    </>                    
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="periodos_inativos"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_periodos"
                    api={window.backend+'/api/v1/checklists/gerenciador/periodos'}
                    params={{
                        status: (filterInactive ? 0 : 1),
                        year: filterAno
                    }}
                    onLoad={handleSetItems}
                    key_aux={['data']}
                    text_limit={(window.isMobile ? 20 : 30)}
                    reload={reload + 'aux' + filterAno}
                >
                    <Tbody>
                        {(items.length > 0 ?
                            items.filter((item, i) => {
                                if (!filter) return true;
                                if (item?.nome?.toLowerCase()?.includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {
                                return(
                                    <Tr
                                        key={'periodo_'+item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td>
                                            {item.nome}
                                        </Td>

                                        <Td width={1} align="center">
                                            <Icon 
                                                type={'edit'}
                                                active={(edit === item.id ? true : false)}
                                                onClick={() => handleOpenForm(item?.id, item?.nome)}
                                                animated
                                            />

                                            <Switch
                                                type="check"
                                                title={(item.status == 1 ? 'Desativar' : 'Ativar')}
                                                checked={(item.status == 1 ? true : false)}
                                                onChange={() => handleSetItemActive(item?.id, (item.status == 1 ? 0 : 1))}
                                                animated
                                            />
                                        </Td>
                                    </Tr>
                                )
                            })
                        :
                            <></>
                        )}
                    </Tbody>
                </Table>
            </Gerenciador>

            {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
            {(edit ? 
                <Gerenciador 
                    id="periodo_insert"
                    title={(id ? ('Editar período') : 'Novo período')}
                    search={false}
                    icon={
                        <Icon
                            type="reprovar"
                            title="Fechar"
                            onClick={handleCloseForm}
                        />
                    }
                    disabled={disabled}
                >
                    <Form
                        api={window.backend+'/api/v1/checklists/gerenciador/periodos'+(id ? ('/'+id) : '')}
                        method={id ? 'put' : 'post'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Textarea 
                            id="periodo_nome"
                            name="periodo_nome"
                            label="Nome"  
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            loading={loading}
                            height={80}
                        />
                        {/* <Input
                            id="periodo_nome"
                            name="periodo_nome"
                            label="Nome"  
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            loading={loading}
                            height={80}
                        /> */}
                        <Input
                            type="date"
                            label="Data Ínicio"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e)}
                        />

                        <Input
                            type="date"
                            label="Data Fim"
                            value={dataFim}
                            onChange={(e) => setDataFim(e)}
                        />

                        <Button
                            type="submit"
                            status={buttonStatus}
                            loading={loading}
                        >
                            Salvar
                        </Button>
                    </Form>
                </Gerenciador>
            :'')}
        </>
    )
}
