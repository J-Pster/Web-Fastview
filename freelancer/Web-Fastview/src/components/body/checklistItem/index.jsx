import { useState, useEffect } from 'react';
import Td from '../table/tbody/td';
import Textarea from '../form/textarea';
import Icon from '../icon';
import Input from '../form/input';
import Tr from '../table/tr';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import style from './checklistItem.module.scss';
import Editar from '../card/editar';
import { cd } from '../../../_assets/js/global';
import Foto from '../foto';
import Tippy from '@tippyjs/react';

export default function ChecklistItem(props){
    // ESTADOS
    const [postItem, setPostItem] = useState(false);
    const [showMotivo, setShowMotivo] = useState(false);
    const [alert, setAlert] = useState(false);

    // ESTADOS DE VALORES
    const [relatorioID, setRelatorioID] = useState(props?.relatorio_id);
    const [resposta, setResposta] = useState(props.pergunta.resposta);
    const [auxResposta, setAuxResposta] = useState('');
    const [observacao, setObservacao] = useState(props.pergunta.observacao);
    const [anexo, setAnexo] = useState((props.pergunta.anexo ? props.pergunta.anexo : ''));
    const [titulo, setTitulo] = useState('');
    const [loja, setLoja] = useState([]);
    const [plano, setPlano] = useState(false);
    const [modelo, setModelo] = useState([]);
    const [foto, setFoto] = useState('');
    const [supervisao, setSupervisao] = useState((props?.supervisao ? JSON.parse(props?.supervisao) : ''));
    const [quantidade, setQuantidade] = useState(props?.pergunta?.quantidade);

    // ATUALIZA RESPOSTA
    useEffect(() => {
        setResposta(props.pergunta.resposta);
    },[props.pergunta.resposta]);

    // RESETA VALORES
    useEffect(() => {
        if(props.sendChecklist){
            setResposta('');
            setObservacao('');
            setAnexo('');
        }
    },[props.sendChecklist]);

    // PEGAR ANEXO APÓS UPLOAD
    const handleSetAnexo = (response) => {               
        if(response[2] == 'upload'){
            // LIMITA QUANTIDADE DE ANEXOS
            if(props?.pergunta?.anexo && props?.pergunta?.anexo.split('],').length >= 5){
                toast('Não é possível inserir mais de 5 anexos em uma mesma pergunta');
            }else{ 
                setAnexo(response[0]);
            }
        }else{
            axios({
                method: 'get',
                url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=status_anexo',
                params: {
                    anexo: response[1],
                    status: 0
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(() => {
                toast('Anexo removido com sucesso');
            });
        }     
        props.anexo(true);
    }

    // USEEFFECT QUE É CHAMADO SEMPRE QUE ALGUM VALOR É ALTERADO
    function post_resposta(respostaValue){
        if((!props.reload && !props.sendChecklist) || props.submit){
            axios({
                method: 'post',
                url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist_item',
                data: {
                    relatorio_id: relatorioID,
                    pergunta_id: props.pergunta?.id,
                    resposta: (respostaValue ? respostaValue : resposta),
                    checklist_id: props?.checklist_id,
                    loja_id: props.loja_id,
                    observacao: observacao,
                    quantidade: quantidade,
                    classificacao: props.classificacao,
                    motivo: props?.motivo,
                    job: props?.job,
                    funcionario_id: props.funcionario_id,
                    supervisao: (supervisao ? JSON.stringify(supervisao) : '')
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {
                setRelatorioID(response.data);
                setPostItem(false);   
                setAuxResposta('');
                props.validation(true);
                props.callback(respostaValue);
            });
        }
    }

    // USEEFFECT QUE É CHAMADO SEMPRE QUE ALGUM ANEXO É INCLUÍDO
    useEffect(() => {
        if((anexo && !props.reload && !props.sendChecklist) || props.submit){
            axios({
                method: 'post',
                url: window.host+'/systems/'+global.sistema_url.checklist+'/api/novo.php?do=post_checklist_item',
                data: {
                    relatorio_id: relatorioID,
                    pergunta_id: props.pergunta?.id,
                    checklist_id: props?.checklist_id,
                    loja_id: props.loja_id,
                    anexo: (anexo ? anexo.toString() : ''),
                    job: props?.job,
                    funcionario_id: props.funcionario_id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {
                setRelatorioID(response.data);
                props.validation(true);
                props.callback(true);
            });
        }
    },[anexo]);

    // VERIFICA SE TEM ALGUM VALOR NOS ESTADOS PARA EXECUTAR O POST
    useEffect(() => {
        if((resposta) && !props.reload){
            setPostItem(true);
        }
    },[
        props.motivo,
        props.classificacao
    ]);

    // SALVA OBSERVAÇÃO AO TIRAR FOCO DO INPUT
    const handleFocusOut = () => {
        post_resposta();
    }

    // SETA RESPOSTA
    const handleSetResposta = (e) => {
        setResposta(e);
        post_resposta(e);
    }

    // EXIBE MODAL DE MOTIVO DE REPROVA
    const handleSetReprova = () => {
        props.modalReprova(true);
    }

    // EXIBE MODAL DE MOTIVO DE NÃO SE APLICA
    const handleSetNaoSeAplica = () => {
        props.modalNaoSeAplica(true);
    }

    // SEMPRE QUE VIER UM SUBMIT DO COMPONENTE É CHAMADO ESSE USE EFFECT
    useEffect(() => {
        if(props.submit){
            setPostItem(true);
        }
    },[
        props.submit
    ]);

    // FUNÇÃO PARA ABRIR PLANO DE AÇÃO    
    function actionPlain(titulo, loja){
        setTitulo(titulo);
        setLoja(loja);
        setPlano(true);
    }

    // FUNÇÃO PARA SETAR FOTO SUPERVISÃO
    const handleSetSupervisao= (e) => {
        let imgObj = {
            foto_1: [
                {imagem: modelo[0].replace(window.upload+'/','')}
            ],
            foto_2: e
        }

        setFoto([window.upload+'/'+e]);
        setSupervisao(imgObj);
        props.callback(true);
    }

    // SETA IMAGEM MODELO DA SUPERVISÃO
    useEffect(() => {
        if(props?.pergunta?.resposta_supervisao || props?.pergunta?.modelo?.length > 0){
            let modelos = [];

            if(props?.pergunta?.resposta_supervisao){
                let json = JSON.parse(props.pergunta.resposta_supervisao);
                let imgModelo = json.foto_1[0].imagem;
                let imgTirada = json.foto_2;

                if(imgModelo){
                    setModelo([window.upload+'/'+imgModelo]);
                }else{
                    setModelo([window.upload+'/'+props.pergunta.supervisao[0]]);
                }
                if (imgTirada) {
                    let img_tirada_aux = [];

                    imgTirada.map((img, i) => {
                        img_tirada_aux.push(window.upload + '/' + img.imagem)
                    });
                    setFoto(img_tirada_aux);
                }
            }else{
                props.pergunta.modelo.split(',').map((modelo, i) => {
                    modelos.push(window.upload+'/'+modelo);
                });

                setModelo(modelos); 
            }
        }else{
            setModelo([]);
        }
    },[props?.supervisao]);

    // DEFINE META E VALORES DO CAMPO "JOB_DADO_AUX1"
    let json_value, meta, venda_realizada, realizada_meta_porc, sistema_porc;
    if(props?.job_dado_aux1){
        json_value = JSON.parse(props?.job_dado_aux1);
        meta = json_value?.meta;
        venda_realizada = json_value?.venda_realizada;
        realizada_meta_porc = json_value?.realizada_meta_porc;
        sistema_porc = json_value?.sistema_porc;
    }

    // VERIFICAR SE O CAMPO ITENS ESTÁ RETORNANDO STRING OU ARRAY
    let itens_aux;
    if(Array.isArray(props?.pergunta?.itens)){
        itens_aux = props?.pergunta?.itens;        
    }else{
        itens_aux = props?.pergunta?.itens?.split(',');
    }

    return(
        <>
            <Tr>
                <Td padding={'lg'} disableView={false}>
                    <div className={'d-block '+(props?.tipo_supervisao == 'autoavaliacao' ? 'd-block text-center' : 'd-lg-flex')+' align-items-start justify-content-between ' + (props.alert ? style.alert : '')}>
                        {(props?.job_dado_aux1 ?
                            <>
                                {(sistema_porc ? 
                                    <div className={style.system_percentage + ' text-warning'}>
                                        {Math.round(realizada_meta_porc)}% <span className={style.small}>({Math.round(sistema_porc)}%)</span>
                                    </div>
                                :'')}

                                {(meta ? 
                                    <div className="mb-2">
                                        {Number(venda_realizada).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} ({Number(meta).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})})
                                    </div>
                                :'')}
                            </>
                        :'')}
                        
                        <div>
                            {props.pergunta.nome}

                            {(props.pergunta.anexo_obrigatorio ? 
                                <span className="text-secondary ms-1">(Anexo obrigatório)</span>
                            :'')}
                        </div>

                        <div className={'d-flex '+(props?.tipo_supervisao == 'autoavaliacao' ? 'w-100 justify-content-center' : '')+' align-items-center mt-2 mb-3 my-lg-0 '+(props?.tipo_supervisao == 'autoavaliacao' ? style.autoavaliacao : '') + ' ' + style.actions}>
                            {(itens_aux?.length > 0 ? 
                                itens_aux.map((item, i) => {
                                    var color;

                                    // DEFINE VARIÁVEIS DEPENDENDO SE RECEBER ARRAY OU STRING
                                    let class_aux, icone_aux, id_aux, descricao_aux, nome_aux;

                                    if(Array.isArray(props?.pergunta?.itens)){
                                        icone_aux = item?.icone;
                                        nome_aux = item?.iten_nome;
                                        id_aux = item?.id;
                                        class_aux = item?.classe;
                                        descricao_aux = item?.item_descricao;
                                    }else{
                                        icone_aux = item.split('|')[0];
                                        nome_aux = item.split('|')[1];
                                        id_aux = item.split('|')[2];
                                        class_aux = item.split('|')[3];
                                        descricao_aux = ''; // NÃO TEM NESSA VERSÃO
                                    }

                                    if(id_aux == 1){
                                        color = 'text-success';
                                    }else if(id_aux == 2){
                                        color = 'text-danger';
                                    }else if(id_aux == 3 || id_aux == 7){
                                        color = 'text-warning';
                                    }else if(id_aux == 8){
                                        color = 'text-primary';
                                    }else{
                                        color = '';
                                    }
                                    if(icone_aux != 'comment-alt'){ // CASO O ÍCONE SEJA DE COMENTÁRIO, NÃO É INSERIDO
                                        if(icone_aux == 'camera'){
                                            // if(props.interaction !== false){
                                                return(
                                                    <Input
                                                        size="lg"
                                                        type="file"
                                                        icon="camera"
                                                        border={false}
                                                        multiple={false}
                                                        className={'mx-0'}
                                                        value={anexo}
                                                        multipleValues={true}
                                                        callback={handleSetAnexo}
                                                        readonly={(props.interaction === false ? true : false)}
                                                        input={(props.interaction === false ? false : true)}
                                                    />
                                                )
                                            // }
                                        }else if(icone_aux == 'qtd'){
                                            return (
                                                <Tippy content={nome_aux ? nome_aux : undefined}>
                                                    <span>
                                                        <Input
                                                            type="tel"
                                                            mask="9999"
                                                            maskChar=""
                                                            className={style.quantidade}
                                                            placeholder="0"
                                                            value={quantidade}
                                                            onChange={(e) => setQuantidade(e.target.value)}
                                                            onFocusOut={handleFocusOut}
                                                            readonly={(props.interaction === false ? true : false)}
                                                        />
                                                    </span>
                                                </Tippy>
                                            )
                                        }else{
                                            return(
                                                <Icon
                                                    key={'custom_icon_'+i}
                                                    size="lg"
                                                    type={icone_aux}
                                                    title={nome_aux} 
                                                    className={(resposta == id_aux ? color : (resposta && resposta != 1 ? 'text-secondary' : ''))}
                                                    onClick={() => (
                                                        id_aux == 2 ?
                                                            handleSetReprova()
                                                        :
                                                            (id_aux == 3 ?
                                                                handleSetNaoSeAplica()
                                                            :
                                                                handleSetResposta(id_aux)
                                                            )                                                        
                                                        )}
                                                    readonly={(props.interaction === false ? true : false)}
                                                />
                                            )
                                        }
                                    }
                                })
                            :
                                <>
                                    <Icon
                                        size="lg"
                                        type="check"
                                        title="Conforme"
                                        className={(resposta == 1 ? 'text-success' : (resposta && resposta != 1 ? 'text-secondary' : ''))}
                                        onClick={() => handleSetResposta(1)}
                                        readonly={(props.interaction === false ? true : false)}
                                    />

                                    <Icon
                                        size="lg"
                                        type="reprovar2"
                                        title="Não conforme"
                                        className={(resposta == 2 ? 'text-danger' : (resposta && resposta != 2 ? 'text-secondary' : ''))}
                                        onClick={() => handleSetReprova()}
                                        readonly={(props.interaction === false ? true : false)}
                                    />

                                    <Icon
                                        size="lg"
                                        type="alert-circle"
                                        title="Não se aplica"
                                        animated
                                        className={(resposta == 3 ? 'text-warning' : (resposta && resposta != 3 ? 'text-secondary' : ''))}
                                        onClick={() => handleSetNaoSeAplica()}
                                        readonly={(props.interaction === false ? true : false)}
                                    />

                                    {/* {(props.interaction !== false ? */}
                                        <Input
                                            size="lg"
                                            type="file"
                                            border={false}
                                            multiple={false}
                                            className={'mx-0'}
                                            value={anexo}
                                            multipleValues={true}
                                            callback={handleSetAnexo}
                                            input={(props.interaction === false ? false : true)}
                                            readonly={(props.interaction === false ? true : false)}
                                        />
                                    {/* :'')} */}
                                </>
                            )}

                            {(!props.pergunta.itens ?
                                <Icon
                                    type="user-check"
                                    size="lg"
                                    title={resposta == 2 ? 'Criar plano de ação' : 'Plano de ação disponível apenas para respostas negativas'}
                                    motivo={false}
                                    animated
                                    onClick={() => actionPlain(props.pergunta.nome, props.pergunta.loja_id)}
                                    disabled={(resposta == 2 ? false : true)}
                                />
                            :'')}
                        </div>
                    </div>

                    {(props.interaction === false ? 
                        <>
                            {(observacao ?
                                <span className="d-block pre-line mt-2 text-secondary">{observacao}</span>
                            : '')}

                            {(props?.pergunta?.resposta_motivo ?
                                <span className="d-block pre-line mt-2 text-secondary">{props?.pergunta?.resposta_motivo}</span>
                            : '')}
                        </>
                    :
                        <Textarea
                            className="mt-2"
                            placeholder={'Comentário'}
                            height={30}
                            required={(props.pergunta.mensagem_obrigatorio == 3 && resposta == 1 || props.pergunta.mensagem_obrigatorio == 2 ? true : false)}
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            onFocusOut={handleFocusOut}
                            readonly={(props.interaction === false ? true : false)}
                        ></Textarea>                                     
                    )}

                    {/* SUPERVISÃO VISUAL */}
                    {(props?.tipo_supervisao == 'supervisao' || props?.tipo_supervisao == 'antes_depois' ?
                        <div className={(props.interaction === false ? 'mt-2' : '')}>
                            <Foto
                                left={modelo}
                                right={foto}
                                modelo={(props?.tipo_supervisao == 'antes_depois' ? false : true)}
                                qtd={(props?.pergunta?.qtd_foto ? props?.pergunta?.qtd_foto : 1)}
                                transform={false}
                                camera={(props?.camera === false ? false : true)}
                                integration={props?.integration}
                                callback={handleSetSupervisao}
                                width={(props?.job ? 'auto' : '')}
                                interaction={props?.interaction}
                                reproved={{
                                    adm: (props?.doubleCheck == 2 ? true : false)
                                }}
                                hover={false}
                                params={{
                                    relatorio_id: relatorioID,
                                    pergunta_id: props?.pergunta?.id,
                                    checklist_id: props?.checklist_id,
                                    loja_id: props?.loja_id,
                                    job: props?.job,
                                    supervisao: props?.supervisao
                                }}
                            />
                        </div>
                    :'')}                    
                </Td>
            </Tr>

            {/* MODAL PLANO DE AÇÃO (COMPONENTE DO JOBS) */}
            {(plano ?
                <Editar
                    modalTitle={'Plano de Ação'}
                    icon={false}
                    show={plano}
                    plano={true}
                    onClose={(e) => setTimeout(() => {setPlano(false)},500)}
                    frequency={{
                        id: global.frequencia.unico
                    }}
                    dateStart={cd(new Date())}
                    job={titulo + (props?.job_title ? ' ('+props?.job_title+')' : '')}
                    category={{id: global.categoria.plano_de_acao}}
                    subcategory={{id: global.subcategoria.checklist}}
                    description={`
                        Item de checklist reprovado: `+titulo+`<br />Reprovado em: `+cd(window.currentDate)+` às `+window.currentHour+`:`+window.currentMinutes+`<br />Reprovado por: `+window.rs_name_usr+`<br />Motivo: `+props?.pergunta?.resposta_motivo+`
                    `}
                    id_lja={props?.loja_id}
                    id_usr={props?.id_usr}
                    chamados={props?.chamados}
                    fases={props?.fases}
                    visitas={props?.visitas}
                />
            :'')}
        </>
    )
}