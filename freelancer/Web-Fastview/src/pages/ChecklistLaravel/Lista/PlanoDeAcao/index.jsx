import { useState } from "react";
import Editar from "../../../../components/body/card/editar";
import { cd } from "../../../../_assets/js/global";
import Icon from "../../../../components/body/icon";

export default function PlanoDeAcao({resposta,tituloPlano,lojaPlano,usuarioPlano,tipo,callback}){
    // ESTADOS
    const [show, setShow] = useState(false);

    // ABRE MODAL
    const handleSetShow = () => {
        setShow(true);

        if(callback){
            //callback();
        }
    }

    return(
        <>
            <Editar
                modalTitle={'Plano de Ação'}
                icon={false}
                show={show}
                plano={true}
                //onClose={(e) => setTimeout(() => {setPlano(false)},500)}
                frequency={global.frequencia.unico}
                dateStart={cd(new Date())}
                job={tituloPlano}
                category={{id: global.categoria.plano_de_acao}}
                subcategory={{id: global.subcategoria.checklist}}
                description={tipo + ` reprovado: `+tituloPlano+`<br />Reprovado em: `+cd(window.currentDate)+` às `+window.currentHour+`:`+window.currentMinutes+`<br />Reprovado por: `+window.rs_name_usr+`<br />`}
                id_lja={lojaPlano}
                id_usr={usuarioPlano}
            />

            <Icon
                type="user-check"
                animated
                title={(resposta == 2 ? 'Criar plano de ação' : 'Plano de ação disponível apenas para respostas negativas')}
                disabled={(resposta == 2 ? false : true)}
                onClick={handleSetShow}
            />
        </>
    )
}
