import axios from "axios";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import Table from "../../../components/body/table";
import Thead from "../../../components/body/table/thead";
import Th from "../../../components/body/table/thead/th";
import Tr from "../../../components/body/table/tr";
import { useEffect, useState } from "react";
import Tbody from "../../../components/body/table/tbody";
import Td from "../../../components/body/table/tbody/td";
import { cd, get_date } from "../../../_assets/js/global";

export default function ModalLidos({ show, handleShow, onHide, id_job, titulo, apl }) {

    //CLOSE MODAL
    const handleClose = () => {
        onHide(false);

        setTimeout(() => {
            setItens([]);
        },500);
    }

    //ESTADOS
    const [itens, setItens] = useState([]);

    const handleSetItens = (e) => {
        setItens(e);
    }

    return (
        <Modal show={show} handleShow={handleShow} onHide={handleClose} large={true} >
            <ModalHeader>
                <ModalTitle>
                    {titulo && titulo}
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table
                    id="jobs-lidos"
                    api={window.host_madnezz+'/systems/integration-react/api/request.php'}
                    params={{
                        db_type: 'sql_server',
                        do: 'getReport',
                        type: 'Job',
                        id_apl: 223,
                        filter_id_apl: 229,
                        limit: 50,
                        filter_id_job: id_job
                    }}
                    key_aux={['data']}
                    border={false}
                    onLoad={handleSetItens}
                    reload={show}
                >
                    <Thead>
                        <Tr>
                            <Th>
                                Loja
                            </Th>
                            <Th>
                                Usuário
                            </Th>
                            <Th align="center">
                                Enviado
                            </Th>
                            <Th align="center">
                                Visualizado
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {(
                            itens.length > 0 ?
                                itens.map((item) => {
                                    return (
                                        <Tr key={'leitura_'+item.id_job}>
                                            <Td>
                                                {(item?.nome_loja ? item?.nome_loja : '-')}
                                            </Td>
                                            <Td>
                                                {(item?.nome_usuario ? item?.nome_usuario : '-')}
                                            </Td>
                                            <Td width={1} align="center">
                                                {item?.data ? get_date('date', item?.data, 'datetime_sql') : '-'} 
                                            </Td>
                                            <Td width={1} align="center">
                                                {item?.dataHora_visualizado ? get_date('datetime', item?.dataHora_visualizado, 'datetime_sql') : '-'} 
                                            </Td>
                                        </Tr>
                                    )
                                })
                            : <></>
                        )}
                    </Tbody>
                </Table>
            </ModalBody>
        </Modal >
    )
}