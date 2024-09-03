import { useEffect } from "react";
import "./style.css"
import Button from "../../button";

export default function Side(props) {

    let new_class = '';

    if (props.week_six) {
        new_class = "rbc-day-bg-side-6"
    } else {
        new_class = "rbc-day-bg-side"
    }


    // useEffect(()=>{
    // },[])


    return (
        <div className="container-side">
            <div className="rbc-month-header" >
                <div className="rbc-header" > <span>Valor Total</span> </div>
            </div>
            <div className="rbc-month-row-side" >
                <div className="rbc-row-bg-side" >
                    <div className={new_class}>
                        <div className="div-week-value">
                            {props.week_one}
                        </div>
                        {/* <Button>Enviar</Button> */}
                    </div>
                    <div className={new_class}>
                        <div className="div-week-value">
                            {props.week_two}
                        </div>
                        {/* <Button>Enviar</Button> */}
                    </div>
                    <div className={new_class}>
                        <div className="div-week-value">
                            {props.week_three}
                        </div>
                        {/* <Button>Enviar</Button> */}
                    </div>
                    <div className={new_class}>
                        <div className="div-week-value">
                            {props.week_four}
                        </div>
                        {/* <Button>Enviar</Button> */}
                    </div>
                    <div className={`${new_class} ${!props.week_six && ' last-day'}`}>
                        <div className="div-week-value">
                            {props.week_five}
                        </div>
                        {/* <Button>Enviar</Button> */}
                    </div>
                    {(
                        props.week_six &&
                        <div className={`${new_class} last-day`}>
                            <div className="div-week-value">
                                {props.week_six}
                            </div>
                            {/* <Button>Enviar</Button> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}