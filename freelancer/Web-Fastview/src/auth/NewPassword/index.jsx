
import { useState, useEffect } from "react";

import Form from "../../components/body/form";
import Input from "../../components/body/form/input";
import style from './recover.module.scss';
import Button from "../../components/body/button";
import Icon from "../../components/body/icon";
import Title from "../../components/body/title";
import { useParams } from "react-router";

export default function NewPassword({callback}) {
    // PARAMS 
    const params = useParams(); 

    // ESTADOS
    const [password, setPassword] = useState('');
    const [password_confirmation, setRepeatPassword] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [buttonTitle, setButtonTitle] = useState('');

    // DADOS ENVIADOS NO FORMULÁRIO
    const data = {
        client:  global.client,
        password,
        password_confirmation,
        temp_token: params?.token
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

        setTimeout(() => {
            setPassword('');
            setRepeatPassword('');
        },500);
    }

    // VALIDAR SENHA
    useEffect(() => {
        
    },[password, password_confirmation]);

    return (
        <>
        
            <Title className="text-center justify-content-center mb-2" wrap={true}>
                Recuperação de senha
            </Title>

            <Form 
                api={window.backend+'/api/auth/recuperar-senha/token'}
                className={style.form}
                data={data}
                headers={{
                    'X-Requested-With': "XMLHttpRequest",
                }}
                withCredentials={true}
                withXSRFToken={true}
                status={handleFormStatus}
                toast={'Senha alterada com sucesso!'}
            >
                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                    label="Repetir Senha"
                    type="password"
                    value={password_confirmation}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    status={formStatus}
                    title={(!password ? 'Preencha uma nova senha' : (password === password_confirmation ? false : 'As senhas não conicidem'))}
                    disabled={password && password === password_confirmation ? false : true}
                    text={{
                        error: 'Token expirado, solicite a senha novamente',
                        success: 'Enviado com sucesso'
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
        </>
    )
}