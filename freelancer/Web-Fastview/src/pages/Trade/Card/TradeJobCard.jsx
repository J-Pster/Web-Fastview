import React from "react";
import { useState } from "react";
import Foto from "../../../components/body/foto";
import Historico from "../Historico";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { every, first, some, sortBy } from "lodash";
import Title from "../../../components/body/title";
import ModalMotivo from "../Lista/modalMotivo";
import Button from "../../../components/body/button";
import SelectReact from "../../../components/body/select";
import Loader from "../../../components/body/loader";
import { get_date } from "../../../_assets/js/global";

const TradeJobCard = ({
  loja_id,
  industrias,
  produtos,
  grupos,
  callback,
  interaction,
  job,
}) => {
  // ESTADOS
  const [loja, setLoja] = useState(null);
  const [lojaId, setLojaId] = useState(loja_id);
  const [show, setShow] = useState(false);
  const [checker, setChecker] = useState();
  const [statusAux, setStatusAux] = useState();
  const [amdTradeId, setadmTradeId] = useState();
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const validate = (trades = []) => {
    const ok = some(trades,{status_loja : 0});
    setValidation(ok);
  };

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + window.token,
  };

  /** Para salvar a resposta da loja */
  const handleResponse = async ({
    trade_id,
    status,
    loja_imagen,
    job_id,
    job_status_id,
    job_data
  }) => {
    const data = {
      trade_id,
      status,
      imagem: loja_imagen,
      job_status_id,
      job_id,
      job_data
    };

    try {
      await axios.post(
        `${window.backend}/api/v1/trades/supervisao/lojas`,
        data,
        { headers }
      );
      getTrades(false);
      toast("Resposta cadastrada com sucesso");
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    }
  };

  const handleShowMotivo = ({ checker, status, id, imagem = null }) => {
    setShow(true);
    setChecker(checker);
    setStatusAux(status);
    setadmTradeId(id);
  };

  const onHide = (response) => setShow(response);

  const getTrades = async (loading) => {
    if (loading) {
      setLoading(true);
    }

    const params = {
      filiais: [lojaId],
      industrias,
      produtos,
      grupos,
      ...job,
    };

    try {
      const response = await axios.get(
        `${window.backend}/api/v1/trades/supervisao`,
        { params }
      );
      const loja = first(response?.data?.data);
      validate(loja?.trades);
      setLoja(loja);
    } catch (error) {
      toast("Erro carregando os trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lojaId) {
      getTrades(true);
    }
  }, [lojaId]);

  useEffect(() => {
    if (!industrias) {
      if (!grupos) {
        toast("Deve selecionar uma industria ou um grupo!");
        return;
      }
    }
  }, []);

  return (
    <>
      {(!window.rs_id_lja || window.rs_id_lja == 0) && !loja_id && (
        <div className="mb-4">
          <SelectReact
            name="loja_id"
            id="loja_id"
            label="Loja"
            api={{
              url: window.backend + "/api/v1/utilities/filters/lojas",
              key_aux: ["data"],
            }}
            value={lojaId}
            onChange={(e) => setLojaId(e.value)}
          />
        </div>
      )}

      {lojaId &&
        (loading ? (
          <Loader />
        ) : (
          <div className="mb-4">
            <div className="mb-3">
              {loja?.trades.length > 0 ? (
                loja?.trades.map((trade, index) => {
                  let img_aux = trade.loja_imagen;
                  return (
                    <div key={loja.id + "_trade_" + index} className={"mb-3"}>
                      {index == 0 ? <Title>{loja?.nome}</Title> : ""}
                      <ModalMotivo
                        show={show}
                        onHide={onHide}
                        status={statusAux}
                        trade_id={amdTradeId}
                        checker={checker}
                        job={job}
                        reload={() => getTrades(false)}
                      />
                      <TradeItem
                        {...trade}
                        loja_imagen={img_aux}
                        job={job}
                        handleResponse={handleResponse}
                        handleShowMotivo={(e) => {
                          img_aux = e.imagem;
                          handleShowMotivo({ ...e, imagem: img_aux });
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-center">
                  Nenhum trade configurado para essa loja
                </p>
              )}
            </div>

            {loja?.trades.length > 0 && interaction && (
              <Button
                type="submit"
                disabled={validation}
                loading={buttonLoading}
                title={!validation ? "Preencha todos os campos" : false}
                onClick={() => (callback(), setButtonLoading(true))}
              >
                Enviar
              </Button>
            )}
          </div>
        ))}
    </>
  );
};

export default TradeJobCard;

const TradeItem = ({
  modelo,
  loja_imagen,
  id,
  descricao,
  loja_nome,
  grupo_nome,
  data_inicio,
  status_loja,
  industria_nome,
  produto_nome,
  data_fim,
  handleResponse,
  handleShowMotivo,
  job,
}) => {
  let modelo_aux = window.upload+'/'+(modelo?.replace((window.upload+'/'), ''));
  let imagem_aux = window.upload+'/'+(loja_imagen?.replace((window.upload+'/'), ''));

  return (
    <Foto
      left={[modelo_aux]}
      right={loja_imagen ? [imagem_aux] : []}
      edit={false}
      multiple={true}
      className="swiper-foto"
      hover={false}
      camera={loja_imagen == null}
      integration={true}
      width={"auto"}
      not_applicable_button={false}
      chat={
        <Historico
          id={id}
          contrato={descricao}
          loja={loja_nome}
          grupo={grupo_nome}
          data={data_inicio}
        />
      }
      aproved={{
        lojista: status_loja == 2 ? true : false,
      }}
      // inapplicable={{
      //   lojista: status_loja == 4 ? true : false,
      // }}
      reproved={{
        lojista: status_loja == 3 ? true : false,
      }}
      rate={{
        lojista: {
          aproveAction: (e) =>
            handleResponse({
              trade_id: id,
              status: 2,
              loja_imagen: window.upload+'/'+(e[0]?.replace((window.upload+'/'), '')),
              ...job,
            }),
          reproveAction: (e) =>
            handleShowMotivo({
              checker: "loja",
              status: 3,
              id,
              imagem: window.upload+'/'+(e[0]?.replace((window.upload+'/'), '')),
            }),
            ...job
        },
      }}
      description={
        <>
          {descricao && <p className="mb-0"> Produto: {produto_nome} </p>}
          {data_inicio && (
            <p className="mb-0">
              {" "}
              Data: {get_date("date", data_inicio, "date_sql")} -{" "}
              {get_date("date", data_fim, "date_sql")}{" "}
            </p>
          )}
        </>
      }
    />
  );
};
