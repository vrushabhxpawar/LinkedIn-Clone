import axios from "axios"

const baseURL = import.meta.N

export const axiosInstance = axios.create({
  baseURL : "https://linkedin-clone-backend-ijhj.onrender.com/",
  withCredentials : true
})
