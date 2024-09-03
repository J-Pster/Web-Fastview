import { useState } from "react";
import Icon from "../../../../components/body/icon";
import Table from "../../../../components/body/table";
import Tbody from "../../../../components/body/table/tbody";
import Td from "../../../../components/body/table/tbody/td";
import Thead from "../../../../components/body/table/thead";
import Th from "../../../../components/body/table/thead/th";
import Tr from "../../../../components/body/table/tr";
import style from './style.module.scss';
import { cd, get_date } from "../../../../_assets/js/global";

export default function Modulo({module, index, callback, selected, filters}){
    // ESTADOS
    const [order, setOrder] = useState('desc');
    const [items, setItems] = useState([]);

    // LISTA FAKE (ATÉ DESENVOLVER A API)
    // const items = [
    //     {id: 1, nome: 'SAV - Cacau Show', qtd: 44, qtd_anterior: 43},
    //     {id: 2, nome: 'AJS - Sabor de Casa', qtd: 38, qtd_anterior: 37},
    //     {id: 3, nome: 'PS1 - Loteria 403 Sul', qtd: 36, qtd_anterior: 37},
    //     {id: 4, nome: 'STO - Fabrica de Bolos', qtd: 36, qtd_anterior: 35},
    //     {id: 5, nome: 'VGX - Loundromat', qtd: 34, qtd_anterior: 35},
    //     {id: 6, nome: 'CPV - O Boticário', qtd: 30, qtd_anterior: 29},
    //     {id: 7, nome: 'RDM - Zumaz', qtd: 29, qtd_anterior: 28},
    //     {id: 8, nome: 'BHP - A Pastelândia', qtd: 29, qtd_anterior: 29},
    //     {id: 9, nome: 'SAV - Cacau Show', qtd: 28, qtd_anterior: 27},
    //     {id: 10, nome: 'AJS- Sabor de Casa', qtd: 28, qtd_anterior: 27},
    //     {id: 11, nome: 'PS1 - Loteria 403 Sul', qtd: 27, qtd_anterior: 26},
    //     {id: 12, nome: 'STO - Fabrica de Bolos', qtd: 25, qtd_anterior: 26},
    //     {id: 13, nome: 'VGX - Loundromat', qtd: 24, qtd_anterior: 25},
    //     {id: 14, nome: 'CPV - O Boticário', qtd: 22, qtd_anterior: 21},
    //     {id: 15, nome: 'RDM - Zumaz', qtd: 22, qtd_anterior: 23},
    //     {id: 16, nome: 'BHP - A Pastelândia', qtd: 20, qtd_anterior: 19},
    //     {id: 17, nome: 'AJS - Sabor de Casa', qtd: 18, qtd_anterior: 17},
    //     {id: 18, nome: 'PS1 - Loteria 403 Sul', qtd: 16, qtd_anterior: 17},
    //     {id: 19, nome: 'STO - Fabrica de Bolos', qtd: 15, qtd_anterior: 14},
    //     {id: 20, nome: 'STO - Fabrica de Bolos', qtd: 15, qtd_anterior: 16},
    //     {id: 21, nome: 'VGX - Loundromat', qtd: 14, qtd_anterior: 15}
    // ];    

    // SELECIONA LOJA
    const handleSelectStore = (id) => {
        if(callback){
            callback({
                store: id
            })
        }
    }

    // SETA ITENS VINDOS DO COMPONENTE TABLE
    const handleSetItems = (e) => {
        setItems(e);
    }

    console.log('filters: ',filters);

    return(
        <Table
            api={window.host_madnezz+'/systems/integration-react/api/request.php'}
            params={{
                db_type: window.db_type,
                do: 'getRanking',
                type: 'Job',
                mes: filters?.filter_date ? get_date('month', cd(filters?.filter_date)) : window.currentMonth,
                ano: filters?.filter_date ? get_date('year', cd(filters?.filter_date)) : window.currentYear,
                categoria: filters?.filter_category?.length > 0 ? filters?.filter_category : undefined,
                subcategoria: filters?.filter_subcategory?.length > 0 ? filters?.filter_subcategory : undefined,
                modulo: filters?.filter_module?.length > 0 ? filters?.filter_module : undefined,
                tipo: 'loja',
                modulo_id: module?.id,
                ordenacao: (order === 'asc' ? 1 : 2)
            }}
            bordered={true}
            onLoad={handleSetItems}
            reload={order + filters?.filter_date + filters?.filter_category + filters?.filter_subcategory + filters?.filter_module}
            className={style.table}
        >
            <Thead>
                <Tr>
                    <Th>
                        <div className={style.number}>{index+1}</div>

                        <span className="text-primary font-weight-bold">
                            {module?.nome}
                        </span>
                    </Th>
                    <Th
                        align="center"
                        width={1}
                        className="cursor-pointer"
                        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                    >
                        Chamados

                        <Icon
                            type={order === 'asc' ? 'sort-asc2' : 'sort-desc2'}
                            title={false}
                            readonly
                            className={'ms-2 ' + ' ' + (order === 'asc' ? 'text-danger' : 'text-primary')}
                        />
                    </Th>
                </Tr>
            </Thead>

            <Tbody>
                {items.map((item, i) => {
                    // DEFINE ÍCONE DE MAIOR/MENOR
                    let icon_aux, class_aux;

                    if(parseInt(item?.qtd) > parseInt(item?.qtd_mes_anterior)){
                        icon_aux = 'up';
                        class_aux = 'text-success';
                    }else if(parseInt(item?.qtd) < parseInt(item?.qtd_mes_anterior)){
                        icon_aux = 'down';
                        class_aux = 'text-danger';
                    }else{
                        icon_aux = 'minus';
                        class_aux = 'text-primary';
                    }

                    return(
                        <Tr
                            key={'ranking_loja'+module?.id+'_'+item?.loja_id}
                            onClick={() => handleSelectStore(item?.loja_id)}
                            className={'cursor-pointer ' + (selected == item?.loja_id ? style.selected : '')}
                        >
                            <Td>
                                <div className={style.number}>{i+1}</div>

                                <span className={selected == item?.loja_id ? 'text-primary font-weight-bold' : ''}>{item?.loja}</span>
                            </Td>

                            <Td align="center" width={1}>
                                <span className={selected == item?.loja_id ? 'text-primary font-weight-bold' : ''}>{item?.qtd}</span>

                                <Icon
                                    type={icon_aux}
                                    title={false}
                                    readonly
                                    className={style.icon + ' ' + class_aux}
                                />
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}