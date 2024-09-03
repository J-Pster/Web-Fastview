import style from './Gerenciador.module.scss';

export default function Col(props){
    return(
        <div
            id={props?.id}
            className={            
                (props.sm?' col-sm-'+props.sm:'')+
                (props.md?' col-md-'+props.md:'')+
                (props.lg?' col-lg-'+props.lg:'')+
                (props.xl?' col-xl-'+props.xl:'')+
                (props.default?' col-'+props.default:'')+
                (!props.sm&&!props.md&&!props.lg&&!props.xl?' col-lg-auto':'')+
                (props.gerenciador?' '+style.col__gerenciador:'')+
                (props.className?' '+props.className:'')
            }
        >
            { props.children }
        </div>
    )
}
