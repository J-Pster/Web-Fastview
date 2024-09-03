import { useState, useEffect } from "react";
import axios from "axios";
import Form from "../../../../../components/body/form";
import Gerenciador from "../../../../../components/body/gerenciador";
import CheckboxGroup from "../../../../../components/body/form/checkboxGroup";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import SelectReact from "../../../../../components/body/select";
import Button from "../../../../../components/body/button";

export default function NovaSecao({ id_table, checklist_id_table, nome_table, cargos_table, comunicado_table, posicao_table, callback, callback_close }) {
    // ESTADOS
    const [formStatus, setFormStatus] = useState('');

    // ESTADOS  DOS CAMPOS
    const [nome, setNome] = useState('');
    const [posicao, setPosicao] = useState('');
    const [planoAcao, setPlanoAcao] = useState('');
    const [optionCargos, setOptionCargos] = useState([]);
    const [cargos, setCargos] = useState('');

    //LISTAR CARGOS
    useEffect(() => {
        if (optionCargos.length == 0) {
            axios({
                method: 'get',
                url: window.host + '/api/sql.php?do=select&component=cargo'
            }).then((response) => {
                setOptionCargos(response.data);
            })
        }
    });

    // SELECIONAR CARGOS
    function handleSetCargos(e) {
        setCargos(e);
    }

    useEffect(() => {
        if (id_table) {
            setNome(nome_table);
            setPosicao(posicao_table);
            setPlanoAcao(comunicado_table);
            setCargos(cargos_table && cargos_table.split(","));
        } else if (!id_table) {
            setNome('');
            setPosicao('');
            setPlanoAcao('');
            setCargos('');
        }
    }, [id_table]);

    //ENVIAR AS INFORMAÇÕES DO INPUT PARA A API
    const data = {
        secoes_id: id_table ? id_table : '',
        checklist_id: checklist_id_table,
        secoes_nome: nome,
        secoes_posicao: posicao,
        disparar_comunicado_plano_acao: planoAcao,
        filtro_checkbox_item: '',
        checklists_cargo: cargos
    };

    //LIMPAR OS INPUTS AO ENVIAR FORMULÁRIO
    function resetForm() {
        setNome('');
        setPosicao('');
        setPlanoAcao('');
        setCargos('');
        callback(true);
        callback_close(false)
    }

    // CALLBACK STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    return (
        <Gerenciador
            title={id_table ? "Editar" : "Novo"}
            icon={<Icon type="reprovar" title="Fechar" onClick={() => callback_close(false)} />}
        >
            <Form
                api={window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=post_secoes"}
                data={data}
                callback={resetForm}
                toast={"Salvo com sucesso"}
                status={handleFormStatus}
            >
                <Input
                    type="text"
                    name="nome"
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <Input
                    type="text"
                    name="posicao"
                    label="Posição"
                    value={posicao}
                    onChange={(e) => setPosicao(e.target.value)}
                />
                <SelectReact
                    name="comunicado"
                    label="Disparar comunicado no plano de ação"
                    value={planoAcao}
                    onChange={(e) => setPlanoAcao(e.value)}
                    options={[{ value: 1, label: "Sim" }, { value: 2, label: "Não" }]}
                />
                <CheckboxGroup
                    group="cargo"
                    callback={handleSetCargos}
                    required={false}
                    value={cargos}
                />
                
                <Button
                    type="submit"
                    status={formStatus}
                >
                    Salvar
                </Button>
            </Form>
        </Gerenciador>
    )
}