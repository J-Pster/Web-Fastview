import { useContext, useEffect, useState } from "react";
import style from './lista.module.scss';

import Table from "../../../components/body/table";
import Thead from "../../../components/body/table/thead";
import Tr from "../../../components/body/table/tr";
import Th from "../../../components/body/table/thead/th";
import Tbody from "../../../components/body/table/tbody";
import Item from "./Item";
import Col from "../../../components/body/col";
import Row from "../../../components/body/row";
import Icon from "../../../components/body/icon";
import { GlobalContext } from "../../../context/Global";
import { cd, downloadFile, get_date } from "../../../_assets/js/global";
import axios from "axios";
import toast from "react-hot-toast";

export default function Lista({icons, integrated}){
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // ESTADOS FILTROS
    const [filterEmpreendimentos, setFilterEmpreendimentos] = useState([]);
    const [filterLojas, setFilterLojas] = useState([]);
    const [filterLogo, setFilterLogo] = useState([]);
    const [filterEmail, setFilterEmail] = useState('');
    const [filterStatus, setFilterStatus] = useState([]);
    const [format, setFormat] = useState('list');
    const [dataInicio, setDataInicio] = useState();
    const [dataFim, setDataFim] = useState();
    const [reload, setReload] = useState();
    const [loadingDownload, setLoadingDownload] = useState(false);    

    // VARIÁVEIS
    const url = window.host_madnezz+'/systems/integration-react/api/request.php';
    const limit = 50;    

    // ESTADOS
    const [lojas, setLojas] = useState([]);
    const [selected, setSelected] = useState([]);

    // FILTRO EMPREENDIMENTO
    const handleFilterEmpreendimentos = (e) => {
        setFilterEmpreendimentos(e);
    }

    // FILTRO LOJAS
    const handleFilterLojas = (e) => {
        setFilterLojas(e);
    }

    // FILTRO E-MAIL
    const handleFilterEmail = (e) => {
        setFilterEmail(e);
    }

    // FILTRO LOGO
    const handleFilterLogo = (e) => {
        setFilterLogo(e);
    }

    // FILTRO STATUS
    const handleFilterStatus  = (e) => {
        setFilterStatus(e);
    }

    // FILTRO DATA INICIO
    const handleFilterDateStart = (e) => {
        setDataInicio(e);
        handleSetFilter(true);
    }

    // FILTRO DATA FIM
    const handleFilterDateEnd = (e) => {
        setDataFim(e);
        handleSetFilter(true);
    }

    // OPTIONS LOGO
    const optionsLogo = [
        {value: 1, label: 'Cadastrado'},
        {value: 2, label: 'Não cadastrado'}
    ]

    // OPTIONS STATUS
    const optionsStatus = [
        {value: '-1', label: 'Não atualizado'},
        {value: '0', label: 'Avaliar'},
        {value: 1, label: 'Aprovado'},
        {value: 2, label: 'Reprovado'}
    ]

    // GET LIST
    const handleLojas = (e) => {
        setLojas(e);
    }

    // MANDA ÍCONES PRO COMPONENTE PAI
    useEffect(() => {
        if(icons){
            icons(
                <>
                    <Icon
                        type={format === 'list' ? 'th' : 'list'}
                        title={'Trocar visualização para formato de '+(format === 'list' ? 'box' : 'lista')}
                        onClick={() => setFormat(format === 'list' ? 'th' : 'list')}
                    />
                </>
            )
        }
    }, [lojas, format])

    //THEAD
    const thead = [
        { enabled: true, label: selected.length+'/'+limit, export: false},
        { enabled: true, label: "Empreendimento", id: "nome_emp", name: "nome_emp", api: {url: window.host+"/api/sql.php?do=select&component="+(window.rs_id_emp == 26 ? 'empreendimento' : 'grupo_empreendimento')}, onChange: handleFilterEmpreendimentos, export: true },
        { enabled: true, label: "Loja", id: "nome", name: "nome", api:{url: window.host+"/api/sql.php?do=select&component=loja&pl=true", limit: 50 }, onChange: handleFilterLojas , export: true },
        { enabled: true, label: "E-mail", id: "email", name: "email", onChange: handleFilterEmail, export: false },
        { enabled: true, label: "Data", id: "data_atualizacao", name: "data_atualizacao", type: 'date', start: {onChange: handleFilterDateStart, value: dataInicio}, end: {onChange: handleFilterDateEnd, value: dataFim}, export: false },
        { enabled: true, label: "Logo", id: "logo_img", name: "logo_img", onChange: handleFilterLogo, items: optionsLogo, search:false, export: true },
        { enabled: true, label: "Status", id: "status", name: "status", onChange: handleFilterStatus, items: optionsStatus, search:false, export: true },
        { enabled: true, label: "Ações", align:"center", width: 1, align: 'center', export: false, filter: false  }
    ];

    //TITLES EXPORT
    let thead_export = {};
    thead.map((item, i) => {
        if (item?.export !== false) {
            thead_export[item?.name] = item?.label
        }
    });

    const params ={
        type: 'Table',
        do: 'getUpdateTableReport',
        table: 'store',
        id_emp: filterEmpreendimentos,
        id: filterLojas,
        logo: filterLogo,
        email: filterEmail ? filterEmail : undefined,
        status: filterStatus,
        dataInicio: dataInicio ? get_date('date_sql', cd(dataInicio), 'date') : null,
        dataFim: dataFim ? get_date('date_sql', cd(dataFim),'date') : null,
        limit: 50
    }

    const body = {
        titles: thead_export,
        url: url,
        name: "Documentos",
        filters: params,
        orientation: "P"
    }

    // MANDA ÍCONES PRO COMPONENTE PAI
    useEffect(() => {
        if(icons){
            icons(
                <>
                    <Icon
                        type={format === 'list' ? 'th' : 'list'}
                        title={'Trocar visualização para formato de '+(format === 'list' ? 'box' : 'lista')}
                        onClick={() => setFormat(format === 'list' ? 'th' : 'list')}
                    />

                    <Icon
                        type="download"
                        title={selected.length == 0 ? 'Selecione antes as lojas que deseja baixar o logo' : 'Baixar logos'}
                        loading={loadingDownload}
                        disabled={selected.length == 0 ? true : false}
                        onClick={handleDownloadLogos}
                    />
                </>
            )
        }
    }, [lojas, format, loadingDownload, selected]);

    // DOWNLOAD DE LOGOS EM LOTE
    const handleDownloadLogos = () => {
        let params_aux = params;
        params_aux.logo = ['1']; // CRAVA O 1 PARA TRAZER SOMENTE LOJAS COM LOGO CADASTRADO
        params_aux.id = selected;

        if(window.confirm('O download em lote está limitado a '+limit+' imagens, caso seja necessário faça um filtro mais específico antes de exportar.')){
            setLoadingDownload(true);

            axios({
                method: 'get',
                url: url,
                params: params_aux
            }).then((response) => {
                let ids_aux = [];
                let validate = true;
                
                if(response?.data){                    
                    response?.data.map((item, i) => {
                        ids_aux.push(item?.logo);
                    });

                    if(selected.length > response?.data.length){
                        validate = false;

                        if(window.confirm('Foram selecionadas algumas lojas que não possuem logo cadastradas, essas não serão baixadas')){
                            validate = true;
                        }
                    }
                    
                    if(validate){
                        downloadFile(ids_aux.length > 1 ? ids_aux : ids_aux.toString(), 'Lojas - Logos');
                    }
                }

                if(ids_aux.length > 30){
                    setTimeout(() => {
                        setLoadingDownload(false);
                    },2000);
                }else{
                    setLoadingDownload(false);
                }
            }).catch(() => {
                toast('Erro ao exportar imagens');
                setLoadingDownload(false);
            });
        }
    }

    // CALLBACK DO ITEM
    const handleCallback = (e) => {
        if(e?.reload){
            setReload(Math.random(0,99999));
        }

        if(e?.select){
            let selected_aux = selected.filter((elem) => elem != e.select);
            selected_aux.push(parseInt(e.select));
            setSelected(selected_aux);
        }else{
            let selected_aux = selected.filter((elem) => elem != e.deselect);
            setSelected(selected_aux);
        }
    }

    return(
        <Row>
            <Col lg={(integrated ? 12 : 'auto')}>
                <Table
                    api={url}
                    params={params}
                    className={style.table}
                    thead={thead}
                    onLoad={handleLojas}
                    text_limit={false}
                    reload={reload}
                >
                    {(!integrated ?
                        <></>
                    :
                        <></>
                    )}
                    <Tbody>
                        {(lojas.length > 0 ?
                            lojas.map((loja) => {
                                return(
                                    <Item
                                        key={'loja_'+loja.id}
                                        format={format}
                                        loja={loja}
                                        selected={selected}
                                        limit={limit}
                                        callback={handleCallback}
                                    />
                                )
                            })
                        :
                            <></>
                        )}
                    </Tbody>
                </Table>
            </Col>
        </Row>
    )
}
