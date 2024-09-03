import { useContext, useEffect, useState } from "react";

import Modal from "../../../../components/body/modal";
import ModalBody from "../../../../components/body/modal/modalBody";
import { JobsContext } from "../../../../context/Jobs";
import CardJobs from '../../Main/Card';
import axios from "axios";
import Icon from "../../../../components/body/icon";
import Loader from "../../../../components/body/loader";

export default function ModalListaJob({id, fases, chamados, optionsModule, filters, button, configuracoesAux, id_apl}) {
    // CONTEXT JOBS
    const { configuracoes, refresh, filterEmpreendimento } = useContext(JobsContext);

    // ESTADOS
    const [card, setCard] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [iconAvaliacao, setIconAvaliacao] = useState([]);

    let troca_operador = true;

    // CONFIGURAÇÕES
    if((configuracoesAux && id_apl ? configuracoesAux : configuracoes)?.filter((elem) => ((id_apl && elem?.id_apl == id_apl) || elem?.id_apl))?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar){
        let json_aux = (configuracoesAux && id_apl ? configuracoesAux : configuracoes)?.filter((elem) => ((id_apl && elem?.id_apl == id_apl) || elem?.id_apl))?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar;

        if(JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filters?.modulo).length > 0){
            json_aux = JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filters?.modulo)[0]?.values;

            if(json_aux.filter((elem) => elem.nome === 'trocar_operador').length > 0){
                if(json_aux.filter((elem) => elem.nome === 'trocar_operador')[0]?.value == 1){
                    troca_operador = false;
                }else{
                    troca_operador = true;
                }
            }
        }
    }else{
        if(window.rs_permission_apl === 'leitura'){
            troca_operador = false;
        }else{
            troca_operador = true;
        }
    }

    // FUNÇÃO PARA BUSCAR TIPOS DE AVALIAÇÃO E MÓDULOS
    useEffect(() => {
        if(iconAvaliacao.length===0 && show){
            let table_aux;

            if(chamados){
                table_aux = 'moduleChamados';
            }else if(fases){
                table_aux = 'moduleFases';
            }

            axios({
                method: 'get',
                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                params: {
                    db_type: global.db_type,
                    do: 'getTable',
                    tables: [
                        {table: 'assessment'},
                        (chamados || fases ? {table: table_aux, filter: {id_emp: filterEmpreendimento}} : {})
                    ],
                }
            }).then((response) => {
                if(response.data){
                    setIconAvaliacao(response?.data?.data?.assessment);
                }
            });
        }
    },[show]);

    // FUNÇÃO PARA RECARREGAR CARD ESPECÍFICO
    function loadCard(){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: global.db_type,
                type: 'Job',
                do: 'getReport',
                filter_id_job_status: id
            }
        }).then((response) => {
            setCard(response?.data?.data[0]);
            setLoading(false);
            setShow(true);
        });
    }

    const handleRefreshCard = () => {
        loadCard();
    }

    // AÇÕES AO ABRIR MODAL
    const handleShowModal = (id) => {
        setLoading(true);
        loadCard();
    }

    // AÇÕES AO FECHAR MODAL
    const handleCloseModal = () => {
        setShow(false);
    }

    useEffect(() => {
        if(show){
            loadCard();
        }
    },[refresh]);

    return (
        <>
            <Modal centered show={show} onHide={handleCloseModal}>
                <ModalBody padding={false}>
                    {(card ?
                        <CardJobs
                            card={card}
                            fases={fases}                                           
                            chamados={chamados}
                            fullwith={true}
                            shadow={false}
                            opened={show}
                            id_aux={card?.id_job_status}
                            view={false}
                            troca_operador={troca_operador}
                            job={card}    
                            refreshCard={handleRefreshCard}
                            changeStatus={handleRefreshCard}
                            changeOperator={handleRefreshCard}
                            modal={true}
                            report={true}
                            iconAvaliacao={iconAvaliacao}
                            optionsModule={optionsModule}       
                            filterModule={card?.id_modulo}
                            print={true}
                            id_apl={id_apl}
                        />
                    :'')}
                </ModalBody>
            </Modal>

            {(button ? 
                <div onClick={() => handleShowModal()}>
                    {(loading ? 
                        <div
                            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{top: 0, left: 0, background: 'rgba(0,0,0,0.05)'}}
                        >
                            <Loader />
                        </div>
                    :
                        button
                    )}
                </div>
            :
                <Icon
                    type="view"
                    loading={loading}
                    onClick={() => handleShowModal()}
                />
            )}
        </>
    )
}
