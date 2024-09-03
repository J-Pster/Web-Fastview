import { useContext, useEffect, useState } from "react";
import Col from "../../../components/body/col";
import Row from "../../../components/body/row";
import Table from "../../../components/body/table";
import Tbody from "../../../components/body/table/tbody";
import Td from "../../../components/body/table/tbody/td";
import Thead from "../../../components/body/table/thead";
import Th from "../../../components/body/table/thead/th";
import Tr from "../../../components/body/table/tr";
import { cd, get_date, subDays } from "../../../_assets/js/global";
import Icon from "../../../components/body/icon";
import ModalComunicado from "./modalComunicado";
import { GlobalContext } from "../../../context/Global";
import ModalLidos from "./modalLidos";
import Cadastro from '../../../components/body/card/editar';
import { useParams } from "react-router";
import axios from "axios";
import Button from "../../../components/body/button";
import Alert from "../../../components/body/alert";
import Container from "../../../components/body/container";

export default function Comunicados({ filters, icons, chamados, fases, visitas, integrated }) {
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // PARAMS
    const paramsUrl = useParams();

    // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    //ESTADOS
    const [comunicados, setComunicados] = useState([]);
    const [nome, setNome] = useState('');
    const [lojas, setLojas] = useState(window?.rs_id_lja > 0 ? window?.rs_id_lja : '');
    const [usuarios, setUsuarios] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [permissaoComunicados, setPermissaoComunicados] = useState(false);
    
    //ESTADOS MODAL COMUNICADO   
    const [show, setShow] = useState(false);
    const [idJob, setIdJob] = useState('');
    const [nameJob, setNameJob] = useState('');
    const [txtJob, setTxtJob] = useState('');
    const [fileJob, setFileJob] = useState('');

    //ESTADOS MODAL LIDOS
    const [showLidos, setShowLidos] = useState(false);
    const [idJobLidos, setIdJobLidos] = useState('');
    const [tituloLidos, setTituloLidos] = useState('');
    const [aplLidos, setAplLidos] = useState([]);

    //MODAL
    const handleShow = (id, job, txt, file) => (
        setShow(!show),
        setIdJob(id),
        setNameJob(job),
        setTxtJob(txt),
        setFileJob(file)
    );
    const handleClose = (e) => {
        setShow(e);
    }

    //MODAL %LIDOS%
    const handleShowLidos = (id_job, titulo, apl) => {
        setShowLidos(!showLidos);
        setIdJobLidos(id_job);
        setTituloLidos(titulo);
        setAplLidos(apl);
    }
    const handleCloseLidos = (e) => {
        setShowLidos(e)
    }

    //FILTRA TITULO/Nome
    const handleTitulo = (e) => {
        setNome(e.target.value)
    }

    //FILTRO LOJAS
    const handleLojas = (e) => {
        setLojas(e);
    }

    //FILTRO USUÁRIOS
    const handleUsuarios = (e) => {
        setUsuarios(e);
    }
    
    //FILTRO DESCRIÇÃO
    const handleDescricao = (e) => {
        setDescricao(e.target.value);
    }

    // FILTRO INÍCIO DA DATA
    const handleSetDateStart = (e) => {
        setDateStart(e);
        handleSetFilter(true);
    }
    // FILTRO FIM DA DATA
    const handleSetDateEnd = (e) => {
        setDateEnd(e);
        handleSetFilter(true);
    }

    //LISTA ITENS
    const handleSetItems = (e) => {
        setComunicados(e);
    }

    // ABRE COMUNICADO AUTOMATICAMENTE CASO RECEBA O ID NA URL
    useEffect(() => {
        if(paramsUrl['id']){
            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    db_type: global.db_type,
                    do: 'getReport',
                    type: 'Job',
                    filter_date_start: dateStart ? get_date('date_sql', cd(dateStart)) : undefined,
                    filter_date_end: dateEnd ? get_date('date_sql', cd(dateEnd)) : undefined,
                    filter_title: nome || undefined,
                    filter_id_user: usuarios || undefined,
                    filter_id_job_status: paramsUrl['id'],
                    filter_id_store: lojas || undefined,
                    filter_description: descricao || undefined,
                    id_apl: 229,
                    filter_id_apl: 229,
                    limit: 50
                }                    
            }).then((response) => {
                let response_aux = response?.data?.data[0];
                handleShow(paramsUrl['id'], response_aux?.titulo, response_aux?.descricao, response_aux?.anexo);
            });
        }
    },[]);

    // CALCULAR PORCENTAGEM
    function porcentagem(num, total) {
        let result = (num / total) * 100;
        return `${result}%`
    }

    const thead = [
        { enabled: true, label: "Título", id: "titulo", name: "titulo", onChange: handleTitulo, },
        { enabled: true, label: "Lojas", id: "lojas", name: "lojas", onChange: handleLojas, api: {url: window.host + "/api/sql.php?do=select&component=loja&filial=true"}, export: true },
        { enabled: true, label: "Usuários", id: "usuarios", name: "usuarios", onChange: handleUsuarios, api: {url: window.host + "/api/sql.php?do=select&component=usuario"}, export: true },
        { enabled: true, label: "Descrição", id: "descricao", name: "descricao", onChange: handleDescricao, export: true },
        { enabled: true, label: "Data de envio", name: "data_inicio", type: 'date', start: { value: dateStart, onChange: handleSetDateStart }, end: { value: dateEnd, onChange: handleSetDateEnd } },
        { enabled: true, label: "% Lidos", onChange: {}, name: "qtd_visualizado", filter: false, export: false }, // PASSANDO EXPORT FALSE POIS PRECISA CALCULAR A PORCENTAGEM NA EXPORTAÇÃO
        { enabled: true, label: "Ações", export: false },
    ];

    //TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label;
        }
    });

    // URL API TABLE
    const url = window.host_madnezz + "/systems/integration-react/api/list.php?do=get_list";

    // PARAMS API TABLE
    const params = {
        filter_type: '5',
        filter_description: descricao,
        filter_title: nome,
        filter_id_user: usuarios,
        filter_id_store: lojas,
        id_apl: 229,
        type: 'report',
        limit: 50
    };

    //BODY DO EXPORTADOR
    const body = {
        titles: thead_export,
        url: url,
        name: "Comunicados",
        filters: params,
        key: 'data',
        orientation: 'L',
        custom: [
            {
                name: '% Lidos',
                keys: ['qtd_visualizado', 'qtd_total'],
                type: '%'
            }
        ]
    };

    // DEFINE URL DO BOTÃO BETA
    let url_aux;

    if(global.empreendimentos_sal?.includes(window.rs_id_emp)){
        url_aux = 'https://sal.madnezz.com.br/comunicados.asp';
    }else{
        url_aux = '/systems/comunicado';
    }

    // VERIFICA SE O USUÁRIO TEM PERMISSÃO NO SISTEMA ANTIGO DE COMUNICADOS
    useEffect(() => {
        if(!integrated){
            axios({
                method: 'get',
                url: window.host+'/api/permissoes.php',
                params: {
                    do: 'get_acesso',
                    id_sistema: [global?.sistema?.comunicados_old]
                }
            }).then((response) => {
                if(response?.data){
                    if(parseInt(response?.data.filter((elem) => elem.sistema_id == global?.sistema?.comunicados_old)[0]?.permissao) > 0){
                        setPermissaoComunicados(true);
                    }
                }
            });
        }
    },[]);

    // MANDA FILTROS PARA O COMPONENTE PAI
    useEffect(() => {
        if (filters) {
            filters(<></>);
        }

        if (icons) {
            icons(
                <>            
                     {/* ALERTA AVISANDO SOBRE A VERSÃO BETA */}
                    {(permissaoComunicados ?
                        <Alert url={url_aux} />
                    :'')}

                    <Icon type="pdf" api={{ body: body }} />
                    
                    {window.rs_permission_apl === 'master' || window.rs_permission_apl === 'supervisor' || window.rs_permission_apl == 3 || window.rs_permission_apl == 4 ?
                        <Cadastro
                            empty={true}
                            title="Novo comunicado"
                            modalTitle="Novo Comunicado"
                            // systems={false}
                            frequency={{
                                id: global?.frequencia?.unico,
                                show: false
                            }}
                            actions={false}
                            limitation={false}
                            client={false}
                            comunicados={true}
                            weight={false}
                            optional={false}
                            integration={false}
                            id_system={{
                                id: [{id: '223'}, {id: '229'}],
                                show: false
                            }}
                        />                    
                    : ''}
                    
                </>
            );
        }
    }, [comunicados, permissaoComunicados]);

    return (
        <Container disabled={integrated ? true : false}>
            <Row>
                <ModalComunicado
                    show={show}
                    handleShow={handleShow}
                    onHide={handleClose}
                    id={idJob}
                    job={nameJob}
                    text={txtJob}
                    file={fileJob}
                />
                <ModalLidos
                    show={showLidos}
                    handleShow={handleShowLidos}
                    onHide={handleCloseLidos}
                    id_job={idJobLidos}
                    apl={aplLidos}
                    titulo={tituloLidos}
                />
                <Col>
                    <Table
                        id="comunicados"
                        api={window.host_madnezz+'/systems/integration-react/api/request.php'}
                        params={{
                            db_type: global.db_type,
                            do: 'getReport',
                            type: 'Job',
                            filter_date_start: dateStart ? get_date('date_sql', cd(dateStart)) : undefined,
                            filter_date_end: dateEnd ? get_date('date_sql', cd(dateEnd)) : undefined,
                            filter_title: nome || undefined,
                            filter_id_user: usuarios || undefined,
                            filter_id_store: lojas || undefined,
                            filter_description: descricao || undefined,
                            id_apl: 229,
                            filter_id_apl: 229,
                            limit: 50
                        }}
                        thead={thead}
                        key_aux={['data']}
                        onLoad={handleSetItems}
                    >
                        <Tbody>
                            {(comunicados.length > 0 ?
                                comunicados.map((item) => {
                                    return (
                                        <Tr key={item.id_job}>
                                            <Td>
                                                {item.titulo}
                                            </Td>

                                            <Td title={item?.lojas}>
                                                {(item.lojas ? item.lojas.replaceAll(',', ', ') : '')}
                                            </Td>

                                            <Td title={item?.usuarios}>
                                                {(item.usuarios ? item.usuarios.replaceAll(',', ', ') : '')}
                                            </Td>

                                            <Td>
                                                {(item.descricao ? item.descricao.replace(/(<([^>]+)>)/gi, "") : '')}
                                            </Td>

                                            <Td align="center">
                                                {(item.data_inicio ? get_date('date', item?.data_inicio, 'date_sql') : '-')}
                                            </Td>

                                            <Td onClick={() => handleShowLidos(item.id_job, item.titulo, item.id_apl)} cursor="pointer" align="center">
                                                ({item?.qtd_visualizado}/{item?.qtd_total}) ({parseInt((item?.qtd_visualizado / item?.qtd_total) * 100)}%)
                                            </Td>

                                            <Td align="center" width={1}>
                                                <Icon type="view" onClick={() => handleShow(item.id, item.titulo, item.descricao, item.anexo)} />
                                            </Td>
                                        </Tr>
                                    )
                                })
                            : <></>)}
                        </Tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}