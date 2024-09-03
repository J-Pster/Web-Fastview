import { useEffect, useRef } from "react";
import Gerenciador from "../../../../../components/body/gerenciador";
import Table from "../../../../../components/body/table";
import Td from "../../../../../components/body/table/tbody/td";
import Tr from "../../../../../components/body/table/tr";
import Input from "../../../../../components/body/form/input";
import Loader from "../../../../../components/body/loader";
import { toast } from "react-hot-toast";
import Tbody from "../../../../../components/body/table/tbody";
import { throttle } from "../../../utiles";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import { getLojas } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import {
  closeTradeEditors,
  setTradeContratoState,
  setTradeLojaForm,
  setTradeLojasState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import {
  addContratoProdutoLoja,
  createTrade,
} from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { map, uniq } from "lodash";

export default function GerenciadorDeLojas() {
  const lojasTimerRef = useRef(null);

  const lojasState = useTradeSelector(
    (state) => state.trade.gerenciador.lojasState
  );
  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );
  const selectedIndustria = useTradeSelector(
    (state) => state.trade.gerenciador.industriasState.selected
  );
  const selectedContrato = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState.selected
  );

  const selectedProduto = useTradeSelector(
    (state) => state.trade.gerenciador.produtosState.selected
  )

  const { contratoProdutos, contratoLojas } = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState
  );

  const contratosState = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState
  );

  const TradeDispatch = useTradeDispatch();

  const handleLojasState = (data) => {
    TradeDispatch(setTradeLojasState({ ...data }));
  };

  const getLojasList = async (withLoading = true) => {
    withLoading && handleLojasState({ loading: true });
    try {
      const lojas = await getLojas({
        ativo: lojasState.ativo,
        contrato_id: selectedContrato,
        produtos: [selectedProduto],
        ano: gerenciadorState.ano,
        filter_checked: 1,
      });
      handleLojasState({ lojas });
      const contratoLojas = lojas
        .map((item) => (item.checked ? item.id : null))
        .filter((item) => item !== null);
      TradeDispatch(setTradeContratoState({ contratoLojas }));
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    } finally {
      withLoading && handleLojasState({ loading: false });
    }
  };

  useEffect(() => {
    getLojasList();
  }, [selectedIndustria, selectedContrato, contratoProdutos, selectedProduto]);

  async function updateContratoLoja({ lojas }) {
    try {
      await createTrade({
        lojas,
        contrato_id: selectedContrato,
        produto_id: selectedProduto
      });
      getLojasList(false);
      TradeDispatch(closeTradeEditors());
      toast("Lojas atualizados corretamente");
    } catch (e) {
      toast("Ocorreu um erro, tente novamente");
    }
  }

  async function handleContratoLoja({ loja_id, action, newArr = [] }) {
    let ids = [...contratoLojas];
    if(newArr.length > 0)
    {
      ids = newArr
    }
    else
    {
      if (action === "remove") ids = ids.filter((item) => item !== loja_id);
      if (action === "add") ids.push(loja_id);
    }    
    uniq(ids)
    TradeDispatch(setTradeContratoState({ contratoLojas: ids }));
    clearTimeout(lojasTimerRef.current);
    lojasTimerRef.current = setTimeout(
      () => updateContratoLoja({ lojas: ids }),
      1000
    );
  }

  return (
    <Gerenciador
      id="produto"
      title={`Filial`}
      search={
        <Input
          placeholder="Pesquisar"
          value={lojasState.search}
          onChange={(e) => handleLojasState({ search: e.target.value })}
        />
      }
      switch={
        <Input
          type="checkbox"
          id="check_filial"
          label="Selecionar todos"
          inverse={true}
          onChange={(e) => {
              const newArr = map(lojasState.lojas, (item) => item.id);
              handleContratoLoja({newArr})
          }}
        />
      }
      autoScroll={true}
    >
      <Table fullHeight={true}>
        <Tbody>
          {!(contratoProdutos.length > 0 && contratoProdutos.includes(selectedProduto)) ? (
            <Tr>
              <Td>Deve adicionar produtos ao contrato para adicionar lojas.</Td>
            </Tr>
          ) : (
            <>
              {lojasState.loading ? (
                <Tr>
                  <td>
                    <Loader align={"center"} />
                  </td>
                </Tr>
              ) : lojasState.lojas.length > 0 ? (
                lojasState.lojas
                  .filter((item) => {
                    if (!lojasState.search) return true;
                    if (
                      item.nome
                        .toLowerCase()
                        .includes(lojasState.search.toLowerCase())
                    ) {
                      return true;
                    }
                  })
                  .map((item, i) => {
                    if (
                      gerenciadorState.gerenciador
                        ? !gerenciadorState.editar
                          ? item.checked
                          : lojasState.inativos
                          ? true
                          : item.ativo
                        : true
                    )
                      return (
                        <Tr key={item.id}>
                          <Td>{item.nome}</Td>
                          <Td align="end">
                            <Input
                              type="checkbox"
                              id={`check_filial - ${item.id}`}
                              // label="Mostrar Inativos"
                              inverse={true}
                              hide={!gerenciadorState.editar}
                              checked={item.checked}
                              onChange={(e) =>
                                handleContratoLoja({
                                  contrato_id: selectedContrato,
                                  loja_id: item.id,
                                  action: !e.target.checked ? "remove" : "add",
                                })
                              }
                            />
                          </Td>
                        </Tr>
                      );
                  })
              ) : (
                <Tr>
                  <Td>Não se encontraram resultados</Td>
                </Tr>
              )}
            </>
          )}
        </Tbody>
      </Table>
    </Gerenciador>
  );
}
