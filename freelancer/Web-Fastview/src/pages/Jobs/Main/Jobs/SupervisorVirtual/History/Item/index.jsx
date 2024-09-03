import { useEffect, useState } from "react";
import Col from "../../../../../../../components/body/col";
import style from '../../style.module.scss';
import Icon from "../../../../../../../components/body/icon";
import Tippy from "@tippyjs/react";
import axios from "axios";
import { get_date } from '../../../../../../../_assets/js/global';
import { useNavigate } from "react-router";

export default function Item({item, type}){
    // ESTADOS
    const [info, setInfo] = useState(null);

    // NAVIGATE
    const navigate = useNavigate();

    // GET HISTÓRICO
    function get_history(){
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: 'sql_server',
                type: 'Job',
                do: 'getLogVirtualSupervisionRanking',
                id_usuario: type === 'job_responsible' ? item?.id : undefined,
                id_loja: type === 'store' ? item?.id : undefined
            }
        }).then((response) => {
            if(response?.data?.data){
                setInfo(response?.data?.data);
            }
        })
    }

    // CHAMA FUNÇÃO DA API
    useEffect(() => {
        get_history();
    },[]);

    if(info){
        return(
            <Col xl={4} key={item?.id}>
                <div className={style.history_container}>
                    <div className={style.top}>
                        <div className="d-flex align-items-center justify-content-between">
                            <span>
                                <Icon
                                    type="trend"
                                    title={false}
                                    readonly
                                />

                                {Math.abs(parseInt(item?.pontos))} pts.
                            </span>

                            {/* <button onClick={() => navigate('/systems/'+window.link+'/calendario/1/0/0/0/0/0/'+item?.id)}>
                                Ver jobs
                            </button> */}
                        </div>
                    </div>

                    <div className={style.user + ' mt-2'}>
                        <Tippy content={item?.nome}>
                            <div className={style.name + ' text-danger font-weight-bold'}>
                                {item?.nome}
                            </div>
                        </Tippy>

                        <div className={style.position}>
                            <span className={style.circle}>{item?.posicao}º</span> 

                            <Tippy content={'Inicia em '+item?.posicao+'º'}>
                                <span className={style.description}>Entrou na posição {item?.posicao}º</span>
                            </Tippy>

                            <span className="text-secondary">
                                {get_date('month_name_short', info[0]?.DataHoraUTC_cad, 'datetime_sql')?.slice(0,5).slice(0,3)}/{get_date('year', info[0]?.DataHoraUTC_cad, 'datetime_sql')}
                            </span>
                        </div>

                        {/* <div className={style.position}>
                            <span className={style.circle}>16º</span> 

                            <Tippy content="Finaliza em antepenúltimo">
                                <span className={style.description}>Finaliza em antepenúltimo</span>
                            </Tippy>

                            <span className="text-secondary">Abr/24</span>
                        </div> */}
                    </div>

                    <div className={style.history}>
                        {info?.map((history, i) => {
                            return(
                                <div className={style.item} key={'timeline_'+i}>
                                    <span className="text-secondary">
                                        {get_date('datetime', history?.DataHoraUTC_cad, 'datetime_sql')?.slice(0,5)} - {get_date('datetime', history?.DataHoraUTC_cad, 'datetime_sql')?.slice(11, 16)}
                                    </span>

                                    <span className={style.position}>
                                        <Icon
                                            type={history?.posicao < 0 ? 'chevron-down' : 'chevron-up'}
                                            title={false}
                                            readonly
                                            className={history?.posicao < 0 ? 'text-danger' : 'text-success'}
                                        />
                                        {Math.abs(parseInt(history?.posicao))}º
                                    </span>

                                    <Tippy content={history?.Descricao}>
                                        <span className={style.description}>{history?.Descricao}</span>
                                    </Tippy>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Col>
        )
    }
}