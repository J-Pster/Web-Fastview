// import './recusar.scss';

import { useState, useContext, useEffect } from 'react';

import Icon from '../../icon';
import { GlobalContext } from "../../../../context/Global";
import toast from 'react-hot-toast';
import axios from 'axios';
import Button from '../../button';

export default function Reprovar({chamados, id_job, button, disabled, tippy, id_job_status, message, anexo, id_job_apl, tipo, type_phase, motivo, callback, card, className}){
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
                mensagem: 'Reprovou o card',
                id_job: id_job,
                id_job_status: id_job_status,
                id_job_apl: id_job_apl,
                status_sup: 2,
                motivo_sup: messageAux,
                anexo: anexoAux,
                acao_fase: (tipo ? tipo : 'next'),
                tipo_fase: (type_phase ? type_phase : 'Check'),
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
        let confirm_txt = 'Tem certeza que deseja reprovar o '+(chamados ? 'chamado' : 'card')+'?';

        let validation = false;

        if(motivo){
            if(messageAux && messageAux !== '<p><br></p>'){ // NECESSÁRIO PARA OS CASOS DE TEXTAREA COM EDITOR
                if(confirm(confirm_txt)){
                    validation = true;
                }
            }else{
                toast('Digite uma mensagem antes de reprovar');              

                if(callback){
                    callback({
                        alert: {
                            status: 2
                        }
                    })
                }

                validation = false;
            }
        }else{
            if(confirm(confirm_txt)){
                validation = true;
            }
        }

        if(validation){
            setLoading(true);

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(() => {
                toast('Card reprovado com sucesso');
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
                color={'red'}
                className={className}
                onClick={handleSetCheck}
            >
                Reprovar
            </Button>
        )
    }else{
        return(
            <Icon
                type={'times-circle'}
                title={'Reprovar'}
                loading={loading}
                animated
                onClick={handleSetCheck}
            />
        )
    }
}
