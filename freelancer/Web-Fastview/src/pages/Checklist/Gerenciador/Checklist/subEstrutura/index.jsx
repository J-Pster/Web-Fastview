import axios from "axios";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import Input from "../../../../../components/body/form/input";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Td from "../../../../../components/body/table/tbody/td";
import Tr from "../../../../../components/body/table/tr";
import Loader from "../../../../../components/body/loader";
import Switch from "../../../../../components/body/switch"
import NovoResponsavel from "./cadastroResponsavel";
import NovoItem from "./cadastroItens";

export default function GerenciadorSubEstrutura({ id, edit_estrutura, callback_close_estrutura }) {

    //ESTADOS TABELA RESPONSAVEIS
    const [resp, setResp] = useState([]);
    const [searchResp, setSearchResp] = useState('');
    const [inativosResp, setInativosResp] = useState('');
    const [loadingResp, setLoadingResp] = useState(true);
    //MODAL CADASTRAR/EDITAR RESPONSÁVEIS
    const [editResponsavel, setEditResponsavel] = useState(false);
    const [idResp, setIdResp] = useState('');
    const [emailResp, setEmailResp] = useState('');
    const [checkResp, setCheckResp] = useState('');
    //ESTADOS TABELA ITENS
    const [itens, setItens] = useState([]);
    const [searchItens, setSearchItens] = useState('');
    const [inativosItens, setInativosItens] = useState('');
    const [loadingItens, setLoadingItens] = useState('');
    //MODAL CADASTRAR/EDITAR ITENS
    const [editItem, setEditItem] = useState(false);
    const [idItem, setIdIdem] = useState('');
    const [item, setItem] = useState('');
    const [icon, setIcon] = useState('');

    //ABRIR GERENCIADOR CADASTRO/EDIÇÃO RESPONSÁVEIS
    const handleEditResp = (id, email, check_id) => (
        setEditResponsavel(true),
        setIdResp(id),
        setEmailResp(email),
        setCheckResp(check_id),
        setEditItem(false),
        callback_close_estrutura(false)
    );
    //FECHAR GERENCIADOR RESPONSÁVEIS
    const callbackCloseResp = (res) => {
        setEditResponsavel(res);
    };
    //ABRIR GERENCIADRO CADASTRO/EDIÇÃO ITEM
    const handleShowItens = (id, item, icon) => (
        setEditItem(true),
        setIdIdem(id),
        setItem(item),
        setIcon(icon),
        setEditResponsavel(false),
        callback_close_estrutura(false)
    );
    //FECHAR GERENCIADOR ITEM
    const callbackCloseItem = (res) => {
        setEditItem(res);
    };

    //PEGAR INFOS DA API PRO GERENCIADORRESPONSAVEIS
    function getResponsaveis() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_responsaveis")
            .then((response) => {
                setResp(response.data);
                setLoadingResp(false);
                setEditResponsavel(false);
                setEditItem(false);
            })
    }
    useEffect(() => { getResponsaveis() }, []);
    const callback_responsaveis = _ => { getResponsaveis() };

    //PEGAR INFOS DA API PRO GERENCIADOR ITENS
    function getItens() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_itens_icones")
            .then((response) => {
                setItens(response.data);
                setLoadingItens(false);
                setEditResponsavel(false);
                setEditItem(false);
            })
    }
    useEffect(() => { getItens() }, []);
    const callback_items = _ => { getItens() };

    //ATIVOS/INATIVOS -> RECEBE A TABELA POR PARAMETRO 
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
            if (table == "responsaveis") {
                getResponsaveis();
                if (res == 0) {
                    toast("Resposável desativado com sucesso!")
                } else if (res == 1) {
                    toast("Resposável ativado com sucesso!")
                }
            } else if (table == "itens_icones") {
                getItens();
                if (res == 0) {
                    toast("Item desativado com sucesso!")
                } else if (res == 1) {
                    toast("Item ativado com sucesso!")
                }
            }
        })
    }

    //Se abrir o gerenciador de edição na na primeira tabela, fechar as que estiverem abertas aqui
    useEffect(() => {
        if (edit_estrutura) {
            setEditResponsavel(false);
            setEditItem(false)
        }
    }, [edit_estrutura]);

    return (
        <>
            <>
                <Gerenciador
                    id="responsaveis"
                    title="Responsáveis"
                    icon={<Icon type="new" onClick={() => handleEditResp('', '', id, '')} />}
                    search={
                        <Input placeholder="Pesquisar" value={searchResp} onChange={(e) => setSearchResp(e.target.value)} />
                    }
                    switch={
                        <Input
                            type="checkbox"
                            id="check_inativos_responsaveis"
                            label="Mostrar Inativos"
                            inverse={true}
                            onChange={(e) => setInativosResp(e.target.checked)}
                        />
                    }
                >
                    <Table fullHeigth={true}>
                        <Tbody>
                            {(loadingResp ?
                                <Tr>
                                    <Td><Loader show={true} /></Td>
                                </Tr>
                                :
                                (resp.length > 0 ?
                                    (resp.filter((item) => {
                                        if (!searchResp) return true;
                                        if (item.email.toLowerCase().includes(searchResp.toLowerCase())) {
                                            return true
                                        }
                                    }).map((item, i) => {
                                        return (
                                            <Tr
                                                key={item.id}
                                                cursor="pointer"
                                            >
                                                <Td
                                                    hide={item.status == 0 ?
                                                        (inativosResp ? false : true)
                                                        : ''}
                                                >
                                                    {item.email}
                                                </Td>
                                                <Td
                                                    align="end"
                                                    hide={item.status == 0 ?
                                                        (inativosResp ? false : true)
                                                        : ''}
                                                >
                                                    <Icon
                                                        type="edit"
                                                        onClick={() => handleEditResp(item.id, item.email, item.checklist_id)}
                                                    />
                                                    <Switch
                                                        checked={(item.status == 1 ? true : false)}
                                                        onChange={() => updateAtivos(item.id, item.status, "responsaveis")}
                                                    />
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                    )
                                    : <Tr empty={true}></Tr>
                                )
                            )}
                        </Tbody>
                    </Table>
                </Gerenciador>
                {editResponsavel ?
                    <NovoResponsavel
                        id={id}
                        id_table={idResp}
                        email_table={emailResp}
                        check_id_table={checkResp}
                        callback={callback_responsaveis}
                        callback_close={callbackCloseResp}
                    />
                    : <></>
                }
            </>
            <>
                <Gerenciador
                    id="itens"
                    title="Itens"
                    icon={<Icon type="new" onClick={() => handleShowItens()} />}
                    search={
                        <Input placeholder="Pesquisar" value={searchItens} onChange={(e) => setSearchItens(e.target.value)} />
                    }
                    switch={
                        <Input
                            type="checkbox"
                            id="check_inativos_itens"
                            label="Mostrar Inativos"
                            inverse={true}
                            onChange={(e) => setInativosItens(e.target.checked)}
                        />
                    }
                >
                    <Table fullHeigth={true}>
                        <Tbody>
                            {(loadingItens ?
                                <Tr>
                                    <Td>
                                        <Loader empty={true} />
                                    </Td>
                                </Tr>
                                :
                                (itens.length > 0 ?
                                    (itens.filter((item) => {
                                        if (!searchItens) return true;
                                        if (item.nome.toLowerCase().includes(searchItens.toLowerCase())) {
                                            return true
                                        }
                                    }).map((item, i) => {
                                        return (
                                            <Tr key={item.id}>
                                                <Td
                                                    hide={item.status == 0 ?
                                                        (inativosItens ? false : true)
                                                        : ''}
                                                >
                                                    {item.nome}
                                                </Td>
                                                <Td
                                                    align="end"
                                                    hide={item.status == 0 ?
                                                        (inativosItens ? false : true)
                                                        : ''}
                                                >
                                                    <Icon
                                                        type="edit"
                                                        onClick={() => handleShowItens(item.id, item.nome, item.icone)}
                                                    />
                                                    <Switch
                                                        checked={(item.status == 1 ? true : false)}
                                                        onChange={() => updateAtivos(item.id, item.status, "itens_icones")}
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
                    editItem ?
                        <NovoItem
                            id_table={idItem}
                            item_table={item}
                            icon_table={icon}
                            callback={callback_items}
                            callback_close={callbackCloseItem}
                        />
                        :
                        <></>
                }
            </>
        </>
    )
}