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

export default function Empreendimento({group, callback, disabled, show, fases, chamados, visitas}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [page, setPage] = useState(0);
    const [buttonStatus, setButtonStatus] = useState('');

    // ESTADOS DE OPTIONS
    const [optionsGroup, setOptionsGroup] = useState([]);

    // ESTADOS DO FORM
    const [loadingForm, setLoadingForm] = useState(true);
    const [reload, setReload] = useState(false);
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [grupo, setGrupo] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [cep, setCep] = useState('');
    const [coordenadas, setCoordenadas] = useState('');
    const [logo, setLogo] = useState('');
    const [sigla, setSigla] = useState('');
    const [descricao, setDescricao] = useState('');
    const [telefone, setTelefone] = useState('');

    // SETA EMPREENDIMENTO ATIVO
    function handleSetActive(id, id_grupo){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO
        let id_grupo_aux = (active == id_grupo ? '' : id_grupo); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if(callback){
            callback({
                active: id_aux,
                id_grupo: id_grupo_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE USUÁRIOS
        scrollToCol('usuarios');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
        setPage(0);
    },[group]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // CALLBACK PARA SETAR O PAGE
    const handleSetPage = (e) => {
        setPage(e.page);
    }

    // RESETAR FORM
    function reset_form(){
        setId('');
        setNome('');
        setGrupo(group);
        setCidade('');        
        setEstado('');
        setEndereco('');
        setBairro('');
        setNumero('');
        setCep('');
        setLogo('');
        setSigla('');
        setTelefone('');
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id) => {
        if(id){
            setEdit(id);
            setLoadingForm(true);

            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/gerenciador/api/settings.php?do=fetchColumn',
                params: {
                    columns: [
                        {column: 'enterprise', filter: {id: id}}
                    ]
                }
            }).then((response) => {
                setId(response?.data?.enterprise?.data[0]?.id);
                setNome(response?.data?.enterprise?.data[0]?.nome);    
                setGrupo(response?.data?.enterprise?.data[0]?.id_grupo);    
                setCidade(response?.data?.enterprise?.data[0]?.cidade);    
                setEstado(response?.data?.enterprise?.data[0]?.estado);    
                setEndereco(response?.data?.enterprise?.data[0]?.endereco);    
                setBairro(response?.data?.enterprise?.data[0]?.bairro);    
                setNumero(response?.data?.enterprise?.data[0]?.numero);    
                setCep(response?.data?.enterprise?.data[0]?.cep);    
                setCoordenadas(response?.data?.enterprise?.data[0]?.coordenadas);    
                setLogo(response?.data?.enterprise?.data[0]?.logo);    
                setSigla(response?.data?.enterprise?.data[0]?.sigla);    
                setDescricao(response?.data?.enterprise?.data[0]?.sigla);    
                setTelefone(response?.data?.enterprise?.data[0]?.telefone);
                setLoadingForm(false);        
            })
        }else{
            setEdit(true);
            reset_form();
            setLoadingForm(false);
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('empreendimento_insert');

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
        })

        setTimeout(() => {
            setLoadingForm(true);
        },200);
    }

    // AÇÕES AO ENVIAR FORM DE CADASTRO
    const handleSendForm = () => {
        setNome('');
        setId('');
        setEdit(false);
    }

    // VERIFICA STATUS DO FORM
    const handleFormStatus = (e) => {
        setButtonStatus(e);
    }

    // RECARREGA LISTA AO RECEBER O RETORNO DA API DE CADASTRO
    const handleReloadForm = (e) => {
        setReload(true);

        setTimeout(() => {
            setReload(false);
        },500);
    }

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, ativo) => {
        toast('Empreendimento ' + (ativo ? 'ativado' : 'desativado'));

        axios({
            method: 'post',
            url: window.host_madnezz+"/systems/gerenciador/api/settings.php?do=insUpdColumn",
            data: {
                columns: [{
                    column: 'enterprise',
                    params: {
                        id: id,
                        ativo: ativo
                    }
                }]
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            // handleReloadForm();
        })
    }

    // FILTRO DE INATIVOS
    const handleSetFilterInactive = () => {
        setFilterInactive(!filterInactive);
        handleReloadForm();
    }

    // SET LOGO (CALLBACK UPLOAD)
    const handleSetLogo = (e) => {
        if(e[2] === 'upload'){
            setLogo(JSON.parse(e[0])[0].id);
        }else if(e[2] === 'remove'){
            setLogo('');
        }
    }

    // OPTIONS DE GRUPOS
    useEffect(() => {
        if(edit){
            if(optionsGroup.length == 0){
                axios({
                    method: 'get',
                    url: window.host_madnezz+'/systems/gerenciador/api/settings.php?do=fetchColumn',
                    key_aux: 'group',
                    params: {
                        columns: [
                            {column: 'group', filter: {ativo: [1]}}
                        ]
                    }
                }).then((response) => {
                    let options_aux = [{id: null, nome: '', ativo: 1}];
                    response?.data?.group?.data.map((item, i) => {
                        options_aux.push(item);
                    });
                    
                    setOptionsGroup(options_aux);
                });
            }
        }
    },[edit]);

    // OPTIONS DE ESTADOS
    const optionsEstados = [
        {value: 'AC', label: 'AC'},
        {value: 'AL', label: 'AL'},
        {value: 'AP', label: 'AP'},
        {value: 'AM', label: 'AM'},
        {value: 'BA', label: 'BA'},
        {value: 'CE', label: 'CE'},
        {value: 'DF', label: 'DF'},
        {value: 'ES', label: 'ES'},
        {value: 'GO', label: 'GO'},
        {value: 'MA', label: 'MA'},
        {value: 'MT', label: 'MT'},
        {value: 'MS', label: 'MS'},
        {value: 'MG', label: 'MG'},
        {value: 'PA', label: 'PA'},
        {value: 'PB', label: 'PB'},
        {value: 'PR', label: 'PR'},
        {value: 'PE', label: 'PE'},
        {value: 'PI', label: 'PI'},
        {value: 'RJ', label: 'RJ'},
        {value: 'RN', label: 'RN'},
        {value: 'RS', label: 'RS'},
        {value: 'RO', label: 'RO'},
        {value: 'RR', label: 'RR'},
        {value: 'SC', label: 'SC'},
        {value: 'SP', label: 'SP'},
        {value: 'SE', label: 'SE'},
        {value: 'TO', label: 'TO'}
    ]

    // DATA FORM
    const data = {
        columns: [{
            column: 'enterprise',
            params: {
                id: id,
                nome: nome,
                id_grupo: (grupo ? grupo : 'null'),
                cidade: cidade,
                estado: estado,
                endereco: endereco,
                bairro: bairro,
                numero: numero,
                cep: cep,
                logo: logo,
                sigla: sigla,
                telefone: telefone,
                ativo: 1
            }
        }]
    }

    return(
        <>
            <Gerenciador 
                id="empreendimento"
                title="Empreendimentos"
                search={
                    <Input
                        name="filter_empreendimento"
                        value={filter}
                        onChange={(e) => (setFilter(e.target.value), setPage(0))}
                    />
                }
                icon={
                    (window.rs_id_emp == 26 && window.rs_permission_apl === 'edicao' ? // SÓ EXIBE O BOTÃO DE CADASTRO PARA EMPREENDIMENTO MADNEZZ (26)
                        <Icon
                            type="new"
                            title="Novo grupo"
                            onClick={() => handleOpenForm()}
                        />
                    :'')
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="grupos_inativos"
                        label="Inativos"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_enterprise"
                    api={window.host_madnezz+'/systems/gerenciador/api/settings.php?do=fetchColumn'}
                    params={{
                        columns: [
                            {column: 'enterprise', filter: {ativo: (filterInactive ? [1,0] : [1]), id_grupo: group, nome: filter, page: page}}
                        ]
                    }}
                    key_aux={['enterprise', 'data']}
                    onLoad={handleSetItems}
                    callback={handleSetPage}
                    reload={reload + group + show}
                    search={filter}
                    text_limit={(window.isMobile ? 20 : 30)}
                >
                    <Tbody>
                        {(items.length > 0 ?
                            items.map((item, i) => {
                                return(
                                    <Tr
                                        key={'empreendimento_'+item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td
                                            onClick={() => handleSetActive(item.id, item?.id_grupo)}
                                        >
                                            {item.nome}
                                        </Td>

                                        <Td width={1} align="center">
                                            {(window.rs_id_emp == 26 && window.rs_permission_apl === 'edicao' ?
                                                <>
                                                    <Icon 
                                                        type={'edit'}
                                                        active={(edit === item.id ? true : false)}
                                                        onClick={() => handleOpenForm(item.id)}
                                                        animated
                                                    />

                                                    <Switch
                                                        type="check"
                                                        title={(item.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                        checked={(item.ativo == 1 ? true : false)}
                                                        onChange={() => handleSetItemActive(item.id, (item.ativo == 1 ? 0 : 1))}
                                                        animated
                                                    />
                                                </>
                                            :'')}
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
                    id="empreendimento_insert"
                    title={(id ? ('Editar '+nome) : 'Novo empreendimento')}
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
                        api={window.host_madnezz+"/systems/gerenciador/api/settings.php?do=insUpdColumn"}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        // toast={handleToast}
                    >
                        <Input
                            type="text"
                            name="empreendimento_nome"
                            label="Nome"
                            value={nome}
                            loading={loadingForm}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <SelectReact                            
                            name="empreendimento_grupo"
                            label="Grupo"
                            options={optionsGroup}
                            value={grupo}
                            loading={loadingForm}
                            onChange={(e) => setGrupo(e.value)}
                            required={false}
                        />

                        <Input
                            type="text"
                            name="empreendimento_cidade"
                            label="Cidade"
                            value={cidade}
                            loading={loadingForm}
                            onChange={(e) => setCidade(e.target.value)}
                            required={false}
                        />

                        <SelectReact
                            name="empreendimento_estado"
                            label="Estado"
                            options={optionsEstados}
                            value={estado}
                            loading={loadingForm}
                            onChange={(e) => setEstado(e.value)}
                            required={false}
                        />

                        <Input
                            type="text"
                            name="empreendimento_endereco"
                            label="Endereço"
                            value={endereco}
                            loading={loadingForm}
                            onChange={(e) => setEndereco(e.target.value)}
                            required={false}
                        />

                        <Input
                            type="text"
                            name="empreendimento_bairro"
                            label="Bairro"
                            value={bairro}
                            loading={loadingForm}
                            onChange={(e) => setBairro(e.target.value)}
                            required={false}
                        />

                        <Input
                            type="tel"
                            name="empreendimento_numero"
                            label="Número"
                            mask={'99999'}
                            maskChar={''}
                            value={numero}
                            loading={loadingForm}
                            onChange={(e) => setNumero(e.target.value)}
                            required={false}
                        />

                        <Input
                            type="tel"
                            name="empreendimento_cep"
                            label="CEP"
                            mask={'99999-999'}
                            value={cep}
                            loading={loadingForm}
                            onChange={(e) => setCep(e.target.value)}
                            required={false}
                        />

                        {/* <Input
                            type="text"
                            name="empreendimento_coordenadas"
                            label="Coordenadas"
                            value={coordenadas}
                            loading={loadingForm}
                            onChange={(e) => setCoordenadas(e.target.value)}
                        /> */}

                        <Input
                            type="file"
                            name="empreendimento_logo"
                            label="Logo"
                            value={logo}
                            loading={loadingForm}
                            callback={handleSetLogo}
                            multiple={false}
                            accept=".png, .jpeg, .jpg"
                            required={false}
                        />

                        <Input
                            type="text"
                            name="empreendimento_sigla"
                            label="Sigla"
                            value={sigla}
                            loading={loadingForm}
                            onChange={(e) => setSigla(e.target.value)}
                            required={false}
                        />

                        {/* <Input
                            type="text"
                            name="empreendimento_descricao"
                            label="Descrição"
                            value={descricao}
                            loading={loadingForm}
                            onChange={(e) => setDescricao(e.target.value)}
                        /> */}

                        <Input
                            type="tel"
                            name="empreendimento_telefone"
                            label="Telefone"
                            mask={'+99 99 9999-99999'}
                            value={telefone}
                            loading={loadingForm}
                            onChange={(e) => setTelefone(e.target.value)}
                            required={false}
                        />

                        <Button
                            type="submit"
                            loading={loadingForm}
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
