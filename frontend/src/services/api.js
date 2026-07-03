import axios from 'axios';

// IMPORTANT: Check your .NET API terminal for the exact port it's running on!
// It usually looks like https://localhost:7001 or http://localhost:5000
const API_BASE_URL = 'http://localhost:5021/api'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;