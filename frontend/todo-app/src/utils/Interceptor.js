import axios from "axios";
import { TOKEN } from "./constant";
import { store } from "../store/store";

const BASE_URL = "http://localhost:3000"

const setupInterceptor = () => {
    axios.defaults.baseURL = BASE_URL

    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(TOKEN)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        }
    )

    axios.interceptors.response.use(
        (response) => {
            return response
        },

        (error) => {
            if (error.response === 401) {
                localStorage.removeItem(TOKEN)
            }
        }
    )
}

export default setupInterceptor