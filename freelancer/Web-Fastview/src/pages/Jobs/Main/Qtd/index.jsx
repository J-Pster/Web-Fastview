import { useEffect, useState } from 'react';
import style from './quantidade.module.scss';
import Icon from '../../../../components/body/icon';
import Tippy from '@tippyjs/react';
import { toast } from 'react-hot-toast';

export default function Quantidade({items, callback, disabled, check, operation, optionsModule}){
    // ESTADOS
    const [collapseFila, setCollapseFila] = useState(false);
    const [collapseOperacao, setCollapseOperacao] = useState(false);
    const [collapseCheck, setCollapseCheck] = useState(false);
    const [disabledAux, setDisabledAux] = useState(disabled);
    const [itemsAux, setItemsAux] = useState(items);

    var total_fila = 0;
    var total_operacao = 0;
    var total_check = 0;

    // CALCULA TOTAL DE CARDS EM FILA
    itemsAux.map((item, i) => { // FAZ UM MAP NOS MÓDULOS
        total_fila = Number(total_fila) + Number(item?.qtd_fila) + Number(item?.qtd_fila_recebido);
    });

    // CALCULA TOTAL DE CARDS EM OPERAÇÃO
    itemsAux.map((item, i) => { // FAZ UM MAP NOS MÓDULOS
        total_operacao = Number(total_operacao) + Number(item?.qtd_operacao);
    });

    // CALCULA TOTAL DE CARDS EM CHECK
    itemsAux.map((item, i) => { // FAZ UM MAP NOS MÓDULOS
        total_check = Number(total_check) + Number(item?.qtd_check) + Number(item?.qtd_check_fila);
    });

    // MANDA O MÓDULO CLICADO PRO COMPONENTE PAI
    function handleFilterModule(id){
        if(disabledAux){
            toast('Ainda carregando. Aguarde alguns instantes');
        }else{
            if(callback){
                callback(id);
                setCollapseFila(false);
                setCollapseOperacao(false);
                setCollapseCheck(false);
            }
        }        
    }

    // VERIFICA SE TEVE ALTERAÇÃO NO VALOR DA PROPS DISABLED
    useEffect(() => {
        setDisabledAux(disabled);
    },[disabled]);

    //AUXILIAR PARA FILTRAR OS MÓDULOS QUE O USUÁRIO TEM PERMISSÃO CASO NÃO SEJA MASTER
    useEffect(() => {
        if(window?.rs_permission_apl != 'master' && optionsModule){
            const items_Aux = items?.filter(obj2 => {
                return optionsModule?.some(obj1 => obj1?.id === obj2?.id_modulo);
            });
            
            setItemsAux(items_Aux);
        }   
    },[optionsModule, items]);

    return(
        <>
            <div>
                <span
                    className={style.qtd_cards_label}                
                    onClick={() => setCollapseFila(!collapseFila)}
                >
                    Fila ({total_fila})
                    <Icon type={(collapseFila ? 'chevron-up' : 'chevron-down')} disabled />
                </span>

                {(collapseFila ?
                    <div className={style.qtd_cards_items}>
                        {itemsAux.map((item, i) => {
                            return(
                                <div key={'qtd_fila_'+i} className={style.module + ' ' + (disabledAux ? style.disabled : '')} onClick={() => handleFilterModule(item?.id_modulo)}>
                                    {item?.modulo}                                     

                                    <span>
                                        ({item?.qtd_fila_recebido})
                                    </span>

                                    {(item?.qtd_fila > 0 ?
                                        <Tippy content="Novos">
                                            <span className={style.news}>({item?.qtd_fila})</span>
                                        </Tippy>
                                    :'')}
                                </div>
                            )
                        })}
                    </div>
                :'')}
            </div>

            {(operation ?
                <div>
                    <span
                        className={style.qtd_cards_label}                
                        onClick={() => setCollapseOperacao(!collapseOperacao)}
                    >
                        Operador ({total_operacao})
                        <Icon type={(collapseOperacao ? 'chevron-up' : 'chevron-down')} disabled />
                    </span>

                    {(collapseOperacao ?
                        <div className={style.qtd_cards_items}>
                            {itemsAux.map((item, i) => {
                                return(
                                    <div key={'qtd_operacao_'+i} className={style.module + ' ' + (disabledAux ? style.disabled : '')} onClick={() => handleFilterModule(item?.id_modulo)}>
                                        {item?.modulo}                                     

                                        <span>
                                            ({item?.qtd_operacao})
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    :'')}
                </div>
            :'')}

            {(check ?
                <div>
                    <span
                        className={style.qtd_cards_label}                
                        onClick={() => setCollapseCheck(!collapseCheck)}
                    >
                        Check ({total_check})
                        <Icon type={(collapseCheck ? 'chevron-up' : 'chevron-down')} disabled />
                    </span>

                    {(collapseCheck ?
                        <div className={style.qtd_cards_items}>
                            {itemsAux.map((item, i) => {
                                return(
                                    <div key={'qtd_check_'+i} className={style.module + ' ' + (disabledAux ? style.disabled : '')} onClick={() => handleFilterModule(item?.id_modulo)}>
                                        {item?.modulo}                                     

                                        <span>
                                            ({item?.qtd_check})
                                        </span>

                                        {(item?.qtd_check_fila > 0 ?
                                            <Tippy content="Fila geral">
                                                <span className={style.news}> ({item?.qtd_check_fila})</span>
                                            </Tippy>
                                        :'')}
                                    </div>
                                )
                            })}
                        </div>
                    :'')}
                </div>
            :'')}
        </>
    )
}
