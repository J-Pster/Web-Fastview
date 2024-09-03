import { useEffect, useState } from 'react';

/*SWIPER*/
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../../../../../../_assets/css/swiper.scss";

import style from '../style.module.scss';
import axios from 'axios';
import Item from './Item';
import { cd, get_date } from '../../../../../../_assets/js/global';

export default function Header({filters}){
    // ESTADOS
    const [swiper, setSwiper] = useState(null);
    const [loading, setLoading] = useState(false);
    const [infoStore, setInfoStore] = useState('');
    const [infoStore3Meses, setInfoStore3Meses] = useState('');
    const [infoSupervisor, setInfoSupervisor] = useState('');
    const [infoSupervisor3Meses, setInfoSupervisor3Meses] = useState('');

    // VERIFICA SE VAI FAZER REQUISIÇÃO DE CARGO OU DEPARTAMENTO DE ACORDO COM A EMPRESA
    let group_aux;
    if(window?.location?.origin?.includes('madnezz')){
        group_aux = 'departamento';
    }else{
        group_aux = 'cargo';
    }

    // GET STORE
    function get_store(date_start, date_end, type){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'sql_server',
                type: 'Job',
                do: 'getDashboard',
                filter_type: 'store',
                filter_date_start: date_start,
                filter_date_end: date_end,
                limit: 500
            }
        }).then((response) => {
            let qtd = 0;
            let qtd_pontos = 0;
            let qtd_pontos_total = 0;
            let qtd_feitos_no_prazo = 0;
            let qtd_feitos_com_atraso = 0;
            let qtd_atrasados = 0;
            let qtd_nao_feito = 0;

            if(response?.data?.data){   
                qtd = response?.data?.data.length;

                response?.data?.data.map((item, i) => {
                    qtd_pontos = qtd_pontos + parseInt(item?.pontos_atingidos);
                    qtd_pontos_total = qtd_pontos_total + parseInt(item?.pontos_total);
                    qtd_feitos_no_prazo = qtd_feitos_no_prazo + parseInt(item?.qtd_feito);
                    qtd_feitos_no_prazo = qtd_feitos_no_prazo + parseInt(item?.qtd_feito_com_ressalva);
                    qtd_feitos_no_prazo = qtd_feitos_no_prazo + parseInt(item?.qtd_feito_com_inconformidade);
                    qtd_feitos_com_atraso = qtd_feitos_com_atraso + parseInt(item?.qtd_feito_com_atraso);
                    qtd_atrasados = qtd_atrasados + parseInt(item?.qtd_atrasado);
                    qtd_nao_feito = qtd_nao_feito + parseInt(item?.qtd_nao_feito);
                })

                if(type === 1){
                    setInfoStore({
                        qtd: qtd,
                        qtd_pontos: qtd_pontos,
                        qtd_pontos_total: qtd_pontos_total,
                        qtd_feitos_no_prazo: qtd_feitos_no_prazo,
                        qtd_feitos_com_atraso: qtd_feitos_com_atraso,
                        qtd_atrasados: qtd_atrasados,
                        qtd_nao_feito: qtd_nao_feito
                    });
                }else if(type === 2){
                    setInfoStore3Meses({
                        qtd: qtd,
                        qtd_pontos: qtd_pontos,
                        qtd_pontos_total: qtd_pontos_total,
                        qtd_feitos_no_prazo: qtd_feitos_no_prazo,
                        qtd_feitos_com_atraso: qtd_feitos_com_atraso,
                        qtd_atrasados: qtd_atrasados,
                        qtd_nao_feito: qtd_nao_feito
                    });
                }
            }
        });
    }

    // GET STORE
    function get_supervisor(date_start, date_end, type){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'sql_server',
                type: 'Job',
                do: 'getDashboard',
                filter_type: 'job_responsible',
                filter_date_start: date_start,
                filter_date_end: date_end,
                limit: 500
            }
        }).then((response) => {
            let qtd = 0;
            let qtd_pontos = 0;
            let qtd_pontos_total = 0;
            let qtd_feitos_no_prazo = 0;
            let qtd_feitos_com_atraso = 0;
            let qtd_atrasados = 0;
            let qtd_nao_feito = 0;

            if(response?.data?.data){   
                qtd = response?.data?.data.length;

                response?.data?.data.map((item, i) => {
                    qtd_pontos = qtd_pontos + parseInt(item?.pontos_atingidos);
                    qtd_pontos_total = qtd_pontos_total + parseInt(item?.pontos_total);
                    qtd_feitos_no_prazo = qtd_feitos_no_prazo + parseInt(item?.qtd_feito);
                    qtd_feitos_no_prazo = qtd_feitos_no_prazo + parseInt(item?.qtd_feito_com_ressalva);
                    qtd_feitos_no_prazo = qtd_feitos_no_prazo + parseInt(item?.qtd_feito_com_inconformidade);
                    qtd_feitos_com_atraso = qtd_feitos_com_atraso + parseInt(item?.qtd_feito_com_atraso);
                    qtd_atrasados = qtd_atrasados + parseInt(item?.qtd_atrasado);
                    qtd_nao_feito = qtd_nao_feito + parseInt(item?.qtd_nao_feito);
                })

                if(type === 1){
                    setInfoSupervisor({
                        qtd: qtd,
                        qtd_pontos: qtd_pontos,
                        qtd_pontos_total: qtd_pontos_total,
                        qtd_feitos_no_prazo: qtd_feitos_no_prazo,
                        qtd_feitos_com_atraso: qtd_feitos_com_atraso,
                        qtd_atrasados: qtd_atrasados,
                        qtd_nao_feito: qtd_nao_feito
                    });
                }else if(type === 2){
                    setInfoSupervisor3Meses({
                        qtd: qtd,
                        qtd_pontos: qtd_pontos,
                        qtd_pontos_total: qtd_pontos_total,
                        qtd_feitos_no_prazo: qtd_feitos_no_prazo,
                        qtd_feitos_com_atraso: qtd_feitos_com_atraso,
                        qtd_atrasados: qtd_atrasados,
                        qtd_nao_feito: qtd_nao_feito
                    });
                }
            }
        });
    }

    // CHAMADA INICIAL
    useEffect(() => {
        // MÊS ATUAL
        get_store(
            window.currentDateWithoutHour.slice(0,8)+'01',
            window.currentDateWithoutHour,
            1
        );

        // ÚLTIMOS 3 MESES
        get_store(
            get_date('date_sql', cd(window.currentDateWithoutHour.slice(0,8)+'01 00:00:00'), 'date_sub_month', 2),
            window.currentDateWithoutHour,
            2
        );

        // MÊS ATUAL
        get_supervisor(
            window.currentDateWithoutHour.slice(0,8)+'01',
            window.currentDateWithoutHour,
            1
        );

        // ÚLTIMOS 3 MESES
        get_supervisor(
            get_date('date_sql', cd(window.currentDateWithoutHour.slice(0,8)+'01 00:00:00'), 'date_sub_month', 2),
            window.currentDateWithoutHour,
            2
        );
    },[]);

    return(
        (!
            loading ?
            <div className={style.header_container}>
                <div className={style.cards_container + ' ' + style.header}>
                    <Swiper
                        ref={swiper}
                        focusableElements="input, select, div, button, label, option, textarea"
                        preventClicks={false}
                        simulateTouch={false}
                        modules={[Navigation]}
                        autoHeight={true}
                        spaceBetween={24}
                        onSwiper={(swiper) => setSwiper(swiper)}
                        navigation={true}
                        allowTouchMove={true}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        watchSlidesProgress={true}
                        className={style.swiper_header}
                        breakpoints={{
                            650: {
                                slidesPerView: 2,
                            },
                            880: {
                                slidesPerView: 3,
                            },
                            1200: {
                                slidesPerView: 4,
                            },
                            1600: {
                                slidesPerView: 5,
                            },
                        }}
                    >
                        {(loading ?
                            [...Array(9)].map((item, i) => (
                                <SwiperSlide key={'loading_'+i}>
                                    <div className={style.card + ' ' + style.large + ' ' + style.loading}></div>
                                </SwiperSlide>
                            ))
                        :   
                            <>                           
                                <SwiperSlide>
                                    <Item
                                        title={'Supervisores'}
                                        type={'Supervisores'}
                                        id="supervisor"
                                        points={{
                                            rechead: infoSupervisor?.qtd_pontos,
                                            total: infoSupervisor?.qtd_pontos_total
                                        }}
                                        qtd={infoSupervisor?.qtd}
                                        info={[
                                            ['Feitos no prazo', infoSupervisor?.qtd_feitos_no_prazo],
                                            ['Feitos com atraso', infoSupervisor?.qtd_feitos_com_atraso],
                                            ['Atrasados', infoSupervisor?.qtd_atrasados],
                                            ['Não Feitos', infoSupervisor?.qtd_nao_feito]
                                        ]}
                                    />
                                </SwiperSlide>

                                <SwiperSlide>
                                    <Item
                                        title={'Superv. 3 Meses'}
                                        type={'Supervisores'}
                                        id="supervisor_meses"
                                        points={{
                                            rechead: infoSupervisor3Meses?.qtd_pontos,
                                            total:  infoSupervisor3Meses?.qtd_pontos_total
                                        }}
                                        qtd={infoSupervisor3Meses?.qtd}
                                        info={[
                                            ['Feitos no prazo', infoSupervisor3Meses?.qtd_feitos_no_prazo],
                                            ['Feitos com atraso', infoSupervisor3Meses?.qtd_feitos_com_atraso],
                                            ['Atrasados', infoSupervisor3Meses?.qtd_atrasados],
                                            ['Não Feitos', infoSupervisor3Meses?.qtd_nao_feito]
                                        ]}
                                    />
                                </SwiperSlide>

                                <SwiperSlide>
                                    <Item
                                        title={'Lojas'}
                                        type={'Lojas'}
                                        id="loja"
                                        points={{
                                            rechead: infoStore?.qtd_pontos,
                                            total: infoStore?.qtd_pontos_total,
                                        }}
                                        qtd={infoStore?.qtd}
                                        info={[
                                            ['Feitos no prazo', infoStore?.qtd_feitos_no_prazo],
                                            ['Feitos com atraso', infoStore?.qtd_feitos_com_atraso],
                                            ['Atrasados', infoStore?.qtd_atrasados],
                                            ['Não Feitos', infoStore?.qtd_nao_feito]
                                        ]}
                                    />
                                </SwiperSlide>

                                <SwiperSlide>
                                    <Item
                                        title={'Lojas 3 Meses'}
                                        type={'Lojas'}
                                        id="lojas_meses"
                                        points={{
                                            rechead: infoStore3Meses?.qtd_pontos,
                                            total: infoStore3Meses?.qtd_pontos_total,
                                        }}
                                        qtd={infoStore3Meses?.qtd}
                                        info={[
                                            ['Feitos no prazo', infoStore3Meses?.qtd_feitos_no_prazo],
                                            ['Feitos com atraso', infoStore3Meses?.qtd_feitos_com_atraso],
                                            ['Atrasados', infoStore3Meses?.qtd_atrasados],
                                            ['Não Feitos', infoStore3Meses?.qtd_nao_feito]
                                        ]}
                                    />
                                </SwiperSlide>

                                <SwiperSlide>
                                    <Item
                                        title={'Lojas 3 Meses'}
                                        type={'Lojas'}
                                        id="lojas_meses"
                                        points={{
                                            rechead: infoStore3Meses?.qtd_pontos,
                                            total: infoStore3Meses?.qtd_pontos_total,
                                        }}
                                        qtd={infoStore3Meses?.qtd}
                                        info={[
                                            ['Feitos no prazo', infoStore3Meses?.qtd_feitos_no_prazo],
                                            ['Feitos com atraso', infoStore3Meses?.qtd_feitos_com_atraso],
                                            ['Atrasados', infoStore3Meses?.qtd_atrasados],
                                            ['Não Feitos', infoStore3Meses?.qtd_nao_feito]
                                        ]}
                                    />
                                </SwiperSlide>
                            </>
                        )}
                    </Swiper>
                </div>
            </div>
        :'')
    )
}
