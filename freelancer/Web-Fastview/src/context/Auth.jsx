import axios from "axios";
import React, { useMemo, createContext, useState, useEffect } from "react";
import { Buffer } from "buffer";
import toast from "react-hot-toast";
import { Image } from "react-bootstrap";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ESTADOS
    const [authInfo, setAuthInfo] = useState(null);
    const [loadAuth, setLoadAuth] = useState(true);
    const [authenticated, setAuthenticated] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if(window?.location?.pathname?.includes('nps/questionario/index.php')){
            // REDIRECIONAMERNTO NPS (NECESSÁRIO PARA CONTINUAR FUNCIONANDO A URL ANTIGA)
            if(window?.location?.href?.includes('sistemas.')){
                window.location.replace(window?.location?.href.replace('sistemas.', 'sistema.'));
            }
        }else{
            if(!token) window.location.href = '/auth/login';
        }
        
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

        const key = getTokenKey(token);
        const base64UserInfo = localStorage.getItem(`user:${key}`);

        if(base64UserInfo)
        {
            const strUTF = Buffer.from(base64UserInfo, 'base64').toString('utf-8');
            const userInfo = JSON.parse(strUTF);
            setAuthInfo(userInfo);
            setLoadAuth(false);
            setAuthenticated(true);
            setWindow({
                id_grupo: userInfo?.empreendimento?.id_grupo,
                empreendimento_id: userInfo?.empreendimento_id,
                empreendimento_original: userInfo?.empreendimento_original,
                id_emp_grupo: userInfo?.id_emp_grupo,
                id: userInfo?.id,
                loja_id: userInfo?.loja_id,
                nome: userInfo?.pessoa?.nome,
                token,
              });
              if(!loadingAuth)
            {
                getUserInfo({token, setAuthInfo, setLoadAuth, setAuthenticated, setLoadingAuth});
            }
        }
        else if(token && !authInfo)
        {
            getUserInfo({token, setAuthInfo, setLoadAuth, setAuthenticated, setLoadingAuth})
        }

    },[loadAuth]);

    const [throttle, setThrottle] = useState(false);

    useEffect(() => {

        let echo = window.Echo;

        if(window?.rs_id_emp && [26,5,'26','5'].includes(window?.rs_id_emp) && !throttle)
        {
            setThrottle(true);
            echo?.join(`${window.client}.presencia.empreendimento.${window.rs_id_emp}`)
                .here((users) => {
                    // console.log(users)
                })
                .joining((user) => {
                    toast(`${user?.name} fez login`, {
                        icon: "👋"
                    });
                })
                .leaving((user) => {
                    toast(`${user?.name} saiu`)
                })
                .error(console.error)
            setTimeout(() => setThrottle(false), 2000);
        }

    },[window?.rs_id_emp])

    const value = useMemo(() => ({
        authInfo,
        setAuthInfo,
        loadAuth,
        setLoadAuth,
        authenticated,
        setAuthenticated
    }), [authInfo, setAuthInfo, loadAuth, setLoadAuth, authenticated, setAuthenticated]);

    
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};



const getUserInfo = ({token, setAuthInfo, setLoadAuth, setAuthenticated, setLoadingAuth}) => {
    setLoadingAuth(true)
    axios({
        method: 'get',
        url: window.backend+'/api/auth/user',
        headers: {
            'Authorization': 'Bearer '+ token
        }
    }).then((response) => {

        setAuthInfo(response?.data?.data);
        setLoadAuth(false);
        setAuthenticated(true);
        setWindow({
          id_grupo: response?.data?.data?.empreendimento?.id_grupo,
          empreendimento_id: response?.data?.data?.empreendimento_id,
          empreendimento_original: response?.data?.data?.empreendimento_original,
          id_emp_grupo: response?.data?.data?.id_emp_grupo,
          id: response?.data?.data?.id,
          loja_id: response?.data?.data?.loja_id,
          nome: response?.data?.data?.pessoa?.nome,
          token,
        });
        const strB64 = Buffer.from(JSON.stringify(response?.data?.data), 'utf-8').toString('base64');
        const key = getTokenKey(token);
        localStorage.setItem(`user:${key}`,strB64)

    }).catch((err) => {
        console.error(err)
        localStorage.clear();
        setAuthenticated(false);
        window.location.href = 'auth/login'
    })
    .finally(() => setLoadingAuth(false));
}

/**
 * Set variables on window global object
 * @param {{id_grupo: number, empreendimento_id: number, empreendimento_original: number, id_emp_grupo: number, id: number, loja_id: number, nome: string, token: string}} windowData 
 */

const setWindow = ({id_grupo, empreendimento_id, empreendimento_original, id_emp_grupo, id, loja_id, nome, token}) => {
    window.rs_id_grupo = id_grupo; 
    window.rs_id_emp = empreendimento_id; 
    window.rs_id_emp_original = empreendimento_original; 
    window.rs_id_emp_grupo = id_emp_grupo; 
    window.rs_id_usr = id;
    window.rs_id_lja = loja_id;
    window.rs_name_usr = nome;
    window.token = token;
}

/**
 * Get key from token to store user info in localstorage
 * @param {string} token
 * @returns {string} tokenKey 
 */

const getTokenKey =  (token) => {
    return token.split(".")[2]
}