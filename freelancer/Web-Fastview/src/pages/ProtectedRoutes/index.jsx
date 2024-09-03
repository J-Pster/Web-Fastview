import React, { Suspense, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/Auth';

import { Route, Routes, useParams } from 'react-router-dom';
import Nav from '../../components/header/nav';
import { RoutesMap } from './routesMap';

// HOMES
import HomeSystems from "../Homes/Systems";
import Loader from '../../components/body/loader';
import Settings from '../Settings';
import Container from '../../components/body/container';
import TrocarEmpreendimento from '../TrocarEmpreendimento';
import { useNavigate } from 'react-router';
import Password from '../Settings/Password';

function ProtectedRoutes() {
  // AUTH CONTEXT
  const { authInfo } = useContext(AuthContext);

  // NAVIGATE
  const navigate = useNavigate();

  // PARAMS URL
  const params = useParams();

  // DEFINE QUAL A HOME DO EMPREENDIMENTO LOGADO
  let home_aux;

  // PEDE AUTORIZAÇÃO DO USUÁRIO PARA EXIBIR NOTIFICAÇÕES
  useEffect(() => {
    if(!/iPad|iPhone|iPod/.test(navigator.userAgent)){
      Notification.requestPermission((response) => {
        // console.log('notification: ',response);
      });
    }
  },[]);

  if(authInfo){
    home_aux = <HomeSystems />;
  }

  // NAVIGATE PRO JOBS CASO O HOME ID SEJA 10
  useEffect(() => {
    if(authInfo){
      if(authInfo?.home_id == 10 && window.location.pathname === '/'){
        navigate('/systems/job-react');
      }
    }
  },[authInfo]);  

  return (
    <>
      {(authInfo ?
        <>
          {(authInfo ?
              <header>
                <Nav />
              </header>
          :'')}
          
          {(authInfo &&
            (authInfo?.senha_fraca ? // TROCAR POR CAMPO SENHA FRACA
              <Container>
                <Password weakPassword={true} />
              </Container>
            :
              (params['*'] === '' && authInfo ?
                home_aux
              :
                <Routes>
                  {/* TELA DE CONFIGURAÇÕES DO USUÁRIO E TROCA DE EMPREENDIMENTO */}
                  {(authInfo && <Route path="/configuracoes" element={<Settings />} />)}
                  {(authInfo && authInfo?.troca_empreendimento == 1 && <Route path="/trocar-empreendimento" element={<TrocarEmpreendimento />} />)}

                  {authInfo?.acessos.map((item, i) => {
                    // let permission = item?.pus ? item?.pus : item?.usuario_permissao;

                    // A FAMOSA GAMBIARRA PRA REMOVER OS SISTEMAS ANTIGOS DA FASTVIEW E MALLTECH ENQUANTO AINDA ESTÃO USANDO
                    if(global.client !== 'fastview' || (global.client === 'fastview' && item.id !== 223 && item.id !== 231 && item.id !== 230)){
                      if(global.client !== 'malltech' || (global.client === 'malltech' && item.id !== 221 && item.id !== 223 && item.id !== 224)){
                        let url_aux = item?.url?.replace('/v2','');

                        // AJUSTA LINK DA NEWS PARA A FASTVIEW
                        if(item?.id == 188){
                          url_aux = 'systems/news'
                        }
                        
                        return (
                          <Route
                            key={"route_system_" + item?.id}
                            path={(item?.id_aux ? ('/'+url_aux+'/:id_aux') : ('/'+url_aux+'/*'))}
                            element={
                              <Suspense
                                fallback={
                                  <Container className="d-flex align-items-center justify-content-center">
                                    <Loader />
                                  </Container>
                                }
                              >
                                <RoutesMap
                                  sistema_id={item?.id}
                                  id_apl={item?.id_apl}
                                  permission={item?.usuario_permissao}
                                  pus={item?.pus}
                                />
                              </Suspense>
                            }
                          />
                        );
                      }
                    }
                  })}
                </Routes>
              )
            )
          )}
        </>
      :
        <div className="d-flex align-items-center justify-content-center w-100" style={{height: '100vh'}}>
          <Loader />
        </div>
      )}
    </>
  );
}

export default ProtectedRoutes