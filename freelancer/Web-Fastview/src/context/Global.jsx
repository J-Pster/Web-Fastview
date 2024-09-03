import React, { useMemo, useCallback, createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const [refreshChat, setRefreshChat] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [refreshButtons, setRefreshButtons] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [security, setSecurity] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [filter, setFilter] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [filterModule, setFilterModule] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [openExternal, setOpenExternal] = useState(false);
  const [cardHeader, setCardHeader] = useState('');
  const [cardExternal, setCardExternal] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const [fixFilterModule, setFixFilterModule] = useState(true);
  const [multipleModal, setMultipleModal] = useState(false);
  const [src, setSrc] = useState(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [sources, setSources] = useState([]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [toggler, setToggler] = useState(false);
  const [filters, setFilters] = useState('');
  const [prevIndex, setPrevIndex] = useState('');
  const [disabledFilter, setDisabledFilter] = useState(false);

  // CONTADOR DE REFRESH DO CALENDÁRIO
  var count = 0;

  // ABRE LIGTHBOX
  const handleSetToggler = useCallback((value) => {
    setToggler(!toggler);
  }, [toggler]);

  // SETA IMAGENS LIGHTBOX
  const handleSetSources = useCallback((value, i) => {
    var array_obj = value.map((elem) => {
      return {src: elem};
    });
    setSources(array_obj);
    if(i){
      setSourceIndex(i);
    }else{
      setSourceIndex(0);
    }
  }, [sources]);

  // SETA FILTROS
  const handleSetFilters = useCallback((value) => {
    setFilters(value);
  }, [filters]);

  // ABRE IMG CROPPER
  const handleSetOpenImageCropper = useCallback((value) => {
    setOpenImageCropper(value);
  }, [openImageCropper]);

  // SETA CAMINHO IMAGEM CROPPER
  const handleSetSrc = useCallback((value) => {
    setSrc(value);
  }, [src]);

  // MULTIPLOS MODAIS
  const handleSetMultipleModal = useCallback((value) => {
    setMultipleModal(value);
  }, [multipleModal]);

  // AJUSTE FILTRO DE MÓDULO
  const handleSetFixFilterModule = useCallback((value) => {
    setFixFilterModule(value);
  }, [fixFilterModule]);

  // PRIMEIRO CARREGAMENTO
  const handleSetFirstLoad = useCallback((value) => {
    setFirstLoad(value);
  }, [firstLoad]);

  // CONTEÚDO CARD EXTERNAL
  const handleSetCardExternal = useCallback((value) => {
    setCardExternal(value);
  }, [cardExternal]);

  // SETA PREV INDEX SWIPER
  const handleSetPrevIndex = useCallback((value) => {
    setPrevIndex(value);
  }, [prevIndex]);

  // OPEN CARD EXTERNAL
  const handleSetOpenExternal = useCallback((value) => {
    setOpenExternal(value);
  }, [openExternal]);

  // CARD HEADER
  const handleSetCardHeader = useCallback((value) => {
    setCardHeader(value);
  }, [cardHeader]);

  // PAGE ERROR
  const handlePageError = useCallback((value) => {
    setPageError(value);
  }, [pageError]);

  //MODAL
  const handleShowModal = useCallback((value) => {
    setShowModal(value);
  }, [showModal]);

  // SEGURANÇA DAS SENHAS
  const handleSetSecurity = useCallback((value) => {
    setSecurity(value);
  }, [security]);

  // FILTRO TH
  const handleSetFilterActive = useCallback((value) => {
    setFilterActive(value);
  }, [filterActive]);

  const handleSetFilter = useCallback((value) => {
    setFilter(value);
  }, [filter]);

  // RECARREGAR TABELA
  const handleRefreshTable = useCallback((value) => {
    setRefreshTable(value);
  }, [refreshTable]);

  // DISABLED FILTERS
  const handleSetDisabledFilter = useCallback((value) => {
    setDisabledFilter(value);
  },[disabledFilter]);

  const refreshCalendar = useCallback((loading='', reload='') => {
    setRefresh({
      loading: (loading ? loading : false),
      reload: (reload ? reload : false),
      random_key: Math.random(0,99999)
    });
  }, [refresh]);

  const handleSetFilterModule = useCallback((value) => {
    setFilterModule(value);
  }, [filterModule])

  const handleRefreshChat = useCallback((status) => {
    setRefreshChat(status);
  }, [refreshChat]);

  const handleChatLoaded = useCallback((status) => {
    setChatLoaded(status);
  }, [chatLoaded]);

  const loadingCalendar = useCallback((status) => {
    setLoadingCards(status);
  }, [loadingCards]);

  const handleRefreshButtons = useCallback((status) => {
    setRefreshButtons(status);
  }, [refreshButtons]);

  const handleButtonState = useCallback((status) => {
    setButtonState(status);
  }, [buttonState]);

  const handleSetFormSuccess = useCallback((status) => {
    setFormSuccess(status);
  }, [formSuccess]);

  const value = useMemo(
    () => ({
      refresh,
      refreshCalendar,
      loadingCards,
      loadingCalendar,
      refreshButtons,
      handleRefreshButtons,
      buttonState,
      handleButtonState,
      refreshChat,
      handleRefreshChat,
      formSuccess,
      handleSetFormSuccess,
      security,
      handleSetSecurity,
      filterActive,
      handleSetFilterActive,
      filter,
      handleSetFilter,
      refreshTable,
      handleRefreshTable,
      filterModule,
      handleSetFilterModule,
      showModal,
      handleShowModal,
      chatLoaded,
      handleChatLoaded,
      pageError,
      handlePageError,
      openExternal,
      handleSetOpenExternal,
      cardHeader,
      handleSetCardHeader,
      cardExternal,
      handleSetCardExternal,
      firstLoad,
      handleSetFirstLoad,
      fixFilterModule,
      handleSetFixFilterModule,
      multipleModal,
      handleSetMultipleModal,
      src,
      handleSetSrc,
      openImageCropper,
      handleSetOpenImageCropper,
      toggler,
      handleSetToggler,
      sources,
      sourceIndex,
      handleSetSources,
      filters,
      handleSetFilters,
      prevIndex,
      handleSetPrevIndex,
      disabledFilter,
      handleSetDisabledFilter
    }),
    [
      refreshCalendar,
      refresh,
      loadingCalendar,
      loadingCards,
      handleRefreshButtons,
      refreshButtons,
      handleButtonState,
      buttonState,
      handleRefreshChat,
      refreshChat,
      formSuccess,
      handleSetFormSuccess,
      security,
      handleSetSecurity,
      filterActive,
      handleSetFilterActive,
      filter,
      handleSetFilter,
      refreshTable,
      handleRefreshTable,
      filterModule,
      handleSetFilterModule,
      showModal,
      handleShowModal,
      chatLoaded,
      handleChatLoaded,
      pageError,
      handlePageError,
      openExternal,
      handleSetOpenExternal,
      cardHeader,
      handleSetCardHeader,
      cardExternal,
      handleSetCardExternal,
      firstLoad,
      handleSetFirstLoad,
      fixFilterModule,
      handleSetFixFilterModule,
      multipleModal,
      handleSetMultipleModal,
      src,
      handleSetSrc,
      openImageCropper,
      handleSetOpenImageCropper,
      toggler,
      handleSetToggler,
      sources,
      sourceIndex,
      handleSetSources,
      filters,
      handleSetFilters,
      prevIndex,
      handleSetPrevIndex,
      disabledFilter,
      handleSetDisabledFilter
    ]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
