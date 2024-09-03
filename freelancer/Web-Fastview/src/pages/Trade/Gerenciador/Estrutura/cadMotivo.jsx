import { useEffect, useState } from "react";
import Button from "../../../../components/body/button";
import Form from "../../../../components/body/form";
import Input from "../../../../components/body/form/input";
import Gerenciador from "../../../../components/body/gerenciador";
import Icon from "../../../../components/body/icon";
import { useTradeDispatch, useTradeSelector } from "../../States/TradeStore";
import { TradeInitialState, setTradeMotivoSupervisorForm, setTradeMotivoSupervisorState } from "../../States/Slices/TradeGerenciadorSlice";
import { createMotivoSupervisor, updateMotivoSupervisor } from "../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../utiles";
import toast from "react-hot-toast";

export default function CadastroMotivo() {
    const {id, descricao} = useTradeSelector(state => state.trade.gerenciador.forms.motivoSupervisor);
    const motivoReprovaState = useTradeSelector(state => state.trade.gerenciador.motivoSupervisorState);
    const TradeDispatch = useTradeDispatch();


    const handleMotivoSupervisorForm = (data) => {
      TradeDispatch(setTradeMotivoSupervisorForm({ ...data }));
    };

    const handleMotivoSupervisorState = (data) => {
      TradeDispatch(setTradeMotivoSupervisorState({ ...data }));
    };

    const handleSubmit = async () => {
      try {
        const data = await (id
          ? updateMotivoSupervisor(id, {id, descricao})
          : createMotivoSupervisor({id, descricao}));
        const motivosSupervisor = handleUpdateState({
          array: motivoReprovaState.motivosSupervisor,
          action: id ? "update" : "add",
          data,
        });
        handleMotivoSupervisorState({ motivosSupervisor, editar: false });
        toast("Motivo atualizado com sucesso");        
      } catch (err) {
        toast("Ocorreu um erro, tente novamente");
      }
    };

    return (
        <Gerenciador
            title={id ? "Editar" : "Novo"}
            icon={<Icon type="reprovar" title="Fechar" onClick={() => (handleMotivoSupervisorState({editar: false}), handleMotivoSupervisorForm(TradeInitialState.forms.motivoSupervisor))} />}
        >
            <Form
                submitAction={handleSubmit}
                method={id ? 'put' : 'post'}
                callback={() => handleMotivoSupervisorForm({...TradeInitialState.forms.motivoSupervisor})}
            >
                <Input
                    label="Nome"
                    value={descricao}
                    onChange={(e) => handleMotivoSupervisorForm({descricao: e.target.value})}
                />
                <Button type='submit'>Enviar</Button>
            </Form>
        </Gerenciador>
    )
}