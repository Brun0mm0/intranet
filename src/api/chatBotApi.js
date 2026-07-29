import axios from "axios"

const bearerToken = '548ae5e14dee43adf3952231d1aaca43';

const chatBotApi = axios.create({
    baseURL: 'http://130.130.205.80:8000/api',
    headers: {
         Authorization: `Bearer ${bearerToken}`,
    }
});

export default chatBotApi;