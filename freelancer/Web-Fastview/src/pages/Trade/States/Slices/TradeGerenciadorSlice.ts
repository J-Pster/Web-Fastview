import { createSlice } from "@reduxjs/toolkit";
import dayjs from 'dayjs';

export const TradeInitialState = {
  gerenciadorState: {
    gerenciador: 1,
    ano: new Date().getFullYear(),
    editar: true
  },
  gruposState: {
    grupos: [],
    search: "",
    editar: false,
    inativos: null,
    selected: null,
    ativo: [0, 1],
    loading: false,
  },
  industriasState: {
    industrias: [],
    search: "",
    editar: false,
    inativos: null,
    selected: null,
    ativo: [0, 1],
    loading: false,
  },
  motivoSupervisorState: {
    motivosSupervisor: [],
    search: "",
    editar: false,
    inativos: null,
    selected: null,
    ativo: [0, 1],
    loading: false,
  },
  motivoLojaState: {
    motivosLoja: [],
    search: "",
    editar: false,
    inativos: [0, 1],
    selected: null,
    loading: false,
  },
  contratosState: {
    contratos: [],
    search: "",
    editar: false,
    inativos: null,
    selected: null,
    ativo: [0, 1],
    loading: false,
    contratoProdutos: [],
    contratoLojas: [],
  },
  produtosState: {
    produtos: [],
    search: "",
    editar: false,
    inativos: null,
    selected: null,
    ativo: [0, 1],
    loading: false,
  },
  lojasState: {
    lojas: [],
    search: "",
    editar: false,
    inativos: null,
    selected: null,
    ativo: [0, 1],
    loading: false,
  },
  forms: {
    grupo: {
      id: null,
      nome: null,
      produtos: [],
      contratos: []
    },
    industria: {
      id: null,
      nome: null,
      cnpj: null,
      contato_email: null,
      contato_nome: null,
      contato_telefone: null,
      codigo: null
    },
    motivoSupervisor: {
      id: null,
      descricao: null,
    },
    motivoLoja: {
      id: null,
      descricao: null,
    },
    contrato: {
      id: null,
      numero: null,
      grupo_id: null,
      externo_id: null,
      industria_id: null,
      produto_id: null,
      descricao: null,
      obs: null,
      data_inicio: dayjs().startOf("M").add(1, "d").format("YYYY-MM-DD"),
      data_fim: dayjs().endOf("M").add(1, "d").format("YYYY-MM-DD"),
      valor: null,
      quantidade: null,
      modelo: null,
      criar_job: true,
    },
    produto: {
      id: null,
      categoria_id: null,
      externo_id: null,
      nome: null,
      descricao: null,
      modelo: null,
      codigo: null
    },
    loja: {},
  },
};

const TradeGerenciadorSlice = createSlice({
  initialState: TradeInitialState,
  name: "trade-gerenciador-slice",
  reducers: {
    resetTradeGerenciadorState: () => TradeInitialState,
    setTradeGerenciadorState: (state, action) => {
      state.gerenciadorState = { ...state.gerenciadorState, ...action.payload };
    },
    setTradeGrupoState: (state, action) => {
      state.gruposState = { ...state.gruposState, ...action.payload };
    },
    setTradeGrupoForm: (state, action) => {
      state.forms.grupo = { ...state.forms.grupo, ...action.payload };
    },
    setTradeIndustriaState: (state, action) => {
      state.industriasState = { ...state.industriasState, ...action.payload };
    },
    setTradeIndustriaForm: (state, action) => {
      state.forms.industria = { ...state.forms.industria, ...action.payload };
    },
    setTradeMotivoSupervisorState: (state, action) => {
      state.motivoSupervisorState = {
        ...state.motivoSupervisorState,
        ...action.payload,
      };
    },
    setTradeMotivoSupervisorForm: (state, action) => {
      state.forms.motivoSupervisor = {
        ...state.forms.motivoSupervisor,
        ...action.payload,
      };
    },
    setTradeMotivoLojaState: (state, action) => {
      state.motivoLojaState = {
        ...state.motivoLojaState,
        ...action.payload,
      };
    },
    setTradeMotivoLojaForm: (state, action) => {
      state.forms.motivoLoja = {
        ...state.forms.motivoLoja,
        ...action.payload,
      };
    },
    setTradeContratoState: (state, action) => {
      state.contratosState = {
        ...state.contratosState,
        ...action.payload,
      };
    },
    setTradeContratoForm: (state, action) => {
      state.forms.contrato = {
        ...state.forms.contrato,
        ...action.payload,
      };
    },
    setTradeProdutoState: (state, action) => {
      state.produtosState = {
        ...state.produtosState,
        ...action.payload,
      };
    },
    setTradeProdutoForm: (state, action) => {
      state.forms.produto = {
        ...state.forms.produto,
        ...action.payload,
      };
    },
    setTradeLojaForm: (state, action) => {
      state.forms.loja = {
        ...state.forms.loja,
        ...action.payload,
      };
    },
    setTradeLojasState: (state, action) => {
      state.lojasState = {
        ...state.lojasState,
        ...action.payload,
      };
    },
    closeTradeEditors: (state) => {
      state.contratosState.editar = false;
      state.produtosState.editar = false;
      state.lojasState.editar = false;
      state.motivoSupervisorState.editar = false;
      state.industriasState.editar = false;
      state.gruposState.editar = false;
      state.motivoLojaState.editar = false;
    },
    deselectTradeComponents: (state) => {
      state.contratosState.selected = null;
      state.produtosState.selected = null;
      state.lojasState.selected = null;
      state.motivoSupervisorState.selected = null;
      state.industriasState.selected = null;
      state.gruposState.selected = null;
      state.motivoLojaState.selected = null;
    },
  },
});

export const {
  resetTradeGerenciadorState,
  setTradeGerenciadorState,
  setTradeGrupoState,
  setTradeGrupoForm,
  setTradeIndustriaState,
  setTradeIndustriaForm,
  setTradeMotivoSupervisorForm,
  setTradeMotivoSupervisorState,
  setTradeMotivoLojaForm,
  setTradeMotivoLojaState,
  setTradeContratoForm,
  setTradeContratoState,
  setTradeProdutoForm,
  setTradeProdutoState,
  setTradeLojaForm,
  setTradeLojasState,
  closeTradeEditors,
  deselectTradeComponents,
} = TradeGerenciadorSlice.actions;
export const TradeGerenciadorActions = TradeGerenciadorSlice.actions;
export default TradeGerenciadorSlice.reducer;
