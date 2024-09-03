import React, { cloneElement, useContext, useState, useEffect } from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import CardJobs from '../../../Card';
import { JobsContext } from '../../../../../../context/Jobs';
import Icon from '../../../../../../components/body/icon';
import styleComponent from './style.module.scss';

export function SortableItem({card, index, index_group, index_job, group, draggable, callback, execution, jobs, jobsCols, job, filters, optionsModule, troca_operador, separator, refreshCard, refreshCalendar, changeStatus, collapse}) {
    // CONTEXT JOBS
    const { optionsAvaliacao, smallCard } = useContext(JobsContext);

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

    // ENVIA CALLBACK PARA O COMPONENTE PAI DO CARD QUE ESTÁ SENDO EXECUTADO
    const handleCallbackExecution = (e) => {
        if(callback?.execution){
            callback?.execution(e);
        }
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI SOBRE A TROCA DE OPERADOR
    const handleCallbackChangeOperator = (e) => {
        if(callback?.changeOperator){
            let event_aux = e;
            event_aux.job = job;
            event_aux.card = card;

            callback?.changeOperator(event_aux);
        }
    }

    // ENVIA CALLBACK PARA O COMPONENTE PAI SOBRE A TROCA DE MÓDULO
    const handleCallbackChangeModule = () => {
        if(callback?.changeModule){
            callback?.changeModule({
                status: 'success',
                index_group: index_group,
                index_job: index_job ? index_job : 0,
                id_job_status: card?.id_job_status,
                tipo_fase: card?.tipo_fase
            });
        }
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: card?.id_job_status,
        transition: {
            duration: 500,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 99 : 0,
        position: isDragging ? 'relative' : '',
        boxShadow: isDragging ? '0 4px 24px 0 rgba(0, 0, 0, 0.08)' : ''
    };  

    let card_aux = <CardJobs
                    key={'calendario_' + card?.id_job_status}
                    i={index}
                    index_group={index_group}
                    index_job={index_job}
                    card={card}
                    group={group}
                    jobsCols={jobsCols}
                    jobs={jobs}
                    job={job}     
                    draggable={draggable}    
                    dragging={isDragging}
                    loja={filters?.loja}
                    usuario={filters?.usuario}                                                 
                    chamados={true}
                    execution={execution}
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
                        execution: handleCallbackExecution,
                        changeOperator: handleCallbackChangeOperator,
                        changeModule: handleCallbackChangeModule,
                    }}
                />;
  
    return (
        <div id={card?.id_job_status} ref={setNodeRef} style={style}>
            <div className="position-relative">
                {(draggable ?
                    <div className={styleComponent.icon_drag + ' ' + (smallCard ? styleComponent.smallCard : '')} {...attributes} {...listeners} style={(isDragging ? {cursor:'grabbing'} : {})}>
                        <Icon type="draggable" title={false} />
                    </div>
                :'')}

                {card_aux}
            </div>
        </div>
    );
}