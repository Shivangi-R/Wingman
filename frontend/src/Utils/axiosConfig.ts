import Axios, { AxiosInstance } from "axios";
import { useAppSelector } from "src/Redux/hooks";

const axios: AxiosInstance = Axios.create({
    baseURL: 'http://localhost:5000',
});


export default axios;
