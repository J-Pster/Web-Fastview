
import { useState, useEffect } from "react";

import Form from "../../components/body/form";
import Input from "../../components/body/form/input";
import style from './recover.module.scss';
import Button from "../../components/body/button";
import Icon from "../../components/body/icon";

export default function Login({callback, user}) {    
    // ESTADOS
    const [usuario, setUsuario] = useState(user);
    const [formStatus, setFormStatus] = useState('');
    const [email, setEmail] = useState('');

    // DADOS ENVIADOS NO FORMULÁRIO
    const data = {
        client:  global.client,
        recuperar: usuario
    }

    // RETORNO DA API
    const handleResponse = (e) => {
        if(e.email){
            setEmail(e.email);
            callback({
                recover: {
                    updateSwiper: true
                }
            })
        }else{
            setEmail('');
        }
    }

    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // RECUPERAR SENHA
    const handleLogin = () => {

        if(callback){
            callback({
                login: {
                    user: usuario
                }
            })
        }

        setTimeout(() => {
            setEmail('');
        },500);
    }

    // SEMPRE QUE RECEBER VALOR NA PROPS USER, ATUALIZA O CAMPO USUÁRIO
    useEffect(() => {
        setUsuario(user);
    },[user]);

    return (
        <Form 
            api={window.backend+'/api/auth/recuperar-senha'}
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
            <Input
                label="Login / CPF ou E-mail"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />

            {/* <div className="d-flex justify-content-center">
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                />
            </div> */}

            <Button
                type="submit"
                status={formStatus}
                text={{
                    error: 'Usuário não encontrado',
                    success: 'Enviado com sucesso'
                }}
                className={global.btn_color}
            >
                Enviar
            </Button>

            {/* MENSAGEM DE RETORNO DA API */}
            {(email ? 
                <div className="my-3">
                    <p className="text-center mb-0">
                        Recuperação de senha enviada para o e-mail:
                    </p>

                    <p className="text-center mb-0">
                        <b>{email}</b>
                    </p>

                    <p className="text-center mb-0">
                        Verifique sua caixa de entrada    
                    </p>
                </div>
            :'')}

            <span className={style.span} onClick={handleLogin}>
                <Icon type="left" title={false} readonly={true} />
                Voltar
            </span>
        </Form>
    )
}