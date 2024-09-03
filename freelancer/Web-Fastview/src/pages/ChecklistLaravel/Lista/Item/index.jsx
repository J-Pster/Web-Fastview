import { Fragment, useContext, useEffect, useState } from "react";

import Modal from "../../../../components/body/modal";
import ModalBody from "../../../../components/body/modal/modalBody";
import ModalHeader from "../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle";
import Table from "../../../../components/body/table";
import Tbody from "../../../../components/body/table/tbody";
import Td from "../../../../components/body/table/tbody/td";
import Tr from "../../../../components/body/table/tr";
import Icon from "../../../../components/body/icon";
import { GlobalContext } from "../../../../context/Global";
import axios from "axios";
import Tippy from "@tippyjs/react";
import Tfoot from "../../../../components/body/table/tfoot";
import { cdh, cd, get_date } from "../../../../_assets/js/global";
import Loader from "../../../../components/body/loader";
import PlanoDeAcao from "../PlanoDeAcao";

export default function Item({item, hide}){
    // GLOBAL CONTEXT
    const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

    // ESTADOS
    const [show, setShow] = useState(false);
    const [viewImages, setViewImages] = useState(false);
    const [respostas, setRespostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState([]);

    var status;
    var color;
    var background;

    if (item.status === 1) {
        status = "Finalizado";
        color = "text-success"
        background = 'primary-dark';
    } else if (item.status === 2) {
        status = "Pendente";
        color = "text-warning";
        background = 'warning';
    } else if (item.status === 3) {
        status = "Em Andamento";
        color = "text-danger";
        background = 'danger';
    }

    var total = Number(item.aprovado) + Number(item.reprovado) + Number(item.nao_aplica);
    var aprovado = Math.round((100 * Number(item.aprovado)) / total);
    var reprovado = Math.round((100 * Number(item.reprovado)) / total);
    var nao_aplica = Math.round((100 * Number(item.nao_aplica)) / total);
    if (isNaN(aprovado)) aprovado = 0;
    if (isNaN(reprovado)) reprovado = 0;
    if (isNaN(nao_aplica)) nao_aplica = 0;

    // AÇÕES AO FECHAR MODAL DE RESPOSTAS
    const handleCloseModal = () => {
        setShow(false);
        setShowMore([]);
    }

    // VARIÁVEIS
    var total_peso = 0;
    var total_pontos = 0;
    var total_porc = 0;

    // CONSTRÓI AS TH'S
    const thead = [
        { enabled: true, label: 'Seção', id: 'secao', name: 'secao', filter: false },
        { enabled: true, label: 'Item', id: 'item', name: 'item', filter: false },
        { enabled: true, label: 'Usuário', id: 'respondido_por', name: 'respondido_por', filter: false },
        { enabled: true, label: 'Resposta', id: 'resposta', name: 'resposta', align: 'center' , filter: false},
        { enabled: true, label: 'Outras Respostas', id: 'outras_respostas', name: 'outras_respostas', filter: false, align: 'center' },
        { enabled: true, label: 'Observação', id: 'observacao', name: 'observacao', filter: false },        
        { enabled: true, label: 'Motivo', id: 'motivo', name: 'motivo', filter: false },
        { enabled: true, label: 'Anexo', id: 'anexo', name: 'anexo', align: 'center', export: false, filter: false },
        { enabled: true, label: 'Qtde.', id: 'quantidade', name: 'quantidade', align: 'center', filter: false },
        { enabled: true, label: 'Peso', id: 'peso', name: 'peso', align: 'center', filter: false },
        { enabled: true, label: 'Pontos', id: 'pontos', name: 'pontos', align: 'center', filter: false },
        { enabled: true, label: '%', id: 'porcentagem', name: 'porcentagem', align: 'center', filter: false },
        { enabled: true, label: 'Ações', id: 'acoes', name: 'acoes', export: false, filter: false, className: 'hide-print' },
    ]

    // TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    });

    // URL API TABLE
    const url = window.backend + '/api/v1/checklists/respostas';

    // PARAMS API TABLE
    const params = {
        relatorio: item.id
    }

    // BODY DO EXPORTADOR
    const body = {
        titles: thead_export,
        url: url,
        name: 'Respostas' + (item?.checklist_nome ? (' - '+item?.checklist_nome) : ''),
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
    function get_respostas(status){
        setShow(true);
        setRespostas([]);
        setLoading(true);

        let param_aux;

        if(status){
            param_aux = {
                ...params,
                resposta_filter: [status]
            }
        }else{
            param_aux = params;
        }

        axios({
            method: 'get',
            url: url,
            params: param_aux
        }).then((response) => {
            if(response?.data?.data){
                setRespostas(response.data.data);
            }
            setLoading(false);
        });        
    }

    // CLIQUE DAS IMAGENS
    const handleLightbox = (img) => {
        handleSetToggler(true);
        handleSetSources([img], 0);
    }

    // AJUSTAR
    const handleShowRespostas = (status) => {
        get_respostas(status);
    }

    // EXIBIR RESPOSTAS PERSONALIZADAS
    const handleShowMore = (id) => {
        if(showMore.includes(id)){
            setShowMore(showMore.filter((elem) => elem?.id == id));
        }else{
            setShowMore(showMore => [...showMore, id]);
        }
    }

    return(
        <>
            {/* MODAL RESPOSTAS */}
            <Modal
                show={show}
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
                        Respostas {(item?.checklist ? (' - '+item?.checklist) : '')}  {(item?.loja ? ( ` (${item.loja})`) : '')} 
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Table
                        fixed={false}
                        text_limit={loading ? false : 30}
                        thead={thead}
                    >
                        <Tbody>
                            {(loading ? 
                                <Tr>
                                    <Td colspan="100%" align="center">
                                        <Loader />
                                    </Td>
                                </Tr>
                            :
                                (respostas.length>0 ?
                                    respostas.map((item,i) => {
                                        var resposta = '';
                                        let porcentagem = 0;

                                        if(item?.items){
                                            let icon_aux = JSON.parse(item?.items)?.filter((elem) => elem?.icone_tipo == item?.resposta)[0]?.icone;
                                            let class_aux = JSON.parse(item?.items)?.filter((elem) => elem?.icone_tipo == item?.resposta)[0]?.icone_classe;
                                            let title_aux = JSON.parse(item?.items)?.filter((elem) => elem?.icone_tipo == item?.resposta)[0]?.icone_nome;

                                            resposta = <Icon type={icon_aux} title={title_aux} className={class_aux} readonly />

                                            if(item.resposta == 1){
                                                porcentagem = 100 / respostas.length;
                                            }else if(item.resposta == 2){
                                                porcentagem = 100 / respostas.length;
                                            }else if(item.resposta == 7){
                                                porcentagem = 100 / respostas.length;
                                            }else if(item.resposta == 1){
                                                porcentagem = 100 / respostas.length;
                                            }
                                        }

                                        total_peso += (item.peso ? Number(item.pontos.toString().replace(',', '.')) : 0);
                                        total_pontos += (item.pontos ? Number(item.pontos.toString().replace(',', '.')) : 0);
                                        total_porc += (porcentagem ? Number(porcentagem.toString().replace(',', '.')) : 0);

                                        return(
                                            <Fragment key={item.id}>
                                                <Tr>
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
                                                    <Td align="center" disableView={false}>
                                                        {(item?.options ?
                                                            <u className="cursor-pointer" onClick={() => handleShowMore(item?.id)}>
                                                                {(showMore?.includes(item?.id) ? 'Ocultar' : 'Visualizar')}
                                                            </u>
                                                        :
                                                            '-'
                                                        )}
                                                    </Td>
                                                    <Td disableView={false}>
                                                        <Tippy content={item.observacao} placement="left">
                                                            <span>
                                                                {(item.observacao??'-')}
                                                            </span>
                                                        </Tippy>
                                                    </Td>
                                                    <Td disableView={false}>
                                                        <Tippy content={item.motivo} placement="left">
                                                            <span>
                                                                {(item.motivo??'-')}
                                                            </span>
                                                        </Tippy>
                                                    </Td>

                                                    <Td align="center" disableView={false}>
                                                        {(item.anexos ?
                                                            (item.anexos.includes('{') ?
                                                                JSON.parse(item.anexos).map((image, i) => {
                                                                    return (
                                                                        (viewImages ?
                                                                            <img
                                                                                src={import.meta.VITE_URL_UPLOAD + '/' + image.id}
                                                                                style={{ width: 90, height: 'auto' }}
                                                                                className={'show_print d-block my-1 cursor-pointer'}
                                                                                onClick={() => handleLightbox(import.meta.VITE_URL_UPLOAD + '/' + image.id)}
                                                                            />
                                                                        :
                                                                            <Icon
                                                                                type="visualizar"
                                                                                title="Visualizar anexo"
                                                                                className="hide_print"
                                                                                onClick={() => handleLightbox(import.meta.VITE_URL_UPLOAD + '/' + image.id)}
                                                                            />
                                                                        )
                                                                    )
                                                                })
                                                            :
                                                            
                                                                item.anexos.map((image, i) => {
                                                                    return (
                                                                        (viewImages ?
                                                                            <img
                                                                                src={import.meta.VITE_URL_UPLOAD + '/' + image.id}
                                                                                style={{ width: 90, height: 'auto' }}
                                                                                className={'show_print d-block my-1 cursor-pointer'}
                                                                                onClick={() => handleLightbox(import.meta.VITE_URL_UPLOAD + '/' + image.id)}
                                                                            />
                                                                        :
                                                                            <Icon
                                                                                type="visualizar"
                                                                                title="Visualizar anexo"
                                                                                className="hide_print"
                                                                                onClick={() => handleLightbox(import.meta.VITE_URL_UPLOAD + '/' + image.id)}
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
                                                        {item?.peso}
                                                    </Td>

                                                    <Td align="center" disableView={false}>
                                                        {item.pontos}
                                                    </Td>

                                                    <Td align="center" disableView={false}>
                                                        {porcentagem ? porcentagem.toFixed(2)+' %' : '-'}
                                                    </Td>

                                                    <Td
                                                        align="center"
                                                        className="hide_print"  
                                                        disableView={false}                                              
                                                    >
                                                        <PlanoDeAcao
                                                            resposta={item.resposta}
                                                            tituloPlano={item.item}
                                                            lojaPlano={item.loja_id}
                                                            tipo={'Item de checklist'}
                                                            callback={() => {handleCloseModal();}}
                                                        />                                                    
                                                    </Td>
                                                </Tr>

                                                {(showMore?.includes(item?.id) &&
                                                    <Tr>
                                                        <Td colspan="100%">
                                                            {(item?.options && item?.items &&
                                                                JSON.parse(item?.options)?.map((option, i) => {
                                                                    let item_aux;
                                                                    let option_aux = '';

                                                                    item_aux = JSON.parse(item?.items)?.filter((elem) => elem?.id == option?.item_id)[0];

                                                                    if(item_aux?.alias === 'Checkbox'){
                                                                        if(item_aux?.options){
                                                                            item_aux?.options?.map((io, i) => {
                                                                                if(option?.value?.includes(io?.id.toString())){
                                                                                    option_aux += (io?.nome)+', ';
                                                                                }
                                                                            });

                                                                            option_aux = option_aux?.slice(0, -2);
                                                                        }
                                                                    }

                                                                    if(item_aux?.alias === 'Select'){
                                                                        if(item_aux?.options){
                                                                            item_aux?.options?.map((io, i) => {
                                                                                if(option?.value == io?.id){
                                                                                    option_aux = io?.nome;
                                                                                }
                                                                            })
                                                                        }
                                                                    }

                                                                    return(
                                                                        <div>
                                                                            <p className="mb-0">
                                                                                <strong>{item_aux?.nome}:</strong> {option_aux?.length > 0 ? option_aux?.toString() : option?.value}
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )}
                                                        </Td>
                                                    </Tr>
                                                )}
                                            </Fragment>
                                        )
                                    })
                                :
                                    <Tr empty={true} colspan="100%" />
                                )
                            )}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Td colspan="8"><b>Total</b></Td>
                                <Td align="center"><b>{(total_peso ? total_peso.toFixed(2) : '0.00')}</b></Td>
                                <Td align="center"><b>{(total_pontos ? total_pontos.toFixed(2) : '0.00')}</b></Td>
                                <Td align="center"><b>{(total_porc ? (total_porc >= 100 ? 100 : total_porc).toFixed(2).replace('.', ',') : 0) + '%'}</b></Td>
                                <Td></Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </ModalBody>
            </Modal>

            <Tr>
                <Td
                    className={color}
                    cursor="pointer"
                    boxed={{
                        background: background
                    }}
                    onClick={() => handleShowRespostas()}
                >
                    {status}
                </Td>

                {(window.rs_id_grupo > 0 ?
                    <Td
                        cursor="pointer"
                        onClick={() => handleShowRespostas()}
                    >
                        {item.empreendimento}
                    </Td>
                    : '')}

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.sistema}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.checklist}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {!item.data ? '' : get_date('datetime', (item.data).slice(0,19).replace('T', ' '), 'datetime_sql')}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {!item.data_finalizacao ? '' : cdh(item.data_finalizacao)}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.respondido_por}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.loja}</Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {(item.categoria??'-')}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {(item.subcategoria??'-')}
                </Td>

                <Td
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {(item?.departamento??'-')}
                </Td>

                <Td
                    cursor="pointer"
                    align="center"
                    onClick={() => handleShowRespostas(1)}
                >
                    {item.aprovado} ({aprovado}%)
                </Td>

                <Td
                    cursor="pointer"
                    align="center"
                    onClick={() => handleShowRespostas(2)}
                >
                    {item.reprovado} ({reprovado}%)
                </Td>

                <Td
                    cursor="pointer"
                    align="center"
                    onClick={() => handleShowRespostas(3)}
                >
                    {item.nao_aplica} ({nao_aplica}%)
                </Td>

                <Td
                    hide={hide}
                    align="center"
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {(item.qtd_respondida ? item.qtd_respondida : '-')}
                </Td>

                <Td
                    hide={hide}
                    align="center"
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.classificacao_urgente}
                </Td>

                <Td
                    hide={hide}
                    align="center"
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.classificacao_medio}
                </Td>

                <Td
                    hide={hide}
                    align="center"
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.classificacao_melhoria}
                </Td>

                <Td
                    hide={hide}
                    align="center"
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.classificacao_outro}
                </Td>

                <Td
                    align="center"
                    cursor="pointer"
                    onClick={() => handleShowRespostas()}
                >
                    {item.pontos}
                </Td>
                {(window.rs_permission_apl > 2 ?
                    <Td align="center">
                        <PlanoDeAcao
                            resposta={(item.reprovado > 0 ? 2 : 1)}
                            tituloPlano={item.checklist}
                            lojaPlano={item.loja_id}
                            tipo={'Checklist'}
                        />
                    </Td>
                    : '')}
            </Tr>
        </>
    )
}
