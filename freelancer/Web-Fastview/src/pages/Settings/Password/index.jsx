import { useContext, useEffect, useState } from "react";

import style from './style.module.scss';
import Form from "../../../components/body/form";
import Input from "../../../components/body/form/input";
import Title from "../../../components/body/title";
import Button from "../../../components/body/button";
import Icon from "../../../components/body/icon";
import { AuthContext } from "../../../context/Auth";

export default function Password({weakPassword}){
    // AUTH CONTEXT
    const { authInfo, setAuthInfo } = useContext(AuthContext);

    // ESTADOS
    const [senha, setSenha] = useState('');
    const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
    const [statusForm, setStatusForm] = useState('');
    const [disabled, setDisabled] = useState(true);

    // ESTADOS DE VERIFICAÇÕES
    const [senhasIguais, setSenhasIguais] = useState(false);
    const [letraMaisucula, setLetraMaiuscula] = useState(false);
    const [caracterEspecial, setCaracterEspecial] = useState(false);
    const [numero, setNumero] = useState(false);
    const [minimo, setMinimo] = useState(false);

    // STATUS DO FORM
    const handleFormStatus = (e) => {
        setStatusForm(e);
    }

    // VALIDA FORMULÁRIO PARA ATIVAR O BOTÃO DE SUBMIT
    useEffect(() => {
        if(senha && senha == senhaConfirmacao){
            setSenhasIguais(true);
        }else{
            setSenhasIguais(false);
        }

        // VERIFICA SE POSSUI CARACTER ESPECIAL
        if(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(senha)){
            setCaracterEspecial(true);
        }else{
            setCaracterEspecial(false);
        }

        // VERIFICA SE TEM AO MENOS 6 CARACTERES
        if(senha.length>=6){
            setMinimo(true);
        }else{
            setMinimo(false);
        }

        // VERIFICA SE TEM ALGUM NÚMERO
        if(/\d/.test(senha)){
            setNumero(true);
        }else{
            setNumero(false);
        }

        // VERIFICA SE TEM LETRA MAÍUSCULA
        if(senha && senha !== senha.toLowerCase()){
            setLetraMaiuscula(true);
        }else{
            setLetraMaiuscula(false);
        }
    },[senha, senhaConfirmacao]);

    // VERIFICA SE PODE LIBERAR O BOTÃO
    useEffect(() => {
        if(senhasIguais && caracterEspecial && minimo && numero && letraMaisucula){
            setDisabled(false);
        }else{
            setDisabled(true);
        }
    },[senhasIguais, caracterEspecial, minimo, numero, letraMaisucula]);

    // CALLBACK DE RESPOSTA DO FORM
    const handleFormResponse = () => {
        setSenha('');
        setSenhaConfirmacao('');
        setAuthInfo(authInfo => ({...authInfo, ['senha_fraca']: false})); 
    }

    // DEFINE TÍTULO
    let title
    if(weakPassword){
        title = 'Redefina sua senha';
    }else{
        title = 'Atualizar senha';
    }

    return(
        <>
            <Title>{title}</Title>

            <Form
                api={window.backend+'/api/v1/usuarios/troca/password'}
                method="put"
                data={{
                    password: senha
                }}
                status={handleFormStatus}
                response={handleFormResponse}
                toast={'Senha atualizada com sucesso'}
                className={style.form}
            >
                <Input
                    type="password"
                    name="usuario_senha"
                    label="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder={'*******'}
                    required={true}
                />

                <Input
                    type="password"
                    name="usuario_senha_confirmacao"
                    label="Repita a senha"
                    value={senhaConfirmacao}
                    onChange={(e) => setSenhaConfirmacao(e.target.value)}
                    placeholder={'*******'}
                    required={true}
                />

                <div className="mt-3">
                    <div className="d-flex align-items-center">
                        <Icon
                            type={letraMaisucula ? 'aprovar' : 'reprovar'}
                            readonly
                            title={false}
                            className={'me-1 '+(letraMaisucula ? 'text-success' : 'text-danger')}
                        />
                        <p className="mb-0">                            
                            Ao menos 1 letra maíscula.
                        </p>
                    </div>

                    <div className="d-flex align-items-center">
                        <Icon
                            type={caracterEspecial ? 'aprovar' : 'reprovar'}
                            readonly
                            title={false}
                            className={'me-1 '+(caracterEspecial ? 'text-success' : 'text-danger')}
                        />
                        <p className="mb-0">                        
                            Ao menos 1 caracter especial (!@#$%&*).
                        </p>
                    </div>

                    <div className="d-flex align-items-center">
                        <Icon
                            type={minimo ? 'aprovar' : 'reprovar'}
                            readonly
                            title={false}
                            className={'me-1 '+(minimo ? 'text-success' : 'text-danger')}
                        />
                        <p className="mb-0">                        
                            Ao menos 6 caracteres.
                        </p>
                    </div>

                    <div className="d-flex align-items-center">
                        <Icon
                            type={numero ? 'aprovar' : 'reprovar'}
                            readonly
                            title={false}
                            className={'me-1 '+(numero ? 'text-success' : 'text-danger')}
                        />
                        <p className="mb-0">                        
                            Ao menos 1 número.
                        </p>
                    </div>

                    <div className="d-flex align-items-center">
                        <Icon
                            type={senhasIguais ? 'aprovar' : 'reprovar'}
                            readonly
                            title={false}
                            className={'me-1 '+(senhasIguais ? 'text-success' : 'text-danger')}
                        />
                        <p className="mb-0">                        
                            As senhas precisam ser iguais.
                        </p>
                    </div>
                </div>

                <Button
                    type="submit"
                    status={statusForm}
                    disabled={disabled}
                >
                    Salvar
                </Button>
            </Form>
        </>
    )
}
