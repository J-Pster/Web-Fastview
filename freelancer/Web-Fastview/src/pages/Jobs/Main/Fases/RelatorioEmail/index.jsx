import { useEffect, useState } from 'react';
import { get_date } from '../../../../../_assets/js/global';
import Icon from '../../../../../components/body/icon';
import Item from './Item';
import style from './style.module.scss';
import Loader from '../../../../../components/body/loader';
import axios from 'axios';

export default function RelatorioEmail({jobs, filters, refreshCard, loading}){
    // ESTADOS
    const [reload, setReload] = useState(jobs);
    const [chatActive, setChatActive] = useState(false);
    const [optionsStatus, setOptionsStatus] = useState([]);

    // CALLBACK DO ITEM
    const handleCallback = (e) => {
        // TROCA DE FASE
        if(e?.changePhase){
            let phase_index_prev = e?.changePhase?.phase_index;
            let phase_index_next = (e?.changePhase?.type === 'next' ? (e?.changePhase?.phase_index + 1) : (e?.changePhase?.phase_index - 1));
            let id_job_status = e?.changePhase?.id_job_status;
            let card = jobs[e?.changePhase?.phase_index]?.group[0]?.cards.filter((elem) => elem.id_job_status == id_job_status)[0];
            let cards_new = jobs[phase_index_next].group[0].cards;
            cards_new.push(card);

            jobs[phase_index_prev].group[0].cards = jobs[phase_index_prev]?.group[0]?.cards.filter((elem) => elem.id_job_status != id_job_status);
            jobs[phase_index_next].group[0].cards = cards_new;
        }

        // ARQUIVAR
        if(e?.archive){
            let phase_index = e?.archive?.phase_index;
            let id_job_status = e?.archive?.id_job_status;
            let id_job_parent = e?.archive?.id_job_parent;
            let card;

            if(id_job_parent){
                card = jobs[phase_index]?.group[0]?.cards.filter((elem) => elem.id_job == id_job_parent)[0].cards_parent.filter((elem) => elem.id_job_status == id_job_status)[0];
                card.ativo_job_status = e?.archive?.status;
            }else{
                card = jobs[phase_index]?.group[0]?.cards.filter((elem) => elem.id_job_status == id_job_status)[0];
                card.ativo_job_status = e?.archive?.status;
            }

            if(e?.archive?.status === 2){
                if(filters?.archived == 2){
                    jobs[phase_index].group[0].cards = jobs[phase_index].group[0].cards?.filter((elem => elem.id_job_status != id_job_status));
                }
            }

            if(e?.priority?.status === 2){
                if(filters?.priority == 2){
                    jobs[phase_index].group[0].cards = jobs[phase_index].group[0].cards?.filter((elem => elem.id_job_status != id_job_status));
                }
            }
        }

        // TROCAR STATUS
        if(e?.status){
            let phase_index = e?.status?.phase_index;
            let id_job_status = e?.status?.id_job_status;
            let id_job_parent = e?.status?.id_job_parent;
            let card;

            if(id_job_parent){
                card = jobs[phase_index]?.group[0]?.cards.filter((elem) => elem.id_job == id_job_parent)[0].cards_parent.filter((elem) => elem.id_job_status == id_job_status)[0];
                card.status = e?.status?.status;
            }else{
                card = jobs[phase_index]?.group[0]?.cards.filter((elem) => elem.id_job_status == id_job_status)[0];
                card.status = e?.status?.status;
            }
        }

        // REABRIR
        if(e?.reopen){
            let phase_index = e?.reopen?.phase_index;
            let id_job_status = e?.reopen?.id_job_status;
            let id_job_parent = e?.reopen?.id_job_parent;
            let card;

            if(id_job_parent){
                card = jobs[phase_index]?.group[0]?.cards.filter((elem) => elem.id_job == id_job_parent)[0].cards_parent.filter((elem) => elem.id_job_status == id_job_status)[0];
                card.status = 0;
                card.status_sup = 3;
            }else{
                card = jobs[phase_index]?.group[0]?.cards.filter((elem) => elem.id_job_status == id_job_status)[0];
                card.status = 0;
                card.status_sup = 3;
            }
        }

        // RECARREGAR CARD
        if(e?.reload){
            refreshCard(e?.reload);
        }

        if(e?.chatActive){
            let scrollElement = document.getElementById('item_' + (e?.chatActive?.id_job_parent ? e?.chatActive?.id_job_status : e?.chatActive?.id_job));
            let scrollElementParent = document.getElementById('item_'+e?.chatActive?.id_job_parent);
            let numbersElementHeight = document.getElementById('numbers').offsetHeight;
            let navbarHeight = document.getElementById('system_navbar').offsetHeight;
            let top_aux;
            
            if(e?.chatActive?.id_job_parent){
                top_aux = scrollElement.offsetTop + (numbersElementHeight + navbarHeight + scrollElementParent.offsetTop - 25);
            }else{
                top_aux = scrollElement.offsetTop + (numbersElementHeight + navbarHeight - 25);
            }

            setTimeout(() => {
                window.scrollTo({
                    top: top_aux,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    setChatActive({
                        id_job_status: e?.chatActive?.id_job_status,
                        id_job_parent: e?.chatActive?.id_job_parent
                    });
                },400);
            },50);
        }
        if(e?.chatActive === false){
            setChatActive(false);
        }

        setReload(Math.random(0,99));
    }

    // RESETA ESTADOS SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS JOBS
    useEffect(() => {
        setChatActive(false);
    },[jobs]);

    // GET OPTIONS STATUS
    function get_optionsStatus(){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                    {table: 'cardStatus'}
                ]
            }
        }).then((response) => {
            if(response?.data?.data?.cardStatus){
                setOptionsStatus(response?.data?.data?.cardStatus);
            }
        });
    }

    useEffect(() => {
        if(optionsStatus.length == 0){
            get_optionsStatus();
        }
    },[]);

    return(
        <div className={style.container}>
            <div className={style.card + ' ' + (chatActive ? style.active : '') + ' ' + (loading ? style.loading : '')}>
                {(!loading ?
                    <>
                        <div className={style.numbers} id="numbers">
                            {jobs?.map((item, i) => {
                                return(
                                    <div className={style.box} key={'number_'+i}>
                                        <div className={style.number}>
                                            {item?.group[0]?.cards?.length}
                                        </div>

                                        <div className={style.title}>
                                            {item?.title}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className={style.timeline}>
                            {(jobs?.map((fase, fase_index) => {
                                return(
                                    <div className={style.module} key={'module_'+fase_index}>
                                        <div className={style.title + ' ' + (fase?.group[0]?.cards?.length > 0 ? style.active : '')}>
                                            {fase?.title}
                                        </div>
                                        <div className={style.cards}>
                                            {(fase?.group[0]?.cards?.map((item, i) => { 
                                                return(
                                                    <Item
                                                        key={'parent_'+item?.id_job_status}
                                                        phases={jobs}
                                                        phase={fase}
                                                        phase_index={fase_index}
                                                        items={fase?.group[0]?.cards}
                                                        itemJob={item}
                                                        optionsStatus={optionsStatus}
                                                        chat_active={chatActive}
                                                        disabled={chatActive && (chatActive?.id_job_status != item?.id_job_status && chatActive?.id_job_parent != item?.id_job) ? true : false}
                                                        callback={handleCallback}
                                                    />
                                                )
                                            }))}                                
                                        </div>
                                    </div>
                                )
                            }))}
                        </div>
                    </>
                :
                    <Loader />
                )}
            </div>
        </div>
    );
}
