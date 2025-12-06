import axios from 'axios';

export default axios.create({
  baseURL: 'http://Consul2:8000',
  origin: true,
  headers: { 
    'Content-Type': 'application/json; charset=utf-8' 
  }
});
