import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../../context/Global";
import { get_date } from '../../../_assets/js/global.js';
import axios from "axios";

import Row from "../../../components/body/row";
import Col from "../../../components/body/col";
import Dashboard from "../../../components/body/dashboard";
import Tr from '../../../components/body/table/tr';
import Th from '../../../components/body/table/thead/th';
import Td from '../../../components/body/table/tbody/td';
import SelectReact from "../../../components/body/select";
import Icon from "../../../components/body/icon";
import { cd } from "../../../_assets/js/global.js";
import Input from "../../../components/body/form/input/index.jsx";
import Chart from "../../../components/body/chart/index.jsx";
import toast from "react-hot-toast";
import { orderBy, sortBy } from "lodash";
import Container from "../../../components/body/container/index.jsx";
import { format } from "date-fns";
export default function DashboardPage(props) {
  // CONTEXT
  const { loadingCalendar, handleSetFirstLoad, handleSetFixFilterModule, handleSetFilter, handleSetFilterModule, filterModule } = useContext(GlobalContext);

  // ESTADOS
  //const [switcher, setSwitcher] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date());
  const [monthSelected, setMonthSelected] = useState(window.currentMonth);
  const [yearSelected, setYearSelected] = useState(window.currentYear);
  //CONTRATO
  const [contratoActive, setContratoActive] = useState('');
  const [produtoActive, setProdutoActive] = useState('');
  const [lojaActive, setLojaActive] = useState('');
  const [supervisorActive, setSupervisorActive] = useState('');
  const [optionsModule, setOptionsModule] = useState([]);
  
  //GRAFICO CONTRATOS FEITOS
  //GRAFICO CONTRATOS APROVADOS REPROVADOS
  const [trades, setTrades] = useState();
  //GRAFICO LOJAS COM CONTRATOS VIGENTES
  const [lojasVigentes, setLojasVigentes] = useState();
  const [loading, setLoading] = useState(true);

  // HABILITA O LOADING DOS CARDS PARA QUANDO VOLTAR PRA TELA DO CALENDÁRIO
  useEffect(() => {
    handleSetFilter(true);
    loadingCalendar(true);
    handleSetFixFilterModule(false);
    handleSetFirstLoad(true);
  }, []);

  // GET RESULTADOS DE ACORDO COM O STATE
  const handleSetDash = (setState) => (e) => {
    if (e.length > 0) {
      setState(e);
    } else {
      setState(
        <Tr empty={true}></Tr>
      )
    }
  }

  //FILTRO DE DATA
  const handleMes = (e) => {
    setFilterMonth(e);
    setMonthSelected(new Date(e).getMonth() + 1);
    setYearSelected(new Date(e).getFullYear());
  }









  //DATA MÊS ATUAL/SELECIONADO + MÊS ANTERIOR + MÊS ANTERIOR AO ANTERIOR
  let data_aux0
  let data_aux0_final
  let data_aux1
  let data_aux1_final
  let data_aux2
  let data_aux2_final
  if (monthSelected) {
    data_aux0 = (get_date('date_sql', (cd(new Date(yearSelected, monthSelected - 1, 1)))));
    data_aux0_final = (get_date('date_sql', (cd(new Date(yearSelected, monthSelected - 1, 28)))));
    data_aux1 = (get_date('date_sql', (cd(new Date(yearSelected, monthSelected - 1, 1))), 'date_sub_month', 1));
    data_aux1_final = (get_date('date_sql', (cd(new Date(yearSelected, monthSelected - 1, 28))), 'date_sub_month', 1));
    data_aux2 = (get_date('date_sql', (cd(new Date(yearSelected, monthSelected - 1, 1))), 'date_sub_month', 2));
    data_aux2_final = (get_date('date_sql', (cd(new Date(yearSelected, monthSelected - 1, 28))), 'date_sub_month', 2));
  }









  ///PEGAR AS INFORMAÇÕES DOS GRÁFICOS
  function get_chart() {
    axios({
      method: 'get',
      url: `${window.backend}/api/v1/trades/dashboard/relatorios/graficos`,
      params: {
        data_inicio: data_aux0,
        data_fim: data_aux0_final,
        industrias: null,
        contratos: null,
        produtos: null,
      },
      headers: {
        'Authorization': 'Bearer ' + window.token
      }
    }).then(({ data }) => {
      setTrades(data.trades);
      setLojasVigentes(data.industrias);
      setLoading(false)
    })
  }

  useEffect(() => {
    get_chart();
  }, [filterMonth]);

  useEffect(() => {
    if (props.icons) {
      props.icons(<></>)
    }
    if (props.filters) {
      props.filters(
        <>
          <Input
            type="date"
            format="mm/yyyy"
            name="filter_date"
            required={false}
            value={filterMonth}
            onChange={(e) => [handleMes(e)]}
          />
          {(props.chamados || props.fases) &&
            window.rs_sistema_id != 238 ? ( // SE FOR CHAMADOS, E NÃO ESTIVER NO SISTEMA "CHAMADOS EMPRESA REACT" MOSTRA O FILTRO DE MÓDULO
            <SelectReact
              options={optionsModule}
              placeholder="Nível"
              name="filter_module"
              value={filterModule}
              onChange={(e) => handleSetFilterModule(e.value)}
            />
          ) : (
            ""
          )}

          {/* <SelectReact
                        placeholder="Mês"
                        options={optionsMonths}
                        value={monthSelected}
                        onChange={(e) => setMonthSelected(e.value)}
                    /> */}

          {/* <SelectReact
                        placeholder="Ano"
                        options={optionsYear}
                        value={yearSelected}
                        onChange={(e) => setYearSelected(e.value)}
                    />  */}
        </>
      );
    }
  }, [monthSelected, yearSelected, filterMonth]);

  return (
    <>
      <Container>
        <Row wrap={window.isMobile ? true : false} className="p-4">
          <Col lg={3}>
            <Chart
              enabled={true}
              title="Execução dos contratos"
              type="PieChart"
              headers={["Titulo", "Valor"]}
              body={{
                type: "custom",
                content: [
                  ["Concluído", trades?.concluidos * 1],
                  ["Concluído com Atraso", trades?.concluidos_com_atraso * 1],
                  ["Atrasado", trades?.atrasados * 1],
                  ["Em andamento", trades?.em_andamento * 1],
                ],
              }}              
              // colors={["#204498", "#ecc242", "#df4a43"]}
              loading={loading}
            />
          </Col>
          <Col lg={3}>
            <Chart
              enabled={true}
              title="Validaçãos de Contratos"
              type="PieChart"
              headers={["Titulo", "Valor"]}
              body={{
                type: "custom",
                content: [
                  ["Aprovados", trades?.aprovados * 1],
                  ["Reprovados", trades?.reprovados * 1],
                  ["Em Execução", trades?.em_execucao * 1],
                  ["Em Avaliação", trades?.em_avaliacao * 1]
                ],
              }}
              // colors={["#204498", "#df4a43"]}
              loading={loading}
            />
          </Col>

          <Col lg={5}>
            <Chart
              enabled={true}
              title="Quantidade de contratos vigentes"
              type="ComboChart"
              headers={["Título", ""]}
              body={{
                type: "custom",
                content:
                  lojasVigentes?.length > 0
                    ? lojasVigentes?.map((item) => [
                      item.nome,
                      item.vigentes * 1,
                    ])
                    : [],
              }}
              colors={["#4294d2"]}
              height={window.isMobile ? 400 : 450}
              loading={loading}
              legend={{ position: "none" }}
              chartArea={{
                width: '85%',
                height: '45%',
                top: '12%',
                left: '10%'
              }}
            />
          </Col>
        </Row>
        <Row wrap={window.isMobile ? true : false} className="px-4">
          <ContratosCol
            monthSelected={monthSelected}
            yearSelected={yearSelected}
            handleSetDash={handleSetDash}
            contratoActive={contratoActive}
            setProdutoActive={setProdutoActive}
            setContratoActive={setContratoActive}
            data_aux0={data_aux0}
            data_aux0_final={data_aux0_final}
            data_aux1={data_aux1}
            data_aux1_final={data_aux1_final}
            data_aux2={data_aux2}
            data_aux2_final={data_aux2_final}
          />
          <ProdutosCol
            monthSelected={monthSelected}
            yearSelected={yearSelected}
            handleSetDash={handleSetDash}
            contratoActive={contratoActive}
            setProdutoActive={setProdutoActive}
            setContratoActive={setContratoActive}
            produtoActive={produtoActive}
            data_aux0={data_aux0}
            data_aux0_final={data_aux0_final}
            data_aux1={data_aux1}
            data_aux1_final={data_aux1_final}
            data_aux2={data_aux2}
            data_aux2_final={data_aux2_final}
          />
          <SupervisorCol
            monthSelected={monthSelected}
            yearSelected={yearSelected}
            handleSetDash={handleSetDash}
            contratoActive={contratoActive}
            setProdutoActive={setProdutoActive}
            setContratoActive={setContratoActive}
            data_aux0={data_aux0}
            data_aux0_final={data_aux0_final}
            data_aux1={data_aux1}
            data_aux1_final={data_aux1_final}
            data_aux2={data_aux2}
            data_aux2_final={data_aux2_final}
          />
          <LojasCol
            monthSelected={monthSelected}
            yearSelected={yearSelected}
            handleSetDash={handleSetDash}
            contratoActive={contratoActive}
            produtoActive={produtoActive}
            setProdutoActive={setProdutoActive}
            setContratoActive={setContratoActive}
            data_aux0={data_aux0}
            data_aux0_final={data_aux0_final}
            data_aux1={data_aux1}
            data_aux1_final={data_aux1_final}
            data_aux2={data_aux2}
            data_aux2_final={data_aux2_final}
          />
        </Row>
      </Container>
    </>
  );
}

/**
 * CONTRATOS COL --------------------------------------------------------------------------------------------
 * @returns {import(React.FC)}
 */
const ContratosCol = ({ monthSelected, yearSelected, data_aux0_final, data_aux0, contratoActive, setContratoActive, setProdutoActive, handleSetDash, data_aux1, data_aux1_final, data_aux2, data_aux2_final }) => {
  const [dashContrato1, setDashContrato1] = useState([]);
  const [dashContrato2, setDashContrato2] = useState([]);
  const [dashContrato3, setDashContrato3] = useState([]);
  const [orderContrato, setOrderContrato] = useState([{ column: 'contrato', type: 'desc' }]);
  const [orderContrato1, setOrderContrato1] = useState(true);
  const [orderContrato2, setOrderContrato2] = useState(false);
  const [orderContrato3, setOrderContrato3] = useState(false);
  const [orderContrato4, setOrderContrato4] = useState(false);

  // ORDENAÇÃO CONTRATO
  function handleOrderContrato(order_1, order_2, order_3, order_4) {
    let order_aux = [];

    if (order_1) {
      order_aux.push({ column: "contrato", type: order_1 });
      setOrderContrato1(true);
      setOrderContrato2(false);
      setOrderContrato3(false);
      setOrderContrato4(false);

      // const shallow = dashContrato1;
      //   setDashContrato1(orderBy(shallow, (a,b) => a.numero_contrato - b.numero_contrato ))
    }

    if (order_2) {
      order_aux.push({ column: "industria", type: order_2 });
      setOrderContrato1(false);
      setOrderContrato2(true);
      setOrderContrato3(false);
      setOrderContrato4(false);
    }

    if (order_3) {
      order_aux.push({ column: "produto", type: order_3 });
      setOrderContrato1(false);
      setOrderContrato2(false);
      setOrderContrato3(true);
      setOrderContrato4(false);
    }

    if (order_4) {
      order_aux.push({ column: "loja", type: order_4 });
      setOrderContrato1(false);
      setOrderContrato2(false);
      setOrderContrato3(false);
      setOrderContrato4(true);
    }

    setOrderContrato(order_aux);
  }


  //EXPORTADOR DE CONTRATOS
  const url_contrato = `${window.backend}/api/v1/trades/dashboard/contratos`

  const params_contrato = {
    data_inicio: data_aux0,
    data_fim: data_aux0_final,
    reload: (monthSelected)
  }

  const thead_contratos = {
    numero_contrato: 'Contrato',
    industria: 'Indústria',
    qtd_produto: 'Produto',
    qtd_loja: 'Loja'
  };

  const body_contratos = {
    titles: thead_contratos,
    url: url_contrato,
    name: 'Dashboard - Contratos',
    filters: params_contrato,
    orientation: 'L',
    and: false
  }

  return (
    <Col>
      <Dashboard
        hidden_expand={true}
        thead={
          <Tr>
            <Th
              title="Contrato - Indústria"
              cursor="pointer"
              active={orderContrato1}
              onClick={() =>
                handleOrderContrato(
                  orderContrato[0]?.type === "desc" ? "asc" : "desc",
                  undefined,
                  undefined,
                  undefined
                )
              }
            >
              Contrato (Indústr.)
              {/* {orderContrato1 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderContrato[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderContrato1 ? "text-primary" : ""}
                />
              ) : (
                ""
              )} */}
            </Th>
            {/* <Th
              title="Indústria"
              cursor="pointer"
              active={orderContrato2}
              onClick={() =>
                handleOrderContrato(
                  undefined,
                  orderContrato[0]?.type === "desc" ? "asc" : "desc",
                  undefined,
                  undefined
                )
              }
            >
              Indústr.
              {orderContrato2 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderContrato[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderContrato2 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th> */}
            <Th
              align="center"
              cursor="pointer"
              active={orderContrato3}
              onClick={() =>
                handleOrderContrato(
                  undefined,
                  undefined,
                  orderContrato[0]?.type === "desc" ? "asc" : "desc",
                  undefined
                )
              }
            >
              Produto
              {orderContrato3 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderContrato[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderContrato3 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderContrato4}
              onClick={() =>
                handleOrderContrato(
                  undefined,
                  undefined,
                  undefined,
                  orderContrato[0]?.type === "desc" ? "asc" : "desc"
                )
              }
            >
              Loja
              {orderContrato4 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderContrato[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderContrato4 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th title="Porcentagem Execução">% Exec.</Th>
            <Th title="Porcentagem Aprovação">% Aprov.</Th>
          </Tr>
        }
        cols={{
          col_1: {
            title:
              "Contrato - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  0
                )
              ),
            api: {
              url: url_contrato,
              params: {
                data_inicio: data_aux0,
                data_fim: data_aux0_final,
                reload: monthSelected,
              },
              key_aux: ["data"],
              headers: { "Access-Control-Allow-Origin": "*" },
            },
            tbody:
              dashContrato1.length > 0 ? (
                dashContrato1.map((item) => {
                  return (
                    <Tr
                      key={item.id}
                      active={contratoActive === item.id ? true : false}
                      onClick={() => (
                        setContratoActive(
                          contratoActive === item.id ? "" : item.id
                        ),
                        setProdutoActive("")
                      )}
                      cursor="pointer"
                    >
                      <Td title={`${item.numero_contrato} (${item?.industria}) `} >{item.numero_contrato} <span>({item?.industria})</span></Td>
                      {/* <Td>{item?.industria}</Td> */}
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{item.qtd_loja}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashContrato1),
          },
          col_2: {
            title:
              "Contrato -  " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  1
                )
              ),
            api: {
              url: url_contrato,
              params: {
                data_inicio: data_aux1,
                data_fim: data_aux1_final,
                reload: monthSelected,
              },
              key_aux: ["data"],
            },
            tbody:
              dashContrato2.length > 0 ? (
                dashContrato2.map((item) => {
                  return (
                    <Tr
                      key={item.id}
                      active={contratoActive == item.id ? true : false}
                      onClick={() => (
                        setContratoActive(
                          contratoActive === item.id ? "" : item.id
                        ),
                        setProdutoActive("")
                      )}
                      cursor="pointer"
                    >
                      <Td title={`${item.numero_contrato} (${item?.industria}) `} >{item.numero_contrato} <span>({item?.industria})</span></Td>
                      {/* <Td>{item?.industria}</Td> */}
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{item.qtd_loja}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashContrato2),
          },
          col_3: {
            title:
              "Contrato -  " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  2
                )
              ),
            api: {
              url: url_contrato,
              params: {
                data_inicio: data_aux2,
                data_fim: data_aux2_final,
                reload: monthSelected,
              },
              key_aux: ["data"],
            },
            tbody:
              dashContrato3.length > 0 ? (
                dashContrato3.map((item) => {
                  return (
                    <Tr
                      key={item.id}
                      active={contratoActive == item.id ? true : false}
                      onClick={() => (
                        setContratoActive(
                          contratoActive === item.id ? "" : item.id
                        ),
                        setProdutoActive("")
                      )}
                      cursor="pointer"
                    >
                      <Td title={`${item.numero_contrato} (${item?.industria}) `} >{item.numero_contrato} <span>({item?.industria})</span></Td>
                      {/* <Td>{item?.industria}</Td> */}
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{item.qtd_loja}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashContrato3),
          },
        }}
        excel={{
          params_excel: params_contrato,
          body_excel: body_contratos,
        }}
      ></Dashboard>
    </Col>
  );
}



/**
 * PRODUTOS COL ---------------------------------------------------------------------------------------------------
 * @returns 
 */
const ProdutosCol = ({
  monthSelected,
  yearSelected,
  data_aux0_final,
  data_aux0,
  contratoActive,
  setContratoActive,
  setProdutoActive,
  handleSetDash,
  data_aux1,
  data_aux1_final,
  data_aux2,
  data_aux2_final,
  produtoActive,
}) => {
  //PRODUTO
  const [dashProduto1, setDashProduto1] = useState([]);
  const [dashProduto2, setDashProduto2] = useState([]);
  const [dashProduto3, setDashProduto3] = useState([]);
  const [orderProduto, setOrderProduto] = useState({
    column: "produto",
    type: "desc",
  });
  const [orderProduto1, setOrderProduto1] = useState(true);
  const [orderProduto2, setOrderProduto2] = useState(false);
  const [orderProduto3, setOrderProduto3] = useState(false);

  // ORDENAÇÃO PRODUTO
  function handleOrderProduto(order_1, order_2, order_3) {
    let order_aux = [];

    if (order_1) {
      order_aux.push({ column: "produto", type: order_1 });
      setOrderProduto1(true);
      setOrderProduto2(false);
      setOrderProduto3(false);
    }

    if (order_2) {
      order_aux.push({ column: "contrato", type: order_2 });
      setOrderProduto1(false);
      setOrderProduto2(true);
      setOrderProduto3(false);
    }

    if (order_3) {
      order_aux.push({ column: "loja", type: order_3 });
      setOrderProduto1(false);
      setOrderProduto2(false);
      setOrderProduto3(true);
    }

    setOrderProduto(order_aux);
  }

  //EXPORTADOR DE PRODUTOS
  const url_produto = `${window.backend}/api/v1/trades/dashboard/produtos`;

  const params_produto = {
    contratos: contratoActive ? [contratoActive] : null,
    data_inicio: data_aux0,
    data_fim: data_aux0_final,
    reload: monthSelected + contratoActive,
  };

  const thead_produtos = {
    produto: "Produto",
    qtd_contrato: "Contrato",
    qtd_loja: "Loja",
  };

  const body_produtos = {
    titles: thead_produtos,
    url: url_produto,
    name: "Dashboard - Produtos",
    filters: params_produto,
    orientation: "L",
    and: false,
  };

  return (
    <Col>
      <Dashboard
        hidden_expand={true}
        thead={
          <Tr>
            <Th
              cursor="pointer"
              active={orderProduto1}
              onClick={() =>
                handleOrderProduto(
                  orderProduto[0]?.type === "desc" ? "asc" : "desc",
                  undefined,
                  undefined,
                  undefined
                )
              }
            >
              Produto
              {/* {orderProduto1 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderProduto[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderProduto1 ? "text-primary" : ""}
                />
              ) : (
                ""
              )} */}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderProduto2}
              onClick={() =>
                handleOrderProduto(
                  undefined,
                  orderProduto[0]?.type === "desc" ? "asc" : "desc",
                  undefined
                )
              }
            >
              Contrato
              {orderProduto2 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderProduto[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderProduto2 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderProduto3}
              onClick={() =>
                handleOrderProduto(
                  undefined,
                  undefined,
                  orderProduto[0]?.type === "desc" ? "asc" : "desc"
                )
              }
            >
              Loja
              {orderProduto3 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderProduto[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderProduto3 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th title="Porcentagem Execução">% Exec.</Th>
            <Th title="Porcentagem Aprovação">% Aprov.</Th>
          </Tr>
        }
        cols={{
          col_1: {
            title:
              "Produto - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  0
                )
              ),
            api: {
              url: url_produto,
              params: {
                data_inicio: data_aux0,
                data_fim: data_aux0_final,
                contratos: contratoActive ? [contratoActive] : null,
                reload: monthSelected + yearSelected + contratoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashProduto1.length > 0 ? (
                orderBy(dashProduto1, "nome", orderProduto.type).map((item) => {
                  return (
                    <Tr
                      key={item.id}
                      active={produtoActive == item.id ? true : false}
                      onClick={() =>
                        setProdutoActive(
                          produtoActive == item.id ? "" : item.id
                        )
                      }
                      cursor="pointer"
                    >
                      <Td>{item.produto}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_loja}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashProduto1),
          },
          col_2: {
            title:
              "Produto - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  1
                )
              ),
            api: {
              url: url_produto,
              params: {
                data_inicio: data_aux1,
                data_fim: data_aux1_final,
                contratos: contratoActive ? [contratoActive] : null,
                reload: monthSelected + contratoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashProduto2.length > 0 ? (
                dashProduto2.map((item) => {
                  return (
                    <Tr
                      key={item.id}
                      active={produtoActive == item.id ? true : false}
                      onClick={() =>
                        setContratoActive(
                          produtoActive == item.id ? "" : item.id
                        )
                      }
                      cursor="pointer"
                    >
                      <Td>{item.produto}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_loja}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashProduto2),
          },
          col_3: {
            title:
              "Produto - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  2
                )
              ),
            api: {
              url: url_produto,
              params: {
                data_inicio: data_aux2,
                data_fim: data_aux2_final,
                contratos: contratoActive ? [contratoActive] : null,
                reload: monthSelected + yearSelected + contratoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashProduto3.length > 0 ? (
                dashProduto3.map((item) => {
                  return (
                    <Tr
                      key={item.id}
                      active={produtoActive == item.id ? true : false}
                      onClick={() =>
                        setContratoActive(
                          produtoActive == item.id ? "" : item.id
                        )
                      }
                      cursor="pointer"
                    >
                      <Td>{item.produto}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_loja}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashProduto3),
          },
        }}
        excel={{
          params_excel: params_produto,
          body_excel: body_produtos,
        }}
      ></Dashboard>
    </Col>
  );
};


/**
 * LOJAS COL ---------------------------------------------------------------------------------------------
 * @returns 
 */
const LojasCol = ({
  monthSelected,
  yearSelected,
  data_aux0_final,
  data_aux0,
  contratoActive,
  produtoActive,
  handleSetDash,
  data_aux1,
  data_aux1_final,
  data_aux2,
  data_aux2_final,
}) => {
  //LOJA
  const [dashLoja1, setDashLoja1] = useState([]);
  const [dashLoja2, setDashLoja2] = useState([]);
  const [dashLoja3, setDashLoja3] = useState([]);
  const [orderLoja, setOrderLoja] = useState({ column: "loja", type: "desc" });
  const [orderLoja1, setOrderLoja1] = useState(true);
  const [orderLoja2, setOrderLoja2] = useState(false);
  const [orderLoja3, setOrderLoja3] = useState(false);

  // ORDENAÇÃO LOJA
  function handleOrderLoja(order_1, order_2, order_3) {
    let order_aux = [];

    if (order_1) {
      order_aux.push({ column: "loja", type: order_1 });
      setOrderLoja1(true);
      setOrderLoja2(false);
      setOrderLoja3(false);
    }

    if (order_2) {
      order_aux.push({ column: "contrato", type: order_2 });
      setOrderLoja1(false);
      setOrderLoja2(true);
      setOrderLoja3(false);
    }

    if (order_3) {
      order_aux.push({ column: "produto", type: order_3 });
      setOrderLoja1(false);
      setOrderLoja2(false);
      setOrderLoja3(true);
    }

    setOrderLoja(order_aux);
  }

  //EXPORTADOR DE FILIAIS
  const url_filial = `${window.backend}/api/v1/trades/dashboard/filial`;

  const params_filial = {
    contratos: contratoActive ? [contratoActive] : null,
    produtos: produtoActive ? [produtoActive] : null,
    data_inicio: data_aux0,
    data_fim: data_aux0_final,
    reload: monthSelected + contratoActive,
  };

  const thead_filiais = {
    loja: "Filial",
    qtd_contrato: "Contrato",
    qtd_produto: "Loja",
  };

  const body_filiais = {
    titles: thead_filiais,
    url: url_filial,
    name: "Dashboard - Filiais",
    filters: params_filial,
    orientation: "L",
    and: false,
  };

  return (
    <Col>
      <Dashboard
        hidden_expand={true}
        thead={
          <Tr>
            <Th
              cursor="pointer"
              active={orderLoja1}
              onClick={() =>
                handleOrderLoja(
                  orderLoja[0]?.type === "desc" ? "asc" : "desc",
                  undefined,
                  undefined,
                  undefined
                )
              }
            >
              Filial
              {/* {orderLoja1 ? (
                <Icon
                  type={
                    "sort-" + (orderLoja[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderLoja1 ? "text-primary" : ""}
                />
              ) : (
                ""
              )} */}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderLoja2}
              onClick={() =>
                handleOrderLoja(
                  undefined,
                  orderLoja[0]?.type === "desc" ? "asc" : "desc",
                  undefined
                )
              }
            >
              Contrato
              {orderLoja2 ? (
                <Icon
                  type={
                    "sort-" + (orderLoja[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderLoja2 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderLoja3}
              onClick={() =>
                handleOrderLoja(
                  undefined,
                  undefined,
                  orderLoja[0]?.type === "desc" ? "asc" : "desc"
                )
              }
            >
              Produto
              {orderLoja3 ? (
                <Icon
                  type={
                    "sort-" + (orderLoja[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderLoja3 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th title="Porcentagem Execução">% Exec.</Th>
            <Th title="Porcentagem Aprovação">% Aprov.</Th>
          </Tr>
        }
        cols={{
          col_1: {
            title:
              "Filial - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  0
                )
              ),
            api: {
              url: url_filial,
              params: {
                data_inicio: data_aux0,
                data_fim: data_aux0_final,
                contratos: contratoActive ? [contratoActive] : null,
                produtos: produtoActive ? [produtoActive] : null,
                reload:
                  monthSelected + yearSelected + contratoActive + produtoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashLoja1.length > 0 ? (
                dashLoja1.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.loja}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashLoja1),
          },
          col_2: {
            title:
              "Filial - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  1
                )
              ),
            api: {
              url: url_filial,
              params: {
                data_inicio: data_aux1,
                data_fim: data_aux1_final,
                contratos: contratoActive ? [contratoActive] : null,
                produtos: produtoActive ? [produtoActive] : null,
                reload:
                  monthSelected + yearSelected + contratoActive + produtoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashLoja2.length > 0 ? (
                dashLoja2.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.loja}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashLoja2),
          },
          col_3: {
            title:
              "Filial - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  2
                )
              ),
            api: {
              url: url_filial,
              params: {
                page: 0,
                data_inicio: data_aux2,
                data_fim: data_aux2_final,
                contratos: contratoActive ? [contratoActive] : null,
                produtos: produtoActive ? [produtoActive] : null,
                reload:
                  monthSelected + yearSelected + contratoActive + produtoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashLoja3.length > 0 ? (
                dashLoja3.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.loja}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashLoja3),
          },
        }}
        excel={{
          params_excel: params_filial,
          body_excel: body_filiais,
        }}
      ></Dashboard>
    </Col>
  );
};


/**
 * SUPERVISOR COL ----------------------------------------------------------------------------------------
 * @returns 
 */
const SupervisorCol = ({
  monthSelected,
  yearSelected,
  data_aux0_final,
  data_aux0,
  contratoActive,
  produtoActive,
  setContratoActive,
  setProdutoActive,
  handleSetDash,
  data_aux1,
  data_aux1_final,
  data_aux2,
  data_aux2_final,
}) => {
  //EXPORTADOR DE SUPERVISOR
  const url_supervisor = `${window.backend}/api/v1/trades/dashboard/supervisores`;

  const params_supervisor = {
    contratos: contratoActive ? [contratoActive] : null,
    produtos: produtoActive ? [produtoActive] : null,
    data_inicio: data_aux0,
    data_fim: data_aux0_final,
    reload: monthSelected + contratoActive,
  };

  const thead_supervisor = {
    loja: "Filial",
    qtd_contrato: "Contrato",
    qtd_produto: "Loja",
  };

  const body_supervisor = {
    titles: thead_supervisor,
    url: url_supervisor,
    name: "Dashboard - Filiais",
    filters: params_supervisor,
    orientation: "L",
    and: false,
  };

  //SUPERVISOR
  const [dashSupervisor1, setDashSupervisor1] = useState([]);
  const [dashSupervisor2, setDashSupervisor2] = useState([]);
  const [dashSupervisor3, setDashSupervisor3] = useState([]);
  const [orderSupervisor, setOrderSupervisor] = useState({
    column: "supervisor",
    type: "desc",
  });
  const [orderSupervisor1, setOrderSupervisor1] = useState(true);
  const [orderSupervisor2, setOrderSupervisor2] = useState(false);
  const [orderSupervisor3, setOrderSupervisor3] = useState(false);

  // ORDENAÇÃO SUPERVISOR
  function handleOrderSupervisor(order_1, order_2, order_3) {
    let order_aux = [];

    if (order_1) {
      order_aux.push({ column: "loja", type: order_1 });
      setOrderSupervisor1(true);
      setOrderSupervisor2(false);
      setOrderSupervisor3(false);
    }

    if (order_2) {
      order_aux.push({ column: "contrato", type: order_2 });
      setOrderSupervisor1(false);
      setOrderSupervisor2(true);
      setOrderSupervisor3(false);
    }

    if (order_3) {
      order_aux.push({ column: "produto", type: order_3 });
      setOrderSupervisor1(false);
      setOrderSupervisor2(false);
      setOrderSupervisor3(true);
    }

    setOrderSupervisor(order_aux);
  }

  return (
    <Col>
      <Dashboard
        hidden_expand={true}
        thead={
          <Tr>
            <Th
              cursor="pointer"
              active={orderSupervisor1}
              onClick={() =>
                handleOrderSupervisor(
                  orderSupervisor[0]?.type === "desc" ? "asc" : "desc",
                  undefined,
                  undefined,
                  undefined
                )
              }
            >
              Supervisor
              {/* {orderSupervisor1 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderSupervisor[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderSupervisor1 ? "text-primary" : ""}
                />
              ) : (
                ""
              )} */}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderSupervisor2}
              onClick={() =>
                handleOrderSupervisor(
                  undefined,
                  orderSupervisor[0]?.type === "desc" ? "asc" : "desc",
                  undefined
                )
              }
            >
              Contrato
              {orderSupervisor2 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderSupervisor[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderSupervisor2 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th
              align="center"
              cursor="pointer"
              active={orderSupervisor3}
              onClick={() =>
                handleOrderSupervisor(
                  undefined,
                  undefined,
                  orderSupervisor[0]?.type === "desc" ? "asc" : "desc"
                )
              }
            >
              Produto
              {orderSupervisor3 ? (
                <Icon
                  type={
                    "sort-" +
                    (orderSupervisor[0]?.type === "desc" ? "asc" : "desc")
                  }
                  className={orderSupervisor3 ? "text-primary" : ""}
                />
              ) : (
                ""
              )}
            </Th>
            <Th title="Porcentagem Execução">% Exec.</Th>
            <Th title="Porcentagem Aprovação">% Aprov.</Th>
          </Tr>
        }
        cols={{
          col_1: {
            title:
              "Supervisor - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  0
                )
              ),
            api: {
              url: url_supervisor,
              params: {
                data_inicio: data_aux0,
                data_fim: data_aux0_final,
                contratos: contratoActive ? [contratoActive] : null,
                produtos: produtoActive ? [produtoActive] : null,
                reload:
                  monthSelected + yearSelected + contratoActive + produtoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashSupervisor1.length > 0 ? (
                dashSupervisor1.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.loja}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: () => { }, //handleSetDash(setDashLoja1),
          },
          col_2: {
            title:
              "Supervisor - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  1
                )
              ),
            api: {
              url: url_supervisor,
              params: {
                data_inicio: data_aux1,
                data_fim: data_aux1_final,
                contratos: contratoActive ? [contratoActive] : null,
                produtos: produtoActive ? [produtoActive] : null,
                reload:
                  monthSelected + yearSelected + contratoActive + produtoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashSupervisor2.length > 0 ? (
                dashSupervisor2.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.loja}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashSupervisor2),
          },
          col_3: {
            title:
              "Supervisor - " +
              get_date(
                "month_name",
                get_date(
                  "date",
                  "01/" + monthSelected + "/" + yearSelected,
                  "date_sub_month",
                  2
                )
              ),
            api: {
              url: url_supervisor,
              params: {
                page: 0,
                data_inicio: data_aux2,
                data_fim: data_aux2_final,
                contratos: contratoActive ? [contratoActive] : null,
                produtos: produtoActive ? [produtoActive] : null,
                reload:
                  monthSelected + yearSelected + contratoActive + produtoActive,
              },
              key_aux: ["data"],
            },
            tbody:
              dashSupervisor3.length > 0 ? (
                dashSupervisor3.map((item) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.loja}</Td>
                      <Td align="center">{item.qtd_contrato}</Td>
                      <Td align="center">{item.qtd_produto}</Td>
                      <Td align="center">{`${item.per_concluidos}%`}</Td>
                      <Td align="center">{`${item.per_aprovados}%`}</Td>
                    </Tr>
                  );
                })
              ) : (
                <></>
              ),
            callback: handleSetDash(setDashSupervisor3),
          },
        }}
        excel={{
          params_excel: params_supervisor,
          body_excel: body_supervisor,
        }}
      ></Dashboard>
    </Col>
  );
};
