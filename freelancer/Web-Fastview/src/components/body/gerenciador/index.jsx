import { useEffect, useContext } from 'react';
import { GerenciadorContext } from "../../../context/Gerenciador";

import Title from '../title';
import style from './Gerenciador.module.scss';
import Icon from '../icon';

export default function Gerenciador(props){
    // // CONTEXT
    // const {
    //     autoScroll,
    //     handleAutoScroll
    // } = useContext(GerenciadorContext);

    // // SCROLL AUTOMÁTICO
    // useEffect(() => {
    //     if(props.id && props.autoScroll){       
    //         const scrollElement = document.getElementById(props.id);
    //         const scrollContainer = document.querySelector('.content');
    //         setTimeout(function(){
    //             scrollContainer.scrollTo({
    //                 // top: (window.isMobile?5000:0),
    //                 left: (window.isMobile?0:(scrollElement.offsetLeft - 420)),
    //                 behavior: 'smooth'
    //             });
    //         },200);
    //     }        
    // },[autoScroll]);

    return(
        <>
            <div
                id={props.id}
                className={style.gerenciador__col + ' ' + (props?.disabled ? style.disabled : '') + ' ' + props?.className}
            >
                <Title
                    icon={
                        (props.icon?
                            props.icon
                        :'')
                    }
                    overflow={true}
                >
                    {props.title}
                </Title>

                <div className={style.gerenciador__container + ' ' + (props.search===false?style.without__search:'') + ' ' + (props.filter?style.with__filter:'')}>
                    {(props.search!==false?
                        <div className={style.gerenciador__search}>
                            {
                                (props.filter?
                                    <div className="d-block w-100">
                                        {props.filter}
                                    </div>
                                :'')
                            }

                            <div className={'d-flex align-items-center justify-content-between' + ' ' + style.search_container}>
                                {(props.search ? 
                                    <>
                                        <Icon type="search" animated />
                                        <div className="w-100">
                                            {props.search}
                                        </div>
                                    </>
                                :'')}

                                <div className={'flex-1 '+style.switches}>
                                    {
                                        (props.switch?
                                            props.switch
                                        :'')
                                    }
                                </div>
                            </div>
                        </div>
                    :'')}
                    <div>
                    {/* <div onClick={() => (props.id && props.autoScroll ? handleAutoScroll() : {})}> */}
                        { props.children }
                    </div>
                </div>
            </div>
        </>
    )
}
