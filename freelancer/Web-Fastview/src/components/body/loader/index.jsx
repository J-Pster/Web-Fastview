import { Spinner } from 'react-bootstrap';
import styleAux from './Loader.module.scss';

export default function Loader({align, className, style, fullHeight}){
    return(
        <div
            className={'text-'+(align ? align : 'center')+ ' ' + className + ' ' + (fullHeight ? styleAux.fullHeight : '')}
            style={(style ? style : {})}
            data-box_loading
        >
            <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Carregando...</span>
            </Spinner>
        </div>
    )
}
