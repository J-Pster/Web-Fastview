import { useEffect, useState } from "react";
import Button from "../../../../../components/body/button";
import Form from "../../../../../components/body/form";
import Input from "../../../../../components/body/form/input";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import {
  TradeInitialState,
  closeTradeEditors,
  setTradeMotivoLojaForm,
  setTradeMotivoLojaState,
} from "../../../States/Slices/TradeGerenciadorSlice";
import {
  createMotivoLoja,
  updateMotivoLoja,
} from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import toast from "react-hot-toast";

export default function CadastroMotivoLoja() {
  const { id, descricao } = useTradeSelector(
    (state) => state.trade.gerenciador.forms.motivoLoja
  );
  const motivoReprovaState = useTradeSelector(
    (state) => state.trade.gerenciador.motivoLojaState
  );
  const TradeDispatch = useTradeDispatch();

  const handleMotivoLojaForm = (data) => {
    TradeDispatch(setTradeMotivoLojaForm({ ...data }));
  };

  const handleMotivoLojaState = (data) => {
    TradeDispatch(setTradeMotivoLojaState({ ...data }));
  };

  const handleSubmit = async () => {
    try {
      const data = await (id
        ? updateMotivoLoja(id, { descricao })
        : createMotivoLoja({ id, descricao }));
      const motivosLoja = handleUpdateState({
        array: motivoReprovaState.motivosLoja,
        action: id ? "update" : "add",
        data,
      });
      handleMotivoLojaState({ motivosLoja });
      TradeDispatch(closeTradeEditors());
      toast("Grupo atualizado com sucesso");
    } catch (err) {
      toast("Ocorreu um erro, tente novamente");
    }
  };

  return (
    <Gerenciador
      title={id ? "Editar" : "Novo"}
      icon={
        <Icon
          type="reprovar"
          title="Fechar"
          onClick={() => (
            handleMotivoLojaState({ editar: false }),
            handleMotivoLojaForm(TradeInitialState.forms.motivoLoja)
          )}
        />
      }
    >
      <Form
        submitAction={handleSubmit}
        method={id ? "put" : "post"}
        callback={() =>
          handleMotivoLojaForm({
            ...TradeInitialState.forms.motivoLoja,
          })
        }
      >
        <Input
          label="Nome"
          value={descricao}
          onChange={(e) =>
            handleMotivoLojaForm({ descricao: e.target.value })
          }
        />
        <Button type="submit">Enviar</Button>
      </Form>
    </Gerenciador>
  );
}
