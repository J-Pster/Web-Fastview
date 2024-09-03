import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../../../components/body/button";
import CheckboxGroup from "../../../../../components/body/form/checkboxGroup";
import Form from "../../../../../components/body/form";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import SelectReact from "../../../../../components/body/select";
import Switch from '../../../../../components/body/switch';
import InputContainer from "../../../../../components/body/form/inputcontainer";

export default function NovoChecklist({ id_table, nome_table, tipo_id_table, frequencia_table, sistema_id_table, sistema_table, tipo_sistema_table, notificacao_table, meta_table, cargos_table, callback, callback_close, edit_check }) {

    // ESTADOS
    const [formStatus, setFormStatus] = useState('');

    // ESTADOS DOS CAMPOS
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [frequencia, setFrequencia] = useState('');
    const [sistema, setSistema] = useState('');
    const [modulo, setModulo] = useState('');
    const [meta, setMeta] = useState('');
    const [notificacao, setNotificacao] = useState(false);
    const [cargos, setCargos] = useState('');

    // ESTADOS DE OPTIONS
    const [optionCargos, setOptionCargos] = useState([]);

    //options
    const options_tipo = [
        { value: 1, label: "Loja" },
        { value: 2, label: "Supervisão" },
        { value: 3, label: "Funcionário" }
    ];

    const options_frequencia = [
        { value: 1, label: "Diário" },
        { value: 2, label: "Semanal" },
        { value: 3, label: "Mensal" }
    ];

    const options_sistema = [
        { value: 217, label: "Autoavaliação Novo" },
        { value: 23, label: "Checklist" },
        { value: 3, label: "" }
    ];

    const options_modulo = [
        { value: 1, label: "Supervisão" },
        { value: 2, label: "Antes e Depois" },
        { value: 3, label: "" }
    ];

    var sistema_aux
    if (tipo_sistema_table == "supervisao") {
        sistema_aux = 1
    }
    if (tipo_sistema_table == "antes_depois") {
        sistema_aux = 2
    }
    if (tipo_sistema_table == "") {
        sistema_aux = 3
    }

    var sistema_aux_2;
    if (modulo == 1) {
        sistema_aux_2 = "supervisao"
    }
    if (modulo == 2) {
        sistema_aux_2 = "antes_depois"
    }
    if (modulo == 3) {
        sistema_aux_2 = ""
    }

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
            setTipo(tipo_id_table);
            setFrequencia(frequencia_table);
            setSistema(sistema_id_table);
            setModulo(sistema_aux)
            //setModulo(tipo_sistema_table);
            setMeta(meta_table);
            setNotificacao(notificacao_table);
            setCargos(cargos_table && cargos_table?.split(","));
        } else if (!id_table) {
            setNome('');
            setTipo('');
            setFrequencia('');
            setSistema('');
            setModulo('');
            setMeta('');
            setNotificacao(false);
            setCargos('');
        }
    }, [id_table]);

    //INFORMAÇÕES QUE VÃO PARA A API
    const data = {
        checklists_id: id_table ? id_table : "",
        checklists_nome: nome,
        checklists_tipo: tipo,
        checklists_frequencia: frequencia,
        checklists_sistema: sistema,
        checklists_tipo_sistema: sistema_aux_2,
        //checklists_tipo_sistema: tipo == 1 ? "antes_depois" : "",
        checklists_meta: meta,
        disparar_notificacao: (notificacao ? 1 : 0),
        filtro_checkbox_item: '',
        checklists_cargo: cargos,
    };

    //LIMPAR O FORMULÁRIO AO ENVIAR AS INFORMAÇÕES
    function resetForm() {
        setNome('');
        setTipo('');
        setFrequencia('');
        setSistema('');
        setModulo('');
        setMeta('');
        setNotificacao(false);
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
                api={window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=post_checklists"}
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
                <SelectReact
                    name="tipo"
                    label="Tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.value)}
                    options={options_tipo}
                />
                <SelectReact
                    name="frequencia"
                    label="Frequência"
                    value={frequencia}
                    onChange={(e) => setFrequencia(e.value)}
                    options={options_frequencia}
                />
                <SelectReact
                    name="sistema"
                    label="Sistema"
                    value={sistema}
                    onChange={(e) => setSistema(e.value)}
                    options={options_sistema}
                />
                <SelectReact
                    name="modulo"
                    label="Módulo"
                    value={modulo}
                    onChange={(e) => setModulo(e.value)}
                    options={options_modulo}
                    required={false}
                />
                <Input
                    name="meta"
                    label="Meta"
                    value={meta}
                    onChange={(e) => setMeta(e.target.value)}
                />
                <CheckboxGroup
                    group="cargo"
                    callback={handleSetCargos}
                    required={false}
                    value={cargos}
                />
                <InputContainer>
                    <Switch
                        id="notificacao"
                        name="notificacao"
                        label="Disparar Notificação"
                        value={notificacao}
                        checked={notificacao ? 1 : 0}
                        onChange={(e) => setNotificacao(e.target.checked)}
                    />
                </InputContainer>
                
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