import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import Gerenciador from "../../../../../components/body/gerenciador";
import {
  TradeInitialState,
  closeTradeEditors,
  setTradeContratoState,
  setTradeLojasState,
  setTradeProdutoForm,
  setTradeProdutoState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import Table from "../../../../../components/body/table";
import Tbody from "../../../../../components/body/table/tbody";
import Tr from "../../../../../components/body/table/tr";
import Td from "../../../../../components/body/table/tbody/td";
import Switch from "../../../../../components/body/switch";
import {
  addContratoProduto,
  ativarProduto,
  desativarProduto,
} from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import toast from "react-hot-toast";
import { getProdutos } from "../../../Actions/Gerenciador/Fetchers/GerenciadorFetchers";
import Loader from "../../../../../components/body/loader";
import { GlobalContext } from "../../../../../context/Global";
import { sortBy } from "lodash";

function GerenciadorDeProdutos() {
  const timerRef = useRef(null);

  // CONTEXT
  const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

  const produtoState = useTradeSelector(
    (state) => state.trade.gerenciador.produtosState
  );
  const produtoForm = useTradeSelector(
    (state) => state.trade.gerenciador.forms.produto
  );
  const selectedContrato = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState.selected
  );
  const contratoProdutos = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState.contratoProdutos
  );
  const gerenciadorState = useTradeSelector(
    (state) => state.trade.gerenciador.gerenciadorState
  );

  const contratosState = useTradeSelector(
    (state) => state.trade.gerenciador.contratosState
  );

  const industriasState = useTradeSelector(
    (state) => state.trade.gerenciador.industriasState
  )

  const TradeDispatch = useTradeDispatch();

  const handleProdutoFrom = (data) => {
    TradeDispatch(setTradeProdutoForm({ ...data }));
  };

  const handleProdutoState = (data) => {
    TradeDispatch(setTradeProdutoState({ ...data }));
  };

  const [produtosAux, setProdutosAux] = useState();

  const [reload, setLoad] = useState(false);
  const [page,setPage] = useState(1);
  const [produtos, setProdutos] = useState([]);
  const [loadingItem, setLoadingItem] = useState([]);

  const handleSetProdutos = (e) => {
      setProdutos(e);
      // console.log(Array.isArray(e) ? e : e())
      
  }

  useEffect(() => {
    const contratoProdutos = produtos
        .map((item) => item.checked && item.id)
        .filter((item) => item !== null);
      TradeDispatch(setTradeContratoState({ contratoProdutos }));
      handleProdutoState({ produtos })
      setProdutosAux(contratoProdutos);
      setLoadingItem([]);
  }, [produtos])

  const updateProdutos = async (id, status) => {
    try {
      const data = await (status ? desativarProduto(id) : ativarProduto(id));
      const produtos = handleUpdateState({
        array: produtoState.produtos,
        action: "update",
        data,
      });
      setProdutos(produtos);     
      toast("Ação realizada com sucesso!");
    } catch (erro) {
      toast("Ocorreu um erro, tente novamente");
    }
  };

  async function getProdutosList(withLoading = true) {
    withLoading && handleProdutoState({ loading: true });
    try {
      const produtos = await getProdutos({
        ativo: produtoState.ativo,
        contratos: selectedContrato ? [selectedContrato] : null,
        ano: gerenciadorState.ano,
        filter_checked: selectedContrato !== null ? 1 : 0,
      });

      setProdutos(produtos);
      const contratoProdutos = produtos
        .map((item) => item.checked && item.id)
        .filter((item) => item !== null);
      TradeDispatch(setTradeContratoState({ contratoProdutos }));
      setProdutosAux(contratoProdutos);
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    } finally {
      withLoading && handleProdutoState({ loading: false });
    }
  }

  // useEffect(() => {
  //   getProdutosList();
  // }, [selectedContrato]);

  const updateContratoProduto = async ({ produtos }) => {
    try {
      await addContratoProduto({
        contrato_id: selectedContrato,
        produtos,
      });
      setLoad(prev => !prev);
      toast("Produtos atualizados corretamente");
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    }
  };

  async function handleContratoProduto({ produto_id, action }) {
    setLoadingItem(loadingItem => [...loadingItem, produto_id]);

    let ids = [...produtosAux];

    if (action === "remove") ids = ids.filter((item) => item !== produto_id);
    if (action === "add") ids.push(produto_id);
    // TradeDispatch(setTradeContratoState({ contratoProdutos: ids }));

    setProdutosAux(ids);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateContratoProduto({ produtos: ids });      
    },1000);
  }

  //MOSTRAR IMAGEM
  const handleClick = (img) => {
    handleSetToggler(true);
    handleSetSources([img], 0);
  };

  return (
    <>
      <Gerenciador
        id="produto"
        title="Produto"
        autoScroll={true}
        icon={
          !gerenciadorState.gerenciador && (
            <Icon
              type="new"
              onClick={() => {
                handleProdutoState({ editar: true });
                handleProdutoFrom({ ...TradeInitialState.forms.produto });
              }}
            />
          )
        }
        search={
          <Input
            placeholder="Pesquisar"
            value={produtoState.search}
            onChange={(e) => handleProdutoState({ search: e.target.value })}
          />
        }
        switch={
          <Input
            type="checkbox"
            id="check_inativos"
            label="Mostrar Inativos"
            inverse={true}
            onChange={(e) => handleProdutoState({ inativos: e.target.checked })}
          />
        }
      >
        <Table 
        id="table-produtos"
          api={`${window.backend}/api/v1/trades/gerenciador/produtos`}
          params={{
              nome: produtoState.search,
              ativo: produtoState.ativo,
              contratos: selectedContrato ? [selectedContrato] : null,
              ano: gerenciadorState.ano,
              filter_checked: selectedContrato !== null && !contratosState.editar ? 1 : 0,
          }}
          key_aux={['data']}
          onLoad={handleSetProdutos}
          // callback={setPage}
          reload={reload + selectedContrato + contratosState.editar}
          search={produtoState.search}
          pages={true} 
        >
          <Tbody>
            { produtoState.produtos?.length > 0 && (
              sortBy(produtoState.produtos, 'nome')?.filter((item) => {
                  if (!produtoState.search) return true;
                  if (
                    item.nome
                      .toLowerCase()
                      .includes(produtoState.search.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((item, i) => {
                  let imagem_modelo;

                  if (item?.modelo?.includes("http")) {
                    imagem_modelo = item?.modelo;
                  } else if (item?.modelo !== null) {
                    imagem_modelo = `${window.upload}/${item?.modelo}`;
                  }
                  if (
                    gerenciadorState.gerenciador
                      ? !gerenciadorState.editar
                        ? item.checked
                        : produtoState.inativos
                        ? true
                        : item.ativo
                      : true
                  )
                    return (
                      <Fragment key={`trade_produto_${item?.id}`}>
                        <Tr
                          key={item.id}
                          active={
                            produtoState.selected === item.id ? true : false
                          }
                          cursor="pointer"
                        >
                          <Td
                            onClick={() => {
                              if (gerenciadorState.gerenciador) {
                                handleProdutoState({
                                  selected:
                                    produtoState.selected == item.id
                                      ? null
                                      : item.id,
                                });
                                TradeDispatch(closeTradeEditors());
                              }
                            }}
                            hide={
                              !item.ativo
                                ? produtoState.inativos
                                  ? false
                                  : true
                                : ""
                            }
                          >
                            {item.nome}
                          </Td>
                          {!gerenciadorState.gerenciador ||
                          produtoState.inativos ? (
                            <Td
                              align="end"
                              hide={
                                !item.ativo
                                  ? produtoState.inativos
                                    ? false
                                    : true
                                  : ""
                              }
                            >
                              <Icon
                                type="edit"
                                //animated
                                onClick={() => {
                                  handleProdutoFrom({ ...item });
                                  handleProdutoState({ editar: true });
                                  TradeDispatch(setTradeLojasState({}))
                                }}
                              />
                              <Switch
                                checked={item?.ativo == 1}
                                onChange={() =>
                                  updateProdutos(item.id, item?.ativo)
                                }
                              />
                            </Td>
                          ) : (
                            item.ativo && (
                              <Td align="end">
                                {gerenciadorState.editar && (
                                  <Icon
                                    type="edit"
                                    //animated
                                    onClick={() => {
                                      handleProdutoFrom({ ...item });
                                      handleProdutoState({ editar: true });
                                      TradeDispatch(
                                        setTradeContratoState({ editar: false })
                                      );
                                    }}
                                  />
                                )}

                                {(loadingItem?.includes(item?.id) ?
                                  <Loader className="ps-1" />
                                :
                                  <Input
                                    type="checkbox"
                                    id="check_contrato_produto"
                                    inverse={true}
                                    hide={!gerenciadorState.editar}
                                    checked={item.checked !== null}
                                    onChange={(e) =>
                                      handleContratoProduto({
                                        contrato_id: selectedContrato,
                                        produto_id: item.id,
                                        action: !e.target.checked
                                          ? "remove"
                                          : "add",
                                      })
                                    }
                                  />
                                )}

                                {item?.modelo && !gerenciadorState.editar && (
                                  <div className="">
                                    <Icon
                                      type="view"
                                      animated
                                      onClick={() => handleClick(imagem_modelo)}
                                    />
                                  </div>
                                )}
                              </Td>
                            )
                          )}
                        </Tr>
                      </Fragment>
                    );
                })
            ) }
          </Tbody>
        </Table>
      </Gerenciador>
    </>
  );
}

export default GerenciadorDeProdutos;
