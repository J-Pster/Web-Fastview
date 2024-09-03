import { useState, useEffect } from "react";
import axios from "axios";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import Input from "../../../../../components/body/form/input";
import Form from "../../../../../components/body/form";
import Button from "../../../../../components/body/button";
import SelectReact from "../../../../../components/body/select";

export default function NovoResponsavel({ callback_close, callback, id_table, email_table, check_id_table }) {

    //ESTADOS
    const [email, setEmail] = useState('');
    const [checklist, setChecklist] = useState('');
    //LISTA DE OPÇÕES
    const [opCheck, setOpCheck] = useState([]);

    //SE FOR EDITAR, INICIA OS INPUTS COM AS INFOS
    useEffect(() => {
        if (id_table) {
            setEmail(email_table);
            setChecklist(check_id_table);
        } else if (!id_table) {
            setEmail('');
            setChecklist('');
        }
    }, [id_table]);

    //INFORMAÇÕES QUE VÃO PARA A API
    const data = {
        responsaveis_id: id_table ? id_table : "",
        responsaveis_email: email,
        checklist_id: checklist ? checklist : null,
    };

    //LIMPAR O FORMULÁRIO AO ENVIAR AS INFORMAÇÕES
    function resetForm() {
        callback_close(false);
        setEmail('');
        setChecklist('');
        callback(true)
    }

    //PEGAR INFOS DA API PRO GERENCIADOR CHECKLIST // -> exceto os inativos
    function getInfo() {
        let obj_aux = []
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_checklists")
            .then((response) => {
                response.data.filter(({ status }) => { return (status != 0) }).map(item => {
                    obj_aux.push({ value: item.id, label: item.nome })
                })
                setOpCheck(obj_aux);
            })
    }
    useEffect(() => {
        getInfo();
    }, []);
    return (
        <Gerenciador
            title={id_table ? "Editar" : "Novo"}
            icon={<Icon type="reprovar" title="Fechar" onClick={() => callback_close(false)} />}
        >
            <Form
                api={window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=post_responsaveis2"}
                data={data}
                callback={resetForm}
            >
                <Input
                    type="text"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <SelectReact
                    label="Checklist"
                    value={checklist}
                    onChange={(e) => setChecklist(e.value)}
                    options={opCheck}
                />
                <Button type="submit">Enviar</Button>
            </Form>
        </Gerenciador>
    )
}