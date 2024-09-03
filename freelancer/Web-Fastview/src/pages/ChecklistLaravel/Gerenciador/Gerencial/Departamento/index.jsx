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

export default function Departamento({callback, handleCallbackChangeSystem, disabled}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');

    // ESTADOS DO FORM
    const [reload, setReload] = useState(true);
    const [id, setId] = useState(null);

    // ESTADOS INPUT
    const [nome, setNome] = useState('');

    // INFORMAÇÕES QUE SERÃO ENVIADAS PARA A API
    const data = {
        id: id ?? '',
        nome: nome,
        ativo:1
    };

    // SETA DEPARTAMENTO ATIVO
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if(callback){
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE ITENS
        scrollToCol('itens');
    }

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form(){
        setId(null);
        setNome(null);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome) => {
        if(id){
            setEdit(id);
            setId(id);
            setNome(nome);
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('departamento_insert');

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
    const handleSetItemActive = (id, ativo) => {
        axios({
            method: 'put',
            url: window.backend + '/api/v1/gerenciador-macro/departamentos' + (id ? '/'+id : ''),
            data: { 
                ativo: ativo  
            },
        }).then(() => {
            toast('Departamento ' + (ativo ? 'ativado' : 'desativado'));
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
        if(id){
            return 'Departamento editado com sucesso!';
        }else{
            return 'Departamento cadastrado com sucesso!';
        }
    }

    return(
        <>
            <Gerenciador 
                id="departa,emtps"
                title="Departamentos"
                search={
                    <Input
                        name="filter_departamento"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <>
                        <Icon
                            type="cog"
                            onClick={() => handleCallbackChangeSystem('estrutura')}
                        />

                        <Icon
                            type="new"
                            title="Novo departamento"
                            onClick={() => handleOpenForm()}
                        />
                    </>
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="departamentos_inativos"
                        label="Inativos"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
            >
                <Table
                    id="table_departamento"
                    api={window.backend + '/api/v1/gerenciador-macro/departamentos'}
                    params={{
                        filter_search: filter,
                        ativo: (filterInactive ? [0, 1] : [1])
                    }}
                    onLoad={handleSetItems}
                    key_aux={['data']}
                    reload={reload + 'inativos_aux'}
                    search={filter}
                    pages={true}
                >
                    <Tbody>
                        {(items?.length > 0 ?
                            items.map((item, i) => {
                                return(
                                    <Tr
                                        key={'departamento_'+item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td
                                            onClick={() => handleSetActive(item.id)}
                                        >
                                            {item.nome} <span className="text-secondary">{(item?.empreendimento? ' (' + item?.empreendimento + ')' : '')}</span>
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
                                                title={(item.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                checked={(item.ativo == 1 ? true : false)}
                                                onChange={() => handleSetItemActive(item?.id, (item.ativo == 1 ? 0 : 1))}
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
                    id="departamento_insert"
                    title={(id ? ('Editar departamento') : 'Novo departamento')}
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
                        api={window.backend + '/api/v1/gerenciador-macro/departamentos' + (id ? '/'+id : '')}
                        data={data}
                        method={(id ? 'put' : 'post')}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Input
                            type="text"
                            name="departamento_nome"
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <p>Atenção: A criação/edição de departamentos não afeta somente o módulo do Checklist, mas sim o sistema como um todo.</p>

                        <Button
                            type="submit"
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