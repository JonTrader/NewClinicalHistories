import axios from 'axios'

export const ax = axios.create({
    baseURL: import.meta.env.MODE ==='development' ? 'http://localhost:3000' : '/',
    withCredentials: true, // send cookies with request
})