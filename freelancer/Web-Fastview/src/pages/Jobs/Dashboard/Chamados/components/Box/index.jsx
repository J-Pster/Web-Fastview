import Loader from '../../../../../../components/body/loader';
import style from './style.module.scss';

export default function Box({title, subtitle, body, className, loading}){
    return(
        <div className={style.box + ' ' + className}>
            <div className={style.header}>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        {title}
                    </div>

                    {(subtitle &&
                        <p className="mb-0">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className={style.body}>
                {(loading ?
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{height: 300}}
                    >
                        <Loader />
                    </div>
                :
                    body
                )}
            </div>
        </div>
    )
}