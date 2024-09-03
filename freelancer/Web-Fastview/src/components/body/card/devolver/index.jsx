import { useState, useContext  } from 'react';

import './devolver.scss';

import Modal from '../../modal';
import ModalHeader from '../../modal/modalHeader';
import ModalTitle from '../../modal/modalHeader/modalTitle';
import ModalBody from '../../modal/modalBody';
import Icon from '../../icon';
import Form from '../../form';
import Textarea from '../../form/textarea';
import SelectReact from '../../select';
import Button from '../../button';

import { GlobalContext } from "../../../../context/Global";
import axios from 'axios';

export default function Devolver({id_job, id_fase, id_job_status, id_job_apl, id_operador, id_job_lote, tipo_fase, id_modulo, filter_subtype, chamados, callback}){
    // CONTEXT
    const { filterModule } = useContext(GlobalContext);

    // ESTADOS
    const [showModal, setShowModal] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [operador, setOperador] = useState(id_operador);
    const [optionsOperador, setOptionsOperador] = useState([]);
    const [formStatus, setFormStatus] = useState('');
    const [idFase, setIdFase] = useState('');

    const data = {
        db_type: global.db_type,
        tables: [{
            table: 'status_sup',
            filter: {
                id_modulo: filterModule,
                mensagem: 'Devolveu o chamado',
                id_job: id_job,
                id_job_status: id_job_status,
                id_job_apl: id_job_apl,
                id_job_lote: id_job_lote,
                id_usuario: (filter_subtype === 'user' ? operador : undefined),
                id_loja: (filter_subtype === 'store' ? operador : undefined),
                status_sup: 3,
                motivo_sup: observacao,
                tipo_fase: 'Operação',
                id_fase: idFase,
                mp: (chamados ? 1 : 0),
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            }    
        }]
    }

    // BUSCA LISTA DE OPERADORES
    function get_operator(){
        axios({
            method: 'get',
            url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&token="+window.token,
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [{
                    table: 'operator',
                    filter: {
                        type_phase: 'Operação',
                        id_module: id_modulo,
                        type_operator: filter_subtype
                    }
                }]
            }
        }).then((response) => {
            if(response?.data?.data){
                setOptionsOperador(response.data.data?.operator);
                setIdFase(response.data.data?.operator?.filter((elem) => elem.id == operador)[0]?.id_fase);
            }
        });
    }

    // CALLBACK AO REALIZAR ENVIO
    const handleDevolver = () => {
        callback(id_job_status);
        setShowModal(false);
        setOperador(id_operador);
        setObservacao('');
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
                        Motivo
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form
                        api={window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable'}
                        data={data}
                        toast="Chamado devolvido ao operador"
                        callback={handleDevolver}
                        status={handleFormStatus}
                    >                            
                        <SelectReact
                            id="devolver_operador"
                            name="devolver_operador"
                            label="Devolver ao operador"
                            options={optionsOperador}
                            value={operador}
                            onChange={(e) => (setOperador(e.value), setIdFase(e?.id_fase))}
                        />

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

            <Icon type="reabrir" title="Devolver ao operador" onClick={() => (setShowModal(true), get_operator())} />
        </>
    )
}
