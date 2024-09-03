import toast from "react-hot-toast";
import { getIndustrias } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import {
  TradeInitialState,
  closeTradeEditors,
  deselectTradeComponents,
  setTradeContratoState,
  setTradeGerenciadorState,
  setTradeIndustriaForm,
  setTradeIndustriaState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import {
  ativarIndustria,
  desativarIndustria,
} from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import { Fragment, useEffect, useState } from "react";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Tr from "../../../../../components/body/table/tr";
import Td from "../../../../../components/body/table/tbody/td";
import Switch from "../../../../../components/body/switch";
import CadastroIndustria from "./cadIndustria";
import Gerenciador from "../../../../../components/body/gerenciador";
import Loader from "../../../../../components/body/loader";

const GerenciadorDeIndustrias = () => {
  const grupoState = useTradeSelector(
    (state) => state.trade.gerenciador.gruposState
  );
  const industriaState = useTradeSelector(
    (state) => state.trade.gerenciador.industriasState
  );
  const industriaForm = useTradeSelector(
    (state) => state.trade.gerenciador.forms.industria
  );
  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );

  const TradeDispatch = useTradeDispatch();

  const handleIndustriaForm = (data) => {
    TradeDispatch(setTradeIndustriaForm({ ...data }));
  };

  const handleIndustriaState = (data) => {
    TradeDispatch(setTradeIndustriaState({ ...data }));
  };

  const [page,setPage] = useState(1);

  const [industrias, setIndustrias] = useState([])


  // async function getIndustria() {
  //   handleIndustriaState({loading: true})
  //   try {
  //     const {data: industrias, current_page} = await getIndustrias({ ativo: [0, 1] }, true);
  //     handleIndustriaState({ industrias });
  //     setPage(current_page);
  //   } catch (err) {
  //     toast("Ocorreu um erro, tente novamente");
  //   }
  //   finally {
  //   handleIndustriaState({ loading: false });

  //   }
  // }


  // async function nextPage() {
  //   try{
  //     const industrias = await getIndustria({ativo: [0,1], page:page+1});
  //     handleIndustriaState({industrias: [...industriaState.industrias, ...industrias]})
  //   } catch (err) {
  //     toast("Ocorreu um erro, tente novamente");
  //   }
  // }
  const [reload, setLoad] = useState(false);

  const hanldeSetIndustrias = (e) => {
      handleIndustriaState({industrias: Array.isArray(e) ? e : e()})
  }

  async function updateIndustria(id, status) {
    try {
      const data = await (status
        ? desativarIndustria(id)
        : ativarIndustria(id));
      const industrias = handleUpdateState({
        array: industriaState.industrias,
        action: "update",
        data,
      });
      setIndustrias(industrias);
      toast("Ação realizada com sucesso!");
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  // useEffect(() => {
  //   getIndustria();
  // }, []);

  return (
    <Fragment>
      <Gerenciador
        id="industria_gerenciador"
        title="Indústria"
        autoScroll={true}
        icon={
          <>
            {!gerenciadorState.gerenciador && <Icon
              type="new"
              onClick={() => {
                handleIndustriaForm(TradeInitialState.forms.industria);
                handleIndustriaState({ editar: true });
              }}
            />}
            {gerenciadorState.gerenciador && <Icon
              type="cog"
              title="Gerenciador Estrutura"
              onClick={
                () =>
                  {
                    TradeDispatch(
                      setTradeGerenciadorState({
                        gerenciador: !gerenciadorState.gerenciador,
                      })
                    );
                    TradeDispatch(deselectTradeComponents());
                    TradeDispatch(closeTradeEditors());
                      TradeDispatch(deselectTradeComponents());
                  }
              }
            /> }
          </>
        }
        search={
          <Input
            placeholder="Pesquisar"
            value={industriaState.search}
            onChange={(e) => ( handleIndustriaState({ search: e.target.value }))}
          />
        }
        switch={
          !gerenciadorState.gerenciador && <Input
            type="checkbox"
            id="check_inativos_industria"
            label="Mostrar Inativos"
            inverse={true}
            onChange={(e) =>
              handleIndustriaState({ inativos: e.target.checked })
            }
          />
        }
      >
        <Table 
        id="table-industrias"
        fullHeight={true}
        api={window.backend+'/api/v1/trades/gerenciador/industrias'}
        params={{
          nome: industriaState.search
        }}
        key_aux={['data']}
        onLoad={setIndustrias}
        // callback={setPage}
        reload={reload}
        search={industriaState.search}
        pages={true} 
         
        >
          <Tbody>
            { industrias?.length > 0 && (
              industrias?.filter((item) => {
                  if (!industriaState.search) return true;
                  if (
                    item.nome
                      .toLowerCase()
                      .includes(industriaState.search.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((item, i) => {
                  return (
                    <Tr
                      key={item.id}
                      cursor="pointer"
                      active={industriaState.selected == item.id ? true : false}
                    >
                      <Td
                        hide={
                          item.ativo === false
                            ? industriaState.inativos
                              ? false
                              : true
                            : ""
                        }
                        onClick={() => {
                          if(gerenciadorState.gerenciador)
                          {
                            handleIndustriaState({
                              selected:
                                industriaState.selected == item.id
                                  ? ""
                                  : item.id,
                            }),
                              TradeDispatch(setTradeContratoState({selected: null}))
                              TradeDispatch(closeTradeEditors());
                          }
                        }}
                      >
                        {item.nome}
                      </Td>
                      {!gerenciadorState.gerenciador && <Td
                        align="end"
                        hide={
                          !item.ativo
                            ? industriaState.inativos
                              ? false
                              : true
                            : ""
                        }
                      >
                        <Icon
                          type="edit"
                          //animated
                          onClick={() => {
                            handleIndustriaForm({ ...item }),
                              handleIndustriaState({ editar: true });
                          }}
                        />
                        <Switch
                          checked={item.ativo}
                          onChange={() => updateIndustria(item.id, item.ativo)}
                        />
                      </Td>}
                    </Tr>
                  );
                })
            )}
          </Tbody>
        </Table>
      </Gerenciador>
    </Fragment>
  );
};

export default GerenciadorDeIndustrias;
