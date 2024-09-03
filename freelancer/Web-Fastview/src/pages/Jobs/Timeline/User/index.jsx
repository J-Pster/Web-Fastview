import axios from 'axios';
import style from '../style.module.scss';
import { useEffect, useRef, useState } from 'react';
import { cd, diffDays, get_date } from '../../../../_assets/js/global';
import Title from '../../../../components/body/title';
import Tippy from '@tippyjs/react';
import Loader from '../../../../components/body/loader';
import Info from '../../Lista/Jobs/modal';

export default function User({user, hours, filters, chamados, fases, visitas, configuracoes}){
    // ESTADOS
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ABORT AXIOS
    const abort = useRef(new AbortController());

    // GET LOG
    function get_logs(loading){
        abort.current.abort();
        abort.current = new AbortController();

        if(loading){
            setLoading(true);
        }

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'sql_server',
                type: 'Job',
                do: 'getTable',
                tables: [{ 
                    table: 'log',
                    filter: {
                        // acao: filters?.filterTipo,
                        usuario: [user?.id],
                        inicio_start: get_date('date_sql', cd(filters?.filterDate)),
                        inicio_end: get_date('date_sql', cd(filters?.filterDate)),
                        ordenacao: 1 
                    }
                }]
            },
            signal: abort.current.signal
        }).then((response) => {
            if(response?.data?.data?.log){
                setLogs(response?.data?.data?.log);
            }

            setLoading(false);
        });
    }

    // CHAMA A FUNÇÃO GET LOGS
    useEffect(() => {
        get_logs(true);
    },[filters?.filterDate]);

    // CALCULA WIDTH DOS ITENS
    useEffect(() => {
        if(logs?.length > 0){
            let array_aux = [];

            Array.from(document.querySelectorAll('[data-top][data-user="'+user?.id+'"]'))?.map((item, i) => {
                array_aux.push(item?.dataset?.top);
            });
            
            array_aux?.map((item, i) => {
                let percentage = 100 / (array_aux.filter((elem) => elem == item).length);
                var elems = document.querySelectorAll('[data-top="'+item+'"][data-user="'+user?.id+'"]');
                var index = 0, length = elems.length;
                for ( ; index < length; index++) {
                    elems[index].style.width = (percentage * index === 0 ? 'calc('+percentage+'% - 20px)' : 'calc('+percentage+'% - 15px)');
                    elems[index].style.left = (percentage * index === 0 ? '10px' : 'calc('+(percentage * index)+'% + 5px)');
                }
            });
        }
    },[logs, filters?.filterTipo]);

    return(
        <div className={style.user} style={{height: ((hours.length * 35.5) + 60)}}>
            <div className={style.lines}>
                {hours.map((item, i) => {
                    return <div className={style.line}></div>;
                })}
            </div>
            
            <Title className={style.title}>
                {user?.nome}

                <span
                    className={style.status}
                    style={{backgroundColor: user?.online ? '#56b700' : '#fb2323'}}
                ></span>
            </Title>

            {(loading ?
                <Loader fullHeight style={{marginTop: -33}} />
            :
                logs?.map((log, i) => {
                    let log_hour_start = log?.inicio ? get_date('full_hour', log?.inicio, 'datetime_sql')?.slice(0,5) : undefined;
                    let log_hour_end;                    
                    let top_aux = 0; 
                    let decimal_aux = 0;
                    let height_position_start = 0;
                    let height_position_end = 0;
                    let height_aux = 33;

                    if(log?.fim){
                        log_hour_end = get_date('full_hour', log?.fim, 'datetime_sql')?.slice(0,5)
                    }else{
                        if(log?.acao === 'Execução'){
                            log_hour_end = get_date('full_hour', window.currentDate, 'datetime_sql')?.slice(0,5);   
                        }else{
                            log_hour_end = log_hour_start;   
                        }                        
                    }

                    hours?.map((hour, i) => {
                        if(hour <= log_hour_start && hours[i+1] > log_hour_start){                            
                            top_aux = (((i+1) / hours.length) * 100);
                            decimal_aux = (get_date('full_hour', log?.inicio, 'datetime_sql')?.slice(3,5) / 60) * 100;

                            height_position_start = i;
                        }

                        if(hour < log_hour_end){
                            height_position_end = i;
                        }
                    });

                    height_aux = height_aux * (height_position_end - height_position_start);

                    // DEFINE COR DO LOG
                    let background_aux = '#fff';
                    let color_aux = '#fff';
                    let border_color_aux = 'rgba(0,0,0,0.05)';

                    // DEFINE CORES
                    if (log?.id_apl == 224) { // CHAMADOS
                        if(log?.urgente == 1){
                            background_aux = '#f4c008';
                        }else{
                            // VERIFICA SE O EMPREENDIMENTO TEM SLA CONFIGURADO NO BANCO, SE NÃO COLOCA O PADRÃO: 8
                            let sla_aux;
                            if(configuracoes?.filter((elem) => elem.id_apl == log?.id_apl)?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao){
                                let json_aux = JSON.parse(configuracoes?.filter((elem) => elem.id_apl == log?.id_apl)?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao);
                                if(json_aux?.sla){
                                    sla_aux = json_aux?.sla;
                                }
                            }
                 
                            let dias_aux;
                            // SE RECEBER O VALOR DE DIAS DO BACK-END, SETA ELE, CASO CONTRÁRIO FAZ A COMPARAÇÃO DAS DATAS
                            if(log?.dias){
                                dias_aux = log?.dias;
                            }else{
                                dias_aux = (diffDays(window.currentDate, log?.data?.slice(0,10)+' 00:00:00'));
                            }
                
                            if(dias_aux >= sla_aux){ // SE FOI ABERTO A MAIS DE 7 DIAS FICA LARANJA
                                background_aux = '#ff772a';
                            }else{
                                if(!log?.recebido || log?.recebido == 0){
                                    background_aux = '#0396d8';
                                }else{
                                    background_aux = '#fff';
                                    color_aux = '#212529';
                                    border_color_aux = '#0086c9';
                                }
                            }
                        }
                        
                        // SE RECUSADO PELO OPERADOR FICA VERMELHO
                        if (log?.status == 2) {
                            background_aux = '#f2383a';
                            color_aux = '#fff';
                            border_color_aux = 'rgba(0,0,0,0.05)';
                        }

                        // SE APROVADO PELO CHECKER FICA AZUL
                        if (log?.status_sup == 1) {
                            background_aux = '#0396d8';
                            color_aux = '#fff';
                            border_color_aux = 'rgba(0,0,0,0.05)';
                        }
                
                        // SE RECUSADO PELO CHECKER FICA VERMELHO
                        if (log?.status_sup == 2) {
                            background_aux = '#f2383a';
                            color_aux = '#fff';
                            border_color_aux = 'rgba(0,0,0,0.05)';
                        }
                    } else if (log?.id_apl == 225) { //FASES
                        if (log?.status == 0 && log?.data > get_date('datetime_sql', new Date())) { // PADRÃO
                            background_aux = '#fff';
                            color_aux = '#212529';
                            border_color_aux = '#0086c9';
                        } else if (log?.status == 0 && log?.data < get_date('datetime_sql', new Date()) && log?.status_sup != 3) { // ATRASADO
                            background_aux = '#f2383a';
                        } else if (log?.status == 0 && log?.data < get_date('datetime_sql', new Date()) && log?.status_sup == 3) { // ATRASADO REABERTO
                            background_aux = '#f2383a';
                        } else if (log?.status == 1) { // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
                            background_aux = '#0396d8';
                        } else if (log?.status == 2) { // NÃO TEM
                            background_aux = '#676767';
                        } else if (log?.status == 3) { // CONCLUÍDO COM ATRASO
                            background_aux = '#f4c008';
                        } else if (log?.status == 5) { // CONCLUÍDO COM RESSALVA
                            background_aux = '#00B050';
                        } else {
                            background_aux = '';
                        }
                    } else if (log?.id_apl == 226) { // VISITAS
                        if(log?.status == 1){ // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
                            background_aux = '#0396d8';
                        }else if(log?.status == 3){ // CONCLUÍDO COM ATRASO
                            background_aux = '#f4c008';
                        }else if(log?.status == 0 && log?.data < window.currentDateWithoutHour && log?.status_sup != 3) { // ATRASADO
                            background_aux = '#f2383a';
                        }else{
                            background_aux = '';
                        }
                    } else { // JOBS
                        if (log?.status == 4) { // ADIADO
                            background_aux = '#BDC3CB';
                        } else {
                            if(log?.status_sup == 3){
                                background_aux = '#361185';
                            }else{             
                                if (log?.status == 0 && log?.data > get_date('datetime_sql', new Date())) { // PADRÃO
                                    background_aux = '#fff';
                                    color_aux = '#212529';
                                    border_color_aux = '#0086c9';
                                } else if (log?.status == 0 && log?.data < get_date('datetime_sql', new Date()) && log?.status_sup != 3) { // ATRASADO
                                    background_aux = '#f2383a';
                                } else if (log?.status == 0 && log?.data < get_date('datetime_sql', new Date()) && log?.status_sup == 3) { // ATRASADO REABERTO
                                    background_aux = '#f2383a';
                                } else if (log?.status == 1) { // CONCLUÍDO NO PRAZO SEM AVALIAÇÃO DO SUPERVISOR
                                    background_aux = '#0396d8';
                                } else if (log?.status == 2) { // NÃO TEM
                                    background_aux = '#676767';
                                } else if (log?.status == 3) { // CONCLUÍDO COM ATRASO
                                    background_aux = '#f4c008';
                                } else if (log?.status == 5) { // CONCLUÍDO COM RESSALVA
                                    background_aux = '#00B050';
                                } else if (log?.status == 7) { // CONCLUÍDO COM INCONFORMIDADE
                                    background_aux = '#ff772a';
                                } else if (log?.status == 8) { // BLOQUEADO
                                    background_aux = '#81878d';
                                } else {
                                    background_aux = '';
                                }
                            }
                        }
                    }

                    if(filters?.filterTipo?.includes(log?.acao_id) || filters?.filterTipo?.length === 0){
                        return(
                            <Tippy content={log?.titulo}>
                                <div
                                    key={log?.id_job_status+'_'+log?.inicio+'_'+log?.fim}
                                    data-user={user?.id}
                                    data-top={top_aux}
                                    className={style.log}                            
                                    style={{
                                        top: 'calc('+top_aux+'% + 20px)',
                                        height: height_aux,
                                        backgroundColor: background_aux,
                                        color: color_aux,
                                        borderLeftColor: border_color_aux
                                    }}
                                >
                                    {log?.titulo}

                                    <Info
                                        id={log.id_job_status}
                                        fases={fases}
                                        chamados={chamados}
                                        button={<div className={style.moreInfo}></div>}
                                        configuracoesAux={configuracoes}
                                        id_apl={log?.id_apl}
                                        // refreshCard={handleRefreshCard}
                                        // optionsModule={optionsModule}
                                    />
                                </div>
                            </Tippy>
                        )
                    }
                })
            )}
        </div>
    )
}