import "./style.scss"
import Icon from "../../icon";

export default function CardAtualizacoes(props) {

    var color = props.color
    switch (color) {
        case "red":
            color = "btn-doc-novos-atualizacao-red";
            break;
        case "blue":
            color = "btn-doc-novos-atualizacao-blue";
            break;
        default:
            color = "btn-doc-novos-atualizacao-blue"
    }

    var text_style = props.text_style
    switch (text_style) {
        case "disabled":
            text_style = "dash-obras-div-atualizacao-p-disabled";
            break;
        case "enabled":
            text_style = "dash-obras-div-atualizacao-p"
            break;
        default:
            text_style = "dash-obras-div-atualizacao-p"
    }
    var data_style = props.data_style
    switch (data_style) {
        case "disabled":
            data_style = "dash-obras-atualizacoes-span-data-disabled";
            break;
        case "enabled":
            data_style = "dash-obras-atualizacoes-span-data-enabled"
            break;
        default:
            data_style = "dash-obras-atualizacoes-span-data-enabled"
    }

    return (

        <div className="dash-obras-div-atualizacao">
            <div className={'dash-obras-div-p ' + (props?.empty ? 'w-100 d-block' : '')}>
                {(
                    props.icon ?
                        <Icon className="dash-obras-icon" type={props.icon} />
                        : ""
                )}
                <p className={text_style + (props?.empty ? ' mb-0 text-center' : '')}>
                    {props.paragraph}
                </p>
            </div>

            {(!props?.empty ?
                <div className="dash-obras-atualizacoes-span-div">
                    <span className={data_style}>
                        {props.data}
                    </span>
                </div>
            :'')}
        </div>
    )
}