import { useState } from 'react';
import style from './Tutorial.module.scss';

import Modal from "../../modal";
import ModalHeader from "../../modal/modalHeader";
import ModalTitle from "../../modal/modalHeader/modalTitle";
import ModalBody from "../../modal/modalBody";
import Icon from '../../icon';

export default function Tutorial(props){
    const [showModal, setShowModal] = useState(false);

    // FUNÇÕES AO ABRIR MODAL
    const handleShowModal = (e) => {
        setShowModal(true);
    };

    // FUNÇÕES AO FECHAR MODAL
    const handleCloseModal = (e) => {
        setShowModal(false);
    };

    var link;
    if(props.url.includes('shorts')){
        link = props.url.split('shorts/')[1];
    }else if(props.url.includes('.be/')){
        link = props.url.split('.be/')[1];
    }else{
        link = props.url.split('?v=')[1];                      
    }

    if(link){
        return(
            <>
                <Modal show={showModal} onHide={handleCloseModal} large={true}>
                    <ModalHeader>
                    <ModalTitle>
                        Tutorial {(props.title?' - '+props.title:'')}
                    </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <iframe
                            className={style.iframe}
                            src={'https://www.youtube.com/embed/'+link.split('&t=')[0]}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </ModalBody>
                </Modal>

                <Icon type="video" title="Tutorial" animated onClick={handleShowModal} />
            </>
        )
    }
}
