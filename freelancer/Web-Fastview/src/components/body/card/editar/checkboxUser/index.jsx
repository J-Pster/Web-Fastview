import style from './checkboxUser.module.scss';
import { useState, useEffect, useRef, useMemo } from 'react';

import Input from "../../../form/input";
import SelectReact from '../../../select';

export default function CheckboxUser(props){
    // ESTADOS
    const [dateStart, setDateStart] = useState(props?.dateStart);
    const [horario, setHorario] = useState(props?.hourLimit);
    const [values, setValues] = useState([]);

    // REF
    const itemRef = useRef(null);
    const itemInView = useIsInViewport(itemRef);

    function useIsInViewport(ref) {
        const [inView, setInView] = useState(false);

        const observer = useMemo(() =>
            new IntersectionObserver(([entry]) =>
            setInView(entry.isIntersecting),
            ),
        [],);

        useEffect(() => {
            if(itemRef !== null && ref.current){
                observer.observe(ref.current);

                return () => {
                    observer.disconnect();
                };
            }
        }, [ref, observer]);

        return inView;
    }

    // AÇÃO AO REALIZAR ON CHANGE
    const handleOnChange = (e) => {
        let value = {
            id: props?.id,
            checked: e.target.checked,
            date: dateStart,
            hour: horario,
            label: props?.label,
            id_fase: props?.id_fase
        }
        if(props.onChange){
            props.onChange(value);
        }
        setValues(value);
    }

    // AÇÃO AO TROCAR DATA
    const handleSetDate = (e) => {
        let value = {
            id: props?.id,
            checked: props?.checked,
            date: e,
            hour: horario
        }
        if(props.onChangeDate){
            props.onChangeDate(value);
        }
        setDateStart(e);
    }

    // AÇÃO AO TROCAR HORÁRIO
    const handleSetHorario = (e) => {
        let value = {
            id: props?.id,
            checked: props?.checked,
            date: dateStart,
            hour: e.value
        }
        if(props.onChangeHour){
            props.onChangeHour(value);
        }
        setHorario(e.value);
    }

    // SETA VALOR DEFAULT CASO MUDE A DATA OU HORÁRIO NO COMPONENTE PAI
    useEffect(() => {        
        if(props.dateStart){
            setDateStart(props.dateStart);
        }
    },[props?.dateStart]);

    useEffect(() => {
        if(props.hourLimit){
            setHorario(props.hourLimit);
        }
    },[props?.hourLimit]);
    
    return(
        <div ref={itemRef}>
            <div className="d-flex align-items-center justify-content-between">
                {(itemRef && itemInView ?
                    <>
                        <div className={style.container_user} style={(props?.dateStart && props?.hourLimit && props?.date !== false ? {maxWidth: 'calc(100% - 130px)', overflow:'hidden'} : {})}>
                            <Input
                                type={props?.type}
                                name={props?.name}
                                fullwith={props?.fullwith}
                                id={props?.id}
                                value={props?.value}
                                label={props?.label + (props?.emp ? ' ('+props?.emp+')' : '')}
                                required={props?.required}
                                className={props?.className + ' ' + (props?.dateStart && props?.date !== false ? 'mb-2' : ' mb-2')}
                                checked={props?.checked}
                                onChange={handleOnChange}
                            />
                        </div>

                        {(props?.dateStart && props?.hourLimit && props?.date !== false ?
                            <div className={'d-flex align-items-center'} style={{gap:10,marginTop:'-6px',marginBottom:6}}>
                                <Input
                                    type="date"
                                    label=""
                                    name="date_start"
                                    required={false}
                                    value={dateStart}
                                    className={style.date}
                                    noWeekend={(props?.frequency ==  global.frequencia.diario ? true : false)}
                                    onChange={handleSetDate}
                                />
                                
                                <SelectReact
                                    type="text"
                                    label=""
                                    name="horario"
                                    required={false}
                                    options={props?.optionsHourLimit}
                                    value={horario}
                                    className={style.horario}
                                    onChange={handleSetHorario}
                                />
                            </div>
                        :'')}
                    </>
                :
                    <div>&nbsp;</div>
                )}
            </div>
        </div>
    )
}
