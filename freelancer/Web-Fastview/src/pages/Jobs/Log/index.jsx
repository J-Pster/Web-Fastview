import { useContext, useEffect, useState } from "react"
import Table from "../../../components/body/table"
import Tbody from "../../../components/body/table/tbody"
import Td from "../../../components/body/table/tbody/td"
import Thead from "../../../components/body/table/thead"
import Th from "../../../components/body/table/thead/th"
import Tr from "../../../components/body/table/tr"
import ModalListaJob from "../Lista/Jobs/modal"
import { GlobalContext } from "../../../context/Global"
import Container from "../../../components/body/container"
import Row from "../../../components/body/row"
import Col from "../../../components/body/col"
import { get_date } from "../../../_assets/js/global"

export default function Log(props) {
    const [items, setItems] = useState([]);
    const [reload, setReload] = useState(false);
    const [filterUsuario, setFilterUsuario] = useState(undefined);
    const [filterSistema, setFilterSistema] = useState(undefined);
    const [filterTitulo, setFilterTitulo] = useState(undefined);
    const [filterMensagem, setFilterMensagem] = useState(undefined);
    const [filterAcao, setFilterAcao] = useState(undefined);
    const [dataInicioStart, setDataInicioStart] = useState(undefined);
    const [dataInicioEnd, setDataInicioEnd] = useState(undefined);
    const [dataFimStart, setDataFimStart] = useState(undefined);
    const [dataFimEnd, setDataFimEnd] = useState(undefined);
    
    useEffect(() => {
        setReload(Math.random());
    }, []);

    
    // MANDA OS FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (props?.icons) {
            props.icons(
                <></>
            );
        }

        if (props?.filters) {
            props.filters(
                <></>
            );
        }
    }, [items]);

    const handleSetItems = (data) => {
        if(data){
            setItems(data);
        }        
    }

    const handleSetFilterUsuario = (value) => {
        setFilterUsuario(value);
        setReload(Math.random());
    }

    const handleSetFilterSistema = (value) => {
        setFilterSistema(value);
        setReload(Math.random());
    }

    const handleSetFilterTitulo = (value) => {
        setFilterTitulo(value);
        setReload(Math.random());
    }

    const handleSetFilterMensagem = (value) => {
        setFilterMensagem(value);
        setReload(Math.random());
    }

    const handleSetDataInicioStart = (value) => {
        setDataInicioStart(value);
        setReload(Math.random());
    }

    const handleSetDataInicioEnd = (value) => {
        setDataInicioEnd(value);
        setReload(Math.random());
    }

    const handleSetFimStart = (value) => {
        setDataFimStart(value);
        setReload(Math.random());
    }

    const handleSetDataFimEnd = (value) => {
        setDataFimEnd(value);
        setReload(Math.random());
    }

    const handleSetFilterAcao = (value) => {
        setFilterAcao(value);
        setReload(Math.random());
    }

    return (
        <Container>
            <Row>
                <Col lg={12}>
                    <Table
                        id="table_log"
                        api={window.host_madnezz + '/systems/integration-react/api/request.php'}
                        params={{
                            db_type: global.db_type,
                            type: 'Job',
                            do: 'getTable',
                            tables: [{
                                table: 'log',
                                filter: {
                                    usuario: filterUsuario,
                                    sistema: filterSistema,
                                    titulo: filterTitulo,
                                    mensagem: filterMensagem,
                                    acao: filterAcao,
                                    inicio_start: (dataInicioStart ? get_date('date_sql', dataInicioStart.toString(), 'new_date') : undefined),
                                    inicio_end: (dataInicioEnd ? get_date('date_sql', dataInicioEnd.toString(), 'new_date') : undefined),
                                    fim_start: (dataFimStart ? get_date('date_sql', dataFimStart.toString(), 'new_date') : undefined),
                                    fim_end: (dataFimEnd ? get_date('date_sql', dataFimEnd.toString(), 'new_date') : undefined)
                                }
                            }]
                        }}
                        reload={reload}
                        onLoad={handleSetItems}
                        loading={false}
                        key_aux={['data','log']}
                    >
                        <Thead>
                            <Tr>
                                <Th
                                    api={window.host + "/api/sql.php?do=select&component=usuario&np=true&filial=true&limit=false"}
                                    onChange={(e) => handleSetFilterUsuario(e)}
                                >
                                    Usuário
                                </Th>
                                <Th
                                    onChange={(e) => handleSetFilterTitulo(e)}
                                    name="titulo"
                                >
                                    Card título
                                </Th>
                                <Th
                                    api={window.host + "/api/sql.php?do=select&component=sistema&np=true&filial=true&limit=false"}
                                    onChange={(e) => handleSetFilterSistema(e)}
                                >
                                    Sistema
                                </Th>
                                <Th
                                    api={{url: window.host + '/systems/integration-react/api/request.php?type=Job', key_aux:['data','logType'], params: { db_type: global.db_type, do: 'getTable', tables: [{ table: 'logType' }]}}}
                                    onChange={(e) => handleSetFilterAcao(e)}
                                >
                                    Ação
                                </Th>
                                <Th
                                    onChange={(e) => handleSetFilterMensagem(e)}
                                    name="mensagem"
                                >
                                    Mensagem
                                </Th>
                                <Th
                                    type="date"
                                    start={{ value: dataInicioStart, onChange: handleSetDataInicioStart }}
                                    end={{ value: dataInicioEnd, onChange: handleSetDataInicioEnd }}
                                    align="center"
                                >
                                    Início
                                </Th>
                                <Th
                                    type="date"
                                    start={{ value: dataFimStart, onChange: handleSetFimStart }}
                                    end={{ value: dataFimEnd, onChange: handleSetDataFimEnd }}
                                    align="center"
                                >
                                    Fim
                                </Th>
                                <Th>
                                    Duração
                                </Th>
                                <Th>
                                    Ações
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {(items.length > 0 ?
                                items.map((item, i) => {
                                    let inicio = (item?.inicio? get_date('datetime', item?.inicio, 'datetime_sql') : undefined);
                                    let fim = (item?.fim? get_date('datetime', item?.fim, 'datetime_sql') : undefined);
                                    let duracao=undefined;
                                    if(inicio && fim){
                                        const date1 = new Date(item?.inicio);
                                        const date2 = new Date(item?.fim);
                                        const differenceInMillis = Math.abs(date1 - date2);
                                        const hours = Math.floor(differenceInMillis / (1000 * 60 * 60));
                                        const minutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));
                                        const seconds = Math.floor((differenceInMillis % (1000 * 60)) / 1000);
                                        duracao = `${hours}h ${minutes}m ${seconds}s`;
                                    }
                                    return(
                                        <Tr
                                            key={'log_'+item.id}
                                        >
                                            <Td
                                                disableView={false}
                                            >
                                                {(item?.usuario ? item?.usuario : '-')}
                                            </Td>
                                            <Td
                                                disableView={false}
                                            >
                                                {(item?.titulo ? item?.titulo : '-')}
                                            </Td>
                                            <Td
                                                disableView={false}
                                            >
                                                {(item?.sistema ? item?.sistema : '-')}
                                            </Td>
                                            <Td
                                                disableView={false}
                                            >
                                                {(item?.acao ? item?.acao : '-')}
                                            </Td>
                                            <Td
                                                disableView={false}
                                                title={item?.Mensagem}
                                            >
                                                {(item?.Mensagem ? item?.Mensagem : '-')}
                                            </Td>
                                            <Td
                                                disableView={false}
                                            >
                                                {inicio ? inicio : '-'}
                                            </Td>
                                            <Td
                                                disableView={false}
                                            >
                                                {fim ? fim : '-'}
                                            </Td>
                                            <Td
                                                disableView={false}
                                            >
                                                {duracao ? duracao : '-'}
                                            </Td>
                                            <Td
                                                width={1}
                                                align="center"
                                                className="hide_print"
                                            >
                                                <ModalListaJob
                                                    id={item?.id_job_status}
                                                    fases={props?.fases}
                                                    chamados={props?.chamados}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })
                            :
                                <></>
                            )}
                        </Tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}