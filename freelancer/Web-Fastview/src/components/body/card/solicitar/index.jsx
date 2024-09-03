import './solicitar.scss';

import { useState, useEffect, useContext } from 'react';

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

export default function Solicitar(props){
    // CONTEXT
    const { filterModule } = useContext(GlobalContext);
    
    const [showModal, setShowModal] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [observacao, setObservacao] = useState('');

    const data = {
        ativ_desc:'Recusou o job',
        id_job:props.id_job,
        id_mov:props.id_job_status,
        status:2,
        msg: observacao,
        data_aux: undefined,
        acao_fase: 'next',
        tipo_fase: 'Operação',
        id_motivo: motivo
    }

    // CALLBACK DO ENVIO
    const handleRecusa = () => {
        props?.callback(props?.id_job_status);
    }

    return(
        <>
            <Modal show={ showModal } onHide={() => setShowModal(false)}>
                <ModalHeader>
                    <ModalTitle>
                        {(props.modalTitle ? props.modalTitle : 'Solicitar complemento')}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form
                        api={window.host_madnezz+'/systems/integration-react/api/list.php?do=set_status&filter_id_module='+filterModule}
                        data={data}
                        callback={handleRecusa}
                        toast="Status alterado com sucesso"
                    >                            
                        <Textarea name="motivo" placeholder="Observação" value={observacao} onChange={(e) => (setObservacao(e.target.value))} />

                        <Button type="submit">
                            Salvar
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Icon type="prev" animated title={(props.title ? props.title:'Solicitar complemento')} onClick={() => setShowModal(true)} />
        </>
    )
}
