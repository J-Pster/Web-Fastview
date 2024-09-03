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
import Textarea from '../../../../../components/body/form/textarea';

export default function Pergunta({ checklist, secao, callback, disabled, modulo }) {
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState(null);
    const [posicao, setPosicao] = useState(null);
    const [pontos, setPontos] = useState(null);
    const [peso, setPeso] = useState(null);
    const [anexoObrigatorio, setAnexoObrigatorio] = useState(null);
    const [comentarioObrigatorio, setComentarioObrigatorio] = useState(null);
    const [perguntaCondicional, setPerguntaCondicional] = useState(null);
    const [modelo, setModelo] = useState('');
    const [modeloAux, setModeloAux] = useState('');
    const [qtdFotos, setQtdFotos] = useState(1);
    const [perguntaVisivel, setPerguntaVisivel] = useState();

    // ESTADOS DE OPTIONS
    const [optionsPerguntas, setOptionsPerguntas] = useState([]);

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

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE ITENS
        scrollToCol('itens');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    }, [checklist, secao]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }
    // SETAR ANEXO
    const handleSetAnexo = (response) => {
        setModelo(response[0]);

        let modelo_aux = [];
        JSON.parse(response[0]).map((item, i) => {
            modelo_aux.push(item.id);
        });
        setModeloAux(modelo_aux);

    };

    // RESETAR FORM
    function reset_form() {
        setId(null);
        setNome(null);
        setPosicao(null);
        setPontos(null);
        setPeso(null);
        setAnexoObrigatorio(null);
        setComentarioObrigatorio(null);
        setModelo(null);
        setModeloAux(null)
        setQtdFotos(null)
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome) => {
        if (id) {
            setEdit(id);
            setId(id);
            setLoading(true);

            axios({
                method: 'get',
                url: window.backend + '/api/v1/checklists/perguntas/' + id
            }).then((response) => {

                if (response?.data) {
                    // console.log(response.data)
                    let array_aux = [];
                    setNome(response?.data?.nome);
                    setPosicao(response?.data?.posicao);
                    setPontos(response?.data?.pontos);
                    setPeso(response?.data?.peso);
                    setAnexoObrigatorio(response?.data?.anexo_obrigatorio);
                    setComentarioObrigatorio(response?.data?.mensagem_obrigatorio);
                    setQtdFotos(response?.data?.qtd_foto);
                    setPerguntaVisivel(response?.data?.visivel == 0 ? 2 : 1);
                    
                    /** @type {Array<{id:string, type:string, size:number, name:string}>} */
                    const modelos = response?.data?.modelos ?? [];
                    const aux = modelos.map((item) => item?.id);
                    setModeloAux(aux);
                    setModelo(JSON.stringify(modelos));   
                }

                setLoading(false);
            });
        } else {
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('pergunta_insert');

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
        setEdit(false);
        reset_form();
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
    const handleSetItemActive = (id, status) => {
        toast('Pergunta ' + (status == 1 ? 'ativada' : 'desativada'));

        axios({
            method: 'put',
            url: window.backend + '/api/v1/checklists/perguntas/'+id,
            data: {
                status: status
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
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

    // OPTIONS PERGUNTAS
    useEffect(() => {
        setOptionsPerguntas([]);

        axios({
            method: 'get',
            url: window.backend + '/api/v1/checklists/perguntas',
            params: {
                secoes: [secao]
            }
        }).then((response) => {
            if (response?.data?.data) {
                setOptionsPerguntas(response.data.data);
            }
        });
    }, [secao]);

    // DATA FORM
    const data = {
      pergunta: id ? id : undefined,
      secao_id: secao ? secao : undefined,
      nome: nome,
      posicao: posicao ? posicao : undefined,
      // meta: meta ? meta : undefined,
      pontos: pontos && parseFloat(pontos).toFixed(2),
      peso: peso && parseFloat(peso).toFixed(2),
      anexo_obrigatorio: anexoObrigatorio ? 1 : 0,
      mensagem_obrigatorio: comentarioObrigatorio ? 1 : 0,
      visivel: perguntaVisivel == 1 ? 1 : 0,
      pergunta_id: perguntaCondicional ? perguntaCondicional : undefined,
      modelos: modeloAux ?? [],
      qtd_foto: qtdFotos,
      // job: job ? job : undefined,
      // images: images ? images : undefined
    };

    return (
        <>
            <Gerenciador
                id="perguntas"
                title="Perguntas"
                search={
                    <Input
                        name="filter_pergunta"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova Pergunta"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="pergunta_inativos"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_checklist"
                    api={window.backend + '/api/v1/checklists/perguntas'}
                    params={{
                        secoes: [secao],
                        status: (filterInactive ? [0, 1] : [1])
                    }}
                    onLoad={handleSetItems}
                    key_aux={['data']}
                    reload={reload + checklist + secao}
                    text_limit={(window.isMobile ? 20 : 30)}
                >
                    <Tbody>
                        {(items.length > 0 ?
                            items.filter((item, i) => {
                                if (!filter) return true;
                                if (item?.nome?.toLowerCase()?.includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {
                                return (
                                    <Tr
                                        key={'checklist_' + item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td
                                            onClick={() => handleSetActive(item.id)}
                                        >
                                            {item.nome}
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
                    </Tbody>
                </Table>
            </Gerenciador>

            {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
            {(edit ?
                <Gerenciador
                    id="pergunta_insert"
                    title={(id ? ('Editar ' + nome) : 'Nova Pergunta')}
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
                        api={window.backend + '/api/v1/checklists/perguntas' + (id ? ('/' + id) : '')}
                        method={id ? 'put' : 'post'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Textarea
                            id="pergunta_nome"
                            name="pergunta_nome"
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            loading={loading}
                            height={80}
                        />

                        {(modulo == "supervisao" ?
                            <SelectReact
                                nome="pergunta_visivel"
                                label="Pergunta visível"
                                value={perguntaVisivel}
                                onChange={(e) => setPerguntaVisivel(e.value)}
                                options={[{ value: 1, label: "Sim" }, { value: 2, label: "Não" }]}
                                loading={loading}
                            />
                            : <></>)}

                        <Input
                            id="pergunta_posicao"
                            name="pergunta_posicao"
                            label="Posição"
                            value={posicao}
                            onChange={(e) => setPosicao(e.target.value)}
                            loading={loading}
                        />

                        <Input
                            id="pergunta_pontos"
                            name="pergunta_pontos"
                            label="Pontos"
                            value={pontos}
                            onChange={(e) => setPontos(e.target.value)}
                            loading={loading}
                        />

                        <Input
                            id="pergunta_peso"
                            name="pergunta_peso"
                            label="Peso"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                            loading={loading}
                        />

                        <InputContainer loading={loading}>
                            <Switch
                                id="anexo_obrigatorio"
                                name="anexo_obrigatorio"
                                label="Anexo Obrigatório"
                                title={(anexoObrigatorio && anexoObrigatorio != 0 ? 'Desativar' : 'Ativar')}
                                checked={(anexoObrigatorio && anexoObrigatorio != 0 ? true : false)}
                                value={anexoObrigatorio}
                                onChange={(e) => setAnexoObrigatorio(e.target.checked)}
                            />
                        </InputContainer>

                        <InputContainer loading={loading}>
                            <Switch
                                id="comentario_obrigatorio"
                                name="comentario_obrigatorio"
                                label="Comentário Obrigatório"
                                title={(comentarioObrigatorio && comentarioObrigatorio != 0 ? 'Desativar' : 'Ativar')}
                                checked={(comentarioObrigatorio && comentarioObrigatorio != 0 ? true : false)}
                                value={comentarioObrigatorio}
                                onChange={(e) => setComentarioObrigatorio(e.target.checked)}
                            />
                        </InputContainer>

                        {(modulo == "supervisao" ?
                            <Input
                                name="modelo"
                                type="file"
                                label="Modelo"
                                value={modelo}
                                multiple={true}
                                callback={handleSetAnexo}
                                loading={loading}
                            />
                            : <></>)}

                        {(modulo == "supervisao" ?
                            <SelectReact
                                name="qtd_fotos"
                                label="Qtd. Fotos"
                                value={qtdFotos}
                                onChange={(e) => setQtdFotos(e.value)}
                                options={[{ value: 1, label: 1 }, { value: 2, label: 2 }]}
                                loading={loading}
                            />
                            : <></>)}
                        {(optionsPerguntas.length>0 ?
                            <SelectReact
                                id="condicionar_pergunta"
                                name="condicionar_pergunta"
                                label="Condicionar a pergunta"
                                options={optionsPerguntas.filter((elem) => elem.id != id)}
                                loading={loading}
                                value={perguntaCondicional}
                                onChange={(e) => setPerguntaCondicional(e.value)}
                                required={false}
                            />
                            : <></>)}

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
