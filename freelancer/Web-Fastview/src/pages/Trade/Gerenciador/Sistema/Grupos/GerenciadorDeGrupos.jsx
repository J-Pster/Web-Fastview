import React, { Fragment, useEffect } from "react";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import { getGrupos } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import {
  TradeInitialState,
  closeTradeEditors,
  setTradeGerenciadorState,
  setTradeGrupoForm,
  setTradeGrupoState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import toast from "react-hot-toast";
import {
  ativarGrupo,
  desativarGrupo,
} from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Tr from "../../../../../components/body/table/tr";
import Td from "../../../../../components/body/table/tbody/td";
import Switch from "../../../../../components/body/switch";
import CadastroGrupo from "./cadGrupo";
import Gerenciador from "../../../../../components/body/gerenciador";
import Loader from "../../../../../components/body/loader";

export function GerenciadorDeGrupos() {
  const grupoState = useTradeSelector(
    (state) => state.trade.gerenciador.gruposState
  );
  // const grupoForm = useTradeSelector(
  //   (state) => state.trade.gerenciador.forms.grupo
  // );
  const gerenciadorState = useTradeSelector((state ) => state.trade.gerenciador.gerenciadorState);
  const TradeDispatch = useTradeDispatch();

  const getGrupo = async () => {
    handleGrupoState({loading: true})
    try {
      const grupos = await getGrupos({
        ativo: [0, 1],
      });

      TradeDispatch(setTradeGrupoState({ grupos }));
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
    finally {
    handleGrupoState({ loading: false });

    }
  };

  const handleGrupoForm = (data) => {
    TradeDispatch(setTradeGrupoForm({ ...data }));
  };

  const handleGrupoState = (data) => {
    TradeDispatch(setTradeGrupoState({ ...data }));
  };

  useEffect(() => {

    if(!(grupoState.grupos.length > 0)) getGrupo();
  }, []);

  async function updateGrupos(id, status) {
    try {
      const data = await (status ? desativarGrupo(id) : ativarGrupo(id));
      const grupos = handleUpdateState({
        array: grupoState.grupos,
        action: "update",
        data,
      });
      handleGrupoState({ grupos });
      toast("Ação realizada com sucesso!");
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  return (
    <Fragment>
      <Gerenciador
        id="Grupo_gerenciador"
        title="Grupo"
        autoScroll={true}
        icon={
          !gerenciadorState.gerenciador && (
            <>
              <Icon
                type="enter"
                title="Gerenciador Sistema"
                onClick={
                  () =>
                    TradeDispatch(
                      TradeDispatch(
                        setTradeGerenciadorState({
                          gerenciador: !gerenciadorState.gerenciador,
                        })
                      ),
                      TradeDispatch(closeTradeEditors())
                    )
                  // handleIndustriaState({ editar: false })
                }
              />
              <Icon
                type="new"
                onClick={() => {
                  handleGrupoForm(TradeInitialState.forms.grupo);
                  handleGrupoState({ editar: true });
                }}
              />
            </>
          )
        }
        search={
          <Input
            placeholder="Pesquisar"
            value={grupoState.search}
            onChange={(e) => handleGrupoState({ search: e.target.value })}
          />
        }
        switch={
          !gerenciadorState.gerenciador && (
            <Input
              type="checkbox"
              id="check_inativos_Grupo"
              label="Mostrar Inativos"
              inverse={true}
              onChange={({ target: { checked } }) => {
                handleGrupoState({ inativos: checked });
              }}
            />
          )
        }
      >
        <Table fullHeight={true}>
          <Tbody>
            {grupoState.loading ? (
              <Tr>
                <td>
                  <Loader align={"center"} />
                </td>
              </Tr>
            ) : grupoState.grupos.length > 0 ? (
              grupoState.grupos
                .filter((item) => {
                  if (!grupoState.search) return true;
                  if (
                    item.nome
                      .toLowerCase()
                      .includes(grupoState.search.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((item, i) => {
                  return (
                    <Fragment key={item.id}>
                      {
                        <Tr
                          cursor="pointer"
                          active={grupoState.selected == item.id ? true : false}
                        >
                          <Td
                            hide={!grupoState.inativos && !item.ativo}
                            onClick={() => (
                              handleGrupoState({
                                selected:
                                  grupoState.selected == item.id
                                    ? null
                                    : item.id,
                              }),
                              TradeDispatch(closeTradeEditors())
                            )}
                          >
                            {item.nome}
                          </Td>
                          {!gerenciadorState.gerenciador && (
                            <Td
                              align="end"
                              hide={!grupoState.inativos && !item.ativo}
                            >
                              <Icon
                                type="edit"
                                //animated
                                onClick={() => {
                                  handleGrupoForm({ ...item });
                                  handleGrupoState({ editar: true });
                                }}
                              />
                              <Switch
                                checked={item.ativo}
                                onChange={() =>
                                  updateGrupos(item.id, item.ativo)
                                }
                              />
                            </Td>
                          )}
                        </Tr>
                      }
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
    </Fragment>
  );
}

