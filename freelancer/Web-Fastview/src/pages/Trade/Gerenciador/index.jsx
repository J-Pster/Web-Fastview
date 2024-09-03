import { useEffect, useState } from "react";
import Row from "../../../components/body/row";
import { useTradeDispatch, useTradeSelector } from "../States/TradeStore";
import { GerenciadorDeGrupos } from "./Sistema/Grupos/GerenciadorDeGrupos";
import GerenciadorDeIndustrias from "./Sistema/Industrias/GerenciadorDeIndustrias";
import GerenciadorDeMotivosSupervisor from "./Sistema/MotivosSupervisor/GerenciadorDeMotivosSupervisor";
import GerenciadorDeContratos from "./Sistema/Contratos/GerenciadorDeContratos";
import GerenciadorDeProdutos from "./Sistema/Produtos/GerenciadorDeProdutos";
import GerenciadorDeLojas from "./Sistema/Lojas/GerenciadorDeLojas";
import GerenciadorDeMotivosLoja from "./Sistema/MotivosLojas/GerenciadorDeMotivosLojas";
import Container from "../../../components/body/container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import CadastroContrato from "./Sistema/Contratos/cadContrato";
import CadastroGrupo from "./Sistema/Grupos/cadGrupo";
import CadastroIndustria from "./Sistema/Industrias/cadIndustria";
import CadastroProduto from "./Sistema/Produtos/cadProduto";
import CadastroMotivo from "./Estrutura/cadMotivo";
import CadastroMotivoLoja from "./Sistema/MotivosLojas/CadastroMotivoLoja";
import Input from "../../../components/body/form/input";
import { resetTradeGerenciadorState, setTradeMotivoSupervisorState } from "../States/Slices/TradeGerenciadorSlice";

export default function GerenciadorTrade({ icons, filters }) {
  const [swiper, setSwiper] = useState(null);

  const TradeDispatch = useTradeDispatch();

  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );

  const motivoLojaState = useTradeSelector(
    (state) => state.trade.gerenciador.motivoLojaState
  );

  const produtoState = useTradeSelector(
    (state) => state.trade.gerenciador.produtosState
  );

  const motivoSupervisorState = useTradeSelector(
    (state) => state.trade.gerenciador.motivoSupervisorState
  );

  const industriaState = useTradeSelector(
    (state) => state.trade.gerenciador.industriasState
  );

  const grupoState = useTradeSelector(
    (state) => state.trade.gerenciador.gruposState
  );

  const contratoState = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState
  );

  const selectedContrato = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState.selected
  );
  const selectedIndustria = useTradeSelector(
    (state) => state.trade.gerenciador.industriasState.selected
  );

  const selectedProduto = useTradeSelector(
    (state) => state.trade.gerenciador.produtosState.selected
  );
  //---------------------------------------------------- //////////////////// ------------------------------------------

  useEffect(() => {
    if (icons) {
      icons(<></>);
    }
    if (filters) {
      filters(
        <>
          {/* <Input
            type="date"
            format="mm/yyyy"
            icon={false}
            required={false}
            value={date}
            onChange={handleFilterData}
          /> */}
        </>
      );
    }

    return () => {
      TradeDispatch(resetTradeGerenciadorState())
    }
  }, []);

  // CALLBACK DO COMPONENTE DE MOTIVO
  const handleCallbackMotivo = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );

  return (
    <Container>
      <Row className="" wrap={false}>
        {/* <Swiper
        ref={swiper}
        focusableElements="input, select, div, button, label, option, textarea"
        preventClicks={false}
        simulateTouch={false}
        modules={[Navigation]}
        autoHeight={false}
        spaceBetween={24}
        onSwiper={(swiper) => setSwiper(swiper)}
        navigation={true}
        allowTouchMove={true}
        slidesPerView={4}
        slidesPerGroup={1}
        watchSlidesProgress={true}
        breakpoints={{
          768: {
            allowTouchMove: false,
            slidesPerView: "auto",
            slidesPerGroupAuto: true,
          },
        }}
      > */}
        {gerenciadorState.gerenciador ? (
          <>
            <GerenciadorDeIndustrias />

            {selectedIndustria && (
              <>
                <GerenciadorDeContratos />

                {contratoState.editar && (
                  <CadastroContrato />
                )}
              </>
            )}

            {selectedContrato && (
              <>
                <GerenciadorDeProdutos />

                { produtoState.editar && (
                  <CadastroProduto />
                )}
              </>
            )}
            {selectedContrato && selectedProduto != null && (
              <GerenciadorDeLojas />
            )}
          </>
        ) : (
          <>
            <GerenciadorDeGrupos />

            {grupoState.editar && <CadastroGrupo />}

            <GerenciadorDeIndustrias />

            {industriaState.editar && <CadastroIndustria />}

            <GerenciadorDeProdutos />

            {produtoState.editar && <CadastroProduto />}

            <GerenciadorDeMotivosSupervisor />

            {motivoSupervisorState.editar && <CadastroMotivo callback={handleCallbackMotivo} />}

            <GerenciadorDeMotivosLoja />

            {motivoLojaState.editar && <CadastroMotivoLoja />}
          </>
        )}
        {/* </Swiper> */}
      </Row>
    </Container>
  );
}
