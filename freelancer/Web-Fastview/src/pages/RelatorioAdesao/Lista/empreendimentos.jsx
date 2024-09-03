import { useState, useEffect } from "react";
import axios from "axios";
import Td from "../../../components/body/table/tbody/td";
import Tr from "../../../components/body/table/tr";
import Loader from "../../../components/body/loader";
import Icon from "../../../components/body/icon";
import Lojas from "./supervisores";
import "./style.css"
import Supervisores from "./supervisores";

export default function Empreendimento({ itemsThead, setItemsThead, sistema_id, lojas_id, empreendimentos_id, regional_id, month, year, date, type, callback}) {

    //
    const [empreendimentos, setEmpreendimentos] = useState();
    const [loading, setLoading] = useState(true);
    const [showStore, setShowStore] = useState(null);

    // GET LOJAS
    function get_empreendimentos() {
        axios({
            method: 'get',
            url: window.backend + '/api/v1/adesao/relatorios/empreendimentos',
            params: {
                // grupo_id : window.rs_id_grupo,
                sistema_id: sistema_id,
                lojas: lojas_id,
                empreendimentos: empreendimentos_id,
                regional: regional_id,
                date: date,
                month: month,
                year: year,
            }
        }).then(({ data }) => {
            setEmpreendimentos(data?.data);
            setItemsThead(data?.meta?.items)
            setLoading(false);
        });
    }

    // CHAMA A FUNÇÃO DE GET LOJAS AO CLICAR PARA ABRIR
    useEffect(() => {
        get_empreendimentos();
        setLoading(true);
    }, [sistema_id, month, year, date, type]);

    // MANDA CALLBACK PRO COMPONENTE PAI
    const handleCallbackSupervisor = (e) => {
        if(callback){
            callback({
                empreendimento_id: showStore ? showStore : null,
                loja_id: e
            })
        }
    }

    // EXIBE/OCULTA LOJAS E MANDA INFORMAÇÃO PRO COMPONENTE PAI
    function handleShowStore(id){
        setShowStore(showStore === id ? null : id);

        if(callback){
            callback({
                empreendimento_id: null
            })
        }
    }

    return (
        <>
            {
                loading ?
                    <Tr>
                        <Td align="center" colspan="100%">
                            <Loader show={true} />
                        </Td>
                    </Tr>
                    :
                    empreendimentos?.length > 0 && itemsThead ?
                        empreendimentos?.map((item, i) => {
                            return (
                                <>
                                    <Tr
                                        disabled={showStore === null ? false : showStore === item.id ? false : true}
                                        id={'emp_'+item?.id}
                                    >
                                        {/* <Td>  - Grupo - </Td> */}
                                        <Td>
                                            <span
                                                className="d-flex align-items-center justify-content-between cursor-pointer"
                                                onClick={() => handleShowStore(item?.id)}
                                            >
                                                {item.nome}

                                                <Icon
                                                    type={showStore === item.id ? 'chevron-up' : 'chevron-down'}
                                                    title={false}
                                                    readonly={true}                                                    
                                                />
                                            </span>
                                        </Td>
                                        {itemsThead.map((th, index) => (
                                            <Td
                                                key={'empreendimento_'+index}
                                                align="center"
                                                width={150}
                                            >
                                                {item[th.index]}                                                
                                            </Td>
                                        ))}
                                    </Tr>
                                    {
                                        showStore === item.id ?
                                            <Supervisores
                                                itemsThead={itemsThead}
                                                sistema_id={sistema_id}
                                                lojas_id={lojas_id}
                                                empreendimentos_id={empreendimentos_id}
                                                regional_id={regional_id}
                                                date={date}
                                                month={month}
                                                year={year}
                                                emp_id={showStore}
                                                callback={handleCallbackSupervisor}
                                            />
                                            :
                                            <></>
                                    }
                                </>
                            )
                        })
                        : <></>
            }
        </>
    )
}