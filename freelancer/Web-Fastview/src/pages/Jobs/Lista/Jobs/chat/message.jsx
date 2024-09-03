import axios from "axios"
import { cd } from "../../../../_assets/js/global";
import { useState, useEffect } from "react";
import Loader from "../../../../components/body/loader";
import "./style.css"
import parse from "html-react-parser";

export default function MessageChatJob({ id }) {

    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);

    //PEGAR MENSAGEM DE ACORDO COM O ID
    function getMessage() {
        axios.get(window.host_madnezz+"/systems/integration-react/api/list.php?do=get_msg&filter_id_module=&id=" + id)
            .then((response) => {
                setMessage(response.data)
                setLoading(false)
            }).catch((_error) => { })
    }

    useEffect(() => {
        getMessage();
    }, [message]);


    return (
        <div>
            <div className="main-job-lista-chat-message">
                <div className="job-lista-chat-card">
                    <div className="job-lista-chat-user-title">
                        <span className="text-color-black">Histórico</span>
                    </div>
                    <div className="job-lista-message-container">
                        {(
                            loading == true ?
                                // <Tr>
                                //     <Td colspan="100%">
                                <div
                                    className="job-lista-message-load"
                                >
                                    <Loader show={true} />
                                </div>
                                //     </Td>
                                // </Tr>
                                :
                                message.length > 0 ?
                                    message.map((item, i) => {
                                        var corrigirData = new Date(item.cad).toLocaleDateString("de", {
                                            timeZone: "UTC",
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            // hour: ""
                                        }).replaceAll(".", "/")
                                       // console.log(corrigirData)
                                        return (
                                            <div
                                                key={item.id}
                                                className="job-lista-message-card"
                                            >
                                                <div className="message-user-name-date">
                                                    <span> • {cd(item.cad)} </span> - <span>{item.name_usr}</span>
                                                </div>
                                                <div className="job-lista-message-paragraph-div">
                                                    { item.mensagem ? parse(item.mensagem) : ""}
                                                </div>

                                            </div>
                                        )
                                    })
                                    : <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}