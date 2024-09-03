import { useContext, useState, useEffect } from "react";
import { diffDays } from "../../../../../_assets/js/global";
import Card from "../../../../../components/body/card";
import Icon from "../../../../../components/body/icon";
import { JobsContext } from "../../../../../context/Jobs";
import CardJobs from "../../Card";
import Tippy from "@tippyjs/react";
import style from '../../card.module.scss';
import Title from "../../../../../components/body/title";

// DND KIT (ARRASTAR)
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from "./SortableItem";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Operador({group, jobs, jobsCols, job, cards, index_job, onDragStart, onDragEnd, callback, filters, optionsModule, optionsModuleUnfiltered, troca_operador, refreshCard, refreshCalendar, changeStatus, separator, collapse, index, cards_length}){
    // CONTEXT JOBS
    const { configuracoes, optionsAvaliacao, permissaoPedidos, pedidos } = useContext(JobsContext)

    // NAVIGATE
    const navigate = useNavigate();

    // ESTADOS
    const [activeId, setActiveId] = useState(null);
    const [items, setItems] = useState(group.cards.filter((elem) => (diffDays(window.currentDate, elem.data.slice(0,10)+' 00:00:00')) >= 0 || elem.id_usuario));
    const [agendados, setAgendados] = useState(group.cards.filter((elem) => (diffDays(window.currentDate, elem.data.slice(0,10)+' 00:00:00')) < 0 && !elem.status_sup));
    const [executando, setExecutando] = useState('');
    const [showCards, setShowCards] = useState(true);

    // CONFIGURAÇÕES
    var conf_operador_visivel = 1;
    var conf_pedidos = true;

    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_operador_visivel){
        let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_operador_visivel;

        if(json_aux == 0){
            conf_operador_visivel = 0;
        }else if(json_aux == 1){
            conf_operador_visivel = 1;
        }else{
            if(JSON.parse(json_aux).filter((elem) => elem.id_modulo == filters?.modulo)[0]?.value){
                conf_operador_visivel = JSON.parse(json_aux).filter((elem) => elem.id_modulo == filters?.modulo)[0]?.value;
            }
        }
    }

    // VERIFICA SE ESTÁ CONFIGURADO PRO EMPREENDIMENTO VISUALIZAR O CARD DE PEDIDOS PENDENTES
    if(configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao){
        let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'card')[0]?.conf_configuracao;

        if(json_aux){
            json_aux = JSON.parse(json_aux);
        }

        if(json_aux?.pedidos === false){
            conf_pedidos = false;
        }
    }

    // ATUALIZA ESTADOS DOS ITENS SE SOFRER ALTERAÇÃO NA PROPS "CARDS"
    useEffect(() => {
        if(cards && group?.id){
            if(cards?.tipo_fase === 'Início'){
                if(cards?.tipo_fase === job.type_phase){
                    setItems(cards?.cards);
                }
            }else if(cards?.tipo_fase === 'Pós-venda'){
                if(cards?.tipo_fase === job.type_phase){
                    setItems(cards?.cards);
                }
            }else{
                if(cards?.operator == group?.id && cards?.tipo_fase === job.type_phase){
                    setItems(cards?.cards);
                }
            }
        }        
    },[cards]);

    // ENVIA CALLBACK PARA O COMPONENTE PAI PARA RECARREGAR O CARD
    const handleRefreshCard = (e) => {
        refreshCard(e);
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI PARA RECARREGAR O CALENDÁRIO
    const handleRefreshCalendar = (e) => {
        refreshCalendar(e);
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI AO REALIZAR MUDANÇA DE STATUS
    const handleChangeStatus = (e) => {
        changeStatus(e);
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI AO ABRIR/FECHAR O CARD
    const handleSetCollapse = (e) => {
        if(collapse){
            collapse(e);
        }
    }

    // ATUALIZA O ESTADO DE "ITEMS" SEMPRE QUE SOFRE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setItems(group.cards.filter((elem) => (diffDays(window.currentDate, elem.data.slice(0,10)+' 00:00:00')) >= 0 || elem.id_usuario));
        setAgendados(group.cards.filter((elem) => (diffDays(window.currentDate, elem.data.slice(0,10)+' 00:00:00')) < 0 && !elem.status_sup));
    },[group.cards]);

    useEffect(() => {        
        if(onDragStart){
            const {active} = onDragStart;
            
            setActiveId(active?.id);
        }else{
            setActiveId(null);
        }
    },[onDragStart]);

    useEffect(() => {
        if(onDragEnd){            
            const {active, over} = onDragEnd;
            
            if(items.findIndex(item => item.id_job_status == active?.id) != -1){
                if(active?.id && over?.id){
                    if (active?.id !== over?.id) {
                        setItems((items) => {
                            const oldIndex = items.findIndex(item => item.id_job_status == active?.id);
                            const newIndex = items.findIndex(item => item.id_job_status == over?.id);
                            let card = items?.filter((elem) => elem.id_job_status == active?.id)[0];

                            changePosition(card?.id_job_status, card?.id_job, arrayMove(items, oldIndex, newIndex));                        
                            return arrayMove(items, oldIndex, newIndex);
                        });
                    }
                }
            }
            
            setActiveId(null);
        }else{
            setActiveId(null);
        }
    },[onDragEnd]);

    function changePosition(id_job_status, id_job, items){
        let position_aux = [];

        items.map((item, i) => {
            position_aux.push({
                id_job_status: item?.id_job_status,
                posicao: i
            });
        });

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                type: 'Job',
                do: 'setTable',
                tables: [{
                    table: 'position',
                    filter: {
                        id_job: id_job,
                        id_job_status: id_job_status,
                        mensagem: 'Alterou a posição do card',
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        positions: position_aux
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    // CALLBACK DE CARD EM EXECUÇÃO
    const handleCallbackExecution = (e) => {
        setExecutando(e);
    }

    // CALLBACK DA TROCA DE OPERADOR
    const handleCallbackChangeOperator = (e) => {
        if(callback?.changeOperator){
            callback?.changeOperator(e);
        }
    }

    // CALLBACK DA AVALIAÇÃO
    const handleCallbackRate = (e) => {
        if(callback?.rate){
            callback?.rate(e);
        }
    }

    // CALLBACK DA TROCA DE MÓDULO
    const handleCallbackModule = (e) => {
        if(callback?.changeModule){
            callback?.changeModule(e);
        }
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI DO CARD QUE ESTÁ SENDO EXECUTADO
    const handleCallbackExecutionAux = (e) => {
        handleCallbackExecution(e);
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI SOBRE A TROCA DE OPERADOR
    const handleCallbackChangeOperatorAux = (e, job, card) => {
        let event_aux = e;
        event_aux.job = job;
        event_aux.card = card;

        handleCallbackChangeOperator(event_aux);
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI QUANDO O CARD FOR RECEBIDO
    const handleCallbackReceive = (e) => {
        if(callback?.receive){
            callback?.receive(e);
        }
    }

    return(
        <div>
            {(() => {
                if(group.title){
                    if(items?.length > 0 || conf_operador_visivel != 0){
                        cards_length++;
                        return(
                            <>
                                <Title
                                    key={'chamados_operator_'+index}
                                    className={style.title_operator}
                                    icon={
                                        (window.rs_sistema_id == global.sistema?.manutencao &&
                                            <Icon
                                                type={showCards ? 'up' : 'down'}
                                                onClick={() => setShowCards(!showCards)}
                                                title={showCards ? 'Minimizar' : 'Maximizar'}
                                            />
                                        )
                                    }
                                >
                                    {(group?.imagem ?
                                        <div
                                            className={style.operator_image + ' ' + (group.online == 1 ? style?.online : style?.offline)}
                                            style={{backgroundImage:'url('+window.upload+'/'+group?.imagem+')'}}
                                        ></div>
                                    :
                                        <div className={style.operator_image + ' ' + (group.online == 1 ? style?.online : style?.offline)}>
                                            {(group.title &&
                                                <span>{group.title?.slice(0,1)}</span>
                                            )}
                                        </div>
                                    )}

                                    {group.title}

                                    {(window.rs_sistema_id == global.sistema?.manutencao && !showCards &&
                                        <span className="text-secondary ms-1">({items.length})</span>
                                    )}
                                </Title>

                                {(showCards &&
                                    (items.length > 0 ?                                    
                                        <SortableContext 
                                            id={group.id}
                                            items={items.map((item) => item.id_job_status)}
                                            strategy={verticalListSortingStrategy}
                                            disabled={job.type_phase === 'Operação' && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ? false : true}
                                        > 
                                            {items.map((card, i) => {
                                                return(
                                                    <SortableItem 
                                                        activeId={activeId}
                                                        key={card?.id_job_status}
                                                        index={i}
                                                        index_group={index}
                                                        index_job={index_job}
                                                        card={card}
                                                        group={group}
                                                        jobsCols={jobsCols}
                                                        jobs={jobs}
                                                        job={job}     
                                                        filters={filters}    
                                                        loja={filters?.loja}
                                                        usuario={filters?.usuario}                                                 
                                                        chamados={true}
                                                        draggable={job.type_phase === 'Operação' && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ? true : false}
                                                        separator={separator}
                                                        optionsModule={optionsModule}
                                                        iconAvaliacao={optionsAvaliacao}
                                                        tipoCalendario={filters?.tipoCalendario}
                                                        subTipoCalendario={filters?.subTipoCalendario}
                                                        troca_operador={troca_operador}
                                                        refreshCard={handleRefreshCard}
                                                        refreshCalendar={handleRefreshCalendar}
                                                        changeStatus={handleChangeStatus}
                                                        collapse={handleSetCollapse}
                                                        execution={executando}
                                                        callback={{
                                                            execution: handleCallbackExecution,
                                                            changeOperator: handleCallbackChangeOperator,
                                                            changeModule: handleCallbackModule
                                                        }}
                                                    />
                                                )
                                            })}
                                        </SortableContext>
                                    :
                                        (((conf_operador_visivel !== 0)) ? // VERIFICA SE É FILA DE ALGUM OPERADOR
                                            (job.type_phase === 'Operação' ?
                                                (job?.group.length > 1 ?
                                                    (group.title ?
                                                        <Card
                                                            empty={true}
                                                            title={'Operador livre'}  
                                                            separator={separator}
                                                        ></Card>
                                                    :'')
                                                :
                                                    <Card
                                                        empty={true}
                                                        title={'Nenhum chamado em fila'}  
                                                        separator={separator}
                                                    ></Card>
                                                )
                                            :
                                                <Card
                                                    empty={true}
                                                    title={'Nenhum chamado em fila'} 
                                                    separator={separator}
                                                ></Card>
                                            )
                                        :'')
                                    )
                                )}
                            </>
                        )
                    }
                }else{
                    // VERIFICA SE EXISTE CHAMADOS EM PÓS VENDA / AVALIAÇÃO
                    let avaliacao_aux = false;
                    jobs.map((item, i) => {
                        if(item.type_phase === 'Pós-venda'){
                            item?.group.map((item2, i) => {
                                if(item2.cards.length > 0){
                                    avaliacao_aux = true;
                                }
                            })
                        }
                    })

                    return (
                        <>
                            {(items.length > 0 ?
                                items.map((card, i) => {
                                    return(
                                        <CardJobs
                                            key={'calendario_' + card?.id_job_status}
                                            i={i}
                                            index_group={index}
                                            index_job={index_job}
                                            card={card}
                                            group={group}
                                            jobs={jobs}
                                            job={job}         
                                            loja={filters?.loja}
                                            usuario={filters?.usuario}                                                 
                                            chamados={true}
                                            optionsModule={optionsModule}
                                            optionsModuleUnfiltered={optionsModuleUnfiltered}
                                            iconAvaliacao={optionsAvaliacao}
                                            tipoCalendario={filters?.tipoCalendario}
                                            subTipoCalendario={filters?.subTipoCalendario}
                                            troca_operador={troca_operador}
                                            refreshCard={handleRefreshCard}
                                            refreshCalendar={handleRefreshCalendar}
                                            changeStatus={handleChangeStatus}
                                            separator={separator}
                                            collapse={handleSetCollapse}
                                            execution={executando}
                                            callback={{
                                                changeOperator: (e) => handleCallbackChangeOperatorAux(e, job, card),
                                                execution: handleCallbackExecution,
                                                receive: handleCallbackReceive,
                                                changeModule: handleCallbackModule
                                            }}
                                        />
                                    )
                                })
                            :
                                (((conf_operador_visivel !== 0)) ? // VERIFICA SE É FILA DE ALGUM OPERADOR
                                    (job.type_phase === 'Operação' ?
                                        (job?.group.length > 1 ?
                                            (group.title ?
                                                <Card
                                                    empty={true}
                                                    title={'Operador livre'}  
                                                    separator={separator}
                                                ></Card>
                                            :'')
                                        :
                                            <Card
                                                empty={true}
                                                title={'Nenhum chamado em fila'}  
                                                separator={separator}
                                            ></Card>
                                        )
                                    :
                                        <Card
                                            empty={true}
                                            title={'Nenhum chamado em fila'} 
                                            separator={separator}
                                        ></Card>
                                    )
                                :'')
                            )}

                            {(job?.type_phase === 'Início' && avaliacao_aux ? 
                                <>
                                    <div className={style.rate_txt}>
                                        <p>
                                            Sua <span>Avaliação</span> é muito importante para nós!<br />
                                            {(window.rs_id_grupo == 2 && window?.location?.origin?.includes('madnezz') ? <>Por favor, abra os detalhes do card para avaliar.</>:<>Por favor, avalie clicando nos botões do card:</>)}
                                        </p>

                                        {(window.rs_id_grupo != 2 || !window?.location?.origin?.includes('madnezz') ? 
                                            <div className={style.rate_icons}>
                                                <span>
                                                    <Icon type="check" animated /> Bom
                                                </span>

                                                <span>
                                                    <Icon type="ban" animated /> Médio
                                                </span>

                                                <span>
                                                    <Icon type="reprovar2" animated /> Ruim
                                                </span>
                                                
                                                <span>
                                                    <Icon type="reabrir" animated /> Reabrir
                                                </span>
                                            </div>
                                            :<></>
                                        )}
                                    </div>

                                    {jobs?.filter((elem) => elem.type_phase === 'Pós-venda').map((job, i) => {
                                        return (                
                                            job.group?.map((group, i) => {
                                                return(
                                                    group?.cards.map((card, i) => {
                                                        return(
                                                            <CardJobs
                                                                key={'calendario_' + card?.id_job_status}
                                                                i={i}
                                                                index_job={index_job}
                                                                card={card}
                                                                group={group}
                                                                jobs={jobs}
                                                                job={job}         
                                                                loja={filters?.loja}
                                                                usuario={filters?.usuario}                                                 
                                                                chamados={true}
                                                                optionsModule={optionsModule}
                                                                iconAvaliacao={optionsAvaliacao}
                                                                tipoCalendario={filters?.tipoCalendario}
                                                                subTipoCalendario={filters?.subTipoCalendario}
                                                                troca_operador={troca_operador}
                                                                refreshCard={handleRefreshCard}
                                                                refreshCalendar={handleRefreshCalendar}
                                                                changeStatus={handleChangeStatus}
                                                                separator={separator}
                                                                collapse={handleSetCollapse}
                                                                callback={{
                                                                    rate: handleCallbackRate,
                                                                    changeModule: handleCallbackModule
                                                                }}
                                                            />
                                                        )
                                                    }) 
                                                )
                                            })
                                        )
                                    })}
                                </>
                            :'')}

                            {(job?.type_phase === 'Início' && agendados.length > 0 ? 
                                <>
                                    <div className={style.separator}>
                                        <span>Agendados</span>
                                    </div>

                                    {agendados.map((card, i) => {                                                                            
                                        return(
                                            <CardJobs
                                                key={'calendario_' + card?.id_job_status}
                                                i={i}
                                                index_job={index_job}
                                                card={card}
                                                group={group}
                                                jobs={jobs}
                                                job={job}         
                                                loja={filters?.loja}
                                                usuario={filters?.usuario}                                                 
                                                chamados={true}
                                                optionsModule={optionsModule}
                                                iconAvaliacao={optionsAvaliacao}
                                                tipoCalendario={filters?.tipoCalendario}
                                                subTipoCalendario={filters?.subTipoCalendario}
                                                troca_operador={troca_operador}
                                                refreshCard={handleRefreshCard}
                                                refreshCalendar={handleRefreshCalendar}
                                                changeStatus={handleChangeStatus}
                                                separator={separator}
                                                collapse={handleSetCollapse}
                                                callback={{
                                                    changeOperator: (e) => handleCallbackChangeOperatorAux(e, job, card),
                                                    receive: handleCallbackReceive,
                                                    changeModule: handleCallbackModule
                                                }}
                                            />
                                        )
                                    })}
                                </>
                            :'')}

                            {/* ATALHO DO SISTEMA "PEDIDOS" PARA QUE OS USUÁRIOS CONCLUAM AS ÚLTIMAS PENDÊNCIAS ANTES DE MIGRAR DE FATO PARA O CHAMADOS */}
                            {(job?.type_phase === 'Início' && window?.location?.origin?.includes('madnezz') && permissaoPedidos && window.rs_sistema_id != global.sistema.manutencao_madnezz && conf_pedidos ?
                                <>
                                    <Title>Pedidos (Antigo sistema)</Title>

                                    <div href={window.host+'/systems/v3/pedido'} className="cursor-pointer" target="_blank" onClick={() => navigate('/sistemas/pedido')}>
                                        <div className={style.fale_conosco_button}>
                                            {(pedidos > 0 ?
                                                <div>
                                                    Você possui <b>{pedidos}</b> pedidos pendentes.
                                                    Clique aqui para visualizar. <Icon type="external" title={false} readonly />
                                                </div>
                                            :
                                                <div>
                                                    Você não possui pedidos pendentes.
                                                    Clique aqui para ver o histórico. <Icon type="external" title={false} readonly />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            :'')}
                        </>
                    )
                }                                
            })()}
        </div>
    )
}