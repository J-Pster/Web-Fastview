import { useState } from "react";
import Loader from '../loader';
import style from './style.module.scss';

export default function Iframe({url, sal}){
    // TOKEN
    let token = localStorage.getItem('token');

    // ESTADOS
    const [loading, setLoading] = useState(true);

    // IFRAME CARREGADO
    const handleSetLoaded = () => {
        setLoading(false);
    }

    // DEFINE URL
    let url_aux = '';

    if(sal){
        url_aux += url;
    }else{
        url_aux += window.host + '/' + url;

        if(url?.includes('?')){
            url_aux += '&';
        }else{
            url_aux += '/?';
        }

        url_aux += 'integrated=true&token='+token;
    }

    if(url){
        return(
            <>
                {(loading ?
                    <div className={style.loader}>
                        <Loader />
                    </div>
                :'')}

                <iframe
                    src={url_aux}
                    id="iframe_sistema"
                    className={sal ? 'sal' : ''}
                    onLoad={handleSetLoaded}
                    style={{display: (loading ? 'none' : 'block')}}
                ></iframe>
            </>
        )
    }
}
