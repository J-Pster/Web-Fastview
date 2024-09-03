import { useState, useEffect, useRef, useContext } from 'react';

import Gerenciador from '../../../../../../components/body/gerenciador';
import Input from '../../../../../../components/body/form/input';
import Table from '../../../../../../components/body/table';
import Tbody from '../../../../../../components/body/table/tbody';
import Tr from '../../../../../../components/body/table/tr';
import Td from '../../../../../../components/body/table/tbody/td';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Switch from '../../../../../../components/body/switch';
import Icon from '../../../../../../components/body/icon';
import { scrollToCol } from '../../../../../../_assets/js/global';
import Form from '../../../../../../components/body/form';
import Button from '../../../../../../components/body/button';
import { GlobalContext } from '../../../../../../context/Global';

export default function Options({ checklist, secao, pergunta, disabled, callback, item }) {
    // GLOBAL CONTEXT
    const {handleSetFilter} = useContext(GlobalContext);

    // ESTADOS
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState(null);
    const [edit, setEdit] = useState(false);
    const [formStatus, setFormStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    // ESTADOS DO FORM
    const [id, setId] = useState(null);
    const [nome, setNome] = useState(null);

    const timer = useRef(null);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RECARREGA API DA TABLE
    useEffect(() => {
        handleSetFilter(true);
    },[]);

    function get_habilitados() {
        axios({
            method: 'get',
            url: window.backend + '/api/v1/checklists/perguntas/item',
            params: {
                pergunta_id: pergunta
            }
        }).then((response) => {
            if (response.data) {
                setLoading(false)
            }
        });
    }

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, status) => {
        toast('Opção ' + (status == 1 ? 'habilitada' : 'desabilitada') + ' com sucesso');

        axios({
            method: 'put',
            url: window.backend + '/api/v1/checklists/perguntas/items/options/'+id,
            data: {
                ativo: status
            },
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            
        }).catch(_error => {
            toast('Ocorreu um erro ao ' + (ativo ? 'habilitar' : 'desabilitar') + ' a opção');
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
                url: window.backend+'/api/v1/checklists/perguntas/items/options/'+id
            }).then((response) => {
                if(response?.data){                    
                    setNome(response?.data?.nome);
                }

                setLoading(false);
            });
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('option_insert');

        if(callback){
            callback({
                edit: true
            })
        }
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

    // RESETAR FORM
    function reset_form(){
        if(id){
            setNome('');
            setEdit(false);
        }else{
            setNome('');
        }        
    }

    // VERIFICA STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // RECARREGA LISTA AO RECEBER O RETORNO DA API DE CADASTRO
    const handleReloadForm = (e) => {
        setReload(e?.id);
        reset_form();   
    }

    // TOAST
    const handleToast = () => {
        if(id){
            return 'Opção editada com sucesso!';
        }else{
            return 'Opção cadastrada com sucesso!';
        }
    }

    return (
        <>
            <Gerenciador
                id="options"
                title="Opções"
                search={
                    <Input
                        name="filter_opcao"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova opção"
                        onClick={() => handleOpenForm()}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_options"
                    api={window.backend + '/api/v1/checklists/perguntas/items/options'}
                    params={{
                        items: [item],
                        status: [1]
                    }}
                    onLoad={handleSetItems}
                    key_aux={['data']}
                    reload={item + reload}
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
                <Gerenciador 
                    id="option_insert"
                    title={(id ? ('Editar '+nome) : 'Nova opção')}
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
                        api={window.backend+'/api/v1/checklists/perguntas/items/options'+(id ? ('/'+id) : '')}
                        method={id ? 'put' : 'post'}
                        data={{
                            nome: nome,
                            item_id: item
                        }}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        toast={handleToast}
                    >
                        <Input 
                            id="nome"
                            name="nome"
                            label="Nome"  
                            value={nome}
                            onChange={(e) => setNome(e?.target?.value)}
                            loading={loading}
                        />
                        
                        <Button
                            type="submit"
                            status={formStatus}
                            loading={loading}
                        >
                            Salvar
                        </Button>
                    </Form>
                </Gerenciador>
            :'')}
        </>
    )
}
