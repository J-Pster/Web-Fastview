import { useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../_assets/css/global.scss';
import style from './auth.module.scss';
import './auth.scss';
import '../_assets/css/bootstrap-custom.scss';
import { useParams } from "react-router";

/*SWIPER*/
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../_assets/css/swiper.scss";
import { useLocation } from "react-router-dom";

// PÁGINAS
import Login from './Login';
import Recover from './Recover';
import Request from "./Request";
import NewPassword from "./NewPassword";
import authHomeConfig from "./authHomeConfig";

export default function Auth(){     
    const location = window?.location.origin;
    const LayoutConfig = getLayoutConfig(location);
    const {logo, background, gradient, btn_color} = LayoutConfig;
    global.btn_color = btn_color;
    
    // PARAMS 
    const params = useParams();   

    // LOCATION
    const routerLocation = useLocation();

    //CALLBACK
    const handleCallback = (e) => {
        if(e.recover){
            swiper.slideTo(1);
            setUser(e.recover?.user);

            if(e.recover.updateSwiper){
                setTimeout(() => {
                    swiper.updateAutoHeight(500);
                    swiper.update();
                },10);
            }
        }else if(e.request){
            swiper.slideTo(2);
        }else if(e.login){
            swiper.slideTo(0);
        }
    }

    // ESTADOS
    const [swiper, setSwiper] = useState();
    const [user, setUser] = useState('');

    // SE VIER O PARAMETRO DO TOKEN NA URL O SWIPER VAI ATÉ A RECUPERAÇÃO DE SENHA
    useEffect(() => {
        if(routerLocation?.pathname?.includes('login')){
            if(params.token){
                localStorage.setItem("token", params.token);
                document.cookie = "token="+params.token+"; SameSite=None; Secure";
                window.location.href = '/'
            }
        }else if(routerLocation?.pathname?.includes('recover')){
            if(params.token && swiper){
                swiper.slideTo(3);
            }
        }
    },[swiper]);

    if(routerLocation?.pathname?.includes('login') && params.token){
        // LOGIN AUTOMÁTICO
    }else{
        return (
            <div className={style.container}>
                <div className={style.left} style={{background:background}}>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5"><animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stopColor={gradient[0][0]}></stop><stop offset="100%" stopColor={gradient[0][1]}></stop></radialGradient><radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5"><animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stopColor={gradient[1][0]}></stop><stop offset="100%" stopColor={gradient[1][1]}></stop></radialGradient><radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5"><animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stopColor={gradient[2][0]}></stop><stop offset="100%" stopColor={gradient[2][1]}></stop></radialGradient></defs><rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)" transform="rotate(334.41 50 50)"><animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite"></animate><animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite"></animateTransform></rect><rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)" transform="rotate(255.072 50 50)"><animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite"></animate><animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite"></animateTransform></rect><rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)" transform="rotate(139.903 50 50)"><animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite"></animate><animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite"></animateTransform></rect></svg>
                </div>
                <div className={style.right}>
                    <div>
                        {/* BACKGROUND */}
                    </div>

                    <div className={style.form_container}>
                        <img src={logo} alt={style.logo} className={style.logo} />

                        <div className={style.form_container_change}>
                            <Swiper
                                ref={swiper}
                                preventClicks={false}
                                simulateTouch={false}
                                autoHeight={false}
                                spaceBetween={100}
                                onSwiper={(swiper) => setSwiper(swiper)}
                                allowTouchMove={true}
                                slidesPerView={1}
                                slidesPerGroup={1}
                                watchSlidesProgress={true}
                                className="swiper_auth"
                            >
                                <SwiperSlide>
                                    {({ isVisible }) => (
                                        (isVisible ?
                                            <div className={style.login}>
                                                <Login
                                                    callback={handleCallback}
                                                />
                                            </div>
                                        :'')
                                    )}
                                </SwiperSlide>

                                <SwiperSlide>
                                    {({ isVisible }) => (
                                        (isVisible ?
                                            <div className={style.recover}>
                                                <Recover
                                                    callback={handleCallback}
                                                    user={user}
                                                />
                                            </div>
                                        :'')
                                    )}
                                </SwiperSlide>

                                <SwiperSlide>
                                    {({ isVisible }) => (
                                        (isVisible ?
                                            <div className={style.request}>
                                                <Request
                                                    callback={handleCallback}
                                                />
                                            </div>
                                        :'')
                                    )}
                                </SwiperSlide>

                                <SwiperSlide>
                                    {({ isVisible }) => (
                                        (isVisible ?
                                            <div className={style.request}>
                                                <NewPassword
                                                    callback={handleCallback}
                                                    user={user}
                                                />
                                            </div>
                                        :'')
                                    )}
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                    
                    <div className={style.footer}>
                        <a href="https://v3.madnezz.com.br/systems/lgpd/" target="_blank" >Política de Privacidade</a>
                    </div>
                </div>
            </div>    
        );
    }
}


const getLayoutConfig = (origin) => {
    const LayoutConfigs = authHomeConfig.personalization;

    const index = LayoutConfigs.findIndex((value) => value.origin === origin);
    if(index > 0) return LayoutConfigs[index];
    return LayoutConfigs[0];
}