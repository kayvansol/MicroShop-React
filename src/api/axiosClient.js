import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:5180',
  origin: true,
  headers: { 
    'Content-Type': 'application/json; charset=utf-8' 
  }
});
