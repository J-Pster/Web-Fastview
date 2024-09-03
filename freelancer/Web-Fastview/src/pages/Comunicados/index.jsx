import { useState, useContext, useEffect } from 'react';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../../components/header/navbar';
import NavbarLink from '../../components/header/navbar/navbarLink';
import { AuthContext } from '../../context/Auth';
import { JobsProvider } from '../../context/Jobs';
import { setSession } from '../../_assets/js/global';

// PÁGINAS
import Lista from './Lista';
import Gerenciador from './Gerenciador';
import Tutorial from '../../components/body/tutorial';

export default function Comunicados(props){
  // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
  useEffect(() => {
    setSession(props?.sistema_id, props?.id_apl, props?.permission, props?.pus);
    document.getElementById('page_title').innerHTML = global?.client_name + ' | Comunicados';
  },[]);

  // PERMISSÃO DO USUÁRIO NO SISTEMA E ID APL
  if(props.pus){
    window.rs_permission_apl = props.pus;
  }else{
    window.rs_permission_apl = props.permission;
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

  // FILTROS E ÍCONES
  const [filters, setFilters] = useState(null);
  const [icons, setIcons] = useState(null);

  // SETA FILTROS
  const handleSetFilters = (e) => {
    setFilters(e);
  }

  // SETA ÍCONES
  const handleSetIcons = (e) => {
    setIcons(e);
  }

  return (
    <>
      <Tutorial
        title="Novo Comunicados"
        url={'https://upload.madnezz.com.br/ea2293813484264c334f7d8625a81a40'}
      />

      <JobsProvider
        chamados={props.chamados}
        fases={props.fases}
        visitas={props.visitas}
      >
        <Navbar
          icons={icons}
          filters={filters}
        >
          <NavbarLink link={'lista/'} name="Lista" icon="relatorio" active={true} />

          {(window.rs_permission_apl === 'master' || window.rs_permission_apl == 4 ?
            <NavbarLink link={'gerenciador/'} name="Gerenciador" icon="cog" active={true} />
          :'')}
        </Navbar>

        <Routes>
          <Route path="/" index element={ <Navigate to={'lista/'} replace /> }/>
          <Route path="lista/" index element={ <Lista filters={handleSetFilters} icons={handleSetIcons} /> } />
          <Route path="lista/:id" index element={ <Lista filters={handleSetFilters} icons={handleSetIcons} /> } />

          {(window.rs_permission_apl === 'master' || window.rs_permission_apl == 4 ?
            <Route path="gerenciador/" index element={ <Gerenciador filters={handleSetFilters} icons={handleSetIcons} /> } />
          :'')}
        </Routes>
      </JobsProvider>
    </>
  );
}
