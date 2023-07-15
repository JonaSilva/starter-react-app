
import axios from "axios";

const API_URL_INSTRUMENT_BY_UUID = process.env.REACT_APP_DOMAIN + '/api/instruments/instrumentByUUID/';
const API_URL_UPDATE_INSTRUMENT_POSITION = process.env.REACT_APP_DOMAIN + '/api/instruments/upadetePosition/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getInstrumentByUUID = async (uuid) => {
    const response = await axios.post(API_URL_INSTRUMENT_BY_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateInstrumentPositionByUUID = async (uuid, rotation, sweep) => {
    const response = await axios.put(API_URL_UPDATE_INSTRUMENT_POSITION, JSON.stringify({ uuid, rotation, sweep }), config);
    return response.data;
};

const instrumentsServices = {
    getInstrumentByUUID,
    updateInstrumentPositionByUUID
};

export default instrumentsServices;
