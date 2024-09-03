import { useState, useEffect } from "react";
import Form from "../../../../../components/body/form";
import SelectReact from "../../../../../components/body/select";
import axios from "axios";
import Button from "../../../../../components/body/button";
import Icon from "../../../../../components/body/icon";
import Gerenciador from "../../../../../components/body/gerenciador";
import toast from "react-hot-toast";
import "./style.css";

export default function NovoItem({ callback_close, id_table, item_table, icon_table, callback }) {

    //TRANFORMA ITEM QUE VEM PRA SER EDITADO
    let aux_table_item;
    if (item_table == "Conformidade") {
        aux_table_item = 1;
    }
    if (item_table == "Não conformidade") {
        aux_table_item = 2;
    }
    if (item_table == "Não se aplica") {
        aux_table_item = 3;
    }
    if (item_table == "Campo de comentário/Observação") {
        aux_table_item = 4;
    }
    if (item_table == "Anexo") {
        aux_table_item = 5;
    }
    if (item_table == "Médio") {
        aux_table_item = 7;
    }
    if (item_table == "Ótimo") {
        aux_table_item = 8;
    }
    if(item_table == "Quantidade"){
        aux_table_item = 9
    }

    //TRANDORMAR TEXTO QUE VEM PARA SER EDITADO
    let aux_table_icon;
    if (icon_table == "check - circle") {
        aux_table_icon = 1;
    }
    if (icon_table == "times-circle") {
        aux_table_icon = 2;
    }
    if (icon_table == "ban") {
        aux_table_icon = 3;
    }
    if (icon_table == "smile") {
        aux_table_icon = 4
    }
    if (icon_table == "frown") {
        aux_table_icon = 5;
    }
    if (icon_table == "thumbs-up") {
        aux_table_icon = 7;
    }
    if (icon_table == "thumbs-down") {
        aux_table_icon = 8;
    }
    if (icon_table == "comment-alt") {
        aux_table_icon = 9;
    }
    if (icon_table == "camera") {
        aux_table_icon = 10;
    }
    if (icon_table == "paperclip") {
        aux_table_icon = 12;
    }
    if (icon_table == "meh") {
        aux_table_icon = 14;
    }
    if (icon_table == "laugh-wink") {
        aux_table_icon = 15;
    }

    //ESTADOS
    const [item, setItem] = useState('');
    const [icone, setIcone] = useState('');
    const [iconeApi, setIconeApi] = useState([]);
    const [optionsIcons, setOptionsIcons] = useState([]);

    function getIcons() {
        let objItem = []
        axios.get(window.host + "/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=get_itens")
            .then((response) => {
                setIconeApi(response.data);
                response.data.map(item => objItem.push({ value: item.id, label: item.nome, icones: item.icones }))
                setOptionsIcons(objItem);
            })
    }

    useEffect(() => {
        getIcons();
    }, []);

    useEffect(() => {
        if (id_table) {
            setItem(aux_table_item);
            setIcone(aux_table_icon);
        } else {
            setItem('');
            setIcone('');
        }
    }, [id_table]);
    //MANDAR INFO PRA API
    const data = {
        itens_id: id_table,
        itens_icone_id: icone,
        itens_item_id: item,
    };

    function resetForm() {
        setItem("");
        setIcone("");
        callback(true);
        callback_close(false);
    }

    const handleClick = () => {
        if(!icone){
            toast("Erro, selecione um ícone para finalizar")
        }
    }

    return (
        <Gerenciador
            title={id_table ? "Editar" : "Novo"}
            icon={<Icon type="reprovar" title="Fechar" onClick={() => callback_close(false)} />}
        >
            <Form
                api={window.host + '/systems/"+global.sistema_url.checklist+"/api/gerenciador.php?do=post_itens_icones'}
                data={data}
                callback={resetForm}
                // toast={"Erro ao enviar, escolha um ícone"}
            >
                <SelectReact
                    name="item"
                    label="Item"
                    value={item}
                    onChange={(e) => setItem(e.value)}
                    options={optionsIcons}
                />

                {(aux_table_item != 9 ?
                    <div className="check-fake-input-div" >
                        <span className="check-fake-input-span" >Ícones: *</span>
                        {(
                            item?
                                <span className="check-fake-input-icon">
                                    {iconeApi.filter((aux) => aux.id == item).map((icones) => {
                                        return (
                                            icones.icones.map((icon) => {
                                                return (
                                                    <>
                                                        <Icon
                                                            type={icon.nome}
                                                            className={icone == icon.id ? icon.classe == null || undefined || !icon.classe ? "text-warning" : icon.classe : "text-secondary"}
                                                            onClick={() => setIcone(icon.id)}
                                                        />
                                                    </>
                                                )
                                            })

                                        )
                                    })}
                                </span>
                                : <></>
                        )}
                    </div>
                :'')}

                <Button type="submit" onClick={() => handleClick()} >Enviar</Button>
            </Form>
        </Gerenciador>
    )
}