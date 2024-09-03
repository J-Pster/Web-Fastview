import './recusar.scss';

import { useState, useContext } from 'react';

import Modal from '../../../body/modal';
import ModalHeader from '../../../body/modal/modalHeader';
import ModalTitle from '../../../body/modal/modalHeader/modalTitle';
import ModalBody from '../../../body/modal/modalBody';
import Icon from '../../icon';
import Form from '../../form';
import Textarea from '../../form/textarea';
import Button from '../../button';
import SelectReact from '../../select';

import { GlobalContext } from "../../../../context/Global";
import { JobsContext } from "../../../../context/Jobs";

export default function Recusar(props){
    // CONTEXT
    const { filterModule } = useContext(GlobalContext);
    const { filterEmpreendimento } = useContext(JobsContext);
    
    // ESTADOS
    const [showModal, setShowModal] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [observacao, setObservacao] = useState('');
    const [formStatus, setFormStatus] = useState('');

    const data = {
        db_type: global.db_type,
        tables: [{
            table: 'status',
            filter: {
                id_modulo: filterModule,
                id_job:props.id_job,
                id_job_status: props.id_job_status,
                id_job_apl: props?.id_job_apl,
                status: 2,
                mensagem: 'Recusou o card.',
                motivo: observacao,
                data_aux: undefined,
                acao_fase: 'next',
                tipo_fase: 'Operação',
                mp: (props.chamados ? 2 : 0),
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            }
        }]
    }

    // CALLBACK DO ENVIO
    const handleRecusa = () => {
        props?.callback(props?.id_job_status);
    }

    // STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    return(
        <>
            <Modal show={ showModal } onHide={() => setShowModal(false)}>
                <ModalHeader>
                    <ModalTitle>
                        {(props.modalTitle?props.modalTitle:'Motivo')}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form
                        api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable'}
                        data={data}
                        callback={handleRecusa}
                        toast="Status alterado com sucesso"
                        status={handleFormStatus}
                    >
                        {(!props.chamados && !props.fases ?
                            <SelectReact
                                label="Motivo"
                                name="motivo"
                                api={{
                                    url: window.host_madnezz+'/systems/integration-react/api/list.php?do=get_motive&empreendimento_id='+filterEmpreendimento+'&filter_id_module='+filterModule+'&token='+window.token
                                }}
                                value={motivo}
                                onChange={(e) => (setMotivo(e.value))}
                            />
                        :'')}
                            
                        <Textarea name="motivo" placeholder="Observação" value={observacao} onChange={(e) => (setObservacao(e.target.value))} />

                        <Button
                            type="submit"
                            status={formStatus}
                        >
                            Salvar
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Icon type="times-circle" animated title={(props.title?props.title:'Não tem')} onClick={() => setShowModal(true)} />
        </>
    )
}
