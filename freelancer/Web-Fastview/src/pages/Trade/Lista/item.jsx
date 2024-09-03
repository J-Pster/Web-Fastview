import { useState, useContext, Fragment } from "react";
import Td from "../../../components/body/table/tbody/td";
import Tr from "../../../components/body/table/tr";
import Icon from "../../../components/body/icon";
import Input from "../../../components/body/form/input";
import { cd, cdh, get_date } from "../../../_assets/js/global";
import Historico from "../Historico";
import axios from "axios";
import toast from "react-hot-toast";
import ModalMotivo from "./modalMotivo";
// import { GlobalContext } from "../../../context/Global";
import { GlobalContext } from "../../../context/Global";
import SupervisaoItem from "./sup.item";

const initialMotivoState = {
  checker: "adm",
  status: 5,
  imagem: null,
  trade_id: null,
  trade_supervisao_id: null,
  job_id: null,
  job_status_id: null,
};

export default function Item(props) {
  const {
  id,
  contrato,
  grupo,
  filial,
  industria,
  produto,
  data_inicio,
  data_fim,
  job,
  job_categoria,
  job_subcategoria,
  job_status,
  observacao,
  valor,
  num_ponto,
  cod_fornecedor,
  cod_produto,
  cod_fase,
  modelo,
  check_loja,
  data_finalizada,
  check_adm,
  status,
  loja_imagem,
  loja_img_aux,
  trade_produto_descricao,
  status_loja,
  status_adm,
  has_avaliacao,

  hide,
  color,
  reload,
  doReload,
  handleShow,
  className,
  supervisao,
} = props
  // CONTEXT
  const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

  //DATA DE HOJE
  const date_now = new Date();
  //ADICIONAR ANEXO PELA TABELA
  const [anexo, setAnexo] = useState();
  const [show, setShow] = useState(false);
  const [checker, setChecker] = useState();
  const [showSupervisao, setShowSupervisao] = useState(false);
  const [imagem, setImagem] = useState();
  const [statusAux, setStatusAux] = useState();
  const [historico, setHistorico] = useState(false);
  const [motivoData, setMotivoData] = useState(initialMotivoState);

  //ABRIR MODAL MOTIVO
  const handleShowMotivo = ({checker, status, img_loja, trade_supervisao_id, job_id, job_status_id, trade_id}) => {
    setShow(true) ;
    setMotivoData(prev => ({...prev, checker, status, imagem: img_loja, trade_supervisao_id, job_id, job_status_id, trade_id}))
  };

  //FUNÇÃO PARA APROVAR PELO ADM
  const handleAdmResponse = ({ trade_id, status,  trade_supervisao_id, job_id, job_status_id }) => {
    axios({
      method: "post",
      url: `${window.backend}/api/v1/trades/supervisao`,
      data: {
        trade_id,
        status,
        trade_supervisao_id,
        job_id,
        job_status_id
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.token,
      },
    })
      .then(() => {
        doReload(trade_id + show);
        toast("Resposta cadastrada com sucesso");
      })
      .catch((_error) => {
        toast("Ocorreu um erro, tente novamente");
      });
  };

  //FECHAR MODAL MOTIVO
  const onHide = (response) => setShow(response);

  // // PEGAR ANEXO APÓS UPLOAD
  // const handleSetAnexo = (response, id) => {
  //   let string_aux;

  //   if (response[2] === "remove") {
  //     setAnexo(null);
  //     setImagem(null);
  //   } else if (response[2] === "upload") {
  //     JSON.parse(response[0]).map((item, i) => {
  //       string_aux = item.id;
  //     });
  //     setAnexo(response[0]);
  //     setImagem(string_aux);
  //   }

  //   axios({
  //     method: "post",
  //     url: `${window.backend}/api/v1/trades/supervisao/lojas`,
  //     data: {
  //       trade_id: id,
  //       imagem: string_aux,
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + window.token,
  //     },
  //   })
  //     .then(() => {
  //       doReload(1);
  //       response[2] === "remove"
  //         ? toast("Imagem apagada com sucesso")
  //         : toast("Imagem cadastrada com sucesso");
  //     })
  //     .catch((_error) => {
  //       toast("Ocorreu um erro, tente novamente");
  //     });
  // };

  // //'EXCLUIR' FOTO
  // function excluirFoto() {
  //   if (window.confirm("Deseja excluir esse modelo?")) {
  //     axios({
  //       url: `${window.backend}/api/v1/trades/supervisao/lojas`,
  //       method: "post",
  //       data: {
  //         trade_id: id,
  //         imagem: null,
  //       },
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     })
  //       .then(() => {
  //         toast("Modelo excluído com sucesso");
  //         setAnexo(null);
  //         setImagem(null);
  //         doReload(8);
  //       })
  //       .catch((_error) => {
  //         toast("Ocorreu um erro, tente novamente");
  //       });
  //   }
  // }

  //MOSTRAR IMAGEM
  const handleClick = (img) => {
    handleSetToggler(true);
    handleSetSources([img], 0);
  };

  const resetMotivo = () => {
    setMotivoData(initialMotivoState);
  }

  return (
    <Fragment>
      <ModalMotivo
        show={show}
        onHide={onHide}
        supervisao_data={motivoData}
        reload={doReload}
        resetMotivo={resetMotivo}
      />
      <Tr key={id}>
        <Td disableView={false} >
          <div className="d-flex justify-content-between">

          {contrato}

          {supervisao.length > 0 && (
            <Icon
            type={showSupervisao ? "chevron-up" : "chevron-down"}
            onClick={() => setShowSupervisao(!showSupervisao)}
            />
            )}
          </div>
        </Td>
        <Td disableView={false} title={grupo}>
          {grupo}
        </Td>
        <Td disableView={false} title={filial}>
          {filial}
        </Td>
        <Td disableView={false} title={industria}>
          {industria}
        </Td>
        <Td disableView={false} title={produto}>
          {produto}
        </Td>
        <Td disableView={false} title={`${cd(data_inicio)} a ${cd(data_fim)}`}>
          {`${cd(data_inicio)} a ${cd(data_fim)}`}
        </Td>
        {/* <Td disableView={false} hide={hide}>{job}</Td>
        <Td disableView={false} hide={hide} align="center">
          {job_categoria}
        </Td>
        <Td disableView={false} hide={hide} align="center">
          {job_subcategoria}
        </Td>
        <Td disableView={false} hide={hide}>{job_status}</Td> */}
        <Td disableView={false} hide={hide} title={observacao}>
          {observacao}
        </Td>
        <Td disableView={false} hide={hide}>
          {valor}
        </Td>
        <Td disableView={false} hide={hide}>
          {num_ponto}
        </Td>
        <Td disableView={false} hide={hide} align="center">
          {cod_fornecedor}
        </Td>
        <Td disableView={false} hide={hide} align="center">
          {cod_produto}
        </Td>
        <Td disableView={false} hide={hide} align="center">
          {cod_fase}
        </Td>
        <Td disableView={false}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {modelo && (
              <div className="d-flex align-items-center">
                <Icon
                  type="view"
                  animated
                  onClick={() => handleClick(modelo)}
                />
              </div>
            )}
          </div>
        </Td>
        <Td disableView={false}>{data_finalizada && cdh(data_finalizada)}</Td>
        <Td disableView={false} align="center">
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* {(status_loja == 1 || status_loja === null) && (
              //window.rs_id_lja && -> trocar -> só pra lojista
              <Input
                title="Anexar imagem"
                size="lg"
                type="file"
                border={false}
                multiple={false}
                className={"mx-0"}
                value={anexo}
                multipleValues={false}
                callback={(e) => handleSetAnexo(e, id)}
                input={loja_imagem == null && (status_loja == 1 || status_loja == null)}
                animated
              //readonly={(props.interaction === false ? true : false)}
              />
            )} */}
            <>
              <Icon
                type="view"
                animated
                disabled={!(loja_imagem && status_loja == 2)}
                onClick={() => handleClick(loja_imagem)}
              />
              {/* <Icon
                  type="check"
                  title={"Aprovado"}
                  //disabled={!anexo ? true : false}
                  className={"text-success"}
                  //onClick={() => handleAproveLoja('loja', 2, loja_img_aux)}
                  readonly={true}
                /> */}
            </>
          </div>
        </Td>

        {/* CADASTRAR E AVALIAR A FOTO POR LOJA TEM QUE SER NO SUPERVISÃO  */}
        <Td disableView={false} align="center">
         
            {/* <Icon
              type="check"
              title={"Aprovar"}
              disabled={!(status_adm == 3)}
              className={"text-success"}
              onClick={() => handleAdmResponse({ trade_id: id, status: 4 })}
            />
            <Icon
              type="reprovar2"
              title={"Reprovar"}
              disabled={!(status_adm == 3)}
              className={"text-danger"}
              onClick={() => handleShowMotivo("adm", 5)}
            /> */}
            {/* <Icon
              type="alert-circle"
              title={"Não se aplica"}
              disabled={
                status_loja == 1 || status_loja === null
                  ? false
                  : status_loja != 4
              }
              className={"text-warning"}
              onClick={() => handleShowMotivo("loja", 4, loja_img_aux)}
            /> */}
            <Historico
              id={id}
              contrato={contrato}
              loja={filial}
              grupo={grupo}
              data={data_inicio}
            />
        </Td>
        <Td disableView={false}>
          <span className="trade-background" style={{ backgroundColor: color }}>
            {/* {props?.status_adm_nome?.split(',')[0]} */}
            {status}
          </span>
        </Td>
      </Tr>
      {supervisao.length > 0 && showSupervisao && (
        <Fragment>
          {supervisao.map((st, idx) => {
            return (
              <Fragment key={`supervisao_trade_${st.id}_${idx}`}>
                <SupervisaoItem
                  {...st}
                  show={showSupervisao}
                  itemData={props}
                  handleAdmResponse={handleAdmResponse}
                  handleShowMotivo={handleShowMotivo}
                  handleClick={handleClick}
                  hide={hide}
                />
              </Fragment>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
}