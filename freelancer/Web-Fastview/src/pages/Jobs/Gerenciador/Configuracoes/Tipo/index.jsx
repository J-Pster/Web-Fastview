import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Table from '../../../../../components/body/table';
import Tbody from '../../../../../components/body/table/tbody';
import Tr from '../../../../../components/body/table/tr';
import Td from '../../../../../components/body/table/tbody/td';
import { scrollToCol } from '../../../../../_assets/js/global';

export default function Tipo({id_grupo, emp, id_apl, callback, disabled, show, fases, chamados, visitas, comunicados}){
    // ESTADOS
    const [active, setActive] = useState(null);

    // SETA CATEGORIA ATIVA
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);

        if(callback){
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE USUÁRIOS
        scrollToCol('subcategoria');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
    },[emp]);

    // ITENS DA TABLE
    const items = [
        {value: 'categorias', label: 'Categorias'},        
        (chamados || fases ? {value: 'modulos', label: 'Módulos'} : {}), // SÓ EXIBE A OPÇÃO DE MÓDULOS CASO ESTEJA EM CHAMADOS OU FASES
        // {value: 'personalizacao', label: 'Personalização'}
    ];

    return(
        <>
            <Gerenciador 
                id="tipo"
                title="Tipo"
                search={false}
                icon={false}
                switch={false}
                disabled={disabled}
            >
                <Table id="table_tipos">
                    <Tbody>
                        {(items.length > 0 ?
                            items.map((item, i) => {
                                return(
                                    <Tr
                                        key={'tipo_'+item.value}
                                        cursor="pointer"
                                        active={(active === item.value ? true : false)}
                                    >
                                        <Td onClick={() => handleSetActive(item.value)}>
                                            {item.label}
                                        </Td>
                                    </Tr>
                                )
                            })
                        :
                            <></>
                        )}
                    </Tbody>
                </Table>
            </Gerenciador>
        </>
    )
}
