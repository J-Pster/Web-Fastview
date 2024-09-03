import Button from "../../../../../components/body/button";
import Form from "../../../../../components/body/form";
import Input from "../../../../../components/body/form/input";
import CheckboxGroup from '../../../../../components/body/form/checkboxGroup';
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import { createGrupo, updateGrupo } from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import toast from "react-hot-toast";
import { handleUpdateState } from "../../../utiles";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import { closeTradeEditors, setTradeGrupoForm, setTradeGrupoState } from "../../../States/Slices/TradeGerenciadorSlice";

export default function CadastroGrupo() {

    const grupoState = useTradeSelector(state => state.trade.gerenciador.gruposState);
    const {id, nome, produtos, contratos} = useTradeSelector(state => state.trade.gerenciador.forms.grupo);
    const TradeDispatch = useTradeDispatch();

    const handleGrupoForm = (data) => {
      TradeDispatch(setTradeGrupoForm({ ...data }));
    };

    const handleGrupoState = (data) => {
      TradeDispatch(setTradeGrupoState({ ...data }));
    };

    const handleSubmit = async() => {
        try
        {
            const data = await (id ? updateGrupo(id, { nome, produtos, contratos }) : createGrupo({ nome, produtos, contratos }));
            const grupos = handleUpdateState({array: grupoState.grupos, action: id ? "update" : "add", data});
            handleGrupoState({grupos, editar:false})
         TradeDispatch(closeTradeEditors());
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
            onClick={() => handleGrupoState({ editar: false })}
          />
        }
      >
        <Form
        submitAction={handleSubmit}
          method={id ? "put" : "post"}
          callback={() => handleGrupoForm({ id: null, nome: null, produtos: [], contratos: [] })}
        >
          <Input
            type="text"
            name="nome"
            label="Nome"
            value={nome}
            onChange={(e) => handleGrupoForm({ nome: e.target.value })}
          />

          <CheckboxGroup
            name="contratos"
            label="Contratos"
            api={{
              url: window.backend+'/api/v1/trades/gerenciador/contratos',
              params: {
                ativo: [1]
              },
              key_aux: ['data']
            }}
            aux={{
              id: 'id',
              nome: 'numero'
            }}
            required={false}
            value={contratos}
            callback={(contratos) => handleGrupoForm({ contratos })}
          />

          <CheckboxGroup
            name="produtos"
            label="Produtos"
            api={{
              url: window.backend+'/api/v1/trades/gerenciador/produtos',
              params: {
                ativo: [1],
                filter_checked: 0
              },
              key_aux: ['data']
            }}
            required={false}
            value={produtos}
            callback={(produtos) => handleGrupoForm({ produtos })}
          />

          <Button type="submit">Enviar</Button>
        </Form>
      </Gerenciador>
    );
}