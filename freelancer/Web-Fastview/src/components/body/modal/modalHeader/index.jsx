import Modal from 'react-bootstrap/Modal';
import style from './modalHeader.module.scss';

export default function ModalHeader({className, children, padding}){

    return(
        <>
            <Modal.Header className={ style.modalHeader + ' ' + (className ? className : '') + ' ' + (padding === false ? style.no__padding : '')} closeButton>
                { children }
            </Modal.Header>
        </>
    );
}
