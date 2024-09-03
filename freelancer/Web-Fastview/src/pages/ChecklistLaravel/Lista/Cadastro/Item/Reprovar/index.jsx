import { useState, useEffect } from "react";
import Icon from "../../../../../../components/body/icon";

export default function Reprovar({interaction, pergunta, resposta, status, motivo, callback}){
    // ESTADOS
    const [respostaAux, setRespostaAux] = useState(resposta);

    // DEFINE ÍCONE
    let icone_aux;
    let title_aux;
    let class_aux;

    if(status == 2){
        icone_aux = 'reprovar2';
        title_aux = 'Não conforme';
        class_aux = 'text-danger';
    }else if(status == 3){
        icone_aux = 'alert-circle';
        title_aux = 'Não se aplica';
        class_aux = 'text-warning';
    }

    // AÇÕES DA RESPOSTA
    const handleSetResposta = () => {
        setRespostaAux(status);
        
        if(callback){
            callback({   
                id: pergunta.id,
                resposta: status
            })
        }
    }

    // SEMPRE QUE SOFRER ALTERAÇÃO NA PROPS RESPOSTA ATUALIZA O ESTADO
    useEffect(() => {
        setRespostaAux(resposta);
    },[resposta]);

    return(
        <>
            <Icon
                size="lg"
                type={icone_aux}            
                title={title_aux}
                className={(respostaAux == status ? class_aux : (respostaAux && respostaAux != status ? 'text-secondary' : ''))}
                onClick={handleSetResposta}
                readonly={(interaction === false ? true : false)}
                animated
            />
        </>
    )
}
