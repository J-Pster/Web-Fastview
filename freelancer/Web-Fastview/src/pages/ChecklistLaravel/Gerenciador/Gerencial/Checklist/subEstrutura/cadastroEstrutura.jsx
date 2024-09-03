import { useState,useEffect } from "react";
import Input from "../../../../../components/body/form/input";
import Form from "../../../../../components/body/form";
import Button from "../../../../../components/body/button";
import Gerenciador from "../../../../../components/body/gerenciador";
import Icon from "../../../../../components/body/icon";
import { cd } from "../../../../../_assets/js/global";

export default function NovaEstrutura({ callback_close, callback, id_table, nome_table, data_inicio_table, data_fim_table, empreendimento_table, estrutura }) {

    //ESTADOS INPUT
    const [nome, setNome] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    useEffect(() => {
        if (id_table) {
            setNome(nome_table);
            setDataInicio(new Date(data_inicio_table));
            setDataFim(new Date(data_fim_table));
        } else {
            setNome('');
            setDataInicio('');
            setDataFim('');
        }
    }, [id_table]);

    //INFORMAÇÕES QUE VÃO PRA API
    const data = {
        periodos_id: id_table ? id_table : '',
        periodos_nome: nome,
        periodos_inicio: cd(dataInicio),
        periodos_fim: cd(dataFim)
    };

    function resetForm() {
        setNome('');
        setDataInicio('');
        setDataFim('');
        callback(true);
        callback_close(false);
    }
    return (
        <Gerenciador
            title={id_table ? "Editar" : "Novo"}
            icon={<Icon type="reprovar" title="Fechar" onClick={() => callback_close(false)} />}
        >
            <Form
                api={window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=post_periodos"}
                data={data}
                callback={resetForm}
            >
                <Input
                    type="text"
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <Input
                    type="date"
                    label="Data Ínicio"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e)}
                />
                <Input
                    type="date"
                    label="Data Fim"
                    value={dataFim}
                    onChange={(e) => setDataFim(e)}
                />
                <Button type="submit">Enviar</Button>
            </Form>
        </Gerenciador>
    )
}