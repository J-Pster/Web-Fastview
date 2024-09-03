import Icon from "../../../components/body/icon";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import Form from "../../../components/body/form";
import Input from "../../../components/body/form/input";
import Button from "../../../components/body/button";
import { useState } from "react";
import { cd, get_date } from "../../../_assets/js/global";

export default function ModalAddImg({ show, handleShow, id, img, nome, onHide }) {
    //FECHAR MODAL
    const handleClose = () => {
        onHide(false)
    }

    //
    const [file, setFile] = useState();

    const date = new Date();

    //
    const data = {
        id: id,
        // file: `${process.env.REACT_APP_URL_UPLOAD}/${file}`,
        data: get_date('date_sql', cd(date))
    }

    //

    function resetForm() {
        handleClose();
        setFile('');
    }

    // SETAR ANEXO
    const handleSetAnexo = (response) => {
        //setModelo(response[0]);

        let modelo_aux = [];
        JSON.parse(response[0]).map((item, i) => {
            modelo_aux.push(item.id);
        });

        setFile(modelo_aux.toString());
    };


    return (
        <Modal show={show} onHide={handleClose}>
            <ModalHeader>
                <ModalTitle>
                    Cadastrar imagem
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form
                    api={window.host + "/systems/trade/api/trade.php?do=modelo_incluir"}
                    data={data}
                    callback={resetForm}
                    toast={"Imagem cadastrada com sucesso"}
                >
                    <Input
                        name="foto"
                        type="file"
                        label="Imagem"
                        value={file}
                        multiple={true}
                        callback={handleSetAnexo}
                    />
                    <Button type="sumbit">Enviar</Button>
                </Form>
            </ModalBody>
        </Modal>
    )
}