import { useState, useEffect, useRef } from "react";

import Modal from "../../../../components/body/modal";
import ModalBody from "../../../../components/body/modal/modalBody";
import ModalHeader from "../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle";
import Icon from "../../../../components/body/icon";
import SelectReact from "../../../../components/body/select";
import Form from "../../../../components/body/form";
import axios from "axios";
import Table from "../../../../components/body/table";
import Thead from "../../../../components/body/table/thead";
import Tr from "../../../../components/body/table/tr";
import Th from "../../../../components/body/table/thead/th";
import Tbody from "../../../../components/body/table/tbody";
import Item from "./Item";
import Button from "../../../../components/body/button";
import toast from "react-hot-toast";
import Loader from "../../../../components/body/loader";
import style from './cadastro.module.scss';
import Td from "../../../../components/body/table/tbody/td";

export default function Cadastro({integration, callback, checklist_id, loja_id, job, interaction, submit}){
    // ESTADOS
    const [show, setShow] = useState(false);
    const [checklist, setChecklist] = useState(checklist_id ? checklist_id : null);
    const [tipo, setTipo] = useState(null);
    const [tipoSistema, setTipoSistema] = useState(null);
    const [loja, setLoja] = useState(loja_id ? loja_id : (window.rs_id_lja && window.rs_id_lja > 0 ? window.rs_id_lja : null));
    const [funcionario, setFuncionario] = useState(null);
    const [secoes, setSecoes] = useState([]);
    const [secoesLoading, setSecoesLoading] = useState(false);
    const [reload, setReload] = useState(null);
    const [itemActive, setItemActive] = useState(null);
    const [respondidos, setRespondidos] = useState([]);
    const [validation, setValidation] = useState(false);
    const [relatorio, setRelatorio] = useState(null);
    const [buttonTitle, setButtonTitle] = useState(null);
    const [formStatus, setFormStatus] = useState('');
    const [disabledItems, setDisabledItems] = useState(false);

    // ABORT AXIOS
    const abort = useRef(new AbortController());

    // AÇÕES AO SELECIONAR CHECKLIST
    const handleSetChecklist = (e) => {
        setChecklist(e.value);
        setTipo(e?.tipo_id);
        setTipoSistema(e?.tipo_sistema);
        setFuncionario(null);
    }

    //CALLBACK AO CRIAR RELATÓRIO
    const handleSetRelatorio = (e) => {
        setDisabledItems(false);
        setRelatorio(e);
    }

    // CALLBACK DO ITEM
    const handleCallbackItem = (e) => {        
        if(e?.disabled){
            setDisabledItems(true);
        }else{
            setItemActive(e?.active);

            // ATUALIZA QUANTIDADE DE ITENS RESPONDIDOS
            if(e.resposta){

                let respondidos_aux = respondidos.filter((elem) => elem.pergunta != e.resposta.pergunta);

                respondidos_aux.push({
                    pergunta: e.resposta.pergunta,
                    resposta: e.resposta.resposta ?? respondidos.find((elem) => elem.pergunta === e.resposta.pergunta)?.resposta ?? null,
                    resposta_personalizada: e.resposta.resposta_personalizada ?? respondidos.find((elem) => elem.pergunta === e.resposta.pergunta)?.resposta_personalizada ?? null,
                    resposta_supervisao: e.resposta.resposta_supervisao,
                    anexo: e.resposta.anexo ?? respondidos.find((elem) => elem.pergunta === e.resposta.pergunta)?.anexo ?? null,
                    condicional: e.resposta.condicional,
                    validation: e.resposta.validation,
                    itens: e.resposta?.itens,
                    toast: e.resposta.toast
                });
                            
                setRespondidos(respondidos_aux);
            }
        }
    }

    // VALIDA SE TODOS OS ITENS FORAM RESPONDIDOS
    useEffect(() => {
        if(respondidos.length > 0 && interaction !== false){
            let validation_aux = true;
            let button_title_aux = '';
            let toast_aux = true;
            
            respondidos.map((item, i) => {
                if(item?.anexo?.obrigatorio){
                    if((item.condicional && respondidos.filter((elem) => elem.pergunta == item.condicional)[0].resposta == 1) || !item.condicional){
                        if(!item?.anexo?.arquivo){
                            validation_aux = false;
                            button_title_aux = 'Envie um arquivo nas perguntas de anexo obrigatório';
                        }
                    }
                }

                if(item.resposta && item.resposta.validation === false){
                    validation_aux = false;
                    button_title_aux = 'Preencha o motivo dos itens não conformes';
                }

                if((!item.resposta && !item?.resposta?.validation) || isNaN(item?.resposta)){
                    if((item.condicional && respondidos.filter((elem) => elem.pergunta == item.condicional)[0].resposta == 1) || !item.condicional){
                        if(item?.itens?.length > 0){
                            if(item?.resposta_personalizada){
                                let respostas_personalizadas = JSON.parse(item?.resposta_personalizada);
                                
                                item?.itens?.map((elem, i) => {
                                    if(elem?.obrigatorio){
                                        if(!respostas_personalizadas?.filter((e) => e?.item_id == elem?.id)[0]?.value){
                                            validation_aux = false;
                                            button_title_aux = 'Preencha todos os campos obrigatórios';
                                        }
                                    }
                                });
                            }else{
                                if(item?.itens?.filter((elem) => elem?.alias === 'Conformidade' || elem?.alias === 'Não conformidade' || elem?.alias === 'Não se aplica')?.length > 0){
                                    if(!item.resposta){
                                        validation_aux = false;
                                        button_title_aux = 'Sinalize todos os itens (Conforme, Não conforme, ou Não se aplica) antes de enviar';
                                    }
                                }
                            }
                        }else{
                            validation_aux = false;
                            button_title_aux = 'Sinalize todos os itens (Conforme, Não conforme, ou Não se aplica) antes de enviar';
                        }
                    }
                }

                // VERIFICA SE O CHECKLIST POSSUI PERGUNTAS DE SUPERVISÃO
                let has_supervisao = false;

                secoes?.map((secao, i) => {
                    if(secao?.tipo_sistema === 'supervisao'){
                        has_supervisao = true;
                    }
                });

                if(has_supervisao && !item?.resposta_supervisao){
                    validation_aux = false;
                    button_title_aux = 'Tire a foto baseada no modelo antes de enviar';
                }

                if(item?.toast === false){
                    toast_aux = false;
                }
            });

            setValidation(validation_aux);
            setButtonTitle(button_title_aux);

            if(validation_aux && toast_aux){
                toast('Todos os itens foram respondidos, não esqueça de enviá-los no final do formulário');
                setButtonTitle('');
            }
        }
    },[respondidos]);

    // CALLBACK DE STATUS DO FORM
    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // CALLBACK DE RESPOSTA DO FORM
    const handleFormResponse = (e) => {
        let response_aux = [422, 400, 404, 500];

        if(response_aux?.includes(e?.response?.status)){
            toast(e?.response?.data?.message);            
        }else{
            toast('Checklist respondido com sucesso!');
            handleCloseCadastro();
        }
    }

    const handleSetLoja = (val) => {
        setRelatorio(null)
        setLoja(val);
    }

    // MONTA FORMULÁRIO
    var form = <>    
        <Form
            method="put"
            api={window.backend + '/api/v1/checklists/relatorios/'+relatorio+'/save'}
            status={handleFormStatus}
            response={handleFormResponse}
            className={style.form}
        >
            {/* SELECT DE CHECKLIST */}
            {(!checklist_id &&
                <SelectReact
                    id="cadastro_checklist"
                    name="cadastro_checklist"
                    api={{
                        url: window.backend+'/api/v1/checklists',
                        params: {
                            status: [1],
                            no_paginated: 1
                        },
                        key_aux: ['data']
                    }}
                    label="Checklist"
                    required={false}
                    onChange={handleSetChecklist}
                    value={checklist}
                    pages={true}
                />
            )}

            {/* SELECT DA LOJA SÓ APARECE DEPOIS DE SELECIONAR UM CHECKLIST */}
            {(checklist && (!window.rs_id_lja || window.rs_id_lja == 0) && !loja_id &&
                <SelectReact
                    id="cadastro_loja"
                    name="cadastro_loja"
                    api={{
                        url: window.backend+ "/api/v1/utilities/filters/lojas",
                        params: {
                            sistema_id: window.rs_sistema_id,
                            no_paginated: 1
                        },
                        key_aux: ['data']
                    }}
                    label="Loja"
                    required={false}
                    onChange={(e) => handleSetLoja(e.value)}
                    value={loja}
                    
                />
            )}

            {/* SELECT DO FUNCIONÁRIO SÓ APARECE SE O CHECKLIST FOR DO TIPO 3 (FUNCIONÁRIO) E SE TIVER LOJA SELECIONADA  - API NOVA NÃO FUNCIONA*/}
            {(checklist && loja && tipo == 3 ?
                <SelectReact
                    id="cadastro_funcionario"
                    name="cadastro_funcionario"
                    api={{
                        url: window.backend + '/api/v1/utilities/filters/usuarios?do=select&component=funcionario',
                        params: {
                            filter_search_loja_id: [loja],
                            sistema_id: window.rs_sistema_id
                        },
                        key_aux: ['data']
                    }}
                    label="Funcionário"
                    required={false}
                    onChange={(e) => {
                        if(e.value != null)
                        setFuncionario(e.value)
                    }}
                    value={funcionario}
                    reload={loja+checklist}
                />
            :'')}

            {/* SEÇÕES E PERGUNTAS DO CHECKLIST */}
            {(secoesLoading ? 
                <Loader className="mt-4" />
            :
                (checklist && (loja || funcionario) ?
                    (secoes.length > 0 ? 
                        <>
                            {secoes.map((secao, i) => {
                                return(
                                    <Table
                                        key={'secao_'+i}
                                        id={'secao_'+i}
                                        text_limit={false}
                                        fixed={false}
                                        border={false}
                                        hasMore={false}
                                    >                        
                                        <Thead>
                                            <Tr>
                                                <Th colspan="100%" wrap={true}>{secao.nome}</Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                            {(secao.perguntas.map((pergunta, i) => {
                                                let condicional_aux = false;

                                                // VERIFICA SE A PERGUNTA CONDICIONAL FOI RESPONDIDA COM "SIM"
                                                if(pergunta.pergunta_id){
                                                    respondidos.filter((elem) => elem.pergunta == pergunta.pergunta_id).map((item, i) => {
                                                        if(item.resposta && item.resposta == 1){
                                                            condicional_aux = true;
                                                        }
                                                    });
                                                }

                                                if(!pergunta.pergunta_id || condicional_aux){
                                                    return(
                                                        <Item
                                                            key={'secao_'+pergunta.secao_id+'_pergunta_'+i}
                                                            checklist={checklist}
                                                            tipo_sistema={tipoSistema}
                                                            callbackRelatorio={handleSetRelatorio}
                                                            // alert={(showAlert && pergunta.anexo_obrigatorio ? true : false)}
                                                            // anexo={handleSetAnexo}
                                                            // integration={props?.integration}
                                                            // sistema_id={secao?.sistema_id}
                                                            disabled={disabledItems}
                                                            relatorio={relatorio}
                                                            loja={loja}
                                                            funcionario={funcionario}
                                                            pergunta={pergunta}
                                                            // reload={reload}
                                                            // doubleCheck={pergunta?.double_check}
                                                            // submit={submit}
                                                            // sendChecklist={sendChecklist}
                                                            // validation={handleSetValidation}
                                                            // modalReprova={() => handleSetShowModalReprova(pergunta.id, pergunta.observacao, pergunta.resposta_motivo, pergunta.reprovado_classificacao, pergunta?.resposta_supervisao)}
                                                            // modalNaoSeAplica={() => handleSetShowModalNaoSeAplica(pergunta.id, pergunta.observacao, pergunta.resposta_motivo, pergunta.reprovado_classificacao, pergunta?.resposta_supervisao)}
                                                            // motivo={pergunta?.resposta_motivo}
                                                            // classificacao={pergunta?.reprovado_classificacao}
                                                            interaction={interaction}
                                                            // supervisao={pergunta?.resposta_supervisao}
                                                            // camera={pergunta?.resposta == 3 ? false : true}
                                                            // tipo_supervisao={secao?.tipo_sistema}
                                                            job={job}
                                                            // job_title={props?.job_title}
                                                            // job_dado_aux1={props?.job_dado_aux1}
                                                            //disabled={itemActive && itemActive != pergunta.id}
                                                            callback={(e) => handleCallbackItem(e)}
                                                        />
                                                    )
                                                }
                                            }))}
                                        </Tbody>
                                    </Table>
                                )
                            })}

                            {(submit?.enabled !== false &&
                                <Button
                                    type="submit"
                                    status={formStatus}
                                    disabled={validation ? false : true}
                                    title={validation ? false : buttonTitle}
                                >
                                    Enviar
                                </Button>
                            )}
                        </>
                    :
                        <p className="mt-4 mb-0">Nenhum item cadastrado</p>
                    )
                :'')
            )}
        </Form>
    </>;

    // FECHA MODAL DE CADASTRO
    const handleCloseCadastro = () => {
        setShow(false);

        // CALLBACK PARA RECARREGAR LISTA
        if(callback){
            callback({
                reload: Math.random()
            })
        }

        // RESETA ESTADOS
        setChecklist(null);
        setLoja(null);
        setFuncionario(null);
        setSecoes([]);
        setItemActive(null);
        setReload(null);
        setRespondidos([]);
        setRelatorio(null);
    }

    useEffect(() => {
      // ZERA AS SEÇÕES
      setSecoes([]);
      setRespondidos([]);
      setItemActive(null);
      setRelatorio(null);
      setFuncionario(null);
    },[loja, checklist])

    // MONTA PERGUNTAS DO CHECKLIST
    useEffect(() => {

        // DEFINE A CONDIÇÃO PARA BUSCAR AS SEÇÕES
        let condition_aux;
        if(tipo == 3){ // SE FOR TIPO 3 (FUNCIONÁRIO) SE FAZ A BUSCA DEPOIS QUE SELECIONAR ALGUM FUNCIONÁRIO
            condition_aux = checklist && loja && funcionario;
        }else{ // CASO CONTRÁRIO SÓ PRECISA DE CHECKLIST E LOJA SELECIONADOS
            condition_aux = checklist && loja;
        }

        // SE ATENDER AS CONDIÇÕES, FAZ A BUSCA
        if(condition_aux){
            setSecoesLoading(true);

            abort.current.abort();
            abort.current = new AbortController();

            axios({
              method: "get",
              url: window.backend + "/api/v1/checklists/secoes",
              params: {
                checklist: checklist,
                loja,
                funcionario: funcionario ? funcionario : undefined,
                relatorio,
                job_id: job?.job_id,
                job_data: job?.data_job,
              },
              signal: abort.current.signal
            }).then(({data: {data}}) => {
              if (data) {
                setSecoes(data?.secoes);
                setRelatorio(data?.relatorio_id);
                setDisabledItems(false);

                let quantidade_respondida = [];

                data.secoes.map((secao, i) => {
                  if (secao?.perguntas.length > 0) {
                    secao.perguntas.map((item, i) => {
                      let validation_aux = false;

                      if (item.resposta == 1 || item.resposta == 8) {
                        validation_aux = true;
                      } else if (item.resposta == 2) {
                        if (
                          item.resposta_motivo &&
                          item.reprovado_classificacao
                        ) {
                          validation_aux = true;
                        }
                      } else if (item.resposta == 3 || item.resposta == 7) {
                        if (item.resposta_motivo) {
                          validation_aux = true;
                        }
                      }

                      quantidade_respondida.push({
                        pergunta: item.id,
                        resposta: parseInt(item.resposta),
                        resposta_personalizada: item?.resposta_options,
                        resposta_supervisao: item?.supervisao,
                        anexo: {
                          obrigatorio: item.anexo_obrigatorio,
                          arquivo: item?.anexo,
                        },
                        condicional: item.pergunta_id,
                        itens: item?.itens,
                        validation: validation_aux,
                      });
                    });
                  }
                });

                setRespondidos(quantidade_respondida);
              }

              setSecoesLoading(false);
            });

            // axios({
            //     method: 'post',
            //     url: window.backend+'/api/v1/checklists/relatorios',
            //     data: {
            //         checklist: checklist,
                    
                    
            //         // job_id: '',
            //     }
            // }).then((response) => {
            //     ;
                
                
            // });            
        }
    },[checklist, loja, funcionario]);

    if(integration){
        return form;
    }else{
        return(
            <>
                <Modal show={show} onHide={handleCloseCadastro}>
                    <ModalHeader>
                        <ModalTitle>
                            Novo
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {form}
                    </ModalBody>
                </Modal> 

                <Icon
                    type="new"
                    onClick={() => setShow(true)}
                />
            </>
        )
    }
}
