import "./style.scss";
import "./style.css"

export default function ColunaLegendas({ handleLegenda }) {
    //SIGLAS E LEGENDAS
    const sigla = [
        { id: 0, sigla: "AF", legenda: "afastado" },
        { id: 1, sigla: "BH", legenda: "banco de horas" },
        { id: 2, sigla: "DSR", legenda: "descanso semanal remunerado" },
        { id: 3, sigla: "FE", legenda: "feriado" },
        { id: 4, sigla: "FER", legenda: "férias" },
        { id: 5, sigla: "FO", legenda: "folga" },
        { id: 6, sigla: "FF", legenda: "folga de feriado" }
    ];

    const turnos = [
        { id: 0, turno: "manhã", horario: "07:00 ás 13:00", cor: "dot--yellow" },
        { id: 1, turno: "tarde", horario: "13:00 ás 19:00", cor: "dot--orange" },
        { id: 2, turno: "noite", horario: "19:00 ás 02:00", cor: "dot--blue" }
    ];

    return (
        <div className="coluna-legenda" >
            <div className="rbc-month-header">
                <div className="rbc-header" >
                    <span onClick={handleLegenda}  >Legenda</span>
                </div>
            </div>
            <div className="rbc-month-row" >
                <div className="rbc-row-bg-side">
                    <div className="div-legendas">
                        {sigla.map((item, i) => {
                            return (
                                <div key={item.id}>
                                    <span className="span-bold">{item.sigla} -</span>
                                    <span className="span-normal"> {item.legenda}</span>
                                </div>
                            )
                        })}
                        <div className="div-turnos" >
                            <div className="span-turnos">Turnos</div>
                            {turnos.map((item, i) => {
                                return (
                                    <div className="turno-hora" key={item.id}>
                                        <div className={item.cor}></div>
                                        <span >{item.horario}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}