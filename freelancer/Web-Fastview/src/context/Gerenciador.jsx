import React, { useMemo, useCallback, createContext, useState } from "react";

export const GerenciadorContext = createContext();

export const GerenciadorProvider = ({ children }) => {
  const [grupoSelected, setGrupoSelected] = useState('');
  const [withoutAssociation, setWithoutAssociation] = useState(false);
  const [empreendimentoSelected, setEmpreendimentoSelected] = useState('');
  const [lojaSelected, setLojaSelected] = useState(false);
  const [moduloSelected, setModuloSelected] = useState(false);
  const [usuarioSelected, setUsuarioSelected] = useState(false);
  const [homeSelected, setHomeSelected] = useState(false);
  const [departamentoSelected, setDepartamentoSelected] = useState(false);
  const [cargoSelected, setCargoSelected] = useState(false);
  const [tipoJobSelected, setTipoJobSelected] = useState(1);
  const [editViewBase, setEditViewBase] = useState(false);
  const [editBaseCol, setEditBaseCol] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [jobInfo, setJobInfo] = useState(true);
  const [jobConfig, setJobConfig] = useState(false);
  const [jobSelected, setJobSelected] = useState('');
  const [searchLoja, setSearchLoja] = useState('');
  const [searchDepartamento, setSearchDepartamento] = useState('');
  const [searchCargo, setSearchCargo] = useState('');
  const [searchFornecedor, setSearchFornecedor] = useState('');
  const [searchModulo, setSearchModulo] = useState('');
  const [base, setBase] = useState(1);
  const [supervisaoInfo, setSupervisaoInfo] = useState(true);
  const [supervisaoConfig, setSupervisaoConfig] = useState(false);
  const [chamadosInfo, setChamadosInfo] = useState(true);
  const [chamadosConfig, setChamadosConfig] = useState(false);  

  // SCROLL AUTOMÁTICO
  const handleAutoScroll = useCallback((value) => {
    setAutoScroll(!autoScroll);
  }, [autoScroll]);

  // TROCA GRUPO
  const handleSetGrupoSelected = useCallback((value) => {
    setGrupoSelected(value);
  }, [grupoSelected]);

  // SEM GRUPO / ASSOCIAÇÃO
  const handleSetWithoutAssociation = useCallback((value) => {
    setWithoutAssociation(value);
  }, [withoutAssociation]);

  // TROCA EMPREENDIMENTO
  const handleSetEmpreendimentoSelected = useCallback((value) => {
    setEmpreendimentoSelected(value);
  }, [empreendimentoSelected]);

  // TROCA LOJA
  const handleSetLojaSelected = useCallback((value) => {
    setLojaSelected(value);
  }, [lojaSelected]);

  // TROCA MÓUDULO
  const handleSetModuloSelected = useCallback((value) => {
    setModuloSelected(value);
  }, [moduloSelected]);

  // TROCA USUÁRIO
  const handleSetUsuarioSelected = useCallback((value) => {
    setUsuarioSelected(value);
  }, [usuarioSelected]);

  // TROCA HOME
  const handleSetHomeSelected = useCallback((value) => {
    setHomeSelected(value);
  }, [homeSelected]);

  // TROCA DEPARTAMENTO
  const handleSetDepartamentoSelected = useCallback((value) => {
    setDepartamentoSelected(value);
  }, [departamentoSelected]);

  // TROCA CARGO
  const handleSetCargoSelected = useCallback((value) => {
    setCargoSelected(value);
  }, [cargoSelected]);

  // TROCA EDIT VIEW BASE
  const handleSetEditViewBase = useCallback((value) => {
    setEditViewBase(value);
  }, [editViewBase]);

  // COLUNA EDIÇÃO BASE
  const handleSetEditBaseCol = useCallback((value) => {
    setEditBaseCol(value);
  }, [editBaseCol]);

  // EDIÇÃO DE INFORMAÇÕES CHAMADOS
  const handleSetChamadosInfo = useCallback((value) => {
    setChamadosInfo(value);
  }, [chamadosInfo]);

  // EDIÇÃO DE CONFIGURAÇÕES CHAMADOS
  const handleSetChamadosConfig = useCallback((value) => {
    setChamadosConfig(value);
  }, [chamadosConfig]);

  // TROCA TIPO JOB
  const handleSetTipoJobSelected = useCallback((value) => {
    setTipoJobSelected(value);
  }, [tipoJobSelected]);

  // EDIÇÃO DE INFORMAÇÕES JOB
  const handleSetJobInfo = useCallback((value) => {
    setJobInfo(value);
  }, [jobInfo]);

  // EDIÇÃO DE CONFIGURAÇÕES JOB
  const handleSetJobConfig = useCallback((value) => {
    setJobConfig(value);
  }, [jobConfig]);

  // EDIÇÃO DE INFORMAÇÕES SUPERVISÃO
  const handleSetSupervisaoInfo = useCallback((value) => {
    setSupervisaoInfo(value);
  }, [supervisaoInfo]);

  // EDIÇÃO DE CONFIGURAÇÕES SUPERVISÃO
  const handleSetSupervisaoConfig = useCallback((value) => {
    setSupervisaoConfig(value);
  }, [supervisaoConfig]);

  // SELECIONA JOB
  const handleSetJobSelected = useCallback((value) => {
    setJobSelected(value);
  }, [jobSelected]);

  // FILTRO LOJA
  const handleSetSearchLoja = useCallback((value) => {
    setSearchLoja(value);
  }, [searchLoja]);

  // FILTRO DEPARTAMENTO
  const handleSetSearchDepartamento = useCallback((value) => {
    setSearchDepartamento(value);
  }, [searchDepartamento]);

  // FILTRO CARGO
  const handleSetSearchCargo = useCallback((value) => {
    setSearchCargo(value);
  }, [searchCargo]);

  // FILTRO FORNECEDOR
  const handleSetSearchFornecedor = useCallback((value) => {
    setSearchFornecedor(value);
  }, [searchFornecedor]);

  // FILTRO MÓDULO
  const handleSetSearchModulo = useCallback((value) => {
    setSearchModulo(value);
  }, [searchModulo]);

  // FILTRA BASE
  const handleSetBase = useCallback((value) => {
    setBase(value);
    setModuloSelected('');
  }, [base]);

  const value = useMemo(
    () => ({
      autoScroll,
      handleAutoScroll,
      grupoSelected,
      handleSetGrupoSelected,
      empreendimentoSelected,
      handleSetEmpreendimentoSelected,
      lojaSelected,
      handleSetLojaSelected,
      usuarioSelected,
      handleSetUsuarioSelected,
      homeSelected,
      handleSetHomeSelected,
      departamentoSelected,
      handleSetDepartamentoSelected,
      cargoSelected,
      handleSetCargoSelected,
      moduloSelected,
      handleSetModuloSelected,
      tipoJobSelected,
      handleSetTipoJobSelected,
      editViewBase,
      handleSetEditViewBase,
      editBaseCol,
      handleSetEditBaseCol,
      chamadosInfo,
      handleSetChamadosInfo,
      chamadosConfig,
      handleSetChamadosConfig,
      jobInfo,
      handleSetJobInfo,
      jobConfig,
      handleSetJobConfig,
      jobSelected,
      handleSetJobSelected,
      searchLoja,
      handleSetSearchLoja,
      searchDepartamento,
      handleSetSearchDepartamento,
      searchCargo,
      handleSetSearchCargo,
      searchFornecedor,
      handleSetSearchFornecedor,
      searchModulo,
      handleSetSearchModulo,
      base,
      handleSetBase,
      supervisaoConfig,
      handleSetSupervisaoConfig,
      supervisaoInfo,
      handleSetSupervisaoInfo,
      withoutAssociation,
      handleSetWithoutAssociation      
    }),
    [
      autoScroll,
      handleAutoScroll,
      grupoSelected,
      handleSetGrupoSelected,
      empreendimentoSelected,
      handleSetEmpreendimentoSelected,
      lojaSelected,
      handleSetLojaSelected,
      usuarioSelected,
      handleSetUsuarioSelected,
      homeSelected,
      handleSetHomeSelected,
      departamentoSelected,
      handleSetDepartamentoSelected,
      cargoSelected,
      handleSetCargoSelected,
      moduloSelected,
      handleSetModuloSelected,
      tipoJobSelected,
      handleSetTipoJobSelected,
      editViewBase,
      handleSetEditViewBase,
      editBaseCol,
      handleSetEditBaseCol,
      chamadosInfo,
      handleSetChamadosInfo,
      chamadosConfig,
      handleSetChamadosConfig,
      jobInfo,
      handleSetJobInfo,
      jobConfig,
      handleSetJobConfig,
      jobSelected,
      handleSetJobSelected,
      searchLoja,
      handleSetSearchLoja,
      searchDepartamento,
      handleSetSearchDepartamento,
      searchCargo,
      handleSetSearchCargo,
      searchFornecedor,
      handleSetSearchFornecedor,
      searchModulo,
      handleSetSearchModulo,
      base,
      handleSetBase,
      supervisaoConfig,
      handleSetSupervisaoConfig,
      supervisaoInfo,
      handleSetSupervisaoInfo,
      withoutAssociation,
      handleSetWithoutAssociation
    ]
  );

  return (
    <GerenciadorContext.Provider value={value}>{children}</GerenciadorContext.Provider>
  );
};
