import axios from "axios";

export const api = axios.create({
    baseURL: 'https://api.clarifai.com',
    headers: {
        "Authorization": "Key 10219bbb94834e88bae6b90d2e023bbd"
    }
})