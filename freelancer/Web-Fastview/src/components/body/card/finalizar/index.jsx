import './recusar.scss';

import { useState, useContext, useEffect } from 'react';

import Modal from '../../modal';
import ModalHeader from '../../modal/modalHeader';
import ModalTitle from '../../modal/modalHeader/modalTitle';
import ModalBody from '../../modal/modalBody';
import Icon from '../../icon';
import Form from '../../form';
import Textarea from '../../form/textarea';
import Button from '../../button';

import { GlobalContext } from "../../../../context/Global";
import { JobsContext } from '../../../../context/Jobs';
import toast from 'react-hot-toast';
import axios from 'axios';
import SelectReact from '../../select';

export default function Finalizar({chamados, fases, visitas, id_job, tippy, funcionarios, disabled, button, jobs, jobsCols, id_job_status, message, anexo, tipo_permissao, id_job_apl, acao_fase, tipo_fase, motivo, callback, modalTitle, icon, title, status, card, modules, prioridade, nivel, className}){
    // CONTEXT GLOBAL
    const { filterModule } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { configuracoes, optionsMotivos } = useContext(JobsContext);
    
    // ESTADOS
    const [showModalMotivo, setShowModalMotivo] = useState(false);
    const [showModalEncaminhamento, setShowModalEncaminhamento] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [motivoAux, setMotivoAux] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [encaminharCheck, setEncaminharCheck] = useState(false);
    const [modulo, setModulo] = useState(modules?.filter((elem) => elem.value == card?.id_modulo)[0]?.ite_id_ite); // POR DEFAULT VEM SELECIONADO O PRÓXIMO MÓDULO
    const [messageAux, setMessageAux] = useState(null);
    const [anexoAux, setAnexoAux] = useState(null);
    const [loading, setLoading] = useState(false);

    // VARIÁVEIS
    const url_api = window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable';
    const url_api_enc = window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable';

    // DEFINE MENSAGEM
    let ativ_desc_aux;
    if(status == 1 || status == 3){
        ativ_desc_aux = 'Respondeu o card';
    }else if(status == 2){
        ativ_desc_aux = 'Recusou o card';
    }

    // DEFINE MENSAGEM DO ENCAMINHAMENTO DE MÓDULO
    let atic_desc_enc;
    let ativ_desc_enc_aux = 'Encaminhou o card de '+modules?.filter((elem) => elem.value == (card?.id_modulo ? card?.id_modulo : filterModule))[0]?.label+' para '+modules?.filter((elem) => elem.value == modulo)[0]?.label+'.';
    if(status == 1 || status == 3){ // SE FOR STATUS 2 (REPROVADO) CONCATENA COM O MOTIVO DA REPROVAÇÃO
        atic_desc_enc = 'Finalizou.\n'+ativ_desc_enc_aux
    }else if(status == 2){ // SE FOR STATUS 2 (REPROVADO) CONCATENA COM O MOTIVO DA REPROVAÇÃO
        atic_desc_enc = 'Recusou o card.\nMotivo: '+observacao+'.\n'+ativ_desc_enc_aux
    }else{
        atic_desc_enc = ativ_desc_enc_aux;
    }    

    // DEFINE ÍCONE
    let icon_aux;
    if(icon){
        icon_aux = icon;
    }else{
        if(status == 1 || status == 3){
            icon_aux = 'check';
        }else if(status == 2){
            icon_aux = 'times-circle';
        }
    }

    // DEFINE TITLE
    let title_aux;
    if(title){
        title_aux = title;
    }else{
        if(status == 1 || status == 3){
            title_aux = 'Finalizar';
        }else if(status == 2){
            title_aux = 'Recusar';
        }
    }

    // DEFINE NÍVEL DA MSG DO CHAT
    let nivel_aux;
    if(nivel !== undefined){
        nivel_aux = nivel;
    }else{
        if(chamados){
            if(sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
                nivel_aux = 1;
            }else{
                if(tipo_permissao === 'livre'){
                    nivel_aux = 0;
                }else{
                    nivel_aux = 1;
                }
            }
        }else{
            nivel_aux = 0;
        }
    }

    // VERIFICA SE O MÓDULO POSSUI FASE DE CHECK
    let check_aux = true;
    if(jobs){
        if(jobs?.filter((elem) => elem.id_modulo == global.modulo.manutencao_madnezz || elem.id_modulo == global.modulo.manutencao_fastview || elem.id_modulo == global.modulo.manutencao_malltech).length > 0){
            check_aux = true;
        }else{
            if(jobs?.filter((elem) => elem.type_phase === 'Check')?.length > 0){
                check_aux = true;
            }else{
                check_aux = false;
            }
        }
    }else if(jobsCols){
        jobsCols.map((item, i) => {
            if(item?.data?.filter((elem) => elem.type_phase === 'Check')?.length == 0){
                check_aux = false;
            }
        });
    }

    // DEFINE CONTEÚDO DO FORM DE MOTIVO
    const data = {
        db_type: global.db_type,
        tables: [{
            table: 'status',
            filter: {
                mensagem: ativ_desc_aux,
                id_modulo: (card?.id_modulo ? card?.id_modulo : filterModule),
                id_job: id_job,
                id_job_status: id_job_status,
                id_job_apl: id_job_apl,
                id_subcategoria:card.id_subcategoria,
                status: status,
                motivo: messageAux,
                anexo: anexoAux,
                data_aux: undefined,
                acao_fase: tipo_permissao === 'livre' ? (acao_fase ? acao_fase : 'next') : undefined,
                tipo_fase: tipo_permissao === 'livre' ? (tipo_fase ? tipo_fase : 'Início') : (check_aux ? 'Check'  : 'Pós-venda'),
                mp: nivel_aux,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                prioridade: prioridade
            }
        }]
    }

    // DEFINE CONTEÚDO DO FORM DE ENCAMINHAMENTO
    const dataEncaminhamento = {
        db_type: global.db_type,
        type: 'Job',
        tables: [{
            table: 'module',
            filter: {
                id_job: id_job,
                id_job_status: id_job_status,
                id_job_apl: id_job_apl,
                id_apl: 224,
                id_modulo: modulo,
                tipo_fase: 'Início',
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                mensagem: atic_desc_enc
            }
        }]
    }

    // FECHAR MODAL DE MOTIVO
    function handleCloseModalMotivo(){
        setShowModalMotivo(false);
        setObservacao('');
    }

    // FECHAR MODAL DE ENCAMINHAMENTO
    function handleCloseModalEncaminhamento(){
        setShowModalEncaminhamento(false);
    }

    // FUNÇÃO PARA ABRIR MODAL DE MOTIVO
    function handleShowModalMotivo(){
        setShowModalMotivo(true);
    }

    // FUNÇÃO PARA ABRIR MODAL DE ENCAMINHAMENTO
    function handleShowModalEncaminhamento(){
        setShowModalEncaminhamento(true);
    }

    // CALLBACK DO FORM DE MOTIVO
    const handleReprova = () => {
        handleCloseModalMotivo();

        if(callback){
            callback({
                submit: id_job_status
            });
        }
    }

    // CALLBACK DO FORM ENCAMINHAMENTO
    const handleCallbackEncaminhamento = () => {
        handleCloseModalEncaminhamento();
        
        if(callback){
            callback({
                submit: id_job_status
            });
        }
    }

    // ATUALIZA ESTADO SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setMessageAux(message);
    },[message]);

    // ATUALIZA ESTADO SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setAnexoAux(anexo);
    },[anexo]);

    // FUNÇÃO QUE CHAMA A API DE TROCA DE STATUS
    function changeStatus(){
        axios({
            method: 'post',
            url: url_api,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            toast('Card '+(status == 1 || status == 3 ? 'finalizado' : 'recusado')+' com sucesso');
            setLoading(false);
            setMessageAux(null);
            setAnexoAux(null);
            callback({
                submit: id_job_status
            });
        });
    }

    // ACIONA AÇÕES DO CHECK
    const handleSetCheck = () => {
        if(confirm('Tem certeza que deseja finalizar o chamado?')){
            if(encaminharCheck){
                handleShowModalEncaminhamento();
            }else{
                let validation = false;

                if(motivo){
                    if(messageAux && messageAux !== '<p><br></p>'){ // NECESSÁRIO PARA OS CASOS DE TEXTAREA COM EDITOR
                        validation = true;
                    }else{
                        if(status == 1 || status == 3){
                            toast('Digite uma mensagem antes de finalizar');
                        }else{
                            toast('Digite uma mensagem antes de recusar');
                        }                    

                        if(callback){
                            callback({
                                alert: {
                                    status: status
                                }
                            })
                        }

                        validation = false;
                    }
                }else{
                    validation = true;
                }

                if(validation){
                    setLoading(true);

                    if(funcionarios?.length > 0){
                        funcionarios?.map((funcionario, i) => {
                            axios({
                                method: 'post',
                                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                                data: {
                                    db_type: global.db_type,
                                    type: 'Job',
                                    tables: [{
                                        table: 'cracha',
                                        filter: {
                                            cracha_id: funcionario?.id,
                                            status: funcionario?.approved,
                                            inicio: funcionario?.values?.filter(({inicio}) => inicio)[0]?.inicio,
                                            fim: funcionario?.values?.filter(({fim}) => fim)[0]?.fim,
                                            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                                        }
                                    }]
                                },
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).then(() => {
                                if(i == funcionarios?.length - 1){
                                    changeStatus(); 
                                }
                            });
                        });
                    }else{
                        changeStatus();
                    }
                }
            }       
        } 
    }

    // CALLBACK STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // VERIFICA SE A OPERAÇÃO TEM ENCAMINHAMENTO DE MÓDULO CONFIGURADO
    useEffect(() => {
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card){
            if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card)?.encaminhar_operacao === 1){
                setEncaminharCheck(true);
            }
        }
    },[configuracoes]);

    // DEFINE TÍTULO DO MODAL DE MOTIVO
    let modal_title_aux;

    if(modalTitle){
        modal_title_aux = modalTitle
    }else{
        if(status == 2){
            modal_title_aux = 'Motivo';
        }else{
            modal_title_aux = 'Observações';
        }
    }

    return(
        <>
            {/* MODAL DE MOTIVO */}
            {(motivoAux !== false ?
                <Modal show={ showModalMotivo } onHide={() => handleCloseModalMotivo()}>
                    <ModalHeader>
                        <ModalTitle>
                            {modal_title_aux}
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <Form
                            api={url_api}
                            data={data}
                            toast={status == 2 ? 'Card reprovado' : 'Card finalizado'}
                            callback={handleReprova}
                            status={handleFormStatus}                  
                        >                            
                            <Textarea
                                name="motivo"
                                placeholder={status == 2 ? 'Observações' : 'Digite'}
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />

                            <Button
                                type="submit"
                                status={formStatus}
                            >
                                Salvar
                            </Button>
                        </Form>
                    </ModalBody>
                </Modal>
            :'')}

            {/* MODAL DE ENCAMINHAMENTO */}
            <Modal show={ showModalEncaminhamento } onHide={() => handleCloseModalEncaminhamento()}>
                <ModalHeader>
                    <ModalTitle>
                        {(card?.titulo ? card?.titulo : ' - '+title_aux)}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form
                        api={(modulo ? url_api_enc : url_api)} // SE TIVER MÓDULO SELECIONADO ENVIA A URL PARA TROCA DE MÓDULO
                        data={(modulo ? dataEncaminhamento : data)} // SE TIVER MÓDULO SELECIONADO ENVIA OS CAMPOS PARA TROCA DE MÓDULO
                        callback={handleCallbackEncaminhamento}
                        status={handleFormStatus}   
                    >                     
                        {(chamados && fases ?
                            <SelectReact
                                label="Motivo"
                                name="motivo"
                                options={optionsMotivos}
                                value={motivoAux}
                                onChange={(e) => (setMotivoAux(e.value))}
                            />
                        :'')}

                        {(status == 2 || motivo ?
                            <Textarea
                                name="motivo"
                                placeholder={status == 2 ? 'Observações' : 'Digite'}
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />
                        :'')}

                        <SelectReact
                            id="encaminhar_modulo"
                            name="encaminhar_modulo"
                            label="Encaminhar ao módulo"
                            options={modules?.filter((elem) => elem.value != card?.id_modulo)}
                            onChange={(e) => setModulo(e.value)}
                            required={false}
                            value={modulo}
                        />

                        <p>
                            OBS: Caso não selecione nenhum módulo, o chamado será finalizado.
                        </p>

                        <Button
                            type="submit"
                            status={formStatus}
                        >
                            {title_aux}
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>

            {(button ?
                <Button
                    status={loading ? 'loading' : ''}
                    disabled={disabled}
                    className={className}
                    title={tippy}
                    onClick={handleSetCheck}
                >
                    Finalizar
                </Button>
            :
                <Icon
                    type={icon_aux}
                    title={title_aux}
                    loading={loading}
                    animated
                    onClick={handleSetCheck}
                />
            )}
        </>
    )
}
