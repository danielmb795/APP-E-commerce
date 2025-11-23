import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bare-marris-prof-ferretto-8544d847.koyeb.app',
});

export default api;