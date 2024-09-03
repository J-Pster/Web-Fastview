import { useState } from "react";
import style from './style.module.scss';
import Icon from '../icon';
import Tippy from "@tippyjs/react";
import Title from "../title";
import Table from "../table";
import Thead from "../table/thead";
import Tr from "../table/tr";
import Th from "../table/thead/th";
import Tbody from "../table/tbody";
import Td from "../table/tbody/td";
import Form from '../form';
import Input from "../form/input";
import Textarea from "../form/textarea";
import Button from "../button";

export default function Tutorial({url, title}){
    // ESTADOS
    const [active, setActive] = useState(false);
    const [novo, setNovo] = useState(null);    

    // LISTA FAKE PROVISÓRIA
    const [items, setItems] = useState([
        {type: 'layout', items: []},

        {type: 'front-end', items: [
            {id: 1, item_id: '', description: 'Tela de visualização do Job.', validated: {user: 'Henry Soligueti', date: '22/08/2024'}}
        ]},

        {type: 'back-end', items: [
            {id: 2, item_id: 'th_nome_emp_cad', description: 'API para inclusão no filtro de "Empreendimento".', validated: ''},
            {id: 3, item_id: 'th_descricao', description: 'API para inclusão no filtro de "Descrição".', validated: ''},
        ]},
    ]);

    // ESTADOS DO FORM
    const [idElemento, setIdElemento] = useState('');
    const [descricao, setDescricao] = useState('');

    // REMOVE O ESTADO DE ATIVO CASO O USUÁRIO PRESSIONE "ESC"
    document.addEventListener('keyup', (e) => {
        if(e?.key === 'Escape'){
            setActive(false);
        }
    });

    // EXIBE ITEM NA TELA
    const handleShowItem = (id) => {
        document.getElementById(id).classList.add('dev_alert');

        setActive(false);
    }

    // ATIVA MENU
    const handleSetActive = () => {
        setActive(true);
        
        // REMOVE CLASS DE TODOS OS ELEMENTOS QUE ESTÃO ATIVOS
        let elements = document.getElementsByClassName('dev_alert');

        for(let i=0; i < elements.length; i++){
            elements[i].classList.remove('dev_alert');
        }
    }

    // NOVO ITEM
    const handleSetNew = (type) => {
        setNovo(type);
        setIdElemento('');
        setDescricao('');
    }

    // SUBMIT FAKE
    const handleSubmit = () => {
        let items_aux = items?.filter((elem) => elem?.type === novo)[0];

        items_aux.items = [
            ...items_aux?.items,
            {id: 999, item_id: idElemento, description: descricao, validated: ''}
        ]

        setItems(items => [...items]);

        setNovo('');
        setIdElemento('');
        setDescricao('');
    }

    // FORM
    const form = <Form
                    border={false}
                    className="w-100"
                    styleAux={{background: 'transparent'}}
                >
                    <Input
                        type="text"
                        label="ID do Elemento"
                        required={false}
                        onChange={(e) => setIdElemento(e?.target?.value)}
                        value={idElemento}
                    />

                    <Textarea
                        type="text"
                        label="Descrição"
                        onChange={(e) => setDescricao(e?.target?.value)}
                        value={descricao}
                    />

                    <Button type="submit" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </Form>;

    if(window.rs_id_emp == 26){
        return(
            <>
                <div className={style.container + ' ' + (active ? style.active : '')}>
                    <div className={style.close} onClick={() => setActive(false)}></div>

                    <div className={style.sidebar}>
                        <Title className="mb-4">Pendente de Desenvolvimento:</Title>

                        {(items?.map((item, i) => {
                            let title_aux = item?.type?.slice(0,1).toUpperCase();
                            title_aux += item?.type?.slice(1);
                            
                            return(
                                <Table fixed={false} className="mb-4" text_limit={false} key={'item_'+i}>
                                    <Thead>
                                        <Tr>
                                            <Th>{title_aux}</Th>
                                            <Th width={1} align="center">
                                                <Icon
                                                    type="new"
                                                    title="Inserir novo item"
                                                    onClick={() => handleSetNew(item?.type)}
                                                />
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {(novo === item?.type &&
                                            <Tr>
                                                <Td colspan="100%" format={{input :false}}>
                                                    {form}
                                                </Td>
                                            </Tr>
                                        )}

                                        {(item?.items?.length === 0 ?
                                            <Tr>
                                                <Td>Nenhum item pendente</Td>
                                            </Tr>
                                        :
                                            item?.items?.map((subitem, i) => {
                                                return(
                                                    <Tr key={'subitem_'+i}>
                                                        <Td>
                                                            {i+1}. {subitem?.description}

                                                            {(item?.type === 'back-end' && subitem?.item_id &&
                                                                <Icon
                                                                    type="help"
                                                                    title="Onde encontrar?"
                                                                    animated
                                                                    className="ms-2"
                                                                    onClick={() => handleShowItem(subitem?.item_id)}
                                                                />
                                                            )}
                                                        </Td>

                                                        <Td width={1} align="center">
                                                            <Icon
                                                                type="check"
                                                                className={subitem?.validated ? 'text-success' : 'text-secondary'}
                                                                readonly={subitem?.validated ? true : false}
                                                                animated
                                                                title={subitem?.validated ? 'Feito por '+subitem?.validated?.user+' em '+subitem?.validated?.date : 'Marcar como feito'}
                                                            />
                                                        </Td>
                                                    </Tr>
                                                )
                                            })
                                        )}
                                    </Tbody>
                                </Table>
                            )
                        }))}                    
                    </div>
                </div>

                <Tippy content="Desenvolvimento pendente">
                    <div
                        className={style.icon}
                        onClick={handleSetActive}
                    >
                        
                        <Icon
                            type="code"
                            title={false}
                            readonly
                        />                        
                    </div>
                </Tippy>
            </>
        )
    }
}