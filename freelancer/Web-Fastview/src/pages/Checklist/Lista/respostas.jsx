import { useContext, useEffect, useState } from 'react';
import { cd } from '../../../_assets/js/global.js';

import Modal from '../../../components/body/modal';
import ModalHeader from '../../../components/body/modal/modalHeader';
import ModalBody from '../../../components/body/modal/modalBody';
import ModalTitle from '../../../components/body/modal/modalHeader/modalTitle';
import Table from '../../../components/body/table';
import Td from '../../../components/body/table/tbody/td';
import Tbody from '../../../components/body/table/tbody';
import Tfoot from '../../../components/body/table/tfoot';
import Tr from '../../../components/body/table/tr';
import Icon from '../../../components/body/icon';
import Editar from '../../../components/body/card/editar';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import { GlobalContext } from '../../../context/Global.jsx';

export default function Respostas(props) {
    // GLOBAL CONTEXT
    const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

    // ESTADOS
    const [respostas, setRespostas] = useState([]);
    const [plano, setPlano] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [viewImages, setViewImages] = useState(false);

    const handleCloseModal = () => {
        props.onHide(false);
        setRespostas([]);
    }

    // FUNÇÃO PARA ABRIR PLANO DE AÇÃO    
    function actionPlain(titulo, loja){
        handleCloseModal();
        setTitulo(titulo);
        setPlano(true);
    }
    
    // VARIÁVEIS
    var total_pontos = 0;
    var total_porc = 0;

    // CONSTRÓI AS TH'S
    const thead = [
        { enabled: true, label: 'Seção', id: 'secao', name: 'secao', filter: false },
        { enabled: true, label: 'Item', id: 'item', name: 'item', filter: false },
        { enabled: true, label: 'Usuário', id: 'respondido_por', name: 'respondido_por', filter: false },
        { enabled: true, label: 'Resposta', id: 'resposta', name: 'resposta', align: 'center' , filter: false},
        { enabled: true, label: 'Observação', id: 'observacao', name: 'observacao', filter: false },
        { enabled: true, label: 'Motivo', id: 'motivo', name: 'motivo', filter: false },
        { enabled: true, label: 'Anexo', id: 'anexo', name: 'anexo', align: 'center', export: false, filter: false },
        { enabled: true, label: 'Qtde.', id: 'quantidade', name: 'quantidade', align: 'center', filter: false },
        { enabled: true, label: 'Pontos', id: 'pontos', name: 'pontos', align: 'center', filter: false },
        { enabled: true, label: '%', id: 'porcentagem', name: 'porcentagem', align: 'center', filter: false },
        { enabled: true, label: 'Ações', id: 'acoes', name: 'acoes', export: false, filter: false },
    ]

    // TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    });

    // URL API TABLE
    const url = window.host + '/systems/'+global.sistema_url.checklist+'/api/lista.php?do=get_respostas';

    // PARAMS API TABLE
    const params = {
        relatorio_id: props.relatorio_id,
        checklist_id: props.checklist_id,
        checklist_status: props.checklist_status,
        resposta_status: (props.resposta_status ? props.resposta_status : ''),
        sistema_id: props?.sistema_id
    }

    // BODY DO EXPORTADOR
    const body = {
        titles: thead_export,
        url: url,
        name: 'Respostas' + (props?.checklist_nome ? (' - '+props?.checklist_nome) : ''),
        filters: params,
        orientation: 'L',
        custom_values: {
            resposta: {
                1: 'Conforme',
                2: 'Não conforme',
                3: 'Não se aplica'
            }
        }
    }

    // GET RESPOSTAS
    useEffect(() => {
        if(props.show){
            axios({
                method: 'get',
                url: url,
                params: params
            }).then((response) => {
                if(response.data){
                    setRespostas(response.data);
                }
            })
        }
    },[props.show]);

    // CLIQUE DAS IMAGENS
    const handleLightbox = (img) => {
        handleSetToggler(true);
        handleSetSources([img], 0);
    }
    
    return ( 
        <>
            {/* MODAL RESPOSTAS */}
            <Modal
                show={props.show}
                onHide={handleCloseModal}
                xl={true}
            >
                <ModalHeader>
                    <ModalTitle 
                        icons={{
                            print: true,
                            custom: <>                                
                                <Icon type={(viewImages ? 'list' : 'th')} title="Visualizar imagens" onClick={() => setViewImages(!viewImages)} />
                                <Icon type="excel" api={{ body: body }} />
                            </>                
                        }}
                    >
                        Respostas {(props?.checklist_nome ? (' - '+props?.checklist_nome) : '')}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Table
                        fixed={false}
                        text_limit={20}
                        thead={thead}
                    >
                        <Tbody>
                            {(respostas.length>0 ?
                                respostas.map((item) => {
                                    var resposta = '';
                                    if(item.resposta == 1){
                                        resposta = <Icon type="check" title="Aprovado" className="text-success" />
                                    }else if(item.resposta == 2){
                                        resposta = <Icon type="reprovar2" title="Reprovado" className="text-danger" />
                                    }else if(item.resposta == 3){
                                        resposta = <Icon type="ban" title="Não se aplica" className="text-warning" />
                                    }

                                    total_pontos += (item.pontos ? Number(item.pontos.toString().replace(',', '.')) : 0);
                                    total_porc += (item.porcentagem ? Number(item.porcentagem.toString().replace(',', '.')) : 0);

                                    return(
                                        <Tr key={item.id}>
                                            <Td disableView={false}>
                                                <Tippy content={item.secao} placement="left">
                                                    <span>
                                                        {item.secao}
                                                    </span>
                                                </Tippy>
                                            </Td>
                                            <Td disableView={false}>
                                                <Tippy content={item.item} placement="left">
                                                    <span>
                                                        {item.item}
                                                    </span>
                                                </Tippy>
                                            </Td>
                                            <Td disableView={false}>
                                                <Tippy content={item.respondido_por} placement="left">
                                                    <span>
                                                        {item.respondido_por}
                                                    </span>
                                                </Tippy>
                                            </Td>
                                            <Td align="center" disableView={false}>
                                                {resposta}
                                            </Td>
                                            <Td disableView={false}>
                                                <Tippy content={item.observacao} placement="left">
                                                    <span>
                                                        {item.observacao}
                                                    </span>
                                                </Tippy>
                                            </Td>
                                            <Td disableView={false}>
                                                <Tippy content={item.motivo} placement="left">
                                                    <span>
                                                        {item.motivo}
                                                    </span>
                                                </Tippy>
                                            </Td>
                                            <Td align="center" disableView={false}>
                                                {(item.anexos ?
                                                    (item.anexos.includes('{') ?
                                                        JSON.parse(item.anexos.replaceAll('],[',',')).map((image, i) => {
                                                            return (
                                                                (viewImages ?
                                                                    <img
                                                                        src={window.upload + '/' + image.id}
                                                                        style={{ width: 90, height: 'auto' }}
                                                                        className={'show_print d-block my-1 cursor-pointer'}
                                                                        onClick={() => handleLightbox(window.upload + '/' + image.id)}
                                                                    />
                                                                :
                                                                    <Icon
                                                                        type="visualizar"
                                                                        title="Visualizar anexo"
                                                                        className="hide_print"
                                                                        onClick={() => handleLightbox(window.upload + '/' + image.id)}
                                                                    />
                                                                )
                                                            )
                                                        })
                                                    :
                                                        item.anexos.split(',').map((image, i) => {
                                                            return (
                                                                (viewImages ?
                                                                    <img
                                                                        src={window.upload + '/' + image}
                                                                        style={{ width: 90, height: 'auto' }}
                                                                        className={'show_print d-block my-1 cursor-pointer'}
                                                                        onClick={() => handleLightbox(window.upload + '/' + image)}
                                                                    />
                                                                :
                                                                    <Icon
                                                                        type="visualizar"
                                                                        title="Visualizar anexo"
                                                                        className="hide_print"
                                                                        onClick={() => handleLightbox(window.upload + '/' + image)}
                                                                    />
                                                                )
                                                            )
                                                        })
                                                    )
                                                :
                                                    '-'
                                                )}
                                            </Td>

                                            <Td align="center" disableView={false}>
                                                {(item?.quantidade ? item?.quantidade : '-')}
                                            </Td>

                                            <Td align="center" disableView={false}>
                                                {item.pontos}
                                            </Td>

                                            <Td align="center" disableView={false}>
                                                {item.porcentagem.toFixed(2)} %
                                            </Td>

                                            <Td
                                                align="center"
                                                className="hide_print"  
                                                disableView={false}                                              
                                            >
                                                <Icon
                                                    type="user-check"
                                                    animated
                                                    title={item.resposta == 2 ? 'Criar plano de ação' : 'Plano de ação disponível apenas para respostas negativas'}
                                                    motivo={false}
                                                    onClick={() => actionPlain(item.item, item.loja_id)}
                                                    disabled={(item.resposta == 2 ? false : true)}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })
                            :
                                <></>
                            )}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Td colspan="8"><b>Total</b></Td>
                                <Td align="center"><b>{(total_pontos ? total_pontos.toFixed(2) : '0.00')}</b></Td>
                                <Td align="center"><b>{(total_porc ? (total_porc >= 100 ? 100 : total_porc).toFixed(2).replace('.', ',') : 0) + '%'}</b></Td>
                                <Td></Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </ModalBody>
            </Modal>

            {/* MODAL PLANO DE AÇÃO (COMPONENTE DO JOBS) */}
            {(plano ?
                <Editar
                    modalTitle={'Plano de Ação'+(props.job?' - '+props.job:'')}
                    icon={false}
                    show={true}
                    plano={true}
                    onClose={(e) => setTimeout(() => {setPlano(false)},500)}
                    frequency={{
                        id: 143
                    }}
                    dateStart={new Date()}
                    job={titulo}
                    category={2426}
                    subcategory={4291}
                    description={`Item de checklist reprovado: `+titulo+`\nReprovado em: `+cd(window.currentDate)+` às `+window.currentHour+`:`+window.currentMinutes+`\nReprovado por: `+window.rs_name_usr}
                    id_lja={props?.loja_id}
                    id_usr={props?.id_usr}
                    chamados={props?.chamados}
                    fases={props?.fases}
                    visitas={props?.visitas}
                />
            :'')}
        </>
    )
}