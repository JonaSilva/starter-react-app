
import axios from "axios";

const API_URL_HSE_EQUIPMENT_BY_UUID = process.env.REACT_APP_DOMAIN + '/api/HSE_Equipments/equipmentByUUID/';
const API_URL_UPDATE_HSE_EQUIPMENT_POSITION = process.env.REACT_APP_DOMAIN + '/api/HSE_Equipments/upadetePosition/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getHSEEquipmentByUUID = async (uuid) => {
    const response = await axios.post(API_URL_HSE_EQUIPMENT_BY_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateHSEquipmentPositionByUUID = async (uuid, rotation, sweep) => {
    const response = await axios.put(API_URL_UPDATE_HSE_EQUIPMENT_POSITION, JSON.stringify({ uuid, rotation, sweep }), config);
    return response.data;
};

const hseEquipmentsServices = {
    getHSEEquipmentByUUID,
    updateHSEquipmentPositionByUUID
};

export default hseEquipmentsServices;
