import {useRef, useMemo, useEffect, useState} from 'react';
import Input from '../../input';

export default function Item({item, name, values, checkAllAux, required, callback, collapse, aux}){
    // REF
    const itemRef = useRef(null);
    const itemInView = useIsInViewport(itemRef);

    function useIsInViewport(ref) {
        const [inView, setInView] = useState(false);

        const observer = useMemo(() =>
            new IntersectionObserver(([entry]) =>
            setInView(entry.isIntersecting),
            ),
        [],);

        useEffect(() => {
            if(itemRef !== null && ref.current){
                observer.observe(ref.current);

                return () => {
                    observer.disconnect();
                };
            }
        }, [ref, observer]);

        return inView;
    }

    // DEFINE ID E NOME DO ITEM
    let id = '';
    let label = '';

    if(aux && aux?.id){
        id = item[aux?.id];
    }else{
        if(item?.value){
            id = item?.value;
        }else if(item?.id){
            id = item?.id;
        }
    }

    if(aux && aux?.nome){
        label = item[aux?.nome];
    }else{
        if(item?.label){
            label = item?.label;
        }else if(item?.nome){
            label = item?.nome;
        }
    }

    // CALLBACK PRO COMPONENTE PAI
    const handleCheck = (e) => {
        if(callback){
            callback(e);
        }
    }

    return(
        <div ref={itemRef} className="mb-2">
            <div style={{minHeight: 19.5}}>
                {(itemRef && itemInView ?
                    <Input
                        type="checkbox"
                        name={name}
                        id={name+'_'+id}
                        label={label}
                        obs={(item?.nome_emp ? '('+item.nome_emp+')' : '')}
                        value={id}
                        checked={(values?.includes(id) || values?.includes(id.toString()) ? true : checkAllAux)}
                        onChange={(e) => handleCheck(e)}
                        required={required}
                        className="p-0"
                    />
                :'')}
            </div>
        </div>
    )
}