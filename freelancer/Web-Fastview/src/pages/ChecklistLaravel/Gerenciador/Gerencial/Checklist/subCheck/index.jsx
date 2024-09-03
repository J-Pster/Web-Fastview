import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Tr from "../../../../../components/body/table/tr";
import Td from "../../../../../components/body/table/tbody/td";
import Loader from "../../../../../components/body/loader";
import { toast } from "react-hot-toast";
import NovaSecao from "./cadastroSecao";
import NovaPergunta from "./cadastroPergunta";
import Switch from "../../../../../components/body/switch";

export default function GerenciadorSubCheck({ id, modulo }) {

    //REF
    const scrollElement = useRef();

    //ESTADOS - Seção
    const [secao, setSecao] = useState([]);
    const [searchSecao, setSearchSecao] = useState('');
    const [secaoId, setSecaoId] = useState('');
    const [loadingSecao, setLoadingSecao] = useState(true);
    const [inativosSecao, setInativosSecao] = useState(false);
    const [secaoSelected, setSecaoSelected] = useState('');

    //ESTADOS PERGUNTA
    const [pergunta, setPergunta] = useState([]);
    const [searchPergunta, setSearchPergunta] = useState('');
    const [inativosPergunta, setInativosPergunta] = useState(false);
    const [loadingPergunta, setLoadingPergunta] = useState(true);
    const [perguntaSelected, setPerguntaSelected] = useState('');

    //ESTADOS ITEM
    const [item, setItem] = useState([]);
    const [searchItem, setSearchItem] = useState('');
    const [loadingItem, setLoadingItem] = useState(true);

    //ESTADOS GERENCIADOR CADASTRAR/EDITAR SEÇÃO
    const [editSecao, setEditSecao] = useState(false);
    const [nomeSecao, setNomeSecao] = useState('');
    const [cargosSecao, setCargosSecao] = useState('');
    const [checkIdSecao, setCheckIdSecao] = useState('');
    const [comunicadoSecao, setComunicadoSecao] = useState('');
    const [posicaoSecao, setPosicaoSecao] = useState('');

    //ABRIR GERENCIADOR CADASTRAR/EDITAR SEÇÃO
    const handleEditSecao = (id, nome, cargos, checklist_id, comunicado, posicao) => (
        setEditSecao(true),
        setSecaoId(id),
        setNomeSecao(nome),
        setCargosSecao(cargos),
        setCheckIdSecao(checklist_id),
        setComunicadoSecao(comunicado),
        setPosicaoSecao(posicao),
        setSecaoSelected(''),
        setPerguntaSelected('')
    );
    //FECHAR GERENCIADOR  SEÇÃO
    const callbackCloseSecao = (res) => {
        setEditSecao(res)
    };

    //ESTADOS GERENCIADOR CADASTRAR/EDITAR PERGUNTA
    const [editPergunta, setEditPergunta] = useState(false);
    const [idPergunta, setIdPergunta] = useState('');
    const [nomePergunta, setNomePergunta] = useState('');
    const [posicaoPergunta, setPosicaoPergunta] = useState('');
    const [pontosPergunta, setPontosPergunta] = useState('');
    const [pesoPergunta, setPesoPergunta] = useState('');
    const [perguntaSecaoId, setPerguntaSecaoId] = useState('');
    const [anexoPergunta, setAnexoPergunta] = useState('');
    const [visivelPergunta, setVisivelPergunta] = useState('');
    const [perguntaIdAux, setPerguntaIdAux] = useState('');

    //ABRIR GERENCIADOR CADASTRAR/EDITAR PERGUNTA
    const handleEditPergunta = (id, secao_id, nome, posicao, pontos, peso, anexo, visivel, pergunta_id_aux) => (
        setEditPergunta(true),
        setIdPergunta(id),
        setPerguntaSecaoId(secao_id),
        setNomePergunta(nome),
        setPosicaoPergunta(posicao),
        setPontosPergunta(pontos),
        setPesoPergunta(peso),
        setAnexoPergunta(anexo == 0 ? 2 : 1),
        setVisivelPergunta(visivel),
        setPerguntaSelected(''),
        setPerguntaIdAux(pergunta_id_aux)
    );
    //FECHAR GERENCIADOR PERGUNTA
    const callbackClosePergunta = (res) => {
        setEditPergunta(res);
    };

    //PEGAR INFOS DA API PRO GERENCIADOR SEÇÃO
    function getSecao() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_secoes&checklist_id=" + id)
            .then((response) => {
                setSecao(response.data);
                setLoadingSecao(false);
                setSecaoSelected('')
                setPerguntaSelected('');
                setEditSecao(false);
                setEditPergunta(false);
            })
    }
    useEffect(() => {
        getSecao();
    }, [id]);

    const callback_secao = _ => getSecao();

    //PEGAR INFOS DA API PRO GERENCIADOR PERGUNTAS
    function getPergunta() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_perguntas&secao_id=" + secaoSelected)
            .then((response) => {
                setPergunta(response.data);
                setLoadingPergunta(false);
                setPerguntaSelected('');
                setEditPergunta(false);
            })
    }
    useEffect(() => {
        if(secaoSelected){
            getPergunta();
        }
    }, [secaoSelected]);

    const callback_pergunta = _ => getPergunta();

    //PEGAR INFOS DA API PRO GERENCIADOR  ITENS
    function getItem() {
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_perguntas_itens_icones&pergunta_id=" + perguntaSelected)
            .then((response) => {
                setItem(response.data);
                setLoadingItem(false);
            })
    }
    useEffect(() => {
        if(perguntaSelected){
            getItem();
        }
    }, [perguntaSelected]);

    //ATIVOS/INATIVOS
    function updateAtivos(id, status, table, pergunta) {
        let res = status == 0 ? 1 : 0;
        let requestData = new FormData();
        requestData.append("id", id);
        requestData.append("status", res);
        requestData.append("tabela", table);
        requestData.append("pergunta_id", pergunta);
        axios({
            method: "post",
            url: window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=status",
            headers: { "Content-Type": "multipart/form-data" },
            data: requestData,
        }).then(() => {
            if (table == "secoes") {
                getSecao();
                if (res == 0) {
                    toast("Seção desativada com sucesso!");
                } else if (res == 1) {
                    toast("Seção ativada com sucesso!");
                }
                setSecaoSelected('');
            } else if (table == "perguntas") {
                getPergunta();
                if (res == 0) {
                    toast("Pergunta desativada com sucesso!");
                } else if (res == 1) {
                    toast("Pergunta ativada com sucesso!");
                }
                setPerguntaSelected('');
            } else if (table == "perguntas_itens_icones") {
                getItem();
                if (res == 0) {
                    toast("Item desativado com sucesso!");
                } else if (res == 1) {
                    toast("Item ativado com sucesso!");
                }
            }
        })
    }

    //HANDLE SCROLL ELEMENT
    function handleScrollElement() {
        setTimeout(() => {
            scrollElement.current.scrollIntoView({ behavior: 'smooth' });
        }, 100)
    }

    return (
        <>
            <Gerenciador
                id="secao"
                title="Seção"
                icon={<Icon type="new" onClick={() => handleEditSecao('', '', '', id)} />}
                search={
                    <Input placeholder="Pesquisar" value={searchSecao} onChange={(e) => setSearchSecao(e.target.value)} />
                }
                switch={
                    <Input
                        type="checkbox"
                        id="check_inativos_secao"
                        label="Mostrar Inativos"
                        inverse={true}
                        onChange={(e) => (setInativosSecao(e.target.checked))}
                    />
                }
            >
                <Table>
                    <Tbody>
                        {(loadingSecao ?
                            <Tr>
                                <Td>
                                    <Loader show={true} />
                                </Td>
                            </Tr>
                            :
                            (secao.length > 0 ?
                                (secao.filter((item) => {
                                    if (!searchSecao) return true;
                                    if (item.nome.toLowerCase().includes(searchSecao.toLowerCase())) {
                                        return true
                                    }
                                }).map((item, i) => {
                                    return (
                                        <Tr
                                            cursor="pointer"
                                            key={item.id}
                                            active={(secaoSelected == item.id ? true : false)}
                                            innerRer={(secaoSelected == item.id ? scrollElement : {})}
                                        >
                                            <Td
                                                hide={item.status == 0 ? (inativosSecao ? false : true) : ''}
                                                onClick={() => (setSecaoSelected(secaoSelected == item.id ? '' : item.id), setEditSecao(false))}
                                            >
                                                {item.nome}
                                            </Td>
                                            <Td
                                                hide={item.status == 0 ? (inativosSecao ? false : true) : ''}
                                                align="end"
                                            >
                                                <Icon
                                                    type="edit"
                                                    onClick={() => handleEditSecao(
                                                        item.id,
                                                        item.nome,
                                                        item.cargos,
                                                        item.checklist_id,
                                                        item.disparar_comunicado_plano_acao,
                                                        item.posicao
                                                    )}
                                                />
                                                <Switch
                                                    checked={(item.status == 1 ? true : false)}
                                                    onChange={() => updateAtivos(item.id, item.status, "secoes")}
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
            {editSecao ?
                <NovaSecao
                    id_table={secaoId}
                    nome_table={nomeSecao}
                    cargos_table={cargosSecao}
                    checklist_id_table={checkIdSecao}
                    comunicado_table={comunicadoSecao}
                    posicao_table={posicaoSecao}
                    callback={callback_secao}
                    callback_close={callbackCloseSecao}
                />
                : <></>}
            {(secaoSelected ?
                <>
                    <Gerenciador
                        id="pergunta"
                        title="Pergunta"
                        icon={<Icon type="new" onClick={() => handleEditPergunta('', secaoSelected, '', '', '', '', '')} />}
                        autoScroll={true}
                        search={
                            <Input placeholder="Pesquisar" value={searchPergunta} onChange={(e) => setSearchPergunta(e.target.value)} />
                        }
                        switch={
                            <Input
                                type="checkbox"
                                id="check_inativos_pergunta"
                                label="Mostrar Inativos"
                                inverse={true}
                                onChange={(e) => (setInativosPergunta(e.target.checked))}
                            />
                        }
                    >
                        <Table>
                            <Tbody>
                                {(loadingPergunta ?
                                    <Tr>
                                        <Td><Loader show={true} /></Td>
                                    </Tr>
                                    :
                                    (pergunta.length > 0 ?
                                        (pergunta.filter((item) => {
                                            if (!searchPergunta) return true;
                                            if (item.nome.toLowerCase().includes(searchPergunta.toLowerCase())) {
                                                return true
                                            }
                                        }).map((item, i) => {
                                            return (
                                                <Tr
                                                    cursor="pointer"
                                                    key={item.id}
                                                    active={(perguntaSelected == item.id ? true : false)}
                                                    hide
                                                    innerRer={(perguntaSelected == item.id ? scrollElement : {})}
                                                >
                                                    <Td
                                                        hide={item.status == 0 ? (inativosPergunta ? false : true) : ''}
                                                        onClick={() => (setPerguntaSelected(perguntaSelected == item.id ? '' : item.id), setEditPergunta(false))}
                                                    >
                                                        {item.nome}
                                                    </Td>
                                                    <Td align="end"
                                                        hide={item.status == 0 ? (inativosPergunta ? false : true) : ''}
                                                    >
                                                        <Icon
                                                            type="edit"
                                                            onClick={() => handleEditPergunta(item.id, item.secao_id, item.nome, item.posicao, item.pontos, item.peso, item.anexo_obrigatorio, item.visivel)}
                                                        />
                                                        <Switch
                                                            checked={(item.status == 1 ? true : false)}
                                                            onChange={() => updateAtivos(item.id, item.status, "perguntas")}
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
                    {editPergunta == true ?
                        <NovaPergunta
                            id_table={idPergunta}
                            nome_table={nomePergunta}
                            secao_id_aux={perguntaSecaoId}
                            posicao_table={posicaoPergunta}
                            pontos_table={pontosPergunta}
                            peso_table={pesoPergunta}
                            anexo_table={anexoPergunta}
                            visivel_table={visivelPergunta}
                            pergunta_id_aux={perguntaIdAux}
                            callback={callback_pergunta}
                            callback_close={callbackClosePergunta}
                            modulo={modulo}
                            secao_selected={secaoSelected}
                        />
                        : <></>}
                </>
                : <></>
            )}
            {(perguntaSelected ?
                <Gerenciador
                    id="item"
                    title="Item"
                    autoScroll={true}
                    search={<Input placeholder="Pesquisar" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} inverse={true} />}
                >
                    <Table fullHeight={true}>
                        <Tbody>
                            {(loadingItem ?
                                <Tr>
                                    <Td>
                                        <Loader show={true} />
                                    </Td>
                                </Tr>
                                :
                                (item.length > 0 ?
                                    (item.filter((item) => {
                                        if (!searchItem) return true;
                                        if (item.nome.toLowerCase().includes(searchItem.toLowerCase())) {
                                            return true
                                        }
                                    }).map((item, i) => {
                                        return (
                                            <Tr
                                                key={item.id}
                                            // hide
                                            >
                                                <Td
                                                // hide={ item.status == 0 ? (inativosItem ? false : true) : '' }
                                                >
                                                    {item.nome}
                                                </Td>
                                                <Td align="end"
                                                //  hide={ item.status == 0 ? (inativosItem ? false : true) : '' }
                                                >
                                                    <Switch
                                                        checked={(item.status == 1 ? true : false)}
                                                        onChange={() => updateAtivos(item.id, item.status, "perguntas_itens_icones", item.pergunta_id)}
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
                : <></>
            )}
        </>
    )

}