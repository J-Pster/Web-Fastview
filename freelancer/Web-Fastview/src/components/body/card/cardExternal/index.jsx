import style from './CardExternal.module.scss';
import { useState, useContext, useEffect } from 'react';
import { cdh } from '../../../../_assets/js/global';

import { GlobalContext } from "../../../../context/Global";
import Card from '..';
import axios from 'axios';
import Row from '../../row';
import Col from '../../col';
import Chat from '../../chat';
import Message from '../../chat/message';
import Loader from '../../loader';

export default function CardExternal(props){
    // CONTEXT
    const { handleSetOpenExternal, handleRefreshChat, openExternal, cardExternal, filterModule } = useContext(GlobalContext);

    // ESTADO
    const [card, setCard] = useState('');
    const [description, setDescription] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchMessages, setSearchMessages] = useState(true);
    
    useEffect(() => {
        setCard([]);
        setSearchMessages(true);

        // GET INFORMAÇÕES DO CARD
        if(props?.id){
            axios({
                method: 'get',
                url: window.host_madnezz+'/systems/integration-react/api/list.php',
                params: {
                    do: 'get_select',
                    id_job_status: props.id,
                    filter_id_module: filterModule ,
                    id_apl: window.rs_id_apl
                }
            }).then((response) => {
                setCard(response.data);
            });
        }
    },[props.id]);

    return(
        <div className={style.card__external + ' ' + (openExternal?style.active:'')} id="card_external">
            <div className={style.card}>
                {(card.length > 0 ?
                    <Row className={style.container}>
                        <Col lg={8}>
                            <div className={style.bg__white}>
                                {card[0].descricao}
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className={style.bg__white + ' ' + style.container__messages}>
                                <Chat
                                    api={window.host_madnezz+'/systems/integration-react/api/list.php?do=set_msg&filter_id_module='+filterModule}
                                    defaultMessage={{
                                        date: (card[0].cad_data ? cdh(card[0].cad_data) : ''),
                                        sender: card[0].cad_usr_nome,
                                        text: 'Abriu o '+(props.chamados ? 'chamado' : 'job'),
                                        align: (card[0].cad_usr == window.rs_id_usr ? 'right' : 'left')
                                    }}
                                >
                                    {(!searchMessages ?
                                        (messages.length > 0 ?
                                            messages.map((message) => {
                                                return(
                                                    <Message
                                                        key={message.id}
                                                        id={message.id}
                                                        sender={message.name_usr}
                                                        align={(message.id_usr == window.rs_id_usr ? 'right' : 'left')}
                                                        date={cdh(message.cad)}
                                                        text={message.mensagem}
                                                    />
                                                )
                                            })
                                        :
                                            ''
                                        )
                                    :
                                        <Loader show={true} />
                                    )}
                                </Chat>
                            </div>
                        </Col>
                    </Row>
                :'')}
            </div>
        </div>
    )
}