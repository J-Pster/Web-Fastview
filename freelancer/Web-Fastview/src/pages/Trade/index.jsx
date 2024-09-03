import { Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/header/navbar';
import NavbarLink from '../../components/header/navbar/navbarLink';
import { TradeProvider } from "../../context/Trade";
import {ReduxProvider} from "./States/TradeProvider";
import { AuthContext } from "../../context/Auth";
import { JobsProvider } from '../../context/Jobs';
import { setSession } from '../../_assets/js/global';

// PÁGINAS
import Lista from './Lista';
import DashboardTrade from './Dashboard';
import Fotos from './Fotos';
import GerenciadorTrade from './Gerenciador';

export default function Trade(props) {
  // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
  useEffect(() => {
    setSession(props?.sistema_id, props?.id_apl, props?.permission, props?.pus);
  },[]);

  // AUTH CONTEXT
  const { authInfo } = useContext(AuthContext);

  // NAVIGATE
  const navigate = useNavigate();

  // SE NÃO VIER DADO DO AUTH
  if (!authInfo) {
    navigate("/");
  }

  // ESTADOS (ÍCONES E FILTROS)
  const [icons, setIcons] = useState(null);
  const [filters, setFilters] = useState(null);

  // DEFINE ÍCONES NAVBAR
  const handleSetIcons = (e) => {
    setIcons(e);
  };

  // DEFINE FILTROS NAVBAR
  const handleSetFilters = (e) => {
    setFilters(e);
  };

  return (
    <>
      <ReduxProvider>
        <JobsProvider>
          <Navbar icons={icons} filters={filters}>
            <NavbarLink
              link={"/systems/trade-react/lista/"}
              name="Lista"
              icon="relatorio"
            />
            <NavbarLink
              link={"/systems/trade-react/fotos/"}
              name="Supervisão"
              icon="camera"
            />
            <NavbarLink
              link={"/systems/trade-react/dashboard/"}
              name="Dashboard"
              icon="analytics"
            />
            <NavbarLink
              link={"/systems/trade-react/gerenciador/"}
              name="Gerenciador"
              icon="cog"
            />
            {/* <NavbarLink
              link={"/systems/trade-react/job-card/"}
              name="JobCard"
              icon="cog"
            /> */}
          </Navbar>
          {/* <Sidebar>
        <SidebarLink link={'/systems/trade-react/lista/'} name="Lista" />
        <SidebarLink link={'/systems/trade-react/dashboard/'} name="Dashboard" />
      </Sidebar> */}

          <TradeProvider>
            <Routes>
              <Route
                path="/"
                index={true}
                element={
                  <Navigate
                    to={"/systems/trade-react/lista/"}
                    replace
                  />
                }
              />
              <Route
                path="lista/"
                element={
                  <Lista icons={handleSetIcons} filters={handleSetFilters} />
                }
              />
              <Route
                path="dashboard/"
                element={
                  <DashboardTrade
                    icons={handleSetIcons}
                    filters={handleSetFilters}
                  />
                }
              />
              <Route
                path="fotos/"
                element={
                  <Fotos icons={handleSetIcons} filters={handleSetFilters} />
                }
              />
              <Route
                path="gerenciador/"
                element={
                  <GerenciadorTrade
                    icons={handleSetIcons}
                    filters={handleSetFilters}
                  />
                }
              />
              {/* <Route
                path="job-card/"
                element={
                  <TradeJobCard
                    icons={handleSetIcons}
                    filters={handleSetFilters}
                  />
                }
              /> */}
            </Routes>
          </TradeProvider>
        </JobsProvider>
      </ReduxProvider>
    </>
  );
}