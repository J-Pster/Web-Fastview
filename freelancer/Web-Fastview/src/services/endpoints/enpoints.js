const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

const endpoints = {
  home_admin: {
    dashboards: BACKEND_URL + "/api/v1/home-adm",
  },
};

export default endpoints;