import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Chat from "../../../components/body/chat";
import Message from "../../../components/body/chat/message";
import Loader from "../../../components/body/loader";
import Modal from "../../../components/body/modal";
import ModalBody from "../../../components/body/modal/modalBody";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import Icon from "../../../components/body/icon";
import { cd, cdh } from "../../../_assets/js/global";
import toast from "react-hot-toast";

export default function Historico(props) {
    // ESTADOS
    const [show, setShow] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [loader, setLoader] = useState(true);
    const [mensagem, setMensagem] = useState(null);

    //PEGAR A MENSAGEM
    const getMessagem = (res) => { 
        if(res.submit) getHistorico();
        setMensagem(res?.message); }

    // FECHA MODAL
    const handleCloseModal = () => {
        setShow(false);
        //props.onHide(false);

        setTimeout(() => {
            setLoader(true);
        }, 500);
    }

    const data = {
        trade_id: props.id,
        mensagem: mensagem
    }

    function getHistorico() {
        axios({
            url: `${window.backend}/api/v1/trades/mensagens`,
            method: 'get',
            params: {
                trades: [props?.id],
                usuarios: [props.usuario]
            },
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(({ data }) => {
            setMensagens(data.data);
        }).catch((_error) => { toast("Ocorreu um erro, tente novamente") });
    }

    // GET MENSAGENS
    useEffect(() => {
        if (show) {
            getHistorico();
        }
    }, [props?.id, show]);

    return (
        <>
            <Modal show={show} onHide={handleCloseModal}>
                <ModalHeader>
                    <ModalTitle>
                        Histórico
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p>
                        <b>Contrato:</b> {props.contrato}<br />
                        <b>Loja: </b>{props.loja}<br />
                        <b>Grupo: </b>{props.grupo}<br />
                        <b>Data: </b>{cd(props.data)}
                    </p>
                    <Chat
                        anexo={false}
                        loader={loader}
                        api={`${window.backend}/api/v1/trades/mensagens`}
                        data={data}
                        button={{
                            show: true
                        }}
                        callback={getMessagem}

                    >
                        {(mensagens.length > 0 ?
                            mensagens.map((mensagem) => {
                                return (
                                    <Message
                                        date={cdh(mensagem.data)}
                                        sender={mensagem.usuario_nome}
                                        text={mensagem.mensagem}
                                        align={(mensagem.self == 1 ? 'right' : 'left')}
                                    />
                                )
                            })
                            : '')}
                    </Chat>
                </ModalBody>
            </Modal>

            <Icon
                type="mensagem"
                title="Histórico de mensagens"
                onClick={() => setShow(true)}
                animated
            />
        </>
    )
}