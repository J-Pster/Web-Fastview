import Modal from "../../../../components/body/modal";
import ModalHeader from "../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../../components/body/modal/modalBody";
import Table from "../../../../components/body/table";
import Thead from "../../../../components/body/table/thead";
import Tbody from "../../../../components/body/table/tbody";
import Th from "../../../../components/body/table/thead/th";
import Tr from "../../../../components/body/table/tr";
import Td from "../../../../components/body/table/tbody/td";
import { useEffect, useState } from "react";
import { cdh } from "../../../../_assets/js/global";

export default function ModalLista(props) {

    //API INFO
    const [itemsInfo, setItemsInfo] = useState([]);
    //ESTADOS FILTRO
    const [supervisorModal, setSupervisorModal] = useState('');
    const [gerenteModal, setGerenteModal] = useState('');
    const [usuarioModal, setUsuarioModal] = useState('');
    const [lojaModal, setLojaModal] = useState(props.lojaId);
    const [tituloModal, setTituloModal] = useState('');
    const [categoriaModal, setCategoriaModal] = useState('');
    const [subcategoriaModal, setSubcategoriaModal] = useState('');
    const [dataAgendadaInicioModal, setDataAgendadaInicioModal] = useState('');
    const [dataAgendadaFimModal, setDataAgendadaFimModal] = useState('');
    const [dataFinalizadoInicioModal, setDataFinalizadoInicioModal] = useState('');
    const [dataFinalizadoFimModal, setDataFinalizadoFimModal] = useState('');
    const [statusModal, setStatusModal] = useState('');

    // INFO MODAL
    const handleSetItemsInfo = (e) => {
        setItemsInfo(e);
    }

    //LISTA FILTRO GENÉRICA TARGET -- teste 
    const handleTarget = (setState) => (e) => {
        setState(e.target.value)
    }
    //LISTA FILTRO GENÉRICA VALUE -- teste 
    const handleValue = (setState) => (e) => {
        setState(e.value)
    }
    //LISTA FILTRO GENÉRICA EVENT -- teste 
    const handleEvent = (setState) => (e) => {
        setState(e)
    }


    useEffect(() => {
        if (props?.show === true) {
            setLojaModal(props?.lojaId);
            setUsuarioModal(props?.usuarioId);
            setTituloModal(props?.titulo);
            setCategoriaModal(props?.categoriaId);
            setSubcategoriaModal(props?.subcategoriaId);
            setSupervisorModal(props?.supervisorId);
            setStatusModal(props?.status);
            // setDataAgendadaInicioModal(props?);
            // setDataAgendadaFimModal(props?);
            // setDataFinalizadoInicioModal(props?);
            // setDataFinalizadoFimModal(props?);
        }
    }, [props?.show])

    //FECHAR MODAL E LIMPAR OS FILTROS
    const handleClose = () => {
        props.onHide();
    }

    return (
        <Modal show={props.show} onHide={handleClose} xl={true}>
            <ModalHeader>
                <ModalTitle>
                    Jobs
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table
                    id="jobs_info"
                    api={window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list'}
                    params={{
                        filter_type: 5,
                        filter_subtype: 'dashboard_info',
                        filter_month: 9,
                        filter_year: 2023,
                        filter_supervisor: supervisorModal,
                        filter_id_store: lojaModal,
                        filter_id_user: usuarioModal,
                        filter_category: categoriaModal,
                        filter_subcategory: subcategoriaModal,
                        filter_title: tituloModal,
                        filter_id_module: props?.filterModule,
                        filter_status: statusModal,
                        limit: 50,
                        id_apl: window.rs_id_apl
                    }}
                    border={false}
                    onLoad={handleSetItemsInfo}
                    reload={props.show}
                >
                    <Thead>
                        <Tr>
                            <Th
                                name="filter_supervisor"
                                api={{
                                    url: window.host_madnezz + "/api/sql.php?do=select&component=supervisor_2&grupo_id=true"
                                }}
                                onChangeClose={handleEvent(setSubcategoriaModal)}
                            >
                                Supervisor
                            </Th>
                            <Th
                               
                            >
                                Gerente
                            </Th>
                            {(props.lojaId ?
                                <Th
                                    id="loja"
                                    name="loja"
                                    api={{
                                        url: window.host_madnezz + "/api/sql.php?do=select&component=loja&filial=true",
                                        params: {
                                            limit: 50
                                        }
                                    }}
                                    onChange={handleEvent(setLojaModal)}
                                >
                                    Loja
                                </Th>
                                : '')}

                            {(props.usuarioId ?
                                <Th
                                    id="usuario"
                                    name="usuario"
                                    api={{
                                        url: window.host_madnezz + "/api/sql.php?do=select&component=usuario",
                                        params: {
                                            limit: 50
                                        }
                                    }}

                                    onChange={handleEvent(setUsuarioModal)}
                                >
                                    Usuário
                                </Th>
                                : '')}
                            <Th
                                id="titulo"
                                name="titulo"
                                onChange={handleTarget(setTituloModal)}
                            >
                                Título
                            </Th>
                            <Th

                                name="categoria"
                                api={window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_category&id_apl="+window.rs_id_apl}
                                onChange={handleEvent(setCategoriaModal)}
                            >
                                Categoria
                            </Th>
                            <Th
                                name="subcategoria"
                                api={{
                                    url: window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_subcategory&id_apl="+window.rs_id_apl,
                                    params: {
                                        filter_id_category: props.categoriaActive
                                    }
                                }}
                                onChange={handleEvent(setSubcategoriaModal)}

                            >
                                Subcategoria
                            </Th>
                            <Th
                                type="date"
                                start={{ value: dataAgendadaInicioModal, onChange: handleEvent(setDataAgendadaInicioModal) }}
                                end={{ value: dataAgendadaFimModal, onChange: handleEvent(setDataAgendadaFimModal) }}
                            >
                                Data
                            </Th>
                            <Th
                                type="date"
                                start={{ value: dataFinalizadoInicioModal, onChange: handleEvent(setDataFinalizadoInicioModal) }}
                                end={{ value: dataFinalizadoFimModal, onChange: handleEvent(setDataFinalizadoFimModal) }}
                            >
                                Data Finalizado
                            </Th>
                            <Th
                                items={window.optionsStatus}
                                onChange={handleEvent(setStatusModal)}
                            >
                                Status
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {itemsInfo.map((item, i) => {
                            let status_aux = '';
                            if (item.status === -2) {
                                status_aux = 'Atrasado';
                            } else if (item.status === - 1) {
                                status_aux = 'Em andamento'
                            } else if (item.status === 1) {
                                status_aux = 'Concluído';
                            } else if (item.status === 2) {
                                status_aux = 'Não tem';
                            } else if (item.status === 3) {
                                status_aux = 'Concluído c/ Atraso';
                            } else if (item.status === 4) {
                                status_aux = 'Adiado'
                            }
                            return (
                                <Tr>
                                    <Td>
                                        {item.supervisor_loja}
                                    </Td>
                                    <Td>

                                    </Td>
                                    {(props.lojaId ?
                                        <Td>{item?.loja}</Td>
                                        : '')}

                                    {(props.usuarioId ?
                                        <Td>{item?.usuario}</Td>
                                        : '')}

                                    <Td>{item?.job}</Td>
                                    <Td>{item?.categoria}</Td>
                                    <Td>{item?.subcategoria}</Td>
                                    <Td>{(item?.data_job ? cdh(item?.data_job) : '')}</Td>
                                    <Td>{item?.dataHora_execucao_formatada}</Td>
                                    {/* <Td> {item.status} {props.statusName}</Td> */}
                                    <Td>{status_aux}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </ModalBody>
        </Modal>
    )
}
