import axios from "axios";

export const getContratos = (params) =>
  axios.get(`${window.backend}/api/v1/trades/gerenciador/contratos`, {params} ).then((res) => res.data.data).catch(err => {throw err});

export const getProdutos = (params) =>
  axios
    .get(`${window.backend}/api/v1/trades/gerenciador/produtos`, { params })
    .then((res) => res.data.data)
    .catch((err) => {throw err});

export const getGrupos = (params) =>
  axios
    .get(`${window.backend}/api/v1/trades/gerenciador/grupos`,{params})
    .then((res) => res.data.data)
    .catch((err) => {throw err});

export const getIndustrias = (params, full = false) =>
  axios
    .get(`${window.backend}/api/v1/trades/gerenciador/industrias`, { params })
    .then((res) => { return full ? res.data : res.data.data})
    .catch((err) => {throw err});

export const getMotivosSupervisor = (params) =>
  axios
    .get(`${window.backend}/api/v1/trades/gerenciador/motivos`, { params })
    .then((res) => res.data.data)
    .catch((err) => {throw err});

export const getMotivosLoja = (params) =>
  axios
    .get(`${window.backend}/api/v1/trades/gerenciador/motivos/lojas`, { params })
    .then((res) => res.data.data)
    .catch((err) => {
      throw err;
    });

export const getLojas = (params) =>
  axios.get(`${window.backend}/api/v1/trades/gerenciador/lojas`, {params})
  .then((res) => res.data.data)
  .catch((err) => {throw err});

