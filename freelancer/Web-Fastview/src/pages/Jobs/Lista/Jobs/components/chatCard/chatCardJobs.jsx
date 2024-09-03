import "./style.css"

export default function CardChatJobs(props) {
    return (
        <div>
            <div className="job-lista-chat-card">
                <div className="job-lista-chat-user-title">
                <div >
                        {(
                            props.primary ?
                               
                                    <span className="text-color-blue">{props.nome} - {props.data1}</span>
                               
                                :
                                <span className="text-color-black">{props.nome} - {props.data1}</span>
                        )}
                    </div>
                    <div className="text-separation-div">
                        
                            <span className="text-color-gray">Última atualização: {props.data2}</span>
                    
                        {(
                            props.icon ?
                                props.icon
                                : <></>
                        )}
                    </div>
                </div>
                <div>
                    {props.children}
                </div>
            </div>
        </div>
    )
}