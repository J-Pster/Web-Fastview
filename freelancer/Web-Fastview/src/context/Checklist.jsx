import React, { useMemo, useCallback, createContext, useState } from "react";

export const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  const [view, setView] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [editView, setEditView] = useState(false);
  const [filterSupervisao, setFilterSupervisao] = useState('');
  const [filterDate, setFilterDate] = useState(new Date(window.currentYear,window.currentMonth-1,window.currentDay));
  const [filterDateMonth, setFilterDateMonth] = useState(new Date(window.currentYear,window.currentMonth-1,window.currentDay));
  const [filterLoja, setFilterLoja] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterStatusSupervisor, setFilterStatusSupervisor] = useState([]);
  const [filterEmpreendimento, setFilterEmpreendimento] = useState([]);
  const [pageError, setPageError] = useState(false);
  const [optionsSupervisao, setOptionsSupervisao] = useState([]);

  // TROCA TELA DE VISUALIZAÇÃO
  const handleSetView = useCallback((value) => {
    setView(value);
  }, [view]);

  // SETA CLIQUE
  const handleSetClicked = useCallback((value) => {
    setClicked(value);
  }, [clicked]);

  // EDIÇÃO
  const handleSetEditView = useCallback((value) => {
    setEditView(value);
  }, [editView]);

  // FILTRO DE SUPERVISÃO
  const handleSetFilterSupervisao = useCallback((value) => {
    setFilterSupervisao(value);
  }, [filterSupervisao]);

  // FILTRO DE DATA
  const handleSetFilterDate = useCallback((value) => {
    setFilterDate(value);
  },[filterDate]);

  // FILTRO DE DATA MÊS
  const handleSetFilterDateMonth = useCallback((value) => {
    setFilterDateMonth(value);
  },[filterDateMonth]);

  // FILTRO DE LOJA
  const handleSetFilterLoja = useCallback((value) => {
    setFilterLoja(value);
  },[filterLoja]);

  // FILTRO DE STATUS
  const handleSetFilterStatus = useCallback((value) => {
    setFilterStatus(value);
  },[filterStatus]);

  // FILTRO DE STATUS
  const handleSetFilterEmpreendimento = useCallback((value) => {
    setFilterEmpreendimento(value);
  },[filterEmpreendimento]);

  // FILTRO DE STATUS SUPERVISOR
  const handleSetFilterStatusSupervisor = useCallback((value) => {
    setFilterStatusSupervisor(value);
  },[filterStatusSupervisor]);

  // SETA PÁGINA COM ERRO
  const handleSetPageError = useCallback((Value) => {
    setPageError(value);
  },[pageError]);

  // OPTIONS SUPERVISÃO
  const handleSetOptionsSupervisao = useCallback((value) => {
    setOptionsSupervisao(value);
  },[optionsSupervisao]);

  const value = useMemo(
    () => ({
      view,
      handleSetView,
      clicked,
      handleSetClicked,
      editView,
      handleSetEditView,
      filterSupervisao,
      handleSetFilterSupervisao,
      filterDate,
      handleSetFilterDate,
      filterDateMonth,
      handleSetFilterDateMonth,
      filterLoja,
      handleSetFilterLoja,
      pageError,
      handleSetPageError,
      filterStatus,
      handleSetFilterStatus,
      filterStatusSupervisor,
      handleSetFilterStatusSupervisor,
      optionsSupervisao,
      handleSetOptionsSupervisao,
      filterEmpreendimento,
      handleSetFilterEmpreendimento
    }),
    [
      view,
      handleSetView,
      clicked,
      handleSetClicked,
      editView,
      handleSetEditView,
      filterSupervisao,
      handleSetFilterSupervisao,
      filterDate,
      handleSetFilterDate,
      filterDateMonth,
      handleSetFilterDateMonth,
      filterLoja,
      handleSetFilterLoja,
      pageError,
      handleSetPageError,
      filterStatus,
      handleSetFilterStatus,
      filterStatusSupervisor,
      handleSetFilterStatusSupervisor,
      optionsSupervisao,
      handleSetOptionsSupervisao,
      filterEmpreendimento,
      handleSetFilterEmpreendimento
    ]
  );

  return (
    <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
  );
};
