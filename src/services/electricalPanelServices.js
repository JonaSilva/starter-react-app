
import axios from "axios";

const API_URL_ELEMENT_BY_UUID = process.env.REACT_APP_DOMAIN + '/api/electrical_panel/electricalPanelByUUID';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const gePaneltByUUID = async (uuid) => {
    const response = await axios.post(API_URL_ELEMENT_BY_UUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const elecricalPanelServices = {
    gePaneltByUUID
};

export default elecricalPanelServices;
