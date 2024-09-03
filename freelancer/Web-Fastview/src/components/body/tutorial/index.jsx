import { useContext, useEffect, useState } from "react";
import Button from "../button";
import Modal from "../modal";
import ModalBody from "../modal/modalBody";
import style from './style.module.scss';
import { AuthContext } from "../../../context/Auth";
import Icon from '../icon';
import Tippy from "@tippyjs/react";
import axios from "axios";

export default function Tutorial({url, title}){
    // AUTH CONTEXT
    const { authInfo } = useContext(AuthContext);

    // ESTADOS
    const [show, setShow] = useState(false);
    const [validation, setValidation] = useState(false);

    // VERIFICA SE O USUÁRIO JÁ CONFIRMOU A VISUALIZAÇÃO
    useEffect(() => {
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'mysql',
                type: 'Job',
                do: 'getTable',
                tables: [{
                    table: 'getUserMigration',
                    filter: {
                        filter_id_sistema: [window.rs_sistema_id],
                        filter_id_usuario: [window.rs_id_usr]
                    }
                }]
            }
        }).then((response) => {
            if(response?.data?.data?.getUserMigration.length === 0){
                setShow(true);
            }
        });
    },[]);

    // CONFIRMAR VISUALIZAÇÃO
    const handleSubmit = () => {
        if(validation){
            if(validation === 'partial'){
                if(window.confirm('Parece que você ainda não terminou de assistir o vídeo, deseja realmente confirmar a visualização?')){
                    handleSetShow(false);
                }
            }else{
                handleSetWatch();
            }
        }else{
            if(window.confirm('Parece que você ainda não visualizou o vídeo, deseja realmente confirmar a visualização?')){
                handleSetShow(false);
            }
        }
    }

    // FUNÇÃO QUE REGISTRA QUE O USUÁRIO ASSISTIU O VÍDEO ATÉ O FINAL
    const handleSetWatch = () => {
        setShow(false);

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'mysql',
                type: 'Job',
                do: 'setTable',
            },
            data: {
                tables: [{
                    table: 'userMigration',
                    filter:{
                        visualizacao_completa: 1,
                        visualizacao_confirmacao: 1,
                        id_sistema: window.rs_sistema_id
                    }
                }]
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    // FUNÇÃO QUE REGISTRA CONFIRMAÇÃO DE VISUALIZAÇÃO SEM VISUALIZAR ATÉ O FINAL
    function handleSetShow(value) {
        setShow(value);

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'mysql',
                type: 'Job',
                do: 'setTable',
            },
            data: {
                tables: [{
                    table: 'userMigration',
                    filter:{
                        visualizacao_confirmacao: 1,
                        id_sistema: window.rs_sistema_id
                    }
                }]
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    // PARA O MODAL APARECER PRECISA TER A INFORMAÇÃO 'MODAL_MIGRACAO' NA TABELA 'EMPREENDIMENTO' DO BANCO, RECEBER A PROPS DA URL NO COMPONENTE E SER UM LOJISTA
    if(authInfo?.empreendimento?.modal_migracao && url && window.rs_id_lja > 0){
        return(
            <>
                <Modal show={show} large centered>
                    <ModalBody padding={false}>
                        <video
                            controls
                            className={'d-block w-100'}
                            onPlay={() => (!validation ? setValidation('partial') : {})}
                            onEnded={() => setValidation('full')}
                        >
                            <source src={url} type="video/mp4"></source>
                        </video>

                        <div className={style.info}>
                            <h1>{title ? title : 'Novo sistema'}</h1>

                            <p className="mb-4">Assista o vídeo acima para conhecer as novidades do Sistema e após concluir, <br />clique em "confirmar visualização do vídeo"</p>

                            <Button
                                onClick={handleSubmit}
                            >
                                Confirmar visualização do vídeo
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>

                {(!show ?
                    <Tippy content="Rever tutorial">
                        <div
                            className={style.icon}
                            onClick={() => setShow(true)}
                        >
                            
                            <Icon
                                type="help"
                                title={false}
                                readonly
                            />                        
                        </div>
                    </Tippy>
                :'')}
            </>
        )
    }
}