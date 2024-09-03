import React, { useMemo, useCallback, createContext, useState } from "react";

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [view, setView] = useState('supervisor');
  const [clicked, setClicked] = useState(false);
  const [editView, setEditView] = useState(false);
  const [filterSupervisao, setFilterSupervisao] = useState('');
  const [filterDate, setFilterDate] = useState(new Date(window.currentYear,window.currentMonth-1,window.currentDay));
  const [filterDateMonth, setFilterDateMonth] = useState(new Date(window.currentYear,window.currentMonth-1,window.currentDay));
  const [filterLoja, setFilterLoja] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [pageError, setPageError] = useState(false);
  const [optionsSupervisao, setOptionsSupervisao] = useState([]);

  // SETA TELA DE VISUALIZAÇÃO
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
      optionsSupervisao,
      handleSetOptionsSupervisao
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
      optionsSupervisao,
      handleSetOptionsSupervisao
    ]
  );

  return (
    <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
  );
};
