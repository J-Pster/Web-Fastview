import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
import SelectReact from '../../../../../components/body/select';
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
import { scrollToCol } from '../../../../../_assets/js/global';
import CheckboxGroup from '../../../../../components/body/form/checkboxGroup';

export default function Modulos({id_grupo, emp, id_apl, tipo, callback, disabled, show, fases, chamados, visitas, comunicados}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [optionsEmpreendimentos, setOptionsEmpreendimentos] = useState([]);
    const [optionsCargo, setOptionsCargo] = useState([]);
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [empreendimentosObj, setEmpreendimentosObj] = useState([]);
    const [loadingEmpreendimentos, setLoadingEmpreendimentos] = useState(true);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');

    // DEFINE TIPO DE MÓDULO
    var table_aux;

    if(chamados){
        table_aux = 'moduleChamados';
    }else if(fases){
        table_aux = 'moduleFases';
    }

    // SETA MÓDULO ATIVO
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if(callback){
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE ACESSOS
        scrollToCol('colunas');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    },[emp, tipo]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e);
    }

    // RESETAR FORM
    function reset_form(){
        setId('');
        setNome('');
        setEmpreendimentos([]);
        setEmpreendimentosObj([]);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome, id_apl, id_grupo) => {
        if(id){
            setEdit(id);
            setId(id);
            setNome(nome);
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('modulo_insert');

        callback({
            edit: true
        })
    }

    // AÇÕES AO FECHAR FORM DE CADASTRO
    const handleCloseForm = () => {
        setEdit(false);
        reset_form();

        callback({
            edit: false
        });
    }

    // AÇÕES AO ENVIAR FORM DE CADASTRO
    const handleSendForm = () => {
        setId('');
        setNome('');        
        setEmpreendimentos([]);
        setEmpreendimentosObj([]);   
        setEdit(false);
    }

    // VERIFICA STATUS DO FORM
    const handleFormStatus = (e) => {
        setButtonStatus(e);
    }

    // RECARREGA LISTA AO RECEBER O RETORNO DA API DE CADASTRO
    const handleReloadForm = (e) => {
        setReload(!reload);
    }

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, ativo) => {
        toast('Módulo ' + (ativo ? 'ativado' : 'desativado'));

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            data: {
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: table_aux,
                    filter: {
                        id: id,
                        id_emp: emp,
                        ativo: ativo
                    }
                }]
            },
            headers: { "Content-Type": "multipart/form-data" }
        }).then(() => {
            // handleReloadForm();
        })
    }

    // FILTRO DE INATIVOS
    const handleSetFilterInactive = () => {
        setFilterInactive(!filterInactive);
        handleReloadForm();
    }

    // TOAST
    const handleToast = () => {
        if(id){
            return 'Módulo editado com sucesso!';
        }else{
            return 'Módulo cadastrado com sucesso!';
        }
    }

    // GET OPTIONS EMPREENDIMENTOS
    useEffect(() => {
        if(edit && window.rs_id_emp == window.rs_id_emp_grupo){
            setEmpreendimentos([]);
            setLoadingEmpreendimentos(true);

            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                params: {
                    do: 'getTable',
                    tables: [{
                        table: 'itemPermissionEnterprise',
                        filter: {
                            id: id,
                        }
                    }]
                }
            }).then((response) => {
                if(response?.data?.data?.itemPermissionEnterprise){
                    setOptionsEmpreendimentos(response?.data?.data?.itemPermissionEnterprise);

                    // SETA EMPREENDIMENTOS ATIVOS
                    let empreendimentos_aux = [];

                    response?.data?.data?.itemPermissionEnterprise.map((item, i) => {
                        if(item?.ativo == 1){
                            empreendimentos_aux.push(item?.id);
                        }

                        setEmpreendimentos(empreendimentos_aux);
                    });
                }

                setLoadingEmpreendimentos(false);
            });
        }
    },[edit]);

    // GET OPTIONS CARGO
    useEffect(() => {
        if(optionsCargo.length == 0){
            axios({
                method: 'get',
                url: window.backend+'/api/v1/utilities/filters/cargos'
            }).then((response) => {
                if(response?.data?.data){
                    setOptionsCargo(response?.data?.data);
                }
            });
        }
    },[edit]);

    // CALLBACK DO COMPONENTE DE SHOPPINGS
    const handleCallbackShoppings = (e) => {
        setEmpreendimentos(e);
    }

    // ATUALIZA OBJETO DE EMPREENDIMENTOS SEMPRE QUE O ESTADO É ALTERADO
    useEffect(() => {
        let emp_aux = [];

        empreendimentos.map((item, i) => {
            emp_aux.push(
                {id_emp: item, ativo: 1}
            )
        });        

        setEmpreendimentosObj(emp_aux);
    },[empreendimentos]);

    // DATA FORM
    const data = {
        do: 'setTable',
        tables: [{
            table: table_aux,
            filter: {
                id: id,
                id_cfg: 15, // MÓDULO
                id_grupo: empreendimentosObj.length > 0 ? window.rs_id_grupo : 'NULL',
                id_emp: empreendimentosObj.length > 0 ? 'NULL' : window.rs_id_emp,
                nome: nome
            }
        },{
            table: 'itemPermissionEnterprise',
            filter: {
                id: id,
                rows: empreendimentosObj.length > 0 ? empreendimentosObj : '[{}]'
            }
        }]
    }

    return(
        <>
            <Gerenciador 
                id="sistema"
                title="Módulos"
                search={
                    <Input
                        name="filter_modulo"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Novo Módulo"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="modulos_inativos"
                        label="Inativos"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_modulo"
                    api={window.host_madnezz+'/systems/integration-react/api/request.php'}
                    params={{
                        type: 'Job',
                        do: 'getTable',
                        tables: [{
                            table: table_aux,
                            filter: {
                                ativo: (filterInactive ? [0,1] : [1]),
                                id_emp: emp,
                                id_apl: window.rs_id_apl,
                                module_permission: 'FALSE'
                            }
                        }]
                    }}
                    key_aux={['data', table_aux]}
                    onLoad={handleSetItems}
                    reload={reload + emp + (id_apl ? id_apl : '')}
                    text_limit={(window.isMobile ? 20 : 30)}
                >
                    <Tbody>
                        {(items.length > 0 ?
                            items.filter((item) => {
                                if (!filter) return true;
                                if (item.nome.toLowerCase().includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {
                                let item_disabled = false;

                                if(item?.id_grupo){
                                    if(window.rs_id_emp != window.rs_id_emp_grupo){
                                        item_disabled = true;
                                    }
                                }

                                return(
                                    <Tr
                                        key={'modulo_'+item.id}
                                        cursor={item_disabled ? '' : 'pointer'}
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td
                                            onClick={() => (item_disabled ? {} : handleSetActive(item?.id))}
                                        >
                                            {item?.nome}
                                        </Td>

                                        <Td width={1} align="center">
                                            <Icon 
                                                type={'edit'}
                                                active={(edit === item.id ? true : false)}
                                                onClick={() => (item_disabled ? {} : handleOpenForm(item?.id, item?.nome, item?.id_apl, item?.id_grupo))}
                                                disabled={item_disabled ? true : false}
                                                title={item_disabled ? 'Item criado pela administradora, não é possível editar' : false}
                                                animated
                                            />

                                            <Switch
                                                type="check"
                                                checked={(item.ativo == 1 ? true : false)}
                                                disabled={item_disabled ? true : false}
                                                title={item_disabled ? 'Item criado pela administradora, não é possível ativar/desativar' : false}
                                                onChange={() => (item_disabled ? {} : handleSetItemActive(item?.id, (item.ativo == 1 ? 0 : 1)))}
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
                    id="modulo_insert"
                    title={(id ? ('Editar '+nome) : 'Novo módulo')}
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
                        api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Input
                            type="text"
                            name="categoria_nome"
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <SelectReact
                            name="modulo_cargo"
                            id="modulo_cargo"
                            label="Cargo"
                            options={optionsCargo}
                            required={false}
                            onChange={(e) => setCargo(e.value)}
                            value={cargo}
                        />

                        {(window.rs_id_emp == window.rs_id_emp_grupo ?
                            <CheckboxGroup 
                                name="shoppings_acesso"
                                label="Shoppings com acesso"
                                options={optionsEmpreendimentos}
                                value={empreendimentos}
                                loadingItems={loadingEmpreendimentos}
                                required={false}
                                callback={handleCallbackShoppings}
                            />
                        :'')}

                        <Button
                            type="submit"
                            status={buttonStatus}
                        >
                            Salvar
                        </Button>
                    </Form>
                </Gerenciador>
            :'')}
        </>
    )
}
