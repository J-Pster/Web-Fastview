import { useEffect, useState, useContext } from "react";
import axios from "axios";
import SelectReact from "../../select";
import toast from "react-hot-toast";
import { GlobalContext } from "../../../../context/Global";

export default function TrocaStatus({maximized, id_job, id_job_status, value, menuPlacement, callback, className, id_job_apl, options, label, placeholder}){
    // GLOBAL CONTEXT
    const { filterModule } = useContext(GlobalContext);

    // ESTADOS
    const [optionsAux, setOptionsAux] = useState(options ? options : []);
    const [valueAux, setValueAux] = useState((value ? value : ''));

    // ATUALIZA VALUE VINDO DA PROP
    useEffect(() => {
        setValueAux(value);
    },[value]);

    //GET OPTIONS
    function get_options(){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                    {table: 'cardStatus'}
                ]
            }
        }).then((response) => {
            if(response?.data?.data?.cardStatus){
                setOptionsAux(response?.data?.data?.cardStatus);
            }
        });
    }

    // SE NÃO TIVER OPTIONS NO SELECT, FAZ A BUSCA NA API
    useEffect(() => {
        if(optionsAux.length == 0 && !options){
            get_options();
        }
    },[]);

    // ENVIA CALLBACK
    useEffect(() => {
        if(optionsAux.length > 0 && callback){
            callback({
                enabled: true
            })
        }
    },[optionsAux]);

    // TROCA STATUS
    const handleSetStatus = (e) => {
        setValueAux(e.value);

        let filter={
            id_modulo: filterModule,
            mensagem: 'Alterou o status',
            id_job: id_job,
            id_job_status: id_job_status,
            id_job_apl: id_job_apl,
            id_card_status: e.value,
            mp: 0,
            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
        };

        if(maximized){
            if(callback){
                callback(filter);
            }
        }else{
            axios({
                method: 'post',
                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable",
                data: {
                    db_type: global.db_type,
                    tables: [{
                        table: 'statusCard',
                        filter: filter
                    }]
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(() => {
                toast('Status alterado');
            })
        }        
    }

    // SÓ EXIBE O SELECT SE TIVER OPTIONS PRO EMPREENDIMENTO
    if(optionsAux.length > 0){
        return(
            <div className={'mt-2 mb-2 ' + className}>
                <SelectReact
                    label={!label ? '' : "Status"}
                    options={optionsAux}
                    allowEmpty={false}
                    value={valueAux}
                    required={false}
                    placeholder={placeholder ? placeholder : 'Selecione'}
                    menuPlacement={menuPlacement}
                    onChange={handleSetStatus}
                />
            </div>
        )
    }
}
