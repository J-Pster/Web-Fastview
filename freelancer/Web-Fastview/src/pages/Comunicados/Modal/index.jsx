import { useContext, useEffect, useState } from "react";
import Modal from "../../../components/body/modal";
import axios from "axios";
import ModalHeader from "../../../components/body/modal/modalHeader";
import ModalTitle from "../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../components/body/modal/modalBody";
import Button from "../../../components/body/button";
import Icon from "../../../components/body/icon";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/Auth";
import Microssistema from '../../Microssistemas/Cadastro';
import useSwr from 'swr';

export default function ModalComunicado(){
    // AUTH CONTEXT
    const { authInfo } = useContext(AuthContext);

    // ESTADOS
    const [show, setShow] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [microssistema, setMicrossistema] = useState(null);
    const [microssistemaValidation, setMicrossistemavalidation] = useState(false);
    const [microssistemaValues, setMicrossistemaValues] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);

    function get_comunicados(){
        setFirstLoad(false);
        
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'sql_server',
                do: 'getReport',
                type: 'Job',
                filter_id_user_or: authInfo?.id,
                filter_id_store_or: authInfo?.loja_id ? authInfo?.loja_id : undefined,
                filter_date_end: window?.currentDateWithoutHour,
                filter_type: 5,
                id_apl: 229,
                filter_id_apl: 229,
                filter_visualized: [-1],
                limit: 1
            }
        }).then((response) => {
            setInfo(response?.data?.data[0]);
        });
    }

    useEffect(() => {
        if(info){
            setMicrossistema(info?.aux_sistema_api);
            setShow(true);
        }
    }, [info])

    // PRIMEIRA CHAMADA
    useEffect(() => {
        if(authInfo){
            if(firstLoad){ // NECESSÁRIO PARA FAZER A CHAMADA APENAS UMA VEZ JÁ QUE O AUTHINFO SE ALTERA DEPOIS DE CARREGAR A PÁGINA
                get_comunicados();
            }
        }
    },[authInfo]);

    // NOVA CHAMADA A CADA 2 MINUTOS
    useEffect(() => {
        if(authInfo){
            const intervalRequest = setInterval(() => {
                get_comunicados();
            }, 120000);

            return () => {
                clearInterval(intervalRequest);
            };
        }
    },[authInfo]);

    // CONFIRMAR LEITURA
    const handleConfirm = () => {
        setLoading(true);

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: 'sql_server',
                tables: [{
                    table: 'visualized',
                    filter: {
                        mensagem: 'Confirmou leitura',
                        id_job: info?.id_job,
                        id_job_status: info?.id_job_status,
                        mp: 0
                    }
                }]
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            toast('Leitura confirmada');
            setLoading(false);
            setShow(false);

            get_comunicados();
        });

        // ENVIA DADOS DO MICROSSISTEMA CASO TENHA
        if(microssistemaValues){
            axios({
                method: 'post',
                url: window.host+'/systems/microssistemas-novo/api/novo.php?do=post_microssistema',
                data: microssistemaValues,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }
    }

    // CALLBACK DO MICROSSISTEMA
    const handleMicrossistemaCallback = (e) => {
        setMicrossistemavalidation(e?.validation);

        let data = [];

        if(e.values){
            e.values.map((item, i) => {
                data.push({
                    valor: item.value,
                    opcao_id: '',
                    secao_id: item.loja_id,
                    loja_id_aux: '',
                    item_id: item.id
                });
            });
        } 

        setMicrossistemaValues({
            data: data,
            tipo: 'Loja',
            microssistema_id: JSON.parse(microssistema)?.job_system_integration_type,
            job_id: info?.id_job_status,
            job_data: info?.data_inicio,
        });
    }

    return(
        <Modal show={show}>
            <ModalHeader>
                <ModalTitle close={false}>
                    {info?.titulo}
                </ModalTitle>
            </ModalHeader>

            <ModalBody>
                <div dangerouslySetInnerHTML={{__html: info?.descricao}} />

                {(info?.anexo ?
                    JSON.parse(info?.anexo).map((item, i) => {
                        if(item?.type?.includes('image')){ // IMAGEM
                            return(
                                <img src={window.upload+'/'+item?.id} class="mw-100 mb-4" />
                            )
                        }else if(item?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){ // DOCX
                            return(
                                <iframe class="w-100 position-relative d-block" src={'https://docs.google.com/gview?url='+(window.upload+'/'+item?.id)+'&embedded=true'} style={{height:500}} frameborder="0"></iframe>
                            )
                        }else if(item?.type === 'application/pdf'){
                            return(
                                <embed src={window.upload+'/'+item?.id} width="100%" height="500" type="application/pdf"></embed>
                            )
                        }else{
                            <a href={window.upload+'/'+item?.id} target="_blank">
                                {item?.name}

                                <Icon type="external" readonly title={false} />
                            </a>
                        }
                    })
                :'')}

                {/* COLOCAR AQUI A CONDIÇÃO PARA CASO O COMUNICADO TENHA INTEGRAÇÃO COM SISTEMA (NO MOMENTO ESSA INFO NÃO VEM NA API) */}
                {(microssistema ? 
                    <Microssistema
                        id={JSON.parse(microssistema)?.job_system_integration_type}
                        tipo="pessoa"
                        callback={handleMicrossistemaCallback}
                    />
                :'')}

                <Button
                    type="submit"
                    onClick={handleConfirm}
                    status={loading ? 'loading' : ''}
                    title={microssistema && !microssistemaValidation ? 'Responda as questões antes de confirmar' : false}
                    disabled={microssistema && !microssistemaValidation ? true : false}
                >
                    Confirmar leitura
                </Button>
            </ModalBody>
        </Modal>
    )
}
