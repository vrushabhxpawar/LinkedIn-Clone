import axios from "axios"

const baseURL = import.meta.N

export const axiosInstance = axios.create({
  baseURL : "http://localhost:3000/api",
  withCredentials : true
})
