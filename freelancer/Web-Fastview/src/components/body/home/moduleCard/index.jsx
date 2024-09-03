import style from "./moduleCard.module.scss";
import Icon from "../../icon";

export default function ModuleCard(props) {
    return (
        <div className={style.moduleCard + ' ' +(props?.large ? style.large : '') + ' ' + (props?.grabCursor ? style.grab : '') + ' ' + (props?.disabled ? style.disabled : '')}>
            {(props?.placeholder ?
                <div className={style.placeholder}>
                    {props?.placeholder}
                </div>
            :
                <>
                    <a href={props.link} target="_blank" rel="noreferrer" className={style.moduleRedirect + ' d-block w-100'}>
                        <div className={style.title}>
                            <div className={style.icon_container}>
                                <Icon type={(props.icon ? props.icon : 'list')} className={style.smallModuleIcon} />
                            </div>

                            <span className={style.smallModuleSpan}>
                                {props?.title}
                            </span>
                            
                            <span
                                className={style.smallModuleButtom}
                                type={props.type}
                                onClick={props.onClick}
                            >
                                {props.buttonLabel}
                            </span>
                        </div>

                        {(props?.large ?
                            <div className={style.info}>
                                <span className={style.label}>
                                    {props?.info?.label}
                                </span>

                                <div className={style.items}>
                                    {(props?.info?.items ? 
                                        props.info.items.map((item, i) => {
                                            return(
                                                <div key={props?.id+'_info_'+i} className={style.info_item}>
                                                    {item.title}
                                                </div>
                                            )
                                        })
                                    :'')}
                                </div>
                            </div>
                        :'')}
                    </a>
                </>
            )}
        </div>
    )
}