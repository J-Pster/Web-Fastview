import style from './Foto.module.scss';

import { useState, useEffect, useContext, useRef } from 'react';
import { GlobalContext } from "../../../context/Global";

import Icon from '../icon';
import Input from '../form/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import MotivoChecklist from '../../../pages/Checklist/Lista/motivo';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../_assets/css/swiper.scss';
import { Navigation } from 'swiper';

export default function Foto(props){
    // CONTEXT
    const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

    // REF
    const boxFoto = useRef(null);

    // ESTADOS
    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(false);
    const [imgLeft, setImgLeft] = useState((props.left ? props.left : []));
    const [imgLeftSelected, setImgLeftSelected] = useState([]);
    const [imgRight, setImgRight] = useState((props.right ? props.right : []));
    const [focusAprove, setFocusAprove] = useState(false);
    const [focusReprove, setFocusReprove] = useState(false);
    const [focusInapplicable, setFocusInapplicable] = useState(false);
    const [showMotivo, setShowMotivo] = useState(false);
    const [modalMotivoTitle, setModalMotivoTitle] = useState('Motivo');
    const [supervisao, setSupervisao] = useState((props?.params?.supervisao ? JSON.parse(props?.params?.supervisao) : ''));
    const [swiperFoto, setSwiperFoto] = useState();
    const [executeSupervisao, setExecuteSupervisao] = useState(false);

    // SWIPER
    const swiperSlide = useSwiperSlide();

    // ESTADOS DE VALORES
    const [resposta, setResposta] = useState('');
    const [avaliacao, setAvaliacao] = useState('');

    function handleDeleteModel(){
        window.confirm('Tem certeza que deseja excluir o modelo?');
    }

    // ATUALIZA IMAGENS SEMPRE QUE HOUVER ALTERAÇÃO VIA PROPS
    useEffect(() => {
        setImgLeft(props?.left);
    },[props?.left]);

    useEffect(() => {
        if(props?.right){
            setImgRight(props?.right);
        }
    },[props?.right]);

    // DETECTA CLIQUE FORA DO CONTAINER DA FOTO
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
    }, []);

    // AÇÕES AO CLICAR FORA DO ELEMENTO
    const handleClickOutside = (e) => {
        if(boxFoto){
            if(boxFoto.current){
                if(!boxFoto?.current.contains(e.target)){
                    setHover(false);
                    setFocus(false);  
                    boxFoto.current.style.zIndex = 0;
                    boxFoto.current.parentElement.style.zIndex = 0;
                }else{
                    boxFoto.current.style.zIndex = 9;
                    boxFoto.current.parentElement.style.zIndex = 9;
                }
            }
        }
    }

    // AÇÕES AO FAZER O HOVER
    const handleSetHover = (hover) => {
        if(hover){
            setHover(true);
            boxFoto.current.style.zIndex = 9;
            boxFoto.current.parentElement.style.zIndex = 9; 
        }else{
            setHover(false);
            if(!focus){
                setTimeout(() => {
                    boxFoto.current.style.zIndex = 0;
                    boxFoto.current.parentElement.style.zIndex = 0;
                },200);
            }
        }
    }

    // CALLBACK DE UPLOAD DA IMAGEM
    const handleCallback = (e, position) => {  
        let imgs = e[0];  
        const executeSuper = props?.rate?.lojista?.aproveAction == null;
        if(imgs){
            if(position == 1){
                setImgLeft([window.upload+'/'+JSON.parse(imgs)[0].id]);
            }else if(position == 2){
                if(imgRight[swiperFoto?.activeIndex]){
                    let img_right_aux = imgRight;
                    img_right_aux[swiperFoto.activeIndex] = window.upload+'/'+JSON.parse(imgs)[0].id;
                    setImgRight(img_right_aux);
                }else{
                    let img_right_aux = JSON.parse(imgs)[0].id
                    setImgRight(imgRight => [...imgRight, window.upload+'/'+img_right_aux]);
                     
                }
            }
        }

        setExecuteSupervisao(executeSuper);
    }

    useEffect(() => {
        if(executeSupervisao){
            set_supervisao();
        }
    },[executeSupervisao]);

    // FUNÇÃO QUE ENVIA AS FOTOS
    function set_supervisao(){
        let foto_1_aux = [];
        let foto_2_aux = [];

        if(props?.left.length > 1){
            if(imgLeftSelected){
                foto_1_aux = [{imagem: imgLeftSelected.replace(window.upload+'/','')}]
            }
        }else{
            if(imgLeft.length > 0){
                foto_1_aux = [{imagem: imgLeft[0].replace(window.upload+'/','')}]
            }
        }
        if(imgRight.length > 0){
            imgRight.map((img, i) => {
                foto_2_aux.push(
                    {imagem: img.replace(window.upload+'/','')}
                )
            });
        }

        let imgObj = {
            foto_1: foto_1_aux,
            foto_2: foto_2_aux
        }

        setSupervisao(imgObj);

        // FAZ POST DA IMAGEM
        axios({
            method: 'post',
            url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist_item',
            data: {
                relatorio_id: props?.params?.relatorio_id,
                pergunta_id: props.params?.pergunta_id,
                checklist_id: props.params?.checklist_id,
                loja_id: props.params?.loja_id,
                supervisao: (imgObj ? JSON.stringify(imgObj) : ''),
                data: props.params?.data,
                job: props?.params?.job,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(() => {
            toast('Imagem salva com sucesso');
            props.callback(foto_2_aux);
            setExecuteSupervisao(false);
        });
    }

    // CALLBACK DE UPLOAD DE MODELO
    const handleCallbackModel = (e) => {
        let imgs = e[0];
        setImgLeft([window.upload+'/'+imgs[0]]);
        // props.callback(imgs[0]);
    }

    // CLIQUE IMAGEM ESQUERDA
    const handleClickLeft = (i) => {
        if(imgLeft?.length > 0){
            handleSetToggler(true);
            handleSetSources(imgLeft, i);
        }
    }

    // CLIQUE IMAGEM DIREITA
    const handleClickRight = () => {
        if(imgRight?.length > 0){
            handleSetToggler(true);
            handleSetSources(imgRight);
        }
    }

    // SETA IMAGEM MODELO SELECIONADA
    const handleSetImgLeftSelected = (i) => {
        setImgLeftSelected(imgLeft[i]);
    }

    // POST RESPOSTA CHECKLIST
    function post_resposta(respostaValue){
        axios({
            method: 'post',
            url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist_item',
            data: {
                relatorio_id: props?.params?.relatorio_id,
                pergunta_id: props?.params?.pergunta_id,
                resposta: respostaValue,
                checklist_id: props?.params?.checklist_id,
                loja_id: props?.params?.loja_id,
                job: props?.params?.job,
                funcionario_id: props?.params?.funcionario_id,
                supervisao: (supervisao ? JSON.stringify(supervisao) : ''),
                data: props?.params?.data
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(() => {
            props.callback(true);
        });
    }

    // POST AVALIAÇÃO CHECKLIST
    function post_avaliacao(avaliacaoValue){
        axios({
            method: 'post',
            url: window.host+'/systems/'+global.sistema_url.checklist+'/api/avaliacao.php?do=post_avaliacao',
            data: {
                relatorio_id: props?.params?.relatorio_id,
                pergunta_id: props?.params?.pergunta_id,
                resposta: props.params?.resposta,
                checklist_id: props?.params?.checklist_id,
                resposta_id: props?.params?.resposta_id,
                loja_id: props.params?.loja_id,
                observacao: '',
                classificacao: '',
                motivo: '',
                job: props?.params?.job,
                supervisao: (supervisao ? JSON.stringify(supervisao) : ''),
                funcionario_id: props?.params?.funcionario_id,
                avaliacao: avaliacaoValue,
                data: props?.params?.data
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(() => {
            props.callback(true);
        });
    }

    // MOSTRAR AVALIAÇÃO
    const handleShowAvaliacao = (e) => {
        setResposta(e);

        if(e==1){ // SE RESPOSTA FOR "APROVADO"
            post_resposta(e);
        }

        if(e==2){ // SE RESPOSTA FOR "REPROVADO"
            setShowMotivo(true);
            setModalMotivoTitle('Motivo');
        }
    }

    // MOSTRAR AVALIAÇÃO SUPERVISOR
    const handleShowAvaliacaoSupervisor = (e) => {
        setAvaliacao(e);

        if(e==1){
            post_avaliacao(e);
        }else{            
            setShowMotivo(true);
            setModalMotivoTitle('Observações');
        }
    }

    // CALLBACK DE RELOAD NA LISTA DE FOTOS
    const handleSetReload = () => {
        props.callback(true);
    }

    // CALLBACK AO FECHAR MODAL MOTIVO
    const handleCloseModalMotivo = () => {
        props.callback(true);
        setTimeout(() => {
            setShowMotivo(false);
        },500);
    }

    return(
        <>
            {/* MOTIVO REPROVAÇÃO */}
            <MotivoChecklist
                modalTitle={modalMotivoTitle}
                api={(props.params?.resposta_id && props.params?.resposta ? window.host+'/systems/'+global.sistema_url.checklist+'/api/avaliacao.php?do=post_avaliacao' : '')}
                show={showMotivo}
                hide={handleCloseModalMotivo}
                job={props.params?.job}
                checklist_id={props.params?.checklist_id}
                resposta_id={props.params?.resposta_id}
                pergunta_id={props.params?.pergunta_id}
                loja_id={props.params?.loja_id}
                resposta={resposta}
                avaliacao={avaliacao}
                supervisao={(supervisao ? JSON.stringify(supervisao) : '')}
                data={props?.params?.data}
            />

            <div
                className={ style.foto__container + ' ' + (props.loader ? style.loader : '') + ' ' + (props?.width == 'auto' ? style.foto_width__auto : '') + ' ' + (props.hover === false ? style.not__hover : '') + ' ' + (props.empty ? style.empty : '') + ' ' + (hover||focus ? style.foto__opened : '') + ' ' + (props?.className) + ' ' + (props.transform === false ? style.without_transform : '')}
                onMouseEnter={() => handleSetHover(true)}
                onMouseLeave={() => handleSetHover(false)}
                onClick={() => setFocus(true)}
                ref={boxFoto}
            >     
                {(props.title ?
                    <div className={style.foto__title + ' ' + (hover || focus ? style.show : '')}>
                        <div className={ style.foto__info }>
                            {props.title}
                        </div>
                    </div>
                :'')}

                <div className="d-flex align-items-center justify-content-center position-relative w-100" style={{backgroundColor: 'transparent'}}>       
                    <div className={ style.foto__left_container + ' ' + (props.multiple!==false?'':style.single) + ' ' + (props?.integration? style.integration : '')}>
                        {(props?.modelo === false ? // SE MODELO FOR FALSE, APARECE BOX PARA CADASTRAR FOTO
                            <>
                                <div
                                    className={ style.foto__left + ' ' + (imgLeft?.length > 0 ? 'cursor-pointer':'') + ' ' + (props?.reproved?.lojista || props?.reproved?.adm ? style.reproved : '') + ' ' + (props?.aproved?.lojista ? style.aproved : '')}
                                    style={ (imgLeft?.length > 0 ? { backgroundImage:'url('+(imgLeft?.includes('http') ? imgLeft : window.upload + '/' + imgLeft)+')' } : { backgroundImage:''}) }
                                    onClick={() => handleClickLeft()}
                                >
                                    {(!props.loader && imgLeft?.length == 0 ? 
                                        <div className={style.alert_model}>
                                            Antes
                                        </div>
                                    :'')}
                                </div>

                                <div className={ style.foto__rate }>
                                    {(() => {
                                        if(props?.camera && !props?.aproved?.lojista && !props?.reproved?.lojista && props?.interaction !== false){
                                            let cameraDisabled = true;
                                            let titleCamera = '';

                                            if(!window.isMobile){
                                                cameraDisabled = true;
                                            }else{
                                                if(props?.modelo === false){
                                                    cameraDisabled = false;
                                                }
                                            }

                                            // SETA TITLE DO ÍCONE
                                            if(cameraDisabled){
                                                if(!window.isMobile){
                                                    titleCamera = 'Registro disponível apenas em dispositivos móveis';
                                                }                                                   
                                            }else{
                                                if(props?.modelo === false){
                                                    titleCamera = 'Registrar foto de antes';
                                                }else{
                                                    titleCamera = 'Registrar foto';
                                                }
                                            }

                                            return(
                                                <Input
                                                    type="file"
                                                    border={false}
                                                    icon="camera"
                                                    multiple={false}
                                                    accept="image/*"
                                                    capture="environment"
                                                    callback={(e) => {
                                                        handleCallback(e, 1);
                                                        
                                                    }}
                                                    disabled={(cameraDisabled ? true : false)}
                                                    title={titleCamera}
                                                />
                                            )
                                        }
                                    })()}
                                </div>
                            </>
                        :
                            <Swiper
                                className="swiper_foto"
                                modules={[Navigation]}
                                autoHeight={false}
                                slidesPerView={1}
                                spaceBetween={0}     
                                navigation={(imgLeft?.length > 1 ? true : false)}
                                loop={false}
                                allowTouchMove={true}
                                speed={500}
                                breakpoints={{
                                    500: {
                                        allowTouchMove:false
                                    }
                                }}                        
                            >
                                {(props?.new ? 
                                    <SwiperSlide>
                                        <div className="position-relative">
                                            <div className={ style.foto__left }></div> 
                                        </div>
                                    </SwiperSlide>
                                :
                                    (imgLeft?.length > 0 ? 
                                        imgLeft.map((image, i) => {
                                            return(
                                                <SwiperSlide key={'image_swiper_'+i}>
                                                    <div className="position-relative">
                                                        {(imgLeft?.length > 1 && props?.interaction !== false && props.selectModelo !== false ?
                                                            <Input
                                                                type="radio"
                                                                name="select_model"
                                                                className={style.select_model}
                                                                onChange={() => handleSetImgLeftSelected(i)}
                                                            />
                                                        :'')}

                                                        <div
                                                            className={ style.foto__left + ' cursor-pointer' }
                                                            style={ (imgLeft ? { backgroundImage:'url('+(image?.includes('http') ? image : window.upload + '/' + image)+')' } : {}) } onClick={() => handleClickLeft(i)}
                                                        ></div> 
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                    :
                                        (!props.loader && !props.empty ? 
                                            <div className={ style.foto__left }>
                                                <div className={style.alert_model}>
                                                    Nenhuma foto modelo cadastrada
                                                </div>
                                            </div> 
                                        :'')
                                    )
                                )}
                            </Swiper>
                        )}

                        <div className={ style.foto__rate }>
                            {(() => {
                                if(props.iconLeft && props.iconLeft.toString().includes('anexar')){
                                    return(
                                        // <Icon type="camera" title="Registrar novo modelo" />
                                        ''
                                    )
                                }
                            })()}

                            {(() => {
                                if(props.delete && props?.interaction !== false){
                                    return(
                                        <Icon
                                            type="trash"
                                            title="Excluir modelo"
                                            onClick={() => handleDeleteModel()}
                                        />
                                    )
                                }
                            })()}
                        </div>
                    </div>

                    {(() => {
                        if(props.multiple!==false){
                            return(
                                <div className={ style.foto__right_container + ' ' + (props?.integration ? style.integration : '')}>
                                    <Swiper
                                        className="swiper_foto"
                                        modules={[Navigation]}
                                        autoHeight={false}
                                        slidesPerView={1}
                                        spaceBetween={0}     
                                        navigation={(props?.qtd > 1 ? true : false)}
                                        onSwiper={(swiperFoto) => setSwiperFoto(swiperFoto)}
                                        loop={false}
                                        allowTouchMove={true}
                                        speed={500}
                                        breakpoints={{
                                            500: {
                                                allowTouchMove:false
                                            }
                                        }}                        
                                    >
                                        {[...Array(props?.qtd)].map((foto, i) => (
                                            <SwiperSlide key={props?.params?.pergunta_id+'_foto_'+i}>
                                                <div
                                                    className={ style.foto__right + ' ' + (imgRight[i] ? 'cursor-pointer':'') + ' ' + (props?.reproved?.lojista || props?.reproved?.adm ? style.reproved : '') + ' ' + (props?.aproved?.lojista ? style.aproved : '')}
                                                    style={ (imgRight[i] ? { backgroundImage:'url('+(imgRight[i]?.includes('http') ? imgRight[i] : window.upload + '/' + imgRight[i])+')' } : { backgroundImage:'url('+(imgLeft?.length > 1 ? (imgLeftSelected?.includes('http') ? imgLeftSelected : window.upload + '/' + imgLeftSelected) : (imgLeft ? (imgLeft[0]?.includes('http') ? imgLeft[0] : window.upload + '/' + imgLeft[0]) : ''))+')', opacity: .2 }) }
                                                    onClick={() => (imgRight[i] ? handleClickRight() : {})}
                                                >
                                                    {(props?.modelo === false ?
                                                        (!props.loader && imgRight?.length == 0 && imgLeft?.length == 0 ? 
                                                            <div className={style.alert_model}>
                                                                Depois
                                                            </div>
                                                        :'')
                                                    :
                                                        (imgRight?.length == 0 && (imgLeftSelected.length == 0 && imgLeft?.length > 1) && !props.loader && !props.empty ?
                                                            <div className={style.alert_model}>
                                                                {(props?.inapplicable?.lojista ? 'Marcado como "Não se aplica"' : 'Nenhuma foto modelo selecionada')}                                                    
                                                            </div>
                                                        :'')
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    <div className={ style.foto__rate }>
                                        {(() => {
                                            if(props?.rate?.lojista && imgRight?.length > 0){
                                                return(
                                                    <>
                                                        {/* CASO A FOTO ESTEJA REPROVADA OU NÃO SE APLICA, NÃO APARECE ICONE DE APROVAR/APROVADO */}
                                                        {(props?.reproved?.lojista || props?.inapplicable?.lojista || props?.interaction == false ? '' : 
                                                            <Icon
                                                                type="aprovar"
                                                                readonly={(props?.aproved?.lojista ? true : false)}
                                                                title="Conforme"
                                                                className={(props?.aproved?.lojista ? 'text-success' : '')}
                                                                onClick={() => props?.rate?.lojista?.aproveAction ? props?.rate?.lojista?.aproveAction(imgRight) : handleShowAvaliacao(1)}
                                                                active={focusAprove}
                                                            />
                                                        )}

                                                        {/* CASO A FOTO ESTEJA APROVADA OU NÃO SE APLICA NÃO APARECE ICONE DE REPROVAR/REPROVADO */}
                                                        {(props?.aproved?.lojista || props?.inapplicable?.lojista || props?.interaction === false ? '' : 
                                                            <Icon
                                                                type="reprovar"
                                                                readonly={(props?.reproved?.lojista ? true : false)}
                                                                title="Não conforme"
                                                                className={(props?.reproved?.lojista ? 'text-danger' : '')}
                                                                onClick={() => props?.rate?.lojista?.reproveAction ? props?.rate?.lojista?.reproveAction(imgRight) :handleShowAvaliacao(2)}
                                                                active={focusReprove}
                                                            />
                                                        )}

                                                        {/* CASO A FOTO ESTEJA REPROVADA OU APROVADA, NÃO APARECE ICONE DE APROVAR/APROVADO */}
                                                        {(props?.reproved?.lojista || props?.aproved?.lojista || props?.interaction == false || props?.not_applicable_button === false ? '' : 
                                                            <Icon
                                                                type="ban"
                                                                readonly={(props?.inapplicable?.lojista ? true : false)}
                                                                title="Não se aplica"
                                                                className={(props?.inapplicable?.lojista ? 'text-warning' : '')}
                                                                onClick={() => props?.rate?.lojista?.banAction ? props?.rate?.lojista?.banAction() :handleShowAvaliacao(3)}
                                                                active={focusInapplicable}
                                                            />
                                                        )}
                                                    </>
                                                )
                                            }
                                        })()}

                                        {(() => {
                                            if(props?.rate?.adm){
                                                return(
                                                    <>
                                                        {/* CASO A FOTO ESTEJA REPROVADA OU NÃO SE APLICA, NÃO APARECE ICONE DE APROVAR/APROVADO */}
                                                        {(props?.reproved?.adm || props?.inapplicable?.adm || props?.interaction === false ? '' : 
                                                            <Icon
                                                                type="aprovar"
                                                                readonly={(props?.aproved?.adm ? true : false)}
                                                                title={(props?.aproved?.adm ? 'Aprovado' : 'Aprovar')}
                                                                className={(props?.aproved?.adm ? 'text-success' : '')}
                                                                onClick={() => props?.rate?.supervisao?.aproveAction ? props?.rate?.supervisao?.aproveAction(imgRight[0]) : handleShowAvaliacaoSupervisor(1)}
                                                                active={focusAprove}
                                                            />
                                                        )}                                                        

                                                        {/* CASO A FOTO ESTEJA APROVADA OU NÃO SE APLICA NÃO APARECE ICONE DE REPROVAR/REPROVADO */}
                                                        {(props?.aproved?.adm || props?.inapplicable?.adm || props?.interaction === false ? '' : 
                                                            <Icon
                                                                type="reprovar"
                                                                readonly={(props?.reproved?.adm ? true : false)}
                                                                title={(props?.reproved?.adm ? 'Reprovado' : 'Reprovar')}
                                                                className={(props?.reproved?.adm ? 'text-danger' : '')}
                                                                onClick={() => props?.rate?.supervisao?.reproveAction ? props?.rate?.supervisao?.reproveAction() : handleShowAvaliacaoSupervisor(2)}
                                                                active={focusReprove}
                                                            />
                                                        )}

                                                        {/* CASO A FOTO ESTEJA REPROVADA OU APROVADA, NÃO APARECE ICONE DE APROVAR/APROVADO */}
                                                        {(props?.reproved?.adm || props?.aproved?.adm || props?.interaction === false || props?.rate?.supervisao?.deactiveBan === true ? '' : 
                                                            <Icon
                                                                type="ban"
                                                                readonly={(props?.inapplicable?.adm ? true : false)}
                                                                title={(props?.inapplicable?.adm ? 'Não se aplica' : 'Não se aplica')}
                                                                className={(props?.inapplicable?.adm ? 'text-warning' : '')}
                                                                onClick={() =>props?.rate?.supervisao?.aproveAction ? props?.rate?.supervisao?.banAction() :  handleShowAvaliacaoSupervisor(3)}
                                                                active={focusInapplicable}
                                                            />
                                                        )}
                                                    </>
                                                )
                                            }
                                        })()}

                                        {(() => {
                                            if(props.chat){
                                                if(props.chat === true && props?.interaction !== false){
                                                    return(
                                                        <Icon
                                                            type="message"
                                                        />
                                                    )
                                                }else{
                                                    return props.chat;
                                                }
                                            }
                                        })()}

                                        {(() => {
                                            if(props?.camera && !props?.aproved?.lojista && !props?.reproved?.lojista && props?.interaction !== false){
                                                let cameraDisabled = true;
                                                let titleCamera = '';

                                                if(!window.isMobile){
                                                    cameraDisabled = true;
                                                }else{
                                                    if(imgLeft?.length == 1 || (imgLeft?.length > 1 && imgLeftSelected.length > 0)){
                                                        cameraDisabled = false;
                                                    }
                                                }

                                                // SETA TITLE DO ÍCONE
                                                if(cameraDisabled){
                                                    if(!window.isMobile){
                                                        titleCamera = 'Registro disponível apenas em dispositivos móveis';
                                                    }else{
                                                        if(props?.modelo === false){
                                                            titleCamera = 'Registre a foto de antes para continuar';
                                                        }else{
                                                            titleCamera = 'Selecione uma imagem modelo antes de registrar a foto';
                                                        }
                                                    }                                                    
                                                }else{
                                                    if(props?.modelo === false){
                                                        titleCamera = 'Registrar foto de depois';
                                                    }else{
                                                        titleCamera = 'Registrar foto';
                                                    }
                                                }
                                                
                                                return(
                                                    <Input
                                                        type="file"
                                                        border={false}
                                                        icon="camera"
                                                        multiple={false}
                                                        accept="camera"
                                                        capture="capture"
                                                        callback={(e) => { 
                                                            
                                                            handleCallback(e, 2);
                                                        }}
                                                        disabled={(cameraDisabled ? true : false)}
                                                        title={titleCamera}
                                                    />
                                                )
                                            }
                                        })()}
                                    </div>
                                </div>
                            )
                        }
                    })()}
                </div>

                <div className={style.foto__detalhes + ' ' + (hover || focus ? style.show : '')}>
                    {(() => {
                        if(props.date_lojista || props.date_adm || props.avaliation || props.observation || props.avaliation_observation || props.description || props?.aproved?.lojista || props?.reproved?.lojista || props?.inapplicable?.lojista){
                            return(
                                <div className={ style.foto__info + ' flex-1 '+(props.description ? 'text-start' : 'text-start') }>   
                                    {(() => {
                                        if(props.description){
                                            return(
                                                <div className="d-block">
                                                    {props?.description}
                                                </div>
                                            )
                                        }
                                    })()}

                                    {(props?.aproved?.lojista || props?.reproved?.lojista || props?.inapplicable?.lojista ?
                                        <div className="d-block">
                                            <b>Lojista:</b> {props?.lojista}
                                            {(props?.aproved?.lojista ? ' / Conforme' : '')}
                                            {(props?.reproved?.lojista ? ' / Não conforme'+(props.motive ? ' ('+props.motive+')':'') : '')}
                                            {(props?.inapplicable?.lojista ? ' / Não se aplica'+(props.motive ? ' ('+props.motive+')':'') : '')}
                                            {(props?.date_lojista ? ' / '+props.date_lojista : '')}
                                        </div>
                                    :'')}

                                    {(props?.aproved?.adm || props?.reproved?.adm || props?.inapplicable?.adm ?
                                        <div className="d-block">
                                            <b>Supervisor:</b> {props?.adm}
                                            {(props?.aproved?.adm ? ' / Aprovado' : '')}
                                            {(props?.reproved?.adm ? ' / Reprovado'+(props.motive_supervisor ? ' ('+props.motive_supervisor+')':'') : '')}
                                            {(props?.inapplicable?.adm ? ' / Não se aplica'+(props.motive_supervisor ? ' ('+props.motive_supervisor+')':'') : '')}
                                            {(props?.date_adm ? ' / '+props.date_adm : '')}
                                        </div>
                                    :'')}
                                </div>
                            )
                        }
                    })()}
                </div>
            </div>
        </>
    )
}
