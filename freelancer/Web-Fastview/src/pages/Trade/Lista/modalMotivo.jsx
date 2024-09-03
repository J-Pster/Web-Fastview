import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/body/button";
import Form from "../../../components/body/form";
import Input from "../../../components/body/form/input";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import Select from "../../../components/body/select";
import toast from "react-hot-toast";

export default function ModalMotivo({ show, onHide, checker, imagem, status, trade_id, reload, job, supervisao_data, resetMotivo, trade_supervisao_id }) {
    //FECHAR MODAL
    const handleClose = () => {
        onHide(false)
        resetMotivo();
    }

    //ESTADOS
    const [motivo, setMotivo] = useState('');
    const [optMotivo, setOptMotivo] = useState([
        {
            value: '',
            label: 'Selecionar um motivo'
        }
    ]);

    function get_motivo() {
        let motivo = [];
        axios({
          url:
            checker === "loja"
              ? `${window.backend}/api/v1/trades/gerenciador/motivos/lojas`
              : `${window.backend}/api/v1/trades/gerenciador/motivos`,
          method: "get",
          params: {
            ativo: [1],
          },
        })
          .then(({ data }) => {
            const options = data.data.map((elm) =>({ value: elm.descricao, label: elm.descricao }));
            setOptMotivo(options);
          })
          .catch((_error) => {
            toast("Ocorreu um erro, tente novamente");
          });

    }

    useEffect(() => {
        if(show)
        {
            get_motivo()
        }
    }, [show])

    //INFO DE CADASTRO
    const data = {
        trade_id,
        status,
        motivo,
        job_id: job?.job_id,
        job_status_id: job?.job_status_id,
        job_data: job?.job_data,
        trade_supervisao_id,
        ...supervisao_data
    }
    //RESET DO INPUT AO CONCLUIR A REQUISIÇÃO
    function resetForm() {
        setMotivo(null);
        handleClose();
        toast("Cadastrado corretamente.");
        reload();
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <ModalHeader>
                <ModalTitle>
                    Motivo:
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form
                    api={checker === 'loja' ? `${window.backend}/api/v1/trades/supervisao/lojas` : `${window.backend}/api/v1/trades/supervisao`}
                    data={data}
                    callback={resetForm}
                >
                    {/* <Input
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    /> */}
                    <Select
                        value={motivo}
                        onChange={(e) => setMotivo(e.value)}
                        options={optMotivo}
                    />
                    <Button type="submit">Enviar</Button>
                </Form>
            </ModalBody>
        </Modal>
    )
}