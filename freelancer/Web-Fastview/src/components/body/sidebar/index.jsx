import { useState, useEffect } from 'react';
import style from './Sidebar.module.scss';

/*SWIPER*/
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../../_assets/css/swiper.scss';

export default function Sidebar(props){
    const [isHovering, setIsHovering] = useState(false);
    const [swiper, setSwiper] = useState();

    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    useEffect(() => {
        //swiper.update();
        //console.log(swiper);
    },[swiper]);

    return(
        <div className={ style.sidebar + ' ' + (isHovering?style.sidebar__active:'') } onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {/* {(window.isMobile?
                <Swiper
                    autoHeight={false}
                    slidesPerView={1}
                    spaceBetween={15}  
                    observer={'true'}
                    onSwiper={(swiper) => setSwiper(swiper)}   
                    navigation
                    loop={false}
                    allowTouchMove={true}
                    breakpoints={{
                        500: {
                            slidesPerView:'auto',
                            allowTouchMove:false
                        }
                    }}
                >   
                    { props.children }
                </Swiper>
                    
            :
                <ul>
                    { props.children }
                </ul>
            )} */}

            <ul>
                { props.children }
            </ul>
        </div>
    );
}
