import { useState, useContext } from "react";
import SelectReact from "../../select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { JobsContext } from "../../../../context/Jobs";
    
export default function TrocaOperador({maximized, label, placeholder, index_job, options, callback, margin, params, filterModule, onChange, menuPlacement, fases, chamados }){
    // CONTEXT JOBS
    const { filterEmpreendimento, configuracoes } = useContext(JobsContext);

    // ESTADOS
    const [operatorSelected, setOperatorSelected] = useState([]);

    // VERIFICA SE O EMPREENDIMENTO POSSUI CONFIGURAÇÃO DO NÍVEL DE MENSAGEM PARA A TROCA DE OPERADOR
    let nivel_msg = 2;
    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]){ // VERIFICA SE VEIO CONFIGURACOES DA API
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0].conf_chat){ // VERIFICA SE POSSUI CONFIGURAÇÕES PARA O CHAT
            if(JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).troca_operador){ // VERIFICA SE POSSUI CONFIGURAÇÃO PARA O TIPO DA FASE
                nivel_msg = JSON.parse(configuracoes.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_chat).troca_operador?.nivel_msg; // SETA O NÍVEL DAS MSGS
            }
        }
    }

    // FUNÇÃO PARA TROCAR O OPERADOR
    function handleChangeOperator(e){
        let tipo_aux;
        let motivo_troca = '';

        if(params?.type_phase === 'Início'){
            tipo_aux = 'next';
        }else if(params?.type_phase === 'Check'){
            tipo_aux = 'present';         
        }else{
            if(fases){
                tipo_aux = 'present';
            }else{
                // tipo_aux = 'next';
                tipo_aux = 'present';
            }
        }
        
        let filter={
            mensagem: params?.ativ_desc + ' ' + e.label + (motivo_troca?.length ? ' - ' + motivo_troca : ''),
            id_modulo: (params.id_modulo ? params.id_modulo : params?.filterModule),
            id_job: params?.id_job,
            id_job_lote: params?.id_job_lote,
            id_job_status: params?.id_job_status,
            id_job_apl: params?.id_job_apl,
            id_loja: (params?.filter_subtype === 'store' ? e.value : undefined),
            id_usuario: (params?.filter_subtype === 'user' ? e.value : undefined),
            acao_fase: (e?.tipo_fase === 'Check' ? tipo_aux : undefined), // SÓ ENVIA SE FOR A FASE DE CHECK
            tipo_fase: (e?.tipo_fase === 'Check' ? params?.type_phase : undefined), // SÓ ENVIA SE FOR A FASE DE CHECK
            id_fase: (e?.tipo_fase === 'Operação' ? e.id_fase : undefined),
            type_operator: params?.filter_subtype,
            mp: nivel_msg,
            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
        };

        if(maximized){
            if(callback){
                callback(filter)
                setOperatorSelected(e.value);
            }
        }else{
            if(fases){
                motivo_troca=window.prompt('Motivo da troca de operador');
            }        
            
            if((motivo_troca !== null && motivo_troca !== '') || !fases){
                // MANDA INFORMAÇÃO PRO COMPONENTE PAI PARA ATUALIZAR INSTANTANEAMENTE SEM ESPERAR RETORNO DA API
                if(onChange){
                    onChange({
                        operator: e.id,
                        operator_old: e?.tipo_fase === 'Check' ? params?.id_usuario_sup : params?.id_usuario,
                        index_job: params?.index_job ? params?.index_job : 0,
                        id_job_status: params?.id_job_status,
                        tipo_fase: e?.tipo_fase
                    });
                }
                toast('Card encaminhado a(o) '+ (e?.tipo_fase === 'Check' ? 'checker' : 'operador(a)') + ' ' + e.nome);

                setOperatorSelected(e.value);
            
                axios({
                    method: 'post',
                    url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                    data: {
                        db_type: global.db_type,
                        tables: [{
                            table: 'operator',
                            filter: filter
                        }]
                    },
                    headers: {'Content-Type': 'multipart/form-data'}
                });
            }
        }
    }

    // DEFINE A API QUE IRÁ BUSCAR OS OPTIONS DE OPERADORES
    let url_aux, params_aux;

    if((chamados || params?.id_modulo) && !fases){
        let tipo_fase_aux;

        if(params?.type_phase === 'Check'){
            tipo_fase_aux = 'Check';
        }else{
            tipo_fase_aux = 'Operação';
        }

        url_aux = window.host_madnezz+"/systems/integration-react/api/request.php?type=Job";
        params_aux = {
            db_type: global.db_type,
            do: 'getTable',
            tables: [{
                table: 'operator',
                filter: {
                    type_phase: tipo_fase_aux,
                    id_module: (params?.id_modulo ? params?.id_modulo : filterModule),
                    type_operator: params?.filter_subtype
                }
            }]
        }
    }else{
        let component_aux = '';
        if(params?.filter_subtype == 'user'){
            component_aux = 'usuario';
        }else if(params?.filter_subtype == 'store'){
            component_aux = 'loja';
        }

        url_aux = window.host_madnezz+'/api/sql.php?do=select&component='+component_aux+'&np=true';
        params_aux = {
            empreendimento_id: filterEmpreendimento,
        }  
    }

    return(
        <div className={(margin !== false ? 'mt-3 mb-2' : '')}>
            <SelectReact
                label={label}
                placeholder={placeholder}
                name="troca_operador"
                // options={options}
                api={{
                    url: url_aux,
                    params: params_aux,
                    key_aux: (chamados ? ['data', 'operator'] : undefined)
                }}
                value={operatorSelected}
                required={false}
                menuPlacement={menuPlacement}
                isRtl={true}
                onChange={(e) => handleChangeOperator(e)}
            />
        </div>
    )
}