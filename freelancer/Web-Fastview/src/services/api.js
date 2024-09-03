import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_API_DEV+'/api/v1/',    
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export default api;
