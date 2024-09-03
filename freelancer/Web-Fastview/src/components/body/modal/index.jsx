import { useState } from "react";
import { Modal as ModalBoostrap } from 'react-bootstrap';

export default function Modal(props){
    const [show, setShow] = useState(false);
    
    // SIZE MODAL
    let modalSize='';
    if(props.large===true || props.lg===true){
        modalSize = 'modal-dialog-lg';
    }

    if(props.md===true){
        modalSize = 'modal-dialog-md';
    }

    if(props.xl===true){
        modalSize = 'modal-dialog-xl';
    }

    if(props.xxl===true){
        modalSize = 'modal-dialog-xxl';
    }

    return(
        <>
            <ModalBoostrap
                show={ props.show }
                onHide={ props.onHide }
                dialogClassName={modalSize}
                id={props?.id}
                centered={props?.centered}
            >
                { props.children }
            </ModalBoostrap>
        </>
    );
}
