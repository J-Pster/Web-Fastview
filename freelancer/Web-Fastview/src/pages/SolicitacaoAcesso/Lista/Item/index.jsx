import { useState } from 'react';
import style from './Item.module.scss';
import SelectReact from '../../../../components/body/select';

export default function Item({modulo, value, value_aux, callback, optional}){
    // VALOR INICIAL DO ESTADO DE VALUE
    const valueInitial = () => {
        if(value_aux){
            return value_aux;
        }else{
            if(value){
                return value;
            }else{
                if(optional){
                    return '0';
                }else{
                    return '1';
                }
            }
        }
    }

    // ESTADOS
    const [valueAux, setValueAux] = useState(valueInitial);

    // OPTIONS
    let options = []; // PERMISSAO
    let options_aux = []; // PERMISSAO_ID

    if(modulo?.permissao?.length > 0){
        modulo?.permissao.map((item, i) => {
            options.push({
                id: i.toString(), nome: item
            })
        });
    }

    if(modulo?.sistema_permissao?.length > 0){
        modulo?.sistema_permissao.map((item, i) => {
            options_aux.push({
                id: item?.id, nome: item?.nome
            })
        });
    }

    // ALTERA VALOR
    const handleSetValue = (e) => {
        setValueAux(e.value);

        let id_aux;
        if(modulo?.sistema_id){
            id_aux = modulo?.sistema_id;
        }else{
            id_aux = modulo?.id;
        }

        if(callback){
            callback({
                modulo: id_aux?.toString(),
                value: e.value,
                value_aux: (options_aux?.length > 0 ? options_aux[e.value].id : null)
            })
        }
    }

    // DEFINE NOME
    let nome_aux;
    if(modulo?.sistema_nome){
        nome_aux = modulo?.sistema_nome;
    }else{
        nome_aux = modulo?.nome;
    }

    return(        
        <div className={style.item}>
            <div>
                <p className="mb-0">{nome_aux}</p>
            </div>

            <div>
                <SelectReact 
                    options={options}
                    value={valueAux}
                    allowEmpty={false}
                    onChange={handleSetValue}
                />
            </div>
        </div>
    )
}