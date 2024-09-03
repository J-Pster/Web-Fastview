import toast from "react-hot-toast";
import { getMotivosSupervisor } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import { TradeInitialState, closeTradeEditors, deselectTradeComponents, setTradeGerenciadorState, setTradeMotivoSupervisorForm, setTradeMotivoSupervisorState } from "../../../States/Slices/TradeGerenciadorSlice";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import CadastroMotivo from "../../Estrutura/cadMotivo";
import { ativarMotivoSupervisor, desativarMotivoSupervisor } from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
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

const GerenciadorDeMotivosSupervisor = () => {
  const motivoSupervisorState = useTradeSelector(
    (state) => state.trade.gerenciador.motivoSupervisorState
  );
  const motivoSupervisorForm = useTradeSelector(
    (state) => state.trade.gerenciador.forms.motivoSupervisor
  );
  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );
  const TradeDispatch = useTradeDispatch();

  const handleMotivoSupervisorForm = (data) => {
    TradeDispatch(setTradeMotivoSupervisorForm({ ...data }));
  };

  const handleMotivoSupervisorState = (data) => {
    TradeDispatch(setTradeMotivoSupervisorState({ ...data }));
  };

  async function getMotivoSupervisor() {
    try {
      const motivosSupervisor = await getMotivosSupervisor({ ativo: [0, 1] });
      handleMotivoSupervisorState({ motivosSupervisor });
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  //DESATIVAR/REATIVAR MOTIVO
  async function updateMotivos(id, status) {
    try {
      const data = await (status
        ? desativarMotivoSupervisor(id)
        : ativarMotivoSupervisor(id));

      const motivosSupervisor = handleUpdateState({
        array: motivoSupervisorState.motivosSupervisor,
        action: "update",
        data,
      });

      handleMotivoSupervisorState({ motivosSupervisor });
      TradeDispatch(closeTradeEditors());
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  useEffect(() => {
    if(!(motivoSupervisorState.motivosSupervisor.length > 0)) getMotivoSupervisor();
  }, []);
  return (
    <Fragment>
      <Gerenciador
        id="motivo-supervisor"
        title="Motivo Supervisor"
        autoScroll={true}
        icon={
          <>
            <Icon
              type="new"
              onClick={() => {
                handleMotivoSupervisorForm(TradeInitialState.forms.motivoSupervisor);
                handleMotivoSupervisorState({ editar: true });
              }}
            />
          </>
        }
        search={
          <Input
            placeholder="Pesquisar"
            value={motivoSupervisorState.search}
            onChange={(e) =>
              handleMotivoSupervisorState({ search: e.target.value })
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
              handleMotivoSupervisorState({ inativos: e.target.checked })
            }
          />
        }
      >
        <Table fullHeight={true}>
          <Tbody>
            {motivoSupervisorState.motivosSupervisor &&
              motivoSupervisorState.motivosSupervisor
                .filter((item) => {
                  if (!motivoSupervisorState.search) return true;
                  if (
                    item.descricao
                      .toLowerCase()
                      .includes(motivoSupervisorState.search.toLowerCase())
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
                        motivoSupervisorState.selected == item.id ? true : false
                      }
                      //innerRef={(selected == item.id) ? scrollElement : {}}
                    >
                      <Td
                        hide={
                          item.ativo === false
                            ? motivoSupervisorState.inativos
                              ? false
                              : true
                            : ""
                        }
                        onClick={() => {
                          if(gerenciadorState.gerenciador)
                          {
                            handleMotivoSupervisorState({ selected: motivoSupervisorState.selected == item.id ? null : item.id });
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
                            ? motivoSupervisorState.inativos
                              ? false
                              : true
                            : ""
                        }
                      >
                        <Icon
                          type="edit"
                          onClick={ () => {handleMotivoSupervisorForm({ ...item }); handleMotivoSupervisorState({editar: true})}}
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

export default GerenciadorDeMotivosSupervisor;