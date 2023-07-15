
import axios from "axios";

const API_URL_ROOMS_BY_BUILDING_ID = process.env.REACT_APP_DOMAIN + '/api/sites/RoomsByBuldingID/';
const API_URL_HERACHYBYROOMS = process.env.REACT_APP_DOMAIN + '/api/sites/herachyByRooms/';
const API_URL_ROOMBYUUID = process.env.REACT_APP_DOMAIN + '/api/rooms/roomByUUID/';
const API_URL_UPDATE_ROOM_POSITION = process.env.REACT_APP_DOMAIN + '/api/rooms/upadetePosition/';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getRoomsByBuildingId = async (building) => {
    const response = await axios.post(API_URL_ROOMS_BY_BUILDING_ID, JSON.stringify({ building }), config);
    return response.data;
};

const herachyByRoomsList = async (list) => {
    const response = await axios.post(API_URL_HERACHYBYROOMS, JSON.stringify({ list }), config);
    return response.data;
};

const roomByUUID = async (uuid) => {
    const response = await axios.post(API_URL_ROOMBYUUID, JSON.stringify({ uuid }), config);
    return response.data;
};

const updateRoomPositionByUUID = async (uuid, rotation, sweep) => {
    const response = await axios.put(API_URL_UPDATE_ROOM_POSITION, JSON.stringify({ uuid, rotation, sweep }), config);
    return response.data;
};

const roomServices = {
    getRoomsByBuildingId,
    herachyByRoomsList,
    roomByUUID,
    updateRoomPositionByUUID
};

export default roomServices;
