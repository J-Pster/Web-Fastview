import { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";
import Icon from "../../icon";
import Modal from "../../modal";
import ModalHeader from "../../modal/modalHeader";
import ModalTitle from "../../modal/modalHeader/modalTitle";
import Textarea from "../../form/textarea";
import Button from "../../button";
import ModalBody from "../../modal/modalBody";
import Form from "../../form";

export default function Avaliar({item, card, index_job, filterModule, callback}){
    // ESTADOS
    const [showModal, setShowModal] = useState(false);
    const [motivo, setMotivo] = useState(null);
    const [statusButton, setStatusButton] = useState('');

    // POST AVALIAÇÃO
    function post_avaliacao(){
        setShowModal(false);

        // MANDA INFORMAÇÃO PRO COMPONENTE PAI PARA ATUALIZAR INSTANTANEAMENTE SEM ESPERAR RETORNO DA API
        setTimeout(() => {
            if(callback){
                callback({
                    status: 'success',
                    index_job: index_job ? index_job : 0,
                    id_job_status: card?.id_job_status,
                    tipo_fase: card?.tipo_fase
                })
            }
        },(motivo ? 300 : 0)); // QUANDO TEM MOTIVO, FAZ UM SETIMEOUT PARA ESPERAR A ANIMAÇÃO DO MODAL FECHANDO EVITANDO QUE FECHE DE UMA VEZ AO REMOVER O CARD DA TELA

        // MANSAGEM DE RETORNO PRO USUÁRIO
        toast('Chamado avaliado com sucesso');

        // SETA ESTADO DE LOADING NO BOTÃO DO MODAL
        setStatusButton('loading');

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'assessment',
                    filter: {
                        id_modulo: (card?.id_modulo ? card?.id_modulo : filterModule),
                        tipo_fase: 'Pós-venda',
                        mensagem: 'Avaliou o chamado como ' + item?.nome+'.' + (motivo ? ('\nMotivo: '+motivo) : ''),
                        id_job: card?.id_job,
                        id_job_status: card?.id_job_status,
                        id_job_apl: card?.id_job_apl,
                        mp: 0,
                        id_avaliacao: item?.id,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    // VERIFICA STATUS CLICADO
    const handleSetAvaliacao = () => {
        if(item.id == global.avaliacao.medio || item.id == global.avaliacao.ruim){
            setShowModal(true);
        }else{
            post_avaliacao();
        }
    }

    // FECHA MODAL DE MOTIVO
    const handleCloseModal = () => {
        setShowModal(false);
        setStatusButton('');
        setMotivo(null);
    }

    return(
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <ModalHeader>
                    <ModalTitle>
                        <b>{item?.nome}</b> - Motivo
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Textarea 
                            id="motivo_avaliacao"
                            name="motivo_avaliacao"
                            placeholder="Digite"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />

                        <Button
                            type="submit"
                            title={motivo ? false : 'Digite um motivo'}
                            disabled={motivo ? false : true}
                            onClick={() => post_avaliacao()}
                            status={statusButton}
                        >
                            Enviar
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>

            {(window.rs_id_grupo == 2 && window?.location?.origin?.includes('madnezz') ? 
                <Button
                    type={item.ite_aux}
                    title={item?.nome}
                    onClick={handleSetAvaliacao}
                    loading={statusButton}
                    // onClick={() => setRate('Avaliou o chamado como ' + item.nome, card?.id_job, card?.id_job_status, item.value, card?.id_job_apl)}
                    disabled={(card?.id_avaliacao ? true : false)}
                    style={{padding: '5px 12px'}}
                >
                    {item?.nome}
                </Button>
            : 
                <Icon
                    type={item.ite_aux}
                    title={item?.nome}
                    onClick={handleSetAvaliacao}
                    loading={statusButton}
                    // onClick={() => setRate('Avaliou o chamado como ' + item.nome, card?.id_job, card?.id_job_status, item.value, card?.id_job_apl)}
                    disabled={(card?.id_avaliacao ? true : false)}
                    animated
                />
            )}
        </>
    )
}
