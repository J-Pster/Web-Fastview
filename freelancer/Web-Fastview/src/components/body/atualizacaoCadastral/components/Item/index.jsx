import { useEffect, useState } from "react";
import Input from "../../../form/input";

export default function Item({item, accept, icon, style, callback}){
    // ESTADOS
    const [valueAux, setValueAux] = useState(item?.type === 'image' && item?.value ? JSON.stringify([{id: item?.value, name: '', size: '', type: ''}]) : item?.value);

    // CALLBACK
    useEffect(() => {
        if(valueAux !== item?.value){
            if(callback){
                callback({
                    name: item?.name,
                    type: item?.type,
                    value: valueAux
                })
            }
        }
    },[valueAux]);

    // SETA VALOR ANEXO
    const handleSetValue = (e) => {
        setValueAux(e[0]);
    }

    return(
        <Input
            type={item?.type}
            label={item?.label}
            multiple={false}
            accept={accept}
            icon={icon}
            required={false}
            className={style}
            value={valueAux}
            onChange={(e) => (item?.type === 'image' ? undefined : setValueAux(e.target.value))}
            callback={handleSetValue}
        />
    )
}
