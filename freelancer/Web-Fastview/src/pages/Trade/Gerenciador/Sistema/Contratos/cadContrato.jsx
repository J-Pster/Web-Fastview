import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../../../components/body/button";
import Form from "../../../../../components/body/form";
import Input from "../../../../../components/body/form/input";
import Textarea from "../../../../../components/body/form/textarea";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import { cd, get_date } from "../../../../../_assets/js/global";
import Switch from "../../../../../components/body/switch";
import { useTradeSelector } from "../../../States/TradeStore";
import { useDispatch } from "react-redux";
import { TradeInitialState, closeTradeEditors, setTradeContratoForm, setTradeContratoState } from "../../../States/Slices/TradeGerenciadorSlice";
import { createContrato, updateContrato } from "../../../Actions/Gerenciador/Mutators/GerenciadorMutators";
import { handleUpdateState } from "../../../utiles";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {format} from 'date-fns'
import SelectReact from "../../../../../components/body/select";
import e from "cors";

export default function CadastroContrato() {

    const {
      id,
      numero,
      data_inicio,
      data_fim,
      valor,
      quantidade,
      modelo,
      descricao,
      externo_id,
      grupo_id,
      industria_id,
      criar_job,
      obs,

    } = useTradeSelector((state) => state.trade.gerenciador.forms.contrato);
    const selected_grupo = useTradeSelector((state) => state.trade.gerenciador.gruposState.selected);
    const selected_industria = useTradeSelector((state) => state.trade.gerenciador.industriasState.selected);
    const contratoState = useTradeSelector(state => state.trade.gerenciador.contratosState);
    const TradeDispatch = useDispatch();

    const handleContratoForm = (data) => {
        TradeDispatch(setTradeContratoForm({...data}));
    }

    const handleContratoState = (data) => {
        TradeDispatch(setTradeContratoState({...data}));
    }

    const handleSubmit = async () => {
      try {
        const data = await (id
          ? updateContrato(id, {
              numero,
              data_inicio,
              data_fim,
              valor,
              quantidade,
              modelo,
              descricao,
              externo_id,
              grupo_id,
              industria_id,
              obs,
              
            })
          : createContrato({
              numero,
              data_inicio,
              data_fim,
              valor,
              quantidade,
              modelo,
              descricao,
              criar_job,

            //   externo_id,
              grupo_id,
              industria_id: selected_industria,
              obs
            }));
        const contratos = handleUpdateState({
          array: contratoState.contratos,
          action: id ? "update" : "add",
          data,
        });
        handleContratoState({ contratos });
        TradeDispatch(closeTradeEditors());
        toast("Contrato atualizado com sucesso");
      } catch (err) {
        toast("Ocorreu um erro, tente novamente");
      }
    };

    const [grupoOptions, setGrupoOptions] = useState([]);

    const getGrupos = () =>
      axios
        .get(`${window.backend}/api/v1/trades/filters/grupos`)
        .then((res) => Array.isArray(res.data.data) && setGrupoOptions(res.data.data))
        .catch((err) => err);

    useEffect(() => {
      getGrupos()
    },[])


    const [addJob, setAddJob] = useState(true);

    //CADASTRAR IMAGEM / MANDAR SÓ O ID
    const handleImage = (response) => {
        let modelo_aux = [];
        let aux = null;
        
        try
        {
          JSON.parse(response[0]).map((item, i) => {
            modelo_aux.push(item.id);
          });
          JSON.parse(response[0]).map((item, i) => {
            aux = item.id;
          });
        }
        catch(err)
        {
            aux = null;
        }
        finally{

          handleContratoForm({modelo: aux});
        }
    }

    return (
      <Gerenciador
        title={id ? "Editar" : "Novo"}
        icon={
          <Icon
            type="reprovar"
            title="Fechar"
            onClick={() => handleContratoState({ editar: false })}
          />
        }
      >
        <Form
          submitAction={handleSubmit}
          method={id ? "put" : "post"}
          callback={() =>
            handleContratoForm({ ...TradeInitialState.forms.contrato })
          }
          // formData={id ? true :false}
        >
          <Input
            name="numero"
            type="text"
            label="Nome"
            value={numero}
            onChange={(e) => handleContratoForm({ numero: e.target.value })}
          />
          <Input
            name="data_inicio"
            type="date"
            label="Data início"
            value={new Date(data_inicio)}
            onChange={(value) =>
              handleContratoForm({
                data_inicio: dayjs(value).add(1, "d").format("YYYY-MM-DD"),
              })
            }
          />
          <Input
            name="data_fim"
            type="date"
            label="Data fim"
            value={new Date(data_fim)}
            onChange={(value) =>
              handleContratoForm({
                data_fim: dayjs(value).add(1, "d").format("YYYY-MM-DD"),
              })
            }
          />
          <Input
            name="quatidade"
            type="text"
            label="Qtd. Lojas"
            value={quantidade}
            onChange={(e) => handleContratoForm({ quantidade: e.target.value })}
            required={false}
          />
          <Input
            name="valor"
            type="number"
            label="Valor"
            // mask={'99.99'}
            value={valor}
            onChange={(e) =>
              handleContratoForm({
                valor: e.target.value,
              })
            }
            required={false}
          />
          <Input
            name="obs"
            type="text"
            label="Observacão"
            value={obs}
            onChange={(e) => handleContratoForm({ obs: e.target.value })}
            required={false}
          />
          <Input
            name="modelo_base"
            type="file"
            label="Modelo base"
            value={modelo}
            callback={handleImage}
            multiple={false}
          />
          {/* <SelectReact
            options={grupoOptions}
            value={grupo_id}
            onChange={({ value: grupo_id }) => handleContratoForm({ grupo_id })}
            required={false}
          /> */}
          <Textarea
            name="descricao"
            label="Descrição"
            value={descricao}
            onChange={(e) => handleContratoForm({ descricao: e.target.value })}
            // required={false}
          />
          {/* <Input
            label="Adicionar ao Jobs"
            name="criar_job"
            icon={
              <Switch checked={criar_job} onChange={() =>handleContratoForm({criar_job: !criar_job})} />
            }
            readonly={false}
            required={false}
            //  onChange={(e) => (e)}
          /> */}
          <Button type="submit">Enviar</Button>
        </Form>
      </Gerenciador>
    );
}