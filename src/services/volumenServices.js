
import axios from "axios";

const API_URL_VOLUMES_BY_PARENT_UUID = process.env.REACT_APP_DOMAIN + '/api/volumes/volumesByParentUUID/';
const API_URL_VOLUMES_POSITION = process.env.REACT_APP_DOMAIN + '/api/volumes/upadetePosition';
const API_URL_VOLUME_BY_ID = process.env.REACT_APP_DOMAIN + '/api/volumes/getModelById';
const API_URL_ADD_VOLUME = process.env.REACT_APP_DOMAIN + '/api/volumes/addNewVolume';
const API_URL_GET_ALL_VOLUME = process.env.REACT_APP_DOMAIN + '/api/volumes/getAllVolumes';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getVolumesByParentUUID = async (uuid) => {
    const response = await axios.post(API_URL_VOLUMES_BY_PARENT_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateVolumesPositionByid = async (id, position, rotation, scale) => {
    const response = await axios.put(API_URL_VOLUMES_POSITION, JSON.stringify({ id, position, rotation, scale }), config);
    return response.data;
};

const getVolumeById = async (id) => {
    const response = await axios.post(API_URL_VOLUME_BY_ID, JSON.stringify({ id }), config);
    return response.data;
};

const addNewVolume = async (parent, positionx, positiony, positionz, rotationx, rotationy, rotationz, scalex, scaley, scalez) => {
    const response = await axios.post(API_URL_ADD_VOLUME, JSON.stringify({ parent, positionx, positiony, positionz, rotationx, rotationy, rotationz, scalex, scaley, scalez }), config);
    return response.data;
};

const getAllVolumes = async () => {
    const response = await axios.get(API_URL_GET_ALL_VOLUME, config);
    return response.data;
};

const volumenServices = {
    getVolumesByParentUUID,
    updateVolumesPositionByid,
    getVolumeById,
    addNewVolume,
    getAllVolumes
};

export default volumenServices;
