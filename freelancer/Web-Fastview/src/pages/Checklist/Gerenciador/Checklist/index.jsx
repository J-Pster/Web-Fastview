import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import Input from "../../../../components/body/form/input";
import Gerenciador from "../../../../components/body/gerenciador";
import Icon from "../../../../components/body/icon";
import Row from "../../../../components/body/row";
import Table from "../../../../components/body/table";
import Tbody from "../../../../components/body/table/tbody";
import axios from "axios";
import Loader from "../../../../components/body/loader";
import Tr from "../../../../components/body/table/tr";
import Td from "../../../../components/body/table/tbody/td";
import GerenciadorSubCheck from "./subCheck";
import GerenciadorSubEstrutura from "./subEstrutura";
import SelectReact from "../../../../components/body/select";
import Container from "../../../../components/body/container";
import NovoChecklist from "./subCheck/cadastroChecklist";
import Switch from "../../../../components/body/switch";
import NovaEstrutura from "./subEstrutura/cadastroEstrutura";

export default function GerenciadorChecklist({icons, filters}) {
    //REF
    const scrollElement = useRef();

    //MUDAR GERENCIADOR CHECKLIST/ESTRUTURA
    const [changeSystem, setChangeSystem] = useState('checklist');
    //ESTADOS CHECKLIST
    const [search, setSearch] = useState('');
    const [inativos, setInativos] = useState(false);
    const [check, setCheck] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState('');
    const [modulo_aux, setModuloAux] = useState('');
    //ABRIR GERENCIADOR, SE FOR EDITAR, MANDAR ESSAS INFORMAÇÕES
    const [editCheck, setEditCheck] = useState(false);
    const [auxId, setAuxId] = useState('');
    const [auxNome, setAuxNome] = useState('');
    const [auxTipoId, setAuxTipoId] = useState('');
    const [auxFrequencia, setAuxFrequencia] = useState('');
    const [auxSistemaId, setAuxSistemaId] = useState('');
    const [auxSistema, setAuxSistema] = useState('');
    const [auxTipoSistema, setAuxTipoSistema] = useState('');
    const [auxMeta, setAuxMeta] = useState('');
    const [auxNotificacao, setAuxNotificacao] = useState('');
    const [auxCargos, setAuxCargos] = useState('');

    //CADASTRAR/EDITAR GERENCIADOR CHECKLIST
    const handleEditarCheck = (id, nome, tipo_id, frequencia, sistema_id, sistema, tipo_sistema, meta, cargos, notificacao) => (
        setEditCheck(true),
        setAuxId(id),
        setAuxNome(nome),
        setAuxTipoId(tipo_id),
        setAuxFrequencia(frequencia),
        setAuxSistemaId(sistema_id),
        setAuxSistema(sistema),
        setAuxTipoSistema(tipo_sistema),
        setAuxMeta(meta),
        setAuxNotificacao(notificacao),
        setAuxCargos(cargos),
        setSelected('')
    );
    //ATUALIZAR O GERENCIADOR AO FAZER CADASTRO/EDIÇÃO
    const callbackClose = (res) => {
        setEditCheck(res);
    };

    //PEGAR INFOS DA API PRO GERENCIADOR CHECKLIST
    function getInfo() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_checklists")
            .then((response) => {
                setCheck(response.data);
                setLoading(false);
            })
    }
    useEffect(() => {
        getInfo();
    }, []);

    //HANDLE SCROLL ELEMENT
    function handleScrollElement() {
        setTimeout(() => {
            scrollElement.current.scrollIntoView({ behavior: 'smooth' });
        }, 100)
    }
    const callback = _ => getInfo();

    //ESTADOS ESTRUTURA
    const [estrutura, setEstrutura] = useState([]);
    const [searchEstrura, setSearchEstrutura] = useState('');
    const [inativosEstrutura, setInativosEstrutura] = useState('');
    const [loadingEstrutura, setLoadingEstrutura] = useState(true);
    const [filterAno, setFilterAno] = useState(window.currentYear);

    //PEGAR INFOS DA API PRO GERENCIADOR ESTRUTURA
    function getEstrutura() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_periodos", {
            params: {
                filtro_ano: filterAno,
            }
        }).then((response) => {
            setEstrutura(response.data);
            setLoadingEstrutura(false);
        })
    }
    useEffect(() => { getEstrutura(); }, [filterAno]);

    //ESTADOS CADASTRO/EDITAR ESTRUTURA
    const [editEstrutura, setEditEstrutura] = useState(false);
    const [idEstrutura, setIdEstrutura] = useState('');
    const [nomeEstrutura, setNomeEstrutura] = useState('');
    const [dataInicioEstrutura, setDataInicioEstrutura] = useState('');
    const [dataFimEstrutura, setDataFimEstrutura] = useState('');
    const [empreendimentEstrutura, setEmpreendimentoEstrutura] = useState('');

    //CADASTRAR/EDITAR GERENCIADOR PERÍODO
    const handleEditEstrutura = (id, nome, cad, fim, empreendimento_id) => {
        setEditEstrutura(true);
        setIdEstrutura(id);
        setNomeEstrutura(nome);
        setDataInicioEstrutura(cad);
        setDataFimEstrutura(fim);
        setEmpreendimentoEstrutura(empreendimento_id);
    };
    //ATUALIZAR O GERENCIADOR AO FAZER CADASTRO/EDIÇÃO
    const callback_estrutura = _ => getEstrutura();
    //FECHAR GERENCIADOR CADASTRO AO ENVIAR O FORMULÁRIO, OU CLICAR NO BOTÃO
    const callbackCloseEstrutura = (res) => {
        setEditEstrutura(res);
    };
    //FECHAR GERENCIADOR CADASTRO, SE OUTRO FOR ABERTO
    const callbackCloseEstrutura2 = (res) => {
        setEditEstrutura(res)
    };
    //ATIVOS/INATIVOS -> PASSANDO A TABELA POR PARAMETRO 
    function updateAtivos(id, status, table) {
        let res = status == 0 ? 1 : 0;
        let requestData = new FormData();
        requestData.append("id", id);
        requestData.append("status", res);
        requestData.append("tabela", table);
        requestData.append("pergunta_id", '');
        axios({
            method: "post",
            url: window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=status",
            headers: { "Content-Type": "multipart/form-data" },
            data: requestData,
        }).then(() => {
            if (table == "checklists") {
                getInfo();
                if (res == 0) {
                    toast("Checklist desativado com sucesso!")
                } else if (res == 1) {
                    toast("Checklist ativado com sucesso!")
                }
                setSelected('');
            } else if (table == "periodos") {
                getEstrutura();
                if (res == 0) {
                    toast("Seção desativada com sucesso!")
                } else if (res == 1) {
                    toast("Seção ativada com sucesso!")
                }
            }
        })
    }

    // LIMPA FILTROS E ÍCONES DO COMPONENTE PAI
    useEffect(() => {
        if(icons){
            icons('');
        }

        if(filters){
            filters('');
        }
    },[]);

    return (
        <>
            <Container>
                <Row wrap={false}>
                    {(
                        changeSystem == "checklist" ?
                            <>
                                <Gerenciador
                                    id="checklist"
                                    title="Checklist"
                                    autoScroll={true}
                                    icon={
                                        <>
                                            <Icon type="cog" onClick={() => (setChangeSystem('estrutura'), setEditEstrutura(false))} />
                                            <Icon type="new" onClick={() => handleEditarCheck('')} />
                                        </>
                                    }
                                    search={
                                        <Input placeholder="Pesquisar" value={search} onChange={(e) => setSearch(e.target.value)} />
                                    }
                                    switch={
                                        <Input
                                            type="checkbox"
                                            id="check_inativos"
                                            label="Mostrar Inativos"
                                            inverse={true}
                                            onChange={(e) => (setInativos(e.target.checked))}
                                        />
                                    }
                                >
                                    <Table fullHeight={true} >
                                        <Tbody>
                                            {(loading ?
                                                <Tr>
                                                    <Td>
                                                        <Loader show={true} />
                                                    </Td>
                                                </Tr>
                                                :
                                                (check.length > 0 ?
                                                    (check.filter((item) => {
                                                        if (!search) return true;
                                                        if (item.nome.toLowerCase().includes(search.toLowerCase())
                                                        ) {
                                                            return true
                                                        }
                                                    })
                                                    ).map((item, i) => {
                                                        return (
                                                            <Tr
                                                                key={item.id}
                                                                cursor="pointer"
                                                                active={(selected === item.id ? true : false)}
                                                                hide={item.status == 0 ? (inativos ? false : true) : ''}
                                                                innerRef={(selected == item.id) ? scrollElement : {}}
                                                            >
                                                                <Td
                                                                    hide={item.status == 0 ? (inativos ? false : true) : ''}
                                                                    onClick={() => (setSelected(selected == item.id ? '' : item.id), setModuloAux(selected == item.id ? '' : item.tipo_sistema), setEditCheck(false))}
                                                                >
                                                                    {item.nome}
                                                                    <span style={{ color: "#ddd" }}>
                                                                        {" "} ({item.sistema})
                                                                    </span>
                                                                </Td>
                                                                <Td align="end"
                                                                    hide={item.status == 0 ? (inativos ? false : true) : ''}
                                                                >
                                                                    <Icon
                                                                        type="edit"
                                                                        animated
                                                                        onClick={() => handleEditarCheck(item.id, item.nome, item.tipo_id, item.frequencia, item.sistema_id,
                                                                            item.sistema, item.tipo_sistema, item.meta, item.cargos, item?.disparar_notificacao)}
                                                                    />
                                                                    <Switch
                                                                        checked={(item.status == 1 ? true : false)}
                                                                        onChange={() => updateAtivos(item.id, item.status, "checklists")}
                                                                    />
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    })
                                                    : <></>
                                                )
                                            )}
                                        </Tbody>
                                    </Table>
                                </Gerenciador>
                                {editCheck ?
                                    <NovoChecklist
                                        id_table={auxId}
                                        nome_table={auxNome}
                                        tipo_id_table={auxTipoId}
                                        frequencia_table={auxFrequencia}
                                        sistema_id_table={auxSistemaId}
                                        sistema_table={auxSistema}
                                        tipo_sistema_table={auxTipoSistema}
                                        meta_table={auxMeta}
                                        notificacao_table={auxNotificacao}
                                        cargos_table={auxCargos}
                                        callback={callback}
                                        callback_close={callbackClose}
                                    />
                                    : <></>}
                                {selected ? <GerenciadorSubCheck id={selected} modulo={modulo_aux} /> : <></>}
                            </>
                            :
                            <>
                                <Gerenciador
                                    id="estrutura"
                                    autoScroll={true}
                                    title={<>
                                        Período
                                        <SelectReact
                                            value={filterAno}
                                            onChange={(e) => setFilterAno(e.value)}
                                            options={[{ value: 0, label: "Ano" }, { value: 2022, label: "2022" }, { value: 2023, label: "2023" }]}
                                            required={false}
                                        />
                                    </>}
                                    icon={
                                        <>
                                            <Icon type="enter" onClick={() => (setChangeSystem('checklist'), setEditCheck(false))} />
                                            <Icon type="new" onClick={() => handleEditEstrutura('')} />

                                        </>
                                    }
                                    search={
                                        <Input placeholder="Pesquisar" value={searchEstrura} onChange={(e) => setSearchEstrutura(e.target.value)} />
                                    }
                                    switch={
                                        <Input
                                            type="checkbox"
                                            id="check_inativos_estrutura"
                                            label="Mostrar Inativos"
                                            inverse={true}
                                            onChange={(e) => (setInativosEstrutura(e.target.checked))}
                                        />
                                    }
                                >
                                    <Table fullHeight={true}>
                                        <Tbody>
                                            {(
                                                loadingEstrutura ?
                                                    <Tr>
                                                        <Td>
                                                            <Loader show={true} />
                                                        </Td>
                                                    </Tr>
                                                    :
                                                    (estrutura.length > 0 ?
                                                        (estrutura.filter((item) => {
                                                            if (!searchEstrura) return true;
                                                            if (item.nome.toLowerCase().includes(searchEstrura.toLowerCase())) {
                                                                return true
                                                            }
                                                        }).map((item, i) => {
                                                            return (
                                                                <Tr
                                                                    key={item.id}
                                                                    hide={item.status == 0 ?
                                                                        (inativosEstrutura ? false : true)
                                                                        : ''}
                                                                >
                                                                    <Td
                                                                        hide={item.status == 0 ?
                                                                            (inativosEstrutura ? false : true)
                                                                            : ''}
                                                                    >
                                                                        {item.nome}
                                                                    </Td>
                                                                    <Td
                                                                        align="end"
                                                                        hide={item.status == 0 ?
                                                                            (inativosEstrutura ? false : true)
                                                                            : ''}
                                                                    >
                                                                        <Icon
                                                                            type="edit"
                                                                            onClick={() => handleEditEstrutura(item.id, item.nome, item.cad, item.fim, item.empreendimento_id)}
                                                                        />
                                                                        <Switch
                                                                            checked={(item.status == 1 ? true : false)}
                                                                            onChange={() => updateAtivos(item.id, item.status, "periodos")}
                                                                        />
                                                                    </Td>
                                                                </Tr>
                                                            )
                                                        })
                                                        )
                                                        : <Tr empty={true}></Tr>)
                                            )}
                                        </Tbody>
                                    </Table>
                                </Gerenciador>
                                {
                                    editEstrutura ?
                                        <NovaEstrutura
                                            id_table={idEstrutura}
                                            nome_table={nomeEstrutura}
                                            data_inicio_table={dataInicioEstrutura}
                                            data_fim_table={dataFimEstrutura}
                                            empreendimento_table={empreendimentEstrutura}
                                            callback={callback_estrutura}
                                            estrutura={estrutura}
                                            callback_close={callbackCloseEstrutura}
                                        />
                                        :
                                        <></>
                                }
                                <GerenciadorSubEstrutura edit_estrutura={editEstrutura} callback_close_estrutura={callbackCloseEstrutura2} />
                            </>
                    )}
                </Row>
            </Container>
        </>
    )
}