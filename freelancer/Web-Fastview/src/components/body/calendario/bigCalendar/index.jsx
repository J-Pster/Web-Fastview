import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "./style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import Side from "./side";
import ColunaLegendas from "./colunaLegenda";
import Row from "../../row";
//import { Calendar } from "react-big-calendar";

export default function CalendarioBig({ initial_month, events, custon_event, side, escala, total, }) {
    const localizer = momentLocalizer(moment)
    const initialDate = moment().month(initial_month - 1).toDate();

    return (
        <div className="row-container-calendar">
            <div className="container-calendar">
                {(
                    escala == true ?
                        <ColunaLegendas />
                        :
                        <></>
                )}
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 800 }}
                    views={["month"]}
                    toolbar={false}
                    date={initialDate}
                    components={{
                        event: custon_event
                    }}
                />
                {(
                    side == true ?
                        <Side
                            week_one={'123'}
                            week_two={''}
                            week_three={''}
                            week_four={''}
                            week_five={''}
                            week_six={(initial_month == 12 || initial_month == 4 || initial_month == 7 ? " xyz " : false )}
                        />
                        :
                        <></>
                )}
            </div>
            {(
                side == true ?
                    <div className="fotter-calendario" >
                        <div className="fotter-calendario-div">
                            <span>Total: {total}</span>
                        </div>
                    </div>
                    :
                    <></>
            )}
        </div>
    )
}