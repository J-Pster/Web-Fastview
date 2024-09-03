import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
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

export default function Subcategoria({callback, disabled, categoria}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(true);
    const [id, setId] = useState(null);

    //ESTADOS INPUT
    const [subcategoria, setCategoria] = useState('');

    //INFORMAÇÕES QUE SERÃO ENVIADAS PARA A API
    const data = {
        id: id ?? '',
        name: subcategoria,
        id_ite: categoria
    };

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form(){
        setId(null);
        setCategoria(null);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, nome) => {
        if(id){
            setEdit(id);
            setId(id);
            setLoading(true);

            axios({
                method: 'get',
                url: window.host + "/systems/integration-react/api/registry.php?do=get_subcategory&filter_id="+id+"&filter_id_category="+ categoria,
            }).then((response) => {
                if(response?.data?.length > 0){
                    setId(response?.data[0]?.value);
                    setCategoria(response?.data[0]?.label);
                }

                setLoading(false);
            });
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('categoria_insert');

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
        toast('Subcategoria ' + (ativo ? 'ativada' : 'desativada'));

        axios({
            method: 'post',
            url: window.host+"/systems/integration-react/api/registry.php?do=set_subcategoryActive",
            data: { 
                id: id, 
                active: ativo,
                id_ite: categoria
            },
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
        if(id){
            return 'Subcategoria editada com sucesso!';
        }else{
            return 'Subcategoria cadastrado com sucesso!';
        }
    }

    return(
        <>
            <Gerenciador 
                id="categorias"
                title="Subcategorias"
                search={
                    <Input
                        name="filter_categoria"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova subcategoria"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="categorias_inativas"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
            >
                <Table
                    id="table_categoria"
                    api={window.host + "/systems/integration-react/api/registry.php?do=get_subcategory&filter_id_category="+categoria}
                    params={{
                        filter_active: (filterInactive ? [0, 1] : [1])
                    }}
                    onLoad={handleSetItems}
                    //key_aux={['data']}
                    reload={reload + categoria}
                    text_limit={(window.isMobile ? 20 : 30)}
                >
                    <Tbody>
                        {(items?.length > 0 ?
                            items.filter((item, i) => {
                                if (!filter) return true;
                                if (item?.label?.toLowerCase()?.includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {
                                return(
                                    <Tr
                                        key={'categoria_'+item.value}
                                        cursor="pointer"
                                        active={(active === item.value ? true : false)}
                                    >
                                        <Td>
                                            {item.label}
                                        </Td>

                                        <Td width={1} align="center">
                                            <Icon 
                                                type={'edit'}
                                                active={(edit === item.value ? true : false)}
                                                onClick={() => handleOpenForm(item?.value, item?.label)}
                                                animated
                                            />

                                            <Switch
                                                type="check"
                                                title={(item.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                checked={(item.ativo == 1 ? true : false)}
                                                onChange={() => handleSetItemActive(item?.value, (item.ativo == 1 ? 0 : 1))}
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
                    id="categoria_insert"
                    title={(id ? ('Editar subcategoria') : 'Nova subcategoria')}
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
                        api={window.host+"/systems/integration-react/api/registry.php?do=set_subcategory"}
                        method={'post'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Input
                            type="text"
                            name="subcategoria"
                            label="Subcategoria"
                            value={subcategoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            loading={loading}
                        />

                        <Button
                            type="submit"
                            status={buttonStatus}
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