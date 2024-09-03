import Lightbox from '../ligthbox';
import style from './Image.module.scss';

import { useState } from 'react';

export default function Image(props){
    const [toggler, setToggler] = useState(false);
    const [img, setImg] = useState(null);

    return(
        <>
            {/* LIGHTBOX */}
            <Lightbox toggler={toggler} sources={[img]} />

            <div
                className={style.image + ' ' + (props.cursor?'cursor-'+props.cursor:'cursor-pointer')}
                style={{backgroundImage:'url('+props.src+')'}}
                onClick={() => (setToggler(!toggler), setImg(props.src))}
            ></div>
        </>
    )
}
