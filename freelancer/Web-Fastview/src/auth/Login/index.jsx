
import { useState, useEffect } from "react";

import Form from "../../components/body/form";
import Input from "../../components/body/form/input";
import style from './login.module.scss';
import Button from "../../components/body/button";

export default function Login({callback}) {
    // AUTH CONTEXT
    const [loading, setLoading] = useState(true);
    
    // ESTADOS
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [formStatus, setFormStatus] = useState('');

    // DADOS ENVIADOS NO FORMULÁRIO
    const data = {
        client:  global.client,
        device: 'web',
        login: usuario,
        password: senha,
    }

    // RETORNO DA API
    const handleResponse = (e) => {
        if(e.token){
            localStorage.setItem("token", e.token);
            document.cookie = "token="+e.token+"; SameSite=None; Secure";
            window.location.href = '/'
        }
    }

    const handleFormStatus = (e) => {
        setFormStatus(e);
    }

    // RECUPERAR SENHA
    const handleRecover = () => {
        if(callback){
            callback({
                recover: {
                    user: usuario
                }
            })
        }
    }

    // SOLICITAR ACESSO
    const handleRequest = () => {
        if(callback){
            callback({
                request: true
            })
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){ 
            return window.location.href = '/'
        }
        else{
            setLoading(false);
        }
    },[]);

    return (
      <>
        {loading ? <></> :<Form
          api={window.backend+"/api/auth/login"}
          className={style.form}
          data={data}
          headers={{
            "X-Requested-With": "XMLHttpRequest",
          }}
          withCredentials={true}
          withXSRFToken={true}
          status={handleFormStatus}
          response={handleResponse}
        >
          <Input
            label="Usuário"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            validation={false}
            onChange={(e) => setSenha(e.target.value)}
          />

          <span className={style.span} onClick={handleRecover}>
            Esqueci minha senha
          </span>

          <Button
            type="submit"
            status={(formStatus == 'loading' || formStatus == 'success' ? 'loading' : formStatus)}
            text={{
              error: "Login inválido, tente novamente",
            }}
            className={global?.btn_color}
          >
            Entrar
          </Button>

          <div className="text-center mt-3">
            <span className={style.span} onClick={handleRequest}>
              ou <span className="text-primary">Solicitar acesso</span>
            </span>
          </div>
        </Form>}
      </>
    );
}