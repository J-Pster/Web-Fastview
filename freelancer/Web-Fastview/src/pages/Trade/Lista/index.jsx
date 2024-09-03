import { useState, useContext, useEffect, Fragment } from "react";
import { cd, get_date } from "../../../_assets/js/global";
import { GlobalContext } from "../../../context/Global";
import Row from '../../../components/body/row';
import Table from '../../../components/body/table';
import Tr from '../../../components/body/table/tr';
import Icon from '../../../components/body/icon';
import Tbody from '../../../components/body/table/tbody';
import Td from '../../../components/body/table/tbody/td';
import Historico from "../Historico";
import FilterCheckbox from "../../../components/body/filterCheckbox";
import Input from "../../../components/body/form/input";
import ModalImgTrade from "./modalImg";
import axios from "axios";
import "./style.css"
import ModalAddImg from "./addImage";
import { toast } from 'react-hot-toast';
import Item from "./item";
import dayjs from "dayjs";
import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";

export default function Lista({ icons, filters }) {
  window.rs_permissao = 'lojista';
  //VARIAVEL COM INFOS
  const [info, setInfo] = useState([]);

  //ESTADO EXPANDIR COLUNAS
  const [hide, setHide] = useState(true);

  //ESTADO ITENS DA TABELA
  const [contrato, setContrato] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [filial, setFilial] = useState(null);
  const [industria, setIndustria] = useState(null);
  const [produto, setProduto] = useState(null);
  const [tdataInicio, setTDataInicio] = useState(null);
  const [tdataFim, setTDataFim] = useState(null);
  const [observacao, setObservacao] = useState(null);
  const [valor, setValor] = useState(null);
  const [numPonto, setNumPonto] = useState(null);
  const [codFornecedor, setCodFornecedor] = useState(null);
  const [codProduto, setCodProduto] = useState(null);
  const [codFase, setCodFase] = useState(null);
  const [checkLoja, setCheckDeLoja] = useState(null);
  const [fdataInicio, setFDataInicio] = useState(null);
  const [fdataFim, setFDataFim] = useState(null);
  const [status, setStatus] = useState(null);
  //
  const [optionsGrupo, setOptionsGrupo] = useState();
  const [optionsContratos, setOptionsContratos] = useState([]);
  const [optionsProduto, setOptionsProduto] = useState();
  const [optionsIndustria, setOptionsIndustria] = useState();
  const [reload, setReload] = useState(false);
  //ESTADOS QUE ARMAZENAM ANO E MÊS DO HANDLE SELECT REACT
  const [date, setDate] = useState(new Date());
  const [dataInicio, setDataInicio] = useState(dayjs(date).toDate());
  const [dataFim, setDataFim] = useState();

  let date_aux = get_date('last_date', cd(date)).split("/")

  //modal
  const [show, setShow] = useState(false);
  const [nomeAux, setNomeAux] = useState();
  const [imgAux, setImgAux] = useState();
  //modal add image
  const [idAux, setIdAux] = useState();
  const [showAdd, setShowAdd] = useState(false);

  // abrir modal img
  const handleShow = (img, nome) => (
    setShow(true),
    setImgAux(img),
    setNomeAux(nome)
  )
  // fechar modal img
  const handleClose = () => setShow(false);

  //
  const handleFile = (id) => (
    setShowAdd(true),
    setIdAux(id)
  );
  //
  const handleCloseFile = () => setShowAdd(false);

  //VARIAVEIS DOS FILTROS
  const options_status = [{ value: 1, label: "Checar" }, { value: 2, label: "Avaliar" }, { value: 4, label: "Aprovado" }, { value: 5, label: "Reprovado" }]
  const options_check_loja = [{ value: 2, label: "Conforme" }, { value: 3, label: "Não conforme" }, { value: 4, label: "Não se aplica" }]

  //INFO DA API
  const handleSetItems = (e) => {
    setInfo(e);
  }
  //FILTROS
  //HANDLE EVENT DE ACORDO COM O SETSTATE
  const handleEvent = (setState) => (e) => {
    setState(e)
  }
  //HANDLE EVENT DE ACORDO COM O SETSTATE
  const handleValue = (setState) => (e) => {
    setState(e.value)
  }
  //HANDLE TARGET DE ACORDO COM O SETSTATE
  const handleTarget = (setState) => (e) => {
    setState(e?.target?.value ? e?.target?.value : e)
    doReload(true);
  }
  //filtro de data
  const handleFilterData = (e) => {
    let date_aux = e && get_date('last_date', cd(e)).split("/")
    setDate(e);
    setDataInicio(e);
    doReload(true);
    setDataFim(`${date_aux[2]}-${date_aux[1]}-${date_aux[0]}`)
  }

  //OPTIONS GRUPO
  function get_grupo() {
    let obj = [];
    axios.get(`${window.backend}/api/v1/trades/gerenciador/grupos`)
      .then(({ data }) => {
        data.data.map((item, i) => {
          obj.push({ value: item.id, label: item.nome })
        })
        setOptionsGrupo(obj)
      })
  }

  function get_contratos() {
    let obj = []
    axios.get(`${window.backend}/api/v1/trades/gerenciador/contratos`)
      .then(({ data }) => {
        data.data.map((item, i) => {
          obj.push({ value: item.id, label: `${item.numero}-(${item.descricao})` })
        })
        setOptionsContratos(obj);
      })
  }

  //OPTIONS GRUPO
  function get_produto() {
    let obj = [];
    axios.get(`${window.backend}/api/v1/trades/gerenciador/produtos`, {
      params: { ativo: [1], filter_checked: 0 }
    })
      .then(({ data }) => {
        data.data.map((item, i) => {
          obj.push({ value: item.id, label: item.nome })
        })
        setOptionsProduto(obj)
      })
  }
  //OPTIONS INDUSTRIA
  function get_industria() {
    let obj = [];
    axios({
      url: `${window.backend}/api/v1/trades/gerenciador/industrias`,
      method: 'get',
      params: {
        ativo: [0, 1]
      }
    }).then(({ data }) => {
      data.data.map((item, i) => {
        obj.push({ value: item.id, label: item.nome })
      })
      setOptionsIndustria(obj)
    })
  }

  useEffect(() => {
    Promise.all([get_grupo(),
    get_contratos(),
    get_produto(),
    get_industria(),])

  }, []);


  const numOpt = Array(10).fill({}).map((item, idx) => ({ id: idx + 1, label: idx + 1 }))

  //THEAD
  const thead = [
    {
      enabled: true,
      label: "Contrato",
      id: "contratos",
      items: optionsContratos,
      name: "contratos",
      onChange: handleEvent(setContrato),
    },
    {
      enabled: true,
      label: "Grupo",
      id: "grupo_nome",
      name: "grupo_nome",
      items: optionsGrupo,
      onChange: handleEvent(setGrupo),
    },
    {
      enabled: true,
      label: "Filial",
      id: "filial_nome",
      name: "filial_nome",
      api:
        window.host +
        "/api/sql.php?do=select&component=loja&np=true&filial=true",
      onChange: handleEvent(setFilial),
    },
    {
      enabled: true,
      label: "Indústria",
      id: "industria_nome",
      name: "industria_nome",
      items: optionsIndustria,
      onChange: handleEvent(setIndustria),
    },
    {
      enabled: true,
      label: "Produto",
      id: "trade_produto_nome",
      name: "trade_produto_nome",
      items: optionsProduto,
      onChange: handleEvent(setProduto),
    },
    {
      enabled: true,
      label: "Data",
      id: "contrato_data_inicio",
      name: "contrato_data_inicio",
      type: "date",
      filter: false,
    },

    // { enabled: hide ? false : true, label: 'Job', id: 'job', name: 'job', filter: false },
    // { enabled: hide ? false : true, label: 'Job Categoria', id: 'categoria', name: 'categoria', filter: false },
    // { enabled: hide ? false : true, label: 'Job Subcategoria', id: 'subcategoria', name: 'subcategoria', filter: false },
    // { enabled: hide ? false : true, label: 'Job Status', id: 'job_status', name: 'job_status', filter: false },
    {
      enabled: hide ? false : true,
      label: "Observação",
      id: "observacao",
      name: "observacao",
      onChange: handleTarget(setObservacao),
    },
    {
      enabled: hide ? false : true,
      label: "Valor",
      id: "valor",
      name: "valor",
      onChange: handleTarget(setValor),
    },
    {
      enabled: hide ? false : true,
      label: "N° do Ponto",
      id: "ponto",
      name: "ponto",
      items: numOpt,
      onChange: handleTarget(setNumPonto),
    },
    {
      enabled: hide ? false : true,
      label: "Cód. Fornecedor",
      id: "codigo_industria",
      name: "codigo_industria",
      onChange: handleTarget(setCodFornecedor),
    },
    {
      enabled: hide ? false : true,
      label: "Cod. Produto",
      id: "codigo_produto",
      name: "codigo_produto",
      onChange: handleTarget(setCodProduto),
    },
    {
      enabled: hide ? false : true,
      label: "Cod. Fase",
      id: "fase",
      name: "fase",
      items: numOpt,
      onChange: handleTarget(setCodFase),
    },

    {
      enabled: true,
      label: "Modelo",
      id: "",
      name: "",
      export: false,
      filter: false,
    },
    // { enabled: true, label: 'Check loja', id: '', name: '', export: false, items: options_check_loja, onChange: handleValue(setCheckDeLoja), filter: true },
    {
      enabled: true,
      label: "Data Finalizada",
      id: "data_foto_loja",
      name: "data_foto_loja",
      type: "date",
      filter: false,
    },
    {
      enabled: true,
      label: "Imagem Loja",
      id: "loja_imagen",
      name: "loja_imagen",
      export: false,
      filter: false,
    },
    {
      enabled: window?.rs_permissao === "lojista",
      label: "Check ADM",
      id: "",
      name: "",
      export: false,
    },
    // { enabled: window?.rs_permissao === 'supervisao', label: 'Check ADM', id: '', name: '', export: false },
    {
      enabled: true,
      label: "Status",
      id: "status_adm_nome",
      name: "status_adm_nome",
      items: options_status,
      onChange: handleEvent(setStatus),
    },
  ];

  // TITLES EXPORT
  let thead_export = {};
  thead.map((item, i) => {
    if (item?.export !== false) {
      thead_export[item?.name] = item?.label;
    }
  })

  // URL API TABLE
  const url = `${window.backend}/api/v1/trades`;
  // PARAMS API TABLE
  const params = {
    // tipo: "loja",
    contratos: contrato,
    grupos: grupo,
    filial: filial,
    lojas: filial,
    industrias: industria,
    nome_fornecedor: null,
    status,
    produtos: produto,
    codigo_produto: codProduto,
    codigo_industria: codFornecedor,
    data_inicio: dataInicio ? format(dataInicio, "yyyy-MM-dd") : null,
    data_fim: dataFim ? dataFim : `${date_aux[2]}-${date_aux[1]}-${date_aux[0]}`,
    obervacao: null,
    // valor_start: (fdataInicio ? get_date('date_sql', cd(fdataInicio)) : null),
    // valor_end: (fdataFim ? get_date('date_sql', cd(fdataInicio)) : null),
    ponto: numPonto,
    fase: codFase,
    ativo: null,
  };

  // BODY DO EXPORTADOR
  const body = {
    titles: thead_export,
    url: url,
    name: 'Trade',
    filters: params,
    orientation: 'L',
    and: false
  }

  const doReload = (res) => setReload(res);

  // MANDA OS FILTROS PRO COMPONENTE PAI
  useEffect(() => {
    if (icons) {
      icons(
        <>
          <Icon type="expandir" expanded={!hide} onClick={() => { setHide(!hide) }} />
          <Icon type="print" />
          <Icon type="excel" api={{ params: params, body: body }} />
        </>
      )
    }
    if (filters) {
      filters(
        <Input
          type="date"
          format="mm/yyyy"
          icon={false}
          yearPicker={true}
          required={false}
          value={date}
          onChange={handleFilterData}
        />
      );
    }
  }, [info, hide, date])

  return (
    <Row className="p-4">
      <ModalImgTrade
        show={show}
        onHide={handleClose}
        handleShow={handleShow}
        img={imgAux}
        nome={nomeAux}
      />
      <ModalAddImg
        show={showAdd}
        onHide={handleCloseFile}
        handleShow={handleFile}
        id={idAux}
      />
      {/* <Col> */}
      <Table
        id="trade"
        api={url}
        params={params}
        onLoad={handleSetItems}
        thead={thead}
        pages={true}
        reload={
          date +
          // dataFim.toUTCString() +
          dataInicio.toUTCString() +
          reload + codFornecedor + codProduto
        }
        key_aux={["data"]}
      >
        <Tbody>
          {info.length > 0 ? (
            info.map((item, idx) => {
              var color;

              if (item.has_avaliacao) {
                color = "#0090d9";
                item.status_adm_nome = "Avaliar";
              } else if (item.status_adm_nome == "Aprovado") {
                color = "green";
              } else if (item.status_adm_nome == "Reprovado") {
                color = "red";
              } else if (item.status_adm_nome == "Checar") {
                color = "gray";
              }

              let imagem;

              if (item?.loja_imagen?.includes("http")) {
                imagem = item?.loja_imagen;
              } else if (item?.loja_imagen !== null) {
                imagem = `${window.upload}/${item?.loja_imagen}`;
              }

              let imagem_modelo;

              if (item?.modelo?.includes("http")) {
                imagem_modelo = item?.modelo;
              } else if (item?.modelo !== null) {
                imagem_modelo = `${window.upload}/${item?.modelo}`;
              }

              return (
                <Fragment key={"trade_" + item.id + idx}>
                  <Item
                    id={item.id}
                    openSupervisao={true}
                    supervisao={item?.supervisao}
                    contrato={item?.contrato_numero}
                    grupo={item?.grupo_nome}
                    filial={item?.filial_nome}
                    industria={item?.industria_nome}
                    produto={item?.trade_produto_nome}
                    data_inicio={item?.contrato_data_inicio}
                    data_fim={item?.contrato_data_fim}
                    //   job={item?.job ? item?.job : "-"} //não tem
                    //   job_categoria={item?.categoria ? item?.categoria : "-"} //não tem
                    //   job_subcategoria={item?.subcategoria ? item?.subcategoria : "-"} //não tem
                    //   job_status={item?.job_status ? item?.job_status : "-"} //não tem
                    observacao={item?.obs ? item?.obs : "-"}
                    valor={item?.valor ? item?.valor : "-"}
                    num_ponto={item?.ponto ? item?.ponto : "-"}
                    cod_fornecedor={item?.codigo_industria ? item?.codigo_industria : "-"}
                    cod_produto={item?.codigo_produto ? item?.codigo_produto : "-"}
                    cod_fase={item?.fase}
                    modelo={imagem_modelo}
                    check_loja={item?.status_loja_nome}
                    status_loja={item?.status_loja}
                    data_finalizada={item?.data_adm} // data de quando o adm aprova a foto ???
                    check_adm={item?.status_adm_nome}
                    status={item?.status_adm_nome} //não tem
                    status_adm={item?.status_adm}
                    trade_produto_descricao={item?.trade_produto_descricao}
                    loja_imagem={imagem}
                    loja_img_aux={item?.loja_imagen}
                    has_avaliacao={item?.has_avaliacao}
                    hide={hide}
                    color={color}
                    reload={reload}
                    doReload={doReload}
                    handleShow={handleShow}
                  />
                </Fragment>
              );
            })
          ) : (
            <></>
          )}
        </Tbody>
      </Table>
    </Row>
  );
}