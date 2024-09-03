import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../modal";
import ModalHeader from "../modal/modalHeader";
import ModalTitle from "../modal/modalHeader/modalTitle";
import ModalBody from "../modal/modalBody";
import Form from "../form";
import Input from "../form/input";
import Table from "../table";
import Td from "../table/tbody/td";
import Tr from "../table/tr";
import { cd, get_date } from "../../../_assets/js/global";
import Button from "../button";
import Th from "../table/thead/th";
import toast from "react-hot-toast";
import Thead from "../table/thead";
import Tbody from "../table/tbody";

export default function Ferias(props){
    const [modalAtualizacao, setModalAtualizacao] = useState(false);
    const [itens, setItens] = useState([]);
    const [programacaoInicio, setProgramacaoInicio] = useState([]);
    const [programacaoFim, setProgramacaoFim] = useState([]);
    const [formStatus, setFormStatus] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        // VERIFICA SE USUÁRIO O USUÁRIO TEM INFORMAÇÕES A ATUALIZAR REFERENTE A FÉRIAS
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/funcionarios/api/lista.php?do=get_ferias',
            params: {
                preenchimento_aux: true
            }
        }).then((response) => {                
            if(response?.data?.length > 0 && Array.isArray(response?.data)){
                setItens(response?.data);
                setModalAtualizacao(true);
            }
        });
    },[]);

    const handleSetProgramacaoInicio = (e,i) => {
        let newProgramacaoInicio = [...programacaoInicio,{id:i,data:e}];
        setProgramacaoInicio(newProgramacaoInicio);
    }

    const handleSetProgramacaoFim = (e,i) => {
        let newProgramacaoFim = [...programacaoFim,{id:i,data:e}];
        setProgramacaoFim(newProgramacaoFim);
    }

    const handleFormStatus = (e) => {
        setFormStatus(e);
        if(e == 'success'){
            setModalAtualizacao(false);
        }
    }

    const handleDepois = (e, i, adiado_qtd) => {
        e.preventDefault();
        let qtd_dias = window.prompt('Adiar programação de férias em quantos dias?' + ' Máximo 15 dias ' + (adiado_qtd > 0 ? ' (adiado '+adiado_qtd+' vez(es))' : ''))
        if(qtd_dias>0 && qtd_dias<=15){
            removeItem(i);

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/funcionarios/api/lista.php?do=set_adiar',
                data: {
                    id: i,
                    qtd_dias: qtd_dias
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {   
                if(i == -1){
                    setModalAtualizacao(false);
                }else{             
                    removeItem(i);
                }
                toast('Programação de férias adiada por enquanto');
            });
        }else{
            toast('Quantidade de dias inválida!');
        }
    }

    const handleSalvar = (e, id) => {
        e.preventDefault();
        let data_inicio = programacaoInicio?.find((elem) => elem?.id == id)?.data;
        let data_fim = programacaoFim?.find((elem) => elem?.id == id)?.data;

        if(data_inicio && data_fim){
            if(window.confirm('Deseja realmente salvar o agendamento de férias?')){
                axios({
                    method: 'post',
                    url: window.host_madnezz+'/systems/funcionarios/api/lista.php?do=set_ferias',
                    data: {
                        id: id,
                        programacao_inicio: get_date('date_sql',cd(data_inicio),'date'),
                        programacao_fim: get_date('date_sql',cd(data_fim),'date')
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {                
                    removeItem(id);
                    toast('Agendamento de férias salvo com sucesso!');
                });
            }
        }else{
            toast('Preencha as datas de início e fim da programação de férias!');
        }
    }

    const removeItem = (i) => {
        const newArray = itens.filter((item) => item?.id !== i);
        setItens(newArray); 

        const newArray1 = programacaoInicio.filter((item) => item?.id !== i);
        setProgramacaoInicio(newArray1); 

        const newArray2 = programacaoFim.filter((item) => item?.id !== i);
        setProgramacaoFim(newArray2); 

        if(itens?.length == 1){
            setModalAtualizacao(false);
        }
    }

    return(
        <Modal show={modalAtualizacao} lg={true}> 
            <ModalHeader>
                <ModalTitle close={false}>
                    Férias - {itens[0]?.nome_filial}
                </ModalTitle>
                    <Button
                        color={'red'}
                        onClick={(e) => handleDepois(e,-1,0)}
                    >
                        Adiar todos
                    </Button>
            </ModalHeader>
            <ModalBody>
                <Form
                    width={'100%'}
                    status={handleFormStatus}
                    data={{
                        data:data
                    }}
                    api={window.host_madnezz+'/systems/funcionarios/api/lista.php?do=set_ferias'}
                >
                    <Table> 
                        <Thead>        
                            <Tr>
                                <Th></Th>
                                <Th>Nome</Th>
                                <Th>Aquisitivo</Th>
                                <Th>Programação</Th>
                                <Th></Th>
                                <Th></Th>
                            </Tr>    
                        </Thead> 
                        <Tbody>
                            {(itens?.length > 0) && itens.map((item,i) => {
                                let data_inicio = programacaoInicio?.find((elem) => elem?.id == item?.id)?.data;
                                let data_fim = programacaoFim?.find((elem) => elem?.id == item?.id)?.data;
                                const aquisitivo = new Date(item?.aquisitivo_fim);
                                const now = new Date();

                                const getDateOffset = (months) => {
                                    const date = new Date(now);
                                    date.setMonth(date.getMonth() + months);
                                    return date;
                                };

                                const dateInFiveMonths = getDateOffset(5);
                                const dateThreeMonthsAgo = getDateOffset(-3);

                                let bg_color = (((aquisitivo <= dateInFiveMonths && aquisitivo >= now) || (aquisitivo.getMonth() + 1) == now.getMonth() && aquisitivo.getFullYear()==now.getFullYear()) ? 'lightblue' : (aquisitivo <= now ? (aquisitivo > dateThreeMonthsAgo ? 'lightyellow' : 'lightpink') : ''));

                                return (
                                    <Tr key={item.id} style={{backgroundColor:bg_color}}>
                                        <Td>{i+1}</Td>
                                        <Td>{item.nome}</Td>
                                        <Td>{(get_date('date',item.aquisitivo_inicio,'date_sql') + ' a ' + get_date('date',item.aquisitivo_fim,'date_sql'))}</Td>
                                        <span style={{display:'flex'}} >
                                            <Input 
                                                type="date" 
                                                label={'Início'}   
                                                value={data_inicio}
                                                onChange={(e) => {handleSetProgramacaoInicio(e,item.id)}}
                                                required={false}
                                                className={'m-2 mb-0 p-1'}
                                            />

                                            <Input 
                                                type="date" 
                                                label={'Fim'}   
                                                value={data_fim}
                                                onChange={(e) => {handleSetProgramacaoFim(e,item.id)}}
                                                required={false}
                                                className={'m-2 mb-0 p-1'}
                                            />
                                        </span>
                                            
                                        <Td>
                                            <Button
                                                className={global?.btn_color}
                                                onClick={(e) => handleSalvar(e,item.id)}
                                            >
                                                Salvar
                                            </Button>  
                                        </Td> 
                                        <Td>
                                            <Button
                                                color={'red'}
                                                onClick={(e) => handleDepois(e,item.id,item.adiar_qtd)}
                                            >
                                                Adiar
                                            </Button>
                                        </Td>            
                                    </Tr>
                                )}
                            )}
                        </Tbody>
                    </Table>                   
                </Form>
            </ModalBody>
        </Modal>
    )
}