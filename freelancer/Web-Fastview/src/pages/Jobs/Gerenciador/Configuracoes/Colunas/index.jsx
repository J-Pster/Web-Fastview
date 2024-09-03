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
import SelectReact from '../../../../../components/body/select';

export default function Colunas({id_grupo, emp, id_apl, tipo, callback, disabled, modulo, show, fases, chamados, visitas, comunicados}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [optionsEmpreendimentos, setOptionsEmpreendimentos] = useState([]);
    const [optionsTipoFase, setOptionsTipoFase] = useState([]);
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [empreendimentosObj, setEmpreendimentosObj] = useState([]);
    const [loadingEmpreendimentos, setLoadingEmpreendimentos] = useState(true);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [livre, setLivre] = useState(false);
    const [posicao, setPosicao] = useState(1);
    const [tipoFase, setTipoFase] = useState('');

    // SETA COLUNA ATIVA
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
        scrollToCol('usuarios');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    },[emp, tipo, modulo]);

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
        setPosicao(1);
        setTipoFase('');
        setLivre(false);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome, posicao, tipo_fase, livre) => {
        if(id){
            setEdit(id);
            setId(id);
            setNome(nome);
            setPosicao(posicao);
            setTipoFase(tipo_fase);
            setLivre(livre);
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('coluna_insert');

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
        toast('Coluna ' + (ativo ? 'ativada' : 'desativada'));

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            data: {
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'modulePhase',
                    filter: {
                        id: id,
                        id_ite: modulo,
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
            return 'Coluna editada com sucesso!';
        }else{
            return 'Coluna cadastrada com sucesso!';
        }
    }

    // GET OPTIONS TIPO FASE
    useEffect(() => {
        if(edit){
            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                params: {
                    do: 'getTable',
                    tables: [{
                        table: 'phaseType'
                    }]
                }
            }).then((response) => {
                if(response?.data?.data?.phaseType){
                    setOptionsTipoFase(response?.data?.data?.phaseType);
                }
            });
        }
    },[edit]);

    // GET OPTIONS EMPREENDIMENTOS
    useEffect(() => {
        if(edit){
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
            table: 'modulePhase',
            filter: {
                id: id,
                id_apl: window.rs_id_apl,
                id_ite: modulo,
                id_grupo: empreendimentosObj.length > 0 ? window.rs_id_grupo : 'NULL',
                id_emp: empreendimentosObj.length > 0 ? 'NULL' : window.rs_id_emp,
                posicao: posicao,
                par_tipo_permissao: livre ? 'livre' : '',
                id_ite_aux: tipoFase,
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
                id="colunas"
                title="Colunas"
                search={
                    <Input
                        name="filter_coluna"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova coluna"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="colunass_inativas"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_coluna"
                    api={window.host_madnezz+'/systems/integration-react/api/request.php'}
                    params={{
                        type: 'Job',
                        do: 'getTable',
                        tables: [{
                            table: 'phase',
                            filter: {
                                ativo: (filterInactive ? [0,1] : [1]),
                                id_emp: emp,
                                id_ite: modulo,
                                id_apl: window.rs_id_apl
                            }
                        }]
                    }}
                    key_aux={['data', 'phase']}
                    onLoad={handleSetItems}
                    reload={reload + emp + (id_apl ? id_apl : '') + modulo}
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
                                return(
                                    <Tr
                                        key={'coluna_'+item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td onClick={() => handleSetActive(item.id)}>
                                            {item.nome}

                                            {(chamados && <span className="ms-1 text-secondary">({item?.tipo_fase})</span>)}
                                        </Td>

                                        <Td width={1} align="center">
                                            <Icon 
                                                type={'edit'}
                                                active={(edit === item.id ? true : false)}
                                                onClick={() => handleOpenForm(item?.id, item?.nome, item?.par_posicao, item?.id_ite_aux, item?.par_tipo_permissao)}
                                                animated
                                            />

                                            <Switch
                                                type="check"
                                                title={(item.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                checked={(item.ativo == 1 ? true : false)}
                                                onChange={() => handleSetItemActive(item?.id, (item.ativo == 1 ? 0 : 1))}
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
                    id="coluna_insert"
                    title={(id ? ('Editar '+nome) : 'Nova coluna')}
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

                        <SelectReact
                            name="posicao"
                            id="posicao"
                            label="Posição"
                            options={[
                                {id: '1.00', nome: '1'},
                                {id: '2.00', nome: '2'},
                                {id: '3.00', nome: '3'},
                                {id: '4.00', nome: '4'},
                                {id: '5.00', nome: '5'},
                                {id: '6.00', nome: '6'},
                                {id: '7.00', nome: '7'},
                                {id: '8.00', nome: '8'},
                                {id: '9.00', nome: '9'},
                                {id: '10.00', nome: '10'},
                            ]}
                            allowEmpty={false}
                            value={posicao}
                            onChange={(e) => setPosicao(e.value)}
                        />

                        {(chamados &&
                            <SelectReact
                                name="tipo_fase"
                                id="tipo_fase"
                                label="Tipo"
                                options={optionsTipoFase}
                                value={tipoFase}
                                allowEmpty={false}
                                onChange={(e) => (setTipoFase(e.value), setLivre(false))}
                            />
                        )}

                        {/* SE FOR CHAMADOS E TIPO "INÍCIO" */}
                        {(chamados && tipoFase == 53 ? 
                            <InputContainer title={false}>
                                <Switch
                                    id="coluna_livre"
                                    name="coluna_livre"
                                    label={
                                        <>
                                            Coluna livre

                                            <Icon
                                                type="help"
                                                className="ms-2"
                                                title={'Ao marcar uma coluna como "Livre", qualquer usuário com acesso ao módulo poderá finalizar os cards sem necessidade de passar a um operador.'}
                                                readonly
                                            />
                                        </>
                                    }
                                    checked={livre}
                                    onChange={() => setLivre(!livre)}
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
