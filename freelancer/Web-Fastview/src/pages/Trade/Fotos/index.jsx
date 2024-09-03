import React, { useState, useContext } from "react";
import { cd, cdh, get_date } from "../../../_assets/js/global";

import Title from "../../../components/body/title";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "../../../_assets/css/swiper.scss";
import Foto from "../../../components/body/foto";
import Row from "../../../components/body/row";
import Col from "../../../components/body/col";
import Filter from "../Filter";
import { useEffect } from "react";
import axios from "axios";
import Historico from "../Historico";
import InfiniteScroll from "react-infinite-scroll-component";
import Icon from "../../../components/body/icon";
import Input from "../../../components/body/form/input";
import { format } from "date-fns";
import dayjs from "dayjs";
import '../trade.scss';
import toast from "react-hot-toast";
import ModalMotivo from "../Lista/modalMotivo";
import FilterCheckbox from "../../../components/body/filterCheckbox";

export default function Fotos({ filters, icons }) {
  // ESTADOS
  const [lojas, setLojas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  //ESTADOS QUE ARMAZENAM ANO E MÊS DO HANDLE SELECT REACT
  const [date, setDate] = useState(new Date());
  const [dataInicio, setDataInicio] = useState(
    dayjs(date).toDate()
  );
  // const [dataFim, setDataFim] = useState(dayjs(date).endOf('month').toDate());
  const [dataFim, setDataFim] = useState();

  // SWIPER
  const swiperSlide = useSwiperSlide();


  const options_status = [
    { value: 1, label: "Checar" },
    { value: 3, label: "Avaliar" },
    { value: 4, label: "Aprovado" },
    { value: 5, label: "Reprovado" },
  ];

  //filtro de data
  const handleFilterData = (e) => {
    let date_aux = e && get_date('last_date', cd(e)).split("/")
    setDate(e);
    setDataInicio(dayjs(e).toDate());
    // setDataFim(dayjs(e).toDate());
    setDataFim(`${date_aux[2]}-${date_aux[1]}-${date_aux[0]}`)
  };

  const [industrias, setIndustrias] = useState(null);
  const [contratos, setContratos] = useState(null);
  const [produtos, setProdutos] = useState(null);
  const [status, setStatus] = useState(null);

  // GET DE IMAGENS
  function get_images(loading) {
    setLoading(true)
    axios({
      method: "get",
      url: `${window.backend}/api/v1/trades/supervisao`,
      params: {
        data_inicio: format(dataInicio, "yyyy-MM-dd"),
        //data_fim: format(dataFim, "yyyy-MM-dd"),
        data_fim: dataFim,
        industrias,
        contratos,
        produtos,
        status
      },
    }).then(({ data }) => {
      setLojas(data.data);
      setLoading(false);
    });
    
  }

  useEffect(() => {
    get_images(true);
  }, [date, industrias, contratos, produtos, status]);

  useEffect(() => {
    if (icons) {
      icons(<Icon type="print" />);
    }
    if (filters) {
      filters(
        <>
          <Input
            type="date"
            format="mm/yyyy"
            icon={false}
            required={false}
            value={date}
            onChange={handleFilterData}
          />
          <FilterCheckbox
            id="supervisao-filter-industrias"
            name="industrias"
            api={{
              url: `${window.backend}/api/v1/trades/filters/industrias`,
              key_aux: ["data"],
              params: {}
            }}
            onChangeClose={setIndustrias}
            // value={industrias}
          >
            Industrias
          </FilterCheckbox>
          <FilterCheckbox
            id="supervisao-filter-contratos"
            name="contratos"
            api={{
              url: `${window.backend}/api/v1/trades/filters/contratos`,
              key_aux: ["data"],
              params: {
                page: 1
              }
            }}
            onChangeClose={setContratos}
          >
            Contratos
          </FilterCheckbox>
          <FilterCheckbox
          id="supervisao-filter-grupo"
            name="filter_grupo"
            api={{
              url: `${window.backend}/api/v1/trades/filters/produtos`,
              key_aux: ["data"],
              params: {}
            }}
            onChangeClose={setProdutos}
            // value={filterEmpreendimento}
          >
            Produtos
          </FilterCheckbox>
          <FilterCheckbox
            name="filter_status"
            options={options_status}
            onChangeClose={setStatus}
            // value={filterEmpreendimento}
          >
            Status
          </FilterCheckbox>
        </>
      );
    }
  }, [date]);

  const [show, setShow] = useState(false);
  const [checker, setChecker] = useState();
  const [statusAux, setStatusAux] = useState();
  const [amdTradeId, setadmTradeId] = useState();
  const [amdTradeSupervisaoId, setamdTradeSupervisaoId] = useState();

  //FECHAR MODAL MOTIVO
  const onHide = (response) => setShow(response);

  //ABRIR MODAL MOTIVO
  const handleShowMotivo = (checker, status, id, trade_supervisao_id) => {
    setShow(true); 
    setChecker(checker); 
    setStatusAux(status);
    setadmTradeId(id);
    setamdTradeSupervisaoId(trade_supervisao_id);
  };

  // VARIÁVEIS
  var grupo = "";

  return (
    <div className="supervisao">
      <ModalMotivo
        show={show}
        onHide={onHide}
        status={statusAux}
        trade_id={amdTradeId}
        trade_supervisao_id={amdTradeSupervisaoId}
        checker={checker}
        reload={() => get_images(true)}
      />
      {/* FILTROS TESTEIRA */}
      {/* <Filter actions={true} /> */}

      {/* FOTOS */}

      <InfiniteScroll
        dataLength={50 * page}
        hasMore={hasMore}
        next={() => get_images(false)}
        scrollableTarget={window}
      >
        {loading
          ? [...Array(3)].map((row, iRow) => (
              <div key={"loader_lojas_" + iRow} style={{ zIndex: -1 }}>
                <Col>
                  <Title loader={true} />

                  <Swiper
                    className={"swiper_trade"}
                    modules={[Navigation]}
                    autoHeight={false}
                    slidesPerView={
                      window.isMobile ? 2 : "auto"
                    }
                    spaceBetween={15}
                    navigation
                    pagination={{ clickable: true }}
                    loop={false}
                    allowTouchMove={true}
                    speed={700}
                    observeParents={true}
                    observer={true}
                    watchSlidesProgress={true}
                    breakpoints={{
                      500: {
                        allowTouchMove: false,
                        slidesPerGroupAuto: true,
                      },
                    }}
                  >
                    {[...Array(4)].map((foto, iSlide) => (
                      <SwiperSlide key={"loader_fotos_" + iRow + "_" + iSlide}>
                        <Foto loader={true} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Col>
              </div>
            ))
          : lojas.length > 0 &&
            lojas.map((loja, idx) => {
              return (
                <div className="position-relative" style={{ zIndex: lojas.length - idx }}>
                  <LojaWrapper
                    {...loja}
                    i={idx}
                    key={loja.nome + idx}
                    callback={get_images}
                    handleShowMotivo={handleShowMotivo}
                  />
                </div>
              );
            })}
      </InfiniteScroll>
    </div>
  );
}

const CustomSwipper = ({ loja_nome, trades, callback, handleShowMotivo }) => {
  const [fotos, setFotos] = useState([]);
  const [focus, setFocus] = useState(false);

  //FUNÇÃO PARA APROVAR PELO ADM
  const handleAdmResponse = ({trade_id, status, trade_supervisao_id}) => {
    axios({
      method: "post",
      url: `${window.backend}/api/v1/trades/supervisao`,
      data: {
        trade_id,
        status,
        trade_supervisao_id
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + window.token,
      },
    })
      .then(() => {
        callback(true);
        toast("Resposta cadastrada com sucesso");
      })
      .catch((_error) => {
        toast("Ocorreu um erro, tente novamente");
      });
  };

  return (
    <Swiper
      className="swiper_trade"
      modules={[Navigation]}
      autoHeight={false}
      slidesPerView={window.isMobile ? 1 : "auto"}
      spaceBetween={15}
      navigation
      pagination={{ clickable: true }}
      loop={false}
      allowTouchMove={true}
      speed={700}
      observeParents={true}
      observer={true}
      watchSlidesProgress={true}
      breakpoints={{
        500: {
          allowTouchMove: false,
          slidesPerGroupAuto: true,
        },
      }}
    >
      {trades.map((trade, i) => (
        <SwiperSlide key={i}>
         <div style={{pageBreakAfter: (i === 0 || i === 1) ? 'auto' : ( i % 5 === 0 || i % 6 === 0) ? 'always' :'auto'}}>

            <Foto
              left={[trade.modelo]}
              right={[trade.loja_imagen]}
              edit={false}
              multiple={true}
              className="swiper-foto"
              
              chat={
                <Historico
                  id={trade.id}
                  contrato={trade.descricao}
                  loja={loja_nome}
                  grupo={trade?.grupo_nome}
                  data={trade.data_inicio}
                />
              }
              // camera={true}
              aproved={{
                lojista: trade.status_loja == 2,
                adm: (trade.status == 4),
              }}
              inapplicable={{
                lojista: trade.status_loja == 4,
              }}
              reproved={{
                lojista: trade.status_loja == 3,
                adm: (trade.status == 5),
              }}
              rate={{
                adm: [3,4,5,'3','4','5'].includes(trade.status),
                supervisao: {
                  deactiveBan: true,
                  aproveAction: () =>
                    handleAdmResponse({ trade_id: trade.id, status: 4, trade_supervisao_id: trade.trade_supervisao_id }),
                  reproveAction: () => handleShowMotivo("adm", 5, trade.id, trade.trade_supervisao_id),
                },
              }}
              description={
                <>
                  {trade.descricao && (
                    <p className="mb-0"> Industria: {trade.industria_nome} </p>
                  )}
                  {trade.descricao && (
                    <p className="mb-0"> Contrato: {trade.descricao} </p>
                  )}
                  {trade.descricao && (
                    <p className="mb-0"> Produto: {trade.produto_nome} </p>
                  )}
                  {trade.data_inicio && (
                    <p className="mb-0">
                      {" "}
                      Data: {trade.data_inicio} - {trade.data_fim}{" "}
                    </p>
                  )}
                </>
              }
            />
         </div>

        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const LojaWrapper = ({
  id,
  i,
  nome,
  children,
  trades,
  callback,
  handleShowMotivo,
}) => {
  return (
    <div
      key={`trade_loja_${id}`}
      className={`${(i % 2 === 0 && "bg__light") || (i == 0 && "pt-4")} pb-4`}
      style={{ height: 340 }}
    >
      <Col>
        <div style={{pageBreakBefore: 'always'}}>
          <Title>
          {nome}
          </Title>

          <CustomSwipper
            trades={trades}
            loja_nome={nome}
            callback={callback}
            handleShowMotivo={handleShowMotivo}
          />
        </div>
      </Col>
    </div>
  );
};

const Skeleton = () => {
  return [...Array(3)].map((row, iRow) => {
    return (
      <div key={"loader_lojas_" + iRow} style={{ zIndex: -1}}>
        <Col>
          <Title loader={true} />

          <CustomSwipper>
            {new Array(4).map((foto, iSlide) => (
              <SwiperSlide key={"loader_fotos_" + iRow + "_" + iSlide}>
                <Foto loader={true} />
              </SwiperSlide>
            ))}
          </CustomSwipper>
        </Col>
      </div>
    );
  });
};
