import { Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../../components/header/navbar';
import Navbarlink from '../../components/header/navbar/navbarLink';
import { ChecklistProvider } from '../../context/Checklist';
import { JobsProvider } from "../../context/Jobs";
import GerenciadorChecklist from './Gerenciador/Checklist';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Auth';
import { setSession } from '../../_assets/js/global';

// PÁGINAS
import Lista from './Lista';
import DashboardChecklist from './Dashboard';
import Fotos from './Fotos';
import Macro from './Macro';
import Regua from './Regua';

export default function Checklist(props){
  // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
  useEffect(() => {
    setSession(props?.sistema_id, props?.id_apl, props?.permission, props?.pus);
    document.getElementById('page_title').innerHTML = global?.client_name + ' | Checklist';
  },[]);

  // PERMISSÃO DO USUÁRIO NO SISTEMA E ID APL
  if(props.permission){
    window.rs_permission_apl = props.pus ? props.pus : props.permission;
  }

  if(props.id_apl){
    window.rs_id_apl = props.id_apl;
  }
  
  // AUTH CONTEXT
  const { authInfo } = useContext(AuthContext);

  // NAVIGATE
  const navigate = useNavigate();

  // SE NÃO VIER DADO DO AUTH 
  if(!authInfo){  
    navigate('/');
  }

  // ESTADOS (ÍCONES E FILTROS)
  const [icons, setIcons] = useState(null);
  const [filters, setFilters] = useState(null);

  // DEFINE ÍCONES NAVBAR
  const handleSetIcons = (e) => {
    setIcons(e);
  }

  // DEFINE FILTROS NAVBAR
  const handleSetFilters = (e) => {
    setFilters(e);
  }

  return (
    <>
      <JobsProvider>  
        <ChecklistProvider>
          <Navbar
            filters={filters}
            icons={icons}
          >
            <Navbarlink link={'/systems/checklist-react/lista/'} name="Lista" icon="relatorio" />
            <Navbarlink link={'/systems/checklist-react/supervisao/'} name="Supervisão Visual" icon="camera" />   

            {(window.rs_permission_apl > 2 ?
              <Navbarlink link={'/systems/checklist-react/dashboard/'} name="Dashboard" icon="analytics" />
            :'')}

            {/* TELA DISPONÍVEL APENAS PARA A PROFARMA */}
            {(global.client === 'fastview' && window.rs_id_emp == 1050 ?
              <Navbarlink link={'/systems/checklist-react/regua/'} name="Régua de Competências" icon="trend" />
            :'')}

            {(window.rs_permission_apl > 3 ?
              <Navbarlink link={'/systems/checklist-react/gerenciador/'} name="Gerenciador" icon="cog" />
            :'')}
          </Navbar>
        
          <Routes>
              <Route path="/" index={true} element={ <Navigate to={'lista/'} replace /> } />
              <Route path="lista/" element={ <Lista icons={handleSetIcons} filters={handleSetFilters} /> } />
              <Route path="supervisao/" element={ <Fotos icons={handleSetIcons} filters={handleSetFilters} /> } />
              <Route path="macro/" element={ <Macro icons={handleSetIcons} filters={handleSetFilters} /> } />

              {(window.rs_permission_apl > 2 ?
                <Route path="dashboard/" element={<DashboardChecklist icons={handleSetIcons} filters={handleSetFilters} />} />
              :'')}

              {/* TELA DISPONÍVEL APENAS PARA A PROFARMA */}
              {(global.client === 'fastview' && window.rs_id_emp == 1050 ?
                <Route path="regua/" element={<Regua icons={handleSetIcons} filters={handleSetFilters} />} />
              :'')}

              {(window.rs_permission_apl > 3 ?
                <Route path="gerenciador/" element={<GerenciadorChecklist icons={handleSetIcons} filters={handleSetFilters} />} />
              :'')}
          </Routes>
        </ChecklistProvider>
      </JobsProvider>
    </>
  );
}
