import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
import InputContainer from '../../../../../components/body/form/inputcontainer';
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

export default function Subcategorias({id_grupo, emp, category, id_apl, callback, disabled, fases, chamados, visitas, comunicados}){
    // ESTADOS
    const [items, setItems] = useState([]);
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
    const [microssistema, setMicrossistema] = useState('');
    const [todosSistemas, setTodosSistemas] = useState(true);
    const [optionsMicrossistemas, setOptionsMicrossistemas] = useState([]);
    const [optionsModulos, setOptionsModulos] = useState([]);
    const [modulo, setModulo] = useState(undefined);
    const [cracha, setCracha] = useState(0);

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setFilter(null);
        setEdit(false);
    },[emp, category]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form(){
        setId('');
        setNome('');
        setMicrossistema('');
        setTodosSistemas(true);
        setCracha(0);
        setModulo(undefined);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome, microssistema, id_apl, id_modulo, cracha) => {
        if(optionsMicrossistemas.length == 0){
            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/registry.php?do=get_system_type&system_job=23'
            }).then((response) => {
                if(response.data){
                    setOptionsMicrossistemas(response.data);
                }
            })
        }

        if(optionsModulos && optionsModulos?.length == 0){
            let module_aux;

            if(chamados){
                module_aux = 'moduleChamados';
            }else if(fases){
                module_aux = 'moduleFases';
            }else if(visitas){
                module_aux = 'moduleVisitas';
            }

            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                params: {
                    do: 'getTable',
                    tables: [{
                        table: module_aux,
                        filters: {
                            module_permission: 'FALSE'
                        }
                    }]
                }
            }).then((response) => {
                if(response?.data?.data){
                    setOptionsModulos(response.data.data[module_aux]);
                }
            })
        }

        if(id){
            let microssistema_aux;
            if(microssistema){
                microssistema_aux = JSON.parse(microssistema)?.id;
            }

            setEdit(id);
            setId(id);
            setNome(nome);
            setMicrossistema(microssistema_aux);
            setModulo(id_modulo);
            setTodosSistemas(id_apl == 1 ? true :false);
            setCracha(cracha);
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('subcategoria_insert');

        if(callback){
            callback({
                edit: true
            })
        }
    }

    // AÇÕES AO FECHAR FORM DE CADASTRO
    const handleCloseForm = () => {
        setEdit(false);
        reset_form();

        if(callback){
            callback({
                edit: false
            });
        }
    }

    // AÇÕES AO ENVIAR FORM DE CADASTRO
    const handleSendForm = () => {
        setId('');
        setNome('');        
        setMicrossistema('');
        setTodosSistemas(true);
        setCracha(0);
        setModulo(undefined);
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
            toast('Subcategoria ' + (ativo ? 'ativada' : 'desativada') + ' no empreendimento');

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
                            id_par: id,
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
            toast('Subcategoria ' + (ativo ? 'ativada' : 'desativada'));

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                data: {
                    do: 'setTable',
                    tables: [{
                        table: 'subcategory',
                        filter: {
                            id: id,
                            id_ite: category,
                            ativo: ativo
                        }
                    }]
                },
                headers: { "Content-Type": "multipart/form-data" }
            }).then(() => {
                // handleReloadForm();
            });
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
            return 'Subcategoria editada com sucesso!';
        }else{
            return 'Subcategoria cadastrada com sucesso!';
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
                        table: 'subItemPermissionEnterprise',
                        filter: {
                            id: id,
                        }
                    }]
                }
            }).then((response) => {
                if(response?.data?.data?.subItemPermissionEnterprise){
                    setOptionsEmpreendimentos(response?.data?.data?.subItemPermissionEnterprise);

                    // SETA EMPREENDIMENTOS ATIVOS
                    let empreendimentos_aux = [];

                    response?.data?.data?.subItemPermissionEnterprise.map((item, i) => {
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
            table: 'subcategory',
            filter: {
                id: id,
                id_apl: (todosSistemas && !chamados && !fases && !visitas && !comunicados ? 'NULL' : (id_apl ? id_apl : window.rs_id_apl)), // SOMENTE SISTEMA JOBS
                id_sistema: (todosSistemas && !chamados && !fases && !visitas && !comunicados ? 'NULL' : window.rs_sistema_id), // SOMENTE SISTEMA JOBS
                id_grupo: empreendimentosObj.length > 0 ? window.rs_id_grupo : 'NULL',
                id_emp: empreendimentosObj.length > 0 ? 'NULL' : window.rs_id_emp,
                id_ite: category,
                par_aux: (microssistema ? '{"id":'+microssistema+'}' : ''),
                id_ite_aux: modulo,
                cracha: cracha,
                nome: nome
            }
        },{
            table: 'subItemPermissionEnterprise',
            filter: {
                id: id,
                rows: empreendimentosObj.length > 0 ? empreendimentosObj : '[{}]'
            }
        }]
    }

    return(
        <>
            <Gerenciador 
                id="subcategoria"
                title="Subcategorias"
                search={
                    <Input
                        name="filter_subcategoria"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova subcategoria"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="subcategorias_inativas"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_subcategoria"
                    api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job'}
                    params={{
                        do: 'getTable',
                        tables: [{
                            table: 'subcategory',
                            filter: {
                                ativo: (filterInactive ? [0,1] : [1]),
                                ativo_empreendimento: (filterInactive ? [0,1] : [1]),
                                id_ite: [category],
                                id_emp: emp,
                                id_apl: (id_apl ? id_apl : window.rs_id_apl),
                                gerenciador: true,
                                no_perm: true,
                                id_apl_not_is_null: (chamados || fases || visitas || comunicados ? false : true)
                            }
                        }]                        
                    }}
                    key_aux={['data', 'subcategory']}
                    onLoad={handleSetItems}
                    reload={reload + emp + category}
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
                                        key={'subcategoria_'+item?.id}
                                    >
                                        <Td>
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
                                                onClick={() => handleOpenForm(item?.id, item?.nome, item?.par_aux, item?.id_apl, item?.id_ite_aux, item?.par_aux_cracha)}
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
                                                    title={(item?.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                    checked={(item?.ativo == 1 ? true : false)}
                                                    onChange={() => handleSetItemActive(item?.id, (item?.ativo == 1 ? 0 : 1), false)}
                                                    animated
                                                />
                                            )}
                                        </Td>
                                    </Tr>
                                )
                            })
                        :<></>)}
                    </Tbody>
                </Table>
            </Gerenciador>

            {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
            {(edit ? 
                <Gerenciador 
                    id="subcategoria_insert"
                    title={(id ? ('Editar '+nome) : 'Nova Subategoria')}
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
                            name="subcategoria_nome"
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        {(window.rs_id_emp == window.rs_id_emp_grupo ?
                            <CheckboxGroup
                                name="shoppings_acesso"
                                label="Shoppings com acesso"
                                options={optionsEmpreendimentos}
                                loadingItems={loadingEmpreendimentos}
                                value={empreendimentos}
                                required={false}
                                callback={handleCallbackShoppings}
                            />
                        :'')}

                        <SelectReact
                            name="subcategoria_microssistema"
                            id="subcategoria_microssistema"
                            label="Microssistema (Opcional)"
                            options={optionsMicrossistemas}
                            value={microssistema}
                            required={false}
                            onChange={(e) => setMicrossistema(e.value)}
                        />

                        {/* SOMENTE SISTEMA CHAMADOS E PARA O CARREFOUR, DEMAIS SHOPPINGS ESSA CONFIGURAÇÃO FICA NO GERENCIADOR DE FLUXO */}
                        {(chamados && (window.rs_id_emp == 492 || window.rs_id_emp == 707)?
                            <SelectReact
                                id="subcategoria_modulo"
                                name="subcategoria_modulo"
                                options={optionsModulos}
                                label="Encaminhar ao módulo"
                                value={modulo}
                                onChange={(e) => setModulo(e.value)}
                                required={false}
                            />
                        :'')}

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

                        {/* SOMENTE SISTEMA CHAMADOS */}
                        {(chamados ?
                            <InputContainer>
                                <Switch
                                    id="solicitar_cracha"
                                    name="solicitar_cracha"
                                    label="Solicitação de crachá:"
                                    checked={cracha}
                                    onChange={() => setCracha(cracha == 1 ? 0 : 1)}
                                />
                            </InputContainer>
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
