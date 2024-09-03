import './reprovar.scss';

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

export default function Check({chamados, fases, visitas, id_job, id_job_status, message, id_job_apl, tipo, tipo_fase, motivo, nivel, callback, modalTitle, icon, title, status, card, modules}){
    // CONTEXT GLOBAL
    const { filterModule } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { configuracoes } = useContext(JobsContext);
    
    // ESTADOS
    const [showModalMotivo, setShowModalMotivo] = useState(false);
    const [showModalEncaminhamento, setShowModalEncaminhamento] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [motivoAux, setMotivoAux] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [encaminharCheck, setEncaminharCheck] = useState(false);
    const [modulo, setModulo] = useState('');
    const [messageAux, setMessageAux] = useState(null);
    const [loading, setLoading] = useState(false);

    // VARIÁVEIS
    const url_api = window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable';
    const url_api_enc = window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable';

    // DEFINE MENSAGEM
    let ativ_desc_aux;
    if(status == 1){
        ativ_desc_aux = 'Aprovou o card';
    }else if(status == 2){
        ativ_desc_aux = 'Reprovou o card';
    }

    // DEFINE MENSAGEM DO ENCAMINHAMENTO DE MÓDULO
    let atic_desc_enc;
    let ativ_desc_enc_aux = 'Encaminhou o card de '+modules?.filter((elem) => elem.value == (card?.id_modulo ? card?.id_modulo : filterModule))[0]?.label+' para '+modules?.filter((elem) => elem.value == modulo)[0]?.label+'.';
    if(status == 1){ // SE FOR STATUS 2 (REPROVADO) CONCATENA COM O MOTIVO DA REPROVAÇÃO
        atic_desc_enc = 'Aprovado.\n'+ativ_desc_enc_aux
    }else if(status == 2){ // SE FOR STATUS 2 (REPROVADO) CONCATENA COM O MOTIVO DA REPROVAÇÃO
        atic_desc_enc = 'Reprovado: '+observacao+'.\n'+ativ_desc_enc_aux
    }else{
        atic_desc_enc = ativ_desc_enc_aux;
    }    

    // DEFINE ÍCONE
    let icon_aux;
    if(icon){
        icon_aux = icon;
    }else{
        if(status == 1){
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
        if(status == 1){
            title_aux = 'Aprovar (Encaminhar ao solicitante)';
        }else if(status == 2){
            title_aux = 'Reprovar (Encaminhar ao solicitante)';
        }
    }

    // DEFINE CONTEÚDO DO FORM DE MOTIVO
    const data = {
        db_type: global.db_type,
        type: 'Job',
        tables: [{
            table: 'status_sup',
            filter: {
                mensagem: ativ_desc_aux,
                id_modulo: (card?.id_modulo ? card?.id_modulo : filterModule),
                id_job: id_job,
                id_job_status: id_job_status,
                id_job_apl: id_job_apl,
                status_sup: status,
                // motivo_sup: observacao ? observacao : undefined,
                motivo_sup: messageAux,
                tipo_fase: 'Pós-venda',
                mp: nivel,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
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

    // ACIONA AÇÕES DO CHECK
    const handleSetCheck = () => {
        if(encaminharCheck){
            handleShowModalEncaminhamento();
        }else{
            let validation = false;

            if(motivo){
                if(messageAux && messageAux !== '<p><br></p>'){ // NECESSÁRIO PARA OS CASOS DE TEXTAREA COM EDITOR
                    validation = true;
                }else{
                    if(status == 1){
                        toast('Digite uma mensagem antes de aprovar');
                    }else{
                        toast('Digite uma mensagem antes de reprovar');
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
                axios({
                    method: 'post',
                    url: url_api,
                    data: data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(() => {
                    toast('Card '+(status == 1 ? 'aprovado' : 'reprovado')+' com sucesso');
                    setLoading(false);
                    setMessageAux(null);
                    callback({ 
                        submit: id_job_status
                    });
                });
            }
        }        
    }

    // CALLBACK STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // VERIFICA SE O CHECK TEM ENCAMINHAMENTO DE MÓDULO CONFIGURADO
    useEffect(() => {
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card){
            if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_card)?.encaminhar_check === 1){
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
                            toast={status == 2 ? 'Card reprovado' : 'Card aprovado'}
                            callback={handleReprova}
                            status={handleFormStatus}                  
                        >                            
                            <Textarea
                                name="motivo"
                                placeholder={status == 2 ? 'Observações' : 'Digite'}
                                value={observacao}
                                onChange={(e) => (setObservacao(e.target.value), setMotivoAux(e.target.value))}
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
                        {(status == 2 || motivo ?
                            <Textarea
                                name="motivo"
                                placeholder={status == 2 ? 'Observações' : 'Digite'}
                                value={observacao}
                                onChange={(e) => (setObservacao(e.target.value), setMotivoAux(e.target.value))}
                            />
                        :'')}

                        <SelectReact
                            id="encaminhar_modulo"
                            name="encaminhar_modulo"
                            label="Encaminhar ao módulo"
                            options={modules.filter((elem) => elem.value != card?.id_modulo)}
                            onChange={(e) => setModulo(e.value)}
                            required={false}
                            value={modulo}
                        />

                        <p>
                            OBS: Caso não selecione nenhum módulo, o chamado será finalizado e enviado ao solicitante.
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

            <Icon
                type={icon_aux}
                title={title_aux}
                loading={loading}
                animated
                onClick={handleSetCheck}
            />
        </>
    )
}
