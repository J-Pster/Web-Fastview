import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../../../context/Global";

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
import axios from "axios";
import Container from "../../../../components/body/container";


export default function Fases({jobs, widget, optionsModule, filters, reloadInternal, refreshCard, changeStatus, expand, refresh, refreshCalendar}){
    // CONTEXT GLOBAL
    const { loadingCards, filterModule, cardExternal, prevIndex, handleSetPrevIndex } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { filterEmpreendimento } = useContext(JobsContext);

    // ESTADOS
    const [swiper, setSwiper] = useState();
    const [executando, setExecutando] = useState('');

    const handleRefreshCard = (e) => {
        refreshCard(e);
    }

    // CALLBACK DE CARD EM EXECUÇÃO
    const handleCallbackExecution = (e) => {
        setExecutando(e);
    }

    const handleRefreshCalendar = (e) => {
        refreshCalendar(e);
    }
 
    const handleChangeStatus = (e) => {
        changeStatus(e);
    }

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
                navigation={(widget || cardExternal.enabled ? false : true)}
                className={'calendar ' + (widget ? 'widget' : '')}
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
                        jobs?.map((job, indexSlide) => {
                            return (
                                <SwiperSlide key={'swiper_'+indexSlide}>
                                {({ isVisible }) => (
                                    (isVisible ?
                                        <>
                                            <Title
                                                icon={
                                                <>
                                                    {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && indexSlide == 0 ? // SE PERMISSÃO FOR MAIS QUE 2
                                                        <Editar
                                                            fases={true}
                                                            empty={true}
                                                            date={job?.date}
                                                            id_emp={(job.id_emp?job.id_emp:'')}
                                                            frequency={{
                                                                id: job?.id_frequency
                                                            }}
                                                            reload={handleReload}
                                                            refreshCalendar={handleRefreshCalendar}
                                                        />
                                                    :
                                                        <></>
                                                    )}
                                                </>
                                                }
                                                active={job.active ? true : false}
                                            >
                                                {job.title}
                                            </Title>

                                            {job.group.length>0 ? (                      
                                                job.group?.map((group, i) => {
                                                    return(                          
                                                        <div key={'group_'+i}>
                                                            {(group?.cards?.length>0 ?
                                                                group.cards.map((card, i) => {
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
                                                                                execution={executando}  
                                                                                loja={filters?.loja}
                                                                                usuario={filters?.usuario}                
                                                                                fases={true}
                                                                                optionsModule={optionsModule}
                                                                                tipoCalendario={filters?.tipoCalendario}
                                                                                subTipoCalendario={filters?.subTipoCalendario}
                                                                                reload={handleReload}
                                                                                reloadInternal={reloadInternal}
                                                                                refreshCard={handleRefreshCard}
                                                                                refreshCalendar={handleRefreshCalendar}
                                                                                changeStatus={handleChangeStatus}
                                                                                widget={widget}
                                                                                expand={{
                                                                                    callback: handleExpandCallback,
                                                                                    execution: handleCallbackExecution
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
                                                                })
                                                            : 
                                                                <Card
                                                                    empty={true}
                                                                    widget={widget}
                                                                ></Card>
                                                            )} 
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                            <Card
                                                empty={true}
                                                widget={widget}
                                            ></Card>
                                            )}                    
                                        </>
                                    :'')
                                )}
                                </SwiperSlide>
                            );
                        })
                    :<></>)
                )}
            </Swiper>
        </Container>
    )
}