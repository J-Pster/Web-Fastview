import { useState } from "react"
import "./style.css"
import Icon from "../../../../components/body/icon";
import MessageChatJob from "./message";
import Textarea from "../../../../components/body/form/textarea";
import Row from "../../../../components/body/row";
import CardChatJobs from "../components/chatCard/chatCardJobs";
import axios from "axios";
import { useEffect } from "react";

import Form from "../../../../components/body/form";

import Bold from "../../../../_assets/uplodad/svgsNews/bold1.svg";
import Italic from "../../../../_assets/uplodad/svgsNews/italic2.svg";
import Link from "../../../../_assets/uplodad/svgsNews/link2.svg";
import Underline from "../../../../_assets/uplodad/svgsNews/underline2.svg";
import TextColor from "../../../../_assets/uplodad/svgsNews/txt-color.svg";
import AlignRight from "../../../../_assets/uplodad/svgsNews/align-right.svg";
import AlignLeft from "../../../../_assets/uplodad/svgsNews/align-left.svg";
import AlignCenter from "../../../../_assets/uplodad/svgsNews/align-center.svg";
import AlignJustify from "../../../../_assets/uplodad/svgsNews/align-justify.svg";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillTextEditor from "../components/textEditor";

export default function ChatJob({ id_usuario, id_chats, data_inicio }) {


    //ESTADO SALVAR INFO E MANDAR PARA A API
    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');
    //usuario que abre a tabela
    const [mainUser, setMainUser] = useState([]);
    const [secondaryUser, setSecondaryUser] = useState([])
    const [messageCard, setMessageCard] = useState(false);
    const [auxid, setAuxId] = useState([]);
    const [idApi, setIdApi] = useState('');

    //MANDAR O ID PRA API
    const handleIdApi = (id) => setIdApi(id)

    //INFOS DE ACORDO COM O USUARIO QUE ABRE A TABELA
    function getMainUser() {
        axios.get(window.host_madnezz + "/systems/integration-react/api/list.php?do=get_list", {
            params: {
                filter_type: '5',
                filter_id_user: id_usuario,
                filter_date_start: data_inicio,
                filter_date_end: data_inicio
            }
        }).then((response) => {
            setMainUser(response.data);
        })
    }

    useEffect(() => { getMainUser(); }, []);

    // usuarios que interagem
    function getUserList() {
        axios.get(window.host_madnezz+"/systems/integration-react/api/list.php", {
            params: {
                do: "get_select",
                filter_id_group: id_chats,
                id_apl: window.rs_id_apl
            }
        }).then((response) => {
            setSecondaryUser(response.data);
        })
    }

    useEffect(() => { getUserList(); }, [])


    //ABRIR O CARD DE MENSAGEM DE ACORDO COM O ID DO USUARIO
    const handleMessageCard = (id) => {
        if (auxid.includes(id)) {
            auxid.splice(auxid.indexOf(id), 1);
        } else {
            setAuxId(auxid => [...auxid, id]);
        }
        setMessageCard(!messageCard);
    };

    //MANDAR MENSAGEM 
    const dataMain = {
        ativ: "Enviou uma mensagem",
        id_mov: idApi, // item.id_job_status
        ativ_desc: message,
        nivel_msg: ''
    };

    const data = {
        ativ: "Enviou uma mensagem",
        id_mov: idApi, // item.id_job_status
        ativ_desc: message2,
        nivel_msg: ''
    };

    function resetForm() {
        setMessage('');
        setMessage2('');
    }

    return (
        // <Tr>
        //     <Td colspan="100%">
        <Row>
            <div className="jobs-main-tr-container">
                {(mainUser.length > 0 ?
                    mainUser.map((item) => {
                        return (
                            <>
                                <CardChatJobs
                                    primary={true}
                                    nome={item.cad_usr_nome}
                                    data1={item.data_inicio_formatada}
                                    data2={item.data_fim_formatada}
                                    // data2={item.data_ultima_visualizacao}
                                    icon={<Icon type="view" onClick={() => handleMessageCard(item.id_job_status)} />}
                                >
                                    <div className="job-lista-chat-user-text" >
                                        <Form
                                            api={window.host_madnezz+"/systems/integration-react/api/list.php?do=set_msg"}
                                            data={dataMain}
                                            formData={true}
                                            callback={resetForm}
                                        // test
                                        >
                                            <QuillTextEditor
                                                label="Apenas aguardando a definição dos outros jobs para entrar no piloto"
                                                value={message}
                                                onChange={(e) => setMessage(e)}
                                            />
                                            <div className="btn-lista-chat-card">
                                                <button> <Icon type="check" /> </button>
                                                <button> <Icon type="send" onClick={() => handleIdApi(item.id_job_status)} /> </button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardChatJobs>
                                {(auxid.includes(item.id_job_status) ? <MessageChatJob id={item.id_job_status} /> : <></>)}
                            </>
                        )
                    })
                    : <></>
                )}
                {(
                    secondaryUser.length > 0 ?
                        secondaryUser.map((item, i) => {
                            return (
                                <>
                                    <CardChatJobs
                                        primary={false}
                                        nome={item.cad_usr_nome}
                                        data1={item.data_inicio_formatada}
                                        data2={item.data_formatada}
                                        icon={<Icon type="view" onClick={() => handleMessageCard(item.id_job_status)} />}
                                        test
                                    >
                                        <div className="job-lista-chat-user-text" >
                                            <Form
                                                api={window.host_madnezz+"/systems/integration-react/api/list.php?do=set_msg"}
                                                data={data}
                                                formData={true}
                                                callback={resetForm}
                                            >
                                                <QuillTextEditor
                                                    label="Apenas aguardando a definição dos outros jobs para entrar no piloto"
                                                    value={message2}
                                                    onChange={(e) => setMessage2(e)}
                                                />
                                                <div className="btn-lista-chat-card">
                                                    <button> <Icon type="check" /> </button>
                                                    <button> <Icon type="send" onClick={() => handleIdApi(item.id_job_status)} /> </button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardChatJobs>
                                    {(auxid.includes(item.id_job_status) ? <MessageChatJob id={item.id_job_status} /> : <></>)}
                                </>

                            )
                        })
                        : <></>
                )}
            </div>
        </Row>
        //     </Td>
        // </Tr>
    )
}