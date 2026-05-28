import axios from "axios";

export default axios.create ({
    baseURL:"https://clinic-system-4s83.onrender.com/api/",
    withCredentials: true
})