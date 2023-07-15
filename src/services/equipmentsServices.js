
import axios from "axios";

const API_URL_EQUIPMENT_BY_UUID = process.env.REACT_APP_DOMAIN + '/api/equipments/equipmentByUUID/';
const API_URL_UPDATE_EQUIPMENT_POSITION = process.env.REACT_APP_DOMAIN + '/api/equipments/upadetePosition/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getEquipmentByUUID = async (uuid) => {
    const response = await axios.post(API_URL_EQUIPMENT_BY_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateEquipmentPositionByUUID = async (uuid, rotation, sweep) => {
    const response = await axios.put(API_URL_UPDATE_EQUIPMENT_POSITION, JSON.stringify({ uuid, rotation, sweep }), config);
    return response.data;
};

const equipmentsServices = {
    getEquipmentByUUID,
    updateEquipmentPositionByUUID
};

export default equipmentsServices;
