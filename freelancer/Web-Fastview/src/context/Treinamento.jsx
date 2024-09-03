import axios from "axios";
import React, { useMemo, useCallback, createContext, useState } from "react";

export const TreinamentoContext = createContext();

export const TreinamentoProvider = ({ children }) => {
    const [level, setLevel] = useState(0);
    const [cursoId, setCursoId] = useState('');
    const [cursoNome, setCursoNome] = useState('');
    const [cursoInfo, setCursoInfo] = useState('');
    const [filterName, setFilterName] = useState('');
    const [view, setView] = useState(1);
    
    const [categoriaNome, setCategoriaNome] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [subcategoriaNome, setSubcategoriaNome] = useState('');
    const [subcategoriaId, setSubcategoriaId] = useState('');
    const [subsubcategoriaNome, setSubsubcategoriaNome] = useState('');
    const [subsubcategoriaId, setSubsubcategoriaId] = useState('');
    const [subsubsubcategoriaNome, setSubsubsubcategoriaNome] = useState('');
    const [subsubsubcategoriaId, setSubsubsubcategoriaId] = useState('');

    // TROCA VISUALIZAÇÃO (ARQUIVO / QUESTIONÁRIO)
    const handleSetView = useCallback((value) => {
        setView(value);
    }, [view]);

    // FILTRO POR NOME
    const handleSetFilterName = useCallback((value) => {
        setFilterName(value);
    }, [filterName]);

    // SETA TELA DE VISUALIZAÇÃO
    const handleSetLevel = useCallback((value) => {
        setLevel(value);
    }, [level]);

    // SETA ID DO CURSO SELECIONADO
    const handleSetCursoId = useCallback((value) => {
        setCursoId(value);
    },[cursoId])

    // SETA NOME DO CURSO SELECIONADO
    const handleSetCursoNome = useCallback((value) => {
        setCursoNome(value);
    },[cursoNome]);

    // SETA INFORMAÇÕES DO CURSO SELECIONADOA
    const handleSetCursoInfo = useCallback((value) => {
        setCursoInfo(value);
    },[cursoInfo]);

    // SETA CURSO
    const handleCurso = useCallback((id, nome) => {
        setCursoId(id);
        setCursoNome(nome);

        axios.get(window.host+'/systems/treinamento/api/lista.php?do=get_file&aux_id='+id).then((response) => {
            setCursoInfo(response.data);
        })
    },[]);

    // SETA PASTA
    const handleFolders = useCallback((levelClicked, id, nome) => {
        handleSetLevel(levelClicked);

        if((level)==0){
            setCategoriaNome(nome);
            setCategoriaId(id);
        }else if((level)==1){
            setSubcategoriaNome(nome);
            setSubcategoriaId(id);
        }else if((level)==2){
            setSubsubcategoriaNome(nome);
            setSubsubcategoriaId(id);
        }else if((level)==3){
            setSubsubsubcategoriaNome(nome);
            setSubsubsubcategoriaId(id);
        }

        axios.get(window.host+'/systems/treinamento/api/lista.php?do=get_foldersFiles&level='+levelClicked+'&aux_id='+id).then((response) => {
            // setCursoInfo(response.data);
        })
    },[]);

    const value = useMemo(
        () => ({
            level,
            handleSetLevel,
            cursoId,
            handleCurso,
            cursoInfo,
            handleSetCursoInfo,
            cursoNome,
            handleSetCursoNome,
            handleSetCursoId,
            handleFolders,
            filterName,
            handleSetFilterName,
            view,
            handleSetView
        }),
        [
            level,
            handleSetLevel,
            cursoId,
            handleCurso,
            cursoInfo,
            handleSetCursoInfo,
            cursoNome,
            handleSetCursoNome,
            cursoId,
            handleSetCursoId,
            handleFolders,
            filterName,
            handleSetFilterName,
            view,
            handleSetView
        ]
    );

    return (
        <TreinamentoContext.Provider value={value}>{children}</TreinamentoContext.Provider>
    );
};
