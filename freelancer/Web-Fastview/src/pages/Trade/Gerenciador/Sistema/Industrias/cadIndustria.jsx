import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../../../components/body/button";
import Form from "../../../../../components/body/form";
import Input from "../../../../../components/body/form/input";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import { useTradeDispatch, useTradeSelector } from "../../../States/TradeStore";
import { TradeInitialState, closeTradeEditors, setTradeIndustriaForm, setTradeIndustriaState } from "../../../States/Slices/TradeGerenciadorSlice";
import { createIndustria, updateIndustria } from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import toast from "react-hot-toast";

export default function CadastroIndustria() {

    const industriaState = useTradeSelector(state => state.trade.gerenciador.industriasState);
    const {id, nome, cnpj, contato_email, contato_nome, contato_telefone, codigo} = useTradeSelector(state => state.trade.gerenciador.forms.industria);
    const TradeDispatch = useTradeDispatch();

     const handleIndustriaForm = (data) => {
       TradeDispatch(setTradeIndustriaForm({ ...data }));
     };

     const handleIndustriaState = (data) => {
       TradeDispatch(setTradeIndustriaState({ ...data }));
     };


     const handleSubmit = async () => {
       try {
         const data = await (id
           ? updateIndustria(id, {
               nome,
               cnpj,
               codigo,
               contato_email,
               contato_nome,
               contato_telefone,
             })
           : createIndustria({
               nome,
               cnpj,
               codigo,
               contato_email,
               contato_nome,
               contato_telefone,
             }));
         const industrias = handleUpdateState({
           array: industriaState.industrias,
           action: id ? "update" : "add",
           data,
         });
         handleIndustriaState({ industrias });
         TradeDispatch(closeTradeEditors())
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
            onClick={() => handleIndustriaState({ editar: false })}
          />
        }
      >
        <Form
          submitAction={handleSubmit}
          method={id ? "put" : "post"}
          callback={() =>
            handleIndustriaForm({ ...TradeInitialState.forms.industria })
          }
        >
          <Input
            type="text"
            name="nome"
            label="Nome"
            value={nome}
            onChange={(e) => handleIndustriaForm({ nome: e.target.value })}
          />
          <Input
            type="text"
            name="codigo"
            label="Codigo"
            value={codigo}
            required={false}
            onChange={(e) => handleIndustriaForm({ codigo: e.target.value })}
          />
          <Input
            type="text"
            name="cnpj"
            label="Cnpj"
            value={cnpj}
            onChange={(e) => handleIndustriaForm({ cnpj: e.target.value })}
            required={false}
          />
          <Input
            type="text"
            name="contato_email"
            label="E-mail"
            value={contato_email}
            onChange={(e) =>
              handleIndustriaForm({ contato_email: e.target.value })
            }
            required={false}
          />
          <Input
            type="text"
            name="contato_nome"
            label="Nome para Contato"
            value={contato_nome}
            onChange={(e) =>
              handleIndustriaForm({ contato_nome: e.target.value })
            }
            required={false}
          />
          <Input
            type="text"
            name="contato_telefone"
            label="Telefone"
            mask={"(99) 9999-9999"}
            value={contato_telefone}
            onChange={(e) =>
              handleIndustriaForm({ contato_telefone: e.target.value })
            }
            required={false}
          />
          <Button type="submit">Enviar</Button>
        </Form>
      </Gerenciador>
    );
}