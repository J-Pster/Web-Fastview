import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../../components/body/button";
import Form from "../../../../../components/body/form";
import Input from "../../../../../components/body/form/input";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import Textarea from "../../../../../components/body/form/textarea";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import { TradeInitialState, closeTradeEditors, setTradeProdutoForm, setTradeProdutoState } from "../../../States/Slices/TradeGerenciadorSlice";
import { createProduto, updateProduto } from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import toast from "react-hot-toast";

export default function CadastroProduto() {

    const {id, nome, modelo,descricao, categoria_id, externo_id, codigo} = useTradeSelector(state => state.trade.gerenciador.forms.produto);
    const produtoState = useTradeSelector(state =>state.trade.gerenciador.produtosState);
    const selectedContrato = useTradeSelector(state=>state.trade.gerenciador.contratosState.selected);
    const gerenciadorState = useTradeSelector(state=>state.trade.gerenciador.gerenciadorState);


    const TradeDispatch = useTradeDispatch();

    const handleSetProdutoForm = (data) => {
      TradeDispatch(setTradeProdutoForm({ ...data }));
    };

    const handleSetProdutoState = (data) => {
      TradeDispatch(setTradeProdutoState({ ...data }));
    };


      const setContratoProdutoModel = ({ modelo, produto_id, contrato_id }) =>
        axios
          .post(
            `${window.backend}/api/v1/trades/gerenciador/contratos/produtos/modelo`,
            {
              produto_id,
              contrato_id,
              modelo,
            },
            {
              headers: {
                "Authorization" : `Bearer ${window.token}`
              }
            }
          )
          .then((res) => {
            res.data;
            TradeDispatch(closeTradeEditors());
            handleSetProdutoForm({ ...TradeInitialState.forms.produto });
            modelo ? toast("Modelo cadastro com sucesso...") : toast("Modelo removido com sucesso...")
          })
          .catch((err) => {
            handleSetProdutoForm({ modelo: null });
            toast("Houve um error cadastrando o modelo, tente de novo...")
          });

    //CADASTRAR IMAGEM / MANDAR SÓ O ID
    const handleImage = (response) => {
      let modelo_aux = [];
      let aux = null;

      try {
        JSON.parse(response[0]).map((item, i) => {
          modelo_aux.push(item.id);
        });
        JSON.parse(response[0]).map((item, i) => {
          aux = item.id;
        });
      } catch (err) {
        aux = null;
      } finally {
        setContratoProdutoModel({modelo: aux, contrato_id: selectedContrato, produto_id: id})
        .then(res =>res.data);
        handleSetProdutoForm({ modelo: aux });
      }
    };

    const handleSubmit = async() => {
        try
        {
            const data = await (id ? updateProduto(id, { nome, descricao, categoria_id, externo_id, codigo }) : createProduto({ nome, descricao, categoria_id, externo_id, codigo }));
            const produtos = handleUpdateState({array: produtoState.produtos, action: id ? "update" : "add", data});
            handleSetProdutoState({produtos})
            TradeDispatch(closeTradeEditors());
            handleSetProdutoForm({...TradeInitialState.forms.produto})
            toast("Grupo atualizado com sucesso");
        }
        catch(err)
        {
             toast("Ocorreu um erro, tente novamente");
        }   
    }

    return (
      <Gerenciador
        title={id ? "Editar" : "Novo"}
        icon={
          <Icon
            type="reprovar"
            title="Fechar"
            onClick={() => {
              handleSetProdutoState({ editar: false }),
                handleSetProdutoForm({ ...TradeInitialState.forms.produto });
            }}
          />
        }
      >
        <Form
          submitAction={handleSubmit}
          method={id ? "put" : "post"}
          callback={() =>
            handleSetProdutoForm({ ...TradeInitialState.forms.produto })
          }
        >
          <Input
            label="Nome"
            value={nome}
            onChange={(e) => handleSetProdutoForm({ nome: e.target.value })}
          />
          <Input
            type="text"
            name="codigo"
            label="Codigo"
            value={codigo}
            required={false}
            onChange={(e) => handleSetProdutoForm({ codigo: e.target.value })}
          />

          {gerenciadorState.gerenciador && <Input
            name="foto"
            type="file"
            label="Modelo de exposição"
            value={modelo}
            callback={handleImage}
            multiple={false}
          />}
          <Textarea
            name="descricao"
            label="Descrição"
            value={descricao}
            onChange={(e) =>
              handleSetProdutoForm({ descricao: e.target.value })
            }
            required={false}
          />
          <Button type="submit">Enviar</Button>
        </Form>
      </Gerenciador>
    );
}