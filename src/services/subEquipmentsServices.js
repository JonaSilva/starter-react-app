
import axios from "axios";

const API_URL_SUBEQUIPMENT_BY_UUID = process.env.REACT_APP_DOMAIN + '/api/subEquipments/subEquipmentByUUID/';
const API_URL_SUBEQUIPMENT_POSITION = process.env.REACT_APP_DOMAIN + '/api/subEquipments/upadetePosition/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const geSubEquipmentByUUID = async (uuid) => {
    const response = await axios.post(API_URL_SUBEQUIPMENT_BY_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateSubEquipmentPositionByUUID = async (uuid, rotation, sweep) => {
    const response = await axios.put(API_URL_SUBEQUIPMENT_POSITION, JSON.stringify({ uuid, rotation, sweep }), config);
    return response.data;
};

const subEquipmentsServices = {
    geSubEquipmentByUUID,
    updateSubEquipmentPositionByUUID
};

export default subEquipmentsServices;
