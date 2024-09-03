import { useState, useContext } from "react";
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
import style from '../card.module.scss';
import { JobsContext } from "../../../../context/Jobs";
import Icon from "../../../../components/body/icon";

export default function Visitas({jobs, widget, optionsModule, filters, reloadInternal, refreshCard, changeStatus, loaded, usuario, loja, expand, refresh, refreshCalendar}){
    // CONTEXT GLOBAL
    const { loadingCards, cardExternal, prevIndex, handleSetPrevIndex } = useContext(GlobalContext);

    // CONTEXT JOBS
    const { optionsLoja } = useContext(JobsContext);

    // ESTADOS
    const [swiper, setSwiper] = useState();
    const [pdvDataSort, setPdvDataSort] = useState(1);
    const [pdvLocalizacaoSort, setPdvLocalizacaoSort] = useState(1);
    const [pdvAgendamentoSort, setPdvAgendamentoSort] = useState(1);

    const handleRefreshCard = (e) => {
        refreshCard(e);
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
                    <>
                        {jobs?.map((job, indexSlide) => {
                            return (
                                <SwiperSlide key={'swiper_'+indexSlide}>
                                    {({ isVisible }) => (
                                        (isVisible ?
                                            <>                                                
                                                <Title 
                                                    icon={
                                                    <>                                                    
                                                        {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && indexSlide==0? // SE ESTIVER NA PRIMEIRA COLUNA (FILA)
                                                            <Editar
                                                                visitas={true}
                                                                empty={true}
                                                                date={job?.date}
                                                                id_emp={(job.id_emp?job.id_emp:'')}
                                                                id_usr={(filters?.subTipoCalendario === 'user' ? usuario : undefined)}
                                                                id_lja={(filters?.subTipoCalendario === 'store' ? loja : undefined)}
                                                                tipo={(filters?.subTipoCalendario === 'store' ? 'loja' : 'usuario')}
                                                                frequency={{
                                                                    id: job?.id_frequency
                                                                }}
                                                                subTipoCalendario={filters?.subTipoCalendario}
                                                                reload={handleReload}
                                                                refreshCalendar={handleRefreshCalendar}
                                                            />
                                                        :
                                                            <></>
                                                        )}

                                                        <>
                                                            {(job.type_phase == 'PDV Data' ?
                                                            <Icon
                                                                type={pdvDataSort==1?'sort-desc2':'sort-asc2'}
                                                                onClick={() => setPdvDataSort((pdvDataSort==1?2:1))}
                                                            />
                                                            :'')}

                                                            {/* {(indexSlide == 1 ? // SE FOR A SEGUNDA COLUNA
                                                            <Icon
                                                                type={pdvLocalizacaoSort==1?'sort-desc2':'sort-asc2'}
                                                                onClick={() => setPdvLocalizacaoSort((pdvLocalizacaoSort==1?2:1))}
                                                            />
                                                            :'')} */}

                                                            {(job.type_phase == 'PDV Agendamento' ?
                                                            <Icon
                                                                type={pdvAgendamentoSort==1?'sort-desc2':'sort-asc2'}
                                                                onClick={() => setPdvAgendamentoSort((pdvAgendamentoSort==1?2:1))}
                                                            />
                                                            :'')}
                                                        </>
                                                    </>
                                                    }
                                                    active={job.active ? true : false}
                                                >
                                                    {job.title}
                                                </Title>

                                                {(job.group.length > 0 ?                       
                                                    job.group?.map((group, i) => { // MAP NA LISTA DE OPERADORES OU GRUPOS DE FASES
                                                        return(                          
                                                            <div key={'group_'+i}>
                                                                {(group?.cards?.length>0 ? 
                                                                    (group.cards.map((card, i) => {
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
                                                                            visitas={true}
                                                                            optionsModule={optionsModule}
                                                                            tipoCalendario={filters?.tipoCalendario}
                                                                            subTipoCalendario={filters?.subTipoCalendario}
                                                                            reloadInternal={reloadInternal}
                                                                            refreshCard={handleRefreshCard}
                                                                            refreshCalendar={handleRefreshCalendar}
                                                                            changeStatus={handleChangeStatus}
                                                                            widget={widget}
                                                                            expand={{
                                                                                callback: handleExpandCallback
                                                                            }}
                                                                            // autoFinish={autoFinishId}
                                                                            // callbackAutoFinish={handleCallbackAutoFinish}
                                                                        />
                                                                        )
                                                                    }).sort((a, b) => {
                                                                        if(job.type_phase == 'PDV Data'){
                                                                            return (pdvDataSort == 1 ? 1 : -1);
                                                                        }else if(job.type_phase == 'PDV Localização'){
                                                                            if (a.props.distance < b.props.distance) {
                                                                                return (pdvLocalizacaoSort == 1 ? -1 : 1);
                                                                            }
                                                                        if (a.props.distance > b.props.distance) {
                                                                            return (pdvLocalizacaoSort == 1 ? 1 : -1);
                                                                        }
                                                                        return 0;
                                                                            }else if(job.type_phase == 'PDV Agendamento'){
                                                                                return (pdvAgendamentoSort == 1 ? 1 : -1);
                                                                            }else{
                                                                                return '';
                                                                        }
                                                                    }))
                                                                : 
                                                                    <Card
                                                                        empty={true}
                                                                        widget={widget}
                                                                    ></Card>
                                                                )}
                                                            </div>
                                                        )
                                                    })
                                                :
                                                    <Card
                                                        empty={true}
                                                        widget={widget}
                                                    ></Card>
                                                )}                    
                                            </>
                                        :'')
                                    )}
                                </SwiperSlide>
                            )
                        })}

                        {(loaded ? // COLUNA DE CARDS "AVULSOS"
                            <SwiperSlide>
                                <Title>Visitas Avulsas</Title>

                                <div className={style.avulsos}>
                                {(optionsLoja.length > 0 ?
                                    optionsLoja.map((loja, i) => {
                                    return(
                                        <Editar
                                            key={'avulso_'+loja.id}
                                            modalTitle="Nova Visita Avulsa"
                                            avulso={true}
                                            empty={true}
                                            cardTitle={loja?.nome}
                                            id_usr={(filters?.subTipoCalendario === 'store' ? '' : usuario)}
                                            id_lja={(filters?.subTipoCalendario === 'store' ? loja.id : '')}
                                            job={loja?.nome}
                                            frequency={{
                                                id: 4
                                            }}
                                            // frequency_aux={2}
                                            tipo={(filters?.subTipoCalendario === 'store' ? 'loja' : 'usuario')}
                                            subTipoCalendario={filters?.subTipoCalendario}
                                            dateStart={window.currentDate}
                                            id_system={{
                                                id: [{id: '223'}, {id: '226'}]
                                            }}
                                            id_job_system={1}
                                            id_job_system_type={6149}
                                            id_job_system_type1={loja.id}
                                            // autoFinish={handleAutoFinish}                                
                                            category={2548}
                                            subcategory={4526}
                                            reload={handleReload}
                                            refreshCalendar={handleRefreshCalendar}
                                        />
                                    )
                                    })
                                :
                                    <></>
                                )}
                                </div>
                            </SwiperSlide>
                        :'')}
                    </>
                :<></>)
            )}
        </Swiper>
    )
}