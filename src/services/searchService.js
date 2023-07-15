
import axios from "axios";

const API_URL_SEARCH = process.env.REACT_APP_DOMAIN + '/api/search/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const searchQuery = async (query, list, uuid) => {
    const response = await axios.post(API_URL_SEARCH, JSON.stringify({ query, list, uuid }), config);
    return response.data;
};

const searchService = {
    searchQuery
};

export default searchService;
