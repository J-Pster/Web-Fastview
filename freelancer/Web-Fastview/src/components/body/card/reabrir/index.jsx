// import './recusar.scss';

import { useState, useContext, useEffect } from 'react';

import Icon from '../../icon';
import { GlobalContext } from "../../../../context/Global";
import toast from 'react-hot-toast';
import axios from 'axios';
import Button from '../../button';

export default function Reabrir({chamados, id_job, disabled, tippy, button, id_job_status, message, anexo, id_job_apl, callback, card, message_required}){
    // CONTEXT GLOBAL
    const { filterModule } = useContext(GlobalContext);
    
    // ESTADOS
    const [messageAux, setMessageAux] = useState(null);
    const [anexoAux, setAnexoAux] = useState(null);
    const [loading, setLoading] = useState(false);

    // DEFINE CONTEÚDO DO FORM DE MOTIVO
    const data = {
        db_type: global.db_type,
        tables: [{
            table: 'status_sup',
            filter: {
                id_modulo: card?.id_modulo ? card?.id_modulo : filterModule,
                mensagem: 'Reabriu o card',
                id_job: id_job,
                id_job_status: id_job_status,
                id_job_apl: id_job_apl,
                status_sup: 3,
                motivo_sup: messageAux,
                anexo: anexoAux,
                acao_fase: 'start',
                tipo_fase: 'Pós-venda',
                communication: (chamados ? 0 : 1),
                mp: 0,
                coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
            }    
        }]
    }

    // ATUALIZA ESTADO SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setMessageAux(message);
    },[message]);

    // ATUALIZA ESTADO SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setAnexoAux(anexo);
    },[anexo]);

    // ACIONA AÇÕES DO CHECK
    const handleSetCheck = () => {
        let validation = false;

        if(messageAux && messageAux !== '<p><br></p>' || message_required === false){ // NECESSÁRIO PARA OS CASOS DE TEXTAREA COM EDITOR
            validation = true;
        }else{
            toast('Digite uma mensagem antes de reabrir');              

            if(callback){
                callback({
                    alert: {
                        status: 3
                    }
                })
            }

            validation = false;
        }

        if(validation){
            setLoading(true);

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(() => {
                toast('Card reaberto com sucesso');
                setLoading(false);
                setMessageAux(null);
                setAnexoAux(null);
                callback({
                    submit: id_job_status
                });
            });
        }   
    }

    if(button){
        return(
            <Button
                status={loading ? 'loading' : ''}
                disabled={disabled}
                title={tippy}
                onClick={handleSetCheck}
            >
                Reabrir
            </Button>
        )
    }else{
        return(
            <Icon
                type={'reabrir'}
                title={'Reabrir'}
                loading={loading}
                animated
                onClick={handleSetCheck}
            />
        )
    }
}
