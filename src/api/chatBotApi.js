import axios from "axios"

const bearerToken = 'ba53538c88b2bf97e9d94fe598d56326';

const chatBotApi = axios.create({
    baseURL: 'http://130.130.205.80:8000/api',
    headers: {
         Authorization: `Bearer ${bearerToken}`,
    }
});

export default chatBotApi;