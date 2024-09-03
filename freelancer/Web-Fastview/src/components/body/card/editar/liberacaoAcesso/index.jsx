import { useEffect, useState } from 'react';
import Title from '../../../title';
import style from './style.module.scss';
import Item from './Item';
import Icon from '../../../icon';

export default function Liberacao({values, callback, approval, readonly}){
    // ESTADO INICIAL DOS ITENS
    const itemsInitial = () => {
        if(values){
            let items_aux = [];

            values?.map((item, i) => {     
                items_aux.push({
                    approved: item?.status,
                    id: item?.cracha_id,
                    validate: true,
                    values: [
                        {nome: item?.nome},
                        {tipo_documento: 'cpf'},
                        {documento: item?.cpf},
                        {inicio: item?.inicio},
                        {fim: item?.fim},
                        {loja: item?.loja_id},
                        {loja_nome: item?.loja},
                        {email: item?.email}
                    ]
                })
            })

            return items_aux;
        }else{
            return [{id: 1, values: [], validate: false, approved: '1'}];
        }
    }   

    // ESTADOS
    const [items, setItems] = useState(itemsInitial);

    // INSERIR NOVO
    const handleSetNew = () => {
        setItems(items => [...items, {id: (items[(items.length-1)]?.id + 1), values: [], validate: false, approved: '1'}]);
    }

    // CALLBACK DO ITEM
    const handleCallbackItem = (e) => {
        if(e?.remove){
            setItems(items?.filter((elem) => elem?.id !== e?.remove));
        }

        if(e?.validation){
            setItems(items => [...items.filter((elem) => elem.id !== e?.validation?.id), e?.validation]);
        }
    }

    // ENVIA CALLBACK PRO COMPONENTE PAI SEMPRE QUE OS ITENS SOFREREM ALTERAÇÃO
    useEffect(() => {
        if(callback){
            callback({
                values: items
            })
        }
    },[items]);

    // ENVIA CALLBACK PRO COMPONENTE PAI SEMPRE QUE SOFRE ALTERAÇÃO NO VALUES
    useEffect(() => {
        if(callback && values){
            callback({
                values: items
            })
        }
    },[values]);

    return(
        <div className={style.container}>
            <Title
                icon={
                    (!approval &&
                        <Icon
                            type="new"
                            title="Nova liberação"
                            onClick={handleSetNew}
                        />
                    )
                }
            >
                Liberação de Acessos
            </Title>

            {items?.sort((a, b) => a.id - b.id)?.map((item, i) => {
                return(
                    <Item
                        item={item}
                        key={'liberacao_'+item?.id}
                        remove={items.length > 1 ? true : false}
                        approval={approval}
                        readonly={readonly}
                        callback={handleCallbackItem}
                    />
                )
            })}
        </div>
    )
}