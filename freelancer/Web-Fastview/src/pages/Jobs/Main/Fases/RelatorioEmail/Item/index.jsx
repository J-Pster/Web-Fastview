import toast from "react-hot-toast";
import { cd, cdh, get_date } from "../../../../../../_assets/js/global";
import Icon from "../../../../../../components/body/icon";
import style from '../style.module.scss';
import { GlobalContext } from "../../../../../../context/Global";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Editar from "../../../../../../components/body/card/editar";
import Reabrir from "../../../../../../components/body/card/reabrir";
import Chat from "../../../../../../components/body/chat";
import Message from "../../../../../../components/body/chat/message";
import Loader from "../../../../../../components/body/loader";
import Tippy from "@tippyjs/react";
import Input from "../../../../../../components/body/form/input";
import TrocaOperador from "../../../../../../components/body/card/trocaOperador";
import TrocaStatus from "../../../../../../components/body/card/trocaStatus";

export default function Item({phases, phase, phase_index, itemJob, callback, disabled, children, chat_active, optionsStatus}){
    // CONTEXT GLOBAL
    const { filterModule } = useContext(GlobalContext);

    // REFS
    const itemRef = useRef(null);
    const itemInIvew = useIsInViewport(itemRef);

    // CHECA SE O ITEM ESTÁ VISÍVEL NA TELA
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

    // ESTADOS
    const [item, setItem] = useState(itemJob)
    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [showMessages, setShowMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const [anexo, setAnexo] = useState(null);
    const [anexos, setAnexos] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [show, setShow] = useState(true);
    const [data, setData] = useState(item?.data ? new Date(item?.data) : '');

    // VARIÁVEIS
    let tipo_fase_aux;
    if(phase?.type_phase){
        tipo_fase_aux = phase?.type_phase;
    }else if(phase?.tipo_fase){
        tipo_fase_aux = phase?.tipo_fase;
    }else{
        tipo_fase_aux = undefined;
    }

    // DEFINE CORES
    let class_aux = '';
    if(item?.status == 1){
        class_aux = 'text-primary';
    }else if(item?.status == 3){
        class_aux = 'text-warning';
    }

    if(item?.status == 0 && item?.data < get_date('datetime_sql', new Date())){
        class_aux = 'text-danger';
    }

    // TROCAR DE FASE
    function changePhase(ativ_desc, type) {
        if(callback){
            callback({
                changePhase: {
                    phase_index: phase_index,
                    id_job_status: item?.id_job_status,
                    type: type
                }
            })
        }

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'phase',
                    filter: {
                        mensagem: ativ_desc,
                        id_modulo: (item?.id_modulo ? item?.id_modulo : filterModule),
                        id_job_apl: item?.id_job_apl,
                        id_job_status: item?.id_job_status,
                        id_job: item?.id_job,
                        acao_fase: type,
                        tipo_fase: tipo_fase_aux,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)                        
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    // ARQUIVAR
    function handleArchive(status) {
        if(window.confirm('Deseja ' + (status === 1 ? 'desarquivar' : 'arquivar') + ' esse card?')){
            if(callback){
                callback({
                    archive: {
                        phase_index: phase_index,
                        id_job_status: item?.id_job_status,
                        id_job_parent: item?.id_job_parent,
                        status: status
                    }
                })
            }

            toast('Card '+(status == 1 ? 'desarquivado' : 'arquivado')+' com suesso');
            
            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                data: {
                    db_type: global.db_type,
                    tables: [{
                        table: 'activeStatus',
                        filter: {
                            id_modulo: (item?.id_modulo ? item?.id_modulo : filterModule),
                            mensagem: (status == 1 ? 'Desarquivou' : 'Arquivou')+' o card',
                            id_job: item?.id_job,
                            id_job_status: item?.id_job_status,
                            id_job_apl: item?.id_job_apl,
                            ativo: status,
                            mp: 0,
                            coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
                        }
                    }]
                },

                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }

    // FINALIZAR
    function changeStatus(status) {
        setLoading(true);

        if(callback){
            callback({
                status: {
                    phase_index: phase_index,
                    id_job_status: item?.id_job_status,
                    id_job_parent: item?.id_job_parent,
                    status: status
                }
            })
        }

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'status',
                    filter: {
                        mensagem: 'Finalizou o card',
                        id_modulo: (item?.id_modulo ? item?.id_modulo : filterModule),
                        id_job: item?.id_job,
                        id_job_status: item?.id_job_status,
                        id_job_apl: item?.id_job_apl,
                        status: status,
                        tipo_fase: tipo_fase_aux,
                        mp: 0,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined),
                        prioridade: item?.prioridade
                    }
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            if(callback){
                callback({
                    reload: item?.id_job_status
                });
            }

            toast('Card finalizado com sucesso');
            setLoading(false);
        });
    }

    // BUSCA MENSAGENS
    function getMessages(files=[], loading){
        if(loading){
            setLoadingMessages(true);
        }

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                    {table: 'message', filter: {id_job: item?.id_job ,id_job_status: item?.id_job_status}}
                ]
            }
        }).then((response) => {
            setMessages(response?.data?.data?.message);

            // SETA ÚLTIMA MENSAGEM NO CHAT
            if(response?.data?.data?.message?.length > 0){
                let messages_aux = response?.data?.data?.message.filter((elem) => elem.log_tipo === 'Mensagem');
                setLastMessage(messages_aux[messages_aux.length - 1]?.mensagem);
            }

            setTimeout(() => {
                var divChat = document.getElementById('chat_'+item?.id_job_status);
                if(divChat){     
                    divChat.scrollTop = divChat.scrollHeight;
                }
            },50);

            // CONCATENA ANEXOS
            if (response?.data?.data?.message) {
                var messageFiles = [];
                var anexos_aux;

                if(anexos.length > 0){
                    anexos_aux = anexos;
                }else{
                    anexos_aux = files;
                }

                response?.data?.data?.message.map((mensagem, i) => {
                    if (mensagem.anexo) {
                        if(mensagem?.anexo.includes('{')){ // MODELO NOVO DE UPLOAD (TODAS AS INFORMAÇÕES DO ARQUIVO)
                            JSON.parse(mensagem?.anexo).map((item, i) => {
                                if (!files.includes(item?.id)) {
                                    anexos_aux.push(item);
                                }
                            });
                        }else{ // MODELO ANTIGO DE UPLOAD (SOMENTE ID)
                            mensagem?.anexo.split(',').map((item, i) => {
                                if (!files.includes(item)) {
                                    anexos_aux.push(item);
                                }
                            });
                        }
                    }
                });

                if (anexos_aux.length > 0) {
                    if (files.length > 0 || anexos.length > 0) {
                        (anexos.length > 0 ? anexos : files).map((anexo, i) => {
                            const itemExists = messageFiles.some(item => item?.id === anexo.id);
                            if (!itemExists) {
                                messageFiles.push(anexo);
                            }
                        });
                    }

                    setAnexos(messageFiles);
                }
            }

            setLoadingMessages(false);
        });
    }

    // EXIBE MENSAGENS
    const handleShowMessages = () => {
        if(showMessages){
            setShowMessages(false);

            if(callback){
                callback({
                    chatActive: false
                })
            }
        }else{
            setTimeout(() => {
                setShowMessages(true);
            },400); // TEMPO PARA O SCROLL AUTOMÁTICO DO COMPONENTE PAI TERMINAR

            if(callback){
                callback({
                    chatActive: {
                        id_job_status: item?.id_job_status,
                        id_job: item?.id_job,
                        id_job_parent: item?.id_job_parent
                    }
                })
            }

            getMessages(undefined, true);            
        }
    }

    // CALLBACK DE EDIÇÃO
    const handleReload = (e) => {        
        if(callback){
            callback({
                reload: e
            })
        }
    }

    // CALLBACK DO CHAT
    const handleCallbackChat = (e) => {
        if(e?.submit){
            getMessages(undefined, false);
        }
    }

    // CALLBACK DO ITEM FILHO
    const handleCallbackChildren = (e) => {
        if(callback){
            callback(e);
        }
    }

    // CALLBACK DO BOTÃO DE REABRIR
    const handleCallbackReabrir = (e) => {
        if(callback){
            if(e?.submit){
                callback({
                    reload: e?.submit
                });

                callback({
                    reopen: {
                        phase_index: phase_index,
                        id_job_status: item?.id_job_status,
                        id_job_parent: item?.id_job_parent,
                        status: status
                    }
                })
            }
        }
    }

    // FUNÇÃO PARA ADIAR
    function handleSetDate(e, ativ_desc, date, date_old) {
        setData(e);
        toast('Card adiado com sucesso');

        axios({
            method: 'post',
            url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job&do=setTable&filter_id_module=" + filterModule,
            data: {
                db_type: global.db_type,
                tables: [{
                    table: 'status',
                    filter: {
                        id_job: item?.id_job,
                        id_job_status: item?.id_job_status,
                        status: 4,
                        mensagem: ativ_desc,
                        data: get_date('date_sql', date.toString(), 'new_date'),
                        data_old: (date_old ? date_old.slice(0,10) : undefined),
                        mp: 0,
                        coordenadas: (global.allowLocation ? (global.lat2+','+global.lon2) : undefined)
                    }    
                }]
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(() => {
            getMessages(undefined, false);
        });
    }

    /** LOAD MENSAGEM LOGIC */

    const [loadingMsg, setLoadingMsg] = useState(false)
    const timerRef = useRef(null)
    const abortMessage = useRef(new AbortController());

    function handleLoadFullMessage(jobLogId) {
        setLoadingMsg(true);
        axios.get(window.host_madnezz+`/systems/integration-react/api/request.php`,
            {
                params: {
                    db_type: 'sql_server',
                    type : 'Job',
                    do : 'getLastMsg',
                    jobLogId
                },
                headers: {
                  Accept: 'application/json',
                },
                signal: abortMessage.current.signal
            }
        ).then(({data}) => {
          if(data?.data?.Mensagem)
          {
            setItem(prev => ({...prev, mensagem_ult: data?.data?.Mensagem}))
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingMsg(false));
    }

  const onMessageBoxFocus = () => {
    if(item?.mensagem_ult?.length === 255 && item?.last_msg_id)
      {
        timerRef.current = setTimeout(() => handleLoadFullMessage(item?.last_msg_id), 1000);
      }
  } 
  
  const onMessageBoxBlur = () => {

    if(timerRef.current !== null)
    {
      abortMessage.current.abort();
      clearTimeout(timerRef.current);
      abortMessage.current = new AbortController()
    }
  }

    useEffect(() => {
      if(itemInIvew)onMessageBoxFocus();
      else onMessageBoxBlur();
      
    }, [itemInIvew])

    /** END LOAD MENSAGEM */

    if(show){
        return (
          <div
            ref={itemRef}
            key={"parent_" + item?.id_job_status}
            id={
              "item_" +
              (item?.id_job_parent ? item?.id_job_status : item?.id_job)
            }
            className={
              style.parent +
              " " +
              (disabled ? style.disabled : "") +
              " " +
              (children ? style.children : "")
            }
          >
            <div className={style.parent_title + " " + class_aux}>
              <div className={style.info}>
                {item?.nome_cliente ? item?.nome_cliente + " - " : ""}
                {item?.titulo}{" "}
                {item?.status == 0 &&
                item?.data < get_date("datetime_sql", new Date())
                  ? " - Atrasado"
                  : ""}
              </div>

              {itemInIvew ? (
                <div className={style.actions}>
                  <Icon
                    type={"minus"}
                    title={"Minimizar"}
                    className={"text-initial"}
                    onClick={() => setShow(false)}
                  />

                  <Icon
                    type={"view"}
                    title={
                      showMessages ? "Ocultar histórico" : "Exibir histórico"
                    }
                    active={showMessages ? true : false}
                    animated
                    onClick={handleShowMessages}
                  />

                  {phase_index > 0 ? (
                    <Icon
                      type="prev-up"
                      title="Voltar fase"
                      animated
                      onClick={() => changePhase("Voltou a fase", "prev")}
                    />
                  ) : (
                    ""
                  )}

                  {phase_index < phases?.length - 1 ? (
                    <Icon
                      type="next-down"
                      title="Avançar fase"
                      animated
                      onClick={() => changePhase("Avançou a fase", "next")}
                    />
                  ) : (
                    ""
                  )}

                  {window.rs_permission_apl === "master" ? (
                    <Icon
                      type={
                        item?.ativo_job_status == 2 ? "unarchive" : "archive"
                      }
                      title={
                        item?.ativo_job_status == 2 ? "Desarquivar" : "Arquivar"
                      }
                      onClick={() =>
                        handleArchive(item?.ativo_job_status == 2 ? 1 : 2)
                      }
                      animated
                    />
                  ) : (
                    ""
                  )}

                  {(item?.status == 1 || item?.status == 3) &&
                  window.rs_permission_apl === "master" ? (
                    item?.desabilitar?.split(",").includes("9") ? (
                      <></>
                    ) : (
                      <Reabrir
                        id_job={item?.id_job}
                        id_job_status={item?.id_job_status}
                        card={item}
                        message_required={false}
                        // message={message}
                        // anexo={anexo}
                        callback={handleCallbackReabrir}
                      />
                    )
                  ) : (
                    ""
                  )}

                  {(item?.status == 0 || item?.status == 4) &&
                  ((Array.isArray(global.rs_id_usr)
                    ? global.rs_id_usr?.includes(item?.id_usuario)
                    : item?.id_usuario == global.rs_id_usr) ||
                    item?.id_loja == window.rs_id_lja ||
                    (!item?.id_usuario && !item?.id_loja)) ? ( // VERIFICA SE ESTÁ NA ÚLTIMA COLUNA PARA MOSTRAR O BOTÃO DE FINALIZAR
                    <Icon
                      type="check"
                      title={
                        item?.card_qtd_total > item?.card_qtd_finalizado
                          ? "É necessário finalizar todos os cards internos antes de finalizar o job"
                          : "Finalizar"
                      }
                      disabled={
                        item?.card_qtd_total > item?.card_qtd_finalizado
                          ? true
                          : false
                      }
                      loading={loading}
                      animated
                      onClick={() =>
                        changeStatus(
                          item?.data < get_date("datetime_sql", new Date())
                            ? 3
                            : 1
                        )
                      }
                    />
                  ) : (
                    ""
                  )}

                  <Editar
                    id={item?.id_job}
                    id_job_status={item?.id_job_status}
                    id_emp={phase?.id_emp}
                    lote={item?.lote}
                    id_card_user={item?.id_usuario}
                    // disabled={disable_aux}
                    // disabledTitle={disable_title_aux}
                    fases={true}
                    aux_form={item?.aux_form}
                    reload={handleReload}
                    // refreshCalendar={handleRefreshCalendar}
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            <div className={style.actions_header}>
              {window.rs_permission_apl === "supervisor" ||
              window.rs_permission_apl === "master" ? (
                <TrocaOperador
                  label={item?.nome_usuario ? "" : "Trocar de operador"}
                  placeholder={item?.nome_usuario}
                  // options={props?.internal?.params?.options}
                  fases={true}
                  margin={false}
                  params={{
                    id_modulo: item?.id_modulo,
                    id_job2: item?.id_group ? item?.id_group : undefined,
                    id_job_status2: item?.id_job_status,
                    id_job_lote: item?.id_job_lote,
                    id_job: item?.id_job,
                    id_job_status: item?.id_job_status,
                    id_job_apl: item?.id_job_apl,
                    tipo_fase: item?.type_phase,
                    ativ_desc: "Trocou de operador para",
                    filterModule: item?.id_modulo,
                    filter_subtype: "user",
                  }}
                  // onChange={handleChangeOperator}
                />
              ) : (
                item?.nome_usuario
              )}

              {optionsStatus &&
              optionsStatus.length > 0 &&
              (window.rs_permission_apl === "supervisor" ||
                window.rs_permission_apl === "master") ? (
                <TrocaStatus
                  label={false}
                  placeholder={"Status"}
                  id_job_status={item?.id_job_status}
                  id_job={item?.id_job}
                  id_job_apl={item?.id_job_apl}
                  options={optionsStatus}
                  id_cliente={item?.id_cliente ? item?.id_cliente : null}
                  // value={cardStatus}
                  menuPlacement={"bottom"}
                  // callback={handleAdjustSize}
                />
              ) : (
                ""
              )}

              {window.rs_permission_apl === "supervisor" ||
              window.rs_permission_apl === "master" ? (
                <Input
                  placeholder="Data"
                  label={false}
                  icon={false}
                  background={false}
                  border={false}
                  padding={false}
                  type="date"
                  name="adiar"
                  required={false}
                  value={data}
                  onChange={(e) =>
                    handleSetDate(
                      e,
                      "Adiou o job de " +
                        get_date("date", item?.data, "datetime_sql") +
                        " para " +
                        cd(e),
                      e,
                      item?.data
                    )
                  }
                />
              ) : (
                <Tippy
                  content={
                    item?.data
                      ? get_date("date", item?.data, "datetime_sql")
                      : ""
                  }
                >
                  <span className="pe-3">
                    {item?.data
                      ? get_date("date", item?.data, "datetime_sql")
                      : ""}
                  </span>
                </Tippy>
              )}
            </div>

            {show && (
              <div className={style.category}>
                {item?.categoria} / {item?.subcategoria}
              </div>
            )}

            <div className={style.chat + " " + style.internal}>
              {itemInIvew ? (
                //TODO
                <div className="position-relative">
                  <Chat
                    api={
                      window.host_madnezz +
                      "/systems/integration-react/api/request.php?type=Job&do=setTable&db_type=" +
                      global.db_type
                    }
                    id={item?.id_job_status}
                    id_job={item?.id_job}
                    jobs={phase}
                    job={item}
                    // tipo_permissao={props?.tipo_permissao}
                    // border={chatAlert}
                    editor={true}
                    permission_module={window.rs_permission_apl}
                    send={true}
                    button={{
                      show: true
                    }}
                    empty={false}
                    anexo={true}
                    loadingMsg={loadingMsg}
                    callback={handleCallbackChat}
                    defaultValue={
                      item?.mensagem_ult
                        ? item?.mensagem_ult.length === 255
                          ? item?.mensagem_ult + "..."
                          : item?.mensagem_ult
                        : item?.descricao
                    }
                    // refreshCard={handleRefreshCard}
                    nivel_msg={0}
                    // mensagem_finaliza={props?.chat?.mensagem_finaliza}
                    // actions={actions}
                  >
                    
                  </Chat>
                 
                </div>
              ) : (
                ""
              )}
            </div>

            {show ? (
              item?.cards_parent?.length > 0 ? (
                <div className={style.children_container}>
                  {item?.cards_parent.map((item, i) => {
                    return (
                      <Item
                        key={"children_" + item?.id_job_status}
                        children={true}
                        // phases={jobs}
                        // phase={fase}
                        phase_index={phase_index}
                        items={item?.cards_parent}
                        optionsStatus={optionsStatus}
                        itemJob={item}
                        disabled={
                          chat_active &&
                          chat_active?.id_job_status != item?.id_job_status &&
                          chat_active?.id_job_parent != item?.id_job
                            ? true
                            : false
                        }
                        callback={handleCallbackChildren}
                      />
                    );
                  })}
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}

            <div
              className={style.chat + " " + (showMessages ? style.active : "")}
            >
              {showMessages ? (
                <Chat send={false}>
                  {loadingMessages ? (
                    <div className={style.loader}>
                      <Loader />
                    </div>
                  ) : (
                    messages?.map((message, i) => {
                      // if(message.anexo){
                      //     message?.anexo.split(',').map((item, i) => {
                      //         messageFiles.push(item);
                      //     });
                      // }

                      let message_aux;

                      if (message?.log_tipo === "Cadastro") {
                        if (message?.mensagem) {
                          message_aux = message?.mensagem;
                        } else {
                          message_aux = "Cadastrou o card";
                        }
                      } else if (message?.log_tipo === "Edição") {
                        if (message?.mensagem) {
                          message_aux = message?.mensagem;
                        } else {
                          message_aux = "Editou o card";
                        }
                      } else {
                        if (message.mensagem !== null) {
                          message_aux =
                            message?.mensagem +
                            (message.motivo
                              ? "\n" +
                                (message?.status == 2
                                  ? "Motivo"
                                  : "Observações") +
                                ": " +
                                message.motivo +
                                ""
                              : "");
                        } else {
                          message_aux = "";
                        }
                      }

                      // DEFINE URL DO UPLOAD
                      let url_aux = window.upload;

                      if (window.rs_sistema_id == global.sistema.manutencao_madnezz) {
                        url_aux = window.upload_madnezz;
                      }

                      return (
                        <Message
                          key={"message_" + message.id}
                          sender={message.nome_usuario}
                          date={cdh(message.dataHora_cad)}
                          text={message_aux}
                          files={
                            message.anexo
                              ? message?.anexo.includes("{")
                                ? JSON.parse(message?.anexo).map((item, i) => {
                                    return (
                                      <a
                                        href={url_aux + "/" + item?.id}
                                        target="_blank"
                                        className={
                                          style.file__link + " d-block"
                                        }
                                        key={
                                          "message_" + message.id + "_file_" + i
                                        }
                                      >
                                        {item?.name}
                                        <Icon type="external" />
                                      </a>
                                    );
                                  })
                                : message?.anexo.split(",").map((item, i) => {
                                    return (
                                      <a
                                        href={url_aux + "/" + item}
                                        target="_blank"
                                        className={
                                          style.file__link + " d-block"
                                        }
                                        key={
                                          "message_" + message.id + "_file_" + i
                                        }
                                      >
                                        Arquivo {i + 1}
                                        <Icon type="external" />
                                      </a>
                                    );
                                  })
                              : ""
                          }
                          align={
                            window.rs_id_usr == message.id_usuario
                              ? "right"
                              : "left"
                          }
                        />
                      );
                    })
                  )}
                </Chat>
              ) : (
                ""
              )}
            </div>
          </div>
        );
    }
}
