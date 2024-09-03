import axios from "axios"
import { useEffect } from "react";
import { useState } from "react";
import Item from "../components/Item";
import style from '../style.module.scss';
import Subcategorias from "./Subcategorias";

export default function Categorias({id_apl, modulos, usuarios, callback, collapseAll}){
    // ESTADOS
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collapse, setCollapse] = useState(false);

    // GET ITEMS
    function get_items(){
        setLoading(true);

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                do: 'getTable',
                tables: [{
                    table: 'category',
                    filter: {
                        // ativo: (filterInactive ? [0,1] : [1]),
                        id_emp: window.rs_id_emp,
                        id_apl: (id_apl ? id_apl : window.rs_id_apl)
                    }
                }]
            }
        }).then((response) => {
            if(response.data){
                setItems(response?.data?.data?.category);
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
            setCollapse({
                id: e?.collapse?.id,
                status: e?.collapse?.status
            });
        }
    }

    // ATUALIZA ESTADO DO COLLAPSE SE RECEBER INFORMAÇÃO DO COMPONENTE PAI
    useEffect(() => {
        setCollapse(collapseAll);
    },[collapseAll]);    

    return(
        <div className={style.box_container}>
            {(loading ?                     
                [...Array(12)].map((card, i) => (
                    <div key={'loading_'+i} className={style.item_box + ' mb-4'}>
                        <Item                                       
                            loading={true}
                        /> 
                    </div>
                ))
            :
                items?.map((item, i) => {
                    return(
                        <div key={'item_'+item?.id} className={style.item_container}>
                            <div>
                                <Item                            
                                    item={item}
                                    className={style.category}
                                    collapseAll={collapseAll}
                                    callback={handleCallbackItem}
                                />
                                
                                {/* <Cadastro
                                    title={'Categoria'}
                                /> */}
                            </div>

                            <Subcategorias
                                category={item?.id}
                                modulos={modulos}
                                usuarios={usuarios}
                                collapseAll={collapseAll}
                                collapse={collapse}
                                callback={handleCallbackItem}
                            />
                        </div>
                    )
                })
            )}
        </div>
    )
}