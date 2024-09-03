import { useEffect, useState, useContext } from "react";

import Container from "../../../components/body/container";
import Row from "../../../components/body/row";
import { GlobalContext } from "../../../context/Global";

import Checklist from "./Gerencial/Checklist";
import Secao from "./Gerencial/Secao";
import Pergunta from "./Gerencial/Pergunta";
import Item from "./Gerencial/Item";
import Periodo from "./Estrutural/Periodo";
import Responsavel from "./Estrutural/Responsavel";
import Categoria from "./Estrutural/Categoria";
import Departamento from "./Gerencial/Departamento";
import Subcategoria from "./Estrutural/Subcategoria";

export default function Gerenciador({icons, filters, id_grupo, id_apl, id_emp, integrated}){
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // RECARREGA LISTA INICIAL AO ENTRAR NA PÁGINA
    useEffect(() => {
        if(integrated === false){
            handleSetFilter(true);
        }
    }, []);

    // ESTADOS
    const [gruposEdit, setGruposEdit] = useState(false);
    const [grupoId, setGrupoId] = useState(id_grupo);
    const [empreendimentoActive, setEmpreendimentoActive] = useState((id_emp ? id_emp : null));
    const [departamentoActive, setDepartamentoActive] = useState(null);
    const [checklistActive, setChecklistActive] = useState(null);
    const [secaoActive, setSecaoActive] = useState(null);
    const [perguntaActive, setPerguntaActive] = useState(null);
    const [categoriaActive, setCategoriaActive] = useState(null);
    const [modulo, setModulo] = useState(null);

    //MUDAR GERENCIADOR CHECKLIST/ESTRUTURA
    const [changeSystem, setChangeSystem] = useState('checklist');    

    //CALLBACK DO CLIQUE DE TROCA DE CHECKLIST/ESTRUTURA
    const handleCallbackChangeSystem = (e) => {
        setChangeSystem(e);
        setDepartamentoActive(null);
        setChecklistActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE DEPARTAMENTOS
    const handleCallbackDepartamento = (e) => {
        setDepartamentoActive(e.active);
        setChecklistActive(null);
        setSecaoActive(null);
        setPerguntaActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE CHECKLISTS
    const handleCallbackChecklist = (e) => {
        setChecklistActive(e.active);
        setSecaoActive(null);
        setPerguntaActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE SEÇÕES
    const handleCallbackSecao = (e) => {
        setSecaoActive(e.active);
        setPerguntaActive(null);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE PERGUNTAS
    const handleCallbackPergunta = (e) => {
        setPerguntaActive(e.active);
    }

    // CALLBACK DO CLIQUE COMPONENTE DE CATEGORIAS
    const handleCallbackCategoria = (e) => {
        setCategoriaActive(e.active);
    }

    //CALLBACK SALVAR O TIPO DE MÓDULO (SUPERVISÃO OU ANTES E DEPOIS) -> AFETA O CADASTRO DE PERGUNTA
    const handleCallBackModulo = (res) =>{
        setModulo(res)
    }

    // REMOVE FILTROS DO CABEÇALHO
    useEffect(() => {
        if(filters){
            filters('');
        }

        if(icons){
            icons('');
        }
    },[]);
    
    return(
        <Container>
            <Row wrap={(window.isMobile ? true : false)} disabled={(integrated !== false ? true : false)}>    
            {(changeSystem === 'checklist' ? 
                <>
                    <Departamento
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        id_apl={id_apl}
                        callback={handleCallbackDepartamento}
                        handleCallbackChangeSystem={handleCallbackChangeSystem}
                    />

                    <Checklist
                        emp={empreendimentoActive}
                        id_grupo={grupoId}
                        filter_departamento={departamentoActive}
                        id_apl={id_apl}
                        callback={handleCallbackChecklist}
                        disabled={(gruposEdit ? true : false)}
                        handleCallBackModulo={handleCallBackModulo}
                    />

                    {(checklistActive ? 
                        <Secao
                            checklist={checklistActive}
                            emp={empreendimentoActive}
                            id_grupo={grupoId}
                            id_apl={id_apl}
                            callback={handleCallbackSecao}
                            disabled={(gruposEdit ? true : false)}
                        />
                    :'')}

                    {(checklistActive && secaoActive ? 
                        <Pergunta
                            checklist={checklistActive}
                            secao={secaoActive}
                            emp={empreendimentoActive}
                            id_grupo={grupoId}
                            id_apl={id_apl}
                            callback={handleCallbackPergunta}
                            disabled={(gruposEdit ? true : false)}
                            modulo={modulo}
                        />
                    :'')}

                    {(checklistActive && secaoActive && perguntaActive ? 
                        <Item
                            checklist={checklistActive}
                            secao={secaoActive}
                            pergunta={perguntaActive}
                            emp={empreendimentoActive}
                            id_grupo={grupoId}
                            id_apl={id_apl}
                            disabled={(gruposEdit ? true : false)}
                        />
                    :'')}
                </> : 
                <>
                    <Periodo
                        handleCallbackChangeSystem={handleCallbackChangeSystem}
                        changeSystem={changeSystem}
                    />
                    <Responsavel
                        changeSystem={changeSystem}
                    />
                    <Categoria
                        changeSystem={changeSystem}
                        callback={handleCallbackCategoria}
                    />

                    {(categoriaActive &&
                        <Subcategoria
                            changeSystem={changeSystem}
                            categoria={categoriaActive}
                            // callback={handleCallbackCategoria}
                        />
                    )}
                </>
            )}
                
            </Row>
        </Container>
    )
}