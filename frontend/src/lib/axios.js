import axios from "axios"

export const axiosInstance = axios.create({
  baseURL : "https://linkedin-clone-backend-ijhj.onrender.com/",
  withCredentials : true
})
