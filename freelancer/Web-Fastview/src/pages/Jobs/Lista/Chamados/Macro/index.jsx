import { useContext, useEffect, useState } from "react";

import Table from "../../../../../components/body/table";
import { GlobalContext } from "../../../../../context/Global";
import Tr from "../../../../../components/body/table/tr";
import Tbody from "../../../../../components/body/table/tbody";
import Td from "../../../../../components/body/table/tbody/td";
import Row from "../../../../../components/body/row";
import Col from "../../../../../components/body/col";
import ModalHeader from "../../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../../../components/body/modal/modalBody";
import Modal from "../../../../../components/body/modal";
import { cd, get_date, removeHTMLTags } from "../../../../../_assets/js/global";
import Icon from "../../../../../components/body/icon";
import Tfoot from "../../../../../components/body/table/tfoot";
import axios from "axios";
import Input from "../../../../../components/body/form/input";

export default function Macro({filters, icons}){
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // NECESSÁRIO PARA CARREGAR A TABLE SEMPRE QUE ENTRA NA PÁGINA
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    var date = new Date();

    // ESTADOS LISTA
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState([]);
    const [dateStart, setDateStart] = useState(new Date(get_date('date_sql', get_date('date', new Date(date.getFullYear(), date.getMonth(), 1), 'date'), 'date_sub_day', 29)));
    const [dateEnd, setDateEnd] = useState(new Date());

    // ESTADOS MODAL
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [filterStatus, setFilterStatus] = useState([]);
    const [filterModulo, setFilterModulo] = useState([]);
    const [itemsModal, setItemsModal] = useState([]);

    // SETA ITENS VINDOS DA API
    const handleSetItems = (e) => {
        setItems(e);
    }

    // SETA ITENS VINDOS DA API DO MODAL
    const handleSetItemsModal = (e) => {
        setItemsModal(e);
    }

    // GET CHAMADOS
    function getChamados(title, status, modulo){
        setTitleModal('Chamados - '+title);
        setFilterStatus(status);
        setFilterModulo(modulo);
        setShowModal(true);
    }

    // CONSTRÓI AS TH'S DA LISTA
    const theadLista = [
        { enabled: true, label: 'Departamento', name: 'modulo', filter: false},
        { enabled: true, label: 'Solicitações', name: 'qtd_total', filter: false, align: 'center'},
        { enabled: true, label: 'Aprovados', name: 'qtd_feito', filter: false, align: 'center'},
        { enabled: true, label: 'Reprovados', name: 'qtd_nao_feito', filter: false, align: 'center'},
        { enabled: true, label: 'Cancelados', name: 'qtd_cancelado', filter: false, align: 'center'},
        { enabled: true, label: 'Em andamento', name: 'qtd_pendente', filter: false, align: 'center'},
    ]

    // TITLES DO EXPORTADOR DA LISTA
    let thead_export_lista = {};
    theadLista.map((item, i) => {
        if (item?.export !== false) {
            thead_export_lista[item?.name] = item?.label;
        }
    })

    // URL API LISTA
    const urlLista = window.host_madnezz+'/systems/integration-react/api/request.php?type=Dashboard&do=getCalled&filter_type=module';

    // PARAMS API LISTA
    const paramsLista = {
        filter_date_start: get_date('date_sql', cd(dateStart)),
        filter_date_end: get_date('date_sql', cd(dateEnd))
    }

    // BODY DO EXPORTADOR LISTA
    const bodyLista = {
        titles: thead_export_lista,
        url: urlLista,
        filters: paramsLista,
        name: 'Chamados',
        orientation: 'P',
        key: 'data'
    }

    // CONSTRÓI AS TH'S DO MODAL
    const theadModal = [
        {enabled: true, label: 'Solicitante', name: 'cad_lja_nome', width: 1, filter: false},
        {enabled: true, label: 'Descrição', name: 'descricao', filter: false},
        {enabled: true, label: 'Data', name: 'data_job', align: 'center', filter: false},
    ]

    // TITLES DO EXPORTADOR DA MODAL
    let thead_export_modal = {};
    theadModal.map((item, i) => {
        if (item?.export !== false) {
            thead_export_modal[item?.name] = item?.label;
        }
    })

    // URL API MODAL
    const urlModal = window.host_madnezz + '/systems/integration-react/api/list.php?do=get_list';

    // PARAMS API MODAL
    const paramsModal = {
        filter_status: filterStatus,
        filter_type: '5',
        filter_id_module: filterModulo,
        type: 'report',
        limit: 50
    }

    // BODY DO EXPORTADOR MODAL
    const bodyModal = {
        titles: thead_export_modal,
        url: urlModal,
        filters: paramsModal,
        name: 'Chamados',
        orientation: 'L'
    }

    // GET TOTAL
    useEffect(() => {
        setTotal('');
        
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Dashboard&filter_subtype=total&do=getCalled&filter_type=module',
            params: {
                filter_date_start: get_date('date_sql', cd(dateStart)),
                filter_date_end: get_date('date_sql', cd(dateEnd))
            }
        }).then((response) => {
            setTotal(response?.data?.data[0]);
        });
    },[dateStart, dateEnd]);

    // MANDA FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if(filters){
            filters(
                <>                    
                    <Input
                        type="period"
                        required={false}
                        valueStart={dateStart}
                        valueEnd={dateEnd}
                        onChangeStart={(e) => (setDateStart(e), handleSetFilter(true))}
                        onChangeEnd={(e) => (setDateEnd(e), handleSetFilter(true))}
                    />
                </>
            )
        }

        if (icons) {
            icons(
                <>
                    <Icon type="excel" api={{ body: bodyLista }} />
                    <Icon type="pdf" api={{ body: bodyLista }} />
                </>
            );
        }
    },[]);

    return(
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} large={true}>
                <ModalHeader>
                    <ModalTitle
                        icons={{
                            custom: <>
                                <Icon type="excel" api={{ body: bodyModal }} />
                                <Icon type="pdf" api={{ body: bodyModal }} />
                            </>
                        }}
                    >
                        {(titleModal ? titleModal : 'Chamados')}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Table
                        id="chamados_macro_detalhes"
                        api={urlModal}
                        params={paramsModal}                        
                        border={false}
                        onLoad={handleSetItemsModal}
                        thead={theadModal}
                        reload={showModal}
                        text_limit={70}
                    >
                        <Tbody>
                            {(itemsModal.length > 0 ?
                                itemsModal.map((item, i) => {                                    
                                    return(
                                        <Tr key={'chamado_modal_'+item?.id_job_status}>
                                            <Td disableView={false} width={1}>{(item?.cad_lja_nome ? item?.cad_lja_nome : '-')}</Td>
                                            <Td disableView={false} title={(item?.descricao ? removeHTMLTags(item?.descricao) : '')}>{(item?.descricao ? removeHTMLTags(item?.descricao) : '-')}</Td>
                                            <Td disableView={false} align="center">{(item?.data_job ? get_date('date', item?.data_job, 'datetime_sql') : '-')}</Td>
                                        </Tr>
                                    )
                                })
                            :<></>)}
                        </Tbody>
                    </Table>
                </ModalBody>
            </Modal>

            <Row>
                <Col lg={'auto'}>
                    <Table
                        id="chamados_macro"
                        api={urlLista}
                        params={paramsLista}
                        onLoad={handleSetItems}
                        key_aux_2={'data'}
                        thead={theadLista}                        
                    >
                        <Tbody>
                            {(items.length > 0 ?
                                items.map((item, i) => {                                    
                                    return(
                                        <Tr key={'modulo_'+item?.id_modulo}>
                                            <Td>{item?.modulo}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => getChamados('Solicitações', undefined, [item?.id_modulo])}>{item?.qtd_total}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => getChamados('Aprovados', [1, 3], [item?.id_modulo])}>{item?.qtd_feito}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => getChamados('Reprovados', [2], [item?.id_modulo])}>{item?.qtd_nao_feito}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => getChamados('Cancelados', [6], [item?.id_modulo])}>{item?.qtd_cancelado}</Td>
                                            <Td align="center" cursor="pointer" onClick={() => getChamados('Em andamento', [-1, -2], [item?.id_modulo])}>{item?.qtd_pendente}</Td>
                                        </Tr>
                                    )
                                })
                            :<></>)}
                        </Tbody>

                        <Tfoot>
                            {(total ?
                                <Tr>
                                    <Td disableView={false}>Total</Td>
                                    <Td disableView={false} align="center">{total?.qtd_total}</Td>
                                    <Td disableView={false} align="center">{total?.qtd_feito}</Td>
                                    <Td disableView={false} align="center">{total?.qtd_nao_feito}</Td>
                                    <Td disableView={false} align="center">{total?.qtd_cancelado}</Td>
                                    <Td disableView={false} align="center">{total?.qtd_pendente}</Td>
                                </Tr>
                            :<></>)}
                        </Tfoot>
                    </Table>
                </Col>
            </Row>
        </>
    )
}
