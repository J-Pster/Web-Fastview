import { useState, useEffect, useRef } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
import Table from '../../../../../components/body/table';
import Tbody from '../../../../../components/body/table/tbody';
import Tr from '../../../../../components/body/table/tr';
import Td from '../../../../../components/body/table/tbody/td';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Switch from '../../../../../components/body/switch';
import Icon from '../../../../../components/body/icon';
import { scrollToCol } from '../../../../../_assets/js/global';
import Form from '../../../../../components/body/form';
import Button from '../../../../../components/body/button';
import Textarea from '../../../../../components/body/form/textarea';
import SelectReact from '../../../../../components/body/select';
import Options from './Options';
import InputContainer from '../../../../../components/body/form/inputcontainer';
import style from './item.module.scss';

export default function Item({ checklist, secao, pergunta, disabled, callback }) {
    // ESTADOS
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState(null);
    const [edit, setEdit] = useState(false);
    const [formStatus, setFormStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterInactive, setFilterInactive] = useState(false);
    const [reload, setReload] = useState(false);
    const [optionsTipo, setOptionsTipo] = useState([]);
    const [optionsIcones, setOptionsIcones] = useState([]);
    const [hasOptions, setHasOptions] = useState(false);

    // ESTADOS DO FORM
    const [id, setId] = useState(null);
    const [tipo, setTipo] = useState(null);
    const [icone, setIcone] = useState(null);
    const [nome, setNome] = useState(null);
    const [descricao, setDescricao] = useState(null);
    const [peso, setPeso] = useState(null);
    const [pontos, setPontos] = useState(null);
    const [obrigatorio, setObrigatorio] = useState(null);

    // RESETAR FORM
    function reset_form(){
        setId(null);
        setTipo(null);
        setIcone(null);
        setNome(null);
        setDescricao(null);
        setPeso(null);
        setPontos(null);
        setObrigatorio(null);
    }

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // AÇÕES AO TROCAR O TIPO DO ITEM
    const handleSetTipo = (value) => {
        setTipo(value);
        setIcone(null);
        scrollToCol('options');
    }

    // GET OPTIONS
    useEffect(() => {
        if(edit && optionsTipo.length == 0){
            axios({
                method: 'get',
                url: window.backend+'/api/v1/checklists/filters/itens'
            }).then((response) => {
                if(response?.data){
                    setOptionsTipo(response?.data);
                }
            })
        }

        if(edit && optionsIcones.length == 0){
            axios({
                method: 'get',
                url: window.backend+'/api/v1/checklists/filters/icones'
            }).then((response) => {
                if(response?.data){
                    setOptionsIcones(response?.data);
                }
            })
        }
    },[edit]);

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, status) => {
        toast('Item ' + (status == 1 ? 'habilitado' : 'desabilitado') + ' com sucesso');

        axios({
            method: 'put',
            url: window.backend + '/api/v1/checklists/perguntas/items/'+id,
            data: {
                ativo: status
            },
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            
        }).catch(_error => {
            toast('Ocorreu um erro ao ' + (ativo ? 'habilitar' : 'desabilitar') + ' o item');
        });
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome) => {
        if(id){
            setEdit(id);
            setId(id);
            setNome(nome);
            setLoading(true);

            axios({
                method: 'get',
                url: window.backend+'/api/v1/checklists/perguntas/items/'+id
            }).then((response) => {
                if(response?.data){                    
                    setNome(response?.data?.nome);
                    setTipo(response?.data?.item_id);
                    setIcone(response?.data?.icone_id);
                    setDescricao(response?.data?.descricao);
                    setPeso(response?.data?.peso ? parseInt(response?.data?.peso) : '');
                    setPontos(response?.data?.pontos ? parseInt(response?.data?.pontos) : '');
                    setObrigatorio(response?.data?.obrigatorio);

                    if(response?.data?.item?.has_options == 1){
                        setHasOptions(true);
                        scrollToCol('options');
                    }else{
                        setHasOptions(false);
                    }
                }

                setLoading(false);
            });
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('item_insert');
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

    // FECHA COLUNA DE CRIAÇÃO/EDIÇÃO SEMPRE QUE TROCA O ID DA PERGUNTA
    useEffect(() => {
        setEdit(false);
    },[pergunta]);

    // VERIFICA SE O TIPO SELECIONADO POSSUSI A COLUNA DE OPÇÕES PARA CADASTRAR
    useEffect(() => {
        if(tipo){
            if(optionsTipo.filter((elem) => elem.id == tipo)[0]?.has_options == 1){
                setHasOptions(true);
            }else{
                setHasOptions(false);
            }
        }
    },[tipo]);

    // DADOS DO FORMULÁRIO
    const data = {
        pergunta_id: pergunta,
        item_id: tipo,
        icone_id: icone,
        nome: nome,
        descricao: descricao,
        peso: peso ? peso+'.00' : peso,
        pontos: pontos ? pontos+'.00': pontos,
        obrigatorio: obrigatorio
    }

    // VERIFICA STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // RECARREGA LISTA AO RECEBER O RETORNO DA API DE CADASTRO
    const handleReloadForm = () => {
        setReload(!reload);
    }

    // TOAST
    const handleToast = () => {
        if(id){
            return 'Item editado com sucesso!';
        }else{
            return 'Item cadastrado com sucesso!';
        }
    }

    // AÇÕES AO ENVIAR FORM DE CADASTRO
    const handleSendForm = () => {
        reset_form();   
        setEdit(false);
    }

    // FILTRO DE INATIVOS
    const handleSetFilterInactive = () => {
        setFilterInactive(!filterInactive);
        handleReloadForm();
    }

    return (
        <>
            <Gerenciador
                id="itens"
                title="Itens"
                search={
                    <Input
                        name="filter_item"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Novo item"
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
                    id="table_itens"
                    api={window.backend + '/api/v1/checklists/perguntas/items'}
                    params={{
                        perguntas: [pergunta],
                        ativo: filterInactive ? [0, 1] : [1]
                    }}
                    key_aux={['data']}
                    onLoad={handleSetItems}
                    reload={checklist + secao + pergunta + reload}
                    text_limit={(window.isMobile ? 20 : 30)}
                >
                    <Tbody>

                        {(items.length > 0 ?
                            items.filter((item, i) => {
                                if (!filter) return true;
                                if (item?.nome.toLowerCase().includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {
                                    return (
                                        <Tr
                                            key={'checklist_' + item.id}
                                        >
                                            <Td>
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
                                                    title={(item?.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                    checked={item?.ativo == 1 ? true : false}
                                                    onChange={() => handleSetItemActive(item?.id, (item?.ativo == 1 ? 0 : 1))}
                                                    animated
                                                />
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
                <>
                    <Gerenciador 
                        id="item_insert"
                        title={(id ? ('Editar '+nome) : 'Novo item')}
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
                            api={window.backend+'/api/v1/checklists/perguntas/items'+(id ? ('/'+id) : '')}
                            method={id ? 'put' : 'post'}
                            data={data}
                            status={handleFormStatus}
                            response={handleReloadForm}
                            callback={() => handleSendForm(true)}
                            toast={handleToast}
                        >
                            <SelectReact
                                id="tipo_id"
                                name="tipo_id"
                                label="Tipo"
                                options={optionsTipo}
                                value={tipo}
                                allowEmpty={false}
                                onChange={(e) => handleSetTipo(e.value)}
                                loading={loading}
                            />

                            <InputContainer
                                label={'Ícone: '+(optionsTipo?.filter((elem) => elem?.id == tipo)[0]?.icone_obrigatorio == 1 ? '*' : '')}
                                loading={loading}
                            >
                                {(tipo && optionsTipo?.filter((elem) => elem?.id == tipo)[0]?.icone_obrigatorio != 0 ?
                                    (optionsIcones.length > 0 ?
                                        <div className={style.icons_container}>
                                            {optionsIcones?.filter((elem) => elem.tipo_icone == tipo)?.map((item, i) => {
                                                // DEFINE CLASSE DO ÍCONE
                                                let class_aux = '';
                                                if(icone){
                                                    if(icone == item?.id){
                                                        class_aux = item?.classe;
                                                    }else{
                                                        class_aux = 'text-secondary';
                                                    }
                                                }else{
                                                    class_aux = '';
                                                }

                                                return(
                                                    <Icon
                                                        type={item?.icone}
                                                        title={item?.nome}
                                                        className={class_aux}
                                                        onClick={() => setIcone(item?.id)}
                                                    />
                                                )
                                            })}
                                        </div>
                                    :
                                        <p>Nenhum ícone disponível</p>
                                    )
                                :'')}
                            </InputContainer>

                            <Input 
                                id="nome"
                                name="nome"
                                label="Nome"  
                                value={nome}
                                onChange={(e) => setNome(e?.target?.value)}
                                loading={loading}
                            />

                            <Textarea 
                                id="descricao"
                                name="descricao"
                                label="Descrição"  
                                value={descricao}
                                onChange={(e) => setDescricao(e?.target?.value)}
                                required={false}
                                loading={loading}
                            />

                            <Input 
                                id="peso"
                                mask={'99'}
                                maskChar={''}
                                name="peso"
                                label="Peso"  
                                value={peso}
                                onChange={(e) => setPeso(e?.target?.value)}
                                loading={loading}
                            />

                            <Input 
                                id="pontos"
                                mask={'99'}
                                maskChar={''}
                                name="pontos"
                                label="Pontos"  
                                value={pontos}
                                onChange={(e) => setPontos(e?.target?.value)}
                                loading={loading}
                            />

                            <InputContainer label="Obrigatório" loading={loading}>
                                <div className="d-flex w-100 align-items-center justify-content-end">
                                    <Switch
                                        type="check"
                                        title={(obrigatorio == 1 ? 'Desativar' : 'Ativar')}
                                        checked={(obrigatorio == 1 ? true : false)}
                                        onChange={() => setObrigatorio(obrigatorio == 1 ? 0 : 1)}
                                        animated
                                    />
                                </div>
                            </InputContainer>
                            
                            <Button
                                type="submit"
                                status={formStatus}
                                loading={loading}
                            >
                                Salvar
                            </Button>
                        </Form>
                    </Gerenciador>

                    {/* OPÇÕES DO ITEM */}
                    {(hasOptions && id &&
                        <Options
                            callback={''}
                            item={id}
                        />
                    )}
                </>
            :'')}
        </>
    )
}
