import Modal from 'react-bootstrap/Modal';
import style from './modalBody.module.scss';

export default function ModalBody({className, children, padding}){

    return(
        <>
            <Modal.Body className={ style.modalBody + ' ' + (className ? className : '') + ' ' + (padding === false ? style.no__padding : '')}>
                { children }
            </Modal.Body>
        </>
    );
}
