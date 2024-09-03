import axios from "axios";

/**
 * Ativa um contrato
 * @param {number} contrato_id
 * @returns {Promise}
 */

export const ativarContrato = (contrato_id) =>
  axios
    .get(
      `${window.backend}/api/v1/trades/gerenciador/contratos/${contrato_id}/restore`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Desativa um contrato
 * @param {number} contrato_id
 * @returns {Promise}
 */

export const desativarContrato = (contrato_id) =>
  axios
    .delete(
      `${window.backend}/api/v1/trades/gerenciador/contratos/${contrato_id}`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Cria um contrato
 * @param {any} data
 * @returns {Promise}
 */

export const createContrato = (data) =>
  axios
    .post(
      `${window.backend}/api/v1/trades/gerenciador/contratos`,
      {...data}
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Atualiza um contrato
 * @param {number} produto_id
 * @param {any} data
 * @returns {Promise}
 */

export const updateContrato = (contrato_id, data) =>
  axios
    .put(
      `${window.backend}/api/v1/trades/gerenciador/contratos/${contrato_id}`,
      {...data}
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Adiciona produtos ao contrato
 * @param {{contrato_id: number, produtos: Array<number>}} data
 * @returns {Promise}
 */

export const addContratoProduto = (data) =>
  axios
    .post(
      `${window.backend}/api/v1/trades/gerenciador/contratos/produtos`,
      {...data}
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Cria um produto
 * @param {any} data
 * @returns {Promise}
 */

export const createProduto = (data) =>
  axios
    .post(`${window.backend}/api/v1/trades/gerenciador/produtos`, {...data})
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Atualiza um produto
 * @param {number} produto_id
 * @param {any} data
 * @returns {Promise}
 */

export const updateProduto = (produto_id, data) =>
  axios
    .put(`${window.backend}/api/v1/trades/gerenciador/produtos/${produto_id}`, {
      ...data,
    })
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Ativa um produto
 * @param {number} produto_id
 * @returns {Promise}
 */

export const ativarProduto = (produto_id) =>
  axios
    .get(
      `${window.backend}/api/v1/trades/gerenciador/produtos/${produto_id}/restore`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Desativa um produto
 * @param {number} produto_id
 * @returns {Promise}
 */

export const desativarProduto = (produto_id) =>
  axios
    .delete(
      `${window.backend}/api/v1/trades/gerenciador/produtos/${produto_id}`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Cria um grupo
 * @param {any} data
 * @returns {Promise}
 */

export const createGrupo = (data) =>
  axios
    .post(`${window.backend}/api/v1/trades/gerenciador/grupos`, { ...data })
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Atualiza um grupo
 * @param {number} grupo_id
 * @param {any} data
 * @returns {Promise}
 */

export const updateGrupo = (grupo_id, data) =>
  axios
    .put(`${window.backend}/api/v1/trades/gerenciador/grupos/${grupo_id}`, {
      ...data,
    })
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Ativa um grupo
 * @param {number} grupo_id
 * @returns {Promise}
 */

export const ativarGrupo = (grupo_id) =>
  axios
    .get(
      `${window.backend}/api/v1/trades/gerenciador/grupos/${grupo_id}/restore`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Desativa um grupo
 * @param {number} grupo_id
 * @returns {Promise}
 */
export const desativarGrupo = (grupo_id) =>
  axios
    .delete(`${window.backend}/api/v1/trades/gerenciador/grupos/${grupo_id}`)
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Cria um motivo de supervisor
 * @param {any} data
 * @returns {Promise}
 */

export const createMotivoSupervisor = (data) =>
  axios
    .post(`${window.backend}/api/v1/trades/gerenciador/motivos`, { ...data })
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Atualiza un motivo de supervisor
 * @param {number} motivo_supervisor_id
 * @param {any} data
 * @returns {Promise}
 */

export const updateMotivoSupervisor = (motivo_supervisor_id, data) =>
  axios
    .put(
      `${window.backend}/api/v1/trades/gerenciador/motivos/${motivo_supervisor_id}`,
      { ...data }
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Ativa um motivo de supervisor
 * @param {number} motivo_supervisor_id
 * @returns {Promise}
 */

export const ativarMotivoSupervisor = (motivo_supervisor_id) =>
  axios
    .get(
      `${window.backend}/api/v1/trades/gerenciador/motivos/${motivo_supervisor_id}/restore`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Desativa um motivo de supervisor
 * @param {number} motivo_supervisor_id
 * @returns
 */
export const desativarMotivoSupervisor = (motivo_supervisor_id) =>
  axios
    .delete(
      `${window.backend}/api/v1/trades/gerenciador/motivos/${motivo_supervisor_id}`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Cria um motivo de loja
 * @param {any} data
 * @returns {Promise}
 */

export const createMotivoLoja = (data) =>
  axios
    .post(
      `${window.backend}/api/v1/trades/gerenciador/motivos/lojas`, {...data}
    )
    .then((res) => res.data)
    .catch((_error) => {
      throw _error;
    });

/**
 * Atualiza um motivo de loja
 * @param {number} motivo_id
 * @param {any} data
 * @returns {Promise}
 */

export const updateMotivoLoja = (motivo_id, data) =>
  axios
    .put(`${window.backend}/api/v1/trades/gerenciador/motivos/${motivo_id}/lojas`, {...data})
    .then((res) => res.data)
    .catch((_error) => {
      throw _error;
    });

/**
 * Ativa um motivo de loja
 * @param {number} motivo_id
 * @returns {Promise}
 */

export const ativarMotivoLoja = (motivo_id) =>
  axios
    .get(
      `${window.backend}/api/v1/trades/gerenciador/motivos/${motivo_id}/lojas`
    )
    .then((res) => res.data)
    .catch((_error) => {
      throw _error;
    });

/**
 * Desativar motivo de loja
 * @param {number} motivo_id
 * @returns {Promise}
 */

export const desativarMotivoLoja = (motivo_id) =>
  axios
    .delete(
      `${window.backend}/api/v1/trades/gerenciador/motivos/${motivo_id}/lojas`
    )
    .then((res) => res.data)
    .catch((_error) => {
      throw _error;
    });

/**
 * Cria um industria
 * @param {any} data
 * @returns {Promise}
 */

export const createIndustria = (data) =>
  axios
    .post(`${window.backend}/api/v1/trades/gerenciador/industrias`, { ...data })
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Atualiza uma industria
 * @param {number} industria_id
 * @param {any} data
 * @returns {Promise}
 */

export const updateIndustria = (industria_id, data) =>
  axios
    .put(
      `${window.backend}/api/v1/trades/gerenciador/industrias/${industria_id}`,
      { ...data }
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Ativa uma industria
 * @param {number} industria_id
 * @returns {Promise}
 */

export const ativarIndustria = (industria_id) =>
  axios
    .get(
      `${window.backend}/api/v1/trades/gerenciador/industrias/${industria_id}/restore`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});

/**
 * Desativa uma industria
 * @param {number} industria_id
 * @returns {Promise}
 */

export const desativarIndustria = (industria_id) =>
  axios
    .delete(
      `${window.backend}/api/v1/trades/gerenciador/industrias/${industria_id}`
    )
    .then((res) => res.data)
    .catch((_error) => {throw _error});


export const addContratoProdutoLoja = () =>
  axios
    .post(`${window.backend}/api/v1/trades/gerenciador/contratos/produtos/lojas`)
    .then((res) => res.data.data)
    .catch((_err) => {throw _err});

export const createTrade = (data) =>
  axios
    .post(
      `${window.backend}/api/v1/trades`, {...data}
    )
    .then((res) => res.data.data)
    .catch((_err) => {throw _err});