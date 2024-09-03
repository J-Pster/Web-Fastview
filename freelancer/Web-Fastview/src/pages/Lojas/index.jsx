import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GerenciadorProvider } from '../../context/Gerenciador';
import Navbar from '../../components/header/navbar';
import NavbarLink from '../../components/header/navbar/navbarLink';
import Container from '../../components/body/container';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Auth';
import { useState } from 'react';
import { setSession } from '../../_assets/js/global';

// PÁGINAS
import Lista from './Lista';

export default function Lojas(props){
  // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
  useEffect(() => {
    setSession(props?.sistema_id, props?.id_apl, props?.permission, props?.pus);
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

  // ESTADOS (ÍCONES E FILTROS)
  const [icons, setIcons] = useState(null);

  // DEFINE ÍCONES NAVBAR
  const handleSetIcons = (e) => {
      setIcons(e);
  }

  return (
    <GerenciadorProvider>
      <Navbar
        icons={icons}
      >
        <NavbarLink link={'lista/'} name="Lista" icon="analytics" active={true} />
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" index element={ <Navigate to={'lista/'} replace /> }/>
          <Route path="lista/" index element={ <Lista icons={handleSetIcons} /> }/>
        </Routes>
      </Container>
    </GerenciadorProvider>
  );
}
