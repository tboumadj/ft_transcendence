//import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { io, Socket } from 'socket.io-client';
//import { getToken } from '../../../helpers/localStore.helper';

const hostname: string = window.location.hostname;
// const url1 = "http://localhost:3000";
// const url2 = "http://localhost:3000";
const jwtToken = localStorage.getItem('jwtToken');

//const apiHandle: AxiosInstance = axios.create({
//  baseURL: url1,
  // timeout: 1000,/
//});

const apiHandle = (url: string, options: RequestInit = {}): Promise<Response> => {
  const jwtToken = localStorage.getItem('jwtToken');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${jwtToken}`,
  };

  return fetch(url, { ...options, headers });
};


const withAuth = (): RequestInit => ({
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
});

//const withAuth = (): AxiosRequestConfig => {
//  const jwtToken = localStorage.getItem('jwtToken');
//  return {
//    headers: {
//      Authorization: `Bearer ${jwtToken}`,
//    },
//  };
//};



export { apiHandle, hostname, withAuth };
export default apiHandle;
