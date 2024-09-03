import { useState, useEffect } from 'react';

import Gerenciador from '../../../../../components/body/gerenciador';
import Table from '../../../../../components/body/table';
import Tbody from '../../../../../components/body/table/tbody';
import Tr from '../../../../../components/body/table/tr';
import Td from '../../../../../components/body/table/tbody/td';
import { toast } from 'react-hot-toast';
import Switch from '../../../../../components/body/switch';

export default function Acessos({id_grupo, emp, id_apl, callback, disabled, show, fases, chamados, visitas}){
    // ITENS DA TABLE
    var items;
    if(chamados){
        items = [
            {id: 'sem_acesso', nome: 'Sem Acesso'},
            {id: 'operador', nome: 'Operador'},
            {id: 'checker', nome: 'Checker'},
            {id: 'leitura', nome: 'Supervisor (Somente Leitura)'},
            {id: 'supervisor', nome: 'Supervisor'},
            {id: 'master', nome: 'Master'},
        ];
    }else if(fases){
        items = [
            {id: 'sem_acesso', nome: 'Sem Acesso'},
            {id: 'lojista', nome: 'Lojista'},
            {id: 'gerente', nome: 'Gerente'},
            {id: 'supervisor', nome: 'Supervisor'},
            {id: 'master', nome: 'Master'},
        ];
    }else{
        items = [];
    }

    // ATIVAR / DESATIVAR ITEM
    const handleSetItemActive = (id, ativo) => {
        toast('Acesso ' + (ativo ? 'liberado' : 'removido'));

        // axios({
        //     method: 'post',
        //     url: window.host_madnezz + "/systems/integration-react/api/registry.php?do=set_categoryActive",
        //     data: {
        //         id: id,
        //         active: ativo
        //     },
        //     headers: { "Content-Type": "multipart/form-data" }
        // }).then(() => {
        //     // handleReloadForm();
        // })
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
                id="acessos"
                title="Acesso"
                search={false}
                icon={false}
                switch={false}
                disabled={disabled}
            >
                <Table id="table_modulo">
                    <Tbody>
                        {(items.length > 0 ?
                            items.map((item, i) => {
                                return(
                                    <Tr key={'modulo_'+item.id}>
                                        <Td>
                                            {item.nome}
                                        </Td>

                                        <Td width={1} align="center">
                                            <Switch
                                                type="check"
                                                title={(item.ativo == 1 ? 'Desativar' : 'Ativar')}
                                                checked={(item.ativo == 1 ? true : false)}
                                                onChange={() => handleSetItemActive(item?.value, (item.ativo == 1 ? 0 : 1))}
                                                animated
                                            />
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
