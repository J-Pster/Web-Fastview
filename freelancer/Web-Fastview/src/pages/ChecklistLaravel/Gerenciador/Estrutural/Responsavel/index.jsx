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
import SelectReact from '../../../../../components/body/select';
import CheckboxGroup from '../../../../../components/body/form/checkboxGroup';

export default function Responsavel({ disabled, changeSystem }) {

    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [optionsChecklist, setOptionsChecklist] = useState(false);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState(null);
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState("");
    const [checklist, setChecklist] = useState([]);
    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form() {
        setEmail('');
        setNome("");
        setChecklist([])
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id) => {
        if (id) {
            setEdit(id);
            setId(id);
            setLoading(true);

            axios({
                method: 'get',
                url: window.backend + '/api/v1/checklists/gerenciador/responsaveis/' + id,
               // params: { ativo: [1, 0] }
            }).then(({data: {email, nome, checklists}}) => {
                    setEmail(email);
                    setNome(nome);
                    setChecklist(checklists);

                setLoading(false);
            });
        } else {
            setId(null)
            setEdit(true);
            reset_form();
        }
    }

    // AÇÕES AO FECHAR FORM DE CADASTRO
    const handleCloseForm = () => {
        setEdit(false);
        reset_form();
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

    // RECARREGA O COMPONENTE TABLE
    useEffect(() => {
        setReload(!reload);
    }, [changeSystem]);

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, ativo) => {
        toast('Responsável ' + (ativo ? 'ativado' : 'desativado'));

        axios({
            method: 'put',
            url: window.backend + '/api/v1/checklists/gerenciador/responsaveis/' + id + '/?status[]=' + ativo,
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

    //FUNÇÃO ADD CHECKLIST
    const handleChecklist = (e) => {
        console.log(e);
        setChecklist(e)
    }

    // TOAST
    const handleToast = () => {
        if (id) {
            return 'Responsável editado com sucesso!';
        } else {
            return 'Responsável cadastrado com sucesso!';
        }
    }

    // DATA FORM
    const data = {
        responsavel: id ? id : undefined,
        email: email,
        nome,
        // checklist_id: checklist,
        checklists: checklist,
    }

    // OPTIONS CHECKLIST
    useEffect(() => {
        setOptionsChecklist([]);

        axios({
            method: 'get',
            url: window.backend + '/api/v1/checklists?status[]=1',
        }).then((response) => {
            if (response?.data?.data) {
                setOptionsChecklist(response.data.data);
            }
        });
    }, []);

    return (
        <>
            <Gerenciador
                id="responsaveis"
                title="Responsáveis"
                search={
                    <Input
                        name="filter_responsavel"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <>
                        <Icon
                            type="new"
                            title="Novo Responsável"
                            onClick={() => handleOpenForm()}
                        />
                    </>
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="responsaveis_inativos"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_responsaveis"
                    api={window.backend + '/api/v1/checklists/gerenciador/responsaveis'}
                    params={{
                        status: (filterInactive ? [0] : [1])
                    }}
                    onLoad={handleSetItems}
                    text_limit={(window.isMobile ? 20 : 30)}
                    key_aux={['data']}
                    reload={reload + 'aux'}
                >
                    <Tbody>
                        {(items?.length > 0 ?
                            items.filter((item, i) => {
                                if (!filter) return true;
                                if (item?.nome?.toLowerCase()?.includes(filter.toLocaleLowerCase())) {
                                    return true
                                }
                            }).map((item, i) => {

                                return (
                                    <Tr
                                        key={'responsavel_' + item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td>
                                           {item.nome} - {item.email}
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
                    id="responsavel_insert"
                    title={(id ? ('Editar responsável') : 'Novo responsável')}
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
                        api={window.backend + '/api/v1/checklists/gerenciador/responsaveis' + (id ? ('/' + id) : '')}
                        method={id ? 'put' : 'post'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Input
                            type="text"
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <Input
                            type="text"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        

                        {/* <SelectReact
                            label="Checklist"
                            value={checklist}
                            onChange={(e) => setChecklist(e.value)}
                            options={optionsChecklist}
                        /> */}

                        {/* // -> Para esse funcionar, precisa salvar em array, e precisa vir em array  */}
                        {/* AGUARDANDO FEATURE DO BACKEND */}
                        
                        <CheckboxGroup
                            group="checklist"
                            label="Checklists"
                            api={{
                                url: window.backend + '/api/v1/checklists?status[]=1',
                                key_aux: ['data']
                            }}                            
                            value={checklist}
                            callback={handleChecklist}
                            required={false}
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
                : '')}
        </>
    )
}