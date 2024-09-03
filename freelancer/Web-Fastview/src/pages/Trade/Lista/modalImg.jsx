import Icon from "../../../components/body/icon";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";

export default function ModalImgTrade({ show, handleShow, img, nome, onHide }) {

    //FECHAR MODAL
    const handleClose = () => {
        onHide(false)
    }
    return (
        <Modal show={show} restoreFocus={true} onHide={handleClose}>
            {/* <ModalHeader>
                <ModalTitle>
                    {nome}
                </ModalTitle>
            </ModalHeader> */}
            <ModalBody>
                <Icon type="reprovar" onClick={handleClose} />
                <img
                    className="modalNewsImage"
                    //src={img ? process.env.REACT_APP_URL_UPLOAD + "/" + img : window.host + "/systems/news-react/"} 
                    src={img}
                    alt={nome} />
            </ModalBody>
        </Modal>
    )
}