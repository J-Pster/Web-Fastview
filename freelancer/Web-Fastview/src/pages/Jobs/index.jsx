import { JobsProvider } from "../../context/Jobs";
import axios from 'axios';
import Router from './Router';
import Tutorial from "../../components/body/tutorial";
import { setSession } from "../../_assets/js/global";
import { useEffect } from "react";

export default function Jobs(props){
  // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
  useEffect(() => {
    setSession(props?.sistema_id, props?.id_apl, props?.permission, props?.pus);
  },[]);

  // DEFINE TITLE DA PÁGINA
  useEffect(() => {
    if(props.chamados){
      if(sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
        document.getElementById('page_title').innerHTML = global?.client_name + ' | Manutenção';
      }else if(sessionStorage.getItem('sistema_id') == global.sistema.comercial_carrefour){
        document.getElementById('page_title').innerHTML = global?.client_name + ' | Comercial';
      }else{
        document.getElementById('page_title').innerHTML = global?.client_name + ' | Chamados';
      }
    }else if(props.fases){
      document.getElementById('page_title').innerHTML = global?.client_name + ' | Fases';
    }else if(props.visitas){
      document.getElementById('page_title').innerHTML = global?.client_name + ' | Visitas';
    }else{
      document.getElementById('page_title').innerHTML = global?.client_name + ' | Jobs';
    }    
  },[sessionStorage.getItem('sistema_id')]);
  
  if(props.chamados){
    if(sessionStorage.getItem('sistema_id') == global.sistema.manutencao_madnezz){
      window.link = 'manutencao-react';
    }else if(sessionStorage.getItem('sistema_id') == global.sistema.comercial_carrefour){
      window.link = 'comercial-carrefour-react';
    }else{
      window.link = 'chamados-react';
    }
  }

  if(props.fases){
    window.link = 'fases-react';   
  }

  if(props.visitas){
    window.link = 'visitas-react';   
  }

  if(!props.chamados && !props.fases && !props.visitas){
    window.link = 'job-react';   
  }

  // OPTIONS STATUS
  window.optionsStatus = [
      { value: -2, label: 'Atrasado'},
      { value: -1, label: 'Em andamento'},
      { value: 3, label: 'Concluído com atraso'},
      { value: 2, label: 'Não tem'},
      { value: 1, label: 'Finalizado'},
      { value: 4, label: 'Adiado'}
  ];

  // VARIÁVEIS GLOBAIS (PROVISÓRIO)
  if((window.rs_id_emp == 492 || window.rs_id_emp == 707) && (window.rs_permission_apl === 'lojista' || window.rs_permission_apl === 'gerente' || window.rs_permission_apl === 'operador' || window.rs_permission_apl === 'checker')){
    // global.message = true;
    global.message = false;
  }else{
    global.message = false;
  }  

  return (
    <>
      {(props?.chamados ?
        <Tutorial
          title="Novo Chamados"
          url={'https://upload.madnezz.com.br/4bde4eb4ddcfb08e5fe4687d806201ab'}
        />
      :'')}

      <JobsProvider
        chamados={props.chamados}
        fases={props.fases}
        visitas={props.visitas}
      >
        <Router
          chamados={props.chamados}
          fases={props.fases}
          visitas={props.visitas}
          comunicados={props.comunicados}
          widget={props.widget}
        />
      </JobsProvider>  
    </>
  );
}
