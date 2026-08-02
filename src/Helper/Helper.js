import axios from "axios";
import Cookies from "js-cookie";

<<<<<<< HEAD
export const axiosInstance = axios.create({
  baseURL: "https://backend-8e6g.onrender.com/api/v1",

  //  baseURL: "http://localhost:8008/api/v1",
=======
export const API_BASE_URL = "https://backend-8e6g.onrender.com/api/v1";
export const IMAGE_BASE_URL = "https://backend-8e6g.onrender.com";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // baseURL: "http://localhost:8008/api/v1",
>>>>>>> 95342049cfdb3123d7859756302240d79cf5b15b
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);