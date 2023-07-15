
import axios from "axios";

const API_URL_SENSORS = process.env.REACT_APP_DOMAIN + '/api/sensors/';
const API_URL_SENSORS_BY_PARENT_UUID = process.env.REACT_APP_DOMAIN + '/api/sensors/byUUID_Parent';
const API_URL_UPDATE_SENSOR_POSITION = process.env.REACT_APP_DOMAIN + '/api/sensors/upadetePosition';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getSensors = async () => {
    const response = await axios.get(API_URL_SENSORS, config);
    return response.data;
};

const getSensorsByParentUUID = async (data) => {
    const response = await axios.post(API_URL_SENSORS_BY_PARENT_UUID, JSON.stringify({ uuid_parent: data }), config);
    return response.data;
};

const updateSensorPositionByid = async (id, position, rotation) => {
    const response = await axios.put(API_URL_UPDATE_SENSOR_POSITION, JSON.stringify({ id, position, rotation }), config);
    return response.data;
};

const sensorsServices = {
    getSensors,
    getSensorsByParentUUID,
    updateSensorPositionByid
};

export default sensorsServices;
