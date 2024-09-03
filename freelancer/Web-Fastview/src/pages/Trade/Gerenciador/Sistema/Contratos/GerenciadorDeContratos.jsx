import React, { Fragment, useEffect } from "react";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import Gerenciador from "../../../../../components/body/gerenciador";
import SelectReact from "../../../../../components/body/select";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import {
  TradeInitialState,
  closeTradeEditors,
  setTradeContratoForm,
  setTradeContratoState,
  setTradeGerenciadorState,
  setTradeLojasState,
  setTradeProdutoState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Tr from "../../../../../components/body/table/tr";
import Td from "../../../../../components/body/table/tbody/td";
import Switch from "../../../../../components/body/switch";
import CadastroContrato from "./cadContrato";
import { getContratos } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import toast from "react-hot-toast";
import Loader from "../../../../../components/body/loader";
import dayjs from "dayjs";
import { ativarContrato, desativarContrato } from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import { SwiperSlide } from "swiper/react";

function GerenciadorDeContratos() {
  const contratoState = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState
  );
  const contratoForm = useTradeSelector(
    (state) => state.trade.gerenciador.forms.contrato
  );
  const produtoState = useTradeSelector(
    (state) => state.trade.gerenciador.produtosState
  );
  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );

  const selectedIndustria = useTradeSelector(
    (state) => state.trade.gerenciador.industriasState.selected
  );

  const selectedGrupo = useTradeSelector(
    state => state.trade.gerenciador.gruposState.selected
  )

  const TradeDispatch = useTradeDispatch();

  const handleSetContratoFrom = (data) => {
    TradeDispatch(setTradeContratoForm({ ...data }));
  };

  const handleSetContratoState = (data) => {
    TradeDispatch(setTradeContratoState({ ...data }));
  };

  //OPÇÕES ANO PRO SELECT CONTRATO
  const options_ano = [
    { value: 0, label: "Ano" },
    { value: 2018, label: "2018" },
    { value: 2019, label: "2019" },
    { value: 2020, label: "2020" },
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
    { value: 2025, label: "2025" },
  ];

  async function getContrato() {
    handleSetContratoState({ loading: true });
    try {
      const contratos = await getContratos({
        ativo: contratoState.ativo,
        industrias: selectedIndustria ? [selectedIndustria] : null,
        grupos: selectedGrupo ? [selectedGrupo] : null,
        data_inicio_start: dayjs(new Date(gerenciadorState.ano, 0, 1)).format(
          "YYYY-MM-DD"
        ),
      });
      handleSetContratoState({ contratos });
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    } finally {
      handleSetContratoState({ loading: false });
    }
  }



  useEffect(() => {
    getContrato();
  }, [selectedIndustria, gerenciadorState.ano, selectedGrupo]);


  const updateContrato = async (id, status) => {
    try {
      const data = await (status ? desativarContrato(id) : ativarContrato(id));
      const contratos = handleUpdateState({
        array: contratoState.contratos,
        action: "update",
        data,
      });
      handleSetContratoState({ contratos });
      toast("Ação realizada com sucesso!");
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
  };

  return (
    <>
      <Gerenciador
        id="contrato"
        title={
          <div className="flex flex-row gap-4">
            Contrato
            <SelectReact
              value={gerenciadorState.ano}
              onChange={(e) =>
                TradeDispatch(setTradeGerenciadorState({ ano: e.value }))
              }
              options={options_ano}
              required={false}
            />
          </div>
        }
        icon={
          <Icon
            type="new"
            onClick={() => {
              handleSetContratoState({ editar: true });
              handleSetContratoFrom({ ...TradeInitialState.forms.contrato });
            }}
          />
        }
        search={
          <Input
            placeholder="Pesquisar"
            value={contratoState.search}
            onChange={(e) => handleSetContratoState({ search: e.target.value })}
          />
        }
        switch={
          <Input
            type="checkbox"
            id="check_inativos_contrato"
            label="Mostrar Inativos"
            inverse={true}
            onChange={(e) =>
              handleSetContratoState({ inativos: e.target.checked })
            }
          />
        }
      >
        <Table>
          <Tbody>
            {contratoState.loading ? (
              <Tr>
                <td>
                  <Loader align={"center"} />
                </td>
              </Tr>
            ) : contratoState.contratos.length > 0 ? (
              contratoState.contratos
                .filter((item) => {
                  if (!contratoState.search) return true;
                  if (
                    item.descricao
                      .toLowerCase()
                      .includes(contratoState.search.toLowerCase()) ||
                    item.numero
                      .toString()
                      .toLowerCase()
                      .includes(contratoState.search.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((item, i) => {
                  return (
                    <Fragment key={item.id}>
                      <Tr
                        active={
                          contratoState.selected === item.id ? true : false
                        }
                        cursor="pointer"
                      >
                        <Td
                          onClick={() => {
                            if (item.ativo)
                              handleSetContratoState({
                                editar: false,
                                selected:
                                  contratoState.selected === item.id
                                    ? null
                                    : item.id,
                              }),
                                TradeDispatch(closeTradeEditors());
                                TradeDispatch(setTradeProdutoState({selected: null}))
                                TradeDispatch(setTradeGerenciadorState({editar: false}))
                          }}
                          hide={
                            !item.ativo
                              ? contratoState.inativos
                                ? false
                                : true
                              : ""
                          }
                        >
                          {`${item.numero} - (${item.descricao})`}
                        </Td>
                        { (
                          <Td
                            align="end"
                            hide={
                              !item.ativo
                                ? contratoState.inativos
                                  ? false
                                  : true
                                : ""
                            }
                          >
                            <Icon
                              type="edit"
                              //animated
                              onClick={
                                () => {
                                  handleSetContratoFrom({ ...item });
                                  handleSetContratoState({ editar: true });
                                  handleSetContratoState({selected: item.id});
                                  TradeDispatch(setTradeProdutoState({editar: false, selected: null}))
                                  TradeDispatch(setTradeGerenciadorState({editar: true}))
                                }
                                // setContratoSelected(
                                //   contratoState.contratoSelected == item.id
                                //     ? ""
                                //     : item.id
                                // ),
                                // setChecked(!checked)
                              }
                            />
                            <Switch
                              checked={item?.ativo}
                              onChange={() => {
                                updateContrato(item.id, item.ativo);
                              }}
                            />
                          </Td>
                        )}
                      </Tr>
                    </Fragment>
                  );
                })
            ) : (
              <Tr>
                <Td>Não se encontraram resultados</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Gerenciador>
    </>
  );
}

export default GerenciadorDeContratos;
