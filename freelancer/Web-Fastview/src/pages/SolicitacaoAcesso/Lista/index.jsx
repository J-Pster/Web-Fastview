import { useEffect, useState, useContext } from 'react';

import { GlobalContext } from "../../../context/Global";
import axios from 'axios';
import { cd, get_date } from '../../../_assets/js/global';
import Row from '../../../components/body/row';
import Col from '../../../components/body/col';
import Table from '../../../components/body/table';
import Tr from '../../../components/body/table/tr';
import Tbody from '../../../components/body/table/tbody';
import Td from '../../../components/body/table/tbody/td';
import Icon from '../../../components/body/icon';
import Modal from '../../../components/body/modal';
import ModalHeader from '../../../components/body/modal/modalHeader';
import ModalTitle from '../../../components/body/modal/modalHeader/modalTitle';
import ModalBody from '../../../components/body/modal/modalBody';
import Button from '../../../components/body/button';
import Item from './Item';
import toast from 'react-hot-toast';
import Form from '../../../components/body/form';
import Separator from '../../../components/body/separator';

export default function Lista(props) {
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // ESTADOS
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modulos, setModulos] = useState([]);
    const [modulosOutros, setModulosOutros] = useState([]);
    const [modulosSelecionados, setModulosSelecionados] = useState([]);
    const [modulosEditados, setModulosEditados] = useState([]);
    const [reload, setReload] = useState(undefined);
    const [id, setId] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [iconLoading, setIconLoading] = useState('');

    // FILTROS
    const [filterEmpreendimento, setFilterEmpreendimento] = useState(window.rs_id_emp == 26 ? [] : [window.rs_id_emp]);
    const [filterLoja, setFilterLoja] = useState([]);
    const [filterNome, setFilterNome] = useState();
    const [filterCpf, setFilterCpf] = useState();
    const [filterStatus, setFilterStatus] = useState(['0']);
    const [filterLogin, setFilterLogin] = useState('');
    const [filterSolicitadoInicio, setFilterSolicitadoInicio] = useState('');
    const [filterSolicitadoFim, setFilterSolicitadoFim] = useState('');
    const [filterAprovadoPor, setFilterAprovadoPor] = useState('');
    const [filterReprovadoPor, setFilterReprovadoPor] = useState('');

    // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    // LISTA ITENS
    const handleSetItems = (e) => {
        setItems(e);
        setIconLoading(false);
    }

    // AÇÕES AO ABRIR MODAL DE MÓDULOS
    const handleShowModalModulos = (id, modulos) => {
        setShowModal(true);
        setId(id);
        setModulos(modulos);

        let modulos_aux = [];

        modulos.map((item, i) => {
            modulos_aux.push({
                id: item?.sistema_id,
                permissao: item?.nivel_de_acesso,
                permissao_id: item?.nivel_de_acesso_permissao
            })
        });

        setModulosEditados(modulos_aux);
    } 

    // AÇÕES AO FECHAR MODAL DE MÓDULOS
    function handleCloseModal(confirm){
        if(!confirm || window.confirm('As alterações não foram salvas, deseja sair sem salvar?')){
            setShowModal(false);
            setModulos([]);
            setModulosEditados([]);
            setId('');
        }
    }

    // FILTRO DE EMPREENDIMENTO
    const handleFilterEmpreendimento = (e) => {
        setFilterEmpreendimento(e);
    }

    // FILTRO DE LOJA
    const handleFilterLoja = (e) => {
        setFilterLoja(e);
    }

    // FILTRO DE NOME
    const handleFilterNome = (e) => {
        setFilterNome(e);
    }

    // FILTRO DE CPF
    const handleFilterCpf = (e) => {
        setFilterCpf(e);
    }

    // FILTRO DE LOGIN
    const handleFilterLogin = (e) => {
        setFilterLogin(e);
    }

    // FILTRO DE STATUS
    const handleFilterStatus = (e) => {
        setFilterStatus(e);
    }

    // FILTRO DE DATA SOLICITAÇÃO (INÍCIO)
    const handleSetFilterSolicitadoInicio = (e) => {
        setFilterSolicitadoInicio(e);
        handleSetFilter(true);
    }

    // FILTRO DE DATA SOLICITAÇÃO (FIM)
    const handleSetFilterSolicitadoFim = (e) => {
        setFilterSolicitadoFim(e);
        handleSetFilter(true);
    }

    // FILTRO DE APROVADO POR
    const handleFilterAprovadoPor = (e) => {
        setFilterAprovadoPor(e);
    }

    // FILTRO DE REPROVADO POR
    const handleFilterReprovadoPor = (e) => {
        setFilterReprovadoPor(e);
    }

    // OPTIONS FILTRO STATUS
    const optionsFilterStatus = [
        {value: '0', label: 'Pendente'},
        {value: '1', label: 'Aprovado'},
        {value: '2', label: 'Reprovado'}
    ];

    // CONSTRÓI AS TH'S
    const thead = [
        { enabled: window.rs_id_emp == 26 ? true : false, export: window.rs_id_emp == 26 ? true : false, label: 'Empreendimento', id: 'empreendimento', name: 'empreendimento', api: {url: window.host + '/api/sql.php?do=select&component=' + (window.rs_id_emp == 26 ? 'empreendimento' : 'grupo_empreendimento')}, onChange: handleFilterEmpreendimento },
        { enabled: true, export: true, label: 'Loja', id: 'loja', name: 'loja', api: window.host + '/api/sql.php?do=select&component=loja', onChange: handleFilterLoja },
        { enabled: true, export: true, label: 'Nome completo', id: 'nome_completo', name: 'nome_completo', onChange: handleFilterNome },        
        { enabled: true, export: true, label: 'CPF', id: 'cpf', name: 'cpf', onChange: handleFilterCpf },
        { enabled: true, export: true, label: 'Login', id: 'login', name: 'login', onChange: handleFilterLogin },
        { enabled: true, export: true, label: 'Módulos', id: 'modulos', name: 'modulos', filter: false },
        { enabled: true, export: true, label: 'Status', id: 'status_nome', name: 'status_nome', items: optionsFilterStatus, onChange: handleFilterStatus, filtered: filterStatus, value: filterStatus },
        { enabled: true, export: true, label: 'Solicitado em', id: 'cad', name: 'cad', type: 'date',  start: { value: filterSolicitadoInicio, onChange: handleSetFilterSolicitadoInicio }, end: { value: filterSolicitadoFim, onChange: handleSetFilterSolicitadoFim } },
        { enabled: true, export: true, label: 'Aprovado por', id: 'aprovado_por', name: 'aprovado_por', api: {url: window.backend+'/api/v1/utilities/filters/usuarios', params: {sistema_id: window.rs_sistema_id}, key_aux: ['data']}, onChange: handleFilterAprovadoPor },
        { enabled: true, export: true, label: 'Reprovado por', id: 'reprovado_por', name: 'reprovado_por', api: {url: window.backend+'/api/v1/utilities/filters/usuarios', params: {sistema_id: window.rs_sistema_id}, key_aux: ['data']}, onChange: handleFilterReprovadoPor  },
        { enabled: window.rs_permission_apl === 'master' ? true : false, export: false, label: 'Ações', id: 'acoes', name: 'acoes', filter: false, width: 1, align: 'center' },
    ]

    // TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    })

    // URL API TABLE
    const url = window.backend+'/api/v1/preenchimentos/usuarios';

    // PARAMS API TABLE
    const params = {
        nome: filterNome ? filterNome : undefined,
        login: filterLogin ? filterLogin : undefined,
        cpf: filterCpf ? filterCpf : undefined,
        status: filterStatus ? filterStatus : undefined,
        empreendimentos: filterEmpreendimento.length > 0 ? filterEmpreendimento : undefined,
        lojas: filterLoja.length > 0 ? filterLoja : undefined,
        data_ini: filterSolicitadoInicio ? get_date('date_sql', cd(filterSolicitadoInicio), 'date') : undefined,
        data_fim: filterSolicitadoFim ? get_date('date_sql', cd(filterSolicitadoFim), 'date') : undefined,
        aprovado_por: filterAprovadoPor ? filterAprovadoPor : undefined,
        reprovado_por: filterReprovadoPor ? filterReprovadoPor : undefined,
    };

    // BODY DO EXPORTADOR
    const body = {
        titles: thead_export,
        url: url,
        name: 'Solicitações de Acesso',
        filters: params,
        orientation: 'L'
    }

    // MANDA OS FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (props?.icons) {
            props.icons(
                // <>
                //     <Icon type="excel" api={{ body: body }} />
                //     <Icon type="pdf" api={{ body: body }} />
                // </>
            );
        }

        if (props?.filters) {
            props.filters('');
        }
    }, []);

    // APROVA/REPROVA USUÁRIOS
    function handleSetUsuario(id, status){
        let txt;

        if(status === 1){
            txt = 'Tem certeza que deseja aprovar o usuário? Após essa ação ele poderá acessar o sistema com todos os módulos que foram selecionados';
        }else{
            txt = 'Tem certeza que deseja reprovar o usuário? Após essa ação ele não poderá acessar o sistema';
        }

        if(window.confirm(txt)){
            setIconLoading({
                id: id,
                status: status
            });

            if(status === 1){
                axios({
                    method: 'get',
                    url: window.backend+'/api/v1/preenchimentos/'+id+'/usuarios/aprovar'
                }).then(() => {
                    setReload(id);
                    toast('Usuário aprovado com sucesso');
                });
            }else if(status === 2){
                axios({
                    method: 'delete',
                    url: window.backend+'/api/v1/preenchimentos/'+id+'/usuarios/reprovar'
                }).then(() => {
                    setReload(id);
                    toast('Usuário reprovado com sucesso');
                });
            }
        }
    }

    // CALLBACK ITEM MÓDULO
    const handleCallbackItem = (e) => {
        let modulos_aux = modulosEditados.filter((elem) => elem.id != e.modulo);

        modulos_aux.push({
            id: e.modulo,
            permissao: e.value,
            permissao_id: e?.value_aux
        });

        setModulosEditados(modulos_aux);
    }

    // CALLBACK STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // CALLBACK DE RESPOSTA DO FORM
    const handleFormResponse = (e) => {
        handleCloseModal(false);
        toast('Permissões alteradas com sucesso');
        setReload(Math.random());
    }

    // GET OPTIONS DOS MÓDULOS
    useEffect(() => {
        if(modulosOutros.length == 0){
            axios({
                method: 'get',
                url: window.backend+'/api/v1/utilities/filters/sistemas',
                params: {
                    client: 'madnezz',
                    empreendimento_id: window.rs_id_emp,
                    no_paginated: 1
                }
            }).then((response) => {
                if(response?.data?.data){
                    setModulosOutros(response.data.data);
                }
            });
        }
    },[showModal]);

    return (
        <>
            <Modal centered show={showModal} onHide={() => handleCloseModal(true)}>
                <ModalHeader>
                    <ModalTitle>
                        Módulos escolhidos
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form
                        api={window.backend+'/api/v1/preenchimentos/'+id+'/usuarios'}
                        method="put"
                        data={{
                            modulos: modulosEditados
                        }}
                        status={handleFormStatus}
                        response={handleFormResponse}
                    >
                        <div className="mb-4">
                            {modulos.length > 0 ?
                                modulos.map((item, i) => {
                                    return(
                                        <Item
                                            modulo={item}
                                            key={'modulo_'+item.sistema_id}
                                            value={item?.nivel_de_acesso}
                                            callback={handleCallbackItem}
                                        />
                                    )
                                })
                            :
                                <p>Nenhum módulo selecionado pelo usuário</p>
                            }
                        </div>

                        <Separator label={'Outros módulos'} />

                        <div className="mb-4">
                            {modulosOutros.map((item, i) => {
                                let modulos_selecionados = [];
                                modulos?.map((item, i) => {
                                    modulos_selecionados.push(item?.sistema_id);
                                });

                                if(!modulos_selecionados.includes(item?.id)){
                                    return(
                                        <Item
                                            modulo={item}
                                            key={'modulo_'+item.id}
                                            optional={true}
                                            // value_aux={item?.nivel_de_acesso_permissao}
                                            callback={handleCallbackItem}
                                        />
                                    )
                                }
                            })}
                        </div>

                        <Button
                            type="submit"
                            status={formStatus}
                        >
                            Salvar
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Row>
                <Col lg={12}>
                    <Table
                        id="solicitacao_acesso"
                        api={url}
                        params={params}
                        rightFixed={true}
                        onLoad={handleSetItems}
                        thead={thead}
                        key_aux={['data']}
                        reload={reload}
                        limit={15}
                        pages={true}
                    >
                        <Tbody>
                            {(items.length > 0 ?
                                items?.map((item, i) => {
                                    // PEGA NOMES DOS MÓDULOS SELECIONADOS
                                    let modulos_aux = '';
                                    item.modulos.map((modulo, i) => {
                                        modulos_aux += modulo.sistema_nome+', ';
                                    });
                                    modulos_aux = modulos_aux.slice(0,-2);

                                    return (
                                        <Tr key={'lista_' + item.id} >
                                            {(window.rs_id_emp == 26 ?
                                                <Td title={item?.empreendimento_nome}>
                                                    {item?.empreendimento_nome}
                                                </Td>
                                            :'')}

                                            <Td title={item?.loja_nome}>
                                                {item?.loja_nome}
                                            </Td>

                                            <Td title={item?.usuario_nome}>
                                                {item?.usuario_nome}
                                            </Td>

                                            <Td title={item?.usuario_cpf}>
                                                {item?.usuario_cpf}
                                            </Td>

                                            <Td title={item?.usuario_login}>
                                                {item?.usuario_login}
                                            </Td>

                                            <Td title={modulos_aux} className="cursor-pointer" onClick={() => handleShowModalModulos(item?.id, item?.modulos)}>
                                                {modulos_aux}
                                            </Td>

                                            <Td className="text-capitalize">
                                                {item?.status_nome.toLowerCase()}
                                            </Td>

                                            <Td>
                                                {item.cad ? get_date('datetime', item.cad, 'datetime_sql') : '-'}
                                            </Td>

                                            <Td>
                                                {item.aprovado_por ? item.aprovado_por + (item.data_aprovado ? ' ('+get_date('datetime', item.data_aprovado, 'datetime_sql')+')' : '') : '-'}
                                            </Td>

                                            <Td>
                                                {item.reprovado_por ? item.reprovado_por + (item.data_reprovado ? ' ('+get_date('datetime', item.data_reprovado, 'datetime_sql')+')' : '') : '-'}
                                            </Td>

                                            {(window.rs_permission_apl === 'master' ?
                                                <Td
                                                    width={1}
                                                    align="center"
                                                >
                                                    <Icon
                                                        type="check"
                                                        animated
                                                        title={item?.status == 1 ? 'Aprovado' : (item?.status == 2 ? false : 'Aprovar')}
                                                        className={item?.status == 1 ? 'text-success' : ''}
                                                        readonly={item?.status == 1 ? true : false}
                                                        disabled={item?.status == 2 || iconLoading?.id == item.id && iconLoading?.status == 2 ? true : false}
                                                        onClick={() => (!item?.status || item?.status == 0 ? handleSetUsuario(item?.id, 1) : {})}
                                                        loading={iconLoading?.id == item.id && iconLoading?.status == 1 ? true : false}
                                                    />

                                                    <Icon
                                                        type="times"
                                                        animated
                                                        title={item?.status == 2 ? 'Reprovado' : (item?.status == 1 ? false : 'Reprovar')}
                                                        className={item?.status == 2 ? 'text-danger' : ''}
                                                        readonly={item?.status == 2 ? true : false}
                                                        disabled={item?.status == 1 || iconLoading?.id == item.id && iconLoading?.status == 1 ? true : false}
                                                        loading={iconLoading?.id == item.id && iconLoading?.status == 2 ? true : false}
                                                        onClick={() => (!item?.status || item?.status == 0 ? handleSetUsuario(item?.id, 2) : {})}
                                                    />
                                                </Td>
                                            :'')}
                                        </Tr>
                                    )
                                })
                            :<></>)}
                        </Tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}