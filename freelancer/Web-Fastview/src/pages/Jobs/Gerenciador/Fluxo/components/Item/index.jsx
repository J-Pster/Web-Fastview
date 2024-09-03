import Tippy from '@tippyjs/react';
import style from './style.module.scss';
import Modulos from '../../Categorias/Modulos';
import IncluirModulo from "../IncluirModulo";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../../../../../components/body/icon';

export default function Item({items, item, className, modulos, usuarios, callback, loading, collapsed, collapseAll}){
    // ESTADOS
    const [steps, setSteps] = useState([]);
    const [removing, setRemoving] = useState(false);
    const [collapse, setCollapse] = useState(false);

    // NOVO MÓDULO
    const handleNovoModulo = () => {
        setSteps(steps => [...steps, {id: null, users: [], novo: true}]);
    }

    // REMOVE MÓDULO
    const handleModulo = (e) => {
        if(e?.remove){
            setRemoving(true);
            setSteps(steps.filter((elem) => elem.id != e?.remove));
            toast('Módulo removido do fluxo');
        }

        if(e?.include){
            let steps_aux = steps;

            steps_aux = steps_aux?.filter((elem) => elem.id !== null);
            steps_aux.push({id: e?.include, users: [], novo: false});

            setSteps(steps_aux);
            toast('Módulo adicionado ao fluxo');
        }

        if(e?.user){
            callback(e);
        }

        if(e?.includeUser){
            callback(e);
        }
    }

    // VERIFICA SE TEM MÓDULOS PARA MONTAR AS STEPS 
    useEffect(() => {
        if(modulos && item){
            let array_aux = [];

            if(item?.id_ite_aux){
                array_aux.push({
                    id: item?.id_ite_aux,
                    cols: modulos?.filter((elem) => elem?.id == item?.id_ite_aux)[0]?.colunas,
                    users: [],
                    novo: false
                });
            }

            setSteps(array_aux);
        }
    },[modulos]);

    // VERIFICA SE POSSUI MAIS MÓDULOS CONFIGURADOS PARA IR MONTANDO AS STEPS
    useEffect(() => {
        if(steps.length > 0 && modulos?.length > 0 && !removing){
            let fluxo = item?.fluxo?.split(',');
            let steps_aux = [];

            fluxo?.map((modulo, i) => {
                if(steps.filter((elem) => elem.id == modulo).length == 0){
                    steps_aux.push({
                        id: modulo,
                        cols: modulos?.filter((elem) => elem?.id == modulo)[0]?.colunas,
                        users: [],
                        novo: false
                    });
                }
            });

            if(steps_aux?.length > 0){
                setSteps(steps => [...steps, ...steps_aux]);
            }
        }
    },[steps]);

    // COLLAPSE
    const handleCollapse = () => {
        setCollapse(!collapse);

        if(callback){
            callback({
                collapse: {
                    status: !collapse,
                    id: item?.id
                }
            });
        }
    }

    // ATUALIZA ESTADO DO COLLAPSE
    useEffect(() => {
        setCollapse(collapseAll);
    },[collapseAll]);

    // ID DA SUBCATEGORIA
    let subcategoria_id = item;

    return(
        <>
            <div
                className={style.item + ' ' + className + ' ' + (loading ? style.loading : '')}
                onClick={handleCollapse}
            >
                <div className="d-flex align-items-center justify-content-between w-100">
                    <Tippy content={collapsed ? 'Subcategorias' : item?.nome}>
                        <div className={style.title}>
                            {collapsed ? 'Subcategorias' : item?.nome}
                        </div>
                    </Tippy>

                    {(!loading && !collapsed &&
                        <Icon
                            type={collapse ? 'chevron-down' : 'chevron-up'}
                            readonly
                            title={false}
                            className={style.icon}
                        />
                    )}

                    {(collapsed &&
                        <p className="mb-0">
                            ({items?.length})
                        </p>
                    )}
                </div>
            </div>

            {(modulos && steps.length > 0 ?
                steps.map((item, i) => {
                    let modulos_aux;
                    let usuarios_aux;

                    if(i == 0){
                        modulos_aux = modulos;
                    }else{
                        // modulos_aux = modulos?.filter((elem) => elem?.id != steps[steps.length - 2]?.id);
                        modulos_aux = modulos;
                    }

                    if(usuarios !== 'loading'){
                        if(usuarios?.filter((elem) => elem.id_modulo == item?.id).length > 0){
                            usuarios_aux = usuarios?.filter((elem) => elem.id_modulo == item?.id)[0]?.ids_nomes_usuarios_acesso_modulo;
                        }else{
                            usuarios_aux = [];
                        }
                    }

                    return(
                        <Modulos       
                            key={'item_'+item?.id}  
                            item={item}
                            users={item?.users}
                            subcategoria={subcategoria_id}
                            actions={{
                                new: item?.novo,
                                delete: i === (steps.length - 1) ? true : false
                            }}
                            modulos={modulos_aux}
                            usuarios={usuarios === 'loading' ? null : usuarios_aux}
                            usuarios_modulos={usuarios === 'loading' ? null : usuarios}
                            steps={steps}
                            collapse={collapse}
                            callback={handleModulo}
                        />
                    )
                })
            :'')}

            {(modulos &&
                <IncluirModulo
                    disabled={steps[steps.length - 1]?.id === null ? true : false}
                    callback={handleNovoModulo}
                />
            )}
        </>
    )
}