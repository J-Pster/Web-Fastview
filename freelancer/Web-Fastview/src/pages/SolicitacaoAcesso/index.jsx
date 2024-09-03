import { useContext, useEffect } from 'react';

import { Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../../components/header/navbar';
import Navbarlink from '../../components/header/navbar/navbarLink';
import { useState } from 'react';
import Container from '../../components/body/container';
import { AuthContext } from '../../context/Auth';
import { setSession } from '../../_assets/js/global';

// PÁGINAS
import Lista from "./Lista";

export default function SolicitacaoAcesso(props) {
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
            <Navbar
                filters={filters}
                icons={icons}
            >
                <Navbarlink link={'lista/'} name="Lista" icon="analytics" />
            </Navbar>

            <Container>
                <Routes>
                    <Route path="/" index={true} element={<Navigate to={'lista/'} replace />} />
                    <Route path="lista/" element={<Lista icons={handleSetIcons} filters={handleSetFilters} />} />
                </Routes>
            </Container>
        </>
    );
}
