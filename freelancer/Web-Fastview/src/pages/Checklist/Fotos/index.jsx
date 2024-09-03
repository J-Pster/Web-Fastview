import { useState, useContext } from "react";
import { ChecklistContext } from "../../../context/Checklist";
import { cd } from "../../../_assets/js/global";

import Title from "../../../components/body/title";
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../_assets/css/swiper.scss';
import '../css/supervisao.scss';
import Foto from "../../../components/body/foto";
import Row from "../../../components/body/row";
import Col from "../../../components/body/col";
import Filter from "../Filter";
import { useEffect } from "react";
import axios from "axios";
import PageError from "../../../components/body/pageError";
import Button from "../../../components/body/button";
import { toast } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import Container from "../../../components/body/container";

export default function Fotos({icons, filters}){
    // CONTEXT
    const {editView, filterEmpreendimento, filterLoja, filterStatus, filterStatusSupervisor, filterSupervisao, filterDate, pageError} = useContext(ChecklistContext);

    // ESTADOS
    const [supervisao, setSupervisao] = useState([]);
    const [focus, setFocus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [finish, setFinish] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    // GET DE IMAGENS
    function get_images(refresh, reload){
        // DEFINE A PAGE
        let page_aux;
        if(refresh || reload){
            page_aux = 0;
        }else{
            page_aux = page;
        }

        // DEFINE LIMIT
        let limit_aux;
        if(reload){
            limit_aux = (page >= 2 ? (page * limit) : limit)
        }else{
            limit_aux = limit
        }

        axios({
            method: 'get',
            url: window.host+'/systems/'+global.sistema_url.checklist+'/api/lista.php?do=get_list',
            params: {
                page: page_aux,
                limit: limit_aux,
                filter_type: 1,
                filter_subtype: 'store',
                filter_checklist_id: [filterSupervisao],
                filter_store_id: filterLoja,
                filter_status: filterStatus,
                filter_status_supervisor: filterStatusSupervisor,
                empreendimento_id: filterEmpreendimento,
                filter_date_start: cd(filterDate),
                filter_date_end: cd(filterDate)                
            }
        }).then((response) => {
            if(refresh || reload){
                setSupervisao(response.data);
                if(!reload){
                    setPage(1);
                }
            }else{
                setSupervisao(supervisao => [...supervisao, ...response.data]);
                if(!reload){
                    setPage(page+1);
                }
            }

            if(response.data.length == 0 || response.data.length < limit){
                setHasMore(false);                
            }
            setLoading(false);
        });
    }

    // CARREGA IMAGENS NOVAMENTE SE ALTERAR ALGUM FILTRO
    useEffect(() => {
        setPage(0);
        
        if(filterSupervisao){
            setLoading(true);
            setHasMore(true);
            get_images(true);
        }
    },[filterEmpreendimento, filterLoja, filterStatus, filterStatusSupervisor, filterSupervisao, filterDate]);

    // FINALIZA CHECKLIST
    function finaliza_checklist(relatorio_id, checklist, loja){
        axios({
            url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist',
            method: 'post',
            data: {
                relatorio_id: relatorio_id,
                checklist_id: checklist,
                loja_id: loja,
                funcionario_id: '',
                job: ''
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            toast('Supervisão finalizada com sucesso');
            setFinish(true);
        });
    }

    // RECARREGA LISTA QUANDO FINALIZAR PREENCHIMENTO
    useEffect(() => {
        if(finish){
            get_images(false);
            setFinish(false);
        }
    },[finish]);

    // MANDA OS FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if(icons){
            icons('');
        }

        if(filters){
            filters(
                <Filter actions={(window.rs_permission_apl > 2 ? false : false)} />
            )
        }
    },[]);

    // VERIFICA SE TEM ALGUMA SUPERVISÃO (CHECKLIST) CONFIGURADA, CASO CONTRÁRIO EXIBE TELA DE ERRO
    if(!pageError){
        return(
            <div className="supervisao">
                <Container padding={false}>
                    {/* FOTOS */}
                    <InfiniteScroll
                        dataLength={limit * page}
                        hasMore={hasMore}
                        next={() => get_images(false)}
                    >
                        <div style={{position:'relative', zIndex:1}}>
                            <Row>
                                {(!loading ? 
                                    supervisao.map((loja, i) => {
                                        let allChecked = true;
                                        loja?.group[0]?.cards.map((card, i) => {
                                            if(card.resposta == 0 || !card.resposta) {
                                                allChecked = false;
                                            }
                                        });

                                        return(     
                                            <div key={'loja_'+loja.id_lja} style={{zIndex:(supervisao.length - i)}} className={(i % 2 === 0 ? '' : 'bg__light') + ' pb-4 ' + (i==0 ? '' : 'pt-4')}>                       
                                                <Col>
                                                    <Title
                                                    wrap={true}
                                                        icon={
                                                            ((window.rs_permission_apl < 3) && loja?.group[0]?.cards[0]?.status_checklist != 1 ?
                                                                <Button
                                                                    onClick={() => finaliza_checklist(loja?.group[0]?.cards[0]?.relatorio_id, loja?.group[0]?.cards[0]?.checklist_id, loja?.id_lja, '', '')}
                                                                    disabled={(allChecked ? (loja?.group[0]?.cards[0]?.status_checklist == 1 ? true : false) : true)}
                                                                    title={(allChecked ? '' : 'Responda todos os itens antes de finalizar')}
                                                                >
                                                                    Finalizar
                                                                </Button>
                                                            :'')
                                                        }
                                                    >
                                                        {loja.title}                                            
                                                    </Title>
                                                    <div onMouseEnter={() => setFocus(true)} onMouseLeave={() => setFocus(false)} className="position-relative" style={{zIndex: 6}}>
                                                        <Swiper                                                 
                                                            className={'swiper_supervisao'}
                                                            modules={[Navigation]}
                                                            autoHeight={false}
                                                            slidesPerView={(window.isMobile ? (editView ? 2 : 1) : 'auto')}
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
                                                            {(editView? 
                                                                <SwiperSlide>
                                                                    <Foto
                                                                        left={''}
                                                                        right={[]}
                                                                        multiple={false}
                                                                        camera={true}
                                                                        new={true}
                                                                    />
                                                                </SwiperSlide>
                                                            :'')}

                                                            {(loja.group[0].cards.length > 0 ?
                                                                loja.group[0].cards.map((item, i) => {
                                                                    var json, imgModelo, imgTirada
                                                                    if(item.resposta_supervisao){
                                                                        json = JSON.parse(item.resposta_supervisao);
                                                                        imgModelo = [window.upload+'/'+json.foto_1[0].imagem];

                                                                        if(json.foto_2){
                                                                            let img_tirada_aux = [];
                                                                            json.foto_2.map((foto, i) => {
                                                                                img_tirada_aux.push(window.upload+'/'+foto.imagem);
                                                                            });
                                                                            imgTirada = img_tirada_aux;
                                                                        }else{
                                                                            imgTirada = [];
                                                                        }
                                                                    }else{
                                                                        json = '';

                                                                        if(item.modelo){
                                                                            let modelo_aux = [];
                                                                            item.modelo.split(',').map((img, i) => {
                                                                                modelo_aux.push(window.upload+'/'+img);
                                                                            })
                                                                            imgModelo = modelo_aux;
                                                                        }else{
                                                                            imgModelo = [];
                                                                        }

                                                                        imgTirada = [];
                                                                    }

                                                                    return(
                                                                        <SwiperSlide key={item.checklist_id+'_'+item.loja_id+'_'+i}>
                                                                            <Foto
                                                                                left={(imgModelo ? imgModelo : [])}
                                                                                right={(imgTirada ? imgTirada : [])}
                                                                                qtd={(imgTirada.length)}
                                                                                modelo={(item?.tipo_sistema == 'antes_depois' ? false : true)}
                                                                                selectModelo={false}
                                                                                camera={((window.rs_permission_apl > 2) || (item.resposta_supervisao && item.resposta) ? false : true)} // BOTÃO DE CÂMERA SÓ APARECE PARA NÍVEL DE ACESSO LOJISTA
                                                                                rate={{
                                                                                    lojista: (((item?.tipo_sistema == 'antes_depois' && imgModelo.length > 0 && imgTirada.length > 0) || (item?.tipo_sistema != 'antes_depois' && imgTirada.length > 0)) && (window.rs_permission_apl < 3) ? true : false), // BOTÃO DE APROVAR/REPROVAR FOTO TIRADA APARECE SOMENTE PARA NÍVEL DE ACESSO LOJISTA
                                                                                    adm: (item.resposta && (window.rs_permission_apl > 2) ? true : false) // BOTÃO DE APROVAR/REPROVAR AVALIAÇÃO DA FOTO TIRADA APARECE SÓ SE TIVER RESPOSTA E O NÍVEL DE ACESSO FOR MAIOR QUE LOJISTA
                                                                                }}                                                                    
                                                                                aproved={{
                                                                                    lojista: (item.resposta == 1 ? true : false),
                                                                                    adm: (item.double_check == 1 ? true : false)
                                                                                }}
                                                                                inapplicable={{
                                                                                    lojista: (item.resposta == 3 ? true : false),
                                                                                    adm: (item.double_check == 3 ? true : false)
                                                                                }}
                                                                                reproved={{
                                                                                    lojista: (item.resposta == 2 ? true : false),
                                                                                    adm: (item.double_check == 2 ? true : false)
                                                                                }}
                                                                                lojista={item?.resposta_usuario}
                                                                                adm={item?.double_check_usuario}
                                                                                title={(item.secao ? item.secao+': ':'') + item?.pergunta}
                                                                                motive={(item.resposta_motivo ? item.resposta_motivo : '')}
                                                                                motive_supervisor={(item.double_check_motivo ? item.double_check_motivo : '')}
                                                                                observation={item?.resposta_observacao}
                                                                                avaliation={item?.double_check_motivo}
                                                                                avaliation_observation={item?.resposta_motivo}
                                                                                params={{
                                                                                    job: item?.id_job_status,
                                                                                    relatorio_id: item?.relatorio_id,
                                                                                    pergunta_id: item?.pergunta_id,
                                                                                    checklist_id: item?.checklist_id,
                                                                                    loja_id: item?.loja_id,
                                                                                    funcionario_id: item?.funcionario_id,
                                                                                    resposta_id: item?.resposta_id,
                                                                                    resposta: item?.resposta,
                                                                                    data: cd(filterDate),
                                                                                    supervisao: item?.resposta_supervisao
                                                                                }}
                                                                                date_lojista={item?.resposta_dataFormatada}
                                                                                date_adm={item?.double_check_dataFormatada}
                                                                                callback={() => get_images(false, true)}
                                                                            />
                                                                        </SwiperSlide>
                                                                    )
                                                                })
                                                            :
                                                                <SwiperSlide>
                                                                    <Foto empty={true} />
                                                                </SwiperSlide>
                                                            )}
                                                        </Swiper>                            
                                                    </div>
                                                </Col>
                                            </div>
                                        )
                                    })
                                :            
                                    [...Array(3)].map((row, iRow) => (
                                        <div key={'loader_lojas_'+iRow} style={{zIndex: -1}}>
                                            <Col>
                                                <Title loader={true} />

                                                <Swiper
                                                    className={'swiper_supervisao'}
                                                    style={{zIndex:9}}                
                                                    modules={[Navigation]}
                                                    autoHeight={false}
                                                    slidesPerView={(window.isMobile ? (editView ? 2 : 1) : 'auto')}
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
                            </Row>      
                        </div>   
                    </InfiniteScroll>
                </Container>
            </div>
        );
    }else{
        return(
            <PageError
                title="Nenhuma Supervisão configurada"
                text={`Tente novamente em alguns minutos.\nCaso o problema persista, entre em contato com o suporte.`}
            />
        )
    }
}