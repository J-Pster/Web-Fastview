import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";
import { GrupoSistemaV3Constant } from "./grupo";

const initialState = {
  ticks: [],
  denominacao:
    parseInt(window.rs_id_grupo) !== GrupoSistemaV3Constant.CARREFOUR
      ? "Shoppings"
      : "Lojas",
  filters: {
    empreendimento: null,
    loja: null,
    dataInicial: dayjs().startOf("month").toDate(),
    mes: null,
  },
  acessos_sistemas: {
    pie: [],
    combo: {
      headers: [],
      ticks: [],
      data: [],
    },
    linea: [],
  },
  acessos_sistemas_empreendimentos: {
    pie: [],
    combo: {
      headers: [],
      data: [],
    },
    linea: [],
  },
  chamados: {
    abertos: 0,
    atendidos: 0,
    em_aberto: 0,
    acessos: 0,
    combo: {
      headers: [],
      data: [],
    },
    linea: [],
    pie: {
      empreendimento: [],
      tipos: [],
    },
  },
  usuarios: {
    lojas_ativas: 0,
    usuarios_ativo: 0,
    on_line_24_horas: 0,
    sem_acesso_90_dias: 0,
  },
  comunicados: {
    lidos_porcetagem: 0,
    total_acesso: 0,
    total_criados: 0,
    total_lidos: 0,
    total_nao_lidos: 0,
  },

  sites: {
    shoppings: 0,
    acessos: 0,
    acessos_loja: 0,
    manutencoes: 0,
    clientes_cadastrados: [],
    acessos_paginas: [],
  },

  gis: {
    total_acesso: 0,
    total_lancados: 0,
    total_atrasados: 0,
  },

  obras: {
    em_andamento : 0,
    em_atraso: 0,
    em_inauguracao: 0,
    finalizadas: 0,
  },
};

const useDashboardStore = create()(
  devtools((set) => ({
    ...initialState,
    setUsuariosStats: (usuarios) => set((state) => ({ ...state, usuarios })),
    setChamadosStats: (chamados) => set((state) => ({ ...state, chamados })),
    setAcessosSistemasStats: (acessos_sistemas) =>
      set((state) => ({ ...state, acessos_sistemas })),
    setAcessosSistemasEmpreendimentosStats: (
      acessos_sistemas_empreendimentos
    ) => set((state) => ({ ...state, acessos_sistemas_empreendimentos })),
    setComunicadosStats: (comunicados) =>
      set((state) => ({ ...state, comunicados})),
    setSitesStats: (sites) => set((state) => ({ ...state, sites })),
    setEmpreendimento: (empreendimento) =>
      set((state) => ({
        ...state,
        filters: { ...state.filters, empreendimento },
      })),
    setLoja: (loja) =>
      set((state) => ({
        ...state,
        filters: { ...state.filters, loja },
      })),
    setDataInicial: (dataInicial) =>
      set((state) => ({
        ...state,
        filters: { ...state.filters, dataInicial },
      })),
    setTicks: (ticks) => set((state) => ({
      ...state,
      ticks
    })),
    setGisStats: (gis) => set(state => ({...state, gis})),
    setObrasStats: (obras) => set(state => ({...state, obras})),
    resetState: () =>{
      const {filters, ...resetState} = initialState; 
      set((state)=> ({...state, ...resetState}))}
  })),
  
);

export default useDashboardStore;