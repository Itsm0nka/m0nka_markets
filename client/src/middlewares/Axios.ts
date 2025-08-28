import axios from "axios";
import { BASE_API_URL } from "../libs/config";

export const Axios = axios.create({
    baseURL: BASE_API_URL
})