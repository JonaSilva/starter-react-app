
import axios from "axios";

const API_URL_SITES = process.env.REACT_APP_DOMAIN + '/api/sites/';
const API_URL_BUILDINGS = process.env.REACT_APP_DOMAIN + '/api/sites/buildings/';
const API_URL_SITES_BUILDINGS_ROOMS = process.env.REACT_APP_DOMAIN + '/api/sites/buildingsAndRooms/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getSites = async () => {
    const response = await axios.get(API_URL_SITES, config);
    return response.data;
};

const getBuildingBySite = async (data) => {
    const response = await axios.post(API_URL_BUILDINGS, JSON.stringify({ site: data }), config);
    return response.data;
};

const getBuildingsAndRooms = async () => {
    const response = await axios.get(API_URL_SITES_BUILDINGS_ROOMS, config);
    return response.data;
};

const sitesServices = {
    getSites, getBuildingBySite, getBuildingsAndRooms
};

export default sitesServices;
