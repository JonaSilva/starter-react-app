
import axios from "axios";

const API_URL_HYPERLINKS = process.env.REACT_APP_DOMAIN + '/api/hyperlinks/';
const API_URL_HYPERLINKS_BY_PARENT_UUID = process.env.REACT_APP_DOMAIN + '/api/hyperlinks/byUUID';
const API_URL_HYPERLINKS_BY_MODEL_ID = process.env.REACT_APP_DOMAIN + '/api/hyperlinks/byModelId';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getAllHyperlinks = async () => {
    const response = await axios.get(API_URL_HYPERLINKS, config);
    return response.data;
};

const getHyperLinksByParentUUID = async (uuid) => {
    const response = await axios.post(API_URL_HYPERLINKS_BY_PARENT_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const getHyperLinksByModelID = async (id) => {
    const response = await axios.post(API_URL_HYPERLINKS_BY_MODEL_ID, JSON.stringify({ id }), config);
    return response.data;
};

const hyperlinksServices = {
    getAllHyperlinks,
    getHyperLinksByParentUUID,
    getHyperLinksByModelID};

export default hyperlinksServices;
