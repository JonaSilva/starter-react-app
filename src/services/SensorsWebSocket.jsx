
import React, { useContext, useEffect } from 'react';

import MatterportContext from "../components/Matterport/MatterportContext";
let socket = new WebSocket(process.env.REACT_SOCKET_DOMAIN + `/api/sensors/socketTest`);
function SensorsWebSocket(props) {
    const { active } = props;
    const { setSensorsData } = useContext(MatterportContext)



    socket.onmessage = function (event) {
        setSensorsData(JSON.parse(event.data));
    };
    socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };
    useEffect(() => {
        if (socket === undefined) {
            socket = new WebSocket(process.env.REACT_SOCKET_DOMAIN + `/api/sensors/socketTest`);
        } else {
            if (socket.readyState === WebSocket.CONNECTING) {
                socket.addEventListener('open', () => {
                    if (active) {
                        socket.send("start")
                    }
                })
            } else if (socket.readyState === WebSocket.OPEN) {

                socket.removeEventListener('open', () => {
                    if (active) {
                        socket.send("start")
                    }
                });
                if (!active) {
                    socket.send("stop")
                }
            }
        }
    }, [active])
    return (
        <></>
    )
}

export default SensorsWebSocket
