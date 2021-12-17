import axios from "axios";
import qs from "qs";

export const sendMessage = async (number, message) => {
    const token = process.env.BOT_TOKEN;
    const url = `https://app.ruangwa.id/api/send_express`;

    const data = qs.stringify({
        'token': token,
        'number': number,
        'message': message
    });

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    
    return axios.post(url, data, config);
}
