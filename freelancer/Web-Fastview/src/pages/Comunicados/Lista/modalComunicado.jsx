import Icon from "../../../components/body/icon";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import "./style.css"
import style from '../../../components/body/card/Card.module.scss';

export default function ModalComunicado({ show, handleShow, onHide, id, job, text, file }) {

    //FECHAR MODAL
    const handleClose = () => {
        onHide(false)
    }

    // TRANSFORMAR STRING EM OBJETO
    const objFile = file ? JSON.parse(file) : "";

    return (
        <Modal show={show} handleShow={handleShow} onHide={handleClose} >
            <ModalHeader>
                <ModalTitle>
                    {job}
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div key={id} dangerouslySetInnerHTML={{__html: text}} />
                <>
                    {(
                        objFile ?
                            objFile?.map((file) => {
                                return (
                                    <>
                                        {
                                            // IMAGEM
                                            file.type.includes('image') ?
                                                <img
                                                    key={file.id}
                                                    src={`https://upload.madnezz.com.br/${file.id}`}
                                                    alt={file.name}
                                                    className="comunicado-img" />
                                                : <></>
                                        }
                                        {
                                            // PDF
                                            file.type === "application/pdf" ?
                                                <>
                                                    <embed
                                                        key={file.id}
                                                        src={`https://upload.madnezz.com.br/${file.id}`}
                                                        className="comunicado-doc"
                                                        type="application/pdf"
                                                    />
                                                </>
                                                : <></>
                                        }
                                        {
                                            //ALGUM TIPO QUE NÃO ESTEJA ACIMA, VAI ABRIR EM UMA GUIA NOVA
                                            file.type !== "application/pdf" && !file.type.includes('image') ?
                                                <a
                                                    key={file.id}
                                                    href={`https://upload.madnezz.com.br/${file.id}`}
                                                    target={file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                        || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

                                                        ? "" : "blank"}
                                                    className={style.file__link + ' d-block mb-2'}
                                                    rel="noreferrer"
                                                >
                                                    {file.name} <Icon type="external" />
                                                </a>
                                                : <></>
                                        }
                                        {/*
                                            // DOCX
                                            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                                <>
                                                    <iframe
                                                        key={file.id}
                                                        // className="w-100 position-relative d-block"
                                                        src={`https://docs.google.com/gview?url=https://upload.madnezz.com.br/${file.id}&embedded=true`}
                                                        className="comunicado-doc"
                                                    // frameborder="0"
                                                    >
                                                    </iframe> 
                                                </>
                                                : <></> 
                                    */ }
                                    </>
                                )
                            })
                            : <></>
                    )}
                </>
                {/* <Button>Confirmar Leitura</Button> */}
            </ModalBody>
        </Modal>
    )
}