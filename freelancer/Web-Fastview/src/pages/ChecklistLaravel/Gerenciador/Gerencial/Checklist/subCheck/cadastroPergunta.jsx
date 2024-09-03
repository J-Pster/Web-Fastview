import { useEffect, useState } from "react";
import Button from "../../../../../components/body/button";
import Form from "../../../../../components/body/form";
import Gerenciador from "../../../../../components/body/gerenciador";
import Input from "../../../../../components/body/form/input";
import Icon from "../../../../../components/body/icon";
import SelectReact from "../../../../../components/body/select";
import axios from "axios";

export default function NovaPergunta({ modulo, id_table, secao_id_aux, callback, callback_close, pergunta_id_aux, secao_selected }) {
    // ESTADOS
    const [formStatus, setFormStatus] = useState('');

    // ESTADOS DOS CAMPOS
    const [nome, setNome] = useState('');
    const [perguntaVisivel, setPerguntaVisivel] = useState('');
    const [posicao, setPosicao] = useState('');
    const [pontos, setPontos] = useState('');
    const [peso, setPeso] = useState('');
    const [anexo, setAnexo] = useState('');
    const [comentarioObrigatorio, setComentarioObrigatorio] = useState(1);
    const [modelo, setModelo] = useState('');
    const [modeloAux, setModeloAux] = useState('');
    const [listaPerguntas, setListaPerguntas] = useState([])
    const [pergunta, setPergunta] = useState('');
    const [qtdFotos, setQtdFotos] = useState(1);

    function getInfo() {
        axios.get(window.host+"/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_perguntas&id=" + id_table)
            .then((response) => {
                return (
                    setNome(response.data.item.nome),
                    setPosicao(response.data.item.posicao),
                    setPontos(response.data.item.pontos),
                    setPeso(response.data.item.peso),
                    setAnexo(response.data.item.anexo_obrigatorio == 0 ? 2 : response.data.item.anexo_obrigatorio),
                    setComentarioObrigatorio(response?.data?.item?.mensagem_obrigatorio),
                    setPerguntaVisivel(response.data.item.visivel),
                    setModelo(response.data.item.modelo),
                    setModeloAux(response.data.item.modelo),
                    setPergunta(response.data.item.pergunta_id),
                    setQtdFotos(response?.data?.item?.qtd_foto)
                )
            })
    }

    //FUNÇÃO QUE FAZ A LISTA DE PERGUNTAS QUE PODEM SER RELACIONADAS
    function getPerguntas() {
        let lista = [{ value: '', label: '' }]
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_perguntas&secao_id=" + secao_selected)
            .then((response) => {
                response.data.map(item => {
                    item.id !== id_table && item.status == 1 &&
                        lista.push({ value: item.id, label: item.nome })
                })
                setListaPerguntas(lista);

            })
    }

    //ATUALIZAR INPUTS COM INFOS QUE VEM DE PROPS
    useEffect(() => {
        if (id_table) {
            getInfo();
        } else {
            setNome('');
            setPosicao('');
            setPontos('');
            setPeso('');
            setAnexo('');
            setComentarioObrigatorio(1);
            setModelo('');
            setModeloAux('');
            setPerguntaVisivel('');
            setPergunta('');
            setQtdFotos(1);
        }
        getPerguntas('');
    }, [id_table]);

    //INFORMAÇÕES QUE SERÃO ENVIADAS PARA A API
    const data = {
        perguntas_id: id_table ? id_table : '',
        secao_id: secao_id_aux,
        perguntas_nome: nome,
        perguntas_visivel: perguntaVisivel,
        perguntas_posicao: posicao,
        perguntas_pontos: pontos,
        perguntas_peso: peso,
        perguntas_anexo_obrigatorio: anexo == 1 ? 1 : 2 ,
        perguntas_mensagem_obrigatorio: comentarioObrigatorio,
        img_modelo: modeloAux,
        parent_pergunta_id: pergunta,
        perguntas_qtd_foto: qtdFotos
    };
    //LIMPAR OS INPUTS AO ENVIAR O FORMULÁRIO
    function resetForm() {
        callback(true);
        setNome('');
        setPerguntaVisivel('');
        setPosicao('');
        setPontos('');
        setPeso('');
        setAnexo('');
        setComentarioObrigatorio(1);
        callback_close(false);
        setQtdFotos(1);
    }

    // SETAR ANEXO
    const handleSetAnexo = (response) => {
        setModelo(response[0]);

        let modelo_aux = [];
        JSON.parse(response[0]).map((item, i) => {
            modelo_aux.push(item.id);
        });

        setModeloAux(modelo_aux.toString());
    };

    // CALLBACK STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    return (
        <Gerenciador
            title={id_table ? "Editar" : "Novo"}
            icon={<Icon type="reprovar" title="Fechar" onClick={() => callback_close(false)} />}
        >
            <Form
                api={window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=post_perguntas"}
                data={data}
                callback={resetForm}
                toast={"Salvo com sucesso"}
                status={handleFormStatus}
            >
                <Input
                    type="text"
                    name="nome"
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                {(
                    id_table && modulo == "supervisao" ?
                        <SelectReact
                            nome="pergunta_visivel"
                            label="Pergunta visível"
                            value={perguntaVisivel}
                            onChange={(e) => setPerguntaVisivel(e.value)}
                            options={[{ value: 1, label: "Sim" }, { value: 2, label: "Não" }]}
                        />
                        : <></>
                )}
                <Input
                    type="text"
                    name="posicao"
                    label="Posição"
                    value={posicao}
                    onChange={(e) => setPosicao(e.target.value)}
                />
                <Input
                    type="text"
                    name="pontos"
                    label="Pontos"
                    value={pontos}
                    onChange={(e) => setPontos(e.target.value)}
                />
                <Input
                    type="text"
                    name="peso"
                    label="Peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                />
                <SelectReact
                    name="comunicado"
                    label="Anexo Obrigatório"
                    value={anexo}
                    onChange={(e) => setAnexo(e.value)}
                    options={[{ value: 1, label: "Sim" }, { value: 2, label: "Não" }]}
                />
                <SelectReact
                    name="comentario_obrigatorio"
                    label="Comentário Obrigatório"
                    value={comentarioObrigatorio}
                    onChange={(e) => setComentarioObrigatorio(e.value)}
                    options={[{ value: 1, label: "Não" }, { value: 2, label: "Sempre" }, { value: 3, label: "Se Conforme" }]}
                />
                
                {(modulo == "supervisao" ?
                    <Input
                        name="modelo"
                        type="file"
                        label="Modelo"
                        value={modelo}
                        multiple={true}
                        callback={handleSetAnexo}
                    />
                :'')}

                {(modulo == "supervisao" ?
                    <SelectReact
                        name="qtd_fotos"
                        label="Qtd. Fotos"
                        value={qtdFotos}
                        onChange={(e) => setQtdFotos(e.value)}
                        options={[{ value: 1, label: 1 }, { value: 2, label: 2 }]}
                    />
                :'')}

                {(
                    listaPerguntas &&
                    <SelectReact
                        label="Condicionar a pergunta"
                        name="pergunta"
                        value={pergunta}
                        onChange={(e) => setPergunta(e.value)}
                        options={listaPerguntas}
                        required={false}
                    />
                )}
                
                <Button
                    type="submit"
                    status={formStatus}
                >
                    Salvar
                </Button>
            </Form>
        </Gerenciador>
    )
}