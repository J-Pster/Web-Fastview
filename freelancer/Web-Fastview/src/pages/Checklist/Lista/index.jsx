import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "../../../context/Global";
import { ChecklistContext } from "../../../context/Checklist";
import { cd, cdh } from '../../../_assets/js/global.js';
import Title from '../../../components/body/title';
import Table from '../../../components/body/table';
import Thead from '../../../components/body/table/thead';
import Tbody from '../../../components/body/table/tbody';
import Tr from '../../../components/body/table/tr';
import Th from '../../../components/body/table/thead/th';
import Td from '../../../components/body/table/tbody/td';
import Icon from '../../../components/body/icon';
import Row from '../../../components/body/row';
import Col from '../../../components/body/col';
import Container from '../../../components/body/container';

// MODAIS
import CadastroChecklist from "./cadastro";
import Respostas from "./respostas";
import Editar from "../../../components/body/card/editar";
import Alert from "../../../components/body/alert/index.jsx";

export default function Lista({ icons, filters }) {

    // CONTEXT
    const {
        handleSetFilterEmpreendimento,
        filterEmpreendimento,
        filterModule,
    } = useContext(ChecklistContext);

    // NECESSÁRIO PARA FUNCIONAR O CARREGAMENTO DA LISTA AO ENTRAR NA TELA (PRECISA AJUSTAR)
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    // CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    //ESTADOS DA API
    const [check, setCheck] = useState([])
    //ESTADOS
    const [hide, setHide] = useState(true);
    const [showModalCadastro, setShowModalCadastro] = useState(false);
    const [showModalRespostas, setShowModalRespostas] = useState(false);
    const [reload, setReload] = useState(false);
    const [plano, setPlano] = useState(false);
    const [tituloPlano, setTituloPlano] = useState('');
    const [lojaPlano, setLojaPlano] = useState('');
    const [usuarioPlano, setUsuarioPlano] = useState('');

    // OPTIONS FILTROS
    const optionsStatus = [
        { value: -1, label: "Removido" },
        { value: 2, label: "Em Andamento" },
        { value: 1, label: "Finalizado" }
    ]
    const [relatorioId, setRelatorioId] = useState('');
    const [checklistId, setChecklistId] = useState('');
    const [checklistNome, setChecklistNome] = useState('');
    const [lojaId, setLojaId] = useState('');
    const [checklistStatus, setChecklistStatus] = useState('');
    const [respostaStatus, setRespostaStatus] = useState('');

    //ESTADOS DE BUSCA DO FILTRO
    const [statusValue, setStatusValue] = useState(['1', '2']);
    const [empreendimentoValue, setEmpreendimentoValue] = useState([]);
    const [sistemaValue, setSistemaValue] = useState('');
    const [checkValue, setCheckValue] = useState('');
    const [respondidoValue, setRespondidoValue] = useState('');
    const [lojaValue, setLojaValue] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [finalDataInicio, setFinalDataInicio] = useState('');
    const [finalDataFim, setFinalDataFim] = useState('');
    const [avaliacao, setAvaliacao] = useState('');
    const [filterCategory, setFilterCategory] = useState([]);
    const [filterSubCategory, setFilterSubCategory] = useState([]);

    // LISTA ITENS
    const handleSetItems = (e) => {
        setCheck(e);
    }

    // FILTRO STATUS
    const handleStatus = (e) => {
        setStatusValue(e);
    }

    // FILTRO EMPREENDIMENTO
    const handleEmpreendimento = (e) => {
        setEmpreendimentoValue(e);
    }

    // FILTRO SISTEMA
    const handleSistema = (e) => {
        setSistemaValue(e);
    }

    // FILTRO CHECKLIST
    const handleChecklist = (e) => {
        setCheckValue(e);
    }

    // REPONDIDO POR
    const handleRespondidoPor = (e) => {
        setRespondidoValue(e);
    }

    //FILTRO LOJA
    const handleLoja = (e) => {
        setLojaValue(e);
    }
    // FILTRO DE DATA (INÍCIO)
    const handleSetDataInicio = (e) => {
        setDataInicio(e);
        handleSetFilter(true);
    }

    // FILTRO DE DATA (FIM)
    const handleSetDataFim = (e) => {
        setDataFim(e);
        handleSetFilter(true);
    }

    //FILTRO FINALIZAÇÃO DATA INÍCIO
    const handleSetFinalDataInicio = (e) => {
        setFinalDataInicio(e);
        handleSetFilter(true);
    }

    //FILTRO FINALIZAÇÃO DATA FIM
    const handleSetFinalDataFim = (e) => {
        setFinalDataFim(e);
        handleSetFilter(true);
    }

    // FILTRO AVALIAÇÃO
    const handleSetAvaliacao = (e) => {
        setAvaliacao(e);
        handleSetFilter(true);
    }

    // FILTRA CATEGORIA
    const handleFilterCategory = (e) => {
        setFilterCategory(e);
    }

    // FILTRA SUBCATEGORIA
    const handleFilterSubcategory = (e) => {
        setFilterSubCategory(e);
    }

    // ABRE MODAL
    function handleShowRespostas(relatorio_id, checklist_id, checklist_status, resposta_status, loja_id, checklist_nome) {
        setShowModalRespostas(true);
        setRelatorioId(relatorio_id);
        setChecklistId(checklist_id);
        setChecklistNome(checklist_nome);
        setLojaId(loja_id);
        setChecklistStatus(checklist_status);
        setRespostaStatus(resposta_status);
    }

    // FECHA MODAL CADASTRO
    const handleCloseModalCadastro = (e) => {
        setShowModalCadastro(e);
        setReload(true);
        setTimeout(() => {
            setReload(false);
        }, 500);
    }

    // FECHA MODAL RESPOSTAS
    const handleCloseModalRespostas = (e) => {
        setShowModalRespostas(e);
    }

    // ABRE PLANO DE AÇÃO
    function handelSetPlano(titulo, loja, usuario) {
        setTituloPlano(titulo);
        setLojaPlano(loja);
        setUsuarioPlano(usuario);
        setPlano(true);
    }

    // DEFINE VARIÁVEIS DOS FILTROS E ÍCONES DA NAVBAR
    useEffect(() => {
        if (icons) {
            icons(
                <>
                    <Icon
                        type="expandir"
                        expanded={!hide}
                        onClick={() => { setHide(!hide) }}
                    />

                    <Icon
                        type="new"
                        onClick={() => { setShowModalCadastro(true) }}
                    />
                </>
            )
        }

        if (filters) {
            filters(
                <>                
                </>
            );
        }
    }, [hide, filterCategory, filterSubCategory]);

    return (
        <Container>
            {/* MODAL DE CADASTRO */}
            <CadastroChecklist
                show={showModalCadastro}
                onHide={handleCloseModalCadastro}
            />

            {/* MODAL DE RESPOSTAS */}
            <Respostas
                show={showModalRespostas}
                onHide={handleCloseModalRespostas}
                relatorio_id={relatorioId}
                checklist_id={checklistId}
                checklist_nome={checklistNome}
                loja_id={lojaId}
                checklist_status={checklistStatus}
                resposta_status={respostaStatus}
            />

            <Row>
                <Col lg={12}>
                    <Table
                        id="checklist"
                        api={window.host + "/systems/"+global.sistema_url.checklist+"/api/lista.php?do=get_checklist"}
                        params={{
                            status: statusValue,
                            empreendimento: empreendimentoValue,
                            sistema: sistemaValue,
                            checklist: checkValue,
                            data_inicio: (dataInicio ? cd(dataInicio) : ''),
                            data_fim: (dataFim ? cd(dataFim) : ''),
                            df_data_inicio: (finalDataInicio ? cd(finalDataInicio) : ''),
                            df_data_fim: (finalDataFim ? cd(finalDataFim) : ''),
                            respondido_por: respondidoValue,
                            avaliacao: avaliacao,
                            page: 0,
                            limit: 50,
                            loja: lojaValue,
                            filter_id_categoria: filterCategory,
                            filter_id_subcategoria: filterSubCategory
                        }}
                        onLoad={handleSetItems}
                        reload={reload}
                    >
                        <Thead>
                            <Tr>
                                <Th
                                    name="busca_status"
                                    items={optionsStatus}
                                    filtered={statusValue}
                                    onChange={handleStatus}
                                >
                                    Status
                                </Th>

                                {(window.rs_id_grupo > 0 ?
                                    <Th
                                        id="filter_empreendimento"
                                        name="filter_empreendimento"
                                        api={{
                                            url: window.host + '/api/sql.php?do=select&component=grupo_empreendimento'
                                        }}
                                        onChange={handleEmpreendimento}
                                    >
                                        Empreendimento
                                    </Th>
                                    : '')}

                                <Th
                                    name="busca_sistema"
                                    api={window.host + '/systems/'+global.sistema_url.checklist+'/api/lista.php?do=sistema'}
                                    onChange={handleSistema}
                                >
                                    Sistema
                                </Th>
                                <Th
                                    name="busca_check"
                                    api={{
                                        url: window.host + '/systems/'+global.sistema_url.checklist+'/api/lista.php?do=checklist'
                                    }}
                                    limit={false}
                                    onChange={handleChecklist}
                                >
                                    Checklist
                                </Th>
                                <Th
                                    type="date"
                                    start={{ value: dataInicio, onChange: handleSetDataInicio }}
                                    end={{ value: dataFim, onChange: handleSetDataFim }}
                                >
                                    Data início
                                </Th>

                                <Th
                                    type="date"
                                    start={{ value: finalDataInicio, onChange: handleSetFinalDataInicio }}
                                    end={{ value: finalDataFim, onChange: handleSetFinalDataFim }}
                                >
                                    Data finaliz.
                                </Th>

                                <Th
                                    id="respondido_por"
                                    name="respondido_por"
                                    api={{
                                        url: window.host + '/api/sql.php?do=select&component=usuario&np=true&ns=false&filial=true',
                                    }}
                                    onChange={handleRespondidoPor}
                                >
                                    Respondido por
                                </Th>

                                <Th
                                    name="busca_loja"
                                    api={window.host + '/api/sql.php?do=select&component=loja&np=true&filial=true'}
                                    onChange={handleLoja}
                                >
                                    Loja
                                </Th>

                                <Th
                                    name="filter_category"
                                    api={window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_category&grupo_id=true&empreendimento_id=" + filterEmpreendimento + "&filter_id_module=" + (filterModule == undefined ? '' : filterModule) + "&filter_id_apl_default=0"}
                                    onChange={handleFilterCategory}
                                >
                                    Categoria
                                </Th>

                                <Th
                                    name="filter_subcategory"
                                    api={window.host_madnezz + "/systems/integration-react/api/registry.php?do=get_subcategory&grupo_id=true&empreendimento_id=" + filterEmpreendimento + "&filter_id_category" + filterCategory + "&filter_id_apl_default=0"}
                                    onChange={handleFilterSubcategory}
                                >
                                    Subcategoria
                                </Th>

                                <Th
                                    align="center"
                                    onClick={() => handleSetAvaliacao((avaliacao == 1 ? '' : 1))}
                                >
                                    <Icon
                                        type="check"
                                        title="Itens aprovados"
                                        animated
                                        className={(avaliacao == 1 || avaliacao == '' ? 'text-success' : 'text-secondary')}
                                    />
                                </Th>

                                <Th
                                    align="center"
                                    onClick={() => handleSetAvaliacao((avaliacao == 2 ? '' : 2))}
                                >
                                    <Icon
                                        type="reprovar2"
                                        title="Itens reprovados"
                                        animated
                                        className={(avaliacao == 2 || avaliacao == '' ? 'text-danger' : 'text-secondary')}
                                    />
                                </Th>

                                <Th
                                    align="center"
                                    onClick={() => handleSetAvaliacao((avaliacao == 3 ? '' : 3))}
                                >
                                    <Icon
                                        type="alert-circle"
                                        title="Itens que não se aplicam"
                                        animated
                                        className={(avaliacao == 3 || avaliacao == '' ? 'text-warning' : 'text-secondary')}
                                    />
                                </Th>
                                <Th hide={hide}>Qtd.</Th>
                                <Th hide={hide}>Urgente</Th>
                                <Th hide={hide}>Médio</Th>
                                <Th hide={hide}>Melhoria</Th>
                                <Th hide={hide}>Outro</Th>
                                <Th align="center">Pontos</Th>
                                {(window.rs_permission_apl > 2 ?
                                    <Th align="center">Ações</Th>
                                    : '')}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {(check.length > 0 ?
                                check.map((checklist, i) => {
                                    var status;
                                    var color;
                                    var background;

                                    if (checklist.status === 1) {
                                        status = "Finalizado";
                                        color = "text-success"
                                        background = 'primary-dark';
                                    } else if (checklist.status === 2) {
                                        status = "Pendente";
                                        color = "text-warning";
                                        background = 'warning';
                                    } else if (checklist.status === 3) {
                                        status = "Em Andamento";
                                        color = "text-danger";
                                        background = 'danger';
                                    }

                                    var total = Number(checklist.aprovado) + Number(checklist.reprovado) + Number(checklist.nao_aplica);
                                    var aprovado = Math.round((100 * Number(checklist.aprovado)) / total);
                                    var reprovado = Math.round((100 * Number(checklist.reprovado)) / total);
                                    var nao_aplica = Math.round((100 * Number(checklist.nao_aplica)) / total);
                                    if (isNaN(aprovado)) aprovado = 0;
                                    if (isNaN(reprovado)) reprovado = 0;
                                    if (isNaN(nao_aplica)) nao_aplica = 0;

                                    return (
                                        <Tr
                                            key={checklist.checklists_relatorio_id}
                                        >
                                            <Td
                                                className={color}
                                                cursor="pointer"
                                                boxed={{
                                                    background: background
                                                }}
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {status}
                                            </Td>

                                            {(window.rs_id_grupo > 0 ?
                                                <Td
                                                    cursor="pointer"
                                                    onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                                >
                                                    {checklist.empreendimento}
                                                </Td>
                                                : '')}

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.sistema}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.checklist}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {!checklist.data ? '' : cdh(checklist.data)}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {!checklist.data_finalizacao ? '' : cdh(checklist.data_finalizacao)}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.respondido_por}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.loja}</Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.categoria}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.subcategoria}
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                align="center"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, 1, checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.aprovado} ({aprovado}%)
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                align="center"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, 2, checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.reprovado} ({reprovado}%)
                                            </Td>

                                            <Td
                                                cursor="pointer"
                                                align="center"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, 3, checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.nao_aplica} ({nao_aplica}%)
                                            </Td>

                                            <Td
                                                hide={hide}
                                                align="center"
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {(checklist.quantidade ? checklist.quantidade : '-')}
                                            </Td>

                                            <Td
                                                hide={hide}
                                                align="center"
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.classificacao_urgente}
                                            </Td>

                                            <Td
                                                hide={hide}
                                                align="center"
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.classificacao_medio}
                                            </Td>

                                            <Td
                                                hide={hide}
                                                align="center"
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.classificacao_melhoria}
                                            </Td>

                                            <Td
                                                hide={hide}
                                                align="center"
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.classificacao_outro}
                                            </Td>

                                            <Td
                                                align="center"
                                                cursor="pointer"
                                                onClick={() => handleShowRespostas(checklist.checklists_relatorio_id, checklist.checklist_id, checklist.status, '', checklist.loja_id, checklist.checklist)}
                                            >
                                                {checklist.pontos}
                                            </Td>

                                            {(window.rs_permission_apl > 2 ?
                                                <Td align="center">
                                                    <Icon
                                                        type="user-check"
                                                        animated
                                                        title={(checklist.reprovado > 0 ? 'Criar plano de ação' : 'Plano de ação disponível apenas para checklists com ao menos 1 resposta negativa')}
                                                        disabled={(checklist.reprovado > 0 ? false : true)}
                                                        onClick={() => handelSetPlano(checklist.checklist, checklist.loja_id)}
                                                    />
                                                </Td>
                                                : '')}
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

            {/* MODAL PLANO DE AÇÃO (COMPONENTE DO JOBS) */}
            {(plano ?
                <Editar
                    modalTitle={'Plano de Ação'}
                    icon={false}
                    show={plano}
                    plano={true}
                    onClose={(e) => setTimeout(() => {setPlano(false)},500)}
                    frequency={{
                        id: global.frequencia.unico
                    }}
                    dateStart={cd(new Date())}
                    job={tituloPlano}
                    category={{id: global.categoria.plano_de_acao}}
                    subcategory={{id: global.subcategoria.checklist}}
                    description={`
                        Checklist reprovado: `+tituloPlano+`<br />Reprovado em: `+cd(window.currentDate)+` às `+window.currentHour+`:`+window.currentMinutes+`<br />Reprovado por: `+window.rs_name_usr+`<br />
                    `}
                    id_lja={lojaPlano}
                    id_usr={usuarioPlano}
                />
            : '')}
        </Container>
    );
}