import Modal from 'react-bootstrap/Modal';
import style from './modalTitle.module.scss';
import Icon from '../../../icon';

export default function ModalTitle(props){

    return(
        <>
            <Modal.Title className={ style.modalTitle + ' w-100' }>
                <div className="d-flex align-items-start justify-content-between w-100">
                    <div>
                        { props.children }
                    </div>
                    <div className={'modal_icons'}>
                        {(props?.icons?.custom ? props?.icons?.custom : '')}

                        {(props?.icons?.excel ? 
                            <Icon
                                type="excel"
                                title="Exportar em Excel"
                                className={style.btn__excel}
                            />
                        :'')}

                        {(props?.icons?.print ? 
                            <Icon
                                type="print"
                                title="Imprimir"
                                className={style.btn__print}
                            />
                        :'')}
                        
                        {(props?.close !== false ?
                            <Icon
                                type="reprovar"
                                title="Fechar"
                                className={style.btn__close}
                            />
                        :'')}
                    </div>                    
                </div>
            </Modal.Title>
        </>
    );
}
