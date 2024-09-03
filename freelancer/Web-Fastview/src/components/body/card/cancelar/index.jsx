import './cancelar.scss';

import { useState, useContext, useEffect } from 'react';

import Modal from '../../../body/modal';
import ModalHeader from '../../../body/modal/modalHeader';
import ModalTitle from '../../../body/modal/modalHeader/modalTitle';
import ModalBody from '../../../body/modal/modalBody';
import Icon from '../../icon';
import Form from '../../form';
import Textarea from '../../form/textarea';
import Button from '../../button';

import { GlobalContext } from "../../../../context/Global";

export default function CancelarCard(props){
    // CONTEXT
    const { filterModule } = useContext(GlobalContext);
    
    // ESTADOS
    const [showModal, setShowModal] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [formStatus, setFormStatus] = useState('');

    const data = {
        db_type: global.db_type,
        tables: [{
            table: 'status',
            filter: {
                id_modulo: (props?.id_modulo ? props?.id_modulo : filterModule),
                mensagem: 'Cancelou o chamado',
                id_job: props.id_job,
                id_job_status: props.id_job_status,
                id_job_apl: props?.id_job_apl,
                status: 6,
                motivo: observacao,
                acao_fase: 'present',
                tipo_fase: 'Pós-venda',
                mp: 0,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            }    
        }]
    }

    // FECHAR MODAL DO FORM
    function handleCloseModal(){
        setShowModal(false);
        setObservacao('');
        
        props?.callback(props?.id_job_status);
    }

    // STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    return(
        <>
            {/* MODAL DE CANCELAR */}
            {(props.motivo !== false ?
                <Modal show={ showModal } onHide={() => handleCloseModal()}>
                    <ModalHeader>
                        <ModalTitle>
                            {(props.modalTitle?props.modalTitle:'Motivo')}
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <Form
                            api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable'}
                            data={data}
                            toast="Chamado cancelado"
                            callback={() => handleCloseModal()}
                            status={handleFormStatus}                      
                        >                            
                            <Textarea name="motivo" placeholder="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />

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

            <Icon
                type={(props.icon ? props.icon : 'reprovar')}
                title={(props.title ? props.title : 'Cancelar')}
                onClick={() => setShowModal(true)}
            />
        </>
    )
}
