import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { cdh } from '../../../_assets/js/global';
import { GlobalContext } from '../../../context/Global';

import Modal from '../../../components/body/modal';
import ModalHeader from '../../../components/body/modal/modalHeader';
import ModalBody from '../../../components/body/modal/modalBody';
import ModalTitle from '../../../components/body/modal/modalHeader/modalTitle';
import SelectReact from '../../../components/body/select';
import Form from '../../../components/body/form';
import Button from '../../../components/body/button';
import Table from '../../../components/body/table';
import Thead from '../../../components/body/table/thead';
import Tr from '../../../components/body/table/tr';
import Th from '../../../components/body/table/thead/th';
import Tbody from '../../../components/body/table/tbody';
import style from './lista.module.scss';

import ChecklistItem from '../../../components/body/checklistItem';
import MotivoChecklist from './motivo';
import { toast } from 'react-hot-toast';
import Respostas from './respostas';
import Icon from '../../../components/body/icon';

export default function CadastroChecklist(props) {
    // CONTEXT
    // const { multipleModal } = useContext(GlobalContext);

    // ESTADOS DE OPTIONS (SELECT)
    const [optionsChecklist, setOptionsChecklist] = useState([]);
    const [optionsLoja, setOptionsLoja] = useState([]);
    const [optionsFuncionario, setOptionsFuncionario] = useState([]);
    const [optionsUnidade, setOptionsUnidade] = useState([])

    // ESTADOS DE OBJETOS
    const [checklistSection, setChecklistSection] = useState([]);
    // const [checklistItemCount, setChecklistItemCount] = useState(0);

    // ESTADOS DE VALORES
    const [relatorio, setRelatorio] = useState(props?.relatorio_id);
    const [checklist, setChecklist] = useState(props?.checklist_id);
    const [loja, setLoja] = useState(props?.loja_id);
    const [funcionario, setFuncionario] = useState(props?.funcionario_id);
    const [job, setjob] = useState(props?.job);
    const [motivo, setMotivo] = useState('');
    const [classificacao, setClassificacao] = useState('');
    const [perguntaID, setPerguntaID] = useState('');
    const [qtdFeito, setQtdFeito] = useState(0);
    const [ultimoFeito, setUltimoFeito] = useState('');
    const [anexo, setAnexo] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [supervisao, setSupervisao] = useState('');

    // ESTADOS DE CONDIÇÕES
    const [showSelectLoja, setShowSelectLoja] = useState(false);
    const [showSelectFuncionario, setShowSelectFuncionario] = useState(false);
    const [reload, setReload] = useState(true);
    const [checkButton, setCheckButton] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [validation, setValidation] = useState(false);
    const [validationTitle, setValidationTitle] = useState(false);
    const [showModalCadastro, setShowModalCadastro] = useState(props.show);
    const [showModalReprova, setShowModalReprova] = useState(false);
    const [showModalNaoSeAplica, setShowModalNaoSeAplica] = useState(false);
    const [sendChecklist, setSendChecklist] = useState(false);
    const [alert, setAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    //
    const [ultimoRespondido, setUltimoRespondido] = useState();

    //estados
    const [showModalRespostas, setShowModalRespostas] = useState(false);
    const [relatorioId, setRelatorioId] = useState('');
    const [checklistId, setChecklistId] = useState('');
    const [lojaId, setLojaId] = useState('');
    const [checklistStatus, setChecklistStatus] = useState('');
    const [respostaStatus, setRespostaStatus] = useState('');
    const [sistemaId, setSistemaId] = useState('');
    const [unidade, setUnidade] = useState(null);

    // VARIÁVEIS
    var checkValidation = false;
    var validation_title = '';

    // GETS
    useEffect(() => {
        if (props.show || props.integration) {
            // GET OPTIONS CHECKLIST
            if (optionsChecklist.length == 0) {
                axios({
                    method: 'get',
                    url: window.host + '/systems/'+global.sistema_url.checklist+'/api/novo.php?do=get_select_checklist',
                    params: {
                        filter_id_system: [23]
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        setOptionsChecklist(response.data)
                    }
                });
            }

            // GET OPTIONS LOJA
            // if (optionsLoja.length == 0) {
                axios({
                    method: 'get',
                    url: window.host + '/api/sql.php?do=select&component=loja&filial=true&np=true',
                    params: {
                        empreendimento_id: window.rs_id_emp,
                        filtro_unidade: unidade
                    }
                }).then((response) => {           
                    if (response.data.length > 0) {
                        setOptionsLoja(response.data)
                    }
                });
        //  }
        }
    }, [props.show, props.integration, unidade]);
    

    // GET FUNCIONÁRIOS
    useEffect(() => {
        if ((props.show || props.integration) && loja) {
            setOptionsFuncionario([]);
            axios({
                method: 'get',
                url:window.host + "/api/sql.php?do=select&component=funcionario_sqlsrv&np=true&filial=true&limit=false",
                params: {
                    loja_id: loja
                }
            }).then((response) => {
                if (response.data.length > 0) {
                    setOptionsFuncionario(response.data)
                }
            });
        }
    }, [loja, props.integration]);

    // GET INFO DO CHECKLIST
    function get_checklist(refresh) {
        if (reload && !refresh) {
            if (!checkButton) {
                setChecklistSection([]);
            }
        }

        // if(!reload){
        checkValidation = true;
        // }

        if (checklist && ((checkButton && !reload) || (!checkButton && reload) || refresh)) {
            setAlert(false);
            setShowAlert(false);

            axios({
                method: 'get',
                url: window.host + '/systems/'+global.sistema_url.checklist+'/api/novo.php?do=get_checklist',
                params: {
                    checklist_id: checklist,
                    loja_id: loja,
                    funcionario_id: funcionario,
                    job: job
                }
            }).then((response) => {
                if (response.data.secoes.length > 0) {
                    setShowSelectLoja(true);

                    if (response.data.secoes[0].checklist_tipo_id == 1) { // CASO O CHECKLIST SEJA DO TIPO 1 OCULTA O SELECT DE FUNCIONÁRIO
                        setShowSelectFuncionario(false);
                    } else if (response.data.secoes[0].checklist_tipo_id == 3) { // CASO O CHECKLIST SEJA DO TIPO 3 EXIBE O SELECT DE FUNCIONÁRIO
                        setShowSelectFuncionario(true);
                    }

                    if ((loja || funcionario) && (reload || refresh)) { // SÓ LISTA AS SEÇÕES E PERGUNTAS CASO TENHA LOJA E FUNCIONÁRIO (QUANDO CONFIGURADO) SELECIONADO
                        setChecklistSection(response.data.secoes);
                    }

                    // CHECANDO SE TODOS OS ITENS JÁ FORAM RESPONDIDOS    
                    var relatorio_id = '';
                    setUltimoRespondido(response.data.ultimo_respondido);
                    
                    response.data.secoes.map((secao) => {
                        secao.perguntas.map((pergunta) => {
                            relatorio_id = pergunta?.relatorio_id;

                            if (!pergunta.resposta) { // CASO ALGUM ITEM NÃO TENHA RESPOSTA A VALIDAÇÃO RETORNA COM FALSE
                                checkValidation = false;
                                validation_title = 'Sinalize todos os itens (Conforme, Não Conforme ou Não se aplica) antes de enviar';
                            } else {
                                if (secao.tipo_sistema == 'supervisao' || secao.tipo_sistema == 'antes_depois') { // CASO SEJA DO SISTEMA SUPERVISÃO
                                    if (!pergunta.resposta_supervisao) { // CASO ALGUM ITEM NÃO TENHA FOTO ANEXADA NO COMPONENTE DE SUPERVISÃO RETORNA A VALIDAÇÃO COM FALSE
                                        if (pergunta.resposta != 3) { // CASO A RESPOSTA SEJA DIFERENTE DE "NÃO SE APLICA"
                                            checkValidation = false;
                                            validation_title = 'Sinalize todos os itens (Conforme, Não Conforme ou Não se aplica) antes de enviar';
                                        }
                                    }
                                }

                                if (pergunta.mensagem_obrigatorio == 2) {
                                    if (pergunta.observacao == '') {
                                        checkValidation = false;
                                        validation_title = 'Preencha as perguntas com comentário obrigatório antes de enviar';
                                    }
                                }

                                if (pergunta.mensagem_obrigatorio == 3 && pergunta.resposta == 1) {
                                    if (pergunta.observacao == '') {
                                        checkValidation = false;
                                        validation_title = 'Preencha as perguntas com comentário obrigatório antes de enviar';
                                    }
                                }

                                if (pergunta.itens) {
                                    if(!Array.isArray(pergunta.itens)){
                                        if (pergunta.itens.split('|').includes('Quantidade')) {
                                            if (!pergunta.quantidade && pergunta.resposta != 3) {
                                                checkValidation = false;
                                                validation_title = 'Preencha a quantidade dos itens';
                                            }
                                        }
                                    }
                                }
                            }

                            setValidationTitle(validation_title);
                        })
                    })

                    setRelatorio(relatorio_id);

                    if (checkValidation) {
                        checkValidation = false;
                        setCheckButton(true);
                        setReload(true);
                        if (checklistSection.length > 0 && props?.submit?.enabled !== false && ((reload && !refresh) || (!reload && refresh) || (reload && refresh))) {
                            toast('Todos os itens foram respondidos, não esqueça de enviá-los no final do formulário.')
                        }
                        if (props?.submit?.interaction !== false) {
                            setValidation(true);
                        }
                    } else {
                        setValidation(false);
                    }
                }

                // VERIFICA QUANTIDADE FEITA HOJE E QUANTAS FORAM FEITAS
                if (response.data.dados.length > 0) {
                    setQtdFeito((response.data.dados[0].qtd_respondida ? response.data.dados[0].qtd_respondida : 0));
                    setUltimoFeito((response.data.dados[0].data_finalizacao ? cdh(response.data.dados[0].data_finalizacao) : ''));
                } else {
                    setQtdFeito(0);
                    setUltimoFeito('');
                }

                setSendChecklist(false);

                if (alertCheck) {
                    setAlert(true);
                }
            });
        }
    }
    useEffect(() => {
        get_checklist(false);
    }, [checklist, loja, funcionario, reload, sendChecklist]);

    useEffect(() => {
        if (checklistSection.length > 0) {
            setReload(false);
            setCheckButton(false);
        }
    }, [checklistSection, checkButton]);

    //GET UNIDADE
    function getUnit() {
        let obj_options = []
        axios.get(window.host + '/api/sql.php?do=select&component=loja_unidade',{
            params:{
                empreendimento_id: window.rs_id_emp
            }
        })
            .then((response) => {
                response.data.map(item => {
                    obj_options.push({ value: item.id, label: item.nome })
                })
                setOptionsUnidade(obj_options)
            })
    }

    useEffect(() => {
        getUnit()
    }, [checklist])

    // FUNÇÃO QUE SELECIONA CHECKLIST
    function handleSetChecklist(e) {
        setChecklist(e);
        setReload(true);
    }

    // VALIDAÇÃO DE PREENCHIMENTO
    const handleSetValidation = (e) => {
        // console.log('validation: ', e)
    }

    // EXIBE MODAL DE CADASTRO
    useEffect(() => {
        setShowModalCadastro(props.show);
    }, [props.show]);

    // FECHA MODAL DE CADASTRO
    const handleCloseModalCadastro = () => {
        props.onHide(false);
        setChecklist('');
        setChecklistSection([]);
        setLoja('');
        setFuncionario('');
        setjob('');
        setQtdFeito('');
        setUltimoFeito('');
        setShowSelectLoja(false);
        setShowSelectFuncionario(false);
    }

    // EXIBE MODAL DE REPROVAÇÃO
    const handleSetShowModalReprova = (pergunta, observacao, motivo, classificacao, supervisao) => {
        setPerguntaID(pergunta);
        setObservacao(observacao);
        setMotivo(motivo);
        setClassificacao(classificacao);
        setSupervisao(supervisao);
        setShowModalReprova(true);
        setShowModalCadastro(false);
    }

    // EXIBE MODAL DE REPROVAÇÃO
    const handleSetShowModalNaoSeAplica = (pergunta, observacao, motivo, classificacao, supervisao) => {
        setPerguntaID(pergunta);
        setObservacao(observacao);
        setMotivo(motivo);
        setClassificacao('');
        setSupervisao(supervisao);
        setShowModalNaoSeAplica(true);
        setShowModalCadastro(false);
    }

    // FECHA MODAL DE REPROVAÇÃO
    const handleCloseModalReprova = (e) => {
        setShowModalReprova(false);
        setShowModalCadastro(true);

        if (e) {
            get_checklist(true);
        }
    }

    // ABRE MODAL
    function handleShowRespostas(relatorio_id, checklist_id, checklist_status, resposta_status, loja_id, sistema_id) {
        setShowModalRespostas(true);
        setRelatorioId(relatorio_id);
        setChecklistId(checklist_id);
        setLojaId(loja_id);
        setChecklistStatus(checklist_status);
        setRespostaStatus(resposta_status);
        setSistemaId(sistema_id)
    }

    // FECHA MODAL RESPOSTAS
    const handleCloseModalRespostas = (e) => {
        setShowModalRespostas(e);
    }

    // FECHA MODAL DE NÃO SE APLICA
    const handleCloseModalNaoSeAplica = (e) => {
        setShowModalNaoSeAplica(false);
        setShowModalCadastro(true);

        if (e) {
            get_checklist(true);
        }
    }

    // CHECA ANEXOS PARA RFMOVER ALERT
    const handleSetAnexo = () => {
        alertCheck = false;
        setTimeout(() => {
            setAnexo(!anexo);
            setAlert(alertCheck);
            setShowAlert(alertCheck);
        }, 500);
    }

    // ENVIA CHECKLIST
    const handleSubmit = () => {
        if (alert) {
            setShowAlert(true);
            toast('Anexe um arquivo nas perguntas de anexo obrigatório');
        } else {
            setShowAlert(false);
            if (window.confirm('Tem certeza que deseja enviar o checklist? Não será mais possível editar')) {
                axios({
                    url: window.host + '/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist',
                    method: 'post',
                    data: {
                        relatorio_id: relatorio,
                        checklist_id: checklist,
                        loja_id: loja,
                        funcionario_id: funcionario,
                        job: job
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then((response) => {
                    toast('Checklist enviado com sucesso');
                    setSendChecklist(true);
                    setReload(true);
                    props.callback(response?.data);
                });
            }
        }
    }

    // CALLBACK AO RESPONDER ALGUM ITEM DO CHECKLIST
    const handleChecklistItemCallback = (e) => {
        setCheckButton(true);
        get_checklist(true);
        if (e == 1) { // SE A RESPOSTA POR "APROVADO", REMOVE O MOTIVO PREENCHIDO
            setMotivo('');
        }
    }

    var alertCheck = false;

    var form = <>

        {(props?.btn_respondido && ultimoRespondido?.relatorio_id &&
            <div
                className={style.last_answer}
                onClick={() =>
                    handleShowRespostas(ultimoRespondido.relatorio_id, ultimoRespondido.checklist_id, ultimoRespondido.status, "", "", 23)}
            >
                Ver último checklist respondido <Icon type="external" />
            </div>
        )}

        <Form
            api={false}
            className={style.checklist_cadastro}
        >
            {(optionsChecklist.length > 0 ?
                (!props.checklist_id ?
                    <SelectReact
                        label="Checklist"
                        name="checklist"
                        options={optionsChecklist}
                        value={checklist}
                        onChange={(e) => handleSetChecklist(e.value)}
                    />
                    :
                    ''
                )
                :
                // <Loader show={true} />
                ''
            )}

            {(showSelectLoja && !props.loja_id && window.rs_id_emp === 492 ?
                    // --> select apenas para o empreendimento carrefour
                    < SelectReact
                        label="Unidade"
                        name="unidade_carrefour"
                        options={optionsUnidade}
                        value={unidade}
                        onChange={(e) => setUnidade(e.value)}
                    />
                    : '')}

            {(showSelectLoja && !props.loja_id ?
                <SelectReact
                    label="Loja"
                    name="loja"
                    options={optionsLoja}
                    value={loja}
                    onChange={(e) => (setLoja(e.value), setReload(true))}
                />
                : '')}

            {(showSelectFuncionario && !props.funcionario_id && loja ?
                <SelectReact
                    label="Funcionário"
                    name="funcionario"
                    options={optionsFuncionario}
                    value={funcionario}
                    onChange={(e) => (setFuncionario(e.value), setReload(true))}
                />
                : '')}

            {(checklistSection.length > 0 && checklist && loja ?
                checklistSection.map((secao, iSecao) => {
                    alertCheck = false;

                    return (
                        <Table
                            key={'secao_' + iSecao}
                            id={'secao_' + iSecao}
                            text_limit={false}
                            fixed={false}
                            border={false}
                            overflow
                        >
                            {(!props?.job_dado_aux1 ?
                                <Thead>
                                    <Tr>
                                        <Th colspan="100%" wrap={true}>{secao.nome}</Th>
                                    </Tr>
                                </Thead>
                                : <></>)}
                            <Tbody>
                                {(
                                    secao.perguntas.length > 0 ?
                                        secao.perguntas.map((pergunta, iPergunta) => {
                                            if (pergunta.anexo_obrigatorio && !pergunta.anexo) {
                                                alertCheck = true;
                                            }

                                            let interaction = true;
                                            if (props?.interaction == 'custom') {
                                                if (pergunta?.checklist_status == 2) {
                                                    if (pergunta?.double_check == 1) {
                                                        interaction = false;
                                                    } else {
                                                        interaction = true;
                                                    }
                                                } else {
                                                    if (props?.job_status_supervisor !== 3) {
                                                        interaction = false;
                                                    }
                                                }
                                            } else {
                                                interaction = props?.interaction;
                                            }
                                            return (
                                                <ChecklistItem
                                                    key={'secao_' + iSecao + '_pergunta_' + iPergunta}
                                                    checklist_id={checklist}
                                                    alert={(showAlert && pergunta.anexo_obrigatorio ? true : false)}
                                                    anexo={handleSetAnexo}
                                                    integration={props?.integration}
                                                    sistema_id={secao?.sistema_id}
                                                    relatorio_id={relatorio}
                                                    loja_id={loja}
                                                    pergunta={pergunta}
                                                    reload={reload}
                                                    doubleCheck={pergunta?.double_check}
                                                    submit={submit}
                                                    sendChecklist={sendChecklist}
                                                    validation={handleSetValidation}
                                                    modalReprova={() => handleSetShowModalReprova(pergunta.id, pergunta.observacao, pergunta.resposta_motivo, pergunta.reprovado_classificacao, pergunta?.resposta_supervisao)}
                                                    modalNaoSeAplica={() => handleSetShowModalNaoSeAplica(pergunta.id, pergunta.observacao, pergunta.resposta_motivo, pergunta.reprovado_classificacao, pergunta?.resposta_supervisao)}
                                                    motivo={pergunta?.resposta_motivo}
                                                    classificacao={pergunta?.reprovado_classificacao}
                                                    interaction={interaction}
                                                    supervisao={pergunta?.resposta_supervisao}
                                                    camera={pergunta?.resposta == 3 ? false : true}
                                                    tipo_supervisao={secao?.tipo_sistema}
                                                    job={job}
                                                    job_title={props?.job_title}
                                                    job_dado_aux1={props?.job_dado_aux1}
                                                    callback={(e) => handleChecklistItemCallback(e)}
                                                />
                                            )
                                        })
                                        : '')}
                            </Tbody>
                        </Table>
                    )
                })
                : '')}

            {(checklistSection.length > 0 ?
                <p>
                    <b>Quantidade feita hoje:</b> {qtdFeito}<br />
                    <b>{(ultimoFeito ? 'Último feito hoje: ' : '')}</b>{ultimoFeito}
                </p>
                : '')}
        </Form>

        <div className="float-end">
            {(checklistSection.length > 0 && props?.submit?.enabled !== false ?
                <Button
                    disabled={(validation ? false : true)}
                    title={(validation ? '' : (props?.submit?.title ? props?.submit?.title : validationTitle))}
                    onClick={handleSubmit}
                >
                    Enviar
                </Button>
                : '')}
        </div>
        <div style={{ clear: 'both' }}></div>
    </>;

    return (
        <>
            {/* PREENCHIMENTO DO CHECKLIST */}
            {(props.integration ?
                form
                :
                <Modal show={showModalCadastro} onHide={handleCloseModalCadastro}>
                    <ModalHeader>
                        <ModalTitle>
                            Novo
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {form}
                    </ModalBody>
                </Modal>
            )}

            {/* MODAL MOTIVO AO REPROVAR ITEM DO CHECKLIST */}
            <MotivoChecklist
                show={showModalReprova}
                motivo={motivo}
                classificacao={classificacao}
                hide={handleCloseModalReprova}
                checklist_id={checklist}
                relatorio_id={relatorio}
                pergunta_id={perguntaID}
                loja_id={loja}
                funcionario_id={funcionario}
                observacao={observacao}
                job={job}
                resposta={2}
                supervisao={supervisao}
            />

            {/* MODAL MOTIVO AO NÃO SE APLICAR ITEM DO CHECKLIST */}
            <MotivoChecklist
                show={showModalNaoSeAplica}
                motivo={motivo}
                hide={handleCloseModalNaoSeAplica}
                checklist_id={checklist}
                relatorio_id={relatorio}
                pergunta_id={perguntaID}
                loja_id={loja}
                funcionario_id={funcionario}
                classificacao={false}
                observacao={observacao}
                job={job}
                resposta={3}
                supervisao={supervisao}
            />

            <Respostas
                show={showModalRespostas}
                onHide={handleCloseModalRespostas}
                relatorio_id={relatorioId}
                checklist_id={checklistId}
                loja_id={lojaId}
                checklist_status={checklistStatus}
                resposta_status={respostaStatus}
                sistema_id={sistemaId}
            />
        </>
    )
}