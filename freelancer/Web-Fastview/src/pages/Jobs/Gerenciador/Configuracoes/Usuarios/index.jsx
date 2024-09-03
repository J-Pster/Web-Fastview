import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Input from '../../../../../components/body/form/input';
import InputContainer from '../../../../../components/body/form/inputcontainer';
import Table from '../../../../../components/body/table';
import Tbody from '../../../../../components/body/table/tbody';
import Tr from '../../../../../components/body/table/tr';
import Td from '../../../../../components/body/table/tbody/td';
import Form from '../../../../../components/body/form';
import Icon from '../../../../../components/body/icon';
import Button from '../../../../../components/body/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Switch from '../../../../../components/body/switch';
import { scrollToCol } from '../../../../../_assets/js/global';

export default function Usuarios({id_grupo, emp, id_apl, callback, disabled, show, fases, chamados, visitas}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(null);
    const [filter, setFilter] = useState(null);

    // SETA CATEGORIA ATIVA
    function handleSetActive(id){
        let id_aux = (active == id ? '' : id); // VERIFICA SE O ITEM ESTÁ ATIVO PARA MANDAR O ID VAZIO E RESETAR O FILTRO SE FOR O CASO

        setActive(id_aux);

        if(callback){
            callback({
                active: id_aux
            })
        }

        // SCROLL AUTOMÁTICO ATÉ A COLUNA DE ACESSOS
        scrollToCol('acessos');
    }

    // RESETA O FILTRO E O ITEM ATIVO CASO TROQUE O GRUPO
    useEffect(() => {
        setActive(null);
        setFilter(null);
    },[emp]);

    // CALLBACK DA API DA TABLE
    const handleSetItems = (e) => {
        setItems(e);
    }

    // DEFINE TIPO DE MÓDULO
    var table_aux;

    if(chamados){
        table_aux = 'moduleChamados';
    }else if(fases){
        table_aux = 'moduleFases';
    }

    return(
        <>
            <Gerenciador 
                id="usuarios"
                title="Usuários"
                search={
                    <Input
                        name="filter_usuario"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={false}
                switch={false}
                disabled={disabled}
            >
                <Table
                    id="table_modulo"
                    api={window.host+'/api/sql.php'}
                    params={{
                        do: 'select',
                        component: 'usuario',
                        filter_search: filter
                    }}
                    onLoad={handleSetItems}
                    search={filter}
                    reload={emp + (id_apl ? id_apl : '')}
                    text_limit={false}
                >
                    <Tbody>
                        {(items.length > 0 ?
                            items.map((item, i) => {
                                return(
                                    <Tr
                                        key={'modulo_'+item.id}
                                        cursor="pointer"
                                        active={(active === item.id ? true : false)}
                                    >
                                        <Td onClick={() => handleSetActive(item.id)}>
                                            {item.nome} 

                                            <span className="text-secondary ms-1">
                                                (Sem Acesso)
                                            </span>
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
