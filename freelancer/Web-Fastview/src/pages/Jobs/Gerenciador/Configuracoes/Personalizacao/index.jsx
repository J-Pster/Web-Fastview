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
import CheckboxGroup from '../../../../../components/body/form/checkboxGroup';

export default function Personalizacao({id_grupo, emp, id_apl, tipo, callback, disabled, show, fases, chamados, visitas, comunicados}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);
    const [filterInactive, setFilterInactive] = useState(false);
    const [edit, setEdit] = useState(false);
    const [buttonStatus, setButtonStatus] = useState('');
    const [optionsEmpreendimentos, setOptionsEmpreendimentos] = useState([]);
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [empreendimentosObj, setEmpreendimentosObj] = useState([]);
    const [loadingEmpreendimentos, setLoadingEmpreendimentos] = useState(true);

    // ESTADOS DO FORM
    const [reload, setReload] = useState(false);
    const [id, setId] = useState('');
    const [sla, setSla] = useState(10);
    const [mensagemFinaliza, setMensagemFinaliza] = useState(false);

    // DEFINE TIPO DE MÓDULO
    var table_aux;

    if(chamados){
        table_aux = 'moduleChamados';
    }else if(fases){
        table_aux = 'moduleFases';
    }

    // SETA MÓDULO ATIVO
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if(callback){
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE ACESSOS
        scrollToCol('usuarios');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    },[emp, tipo]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e);
    }

    // RESETAR FORM
    function reset_form(){
        setId('');
        setSla('');
        setEmpreendimentos([]);
        setEmpreendimentosObj([]);
    }

    // AÇÕES AO ABRIR FORM DE CADASTRO
    const handleOpenForm = (id, sla, id_apl, id_grupo) => {
        if(id){
            setEdit(id);
            setId(id);
            setSla(sla);
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('modulo_insert');

        callback({
            edit: true
        })
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
        setId('');
        setSla('');        
        setEdit(false);
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
        toast('Módulo ' + (ativo ? 'ativado' : 'desativado'));

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            data: {
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: table_aux,
                    filter: {
                        id: id,
                        id_emp: emp,
                        ativo: ativo
                    }
                }]
            },
            headers: { "Content-Type": "multipart/form-data" }
        }).then(() => {
            // handleReloadForm();
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
            return 'Módulo editado com sucesso!';
        }else{
            return 'Módulo cadastrado com sucesso!';
        }
    }

    // GET OPTIONS EMPREENDIMENTOS
    useEffect(() => {
        setEmpreendimentos([]);
        setLoadingEmpreendimentos(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                do: 'getTable',
                tables: [{
                    table: 'itemPermissionEnterprise',
                    filter: {
                        id: id,
                    }
                }]
            }
        }).then((response) => {
            if(response?.data?.data?.itemPermissionEnterprise){
                setOptionsEmpreendimentos(response?.data?.data?.itemPermissionEnterprise);

                // SETA EMPREENDIMENTOS ATIVOS
                let empreendimentos_aux = [];

                response?.data?.data?.itemPermissionEnterprise.map((item, i) => {
                    if(item?.ativo == 1){
                        empreendimentos_aux.push(item?.id);
                    }

                    setEmpreendimentos(empreendimentos_aux);
                });
            }

            setLoadingEmpreendimentos(false);
        });
    },[id]);

    // CALLBACK DO COMPONENTE DE SHOPPINGS
    const handleCallbackShoppings = (e) => {
        setEmpreendimentos(e);
    }

    // ATUALIZA OBJETO DE EMPREENDIMENTOS SEMPRE QUE O ESTADO É ALTERADO
    useEffect(() => {
        let emp_aux = [];

        empreendimentos.map((item, i) => {
            emp_aux.push(
                {id_emp: item, ativo: 1}
            )
        });        

        setEmpreendimentosObj(emp_aux);
    },[empreendimentos]);

    // DATA FORM
    const data = {
        do: 'setTable',
        tables: [{
            table: table_aux,
            filter: {
                id: id,
                id_cfg: 15, // MÓDULO
                id_emp: emp,
                // nome: nome
            }
        },{
            table: 'itemPermissionEnterprise',
            filter: {
                id: id,
                rows: empreendimentosObj.length > 0 ? empreendimentosObj : '[{}]'
            }
        }]
    }

    return(
        <Gerenciador 
            id="modulo_insert"
            title={'Personalização'}
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
                api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job'}
                data={data}
                status={handleFormStatus}
                response={handleReloadForm}
                callback={() => handleSendForm(true)}
                toast={handleToast}
            >
                <Input
                    type="text"
                    name="sla"
                    label="SLA"
                    mask={'99'}
                    maskChar={''}
                    value={sla}
                    required={false}
                    onChange={(e) => setSla(e.target.value)}
                />

                <InputContainer>
                    <Switch
                        id="mensagem_finaliza"
                        name="mensagem_finaliza"
                        label={
                            <>
                                Enviar mensagem finaliza card

                                <Icon
                                    type="help"
                                    className="ms-2"
                                    title={'Ao enviar mensagens no chat, o card será finalizado automaticamente, sem a necessidade de clicar no botão de finalizar.'}
                                    readonly
                                />
                            </>
                        }
                        checked={mensagemFinaliza}
                        onChange={() => setMensagemFinaliza(!mensagemFinaliza)}
                    />
                </InputContainer>

                <CheckboxGroup 
                    name="shoppings_acesso"
                    label="Shoppings com acesso"
                    options={optionsEmpreendimentos}
                    value={empreendimentos}
                    loadingItems={loadingEmpreendimentos}
                    required={false}
                    callback={handleCallbackShoppings}
                />

                <Button
                    type="submit"
                    status={buttonStatus}
                >
                    Salvar
                </Button>
            </Form>
        </Gerenciador>
    )
}
