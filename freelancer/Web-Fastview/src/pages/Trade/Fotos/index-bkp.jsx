import { useState, useContext } from "react";
import { cd, cdh, get_date } from "../../../_assets/js/global";

import Title from "../../../components/body/title";
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../_assets/css/swiper.scss';
import '../../Supervisao/css/supervisao.scss';
import Foto from "../../../components/body/foto";
import Row from "../../../components/body/row";
import Col from "../../../components/body/col";
import Filter from "../Filter";
import { useEffect } from "react";
import axios from "axios";
import Historico from "../Historico";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Fotos(){
    // ESTADOS
    const [grupos, setGrupos] = useState([]);
    const [fotos, setFotos] = useState([]);
    const [focus, setFocus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    // SWIPER
    const swiperSlide = useSwiperSlide();

    // GET DE IMAGENS
    function get_images(loading){
        if(loading){
            setLoading(true);
            setHasMore(true);
            setPage(0);
            setGrupos([]);
        }

        axios({
            method: 'get',
            url: window.host+'/systems/trade/api/trade.php?do=get_list',
            params: {
                data_inicio: '',
                data_fim: '',
                di_i: '',
                df_f: '',
                tipo: 'loja',
                filtro_data_inicio: '01/04/2023',
                filtro_data_fim: '30/04/2023',
                page: page,
                limit: 50
            }
        }).then((response) => {
            if(response.data.length > 0){                              
                let grupo = '';
                response.data.map((result) => {
                    if(result.grupo_id != grupo){
                        grupo = result.grupo_id;
                        setGrupos(grupos => [...grupos, result]);
                    }
                })
            }    
            setFotos(response.data);
            setLoading(false);

            setPage(page+1);

            if(response.data.length == 0 || response.data.length < 50){                
                setHasMore(false);                
            }
        });
    }

    useEffect(() => {
        get_images(true);
    },[]);

    // VARIÁVEIS
    var grupo = '';

    return(
        <div className="content supervisao">
            {/* FILTROS TESTEIRA */}
            <Filter actions={true} />

            {/* FOTOS */}            
            <InfiniteScroll
                dataLength={50 * page}
                hasMore={hasMore}
                next={() => get_images(false)}
                scrollableTarget={window}
            >
                {(!loading ? 
                    (grupos.length > 0 ?
                        grupos.map((grupo, i) => {
                            return(     
                                <div key={'grupo_'+grupo.trade_id} style={{zIndex:(fotos.length - i)}} className={(i % 2 === 0 ? '' : 'bg__light') + ' pb-4 ' + (i==0 ? '' : 'pt-4')}> 
                                    <Col>
                                        <Title><span className="me-2 pt-0 pe-0 font-weight-400">{grupo.filial}  -</span> {grupo.grupo}</Title>
                                        <div onMouseEnter={() => setFocus(true)} onMouseLeave={() => setFocus(false)}>
                                            <Swiper
                                                className="swiper_supervisao"
                                                modules={[Navigation]}
                                                autoHeight={false}
                                                slidesPerView={(window.isMobile ? 1 : 'auto')}
                                                spaceBetween={15}     
                                                navigation
                                                pagination={{ clickable: true }} 
                                                loop={false}
                                                allowTouchMove={true}
                                                speed={700}
                                                observeParents={true}
                                                observer={true}
                                                watchSlidesProgress={true}
                                                breakpoints={{
                                                    500: {
                                                        allowTouchMove:false,
                                                        slidesPerGroupAuto:true
                                                    }
                                                }}
                                            >   
                                                {fotos.map((loja, i) => {
                                                    return(
                                                        (loja.grupo_id == grupo.grupo_id ?
                                                            <SwiperSlide key={'grupo_filial_'+loja.codigofilial+'_'+loja.trade_id}>
                                                                <Foto
                                                                    left={[loja.imgmodelo]}
                                                                    right={[]}
                                                                    edit={false}
                                                                    multiple={true}
                                                                    chat={
                                                                        <Historico
                                                                            id={grupo.trade_id}
                                                                            contrato={grupo.numerocontrato}
                                                                            loja={grupo.filial}
                                                                            grupo={grupo.grupo}
                                                                            data={grupo.data_contrato}
                                                                        />
                                                                    }
                                                                    delete={true}
                                                                    camera={true}
                                                                    description={
                                                                        <>
                                                                            <p className="mb-0">
                                                                                {(grupo.numerocontrato ? 'Contrato: '+grupo.numerocontrato : '')}
                                                                            </p>
                                                                            <p className="mb-0">
                                                                                {(grupo.data_contrato ? 'Data: '+grupo.data_contrato : '')}
                                                                            </p>
                                                                        </>
                                                                    }
                                                                    // camera={(window.rs_permission_apl > 1 ? false : true)} // BOTÃO DE CÂMERA SÓ APARECE PARA NÍVEL DE ACESSO LOJISTA
                                                                    // rate={{
                                                                    //     lojista: (imgTirada && window.rs_permission_apl == 1 ? true : false), // BOTÃO DE APROVAR/REPROVAR FOTO TIRADA APARECE SOMENTE PARA NÍVEL DE ACESSO LOJISTA
                                                                    //     adm: (item.resposta && window.rs_permission_apl > 1 ? true : false) // BOTÃO DE APROVAR/REPROVAR AVALIAÇÃO DA FOTO TIRADA APARECE SÓ SE TIVER RESPOSTA E O NÍVEL DE ACESSO FOR MAIOR QUE LOJISTA
                                                                    // }}                                                                    
                                                                    // aproved={{
                                                                    //     lojista: (item.resposta == 1 ? true : false),
                                                                    //     adm: (item.double_check == 1 && window.rs_permission_apl > 1  ? true : false)
                                                                    // }}
                                                                    // reproved={{
                                                                    //     lojista: (item.resposta == 2 ? true : false),
                                                                    //     adm: (item.double_check == 2 && window.rs_permission_apl > 1  ? true : false)
                                                                    // }}
                                                                    // date={(item.data ? cdh(item.data) : '')}
                                                                    // avaliation={item?.resposta_motivo}
                                                                    // params={{
                                                                    //     pergunta_id: item?.pergunta_id,
                                                                    //     checklist_id: item?.checklist_id,
                                                                    //     loja_id: item?.loja_id,
                                                                    //     resposta_id: item?.resposta_id
                                                                    // }}
                                                                    // callback={() => get_images(false)}
                                                                />
                                                            </SwiperSlide>
                                                        :'')
                                                    )
                                                })}
                                            </Swiper>                            
                                        </div>
                                    </Col>
                                </div>
                            )
                        })
                    :'')
                :            
                    [...Array(3)].map((row, iRow) => (
                        <div key={'loader_lojas_'+iRow} style={{zIndex: -1}}>
                            <Col>
                                <Title loader={true} />

                                <Swiper
                                    className="swiper_supervisao"                                
                                    style={{zIndex:9}}                
                                    modules={[Navigation]}
                                    autoHeight={false}
                                    slidesPerView={(window.isMobile ? 1 : 'auto')}
                                    spaceBetween={15}     
                                    navigation
                                    pagination={{ clickable: true }} 
                                    loop={false}
                                    allowTouchMove={true}
                                    speed={700}
                                    observeParents={true}
                                    observer={true}
                                    watchSlidesProgress={true}
                                    breakpoints={{
                                        500: {
                                            allowTouchMove:false,
                                            slidesPerGroupAuto:true
                                        }
                                    }}
                                >
                                    {[...Array(4)].map((foto, iSlide) => (
                                        <SwiperSlide key={'loader_fotos_'+iRow+'_'+iSlide}>
                                            <Foto loader={true} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Col>
                        </div>
                    ))
                )}   
            </InfiniteScroll>         
        </div>
    );
}
