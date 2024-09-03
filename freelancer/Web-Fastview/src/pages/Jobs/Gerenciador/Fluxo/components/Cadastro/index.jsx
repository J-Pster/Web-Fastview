import { useState } from "react";
import Icon from "../../../../../../components/body/icon";
import style from './style.module.scss';
import Modal from '../../../../../../components/body/modal';
import ModalHeader from '../../../../../../components/body/modal/modalHeader';
import ModalTitle from '../../../../../../components/body/modal/modalHeader/modalTitle';
import ModalBody from '../../../../../../components/body/modal/modalBody';
import Form from '../../../../../../components/body/form';
import Input from '../../../../../../components/body/form/input';
import InputContainer from '../../../../../../components/body/form/inputcontainer';
import Switch from '../../../../../../components/body/switch';

export default function Cadastro({title, item, align}){
    // ESTADOS
    const [show, setShow] = useState(false);
    const [nome, setNome] = useState(item?.nome);
    const [todosSistemas, setTodosSistemas] = useState(item?.id_apl === 1 || !item?.id_apl? true : false);

    // ABRE MODAL
    const handleSetShow = () => {
        setShow(true);
    }

    return(
        <>
            <Modal show={show} onHide={() => setShow(false)} centered>
                <ModalHeader>
                    <ModalTitle>
                        {(item ? 'Editar' : 'Nova') + ' ' + (title ? title : '')}
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <Form>
                        <Input
                            name="nome"
                            id="nome"
                            type="text"
                            label="Nome"                            
                            onChange={(e) => setNome(e.target.value)}
                            value={nome}
                        />

                        <InputContainer>
                            <Switch
                                id="todos_sistemas"
                                name="todos_sistemas"
                                label="Disponível em todos os sistemas:"
                                checked={todosSistemas}
                                onChange={() => setTodosSistemas(!todosSistemas)}
                            />
                        </InputContainer>
                    </Form>
                </ModalBody>
            </Modal>

            <div className={style.container + ' ' + (item ? style.edit : '') + ' ' + (align === 'left' ? style.left : '')}>
                <Icon
                    type={item ? 'edit' : 'new'}
                    title={(item ? 'Editar' : 'Nova') + ' ' + (title ? title : '')}
                    animated={item ? true : false}
                    onClick={handleSetShow}
                />
            </div>
        </>
    )
}