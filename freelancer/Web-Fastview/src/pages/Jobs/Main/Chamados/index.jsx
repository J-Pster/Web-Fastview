import { Fragment, useContext } from "react";

/*SWIPER*/
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../../../../_assets/css/swiper.scss";

import { GlobalContext } from "../../../../context/Global";
import style from '../card.module.scss';
import Title from "../../../../components/body/title";
import Editar from "../../../../components/body/card/editar";
import CardJobs from "../Card";
import Card from "../../../../components/body/card";
import { useState } from "react";
import { JobsContext } from "../../../../context/Jobs";
import { useEffect } from "react";
import PageError from "../../../../components/body/pageError";
import Tippy from "@tippyjs/react";
import Icon from "../../../../components/body/icon";
import Operador from "./Operador";

// DND KIT (ARRASTAR)
import {
    DndContext, 
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';

import {
    restrictToVerticalAxis
} from '@dnd-kit/modifiers';
import axios from "axios";
import { useNavigate } from "react-router";
import Container from "../../../../components/body/container";

export default function Chamados({jobs, jobsCols, widget, optionsModule, optionsModuleUnfiltered, filters, reloadInternal, refreshCard, changeStatus, changeOperator, changeModule, expand, createNew, refresh, refreshCalendar, collapse, permission}){
    // CONTEXT GLOBAL
    const { loadingCards, cardExternal, prevIndex, handleSetPrevIndex } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { configuracoes, optionsAvaliacao } = useContext(JobsContext);

    // NAVIGATE
    const navigate = useNavigate();

    // ESTADOS
    const [swiper, setSwiper] = useState();
    const [pageError, setPageError] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [clone, setClone] = useState(null);
    const [cards, setCards] = useState('');
    const [createNewAux, setCreateNewAux] = useState('');

    // ATUALIZA ESTADO DO CREATE NEW SEMPRE QUE SOFRER ALTERAÇÃO NA PROPS
    useEffect(() => {
        setCreateNewAux(createNew);
    },[createNew]);

    const handleReloadInternal = (e) => {
        reloadInternal(e);
    }

    const handleRefreshCard = (e) => {
        refreshCard(e);
    }

    const handleRefreshCalendar = (e) => {
        refreshCalendar(e);
    }

    const handleChangeStatus = (e) => {
        changeStatus(e);
    }

    const handleChangeOperator = (e) => {
        changeOperator(e);
    }

    const handleChangeModule = (e) => {
        changeModule(e);
    }

    // VERIFICA PERMISSÃO DO MÓDULO
    useEffect(() => {
        if(permission === false){
            setPageError(true);
        }else{
            setPageError(false);
        }
    },[permission]);

    // CALLBACK AO CLICAR EM EXPANDIR O CARD
    const handleExpandCallback = (e) => {
        expand?.callback();

        setTimeout(() => {
            swiper.slideTo(e?.index);

            if(prevIndex){
                swiper.slideTo(prevIndex);
                handleSetPrevIndex('');
            }

            let scrollElement = document.getElementById('card_'+e?.id);
            window.scrollTo({
                top: scrollElement.offsetTop + 42,
                behavior: 'smooth'
            });
        },100);
    }

    // CALLBACK DO CADASTRO PARA RECARREGAR A CONSULTA
    const handleReload = () => {
        if(refresh){
            refresh();
        }
    }

    // CONFIGURAÇÕES
    var troca_operador = true;
    var conf_operador_visivel = 1;
    var conf_pedidos = false;

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar){
        let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_desabilitar;

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

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_operador_visivel){
        let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_operador_visivel;

        if(json_aux == 0){
            conf_operador_visivel = 0;
        }else if(json_aux == 1){
            conf_operador_visivel = 1;
        }else{
            if(JSON.parse(json_aux)?.filter((elem) => elem.id_modulo == filters?.modulo)[0]?.value){
                conf_operador_visivel = JSON.parse(json_aux).filter((elem) => elem.id_modulo == filters?.modulo)[0]?.value;
            }
        }
    }

    // VERIFICA SE ESTÁ CONFIGURADO PRO EMPREENDIMENTO VISUALIZAR O CARD DE PEDIDOS PENDENTES
    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao){
        let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao;

        if(json_aux){
            json_aux = JSON.parse(json_aux);
        }

        if(json_aux?.pedidos){
            conf_pedidos = true;
        }
    }

    // VERIFICA SE É NECESSÁRIO INSERIR O SEPARADOR DA FILA GERAL
    var separator_aux = false;
    if(jobs){
        if(jobs.filter((elem) => elem?.type_phase === 'Operação' || elem?.type_phase === 'Check').length > 0){
            separator_aux = true;
        }
    }

    // VERIFICA SE TEM FILA DE OPERAÇÃO NO FORMATO MÓDULOS AGRUPADOS
    var fila_operacao = false;
    if(jobsCols){
        jobsCols.map((item, i) => {
            if(item?.data?.filter((elem) => elem.type_phase === 'Operação').length > 0){
                fila_operacao = true;
            }
        })
    }

    // VERIFICA SE TEM FILA DE CHECK NO FORMATO MÓDULOS AGRUPADOS
    var fila_check = false;
    if(jobsCols){
        jobsCols.map((item, i) => {
            if(item?.data?.filter((elem) => elem.type_phase === 'Check').length > 0){
                fila_check = true;
            }
        })
    }

    // CALLBACK DO COLLAPSE
    const handleSetCollapse = (e) => {
        if(collapse){
            collapse(e);
        }
    }

    // CALLBACK DO COMPONENTE DE OPERADOR
    const handleCallbackOperator = (e) => {    
        let job_index_new;
        let job_index_old = e?.index_job;
        let card_index;

        // SE FOR MAIOR QUE 4 ACRESCENTA 1 POIS DEVERIA FICAR DEPOIS DA FILA DA PROGRAMAÇÃO (4)
        if(job_index_old >= 4){
            job_index_old = job_index_old + 1;
        }

        // SE FOR OS USUÁRIOS PRÉ-FILA (160613), BLOCO 1 (158847) OU BLOCO 2 (158877)
        if(e?.operator_old == 160613 || e?.operator_old == 158847 || e?.operator_old == 158877){ // CRAVADO ATÉ COLOCAREM ESSA PROGRAMAÇÃO NO BACK-END
            job_index_old = 4
        }
        
        // BUSCA A INDEX DA COLUNA DO OPERADOR QUE ESTÁ SENDO PASSADO
        jobs.filter((elem1, index1) => {
            if(elem1?.type_phase === e?.tipo_fase){
                return elem1.group.filter((elem2, index2) => {
                    if (elem2.id == e?.operator) {
                        job_index_new = index1;
                    }else{
                        return false;
                    }
                }).length > 0;
            }
        });        

        // BUSCA INDEX DO ANTIGO E NOVO OPERADOR
        let operator_index_new = jobs[job_index_new]?.group.findIndex((elem) => elem?.id == e?.operator);  
        let operator_index_old = jobs[job_index_old]?.group.findIndex((elem) => elem?.id == e?.operator_old);  

        if(operator_index_old === -1){
            operator_index_old = 0
        }

        // SE O OPERADOR NOVO FOR DIFERENTE DO ANTIGO
        jobs[job_index_old].group[operator_index_old].cards = jobs[job_index_old].group[operator_index_old].cards.filter((elem) => elem.id_job_status != e?.card?.id_job_status);
        jobs[job_index_new]?.group[operator_index_new]?.cards.push(e?.card);   
        card_index = jobs[job_index_new]?.group[operator_index_new]?.cards.findIndex((elem) => elem?.id_job_status == e?.card?.id_job_status);

        // SE FOR TIPO FASE "OPERAÇÃO" SETA O NOVO USUÁRIO OPERADOR, CASO SEJA CHECK SETA O NOVO USUÁRIO SUPERVISOR
        if(e?.tipo_fase === 'Check'){
            jobs[job_index_new].group[operator_index_new].cards[card_index].id_usuario_sup = e?.operator;
        }else{
            jobs[job_index_new].group[operator_index_new].cards[card_index].id_usuario = e?.operator;
        }

        // SETA O NOVO TIPO FASE
        jobs[job_index_new].group[operator_index_new].cards[card_index].tipo_fase = e?.tipo_fase;

        // SETA RECEBIDO COMO 1 EM CASOS QUE O CARD ESTÁ NA FILA INICIAL
        jobs[job_index_new].group[operator_index_new].cards[card_index].recebido = 1;

        // REMOVE A TAG DE "EM EXECUÇÃO"
        jobs[job_index_new].group[operator_index_new].cards[card_index].executando = null;

        // SETA ESTADO PARA MANDAR PRO COMPONENTE FILHO
        setCards({
            operator: e?.operator,
            tipo_fase: e?.tipo_fase,
            cards: jobs[job_index_new]?.group[operator_index_new]?.cards
        });
    }

    // CALLBACK DO COMPONENTE DE AVALIAÇÃO
    const handleCallbackRate = (e) => {
        // BUSCA INDEX DA COLUNA DE PÓS-VENDA
        let job_index = jobs.findIndex((elem) => elem.type_phase === 'Pós-venda');

        // REMOVE O CARD
        jobs[job_index].group[0].cards = jobs[job_index].group[0].cards.filter((elem) => elem.id_job_status != e?.id_job_status);

        // SE NÃO TIVER MAIS CARDS EM PÓS-VENDA HABILITA NOVAMENTE O BOTÃO DE CRIAR NOVO
        if(jobs[job_index].group[0].cards.length == 0){
            setCreateNewAux(true);
        }

        // SETA ESTADO PARA MANDAR PRO COMPONENTE FILHO
        setCards({            
            tipo_fase: 'Pós-venda',
            cards: jobs[job_index]?.group[0]?.cards
        });
    }

    // CALLBACK DA TROCA DE MÓDULO
    const handleCallbackModule = (e) => {     
        // BUSCA INDEX DA COLUNA DE PÓS-VENDA
        let job_index = e?.index_job;

        // REMOVE O CARD
        jobs[job_index].group[e?.index_group].cards = jobs[job_index].group[e?.index_group].cards.filter((elem) => elem.id_job_status != e?.id_job_status);

        // SETA ESTADO PARA MANDAR PRO COMPONENTE FILHO
        setCards({            
            tipo_fase: e?.tipo_fase,
            cards: jobs[job_index]?.group[e?.index_group]?.cards
        });
    }

    // CALLBACK DO COMPONENTE DE RECEBER
    const handleCallbackReceive = (e) => {
        // BUSCA INDEX DA COLUNA DE INÍCIO
        let job_index = jobs.findIndex((elem) => elem.type_phase === 'Início');

        // BUSCA O CARD CLICADO
        let card_aux = jobs[job_index].group[0].cards?.filter((elem) => elem.id_job_status == e?.id_job_status)[0];

        // SETA 1 NO VALOR DO CAMPO "RECEBIDO"
        card_aux.recebido = 1;

        // SETA ESTADO PARA MANDAR PRO COMPONENTE FILHO
        setCards({            
            tipo_fase: 'Início',
            cards: jobs[job_index]?.group[0]?.cards
        });
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 0,
                tolerance: 0,
            },
        })
    );

    function handleDragStart(event) {
        if(event){
            setDragStart(event);
        }else{
            setDragStart(undefined);
        }
    }

    function handleDragEnd(event) {
        if(event){
            setDragEnd(event);
        }else{
            setDragEnd(undefined);
        }
    }

    if(pageError){
        return(
            <Container>
                <PageError
                    title="Ops..."
                    text={`Você não possui permissão para ver essa página\nEntre em contato com o suporte.`}
                />
            </Container>
        )
    }else{
        return(
            <Container>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >   
                    <Swiper
                        ref={swiper}
                        focusableElements="input, select, div, button, label, option, textarea"
                        preventClicks={false}
                        simulateTouch={false}
                        modules={[Navigation]}
                        autoHeight={false}
                        spaceBetween={24}
                        onSwiper={(swiper) => setSwiper(swiper)}
                        navigation={(widget || cardExternal.enabled ? false : true)}
                        className={'calendar ' + (widget ? 'widget' : '') + ' ' + (separator_aux ? 'with_separator' : '')}
                        allowTouchMove={true}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        watchSlidesProgress={true}
                        breakpoints={{
                        768: {
                            allowTouchMove: false,
                            slidesPerView: 'auto',
                            slidesPerGroupAuto: true
                        },
                        }}
                    >
                        {(loadingCards ?
                            [...Array(6)].map((card, i) => (
                                <SwiperSlide key={'empty_'+i}>
                                    <Card
                                        loading={true}
                                        qtd={1}
                                        separator={separator_aux}
                                        widget={widget}
                                    ></Card>
                                </SwiperSlide>
                            ))
                        :
                            (optionsModule.length > 0 ?
                                <>
                                    {(jobs ?
                                        jobs?.filter((elem) => elem.type_phase !== 'Pós-venda' && elem.title !== 'Pré-Fila').map((job, indexSlide) => {
                                            let cards_length = 0;                            
                                            
                                            return (
                                                <SwiperSlide key={'swiper_'+indexSlide} className={(job.type_phase === 'Início' && separator_aux ? style.swiper_separator : '')}>
                                                    {({ isVisible }) => (
                                                        (isVisible ?
                                                            <>
                                                                {(job.tipo)}
                                                                <Title
                                                                    bold={true}
                                                                    icon={
                                                                        <>
                                                                            {(job?.type_phase === 'Início' && permission !== 'leitura' ? // SE ESTIVER NA PRIMEIRA COLUNA (FILA) E TIVER PERMISSÃO DIFERENTE DE "SOMENTE LEITURA"
                                                                                <Editar
                                                                                    chamados={true}
                                                                                    empty={true}
                                                                                    date={job?.date}
                                                                                    id_emp={(job.id_emp?job.id_emp:'')}
                                                                                    frequency={{
                                                                                        id: job?.id_frequency
                                                                                    }}
                                                                                    disabled={(createNewAux ? false : true)}
                                                                                    optionsModule={optionsModule}
                                                                                    reload={handleReload}
                                                                                />
                                                                            :
                                                                                <></>
                                                                            )}
                                                                        </>
                                                                    }
                                                                >
                                                                    {job.title}
                                                                </Title>
                                                                
                                                                {job.group.length > 0 ? (                      
                                                                    job.group?.sort((a, b) => a.title - b.title).map((group, i) => {    
                                                                        return(
                                                                            <Operador
                                                                                key={'group_'+i}
                                                                                index={i}
                                                                                index_job={indexSlide}
                                                                                cards_length={cards_length}
                                                                                group={group}
                                                                                cards={cards}
                                                                                jobsCols={jobsCols}
                                                                                jobs={jobs}
                                                                                job={job}
                                                                                filters={filters}
                                                                                optionsModule={optionsModule}
                                                                                optionsModuleUnfiltered={optionsModuleUnfiltered}
                                                                                troca_operador={troca_operador}
                                                                                refreshCard={handleRefreshCard}
                                                                                refreshCalendar={handleRefreshCalendar}
                                                                                changeStatus={handleChangeStatus}
                                                                                collapse={handleSetCollapse}
                                                                                onDragStart={dragStart}
                                                                                onDragEnd={dragEnd}
                                                                                separator={separator_aux}
                                                                                callback={{
                                                                                    changeOperator: handleCallbackOperator,
                                                                                    changeModule: handleCallbackModule,
                                                                                    rate: handleCallbackRate,
                                                                                    receive: handleCallbackReceive
                                                                                }}
                                                                            />
                                                                        )
                                                                    })   
                                                                ) : (
                                                                    <Card
                                                                        empty={true}
                                                                        title={'Nenhum chamado em fila'}
                                                                        widget={widget}
                                                                        separator={separator_aux}
                                                                    ></Card>
                                                                )}  

                                                                {/* VERIFICA SE NA FILA DE OPERAÇÃO TEM ALGUM CARD EM ALGUM OPERADOR PARA PODER COLOCAR O AVISO DE NENHUM CHAMADO EM FILA */}
                                                                {(job.type_phase === 'Operação' && (cards_length === 0 && conf_operador_visivel == 0) && job.group.length > 0 ?
                                                                    <Card
                                                                        empty={true}
                                                                        title={'Nenhum chamado em fila'}
                                                                        widget={widget}
                                                                        separator={separator_aux}
                                                                    ></Card>
                                                                :'')}

                                                                {(job?.type_phase === 'Início' ?
                                                                    jobs?.filter((elem) => elem.title === 'Pré-Fila').map((job, indexSlide) => {
                                                                        let cards_length = 0;                            
                                                                        
                                                                        return (
                                                                            <Fragment key={'job_slide_'+indexSlide}>                                                                            
                                                                                {job.group.length > 0 ? (                      
                                                                                    job.group?.sort((a, b) => a.title - b.title).map((group, i) => {    
                                                                                        return(
                                                                                            <Operador
                                                                                                key={'group_'+i}
                                                                                                index={i}
                                                                                                index_job={indexSlide}
                                                                                                cards_length={cards_length}
                                                                                                group={group}
                                                                                                cards={cards}
                                                                                                jobsCols={jobsCols}
                                                                                                jobs={jobs}
                                                                                                job={job}
                                                                                                filters={filters}
                                                                                                optionsModule={optionsModule}
                                                                                                optionsModuleUnfiltered={optionsModuleUnfiltered}
                                                                                                troca_operador={troca_operador}
                                                                                                refreshCard={handleRefreshCard}
                                                                                                refreshCalendar={handleRefreshCalendar}
                                                                                                changeStatus={handleChangeStatus}
                                                                                                collapse={handleSetCollapse}
                                                                                                onDragStart={dragStart}
                                                                                                onDragEnd={dragEnd}
                                                                                                separator={separator_aux}
                                                                                                callback={{
                                                                                                    changeOperator: handleCallbackOperator,
                                                                                                    changeModule: handleCallbackModule,
                                                                                                    rate: handleCallbackRate,
                                                                                                    receive: handleCallbackReceive
                                                                                                }}
                                                                                            />
                                                                                        )
                                                                                    })   
                                                                                ) : (
                                                                                    <Card
                                                                                        empty={true}
                                                                                        title={'Nenhum chamado em fila'}
                                                                                        widget={widget}
                                                                                        separator={separator_aux}
                                                                                    ></Card>
                                                                                )}  
                                                                            </Fragment>
                                                                        )
                                                                    })
                                                                :'')}
                                                            </>
                                                        :'')
                                                    )}
                                                </SwiperSlide>
                                            )
                                        })
                                    :
                                        <>
                                            {(fila_operacao || fila_check ?
                                                <SwiperSlide>
                                                    <Title
                                                        bold={true}
                                                        icon={
                                                            <>
                                                                {(permission !== 'leitura' ? // SE ESTIVER NA PRIMEIRA COLUNA (FILA) E TIVER PERMISSÃO DIFERENTE DE "SOMENTE LEITURA"
                                                                    <Editar
                                                                        chamados={true}
                                                                        empty={true}
                                                                        disabled={(createNewAux ? false : true)}
                                                                        reload={handleReload}
                                                                    />
                                                                :
                                                                    <></>
                                                                )}
                                                            </>
                                                        }
                                                    >
                                                        Todos
                                                    </Title>

                                                    <div className={style.separator}>
                                                        <span>Fila</span>
                                                    </div>

                                                    {jobsCols?.sort((a, b) => a.id_module - b.id_module).map((job, indexSlide) => { // SORT PARA REORDENAR DE ACORDO COM O ID
                                                        return (
                                                            job?.data.filter((elem) => elem.type_phase === 'Início').map((col, i) => {
                                                                let cards_length = 0;

                                                                return(
                                                                    <div key={'col_fila_'+i}>
                                                                        {col?.group?.length > 0 ? (                      
                                                                            col.group?.map((group, i) => {
                                                                                let cards = group.cards.map((card, i) => {
                                                                                                return(
                                                                                                    <CardJobs
                                                                                                        key={'calendario_' + card?.id_job_status}
                                                                                                        i={i}
                                                                                                        indexSlide={indexSlide}
                                                                                                        card={card}
                                                                                                        group={group}
                                                                                                        jobsCols={jobsCols}
                                                                                                        jobs={jobs}
                                                                                                        job={col}         
                                                                                                        loja={filters?.loja}
                                                                                                        usuario={filters?.usuario}                                                 
                                                                                                        chamados={true}
                                                                                                        optionsModule={optionsModule}
                                                                                                        iconAvaliacao={optionsAvaliacao}
                                                                                                        tipoCalendario={filters?.tipoCalendario}
                                                                                                        subTipoCalendario={filters?.subTipoCalendario}
                                                                                                        troca_operador={troca_operador}
                                                                                                        reloadInternal={reloadInternal}
                                                                                                        refreshCard={handleRefreshCard}
                                                                                                        refreshCalendar={handleRefreshCalendar}
                                                                                                        changeStatus={handleChangeStatus}
                                                                                                        widget={widget}
                                                                                                        separator={separator_aux}
                                                                                                        expand={{
                                                                                                            callback: handleExpandCallback
                                                                                                        }}
                                                                                                        callback={{
                                                                                                            changeModule: handleCallbackModule
                                                                                                        }}
                                                                                                        collapse={handleSetCollapse}
                                                                                                    />
                                                                                                )
                                                                                            });

                                                                                return(                          
                                                                                    <div key={'group_todos_fila_'+i}>
                                                                                        {(() => {
                                                                                            if(group.title){
                                                                                                if(group?.cards?.length > 0 || conf_operador_visivel != 0){
                                                                                                    cards_length++;
                                                                                                    return(
                                                                                                        <>
                                                                                                            <Title
                                                                                                                key={'chamados_operator_'+i}
                                                                                                                icon={
                                                                                                                    <Tippy content={'Operador '+(group.online==1 ? 'online' : 'offline')}>
                                                                                                                        <span className="small text-secondary">
                                                                                                                            {(group.online==1?'On':'Off')}
                                                                                                                        </span>
                                                                                                                    </Tippy>
                                                                                                                }
                                                                                                            >
                                                                                                                {group.title}
                                                                                                            </Title>
                                                                                                            {cards}
                                                                                                        </>
                                                                                                    )
                                                                                                }
                                                                                            }else{
                                                                                                return (
                                                                                                    <>
                                                                                                        {cards}
                                                                                                            
                                                                                                    </>
                                                                                                )
                                                                                            }                                
                                                                                        })()}
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        ) : (
                                                                            <Card
                                                                                empty={true}
                                                                                title={'Nenhum chamado em fila'}
                                                                                widget={widget}
                                                                                separator={separator_aux}
                                                                            ></Card>
                                                                        )}     
                                                                    </div>
                                                                )
                                                            })     
                                                        )
                                                    })}

                                                    {(fila_operacao ?
                                                        <>
                                                            <div className={style.separator}>
                                                                <span>Operador</span>
                                                            </div>

                                                            {jobsCols?.sort((a, b) => a.id_module - b.id_module).map((job, indexSlide) => { // SORT PARA REORDENAR DE ACORDO COM O ID                                
                                                                return (
                                                                    job?.data.filter((elem) => elem.type_phase === 'Operação').map((col, i) => {
                                                                        let cards_length = 0;

                                                                        return(
                                                                            <div key={'col_operacao_'+i}>
                                                                                {col?.group?.length > 0 ? (                      
                                                                                    col.group?.map((group, i) => {
                                                                                        let cards = group.cards.map((card, i) => {
                                                                                                        return(
                                                                                                            <CardJobs
                                                                                                                key={'calendario_' + card?.id_job_status}
                                                                                                                i={i}
                                                                                                                indexSlide={indexSlide}
                                                                                                                card={card}
                                                                                                                group={group}
                                                                                                                jobsCols={jobsCols}
                                                                                                                jobs={jobs}
                                                                                                                job={col}         
                                                                                                                loja={filters?.loja}
                                                                                                                usuario={filters?.usuario}                                                 
                                                                                                                chamados={true}
                                                                                                                optionsModule={optionsModule}
                                                                                                                iconAvaliacao={optionsAvaliacao}
                                                                                                                tipoCalendario={filters?.tipoCalendario}
                                                                                                                subTipoCalendario={filters?.subTipoCalendario}
                                                                                                                troca_operador={troca_operador}
                                                                                                                reloadInternal={reloadInternal}
                                                                                                                refreshCard={handleRefreshCard}
                                                                                                                refreshCalendar={handleRefreshCalendar}
                                                                                                                changeStatus={handleChangeStatus}
                                                                                                                widget={widget}
                                                                                                                separator={separator_aux}
                                                                                                                expand={{
                                                                                                                    callback: handleExpandCallback
                                                                                                                }}
                                                                                                                callback={{
                                                                                                                    changeModule: handleCallbackModule
                                                                                                                }}
                                                                                                                collapse={handleSetCollapse}
                                                                                                            />
                                                                                                        )
                                                                                                    });

                                                                                        return(                          
                                                                                            <div key={'group_todos_fila_'+i}>
                                                                                                {(() => {
                                                                                                    if(group.title){
                                                                                                        if(group?.cards?.length > 0 || conf_operador_visivel != 0){
                                                                                                            cards_length++;
                                                                                                            return(
                                                                                                                <>
                                                                                                                    <Title
                                                                                                                        key={'chamados_operator_'+i}
                                                                                                                        icon={
                                                                                                                            <Tippy content={'Operador '+(group.online==1 ? 'online' : 'offline')}>
                                                                                                                                <span className="small text-secondary">
                                                                                                                                    {(group.online==1?'On':'Off')}
                                                                                                                                </span>
                                                                                                                            </Tippy>
                                                                                                                        }
                                                                                                                    >
                                                                                                                        {group.title}
                                                                                                                    </Title>
                                                                                                                    {cards}
                                                                                                                </>
                                                                                                            )
                                                                                                        }
                                                                                                    }else{
                                                                                                        return (
                                                                                                            <>
                                                                                                                {cards}                                                                                        
                                                                                                                        </>
                                                                                                        )
                                                                                                    }                                
                                                                                                })()}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                ) : (
                                                                                    <Card
                                                                                        empty={true}
                                                                                        title={'Nenhum chamado em fila'}
                                                                                        widget={widget}
                                                                                        separator={separator_aux}
                                                                                    ></Card>
                                                                                )}     
                                                                            </div>
                                                                        )
                                                                    })     
                                                                )
                                                            })}
                                                        </>
                                                    :'')}
                                                </SwiperSlide>
                                            :'')}

                                            {jobsCols?.sort((a, b) => a.id_module - b.id_module).map((job, indexSlide) => { // SORT PARA REORDENAR DE ACORDO COM O ID
                                                return (
                                                    <SwiperSlide key={'swiper_'+indexSlide} className={(job.type_phase === 'Início' ? style.swiper_separator : '')}>
                                                        {({ isVisible }) => (
                                                            (isVisible ?
                                                                <>
                                                                    <Title
                                                                        bold={true}
                                                                        icon={
                                                                            <>
                                                                                {(permission !== 'leitura' && indexSlide === 0 ? // SE ESTIVER NA PRIMEIRA COLUNA (FILA) E TIVER PERMISSÃO DIFERENTE DE "SOMENTE LEITURA"
                                                                                    <Editar
                                                                                        chamados={true}
                                                                                        empty={true}
                                                                                        disabled={(createNewAux ? false : true)}
                                                                                        reload={handleReload}
                                                                                    />
                                                                                :
                                                                                    <></>
                                                                                )}
                                                                            </>
                                                                        }
                                                                    >
                                                                        {job?.module}
                                                                    </Title>

                                                                    {job?.data.filter((elem) => elem.type_phase !== 'Pós-venda').map((col, i) => {
                                                                        let cards_length = 0;

                                                                        return(
                                                                            <div key={'col_'+i}>
                                                                                <div className={style.separator}>
                                                                                    <span>{col?.title}</span>
                                                                                </div>

                                                                                {col?.group?.length > 0 ? (                      
                                                                                    col.group?.map((group, i) => {
                                                                                        let cards = (group?.cards?.length>0 ? 
                                                                                                        group.cards.map((card, i) => {
                                                                                                            return(
                                                                                                                <CardJobs
                                                                                                                    key={'calendario_' + card?.id_job_status}
                                                                                                                    i={i}
                                                                                                                    indexSlide={indexSlide}
                                                                                                                    card={card}
                                                                                                                    group={group}
                                                                                                                    jobsCols={jobsCols}
                                                                                                                    jobs={jobs}
                                                                                                                    job={col}         
                                                                                                                    loja={filters?.loja}
                                                                                                                    usuario={filters?.usuario}                                                 
                                                                                                                    chamados={true}
                                                                                                                    optionsModule={optionsModule}
                                                                                                                    iconAvaliacao={optionsAvaliacao}
                                                                                                                    tipoCalendario={filters?.tipoCalendario}
                                                                                                                    subTipoCalendario={filters?.subTipoCalendario}
                                                                                                                    troca_operador={troca_operador}
                                                                                                                    reloadInternal={reloadInternal}
                                                                                                                    refreshCard={handleRefreshCard}
                                                                                                                    refreshCalendar={handleRefreshCalendar}
                                                                                                                    changeStatus={handleChangeStatus}
                                                                                                                    widget={widget}
                                                                                                                    separator={separator_aux}
                                                                                                                    expand={{
                                                                                                                        callback: handleExpandCallback
                                                                                                                    }}
                                                                                                                    callback={{
                                                                                                                        changeModule: handleCallbackModule
                                                                                                                    }}
                                                                                                                    collapse={handleSetCollapse}
                                                                                                                />
                                                                                                            )
                                                                                                        })
                                                                                                    : 
                                                                                                        (((!group.title || (group.title && conf_operador_visivel != 0)) && (!group.title && col.type_phase !== 'Operação')) ? // VERIFICA SE É FILA DE ALGUM OPERADOR
                                                                                                            <Card
                                                                                                                empty={true}
                                                                                                                title={(group.title?'Operador livre':'Nenhum chamado em fila')}  
                                                                                                                widget={widget}
                                                                                                                separator={separator_aux}
                                                                                                            ></Card>
                                                                                                        :'')
                                                                                                    );

                                                                                        return(                          
                                                                                            <div key={'group_'+i}>
                                                                                                {(() => {
                                                                                                    if(group.title || group.title === ''){
                                                                                                        if(group?.cards?.length > 0 || conf_operador_visivel != 0){
                                                                                                            cards_length++;
                                                                                                            return(
                                                                                                                <>
                                                                                                                    {(group.title ?
                                                                                                                        <Title
                                                                                                                            key={'chamados_operator_'+i}
                                                                                                                            icon={
                                                                                                                                <Tippy content={'Operador '+(group.online==1 ? 'online' : 'offline')}>
                                                                                                                                    <span className="small text-secondary">
                                                                                                                                        {(group.online==1?'On':'Off')}
                                                                                                                                    </span>
                                                                                                                                </Tippy>
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {group.title}
                                                                                                                        </Title>
                                                                                                                    :'')}
                                                                                                                    {cards}
                                                                                                                </>
                                                                                                            )
                                                                                                        }
                                                                                                    }                             
                                                                                                })()}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                ) : (
                                                                                    <Card
                                                                                        empty={true}
                                                                                        title={'Nenhum chamado em fila'}
                                                                                        widget={widget}
                                                                                        separator={separator_aux}
                                                                                    ></Card>
                                                                                )}     

                                                                                {/* VERIFICA SE NA FILA GERAL OU FILA DE OPERAÇÃO TEM ALGUM CARD EM ALGUM OPERADOR PARA PODER COLOCAR O AVISO DE NENHUM CHAMADO EM FILA */}
                                                                                {((col.type_phase === 'Início' || col.type_phase === 'Operação') && (cards_length === 0 && conf_operador_visivel == 0) && col.group.length > 0 ?
                                                                                    <Card
                                                                                        empty={true}
                                                                                        title={'Nenhum chamado em fila'}
                                                                                        widget={widget}
                                                                                        separator={separator_aux}
                                                                                    ></Card>
                                                                                :'')}              
                                                                            </div>
                                                                        )
                                                                    })}

                                                                    {job?.data.filter((elem) => elem.type_phase === 'Pós-venda').map((col, i) => {
                                                                        let avaliacao_aux = false;
                                                                        let cards_length = 0;
                                                                        
                                                                        col?.group.map((item, i) => {
                                                                            if(item.cards.length > 0){
                                                                                avaliacao_aux = true;
                                                                            }
                                                                        })

                                                                        return (
                                                                            <Fragment key={'col_avaliacao_'+i}>
                                                                                {(avaliacao_aux ? 
                                                                                    <>
                                                                                        <div className={style.separator}>
                                                                                            <span>Avaliação</span>
                                                                                        </div>

                                                                                        <div className={style.rate_txt}>
                                                                                            <p>
                                                                                                Sua <span>Avaliação</span> é muito importante para nós!<br />
                                                                                                {(window.rs_id_grupo == 2 && window?.location?.origin?.includes('madnezz') ? <>Por favor, abra os detalhes do card para avaliar.</>:<>Por favor, avalie clicando nos botões do card:</>)}
                                                                                            </p>

                                                                                            {(window.rs_id_grupo != 2 || !window?.location?.origin?.includes('madnezz') ?
                                                                                                <div className={style.rate_icons}>
                                                                                                    <span>
                                                                                                        <Icon type="check" animated /> Bom
                                                                                                    </span>

                                                                                                    <span>
                                                                                                        <Icon type="ban" animated /> Médio
                                                                                                    </span>

                                                                                                    <span>
                                                                                                        <Icon type="reprovar2" animated /> Ruim
                                                                                                    </span>
                                                                                                    
                                                                                                    <span>
                                                                                                        <Icon type="reabrir" animated /> Reabrir
                                                                                                    </span>
                                                                                                </div>
                                                                                                :<></>
                                                                                            )}
                                                                                        </div>

                                                                                        {job?.data?.filter((elem) => elem.type_phase === 'Pós-venda').map((job, i) => {
                                                                                            return (                
                                                                                                job.group?.map((group, i) => {
                                                                                                    return(
                                                                                                        group?.cards.map((card, i) => {
                                                                                                            return(
                                                                                                                <CardJobs
                                                                                                                    key={'calendario_' + card?.id_job_status}
                                                                                                                    i={i}
                                                                                                                    indexSlide={indexSlide}
                                                                                                                    card={card}
                                                                                                                    group={group}
                                                                                                                    jobs={job?.data}
                                                                                                                    job={job}         
                                                                                                                    loja={filters?.loja}
                                                                                                                    usuario={filters?.usuario}                                                 
                                                                                                                    chamados={true}
                                                                                                                    optionsModule={optionsModule}
                                                                                                                    iconAvaliacao={optionsAvaliacao}
                                                                                                                    tipoCalendario={filters?.tipoCalendario}
                                                                                                                    subTipoCalendario={filters?.subTipoCalendario}
                                                                                                                    troca_operador={troca_operador}
                                                                                                                    reloadInternal={reloadInternal}
                                                                                                                    refreshCard={handleRefreshCard}
                                                                                                                    refreshCalendar={handleRefreshCalendar}
                                                                                                                    changeStatus={handleChangeStatus}
                                                                                                                    widget={widget}
                                                                                                                    separator={separator_aux}
                                                                                                                    expand={{
                                                                                                                        callback: handleExpandCallback
                                                                                                                    }}
                                                                                                                    callback={{
                                                                                                                        changeModule: handleCallbackModule
                                                                                                                    }}
                                                                                                                    collapse={handleSetCollapse}
                                                                                                                />
                                                                                                            )
                                                                                                        }) 
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                        })}
                                                                                    </>
                                                                                :'')}

                                                                                {/* VERIFICA SE NA FILA DE OPERAÇÃO TEM ALGUM CARD EM ALGUM OPERADOR PARA PODER COLOCAR O AVISO DE NENHUM CHAMADO EM FILA */}
                                                                                {(col.type_phase === 'Operação' && (cards_length === 0 && conf_operador_visivel === 0) && col.group.length > 0 ?
                                                                                    <Card
                                                                                        empty={true}
                                                                                        title={'Nenhum chamado em fila'}
                                                                                        widget={widget}
                                                                                        separator={separator_aux}
                                                                                    ></Card>
                                                                                :'')}
                                                                            </Fragment>
                                                                        )
                                                                    })}
                                                                </>
                                                            :'')
                                                        )}
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </>
                                    )}
                                </>
                            :
                                <PageError
                                    title="Módulo não configurado"
                                />
                            )
                        )}
                    </Swiper>
                </DndContext>
            </Container>
        )
    }
}