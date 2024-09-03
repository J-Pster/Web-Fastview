import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../../../context/Global";
import { useParams } from "react-router-dom";

/*SWIPER*/
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../../../../_assets/css/swiper.scss";

import Title from "../../../../components/body/title";
import Editar from "../../../../components/body/card/editar";
import CardJobs from "../Card";
import Card from "../../../../components/body/card";
import { JobsContext } from "../../../../context/Jobs";
import style from '../card.module.scss';
import PageError from "../../../../components/body/pageError";
import Button from "../../../../components/body/button";
import Icon from "../../../../components/body/icon";
import Group from "./Group";
import Container from "../../../../components/body/container";

export default function Jobs({jobs, widget, optionsModule, filters, changeLayout, reloadInternal, refreshCard, changeStatus, reachBeginning, reachEnd, transitionEnd, expand, refresh, actionButton, refreshCalendar}){
    // PARAMS
    const params = useParams();
    if(window.rs_id_emp == 26){
        jobs = jobs?.filter((elem) => elem.title != 'Único');
    }

    // CONTEXT GLOBAL
    const { loadingCards, cardExternal, prevIndex, handleSetPrevIndex } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { autoSwiper, handleSetAutoSwiper } = useContext(JobsContext);

    // ESTADOS
    const [swiper, setSwiper] = useState();

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

    const handleReachBeginning = () => {
        reachBeginning();
    }

    const handleReachEnd = () => {
        reachEnd();
    }

    function handleTransitionEnd(swiper){
        if(filters?.tipoCalendario==1){ // SE FOR TIPO CALENDÁRIO (1)
            if(swiper.isEnd || swiper.isBeginning){
                transitionEnd();
            }
        }else if(filters?.tipoCalendario==2 || filters?.tipoCalendario==4){ // SE FOR TIPO LOJA (2) OU USUÁRIO (4)
            if(swiper.isEnd){
                transitionEnd();
            }
        }
    }

    // CALLBACK AO CLICAR EM EXPANDIR O CARD
    const handleExpandCallback = (e) => {
        expand?.callback();

        setTimeout(() => {
            let scrollElement = document.getElementById('card_'+e?.callback?.id);

            if(scrollElement){
                swiper.slideTo(e?.callback?.index);

                if(prevIndex){
                    swiper.slideTo(prevIndex);
                    handleSetPrevIndex(''); 
                }

                window.scrollTo({
                    top: scrollElement?.offsetTop + 42,
                    behavior: 'smooth'
                });
            }
        },100);
    }

    // CALLBACK DO CADASTRO PARA RECARREGAR A CONSULTA
    const handleReload = () => {
        if(refresh){
            refresh();
        }
    }

    // ACTION BUTTON
    const handleActionButton = () => {
        actionButton(true);
    }

    if(filters?.status.length == 1 && filters?.status.includes('-2') && jobs.length === 0 && loadingCards === false){
        return(
            <Container>
                <PageError
                    icon="happiest"
                    title="Muito bem!"
                    text={`Você está cumprindo todas suas tarefas no prazo\ne não possui nenhuma em atraso.`}
                    button={
                        <Button onClick={handleActionButton}>
                            Ir para Jobs do dia <Icon type="external" />
                        </Button>
                    }
                />
            </Container>
        )
    }else{
        // SE JÁ TIVER TERMINADO O CARREGAMENTO E NÃO TIVER NENHUM CARD PRA EXIBIR
        if(!loadingCards && jobs.length == 0){
            return (
                <Container>
                    <PageError
                        title="Nenhum resultado"
                        text={'Nada a exibir por aqui. Tente realizar uma nova busca, \n ou tente novamente mais tarde'}
                        button={false}
                    />
                </Container>
            )
        }else{
            return(
                <Container>
                    <Swiper
                        ref={swiper}
                        focusableElements="input, select, div, button, label, option, textarea"
                        preventClicks={false}
                        simulateTouch={false}
                        modules={[Navigation]}
                        autoHeight={false}
                        spaceBetween={24}
                        onSwiper={(swiper) => setSwiper(swiper)}
                        onReachBeginning={() => handleReachBeginning()}
                        onReachEnd={() => handleReachEnd()}
                        onSlideChangeTransitionEnd={(swiper) => handleTransitionEnd(swiper)}
                        navigation={(widget || cardExternal.enabled ? false : true)}
                        className={changeLayout ? "panel" : "" + ' calendar' + ' ' + (widget ? 'widget' : '')}
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
                                        widget={widget}
                                    ></Card>
                                </SwiperSlide>
                            ))
                        :
                            (jobs.length > 0 ?
                                <>
                                    {jobs?.map((job, indexSlide) => {
                                        //SETA SLIDE INICIAL
                                        {(() => {
                                            setTimeout(() => {
                                                if (filters?.tipoCalendario == 1) {
                                                    if (autoSwiper && !params['periodEnd']) {
                                                        if ((window.isMobile && job.active) || (!window.isMobile && job.monday)) {
                                                            if (swiper) {
                                                                swiper.slideTo(indexSlide);
                                                                setTimeout(() => {
                                                                    handleSetAutoSwiper(false);
                                                                }, 500);
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (autoSwiper && !params['periodEnd']) {
                                                        if (job.active) {
                                                            if (swiper) {
                                                                swiper.slideTo(indexSlide);
                                                                setTimeout(() => {
                                                                    handleSetAutoSwiper(false);
                                                                    swiper.update();
                                                                }, 500);
                                                            }
                                                        }
                                                    }
                                                }
                                            }, 200);
                                        })();}

                                        let logo = false;
                                        if((filters?.tipoCalendario == 2 || filters?.tipoCalendario == 4 || filters?.tipoCalendario == 8 ) && window.rs_id_grupo > 0){ // TIPO LOJA (2) OU TIPO USUÁRIO (4) OU PLANO DE AÇÃO (8)
                                            logo = true;
                                        }

                                        return (
                                            <SwiperSlide key={'swiper_'+indexSlide}>
                                                {({ isVisible }) => (
                                                    (isVisible ?
                                                        <>
                                                            {!changeLayout ?
                                                                <Title
                                                                    icon={
                                                                    <>
                                                                        {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') ? // SE PERMISSÃO FOR MAIS QUE 2
                                                                            (job?.date ? // SE O JOB POSSUI DATA
                                                                                (job.date >= window.currentDateWithoutHour?
                                                                                    <Editar
                                                                                        empty={true}
                                                                                        dateStart={job?.date}
                                                                                        frequency={{
                                                                                            id: job?.id_frequency
                                                                                        }}
                                                                                        reload={handleReload}
                                                                                        model={filters?.modelo}
                                                                                    />
                                                                                :
                                                                                    ''
                                                                                )
                                                                            : 
                                                                                <Editar
                                                                                    empty={true}
                                                                                    frequency={{
                                                                                        id: job?.id_frequency
                                                                                    }}
                                                                                    id_lja={(job.id_loja?job.id_loja:'')}
                                                                                    id_emp={(job.id_emp?job.id_emp:'')}
                                                                                    id_usr={(job.id_usuario?job.id_usuario:'')}
                                                                                    reload={handleReload}
                                                                                    modalTitle={(filters?.modelo ? 'Novo Modelo' : '')}
                                                                                    model={filters?.modelo}
                                                                                />
                                                                            )
                                                                        : ''
                                                                        )}
                                                                    </>
                                                                    }
                                                                    active={job.active ? true : false}
                                                                >
                                                                    {(logo && job?.logo_emp && window.rs_id_grupo > 0 ? 
                                                                        <img src={window.upload+'/'+job?.logo_emp} className={style.logo} />
                                                                    :
                                                                        <></>
                                                                    )}
                                                                    
                                                                    {(job?.logo_emp && job?.id_filial && window.rs_id_grupo > 0 ?
                                                                        'Filial '+job?.id_filial
                                                                    :
                                                                        job?.title
                                                                    )}                                                    
                                                                </Title>
                                                            : 
                                                                ''
                                                            }

                                                            {(job.group.length>0 ?                       
                                                                job.group?.map((group, i) => {
                                                                    return(
                                                                        <Group
                                                                            key={'group_'+i}
                                                                            indexSlide={indexSlide}
                                                                            jobs={jobs}
                                                                            job={job}
                                                                            group={group}
                                                                            widget={widget}
                                                                            optionsModule={optionsModule}
                                                                            filters={filters}
                                                                            changeLayout={changeLayout}
                                                                            reachBeginning={reachBeginning}
                                                                            reachEnd={reachEnd}
                                                                            transitionEnd={transitionEnd}
                                                                            expand={expand}
                                                                            reload={handleReload}
                                                                            actionButton={actionButton}
                                                                            reloadInternal={handleReloadInternal}
                                                                            refreshCard={handleRefreshCard}
                                                                            changeStatus={handleChangeStatus}
                                                                            expandCallback={handleExpandCallback}
                                                                            swiper={swiper}
                                                                        />
                                                                    )
                                                                })
                                                            : 
                                                                <></>
                                                            )}
                                                        </>
                                                    :
                                                        ''
                                                    )
                                                )}
                                            </SwiperSlide>
                                        )
                                    })}

                                    {(cardExternal.enabled ? 
                                        [...Array(5)].map((card, i) => (
                                            <SwiperSlide key={'empty_'+i}>
                                                {/* SLIDES NECESSÁRIOS PARA QUANDO CLICAR EM MAXIMIZAR O CARD TER SLIDES EXTRAS PARA PODER FAZER O SCROLL PARA A ESQUERDA */}
                                            </SwiperSlide>
                                        ))
                                    :'')}
                                </>
                            :
                                <></>
                            )
                        )}
                    </Swiper>
                </Container>
            )
        }
    }
}