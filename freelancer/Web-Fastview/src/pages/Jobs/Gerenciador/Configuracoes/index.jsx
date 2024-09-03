import { useEffect, useState, useContext } from "react";

import Row from "../../../../components/body/row";
import Empreendimento from "./Empreendimento";
import Categorias from "./Categorias";
import Subcategorias from "./Subcategorias";
import { GlobalContext } from "../../../../context/Global";
import Tipo from "./Tipo";
import Modulos from "./Modulos";
import Usuarios from "./Usuarios";
import Acessos from "./Acessos";
import Colunas from "./Colunas";
import Personalizacao from "./Personalizacao";
import Container from "../../../../components/body/container";

export default function Gerenciador({icons, filters, id_grupo, id_apl, id_emp, integrated, fases, chamados, visitas, comunicados}){
    // GLOBAL CONTEXT
    const { handleSetFilter, loadingCalendar, handleSetFixFilterModule, handleSetFirstLoad, handleSetFilterModule } = useContext(GlobalContext);

    // RECARREGA LISTA INICIAL AO ENTRAR NA PÁGINA
    useEffect(() => {
        if(integrated === false){
            handleSetFilter(true);
            handleSetFilterModule(null);
            loadingCalendar(true);
            handleSetFixFilterModule(false);
            handleSetFirstLoad(true);
        }
    }, []);

    // ESTADOS
    const [gruposEdit, setGruposEdit] = useState(false);
    const [grupoId, setGrupoId] = useState(id_grupo);
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [empreendimentoActive, setEmpreendimentoActive] = useState((id_emp ? id_emp : null));
    const [categoriaActive, setCategoriaActive] = useState(null);
    const [tipoActive, setTipoActive] = useState(null);
    const [moduloActive, setModuloActive] = useState(null);
    const [colunaActive, setColunaActive] = useState(null);
    const [usuarioActive, setUsuarioActive] = useState(null);

    // CALLBACK DO CLIQUE COMPONENTE DE EMPREENDIMENTOS
    const handleCallbackEmpreendimento = (e) => {
        setGrupoId(e?.id_grupo);
        setEmpreendimentoActive(e.active);
        setCategoriaActive(null);
        setTipoActive(null);
        setModuloActive(null);
        setUsuarioActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE TIPO
    const handleCallbackTipo = (e) => {
        setTipoActive(e.active);
        setModuloActive(null);
        setCategoriaActive(null);
        setUsuarioActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE CATEGORIAS
    const handleCallbackCategoria = (e) => {
        setCategoriaActive(e.active);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE MÓDULOS
    const handleCallbackModulo = (e) => {
        setModuloActive(e.active);
        setColunaActive(null);
        setUsuarioActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE COLUNAS
    const handleCallbackColuna = (e) => {
        setColunaActive(e.active);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE USUÁRIOS
    const handleCallbackUsuario = (e) => {
        setUsuarioActive(e.active);
    }

    // REMOVE FILTROS DO CABEÇALHO
    useEffect(() => {
        if(filters){
            filters(<></>);
        }

        if(icons){
            icons(<></>);
        }
    },[]);
    
    return(
        <Container>
            <Row wrap={(window.isMobile ? true : false)} disabled={(integrated !== false ? true : false)}>
                {(window.rs_id_emp == 26 && !id_emp ? 
                    <Empreendimento
                        items={empreendimentos}   
                        callback={handleCallbackEmpreendimento}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')}

                {(empreendimentoActive ? 
                    <Tipo
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        tipo={tipoActive}
                        callback={handleCallbackTipo}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        comunicados={comunicados}
                        visitas={visitas}
                    />
                :'')}

                {(empreendimentoActive && (tipoActive === 'modulos' || tipoActive === 'personalizacao') ? 
                    <Modulos
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        tipo={tipoActive}
                        callback={handleCallbackModulo}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')}

                {(empreendimentoActive && tipoActive === 'modulos' && moduloActive ? 
                    <Colunas
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        modulo={moduloActive}
                        callback={handleCallbackColuna}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')}

                {/* {(empreendimentoActive && tipoActive === 'personalizacao' && moduloActive ? 
                    <Personalizacao
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        modulo={moduloActive}
                        callback={handleCallbackColuna}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')} */}

                {/* {(empreendimentoActive && moduloActive ? 
                    <Usuarios
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        callback={handleCallbackUsuario}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')}

                {(empreendimentoActive && moduloActive && usuarioActive ? 
                    <Acessos
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        usuario={usuarioActive}
                        // callback={handleCallbackCategoria}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')} */}
                
                {(empreendimentoActive && tipoActive === 'categorias' ? 
                    <Categorias
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        callback={handleCallbackCategoria}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')}

                {(categoriaActive ? 
                    <Subcategorias
                        category={categoriaActive}
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        // callback={handleCallbackLoja}
                        disabled={(gruposEdit ? true : false)}
                        fases={fases}
                        chamados={chamados}
                        visitas={visitas}
                    />
                :'')}
            </Row>
        </Container>
    )
}