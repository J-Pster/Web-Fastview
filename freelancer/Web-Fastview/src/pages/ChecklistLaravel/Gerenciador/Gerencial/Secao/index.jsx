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
import CheckboxGroup from '../../../../../components/body/form/checkboxGroup';

export default function Secao({checklist, emp, id_apl, callback, disabled, show, fases, chamados, visitas}){
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
    const [tipo, setTipo] = useState(null);
    const [frequencia, setFrequencia] = useState(null);
    const [sistema, setSistema] = useState(null);
    const [modulo, setModulo] = useState(null);
    const [meta, setMeta] = useState(null);
    const [cargos, setCargos] = useState([]);
    const [posicao, setPosicao] = useState(null);
    const [planoAcao, setPlanoAcao] = useState(null);

    // SETA CHECKLIST ATIVO
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);
        setEdit(false);

        if(callback){
            callback({
                active: id_aux,
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE USUÁRIOS
        scrollToCol('perguntas');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
        setEdit(false);
    },[checklist]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e)
    }

    // RESETAR FORM
    function reset_form(){
        setId(null);
        setNome(null);
        setTipo(null);
        setFrequencia(null);
        setSistema(null);
        setModulo(null);
        setMeta(null);
        setCargos([]);
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
                url: window.backend+'/api/v1/checklists/gerenciador/secoes/'+id
            }).then((response) => {
                if(response?.data){                    
                    setNome(response?.data?.nome);
                    setPosicao(response?.data?.posicao);
                    setPlanoAcao(response?.data?.disparar_comunicado_plano_acao);

                    let cargos_aux = [];
                    if(response?.data?.cargos){
                        response?.data?.cargos.split(',').map((item, i) => {
                            if(cargos_aux.indexOf(item) === -1){
                                cargos_aux.push(item);
                            }
                        });                        
                    }

                    setCargos(cargos_aux);
                }

                setLoading(false);
            });
        }else{
            setEdit(true);
            reset_form();
        }

        // SCROLL AUTOMÁTICO ATÉ O FORMULÁRIO DE EDIÇÃO
        scrollToCol('secao_insert');

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
        setId('');
        setNome('');        
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
        toast('Seção ' + (ativo ? 'ativada' : 'desativada'));

        axios({
            method: 'put',
            url: window.backend + "/api/v1/checklists/gerenciador/secoes/"+id+'/?status='+ativo,
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
            return 'Seção editada com sucesso!';
        }else{
            return 'Seção cadastrada com sucesso!';
        }
    }

    // SETA CARGOS
    const handleSetCargos = (e) => {
        setCargos(e);
    }

    // DATA FORM
    const data = {
      //  checklist: id ? id : undefined,
        nome: nome,
        tipo_id: tipo,
        frequencia: frequencia,
        sistema_id: sistema,
        tipo_sistema: modulo,
        meta: meta,
        qtd_itens: 0, // VERIFICAR O QUE É
        cargos: cargos,

        checklist_id: checklist,
        posicao: posicao,
    }

    return(
        <>
            <Gerenciador 
                id="secao"
                title="Seções"
                search={
                    <Input
                        name="filter_secao"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    <Icon
                        type="new"
                        title="Nova Seção"
                        onClick={() => handleOpenForm()}
                    />
                }
                switch={
                    <Input
                        type={'checkbox'}
                        name="secoes_inativos"
                        label="Inativas"
                        inverse={true}
                        onClick={handleSetFilterInactive}
                    />
                }
                disabled={disabled}
            >
                <Table
                    id="table_checklist"
                    api={window.backend+'/api/v1/checklists/gerenciador/secoes'}
                    params={{
                        checklist: checklist,
                        status: (filterInactive ? [0, 1] : [1])
                    }}
                    onLoad={handleSetItems}
                    key_aux={['data']}
                    reload={reload + checklist}
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
                                return(
                                    <Tr
                                        key={'checklist_'+item.id}
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
                    id="secao_insert"
                    title={(id ? ('Editar '+nome) : 'Nova Seção')}
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
                        api={window.backend+'/api/v1/checklists/gerenciador/secoes'+(id ? ('/'+id) : '')}
                        method={id ? 'put' : 'post'}
                        data={data}
                        status={handleFormStatus}
                        response={handleReloadForm}
                        callback={() => handleSendForm(true)}
                        toast={handleToast}
                    >
                        <Input 
                            id="secao_nome"
                            name="secao_nome"
                            label="Nome"  
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            loading={loading}
                        />

                        <Input 
                            id="secao_posicao"
                            name="secao_posicao"
                            label="Posição"  
                            value={posicao}
                            onChange={(e) => setPosicao(e.target.value)}
                            loading={loading}
                        />

                        <CheckboxGroup
                            group="cargo"
                            value={cargos}
                            callback={handleSetCargos}
                            loading={loading}
                            required={false}
                        />

                        <InputContainer loading={loading}>
                            <Switch
                                id="plano_de_acao"
                                name="plano_de_acao"
                                label="Disparar comunicado no plano de ação"
                                title={(planoAcao == 1 ? 'Desativar' : 'Ativar')}
                                checked={(planoAcao == 1 ? true : false)}
                                value={planoAcao}
                                onChange={(e) => setPlanoAcao(e.target.checked)}
                            />
                        </InputContainer>

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
