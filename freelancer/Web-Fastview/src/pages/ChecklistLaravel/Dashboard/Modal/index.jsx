import { useEffect, useState } from "react";

import Modal from "../../../../components/body/modal";
import ModalHeader from "../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../../components/body/modal/modalBody";
import axios from "axios";
import Table from "../../../../components/body/table";

export default function ModalRespostas({show, callback, filters}){
    // ESTADOS
    const [showAux, setShowAux] = useState(show);
    const [items, setItems] = useState([]);

    // FECHA MODAL
    const handleCloseModal = () => {
        setShowAux(false);

        if(callback){
            callback({
                show: false
            })
        }
    }

    // ALTERA ESTADO DO MODAL SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setShowAux(show);

        if(show){
            axios({
                method: 'get',
                url: window.backend+'/api/v1/checklists/relatorios',
                params: filters
            }).then((response) => {
                if(response.data){
                    setItems(response.data?.data);
                }
            });
        }else{
            setTimeout(() => {
                setItems([]);
            },500);
        }
    },[show]);

    // DEFINE TITLE
    let title;

    if(filters?.status == 1){
        title = <><b>Itens Conformes</b> -  {filters?.title}</>;
    }else if(filters?.status == 2){
        title = <><b>Itens Não Conformes</b> -  {filters?.title}</>;
    }else if(filters?.status == 3){
        title = <><b>Itens Não se Aplicam</b> -  {filters?.title}</>;
    }

    return(
        <Modal
            show={showAux}
            onHide={handleCloseModal}
            xl={true}
        >
            <ModalHeader>
                <ModalTitle>
                    {title}
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table>

                </Table>
            </ModalBody>
        </Modal>
    )
}
