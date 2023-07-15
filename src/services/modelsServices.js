
import axios from "axios";

const API_URL_MODELS_BY_PARENT_UUID = process.env.REACT_APP_DOMAIN + '/api/models/modelsByParentUUID/';
const API_URL_MODELS_POSITION = process.env.REACT_APP_DOMAIN + '/api/models/upadetePosition';
const API_URL_MODEL_BY_ID = process.env.REACT_APP_DOMAIN + '/api/models/getModelById';
const API_URL_MODELS_LIST = process.env.REACT_APP_DOMAIN + '/api/models/3dModelsList';
const API_URL_ADD_MODEL = process.env.REACT_APP_DOMAIN + '/api/models/addNewModel';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getModelsByParentUUID = async (uuid) => {
    const response = await axios.post(API_URL_MODELS_BY_PARENT_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateModelsPositionByid = async (id, position, rotation, scale) => {
    const response = await axios.put(API_URL_MODELS_POSITION, JSON.stringify({ id, position, rotation, scale }), config);
    return response.data;
};

const getModelById = async (id) => {
    const response = await axios.post(API_URL_MODEL_BY_ID, JSON.stringify({ id }), config);
    return response.data;
};

const addNewModel = async (name, parent, positionx, positiony, positionz, interactuable, interactuable_content, animated, interactuable_type) => {
    const response = await axios.post(API_URL_ADD_MODEL, JSON.stringify({ name, parent, positionx, positiony, positionz, interactuable, interactuable_content, animated, interactuable_type }), config);
    return response.data;
};

const getModelsList = async () => {
    const response = await axios.get(API_URL_MODELS_LIST, config);
    return response.data;
};

const modelsServices = {
    getModelsByParentUUID,
    updateModelsPositionByid,
    getModelById,
    getModelsList,
    addNewModel
};

export default modelsServices;
