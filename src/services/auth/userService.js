
import axios from "axios";

const API_URL = process.env.REACT_APP_DOMAIN + '/api/user/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getUser = async () => {
    const response = await axios.get(API_URL, config);
    return response.data
}

const userService = {
    getUser
}
export default userService