import { useContext, useEffect, useState } from 'react';

import { Routes, Route, useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/header/navbar';
import NavbarLink from '../../components/header/navbar/navbarLink';
import Container from '../../components/body/container';
import { setSession } from '../../_assets/js/global';

// PÁGINAS
import Lista from './Lista';
import { AuthContext } from '../../context/Auth';

export default function RelatorioAdesao({permission, id_apl, sistema_id, pus}){
  // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
  useEffect(() => {
    setSession(sistema_id, id_apl, permission, pus);
  },[]);

  // AUTH CONTEXT
  const { authInfo } = useContext(AuthContext);

  // NAVIGATE
  const navigate = useNavigate();

  // SE NÃO VIER DADO DO AUTH 
  if(!authInfo){  
    navigate('/');
  }

  const location = useLocation();

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
      <Navbar
        filters={filters}
        icons={icons}
      >
        <NavbarLink link={'lista/'} name="Lista" icon="relatorio" active={true} />
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" index element={ <Navigate to={'lista/'} replace /> }/>
          <Route path="lista/" index element={ <Lista filters={handleSetFilters} icons={handleSetIcons} /> } />
        </Routes>
      </Container>
    </>
  );
}
