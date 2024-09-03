export function throttle(func, delay = 1000) {
  let timeoutId;
  let lastExecuted = 0;

  return function (...args) {
    const now = Date.now();
    const elapsed = now - lastExecuted;

    if (!lastExecuted || elapsed >= delay) {
      func.apply(this, args);
      lastExecuted = now;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecuted = now;
      }, delay - elapsed);
    }
  };
}

/**
 * Realiza uma ação no array, para evitar fazer requisições a mais
 * @param {{array: Array<{id: number, ativo: boolean}>, id: number, action: "remove" | "add" | "update", data: any}} param0
 * @returns {Array}
 */

export const handleUpdateState = ({ array, action, data, sortBy }) => {
  let shallow = [...array];
  
  const id = data.id

  if (action === "remove") return shallow.filter((item) => item.id !== id);
  if (action === "add") return [...array, data];
  if(action === "update")
  {
    const idx = shallow.findIndex((item) => item.id === id);
    if (idx < 0) throw new Error("Id não encontrato no array");
    const obj = shallow[idx];
    shallow[idx] = Object.assign({}, obj, data);
  }
  return shallow;
};
