import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
import InputContainer from '../../../../../components/body/form/inputcontainer';
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

export default function Categorias({id_grupo, emp, id_apl, callback, disabled, show, fases, chamados, visitas, comunicados}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [optionsEmpreendimentos, setOptionsEmpreendimentos] = useState([]);
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [empreendimentosObj, setEmpreendimentosObj] = useState([]);
    const [loadingEmpreendimentos, setLoadingEmpreendimentos] = useState(true);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [todosSistemas, setTodosSistemas] = useState(true);

    // SETA CATEGORIA ATIVA
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if(callback){
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE USUÁRIOS
        scrollToCol('subcategoria');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    },[emp]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form(){
        setId('');
        setNome('');
        setEmpreendimentos([]);
        setEmpreendimentosObj([]);
        setTodosSistemas(true);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome, id_apl) => {
        if(id){
            setEdit(id);
            setId(id);
            setNome(nome);
            setTodosSistemas(id_apl == 1 ? true :false);
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('categoria_insert');

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
    const handleSetItemActive = (id, ativo, disable_in_emp) => {
        if(disable_in_emp){ // DESATIVA O ITEM NO EMPREENDIMENTO, NÃO O STATUS
            toast('Categoria ' + (ativo ? 'ativada' : 'desativada') + ' no empreendimento');

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    type: 'Job'
                },
                data: {
                    do: 'setTable',
                    tables: [{
                        table: 'itemPermissionEnterprise',
                        filter: {
                            status: true,                            
                            id_ite: id,
                            id_emp: window.rs_id_emp,
                            ativo: ativo
                        }
                    }]
                },
                headers: { "Content-Type": "multipart/form-data" }
            }).then(() => {
                // handleReloadForm();
            })
        }else{
            toast('Categoria ' + (ativo ? 'ativada' : 'desativada'));

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                data: {
                    do: 'setTable',
                    tables: [{
                        table: 'category',
                        filter: {
                            id: id,
                            ativo: ativo
                        }
                    }]
                },
                headers: { "Content-Type": "multipart/form-data" }
            }).then(() => {
                // handleReloadForm();
            })
        }
    }

    // FILTRO DE INATIVOS
    const handleSetFilterInactive = () => {
        setFilterInactive(!filterInactive);
        handleReloadForm();
    }

    // TOAST
    const handleToast = () => {
        if(id){
            return 'Categoria editada com sucesso!';
        }else{
            return 'Categoria cadastrada com sucesso!';
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
            table: 'category',
            filter: {
                id: id,
                id_apl: (todosSistemas && !chamados && !fases && !visitas && !comunicados ? 'NULL' : (id_apl ? id_apl : window.rs_id_apl)), // SOMENTE SISTEMA JOBS
                id_sistema: (todosSistemas && !chamados && !fases && !visitas && !comunicados ? 'NULL' : window.rs_sistema_id), // SOMENTE SISTEMA JOBS
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
                title="Categorias"
                search={
                    <Input
                        name="filter_categoria"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova categoria"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="categorias_inativas"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_categoria"
                    api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job'}
                    params={{
                        do: 'getTable',
                        tables: [{
                            table: 'category',
                            filter: {
                                ativo: (filterInactive ? [0,1] : [1]),
                                ativo_empreendimento: (filterInactive ? [0,1] : [1]),
                                id_emp: emp,
                                id_apl: (id_apl ? id_apl : window.rs_id_apl),
                                no_perm: true,
                                id_apl_not_is_null: (chamados || fases || visitas || comunicados ? false : true)
                            }
                        }]
                    }}
                    key_aux={['data', 'category']}
                    onLoad={handleSetItems}
                    reload={reload + emp + (id_apl ? id_apl : '')}
                    text_limit={(window.isMobile ? 20 : 30)}
                >
                    <Tbody>
                        {(items.length > 0 ?
                            items.filter((item) => {
                                if (!filter) return true;
                                if (item?.nome.toLowerCase().includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {
                                let sistemas = '';

                                if(!chamados && !fases && !visitas && !comunicados){
                                    if(item?.id_apl == 1){
                                        sistemas = '(Todos os sistemas)';
                                    }else{
                                        if(item?.id_apl == 223){
                                            sistemas = '(Jobs)';
                                        }else if(item?.id_apl == 224){
                                            sistemas = '(Chamados)';
                                        }else if(item?.id_apl == 225){
                                            sistemas = '(Fases)';
                                        }else if(item?.id_apl == 226){
                                            sistemas = '(Visitas)';
                                        }else if(item?.id_apl == 227){
                                            sistemas = '(Obras)';
                                        }else if(item?.id_apl == 229){
                                            sistemas = '(Comunicados)';
                                        }else if(item?.id_apl == 230){
                                            sistemas = '(Checklist)';
                                        }else if(item?.id_apl == 231){
                                            sistemas = '(Notificações)';
                                        }
                                    }
                                }

                                let item_disabled = false;

                                if(item?.id_grupo){
                                    if(window.rs_id_emp != window.rs_id_emp_grupo){
                                        item_disabled = true;
                                    }
                                }

                                return(
                                    <Tr
                                        key={'categoria_'+item?.id}
                                        cursor={'pointer'}
                                        active={(active === item?.id ? true : false)}
                                    >
                                        <Td onClick={() => handleSetActive(item?.id)}>
                                            {item?.nome}

                                            {/* CASO O ITEM TENHA SIDO CRIADO PARA ALGUM SISTEMA ESPECÍFICO, EXIBE A INFORMAÇÃO AQUI */}
                                            {(sistemas ?
                                                <span className="text-secondary ms-1">{sistemas}</span>
                                            :'')}

                                            {/* SE O ITEM FOI CRIADO PELA ADMINISTRADORA INSERE A INFORMAÇÃO JUNTO COM O NOME */}
                                            {(item?.id_grupo && window.rs_id_emp != window.rs_id_emp_grupo ?
                                                <span className="text-secondary ms-1">(Administradora)</span>
                                            :'')}
                                        </Td>

                                        <Td width={1} align="center">
                                            <Icon 
                                                type={'edit'}
                                                active={(edit === item?.id ? true : false)}
                                                onClick={() => (item_disabled ? {} : handleOpenForm(item?.id, item?.nome, item?.id_apl))}
                                                disabled={item_disabled ? true : false}
                                                title={item_disabled ? 'Item criado pela administradora, não é possível editar' : false}
                                                animated
                                            />

                                            {/* ALTERA AS FUNÇÕES DO BOTÃO CASO SEJA UM ITEM CADASTRADO PELO GRUPO */}
                                            {(item_disabled ?
                                                <Switch
                                                    type="check"
                                                    disabled={(item?.ativo == 0 ? true : false)}
                                                    title={(item?.ativo == 0 ? 'Item desativado pela administradora, não é possível ativar' : false)}
                                                    checked={(item?.ativo_empreendimento == 1 ? true : false)}
                                                    onChange={() => handleSetItemActive(item?.id, (item?.ativo_empreendimento == 1 ? 0 : 1), true)}
                                                    animated
                                                />
                                            :
                                                <Switch
                                                    type="check"
                                                    checked={(item?.ativo == 1 ? true : false)}
                                                    onChange={() => handleSetItemActive(item?.id, (item?.ativo == 1 ? 0 : 1), false)}
                                                    animated
                                                />
                                            )}
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
                <>
                    <Gerenciador 
                        id="categoria_insert"
                        title={(id ? ('Editar '+nome) : 'Nova Categoria')}
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

                            {/* SOMENTE SISTEMA JOBS */}
                            {(!chamados && !fases && !visitas && !comunicados ?
                                <InputContainer>
                                    <Switch
                                        id="todos_sistemas"
                                        name="todos_sistemas"
                                        label="Disponível em todos os sistemas:"
                                        checked={todosSistemas}
                                        onChange={() => setTodosSistemas(!todosSistemas)}
                                    />
                                </InputContainer>
                            :'')}

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
                </>
            :'')}
        </>
    )
}
