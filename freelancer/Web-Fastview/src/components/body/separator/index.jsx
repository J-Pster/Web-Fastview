import style from './style.module.scss';

export default function Separator({label, marginTop, marginBottom}){
    // DEFINE MARGEM
    let margin_top_aux, margin_bottom_aux;

    if(marginTop === false || marginTop === 0){
        margin_top_aux = '0';
    }else{
        margin_top_aux = marginTop ? marginTop : 20;
    }

    if(marginBottom === false || marginBottom === 0){
        margin_bottom_aux = '0';
    }else{
        margin_bottom_aux = marginBottom ? marginBottom : 20;
    }

    return(
        <div
            className={style.separator}
            style={{
                marginTop: margin_top_aux,
                marginBottom: margin_bottom_aux
            }}
        >
            <span>{label}</span>
        </div>
    )
}
