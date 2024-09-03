import Table from '../../../table';
import Tbody from '../../../table/tbody';
import Tr from '../../../table/tr';
import Td from '../../../table/tbody/td';
import Icon from '../../../icon';
import { useEffect, useState } from 'react';
import Thead from '../../../table/thead';
import Th from '../../../table/thead/th';

export default function Funcionarios({items, callback}){
    // ESTADOS
    const [itemValidation, setItemValidation] = useState([]);

    // VERIFICA VALIDAÇÃO DOS ITENS
    const handleItemValidation = (id, status) => {
        let validation_aux = itemValidation;

        if(validation_aux.filter((elem) => elem.id == id)){
            validation_aux = validation_aux.filter((elem) => elem.id != id);
        }

        validation_aux.push({
            id: id,
            ativo: status == 1 ? true : false
        });

        setItemValidation(validation_aux);
    }

    // VERIFICA VALIDAÇÃO GERAL
    useEffect(() => {
        if(callback){
            if(itemValidation.length == items?.length){
                callback({
                    validation: itemValidation
                });
            }else{
                callback({
                    validation: false
                });
            }
        }
    },[itemValidation]);

    return(
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        Funcionários ativos
                    </Th>
                    <Th align="center" width={1}>
                        Ações
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {(items.map((item, i) => {
                    return(
                        <Tr key={'funcionario_'+item?.id}>
                            <Td>{item?.nome}</Td>

                            <Td align="center" width={1}>
                                <Icon
                                    type="check"
                                    title="Manter habilitado"
                                    onClick={() => handleItemValidation(item?.id, '1')}
                                    className={itemValidation?.filter((elem) => elem.id == item?.id)[0]?.ativo === true ? 'text-success' : ''}
                                    animated
                                />

                                <Icon
                                    type="times"
                                    title="Desabilitar"
                                    onClick={() => handleItemValidation(item?.id, '0')}
                                    className={itemValidation?.filter((elem) => elem.id == item?.id)[0]?.ativo === false ? 'text-danger' : ''}
                                    animated
                                />
                            </Td>
                        </Tr>
                    )
                }))}
            </Tbody>
        </Table>
    )
}