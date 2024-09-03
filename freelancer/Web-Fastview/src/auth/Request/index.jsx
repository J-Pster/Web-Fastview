
import { useState, useContext, useEffect } from "react";

import Form from "../../components/body/form";
import Input from "../../components/body/form/input";
import style from './request.module.scss';
import Button from "../../components/body/button";
import Icon from "../../components/body/icon";
import SelectReact from '../../components/body/select';
import InputContainer from "../../components/body/form/inputcontainer";
import toast from "react-hot-toast";
import axios from "axios";

export default function Request({callback}) {    
    // ESTADOS
    const [empreendimento, setEmpreendimento] = useState('');
    const [loja, setLoja] = useState('');
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [modulosSelecionados, setModulosSelecionados] = useState([]);

    // ESTADOS DE OPTIONS
    const [optionsLoja, setOptionsLoja] = useState([]);
    const [optionsModulo, setOptionsModulo] = useState([]);

    // DADOS ENVIADOS NO FORMULÁRIO
    const data = {
        client:  global.client,
        empreendimento_id: empreendimento,
        loja_id: loja,
        nome: nome,
        cpf: cpf,
        login: login,
        email: email,
        senha: senha,
        modulos: modulosSelecionados
    }

    // RETORNO DA API
    const handleResponse = (e) => {
        if(e?.response?.data?.errors?.login){
            toast(e?.response?.data?.errors?.login[0]);
        }else if(e?.response?.data?.errors?.senha[0]){
            toast('A senha precisa conter ao menos 1 letra maísucula e 1 minúscula');
        }else{
            toast('Solicitação gerada com sucesso. Aguarde retorno da administração.');

            setEmpreendimento('');
            setLoja('');
            setNome('');
            setCpf('');
            setEmail('');
            setLogin('');
            setSenha('');
            setModulosSelecionados([]);
        }
    }

    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // RECUPERAR SENHA
    const handleLogin = () => {
        if(callback){
            callback({
                login: true
            })
        }
    }

    // SELECIONA MÓDULOS
    const handleSetModulos = (e) => {
        if(e.target.checked){
            setModulosSelecionados(modulosSelecionados => [...modulosSelecionados, parseInt(e.target.value)]);
        }else{
            setModulosSelecionados(modulosSelecionados.filter((elem) => elem != e.target.value));
        }
    }

    // TROCA OPTIONS DO SELECT DE LOJA TODA VEZ QUE MUDAR O EMPREENDIMENTO
    useEffect(() => {
        if(empreendimento){
            setOptionsLoja([]);

            axios({
                method: 'get',
                url: window.backend+'/api/v1/utilities/global/lojas',
                params: {
                    client: global.client,
                    empreendimento_id: empreendimento,
                    no_paginated: 1
                }
            }).then((response) => {
                if(response.data){
                    setOptionsLoja(response.data);
                }                
            });
        }
    },[empreendimento]);

    // GET OPTIONS DOS MÓDULOS
    useEffect(() => {
        if(empreendimento){
            setOptionsModulo([]);

            axios({
                method: 'get',
                url: window.backend+'/api/v1/utilities/global/sistemas',
                params: {
                    client: global.client,
                    empreendimento_id: empreendimento,
                    no_paginated: 1
                }
            }).then((response) => {
                if(response.data){
                    setOptionsModulo(response.data);
                }
            });
        }
    },[empreendimento]);

    // ZERA SELEÇÃO DE LOJA E MÓDULOS CASO TROQUE O EMPREENDIMENTO
    useEffect(() => {
        setLoja('');
        setModulosSelecionados([]);
    },[empreendimento]);

    // DEFINE O ID DO GRUPO A PARTIR DA URL
    let grupo_id;

    if(window.location.origin === 'https://ad.madnezz.com.br'){
        grupo_id = 3;
    }else if(window.location.origin === 'https://alqia.madnezz.com.br'){
        grupo_id = 10;
    }else if(window.location.origin === 'https://argo.madnezz.com.br'){
        grupo_id = 11;
    }else if(window.location.origin === 'https://ancar.madnezz.com.br'){
        grupo_id = 9;
    }else if(window.location.origin === 'https://carrefour.madnezz.com.br'){
        grupo_id = 2;
    }else{
        grupo_id = undefined;
    }

    return (
        <Form 
            api={window.backend+'/api/v1/preenchimentos/usuarios'}
            className={style.form}
            data={data}
            headers={{
                'X-Requested-With': "XMLHttpRequest",
            }}
            withCredentials={true}
            withXSRFToken={true}
            status={handleFormStatus}
            response={handleResponse}
        >
            <SelectReact
                id="empreendimento"
                name="empreendimento"
                label="Empreendimento"
                api={{
                    url: window.backend+'/api/v1/utilities/global/empreendimentos',
                    params: {
                        client: global.client,
                        no_paginated: 1,
                        grupo_id: grupo_id,
                        has_solicitacao: 1
                    }
                }}
                value={empreendimento}
                onChange={(e) => setEmpreendimento(e.value)}
            />

            <SelectReact
                id="loja"
                name="loja"
                label="Loja"
                options={optionsLoja}
                value={loja}
                allowEmpty={false}
                onChange={(e) => setLoja(e.value)}
                disabled={empreendimento ? false : true}
                title={empreendimento ? undefined : 'Selecione um empreendimento antes de continuar'}
            />

            <Input
                id="nome"
                name="nome"
                label="Nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />

            <Input
                id="cpf"
                name="cpf"
                label="CPF"
                type="text"
                value={cpf}
                mask={'999.999.999-99'}
                onChange={(e) => setCpf(e.target.value)}
            />

            <Input
                id="email"
                name="email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                id="login"
                name="login"
                label="Login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />

            <Input
                id="senha"
                name="senha"
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            {(optionsModulo.length > 0 ?
                <InputContainer
                    maxHeight={150}
                >
                    <p className="mb-2">Módulos</p>

                    {optionsModulo.map((item, i) => {
                        return(
                            <div key={'modulo_'+item.id}>
                                <Input
                                    type="checkbox"
                                    name={'modulo_'+item?.id}
                                    id={'modulo_'+item?.id}
                                    label={item?.nome}
                                    value={item?.id}
                                    checked={(modulosSelecionados.includes(item?.id) ? true : false)}
                                    onChange={handleSetModulos}
                                    className={'mb-0 ps-0 pt-0'}
                                    background={false}
                                    required={false}
                                />
                            </div>
                        )
                    })}
                </InputContainer>
            :'')}

            <Button
                type="submit"
                status={formStatus}
                text={{
                    error: 'Login inválido, tente novamente'
                }}
                className={global.btn_color}
            >
                Enviar
            </Button>

            <span className={style.span} onClick={handleLogin}>
                <Icon type="left" title={false} readonly={true} />
                Voltar
            </span>
        </Form>
    )
}