import toast from "react-hot-toast";
import { getMotivosLoja } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import {
  TradeInitialState,
  closeTradeEditors,
  setTradeGerenciadorState,
  setTradeMotivoLojaForm,
  setTradeMotivoLojaState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import CadastroMotivo from "../../Estrutura/cadMotivo";
import {
  ativarMotivoLoja,
  desativarMotivoLoja,
} from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import { Fragment, useEffect } from "react";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Tr from "../../../../../components/body/table/tr";
import Td from "../../../../../components/body/table/tbody/td";
import Switch from "../../../../../components/body/switch";
import Gerenciador from "../../../../../components/body/gerenciador";

const GerenciadorDeMotivosLoja = () => {
  const motivoLojaState = useTradeSelector(
    (state) => state.trade.gerenciador.motivoLojaState
  );
  const motivoLojaForm = useTradeSelector(
    (state) => state.trade.gerenciador.forms.motivoLoja
  );
  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );
  const TradeDispatch = useTradeDispatch();

  const handleMotivoLojaForm = (data) => {
    TradeDispatch(setTradeMotivoLojaForm({ ...data }));
  };

  const handleMotivoLojaState = (data) => {
    TradeDispatch(setTradeMotivoLojaState({ ...data }));
  };

  async function getMotivoLoja() {
    try {
      const motivosLoja = await getMotivosLoja({ ativo: [0, 1] });
      handleMotivoLojaState({ motivosLoja });
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  //DESATIVAR/REATIVAR MOTIVO
  async function updateMotivos(id, status) {
    try {
      const data = await (status
        ? desativarMotivoLoja(id)
        : ativarMotivoLoja(id));

      const motivosLoja = handleUpdateState({
        array: motivoLojaState.motivosLoja,
        action: "update",
        data,
      });

      handleMotivoLojaState({ motivosLoja });
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  useEffect(() => {
    if (!(motivoLojaState.motivosLoja.length > 0))
      getMotivoLoja();
  }, []);

  return (
    <Fragment>
      <Gerenciador
        id="motivo-supervisor"
        title="Motivo Loja"
        autoScroll={true}
        icon={
          <>
            <Icon
              type="new"
              onClick={() => {
                handleMotivoLojaForm(
                  TradeInitialState.forms.motivoLoja
                );
                handleMotivoLojaState({ editar: true });
              }}
            />
          </>
        }
        search={
          <Input
            placeholder="Pesquisar"
            value={motivoLojaState.search}
            onChange={(e) =>
              handleMotivoLojaState({ search: e.target.value })
            }
          />
        }
        switch={
          <Input
            type="checkbox"
            id="check_inativos"
            label="Mostrar Inativos"
            inverse={true}
            onChange={(e) =>
              handleMotivoLojaState({ inativos: e.target.checked })
            }
          />
        }
      >
        <Table fullHeight={true}>
          <Tbody>
            {motivoLojaState.motivosLoja &&
              motivoLojaState.motivosLoja
                .filter((item) => {
                  if (!motivoLojaState.search) return true;
                  if (
                    item.descricao
                      .toLowerCase()
                      .includes(motivoLojaState.search.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((item, i) => {
                  return (
                    <Tr
                      key={item.id}
                      cursor="pointer"
                      active={
                        motivoLojaState.selected == item.id ? true : false
                      }
                      //innerRef={(selected == item.id) ? scrollElement : {}}
                    >
                      <Td
                        hide={
                          item.ativo === false
                            ? motivoLojaState.inativos
                              ? false
                              : true
                            : ""
                        }
                        onClick={() => {
                          if (gerenciadorState.gerenciador) {
                            handleMotivoLojaState({
                              selected:
                                motivoLojaState.selected == item.id
                                  ? null
                                  : item.id,
                            });
                            TradeDispatch(closeTradeEditors());
                          }
                        }}
                      >
                        {item.descricao}
                      </Td>
                      <Td
                        align="end"
                        //animated
                        hide={
                          !item.ativo
                            ? motivoLojaState.inativos
                              ? false
                              : true
                            : ""
                        }
                      >
                        <Icon
                          type="edit"
                          onClick={() => {
                            handleMotivoLojaForm({ ...item });
                            handleMotivoLojaState({ editar: true });
                          }}
                        />
                        <Switch
                          checked={item.ativo}
                          onChange={() => updateMotivos(item.id, item.ativo)}
                        />
                      </Td>
                    </Tr>
                  );
                })}
          </Tbody>
        </Table>
      </Gerenciador>
    </Fragment>
  );
};

export default GerenciadorDeMotivosLoja;
