import axios from "axios"
import { useEffect } from "react";
import { useState } from "react";
import Item from '../../components/Item';
import style from '../../style.module.scss';

export default function Subcategorias({id_apl, category, modulos, usuarios, callback, collapse, collapseAll}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collapseAux, setCollapseAux] = useState(collapse);

    // GET ITEMS
    function get_items(){
        setLoading(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                do: 'getTable',
                db_type: global.db_type,
                tables: [{
                    table: 'subcategory',
                    filter: {
                        id_emp: window.rs_id_emp,
                        id_ite: [category],
                        id_apl: (id_apl ? id_apl : window.rs_id_apl),
                        fluxo: true
                    }
                }]
            }
        }).then((response) => {
            if(response.data){
                setItems(response?.data?.data?.subcategory);
            }
            
            setLoading(false);            
        });
    }

    // CHAMADA INICIAL
    useEffect(() => {
        get_items();
    },[]);

    // CALLBACK DO ITEM
    const handleCallbackItem = (e) => {
        if(callback){
            callback(e);
        }

        if(e?.collapse){
            if(!e?.collapse?.id){
                setCollapseAux(!e?.collapse?.status);
            }
        }
    }

    // ATUALIZA ESTADO DO COLLAPSE SE RECEBER INFORMAÇÃO DO COMPONENTE PAI
    useEffect(() => {
        setCollapseAux(collapseAll);
    },[collapseAll]);

    // ATUALIZA ESTADO DO COLLAPSE SE RECEBER INFORMAÇÃO DO COMPONENTE PAI
    useEffect(() => {
        if(collapse?.id == category){
            setCollapseAux(collapse?.status);
        }
    },[collapse]);

    return(
        <div className={style.subcategory_container}>
            <div className={style.item_container}>
                {(loading ?                     
                    [...Array(collapseAux ? 1 : 2)].map((card, i) => (
                        <div key={'loading_'+i} className={style.item_box}>
                            <Item             
                                className={style.subcategory}                              
                                loading={true}
                            /> 
                        </div>
                    ))
                :
                    (collapseAux ? 
                        <div className={style.item_box}>
                            <Item
                                className={style.subcategory}
                                items={items}
                                collapsed={true}
                                callback={handleCallbackItem}
                            />    
                        </div>
                    :
                        items?.map((item, i) => {
                            return(
                                <div key={'item_'+item?.id} className={style.item_box}>
                                    <Item                                
                                        modulos={modulos}
                                        usuarios={usuarios}
                                        className={style.subcategory}
                                        items={items}
                                        item={item}
                                        collapseAll={collapseAll}
                                        callback={handleCallbackItem}
                                    /> 
                                </div>
                            )
                        })
                    )
                )}                

                {/* <Cadastro
                    title={'Subcategoria'}
                    align={'left'}
                /> */}
            </div>
        </div>
    )
}