import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../../../context/Global";
import CardJobs from "../../Card";
import style from '../../card.module.scss';
import Card from "../../../../../components/body/card";
import axios from "axios";
import Loader from "../../../../../components/body/loader";

export default function Group({jobs, job, group, widget, optionsModule, indexSlide, expandCallback, swiper, filters, changeLayout, reloadInternal, reload, refreshCard, changeStatus, reachBeginning, reachEnd, transitionEnd, expand, refresh, actionButton}){
    // CONTEXT GLOBAL
    const { cardExternal } = useContext(GlobalContext);

    // VARIÁVEIS
    let filter_jobs = [];
    let filter_fases = [];
    let filter_comunicados = [];
    let filter_notificacoes = [];
    let fase_usuario;

    let array_not_ids = [];

    if (filters?.tipoCalendario == 1 || filters?.tipoCalendario == 2 || filters?.tipoCalendario == 4) { // CALENDÁRIO LOJA OU USUÁRIO
        // NOTIFICAÇÕES
        filter_notificacoes = group?.cards?.filter((elem) => {
            if (!array_not_ids.includes(elem.id_job_status) && elem.id_apl == '231') {
                return array_not_ids.push(elem.id_job_status);
            } else {
                return false;
            }
        });

        // COMUNICADOS
        filter_comunicados = group?.cards?.filter((elem) => {
            if (!array_not_ids.includes(elem.id_job_status) && elem.id_apl == '229') {
                return array_not_ids.push(elem.id_job_status);
            } else {
                return false;
            }
        });

        // FASES
        filter_fases = group?.cards?.filter((elem) => {
            if (!array_not_ids.includes(elem.id_job_status) && elem.id_apl == '225' && elem?.ids_apl?.split(',').length > 0 && elem?.ids_apl?.split(',')?.includes('225') && elem.id_job_parent) {
                return array_not_ids.push(elem.id_job_status);
            } else {
                return false;
            }
        });

        // JOBS
        filter_jobs = group?.cards?.filter((elem) => {
            if (!array_not_ids.includes(elem.id_job_status) && elem.id_apl == '223' && (elem?.ids_apl?.split(',').length > 0 && !elem?.ids_apl?.split(',')?.includes('224') && !elem?.ids_apl?.split(',')?.includes('225'))) {
                return array_not_ids.push(elem.id_job_status);
            } else {
                return false;
            }
        });
    } else {
        filter_jobs = group?.cards;
    }

    // DEFINE USUÁRIO
    let usuario_aux;
    if(filters?.tipoCalendario == 1){
        usuario_aux = filters?.usuario;
    }else if(job?.id_usuario){
        usuario_aux = job?.id_usuario;
    }else{
        usuario_aux = window.rs_id_user;
    }

    // ESTADOS
    const [chamados, setChamados] = useState([]);
    const [chamadosLoading, setChamadosLoading] = useState(false);
    const [fases, setFases] = useState([]);
    const [fasesLoading, setFasesLoading] = useState(false);

    const handleReloadInternal = (e) => {
        reloadInternal(e);
    }

    const handleRefreshCard = (e) => {
        refreshCard(e);
    }

    const handleRefreshCardChamados = (e) => {
        get_chamados();
    }

    const handleChangeStatus = (e) => {
        changeStatus(e);
    }

    const handleExpandCallback = (e) => {
        if(expandCallback){
            expandCallback({
                callback: e
            })
        }
    }

    // CALLBACK DO CADASTRO PARA RECARREGAR A CONSULTA
    const handleReload = () => {
        if(reload){
            reload();
        }
    }

    // BUSCA CHAMADOS
    function get_chamados(){
        setChamadosLoading(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: global.db_type,
                do: 'getReport',
                type: 'Job',
                filter_type: 'moreColumns',
                filter_id_user: usuario_aux,
                filter_id_apl: [224],
                filter_status: [0],
                id_apl: 224
            }
        }).then((response) => {
            if(response.data){
                setChamados(response.data?.data);
            }
            setChamadosLoading(false);
        });
    } 

    // BUSCA FASES
    function get_fases(){
        fase_usuario = false;

        setFasesLoading(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {                
                db_type: global.db_type,
                type: 'Job',
                do: 'getCard',
                message_internal: 'last',
                fase_aux: true,
                filter_id_user_jlote: usuario_aux,
                filter_id_apl: [225],
                filter_type: 'phase',
                filter_active_status: [1],
                filter_subtype: 'emailReport'
            }
        }).then((response) => {
            if(response?.data?.data && Array.isArray(response?.data?.data) && response?.data?.data?.length > 0){
                setFases(fases => [...filter_fases, ...response.data.data]);
            }
            setFasesLoading(false);
        });
    }

    // FAZ A BUSCA SEMPRE QUE SOFRE ALTERAÇÃO DO JOBS
    useEffect(() => {
        if(job?.date == window.currentDateWithoutHour || job?.id_usuario){    
            get_chamados();
        }

        if(!window.rs_id_lja || window.rs_id_lja == 0){
            if(filters?.tipoCalendario == 1 || filters?.tipoCalendario == 4){
                get_fases();
            }
        }
    },[group]);

    // CHAMADOS PENDENTES
    let chamados_pendentes = [];
    let chamados_solicitados = [];

    if(filters?.tipoCalendario == 1){
        chamados_pendentes = chamados?.filter((elem) => elem.id_usuario == filters?.usuario);
        chamados_solicitados = chamados?.filter((elem) => elem.id_usuario_cad == filters?.usuario);
    }else if(job?.id_usuario){
        chamados_pendentes = chamados?.filter((elem) => elem.id_usuario == job?.id_usuario);
        chamados_solicitados = chamados?.filter((elem) => elem.id_usuario_cad == job?.id_usuario);
    }    

    return(                          
        <div>
            <div>
                {(filter_jobs.length > 0 ?
                    filter_jobs.map((card, i) => {
                        if((cardExternal.enabled && cardExternal.id == card?.id_job_status) || !cardExternal.enabled){
                            return(
                                <CardJobs
                                    key={'calendario_' + (filters?.tipoCalendario == 7 || filters?.tipoCalendario == 9 ? card?.id_job : card?.id_job_status)}
                                    i={i}
                                    indexSlide={indexSlide}
                                    card={card}
                                    group={group}
                                    jobs={jobs}
                                    job={job}
                                    loja={filters?.loja}
                                    usuario={filters?.usuario}
                                    periodStart={filters?.periodStart}
                                    periodEnd={filters?.periodEnd}
                                    swiper={swiper}
                                    optionsModule={optionsModule}
                                    tipoCalendario={filters?.tipoCalendario}
                                    subTipoCalendario={filters?.subTipoCalendario}
                                    changeLayout={changeLayout}
                                    reload={handleReload}
                                    reloadInternal={handleReloadInternal}
                                    refreshCard={handleRefreshCard}
                                    changeStatus={handleChangeStatus}
                                    widget={widget}
                                    expand={handleExpandCallback}
                                />
                            )
                        }
                    })
                :
                (filters?.tipoCalendario == 3 || cardExternal.enabled ? 
                    <></>
                :
                    <Card
                        empty={true}
                        widget={widget}
                    ></Card>
                )
                )}
            </div>

            {/* FASES PENDENTES COM O USUÁRIO */}
            {(!window.rs_id_lja || window.rs_id_lja == 0 ?
                <div>
                    {((filters?.tipoCalendario == 4 || filters?.tipoCalendario == 1) && !cardExternal.enabled ?
                        <div className={style.separator}>
                            <span>Fases</span>
                        </div>
                    :'')}

                    {(fasesLoading ?
                        <Loader />
                    :
                        <>
                            {(fases && Array.isArray(fases) && fases?.length > 0 && typeof fases?.map === 'function' ?
                                fases?.map((fase, i) => {                            
                                    if(fase['group'][0]['cards']?.length > 0){
                                        return (
                                            fase['group'][0]['cards'].map((card, i) => {
                                                if((cardExternal.enabled && cardExternal.id == card?.id_job_status) || !cardExternal.enabled){
                                                    if(Array.isArray(card?.cards_parent) && card?.cards_parent.length > 0){
                                                        if(usuario_aux == card?.id_usuario && ((card?.data?.split(' ')[0]==job?.date && filters?.tipoCalendario == 1) || (filters?.tipoCalendario == 4 && card?.data?.split(' ')[0]==window.currentDateWithoutHour))){
                                                            fase_usuario = true;
                                                        }

                                                        return(
                                                            <> 
                                                                {usuario_aux == card?.id_usuario  && ((card?.data?.split(' ')[0]==job?.date && filters?.tipoCalendario == 1) || (filters?.tipoCalendario == 4 && card?.data?.split(' ')[0]==window.currentDateWithoutHour))?
                                                                    <CardJobs
                                                                        key={'fases_'+card?.id_job_status}
                                                                        i={i}
                                                                        indexSlide={indexSlide}
                                                                        card={card}
                                                                        group={group}
                                                                        jobs={jobs}
                                                                        job={job}
                                                                        loja={filters?.loja}
                                                                        usuario={filters?.usuario}
                                                                        periodStart={filters?.periodStart}
                                                                        fases={true}
                                                                        actions={{
                                                                            prev: false,
                                                                            next: false
                                                                        }}
                                                                        periodEnd={filters?.periodEnd}
                                                                        swiper={swiper}
                                                                        optionsModule={optionsModule}
                                                                        tipoCalendario={filters?.tipoCalendario}
                                                                        subTipoCalendario={filters?.subTipoCalendario}
                                                                        changeLayout={changeLayout}
                                                                        reload={handleReload}
                                                                        reloadInternal={handleReloadInternal}
                                                                        refreshCardChamados={handleRefreshCardChamados}
                                                                        changeStatus={handleChangeStatus}
                                                                        widget={widget}
                                                                        expand={{
                                                                            callback: handleExpandCallback
                                                                        }}
                                                                    />
                                                                :''}   
                                                                
                                                                {card?.cards_parent.map((card_parent, i) => {
                                                                    if(usuario_aux == card_parent?.id_usuario && ((card_parent?.data?.split(' ')[0]==job?.date && filters?.tipoCalendario == 1) || (filters?.tipoCalendario == 4 && card_parent?.data?.split(' ')[0]==window.currentDateWithoutHour))){
                                                                        fase_usuario = true;

                                                                        return(
                                                                            <CardJobs
                                                                                key={'fases_'+card_parent?.id_job_status}
                                                                                i={i}
                                                                                fases_aux={card?.nome_cliente ? card?.nome_cliente + ' - ' + card?.titulo : card?.titulo}
                                                                                indexSlide={indexSlide}
                                                                                card={card_parent}
                                                                                group={group}
                                                                                jobs={jobs}
                                                                                job={job}
                                                                                loja={filters?.loja}
                                                                                usuario={filters?.usuario}
                                                                                periodStart={filters?.periodStart}
                                                                                fases={true}
                                                                                actions={{
                                                                                    prev: false,
                                                                                    next: false
                                                                                }}
                                                                                periodEnd={filters?.periodEnd}
                                                                                swiper={swiper}
                                                                                optionsModule={optionsModule}
                                                                                tipoCalendario={filters?.tipoCalendario}
                                                                                subTipoCalendario={filters?.subTipoCalendario}
                                                                                changeLayout={changeLayout}
                                                                                reload={handleReload}
                                                                                reloadInternal={handleReloadInternal}
                                                                                refreshCardChamados={handleRefreshCardChamados}
                                                                                changeStatus={handleChangeStatus}
                                                                                widget={widget}
                                                                                expand={{
                                                                                    callback: handleExpandCallback
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
                                                                })}
                                                            </>
                                                        )
                                                    }else{
                                                        if(usuario_aux == card?.id_usuario && ((card?.data?.split(' ')[0]==job?.date && filters?.tipoCalendario == 1) || (filters?.tipoCalendario == 4 && card?.data?.split(' ')[0]==window.currentDateWithoutHour))){
                                                            fase_usuario = true;
                                                            
                                                            return(
                                                                <CardJobs
                                                                    key={'fases_'+card?.id_job_status}
                                                                    i={i}
                                                                    indexSlide={indexSlide}
                                                                    card={card}
                                                                    group={group}
                                                                    jobs={jobs}
                                                                    job={job}
                                                                    loja={filters?.loja}
                                                                    usuario={filters?.usuario}
                                                                    periodStart={filters?.periodStart}
                                                                    fases={true}
                                                                    actions={{
                                                                        prev: false,
                                                                        next: false
                                                                    }}
                                                                    periodEnd={filters?.periodEnd}
                                                                    swiper={swiper}
                                                                    optionsModule={optionsModule}
                                                                    tipoCalendario={filters?.tipoCalendario}
                                                                    subTipoCalendario={filters?.subTipoCalendario}
                                                                    changeLayout={changeLayout}
                                                                    reload={handleReload}
                                                                    reloadInternal={handleReloadInternal}
                                                                    refreshCardChamados={handleRefreshCardChamados}
                                                                    changeStatus={handleChangeStatus}
                                                                    widget={widget}
                                                                    expand={{
                                                                        callback: handleExpandCallback
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                    }
                                                }
                                            })
                                        )                               
                                    }
                                })
                            :
                                ''
                            )}

                            {/* INSERE BOX VAZIO CASO O USUÁRIO NÃO TENHA NENHUM CARD NO BLOCO DE FASES */}
                            {((filters?.tipoCalendario == 4 || filters?.tipoCalendario == 1) && !cardExternal.enabled && !fase_usuario ?
                                <Card
                                    empty={true}
                                    widget={widget}
                                ></Card>
                            :'')}
                        </>
                    )}
                </div>
            :'')}

            {/* CHAMADOS PENDENTES DO USUÁRIO */}
            <div>
                {((filters?.tipoCalendario == 4 || job?.date == window.currentDateWithoutHour) && !cardExternal.enabled ?
                    <div className={style.separator}>
                        <span>Chamados Pendentes</span>
                    </div>
                :'')}

                {(chamadosLoading ?
                    <Loader />
                :
                    (chamados_pendentes.length > 0 ?
                        chamados_pendentes.map((card, i) => {
                            if((cardExternal.enabled && cardExternal.id == card?.id_job_status) || !cardExternal.enabled){
                                return(
                                    <CardJobs
                                        key={'chamados_pendentes_'+card?.id_job_status}
                                        i={i}
                                        indexSlide={indexSlide}
                                        card={card}
                                        group={group}
                                        jobs={chamados_pendentes}
                                        job={job}
                                        loja={filters?.loja}
                                        usuario={filters?.usuario}
                                        periodStart={filters?.periodStart}
                                        chamados={true}
                                        periodEnd={filters?.periodEnd}
                                        swiper={swiper}
                                        optionsModule={optionsModule}
                                        tipoCalendario={filters?.tipoCalendario}
                                        subTipoCalendario={filters?.subTipoCalendario}
                                        changeLayout={changeLayout}
                                        reload={handleReload}
                                        reloadInternal={handleReloadInternal}
                                        refreshCardChamados={handleRefreshCardChamados}
                                        changeStatus={handleChangeStatus}
                                        widget={widget}
                                        expand={{
                                            callback: handleExpandCallback
                                        }}
                                    />
                                )
                            }
                        })
                    :
                        ((filters?.tipoCalendario == 4 || job?.date == window.currentDateWithoutHour) && !cardExternal.enabled ?
                            <Card
                                empty={true}
                                widget={widget}
                            ></Card>
                        :'')
                    )
                )}
            </div>

            {/* CHAMADOS SOLICITADOS PELO USUÁRIO */}
            <div>
                {((filters?.tipoCalendario == 4 || job?.date == window.currentDateWithoutHour) && !cardExternal.enabled ?
                    <div className={style.separator}>
                        <span>Chamados Solicitados</span>
                    </div>
                :'')}

                {(chamadosLoading ?
                    <Loader />
                :
                    (chamados_solicitados.length > 0 ?
                        chamados_solicitados.map((card, i) => {
                            if((cardExternal.enabled && cardExternal.id == card?.id_job_status) || !cardExternal.enabled){
                                return(
                                    <CardJobs
                                        key={'chamados_solicitados_'+card?.id_job_status}
                                        i={i}
                                        indexSlide={indexSlide}
                                        card={card}
                                        group={group}
                                        jobs={jobs}
                                        job={job}
                                        loja={filters?.loja}
                                        usuario={filters?.usuario}
                                        periodStart={filters?.periodStart}
                                        periodEnd={filters?.periodEnd}
                                        swiper={swiper}
                                        optionsModule={optionsModule}
                                        tipoCalendario={filters?.tipoCalendario}
                                        subTipoCalendario={filters?.subTipoCalendario}
                                        changeLayout={changeLayout}
                                        reload={handleReload}
                                        reloadInternal={handleReloadInternal}
                                        refreshCardChamados={handleRefreshCardChamados}
                                        changeStatus={handleChangeStatus}
                                        widget={widget}
                                        expand={{
                                            callback: handleExpandCallback
                                        }}
                                    />
                                )
                            }
                        })
                    :
                        (filters?.tipoCalendario == 4 || job?.date == window.currentDateWithoutHour ?
                            <Card
                                empty={true}
                                widget={widget}
                            ></Card>
                        :'')
                    )
                )}
            </div>

            {/* COMUNICADOS */}
            <div>
                {(filter_comunicados.length > 0 ?
                    <div className={style.separator}>
                        <span>Comunicados</span>
                    </div>
                :'')}

                {(filter_comunicados.length > 0 ?
                    filter_comunicados.map((card, i) => {
                        if((cardExternal.enabled && cardExternal.id == card?.id_job_status) || !cardExternal.enabled){
                            return(
                                <CardJobs
                                    key={'calendario_' + (filters?.tipoCalendario == 7 || filters?.tipoCalendario == 9 ? card?.id_job : card?.id_job_status)}
                                    i={i}
                                    indexSlide={indexSlide}
                                    card={card}
                                    group={group}
                                    jobs={jobs}
                                    job={job}
                                    loja={filters?.loja}
                                    usuario={filters?.usuario}  
                                    periodStart={filters?.periodStart}
                                    periodEnd={filters?.periodEnd}
                                    swiper={swiper}
                                    optionsModule={optionsModule}
                                    tipoCalendario={filters?.tipoCalendario}
                                    subTipoCalendario={filters?.subTipoCalendario}
                                    changeLayout={changeLayout}
                                    reload={handleReload}
                                    reloadInternal={handleReloadInternal}
                                    refreshCard={handleRefreshCard}
                                    changeStatus={handleChangeStatus}
                                    widget={widget}
                                    expand={{
                                        callback: handleExpandCallback
                                    }}
                                />
                            )
                        }
                    })
                :
                    <></>
                )}
            </div>

            {/* NOTIFICAÇÕES */}
            <div>
                {(filter_notificacoes.length > 0 ?
                    <div className={style.separator}>
                        <span>Notificações</span>
                    </div>
                :'')}

                {(filter_notificacoes.length > 0 ?
                    filter_notificacoes.map((card, i) => {
                        if((cardExternal.enabled && cardExternal.id == card?.id_job_status) || !cardExternal.enabled){
                            return(
                                <CardJobs
                                    key={'calendario_' + card?.id_job_status}
                                    i={i}
                                    indexSlide={indexSlide}
                                    card={card}
                                    group={group}
                                    jobs={jobs}
                                    job={job}
                                    loja={filters?.loja}
                                    usuario={filters?.usuario}  
                                    periodStart={filters?.periodStart}
                                    periodEnd={filters?.periodEnd}
                                    swiper={swiper}
                                    optionsModule={optionsModule}
                                    tipoCalendario={filters?.tipoCalendario}
                                    subTipoCalendario={filters?.subTipoCalendario}
                                    changeLayout={changeLayout}
                                    reload={handleReload}
                                    reloadInternal={handleReloadInternal}
                                    refreshCard={handleRefreshCard}
                                    changeStatus={handleChangeStatus}
                                    widget={widget}
                                    expand={{
                                        callback: handleExpandCallback
                                    }}
                                />
                            )
                        }
                    })
                :
                    <></>
                )}
            </div>
        </div>
    )
}
