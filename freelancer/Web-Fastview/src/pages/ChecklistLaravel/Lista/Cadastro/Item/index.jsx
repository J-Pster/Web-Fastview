import { useEffect, useRef, useState } from 'react';

import style from './style.module.scss';
import Td from "../../../../../components/body/table/tbody/td";
import Tr from "../../../../../components/body/table/tr";
import Icon from '../../../../../components/body/icon';
import toast from 'react-hot-toast';
import axios from 'axios';
import Input from '../../../../../components/body/form/input';
import Textarea from '../../../../../components/body/form/textarea';
import PlanoDeAcao from '../../PlanoDeAcao';
import Reprovar from './Reprovar';
import InputContainer from '../../../../../components/body/form/inputcontainer';
import Foto from './Foto';
import Select from '../../../../../components/body/select';

const UPLOAD_URL = window.upload

export default function Item({checklist, pergunta, loja, funcionario, relatorio, job, interaction, integration, tipo_sistema, camera, alert, callback, disabled, callbackRelatorio}){
    // ESTADOS
    const [resposta, setResposta] = useState(pergunta.resposta ? pergunta.resposta : null);
    const [respostaPersonalizada, setRespostaPersonalizada] = useState(pergunta?.resposta_options ? JSON.parse(pergunta?.resposta_options) : []);
    const [anexo, setAnexo] = useState(pergunta.anexos?.length > 0 ? JSON.stringify(pergunta.anexos) : null);
    const [comentario, setComentario] = useState(pergunta?.observacao);
    const [motivo, setMotivo] = useState(pergunta.resposta_motivo ? pergunta.resposta_motivo : null);
    const [classificacao, setClassificacao] = useState(pergunta.reprovado_classificacao ? pergunta.reprovado_classificacao : null);
    const [modelo, setModelo] = useState([]);
    const [foto, setFoto] = useState([]);
    const [supervisao, setSupervisao] = useState(null);
    const [quantidade, setQuantidade] = useState(null);

    // ABORT AXIOS
    const abort = useRef(new AbortController());

    // SETA RESPOSTAS
    const handleSetResposta = (e) => {
        setResposta(e.resposta);
        
        if(e.resposta == 1 || e.resposta == 8) {
            setMotivo(null);
            setClassificacao(null);
            validacao_motivo(e.resposta);
        }else{
            if(e.resposta == 3 || e.resposta == 7){ // SE A RESPOSTA FOR 3 (NÃO SE APLICA) REMOVE O ESTADO DA CLASSIFICAÇÃO
                setClassificacao(null);
            }

            if(callback){
                callback({
                    active: e.id // MANDA O ID PRO COMPONENTE PAI PARA DESABILITAR OS DEMAIS ITENS
                })
            }    
            
            validacao_motivo(e.resposta, undefined, alert);
        }
    }

    // SETA COMENTÁRIO
    const handleSetComentario = () => {
        validacao_motivo(resposta, classificacao, undefined, false, undefined, comentario);
    }

    // AÇÕES AO PREENCHER MOTIVO
    const handleSetMotivo = (e) => {
        validacao_motivo(resposta, classificacao, undefined, false, undefined, undefined, motivo);
    }

    // PEGAR ANEXO APÓS UPLOAD
    const handleSetAnexo = (response) => {    
        
        if(anexo && JSON.parse(anexo).length >= 5){
            toast('Não é possível inserir mais de 5 anexos em uma mesma pergunta');
        }else{ 
            setAnexo(response[0]);
        }

        if(response[2] == 'upload'){
            // LIMITA QUANTIDADE DE ANEXOS
            if(pergunta?.anexos && pergunta?.anexos.length >= 5){
                toast('Não é possível inserir mais de 5 anexos em uma mesma pergunta');
            }else{ 
                let value_aux = anexo ? JSON.parse(anexo) : [];
                let id_aux = [];
                setAnexo(anexo => JSON.stringify([...value_aux, ...JSON.parse(response[0])]));

                [...value_aux, ...JSON.parse(response[0])]?.map((item, i) => {
                    if(value_aux?.filter((elem) => elem?.id == item?.id)?.length == 0){
                        id_aux.push(item?.id);
                    }
                });

                setTimeout(() => {
                    axios({
                        method: 'put',
                        url: window.backend+'/api/v1/checklists/respostas/anexos',
                        data: {
                            checklist: checklist,
                            pergunta: pergunta.id,
                            loja: loja,
                            job_id: job?.job_id,
                            funcionario_id: funcionario,
                            anexos: id_aux
                        },
                        headers: {
                            "Content-Type" : 'application/json'
                        }
                    })
                },100);
            }
        }else if(response[2] === 'remove'){
            let value_aux = anexo ? JSON.parse(anexo) : [];
            setAnexo(JSON.stringify(value_aux.filter((elem) => elem.id != response[1])));

            setTimeout(() => {
                axios({
                    method: 'delete',
                    url: window.backend+'/api/v1/checklists/respostas/anexos',
                    data: {
                        checklist: checklist,
                        pergunta: pergunta.id,
                        loja: loja,
                        job_id: job?.job_id,
                        funcionario_id: funcionario,
                        anexos: [response[1]]
                    },
                    headers: {
                        "Content-Type" : 'application/json'
                    }
                })
            },100);
        }

        if(callback){
            callback({
                resposta: {
                    pergunta: pergunta.id,
                    resposta: null,
                    resposta_personalizada: null,
                    resposta_supervisao: supervisao,
                    anexo: anexo ?? response[0],
                    condicional: pergunta.id,
                    validation: false,
                    itens: pergunta?.itens,
                    toast: toast
                }
            });

        }
    }

    // POST RESPOSTA
    function post_resposta(resposta_aux, comentario_aux, anexo_aux, motivo_aux, classificacao_aux, imagens, resposta_personalizada){ 
        if(!relatorio){
            callback({
                disabled: true
            });
        }

        let method_aux = resposta_personalizada ? 'put' : 'post';
        let url_aux;
        
        if(resposta_personalizada){
            url_aux = window.backend + '/api/v1/checklists/respostas/options';
        }else{
            url_aux = window.backend + '/api/v1/checklists/respostas';
        }

        abort.current.abort();
        abort.current = new AbortController();

        axios({
            method: method_aux,
            url: url_aux,
            data: {                
                checklist: checklist,
                pergunta: pergunta.id,
                loja: loja,
                funcionario,
                quantidade:quantidade,
                relatorio: relatorio ? relatorio : undefined,
                resposta: resposta_aux ? resposta_aux : (resposta ? resposta : undefined),
                observacao: comentario_aux ? comentario_aux : (comentario ? comentario : undefined),
                anexos: anexo_aux ? [anexo_aux] : (anexo ? [JSON.parse(anexo)[0]?.id] : undefined),
                resposta_motivo: motivo_aux ? motivo_aux : (motivo ? motivo : undefined),
                reprovado_classificacao: classificacao_aux ? classificacao_aux : (classificacao ? classificacao : undefined),
                imagens,
                options: JSON.stringify(resposta_personalizada),
                job_id: job?.job_id,                
                supervisao,
            },
            headers: {
                Authorization : `Bearer ${window.token}`,
                Accept: 'application/json',
                "Content-Type" : 'application/json'
            },
            signal: abort.current.signal
        }).then((response) => {
            if(response?.data?.id_relatorio){
                callbackRelatorio(response.data.id_relatorio);
            }

            if(response?.data?.relatorio){
                callbackRelatorio(response.data.relatorio);
            }
        }).catch(err => console.error(err))
    }

    // VALIDAÇÃO DE MOTIVO
    function validacao_motivo(resposta, classificacao, alert, toast = true, resposta_personalizada = undefined, comentario, motivo, resposta_supervisao){
        if(alert){
            toast('Preencha um motivo para a resposta');
        }

        let validation_aux = false;

        if(callback){
            if(resposta && (resposta == 1 || resposta == 8)){
                validation_aux = true;

                if(callback){
                    callback({
                        resposta: {
                            pergunta: pergunta.id,
                            resposta: resposta,
                            resposta_personalizada: resposta_personalizada,
                            resposta_supervisao: resposta_supervisao ? resposta_supervisao : supervisao,
                            anexo: {obrigatorio: pergunta.anexo_obrigatorio, arquivo: anexo},
                            condicional: pergunta.id,
                            validation: validation_aux,
                            itens: pergunta?.itens,
                            toast: toast
                        }
                    });
                }
            }else if(resposta && resposta == 2){
                if(motivo && classificacao){
                    validation_aux = true;

                    if(callback){
                        callback({
                            resposta: {
                                pergunta: pergunta.id,
                                resposta: resposta,
                                resposta_personalizada: resposta_personalizada,
                                resposta_supervisao: resposta_supervisao ? resposta_supervisao : supervisao,
                                anexo: {obrigatorio: pergunta.anexo_obrigatorio, arquivo: anexo},
                                condicional: pergunta.id,
                                validation: validation_aux,
                                itens: pergunta?.itens,
                                toast: toast
                            }
                        });
                    }
                }else{
                    validation_aux = false;

                    if(callback){
                        callback({
                            resposta: {
                                pergunta: pergunta.id,
                                resposta: null,
                                resposta_personalizada: resposta_personalizada,
                                resposta_supervisao: resposta_supervisao ? resposta_supervisao : supervisao,
                                anexo: {obrigatorio: pergunta.anexo_obrigatorio, arquivo: anexo},
                                condicional: pergunta.id,
                                validation: validation_aux,
                                itens: pergunta?.itens,
                                toast: toast
                            }
                        });
                    }
                }
            }else if(resposta && (resposta == 3 || resposta == 7)){
                if(motivo){
                    validation_aux = true;

                    if(callback){
                        callback({
                            resposta: {
                                pergunta: pergunta.id,
                                resposta: resposta,
                                resposta_personalizada: resposta_personalizada,
                                resposta_supervisao: resposta_supervisao ? resposta_supervisao : supervisao,
                                anexo: {obrigatorio: pergunta.anexo_obrigatorio, arquivo: anexo},
                                condicional: pergunta.id,
                                validation: validation_aux,
                                itens: pergunta?.itens,
                                toast: toast
                            }
                        });
                    }
                }else{
                    validation_aux = false;

                    if(callback){
                        callback({
                            resposta: {
                                pergunta: pergunta.id,
                                resposta: null,
                                resposta_personalizada: resposta_personalizada,
                                resposta_supervisao: resposta_supervisao ? resposta_supervisao : supervisao,
                                anexo: {obrigatorio: pergunta.anexo_obrigatorio, arquivo: anexo},
                                condicional: pergunta.id,
                                validation: validation_aux,
                                itens: pergunta?.itens,
                                toast: toast
                            }
                        });
                    }
                }
            }

            if(pergunta?.itens?.length > 0){
                if(pergunta?.itens?.filter((elem) => elem.alias == 'Conformidade' && elem.alias == 'Não conformidade' && elem.alias == 'Não se aplica').length == 0){
                    validation_aux = true;
                }
            }

            if(validation_aux){
                callback({
                    active: null // MANDA ACTIVE NULL PRO COMPONENTE PAI PARA REABILITAR OS ITENS INATIVOS
                });
            }else{
                callback({
                    active: pergunta.id // MANDA O ID PRO COMPONENTE PAI PARA DESABILITAR OS DEMAIS ITENS
                });
            }
        }

        if(validation_aux){
            if(comentario){
                axios({
                    method: 'put',
                    url: window.backend+'/api/v1/checklists/respostas/observacao',
                    data: {
                        checklist: checklist,
                        pergunta: pergunta.id,
                        loja: loja,
                        job_id: job?.job_id,
                        funcionario_id: funcionario,
                        observacao: comentario
                    },
                    headers: {
                        "Content-Type" : 'application/json'
                    }
                })
            }else{
                if(resposta){
                    post_resposta(resposta, undefined, undefined, motivo, classificacao);
                }else if(resposta_personalizada){
                    post_resposta(3, undefined, undefined, undefined, undefined, undefined, resposta_personalizada);            
                }
            }
        }
    }

    // AÇÕES AO PREENCHER CLASSIFICAÇÃO
    const handleSetClassificacao = (e) => {
        setClassificacao(e.target.value);
        validacao_motivo(resposta, e.target.value);
    }

    // SUPERVISÃO
    useEffect(() => {
        if(pergunta?.supervisao || pergunta?.modelos?.length > 0){
            let modelos = [];

            if(pergunta?.supervisao){
                let json = JSON.parse(pergunta.supervisao);
                let imgModelo = json.foto_1[0].imagem;
                let imgTirada = json.foto_2;

                if(imgModelo){
                    setModelo([window.upload+'/'+imgModelo]);
                }else{
                    setModelo([window.upload+'/'+pergunta.supervisao[0]]);
                }
                if (imgTirada) {
                    let img_tirada_aux = [];

                    imgTirada.map((img, i) => {
                        img_tirada_aux.push(window.upload + '/' + img.imagem)
                    });
                    setFoto(img_tirada_aux);
                }
            }else{
                pergunta.modelos.map((modelo, i) => {
                    modelos.push(window.upload+'/'+modelo?.id);
                });

                setModelo(modelos); 
            }
        }else{
            setModelo([]);
        }
    },[pergunta]);

     // FUNÇÃO PARA SETAR FOTO SUPERVISÃO
     const handleSetSupervisao = (e) => {
        validacao_motivo(resposta, undefined, undefined, undefined, undefined, undefined, undefined, true);  

        let imgObj = {
            foto_1: [
                {imagem: modelo[0].replace(UPLOAD_URL+'/','')}
            ],
            foto_2: e
        }

        //setFoto([UPLOAD_URL+'/'+e]);
        setSupervisao(e.supervisao);

        if(callback){
            callback(true);
        }
    }

    // FAZ O POST SEMPRE QUE A IMAGEM DA SUPERVISÃO É ALTERADA
    useEffect(() => {
        if(supervisao){
            axios({
                method: 'put',
                url: window.backend+'/api/v1/checklists/respostas/supervisao',
                data: {
                    checklist: checklist,
                    pergunta: pergunta.id,
                    loja: loja,
                    job_id: job?.job_id,
                    funcionario_id: funcionario,
                    supervisao: supervisao
                },
                headers: {
                    "Content-Type" : 'application/json'
                }
            }).then((response) => {
                validacao_motivo(resposta, undefined, undefined, undefined, undefined, undefined, undefined, response?.data?.relatorio)
            })
        }
    },[supervisao]);

    // SETA RESPOSTA DE CAMPOS PERSONALIZADOS
    const handleSetRespostaPersonalizada = (item_id, elem, type, post) => {
        let obj_aux;

        if(type === 'Checkbox'){
            if(respostaPersonalizada.filter((elem) => elem?.item_id == item_id).length > 0){
                let value_aux = respostaPersonalizada.filter((elem) => elem?.item_id == item_id)[0]?.value;

                if(elem?.checked){
                    value_aux.push(elem?.value);
                }else{
                    value_aux = value_aux?.filter((e) => e != elem?.value);
                }

                obj_aux = [{
                    item_id: item_id,
                    value: value_aux
                }];
            }else{
                obj_aux = [{
                    item_id: item_id,
                    value: [elem?.value]
                }];
            }
        }else{
            obj_aux = [{
                item_id: item_id,
                value: elem?.value
            }];
        }
        
        setRespostaPersonalizada(respostaPersonalizada => [...respostaPersonalizada.filter((elem) => elem?.item_id != item_id), ...obj_aux]);

        if(post){
            validacao_motivo(undefined, undefined, undefined, true, [...respostaPersonalizada.filter((elem) => elem?.item_id != item_id), ...obj_aux], undefined);
        }
    }

    // DEFINE ÍCONES
    var itens;
    var plano_de_acao = <PlanoDeAcao
                            resposta={resposta}
                        />;

    let plano_de_acao_aux = false;
    if(pergunta?.itens.length > 0){
        plano_de_acao_aux = false; // AJUSTAR

        itens = <>
            {pergunta?.itens.map((item, i) => {
                // VERIFICAR SE O TIPO DO ÍCONE É "QTD" PARA INCLUIR UM INPUT DE QUANTIDADE AO INVÉS DE UM ÍCONE
                if(item?.icone === 'qtd'){
                    return(
                        <Input
                            type="tel"
                            id={'pergunta_'+pergunta.id+'_icone_'+item.id}
                            name={'pergunta_'+pergunta.id+'_icone_'+item.id}
                            placeholder="0"
                            className={style.quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            value={quantidade}
                        />
                    )
                }else{
                    if(
                        item?.alias !== 'Porcentagem' &&
                        item?.alias !== 'Select' &&
                        item?.alias !== 'Decimal' &&
                        item?.alias !== 'Checkbox' &&
                        item?.alias !== 'Campo de comentário/Observação'
                    ){ // INSERE SOMENTE SE FOR DIFERENTE DE COMENTÁRIO, CHECKBOX, PORCENTAGEM, DECIMAL OU SELECT
                        if(item?.alias === 'Anexo'){
                            return(
                                <Input
                                    size="lg"
                                    type="file"
                                    border={false}
                                    multiple={false}
                                    className={'mx-0 p-0'}
                                    value={anexo}
                                    multipleValues={true}
                                    padding={false}
                                    callback={handleSetAnexo}
                                    input={(interaction === false ? false : true)}
                                    readonly={(interaction === false ? true : false)}
                                /> 
                            )
                        }else{
                            let class_aux;

                            if(resposta == 1 && item?.icone_tipo == 1){
                                class_aux = 'text-success';
                            }else if(resposta == 2 && item?.icone_tipo == 2){
                                class_aux = 'text-danger';
                            }else if(resposta == 3 && item?.icone_tipo == 3){
                                class_aux = 'text-warning';
                            }else if(resposta == 7 && item?.icone_tipo == 7){
                                class_aux = 'text-warning';
                            }else if(resposta == 8 && item?.icone_tipo == 8){
                                class_aux = 'text-success';
                            }else{
                                class_aux = 'text-secondary';
                            }

                            return(
                                <Icon
                                    size="lg"
                                    title={item?.descricao ? item?.descricao : item?.icone_nome}
                                    type={item.icone ? item.icone : (resposta && resposta == 1 ? 'aprovar2' : 'reprovar2')}
                                    className={class_aux}
                                    onClick={() => (interaction === false ? {} : handleSetResposta({resposta: item?.icone_tipo}))}
                                    readonly={(interaction === false ? true : false)}
                                />
                            )
                        }
                    }
                }
            })}

            {plano_de_acao_aux ? plano_de_acao : <></>}
        </>;
    }
    
    return(
        <Tr>
            <Td padding={'lg'} disableView={false} format={{input: false}} className={style.item}>
                <div className={'d-block d-lg-flex align-items-start justify-content-between' + ' ' + (alert ? style.alert : '')}>
                    <div>
                        {pergunta.nome}

                        {(pergunta.anexo_obrigatorio ? 
                            <span className="text-secondary ms-1">(Anexo obrigatório)</span>
                        :'')}
                    </div>

                    <div
                        className={'d-flex align-items-center mt-2 mb-3 my-lg-0'+ ' ' +style.actions + ' ' + (disabled ? style.disabled : '')}
                        onClick={() => (disabled ? toast('Carregando, aguarde') : {})}
                    >
                        {itens}
                    </div>
                </div>

                {/* ITENS PERSONALIZADOS */}
                {pergunta?.itens?.map((item, i) => {
                    let resposta_aux = respostaPersonalizada?.filter((elem) => elem?.item_id == item?.id)[0]?.value;

                    if(item?.alias === 'Select'){
                        return(
                            <div
                                className={'mt-2 '+(disabled ? style.disabled : '')}
                                onClick={() => (disabled ? toast('Carregando, aguarde') : {})}
                            >
                                <Select
                                    id={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    name={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    label={item?.nome}
                                    required={item?.obrigatorio ? true : false}
                                    options={item?.options}
                                    allowEmpty={false}
                                    value={resposta_aux}
                                    readonly={interaction === false ? true : false}
                                    onChange={(e) => handleSetRespostaPersonalizada(item?.id, e, item?.alias, true)}
                                />
                            </div>
                        )
                    }else if(item?.alias === 'Porcentagem'){
                        return(
                            <div
                                className={'mt-2 '+(disabled ? style.disabled : '')}
                                onClick={() => (disabled ? toast('Carregando, aguarde') : {})}
                            >
                                <Input
                                    id={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    name={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    label={item?.nome}
                                    required={item?.obrigatorio ? true : false}
                                    type={'text'}
                                    mask={'999'}
                                    maskChar={''}
                                    value={resposta_aux}
                                    readonly={interaction === false ? true : false}
                                    onChange={(e) => handleSetRespostaPersonalizada(item?.id, e?.target, item?.alias, false)}
                                    onFocusOut={() => validacao_motivo(undefined, undefined, undefined, true, respostaPersonalizada, undefined)}
                                />
                            </div>
                        )
                    }else if(item?.alias === 'Decimal'){
                        return(
                            <div
                                className={'mt-2 '+(disabled ? style.disabled : '')}
                                onClick={() => (disabled ? toast('Carregando, aguarde') : {})}
                            >
                                <Input
                                    id={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    name={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    label={item?.nome}
                                    required={item?.obrigatorio ? true : false}
                                    type={'money'}
                                    value={resposta_aux}
                                    readonly={interaction === false ? true : false}
                                    onChange={(e) => handleSetRespostaPersonalizada(item?.id, {value: e}, item?.alias, false)}
                                    onFocusOut={() => validacao_motivo(undefined, undefined, undefined, true, respostaPersonalizada, undefined)}
                                />
                            </div>
                        )
                    }else if(item?.alias === 'Checkbox'){
                        return(
                            <div
                                className={'mt-3 '+(disabled ? style.disabled : '')}
                                onClick={() => (disabled ? toast('Carregando, aguarde') : {})}
                            >
                                <p className="mb-2">{item?.nome}</p>
                                
                                <InputContainer
                                    id={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    name={'pergunta_'+pergunta?.id+'_item_'+item?.id}
                                    required={item?.obrigatorio ? true : false}
                                    display="block"
                                >
                                    {(item?.options?.map((option, i) => {
                                        return(
                                            <Input
                                                id={'pergunta_'+pergunta?.id+'_item_'+item?.id+'_option_'+option?.id}
                                                name={'pergunta_'+pergunta?.id+'_item_'+item?.id+'_option_'+option?.id}
                                                label={option?.nome}
                                                type="checkbox"
                                                required={false}
                                                value={option?.id}
                                                readonly={interaction === false ? true : false}
                                                checked={Array.isArray(resposta_aux) && resposta_aux?.includes(option?.id?.toString()) ? true : false}
                                                onChange={(e) => handleSetRespostaPersonalizada(item?.id, e?.target, item?.alias, true)}
                                            />
                                        )
                                    }))}
                                </InputContainer>
                            </div>
                        )
                    }
                })}

                {(interaction === false ? 
                    <>
                        {(comentario ?
                            <span className="d-block pre-line mt-2 text-secondary">{comentario}</span>
                        : '')}

                        {(pergunta?.resposta_motivo ?
                            <span className="d-block pre-line mt-2 text-secondary">{pergunta?.resposta_motivo}</span>
                        : '')}
                    </>
                :
                    (pergunta?.itens?.length === 0 || pergunta?.itens?.filter((elem) => elem?.icone === 'comment-alt')?.length > 0 ?
                        (resposta != 2 && resposta != 3 ? // SE A RESPOSTA FOR DIFERENTE DE 2 (NÃO CONFORME) E 3 (NÃO SE APLICA)
                            <Textarea
                                className="mt-2"
                                placeholder={'Comentário'}
                                height={30}
                                required={(pergunta.mensagem_obrigatorio == 3 && resposta == 1 || pergunta.mensagem_obrigatorio == 2 ? true : false)}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                onFocusOut={handleSetComentario}
                                readonly={(interaction === false ? true : false)}
                            ></Textarea>                                     
                        :'')
                    :'')
                )}

                {(resposta && (resposta == 2 || resposta == 3) && pergunta?.itens?.filter((elem) => elem?.alias === 'Não se aplica' || elem?.alias === 'Não conformidade')?.length > 0 ?
                    <>
                        <Textarea
                            className="mt-2"
                            placeholder={'Motivo'}
                            height={30}
                            required={true}
                            value={motivo}
                            readonly={(interaction === false ? true : false)}
                            onChange={(e) => setMotivo(e.target.value)}
                            onFocusOut={handleSetMotivo}
                        ></Textarea>

                        {/* SE A RESPOSTA FOR 2 (NÃO CONFORME, EXBIE OS INPUTS DE CLASSIFICAÇÃO) */}
                        {(resposta == 2 ?
                            <InputContainer>
                                <Input
                                    type="radio"
                                    name="classificacao"
                                    id="Urgente"
                                    value="Urgente"
                                    label="Urgente"
                                    checked={(classificacao == 'Urgente' ? true : null)}
                                    onChange={handleSetClassificacao}
                                    readonly={(interaction === false ? true : false)}
                                    className="mb-0"
                                />

                                <Input
                                    type="radio"
                                    name="classificacao"
                                    id="Médio"
                                    value="Médio"
                                    label="Médio"
                                    checked={(classificacao == 'Médio' ? true : null)}
                                    onChange={handleSetClassificacao}
                                    readonly={(interaction === false ? true : false)}
                                    className="mb-0"
                                />

                                <Input
                                    type="radio"
                                    name="classificacao"
                                    id="Melhoria"
                                    value="Melhoria"
                                    label="Melhoria"
                                    checked={(classificacao == 'Melhoria' ? true : null)}
                                    onChange={handleSetClassificacao}
                                    readonly={(interaction === false ? true : false)}
                                    className="mb-0"
                                />

                                <Input
                                    type="radio"
                                    name="classificacao"
                                    id="Outro"
                                    value="Outro"
                                    label="Outro"
                                    checked={(classificacao == 'Outro' ? true : null)}
                                    onChange={handleSetClassificacao}
                                    readonly={(interaction === false ? true : false)}
                                    className="mb-0"
                                />
                            </InputContainer>
                        :'')}
                    </>
                :'')}

                {/* SUPERVISÃO VISUAL */}
                {(pergunta?.modelos?.length > 0 || (tipo_sistema == 'supervisao' || tipo_sistema == 'antes_depois') ?
                    <div className={(interaction === false ? 'mt-2' : '') + ' mb-4'}>
                        <Foto
                            left={modelo}
                            right={foto}
                            modelo={(tipo_sistema == 'antes_depois' ? false : true)}
                            qtd={(pergunta?.qtd_foto ? pergunta?.qtd_foto : 1)}
                            transform={false}
                            camera={(camera === false ? false : true)}
                            integration={integration}
                            novo={true}
                            callback={handleSetSupervisao}
                            width={(job ? 'auto' : '')}
                            interaction={interaction}
                            reproved={{
                                adm: (pergunta.double_check == 2 ? true : false)
                            }}
                            hover={false}
                            params={{
                                relatorio_id: relatorio,
                                pergunta_id: pergunta.id,
                                checklist_id: checklist,
                                loja_id: loja,
                                job_id: job?.job_id,
                                anexos: pergunta?.anexos.map((item) => item.id),
                                supervisao: supervisao,
                                resposta: resposta
                            }}
                        />
                    </div>
                :'')}  
            </Td>
        </Tr>
    )
}
