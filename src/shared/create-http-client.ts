import axios, { AxiosInstance } from 'axios';

const createHtppClient = (): AxiosInstance => {
  return axios.create({
    baseURL: 'http://localhost:3000/dev',
    headers: { 'Authorization': 'Bearer pk_test_123' }
  });
}

export default createHtppClient;