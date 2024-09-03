import { useState, useEffect } from "react";

import Button from "../../../components/body/button";
import Form from "../../../components/body/form";
import Input from "../../../components/body/form/input";
import InputContainer from "../../../components/body/form/inputcontainer";
import Textarea from "../../../components/body/form/textarea";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";

export default function MotivoChecklist(props){
    const [showModal, setShowModal] = useState(props.show);
    const [motivo, setMotivo] = useState(props?.motivo);
    const [classificacao, setClassificacao] = useState(props?.classificacao);
    const [supervisao, setSupervisao] = useState(props?.supervisao);
    const [job, setJob] = useState(props?.job);

    //FECHA
    const handleCloseModal = (send) => {
        setShowModal(false);
        setMotivo('');
        setClassificacao('');
        props.hide(send);
    }

    // SETAR CLASSIFICAÇÃO
    function handleSetClassificacao(e){
        setClassificacao(e.target.value);
    }

    // ENVIA MOTIVO PARA O COMPONENTE DO CHECKLIST ITEM
    const handleSendMotivo = () => {     
        handleCloseModal(true);
    }

    useEffect(() => {
        setShowModal(props.show);
        setMotivo(props?.motivo);
        setClassificacao(props?.classificacao);
        setSupervisao(props?.supervisao);
    },[props.show]);

    const data = {
        relatorio_id: props?.relatorio_id,
        pergunta_id: props?.pergunta_id,
        resposta: (props?.resposta),
        checklist_id: props?.checklist_id,
        resposta_id: props?.resposta_id,
        loja_id: props.loja_id,
        observacao: props?.observacao,
        classificacao: classificacao,
        motivo: motivo,
        job: job,
        supervisao: supervisao,
        funcionario_id: props?.funcionario_id,
        avaliacao: props?.avaliacao,
        data: props?.data
    }

    return(
        <Modal show={showModal} onHide={() => handleCloseModal(false)}>
            <ModalHeader>
                <ModalTitle>
                    {(props.modalTitle ? props.modalTitle : 'Motivo')}
                </ModalTitle> 
            </ModalHeader>
            <ModalBody>
                <Form
                    api={(props.api ? props.api : window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist_item')}
                    data={data}
                    callback={handleSendMotivo}
                    toast={false}
                >
                    <Textarea
                        placeholder="Digite"
                        name="motivo"
                        required={true}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        height={100}
                    ></Textarea>

                    {(props.classificacao !== false ?
                        <InputContainer>
                            <Input
                                type="radio"
                                name="classificacao"
                                id="Urgente"
                                value="Urgente"
                                label="Urgente"
                                checked={(classificacao == 'Urgente' ? true : null)}
                                onChange={(e) => handleSetClassificacao(e)}
                            />

                            <Input
                                type="radio"
                                name="classificacao"
                                id="Médio"
                                value="Médio"
                                label="Médio"
                                checked={(classificacao == 'Médio' ? true : null)}
                                onChange={(e) => handleSetClassificacao(e)}
                            />

                            <Input
                                type="radio"
                                name="classificacao"
                                id="Melhoria"
                                value="Melhoria"
                                label="Melhoria"
                                checked={(classificacao == 'Melhoria' ? true : null)}
                                onChange={(e) => handleSetClassificacao(e)}
                            />

                            <Input
                                type="radio"
                                name="classificacao"
                                id="Outro"
                                value="Outro"
                                label="Outro"
                                checked={(classificacao == 'Outro' ? true : null)}
                                onChange={(e) => handleSetClassificacao(e)}
                            />
                        </InputContainer>
                    :'')}

                    <Button type="submit">Enviar</Button>
                </Form>
            </ModalBody>
        </Modal>
    )
}