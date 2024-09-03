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
import SelectReact from '../../../../../components/body/select';
import CheckboxGroup from '../../../../../components/body/form/checkboxGroup';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../../../../components/body/loader';

export default function Checklist({ emp, id_apl, callback, filter_departamento, disabled, filterEmpreendimento, handleCallBackModulo }) {
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState(null);
    const [tipo, setTipo] = useState(null);
    const [frequencia, setFrequencia] = useState(null);
    const [sistema, setSistema] = useState(null);
    const [tipo_sistema, setTipoSistema] = useState('');
    const [meta, setMeta] = useState(null);
    const [cargos, setCargos] = useState([]);
    const [notificacao, setNotificacao] = useState(null);
    const [checklistPara, setChecklistPara] = useState('');
    const [categoria, setCategoria] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [subcategoria, setSubcategoria] = useState(null);

    // ESTADOS DE OPTIONS
    const [optionsCategoria, setOptionsCategoria] = useState([]);
    const [optionsDepartamento, setOptionsDepartamento] = useState([]);
    const [optionsSubcategoria, setOptionsSubcategoria] = useState([]);

    // SETA CHECKLIST ATIVO
    function handleSetActive(id) {
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if (callback) {
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE USUÁRIOS
        scrollToCol('secao');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    }, [emp, filter_departamento]);

    // GET OPTIONS DE CATEGORIAS E DEPARTAMENTOS
    useEffect(() => {
        // CATEGORIAS
        if (optionsCategoria?.length == 0) {
            axios({
                method: 'get',
                url: window.host + "/systems/integration-react/api/registry.php?do=get_category",
            }).then((response) => {
                setOptionsCategoria(response.data);
            })
        }

        // DEPARTAMENTOS
        if (optionsDepartamento == 0) {
            axios({
                method: 'get',
                url: window.backend + '/api/v1/gerenciador-macro/departamentos',
                params: {
                    ativo: [1]
                }
            }).then((response) => {
                if (response.data) {
                    let options_aux = [];
                    response.data?.data.map((item, i) => {
                        options_aux.push({
                            value: item.id,
                            label: item.nome + ' (' + item?.empreendimento + ')'
                        });
                    });
                    setOptionsDepartamento(options_aux);
                }
            })
        }
    }, [edit]);

    //LISTAR SUBCATEGORIAS
    useEffect(() => {
        // SUBCATEGORIAS
        if (categoria) {
            axios({
                method: 'get',
                url: window.host + "/systems/integration-react/api/registry.php?do=get_subcategory",
                params: {
                    filter_id_category: categoria,
                },
            }).then((response) => {
                setOptionsSubcategoria(response.data);
            })
        }
    }, [categoria]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form() {
        setId(null);
        setNome(null);
        setTipo(null);
        setFrequencia(null);
        setSistema(null);
        setTipoSistema('');
        setMeta(null);
        setCargos([]);
        setNotificacao(null);
        setCategoria(null);
        setSubcategoria(null);
        setChecklistPara(null);

        if (filter_departamento) {
            setDepartamento(filter_departamento);
        } else {
            setDepartamento(null);
        }
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome) => {
        if (id) {
            setEdit(id);
            setId(id);
            setNome(nome);
            setDepartamento(null);

            setLoading(true);

            axios({
                method: 'get',
                url: window.backend + '/api/v1/checklists/' + id
            }).then((response) => {
                if (response?.data?.data) {
                    setNome(response?.data?.data?.nome);
                    setTipo(response?.data?.data?.tipo_id);
                    setFrequencia(response?.data?.data?.frequencia);
                    setSistema(response?.data?.data?.sistema_id);
                    setTipoSistema(response?.data?.data?.tipo_sistema);
                    setMeta(response?.data?.data?.meta);
                    setCategoria(response?.data?.data?.id_categoria);
                    setSubcategoria(response?.data?.data?.id_subcategoria);
                    setDepartamento(response?.data?.data?.departamento_id);
                    setCargos(response?.data?.data?.cargos);

                    setNotificacao(response?.data?.data?.notificacao) // CORRIGIR QUANDO AJUSTAREM NO BACK-END
                }

                setLoading(false);
            });
        } else {
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('checklist_insert');

        if (callback) {
            callback({
                edit: true
            })
        }
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
        toast('Checklist ' + (ativo ? 'ativado' : 'desativado'));

        axios({
            method: 'put',
            url: window.backend + "/api/v1/checklists/" + id + '?status=' + ativo,
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

    // TOAST
    const handleToast = () => {
        if (id) {
            return 'Checklist editado com sucesso!';
        } else {
            return 'Checklist cadastrado com sucesso!';
        }
    }

    // SETA CARGOS
    const handleSetCargos = (e) => {
        setCargos(e);
    }

    // OPTIONS SELECT TIPO
    const optionstTipo = [
        { value: 1, label: "Loja" },
        { value: 2, label: "Supervisão" },
        { value: 3, label: "Funcionário" }
    ];

    // OPTIONS SELECT FREQUÊNCIA
    const optionsFrequencia = [
        { value: 1, label: "Diário" },
        { value: 2, label: "Semanal" },
        { value: 3, label: "Mensal" }
    ];

    // OPTIONS SELECT SISTEMA
    const optionsSistema = [
        { value: 217, label: "Autoavaliação Novo" },
        { value: 23, label: "Checklist" }
    ];

    // OPTIONS SELECT TIPO SISTEMA
    const optionsTipoSistema = [
        { value: 'supervisao', label: "Supervisão" },
        { value: 'antes_depois', label: "Antes e Depois" }
    ];

    // OPTIONS SELECT META
    const optionsMeta = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: 6 },
        { value: 7, label: 7 },
        { value: 8, label: 8 },
        { value: 9, label: 9 },
        { value: 10, label: 10 }
    ];

    // DATA FORM
    const data = {
        checklist: id ? id : undefined,
        nome: nome,
        tipo_id: tipo,
        frequencia: 1,
        sistema_id: sistema,
        tipo_sistema,
        meta: '1',
        id_categoria: categoria,
        id_subcategoria: subcategoria,
        qtd_itens: 0, // VERIFICAR O QUE É
        cargos: cargos,
        departamento_id: departamento,
        checklist_para: checklistPara,
    }

    return (
        <>
            <Gerenciador
                id="checklists"
                title="Checklists"

                search={
                    <Input
                        name="filter_checklist"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Novo Checklist"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="checklists_inativos"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                {/* <InfiniteScroll
                    dataLength={15 * page}
                    hasMore={hasMore}
                    next={() => get_lojas(false)}
                    className="w-100"
                    scrollableTarget={'container_lojas'}
                > */}
                    <Table
                        id="table_checklist"
                        api={window.backend + '/api/v1/checklists/'}
                        params={{
                            departamentos: [filter_departamento],
                            status: (filterInactive ? [0, 1] : [1]),
                            filter_search: filter,                            
                        }}
                        onLoad={handleSetItems}
                        key_aux={['data']}
                        reload={reload + filter_departamento + emp + (id_apl ? id_apl : '')}
                        search={filter}
                        text_limit={(window.isMobile ? 20 : 30)}
                        pages={true}
                    >
                        <Tbody>
                            {(items.length > 0 ?
                                items.map((item, i) => {
                                    return (
                                        <Tr
                                            key={'checklist_' + item.id}
                                            cursor="pointer"
                                            active={(active === item.id ? true : false)}
                                        >
                                            <Td
                                                onClick={() => (handleSetActive(item.id), handleCallBackModulo(item.tipo_sistema))}
                                            >
                                                {item.nome}

                                                <span className="text-secondary">
                                                    {item.sistema ? ' (' + item.sistema + ')' : ''}
                                                </span>
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
                            {/* {hasMore &&
                                <Td colspan="100%">
                                    <Loader show={true} />
                                </Td>
                            } */}
                        </Tbody>
                    </Table>
                {/* </InfiniteScroll> */}
            </Gerenciador>

            {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
            {(edit ?
                <Gerenciador
                    id="checklist_insert"
                    title={(id ? ('Editar ' + nome) : 'Novo Checklist')}
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
                        api={window.backend + '/api/v1/checklists/' + (id ? id : "")}
                        method={id ? 'put' : 'post'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                        contentType={'application/json'}
                    >
                        <Input
                            id="checklist_nome"
                            name="checklist_nome"
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            loading={loading}
                        />
                        {(
                            window.rs_id_grupo > 0 ?
                                <SelectReact
                                    name="checklist_para"
                                    label="Checklist para"
                                    value={checklistPara}
                                    onChange={(e) => setChecklistPara(e.value)}
                                    options={[{ value: 1, label: "Empreendimento" }, { value: 2, label: "Grupo" }]}
                                    required={false}
                                    loading={loading}
                                />
                                : <></>
                        )}
                        <SelectReact
                            name="departamento"
                            label="Departamento"
                            value={departamento}
                            onChange={(e) => setDepartamento(e.value)}
                            options={optionsDepartamento}
                            required={false}
                            loading={loading}
                        />

                        <SelectReact
                            name="categoria"
                            label="Categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.value)}
                            options={optionsCategoria}
                            required={false}
                            loading={loading}
                        />

                        <SelectReact
                            name="subcategoria"
                            label="Subcategoria"
                            value={subcategoria}
                            onChange={(e) => setSubcategoria(e.value)}
                            options={optionsSubcategoria}
                            required={false}
                            loading={loading}
                        />

                        <SelectReact
                            id="checklist_tipo"
                            name="checklist_tipo"
                            options={optionstTipo}
                            label="Tipo"
                            value={tipo}
                            allowEmpty={false}
                            onChange={(e) => setTipo(e.value)}
                            loading={loading}
                        />

                        {/* <SelectReact
                            id="checklist_frequencia"
                            name="checklist_frequencia"
                            options={optionsFrequencia}
                            label="Frequência"
                            value={frequencia}
                            allowEmpty={false}
                            onChange={(e) => setFrequencia(e.value)}
                            loading={loading}
                        />  */}

                        <SelectReact
                            id="checklist_sistema"
                            name="checklist_sistema"
                            options={optionsSistema}
                            label="Sistema"
                            value={sistema}
                            allowEmpty={false}
                            onChange={(e) => setSistema(e.value)}
                            loading={loading}
                        />

                        <SelectReact
                            id="tipo_sistema"
                            name="tipo_sistema"
                            options={optionsTipoSistema}
                            label="Módulo"
                            required={false}
                            value={tipo_sistema}
                            onChange={(e) => setTipoSistema(e.value)}
                            loading={loading}
                        />

                        {/* <SelectReact
                            id="checklist_meta"
                            name="checklist_meta"
                            options={optionsMeta}
                            label="Meta"
                            value={meta}
                            allowEmpty={false}
                            onChange={(e) => setMeta(e.value)}
                            loading={loading}
                        />  */}

                        <CheckboxGroup
                            group="cargo"
                            value={cargos}
                            callback={handleSetCargos}
                            loading={loading}
                            required={false}
                        />

                        {/* <InputContainer loading={loading}>
                            <Switch
                                id="notificacao"
                                name="notificacao"
                                label="Disparar Notificação"
                                title={(notificacao == 1 ? 'Desativar' : 'Ativar')}
                                checked={(notificacao == 1 ? true : false)}
                                value={notificacao}
                                onChange={(e) => setNotificacao(e.target.checked)}
                            />
                        </InputContainer> */}

                        <Button
                            type="submit"
                            status={buttonStatus}
                            loading={loading}
                        >
                            Salvar
                        </Button>
                    </Form>
                </Gerenciador>
                : '')}
        </>
    )
}
