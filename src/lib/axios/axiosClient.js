import axios from "axios";
import toast from "react-hot-toast";
import applyRequestInterceptor from "@lib/axios/interceptors/requestInterceptor";
import applyResponseInterceptor from "@lib/axios/interceptors/responseInterceptor";

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
  origin: true,
  headers: { 
    'Content-Type': 'application/json; charset=utf-8' 
  }
});

// نصب Request Interceptor
applyRequestInterceptor(client);

// نصب Response Interceptor
applyResponseInterceptor(client, toast);

export default client;
