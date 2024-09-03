import { useState, useEffect, useContext} from "react"
import { GlobalContext } from "../../../context/Global";
import { ChecklistContext } from "../../../context/Checklist";
import { cd, cdh, get_date } from '../../../_assets/js/global.js';
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
import Editar from "../../../components/body/card/editar";
import Cadastro from "./Cadastro/index.jsx";
import Item from './Item';

export default function Lista({ icons, filters }) {
  // CONTEXT
  const { handleSetFilterEmpreendimento, filterEmpreendimento, filterModule } =
    useContext(ChecklistContext);

  // CONTEXT
  const { handleSetFilter, filter } = useContext(GlobalContext);

  //ESTADOS DA API
  const [check, setCheck] = useState([]);
  //ESTADOS
  const [hide, setHide] = useState(true);
  const [reload, setReload] = useState(false);
  const [plano, setPlano] = useState(false);
  const [tituloPlano, setTituloPlano] = useState("");
  const [lojaPlano, setLojaPlano] = useState("");
  const [usuarioPlano, setUsuarioPlano] = useState("");

  // OPTIONS FILTROS
  const optionsStatus = [
    { value: -1, label: "Removido" },
    { value: 2, label: "Em Andamento" },
    { value: 1, label: "Finalizado" },
  ];

  //ESTADOS DE BUSCA DO FILTRO
  const [statusValue, setStatusValue] = useState(["1", "2"]);
  const [empreendimentoValue, setEmpreendimentoValue] = useState([]);
  const [sistemaValue, setSistemaValue] = useState("");
  const [checkValue, setCheckValue] = useState("");
  const [respondidoValue, setRespondidoValue] = useState("");
  const [lojaValue, setLojaValue] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [finalDataInicio, setFinalDataInicio] = useState("");
  const [finalDataFim, setFinalDataFim] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterSubCategory, setFilterSubCategory] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState([]);

  // NECESSÁRIO PARA FUNCIONAR O CARREGAMENTO DA LISTA AO ENTRAR NA TELA (PRECISA AJUSTAR)
  useEffect(() => {
    handleSetFilter(true);
  }, []);

  let timeout;

  const handleSetReload = (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => setReload(JSON.stringify(e)), 1000);
  }

  // LISTA ITENS
  const handleSetItems = (e) => {
    setCheck(e);
  };

  // FILTRO STATUS
  const handleStatus = (e) => {
    setStatusValue(e);
    handleSetReload(e)
  };

  // FILTRO EMPREENDIMENTO
  const handleEmpreendimento = (e) => {
    setEmpreendimentoValue(e);
    handleSetReload(e)
  };

  // FILTRO SISTEMA
  const handleSistema = (e) => {
    setSistemaValue(e);
    handleSetReload(e)
  };

  // FILTRO CHECKLIST
  const handleChecklist = (e) => {
    setCheckValue(e);
    handleSetReload(e)
  };

  // REPONDIDO POR
  const handleRespondidoPor = (e) => {
    setRespondidoValue(e);
    handleSetReload(e)
  };

  //FILTRO LOJA
  const handleLoja = (e) => {
    setLojaValue(e);
    handleSetReload(e)
  };
  // FILTRO DE DATA (INÍCIO)
  const handleSetDataInicio = (e) => {
    setDataInicio(e);
    handleSetFilter(true);
    handleSetReload(e)
  };

  // FILTRO DE DATA (FIM)
  const handleSetDataFim = (e) => {
    setDataFim(e);
    handleSetFilter(true);
    handleSetReload(e)
  };

  //FILTRO FINALIZAÇÃO DATA INÍCIO
  const handleSetFinalDataInicio = (e) => {
    setFinalDataInicio(e);
    handleSetFilter(true);
    handleSetReload(e)
  };

  //FILTRO FINALIZAÇÃO DATA FIM
  const handleSetFinalDataFim = (e) => {
    setFinalDataFim(e);
    handleSetFilter(true);
    handleSetReload(e)
  };

  // FILTRO AVALIAÇÃO
  const handleSetAvaliacao = (e) => {
    setAvaliacao(e);
    handleSetFilter(true);
  };

  // FILTRA CATEGORIA
  const handleFilterCategory = (e) => {
    setFilterCategory(e);
    handleSetReload(e)
  };

  // FILTRA SUBCATEGORIA
  const handleFilterSubcategory = (e) => {
    setFilterSubCategory(e);
    handleSetReload(e)
  };

  // FILTRA DEPARTAMENTO
  const handleFilterDepartment = (e) => {
    setFilterDepartment(e);
    handleSetReload(e)
  };

  // CALLBACK CADASTRO
  const handleCadastroCallback = (e) => {
    setReload(e.reload);
  };

  // MONTA THEAD
  const thead = [
    { enabled: true, export: true, label: "Status", id: "status", name: "status", items: optionsStatus, filtered: statusValue, onChange: handleStatus },
    { enabled: window.rs_id_grupo > 0 ? true : false, export: window.rs_id_grupo > 0 ? true: false, label: "Empreendimento", id: "empreendimento", name: "empreendimento", api: {url: window.backend + "/api/v1/utilities/filters/grupo-empreendimento?do=select&component=grupo_empreendimento&ativo[]=1", key_aux: ['data']}, onChange: handleEmpreendimento },
    { enabled: true, export: true, label: "Sistema", id: "sistema", name: "sistema", api: {url: window.backend+ "/api/v1/checklists/filters/sistemas", key_aux: ['data']}, onChange: handleSistema },
    { enabled: true, export: true, label: "Checklist", id: "checklist", name: "checklist", api: {url: window.backend+ "/api/v1/checklists?ativo[]=1", key_aux: ['data']}, onChange: handleChecklist },
    { enabled: true, export: true, label: "Data Início", id: "data", name: "data", start: {value: dataInicio, onChange: handleSetDataInicio}, end: {value: dataFim, onChange: handleSetDataFim} },
    { enabled: true, export: true, label: "Data Finaliz.", id: "data_finalizacao", name: "data_finalizacao", start: {value: finalDataInicio, onChange: handleSetFinalDataInicio}, end: {value: finalDataFim, onChange: handleSetFinalDataFim} },
    { enabled: true, export: true, label: "Respondido por", id: "respondido_por", name: "respondido_por", api: {url: window.backend+ "/api/v1/utilities/filters/usuarios?ativo[]=1&np=true&ns=0&filial=true&sistema_id="+window.rs_sistema_id, key_aux: ['data']}, onChange: handleRespondidoPor },
    { enabled: true, export: true, label: "Loja", id: "loja", name: "loja", api: {url: window.backend+ "/api/v1/utilities/filters/lojas?do=select&component=loja&np=1&sistema_id="+window.rs_sistema_id, key_aux: ['data']}, onChange: handleLoja },
    { enabled: true, export: true, label: "Categoria", id: "categoria", name: "categoria", api: {url: window.host+"/systems/integration-react/api/registry.php?do=get_category&grupo_id=true&empreendimento_id=" + filterEmpreendimento + "&filter_id_module=" + (filterModule == undefined ? "" : filterModule) + "&filter_id_apl_default=0"}, onChange: handleFilterCategory },
    { enabled: true, export: true, label: "Subcategoria", id: "subcategoria", name: "subcategoria", api: {url: window.host +"/systems/integration-react/api/registry.php?do=get_subcategory&grupo_id=true&empreendimento_id=" + filterEmpreendimento + "&filter_id_category" + filterCategory + "&filter_id_apl_default=0"}, onChange: handleFilterSubcategory },
    { enabled: true, export: true, label: "Departamento", id: "departamento", name: "departamento", api: {url: window.backend + '/api/v1/gerenciador-macro/departamentos', key_aux: ['data']}, onChange: handleFilterDepartment },
    { enabled: true, export: true, label: <Icon type="check" title="Itens aprovados" animated className={avaliacao == 1 || avaliacao == "" ? "text-success" : "text-secondary"} />, id: "aprovado", name: "aprovado", onClick: () => handleSetAvaliacao(avaliacao == 1 ? "" : 1) },
    { enabled: true, export: true, label: <Icon type="reprovar2" title="Itens reprovados" animated className={avaliacao == 2 || avaliacao == "" ? "text-danger" : "text-secondary"} />, id: "reprovado", name: "reprovado", onClick: () => handleSetAvaliacao(avaliacao == 2 ? "" : 2) },
    { enabled: true, export: true, label: <Icon type="alert-circle" title="Itens que não se aplicam" animated className={avaliacao == 3 || avaliacao == "" ? "text-warning" : "text-secondary"} />, id: "nao_aplica", name: "nao_aplica", onClick: () => handleSetAvaliacao(avaliacao == 3 ? "" : 3) },
    { enabled: hide ? false : true, export: true, label: "Qtd.", id: "qtd_respondida", name: "qtd_respondida" },
    { enabled: hide ? false : true, export: true, label: "Urgente", id: "classificacao_urgente", name: "classificacao_urgente" },
    { enabled: hide ? false : true, export: true, label: "Médio", id: "classificacao_medio", name: "classificacao_medio" },
    { enabled: hide ? false : true, export: true, label: "Melhoria", id: "classificacao_melhoria", name: "classificacao_melhoria" },
    { enabled: hide ? false : true, export: true, label: "Outro", id: "classificacao_outro", name: "classificacao_outro" },
    { enabled: hide ? false : true, export: true, label: "Pontos", id: "pontos", name: "pontos" },
    { enabled: window.rs_permission_apl > 2 ? true : false, export: false, label: "Ações" }
  ];

  // TITLES EXPORT
  let thead_export = {};
  thead.map((item, i) => {
    if (item?.export !== false) {
      thead_export[item?.name] = item?.label; 
      thead_export['aprovado'] = 'Conforme';
      thead_export['reprovado'] = 'Não conforme';
      thead_export['nao_aplica'] = 'Não se aplica';
    }
  });

  // URL API TABLE
  const url = window.backend + "/api/v1/checklists/relatorios";

  // PARAMS API TABLE
  const params = {
    status: statusValue,
    empreendimentos: empreendimentoValue,
    sistemas: sistemaValue ? sistemaValue : undefined,
    checklists: checkValue ? checkValue : undefined,
    data_inicio_ini: dataInicio ? get_date("date_sql", cd(dataInicio), "date") : "",
    data_inicio_fim: dataFim ? get_date("date_sql", cd(dataFim), "date") : "",
    data_finalizacao_ini: finalDataInicio ? get_date("date_sql", cd(finalDataInicio), "date") : "",
    data_finalizacao_fim: finalDataFim ? get_date("date_sql", cd(finalDataFim), "date") : "",
    respondido_por: respondidoValue ? respondidoValue : undefined,
    avaliacoes: (avaliacao?[avaliacao]:null),
    lojas: lojaValue ? lojaValue : undefined,
    categorias: filterCategory,
    subcategorias: filterSubCategory,
    departamentos: filterDepartment,
  };

  // BODY DO EXPORTADOR
  const body = {
    titles: thead_export,
    url: url,
    name: "Checklist",
    filters: params,
    key: 'data',
    orientation: 'L',
    // custom: [
    //     {
    //         name: '% Lidos',
    //         keys: ['qtd_visualizado', 'qtd_total'],
    //         type: '%'
    //     }
    // ]
  };

  // DEFINE VARIÁVEIS DOS FILTROS E ÍCONES DA NAVBAR
  useEffect(() => {
    if (icons) {
      icons(
        <>
          <Icon type="expandir" expanded={!hide} onClick={() => setHide(!hide)} />
          <Icon type="pdf" api={{ body: body }} />
          <Icon type="excel" api={{ body: body }} />

          <Cadastro callback={handleCadastroCallback} />
        </>
      );
    }

    if (filters) {
      filters(<></>);
    }
  }, [hide, filterCategory, filterSubCategory]);  

  return (
    <Container>
      <Row>
        <Col lg={12}>
          <Table
            id="checklist"
            api={url}
            params={params}
            pages={true}
            key_aux={["data"]}
            thead={thead}
            onLoad={handleSetItems}
          >
            <Tbody>
              {check.length > 0 ? (
                check.map((item, i) => {
                  return <Item key={item.id} item={item} hide={hide} />;
                })
              ) : (
                <></>
              )}
            </Tbody>
          </Table>
        </Col>
      </Row>

      {/* MODAL PLANO DE AÇÃO (COMPONENTE DO JOBS) */}
      {plano ? (
        <Editar
          modalTitle={"Plano de Ação"}
          icon={false}
          show={plano}
          plano={true}
          onClose={(e) =>
            setTimeout(() => {
              setPlano(false);
            }, 500)
          }
          frequency={{
            id: global.frequencia.unico
          }}
          dateStart={cd(new Date())}
          job={tituloPlano}
          category={{ id: global.categoria.plano_de_acao }}
          subcategory={{ id: global.subcategoria.checklist }}
          description={
            `
                        Checklist reprovado: ` +
            tituloPlano +
            `<br />Reprovado em: ` +
            cd(window.currentDate) +
            ` às ` +
            window.currentHour +
            `:` +
            window.currentMinutes +
            `<br />Reprovado por: ` +
            window.rs_name_usr +
            `<br />
                    `
          }
          id_lja={lojaPlano}
          id_usr={usuarioPlano}
        />
      ) : (
        ""
      )}
    </Container>
  );
}