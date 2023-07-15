
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import './ElementActions.scss';
import MatterportContext from '../../../Matterport/MatterportContext';
import OverlayContext from '../../OverlayContext';

import roomServices from '../../../../services/roomsService';
import equipmentsServices from '../../../../services/equipmentsServices';
import hseEquipmentsServices from '../../../../services/hseEquipmentsServices';
import subEquipmentsServices from '../../../../services/subEquipmentsServices';
import sensorsServices from '../../../../services/sensorsServices';
import instrumentsServices from '../../../../services/instrumentsServices';
import modelsServices from '../../../../services/modelsServices';

import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import GlobalContext from '../../../../context/globalContext';
import volumenServices from '../../../../services/volumenServices';

function ElementActions() {
    let _info = false;

    const { logged } = useContext(GlobalContext)

    const { sdkMatterport, draggedSensor, draggedModel, activeSensors } = useContext(MatterportContext)
    const { currentNodeSelected, WarningToastPosition, setWarningToastPosition, isDetailsClosed, activeButtonModelsIcons } = useContext(OverlayContext);
    const pointerHand = 'pointer-hand';
    const callServiceOfObject = (currentNodeSelected, res) =>{

        switch(currentNodeSelected.TYPE){
            case 'Room':
                roomServices.updateRoomPositionByUUID(currentNodeSelected.UUID, res.rotation, res.sweep).
                            then(setWarningToastPosition(true))
                            .catch((err) => console.error(err));
                break;
            case 'Equipment':
                equipmentsServices.updateEquipmentPositionByUUID(currentNodeSelected.UUID, res.rotation, res.sweep).
                            then(setWarningToastPosition(true))
                            .catch((err) => console.error(err));
                break;
            case 'HSE_Equipment':
                hseEquipmentsServices.updateHSEquipmentPositionByUUID(currentNodeSelected.UUID, res.rotation, res.sweep).
                            then(setWarningToastPosition(true))
                            .catch((err) => console.error(err));
                break;
            case 'Subequipment':
                subEquipmentsServices.updateSubEquipmentPositionByUUID(currentNodeSelected.UUID, res.rotation, res.sweep).
                            then(setWarningToastPosition(true))
                            .catch((err) => console.error(err));
                break;
            default: //Instrument
                instrumentsServices.updateInstrumentPositionByUUID(currentNodeSelected.UUID, res.rotation, res.sweep).
                    then(setWarningToastPosition(true))
                    .catch((err) => console.error(err));
                break;
        }
    }
    const info = () => {
        if (sdkMatterport.Camera !== undefined) {
            _info = !_info;
            const pose = sdkMatterport.Camera.getPose();
            pose.then(res => {
                if (currentNodeSelected !== undefined) {
                    callServiceOfObject(currentNodeSelected, res);
                }

            })
        }
    };

    const ActualizarSensor = () => {
        if (draggedSensor !== undefined) {
            sensorsServices.updateSensorPositionByid(draggedSensor.id, draggedSensor.position, draggedSensor.rotation)
                .then(setWarningToastPosition(true))
                .catch((err) => console.error(err));
        }

    };

    const ActualizarModelo = () => {
        modelsServices.updateModelsPositionByid(draggedModel.id, draggedModel.position, draggedModel.rotation, draggedModel.scale)
            .then(setWarningToastPosition(true))
            .catch((err) => console.error(err));
    };

    const ActualizarVolumen = () => {
        volumenServices.updateVolumesPositionByid(draggedModel.idVolumen, draggedModel.position, draggedModel.rotation, draggedModel.scale)
            .then(setWarningToastPosition(true))
            .catch((err) => console.error(err));
    };

    const pointerHandClass = (objectToEvaluate, validateUndefined = false) => {
        if(validateUndefined === true){
            return objectToEvaluate !== undefined ? pointerHand : '';
        }

        return objectToEvaluate ? pointerHand : '';
    };

    return (
        <div className={`${logged ? "" : "hidden"}`}>
            <ToastContainer
                position="middle-center"
                className="p-3 details-toast"
            >
                <Toast
                    bg="success"
                    onClose={() => setWarningToastPosition(false)} show={WarningToastPosition} delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Exito</strong>
                    </Toast.Header>
                    <Toast.Body>Posición Actualizada</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className={`no-pointer-events no-text-select ${isDetailsClosed ? 'hiddenDetails' : ''}`} id="dev-actions">
                <Button
                    className={`pointer-events ${pointerHandClass(currentNodeSelected, true)}`}
                    onClick={() => info()}
                    variant="primary">
                    Actualizar SweepPoint
                </Button>

                <Button
                    className={`pointer-events ${pointerHandClass(activeSensors)}`}
                    onClick={() => ActualizarSensor()}
                    variant="primary">
                    Actualizar Sensor
                </Button>

                <Button
                    className={`pointer-events ${pointerHandClass(activeButtonModelsIcons)}`}
                    onClick={() => ActualizarModelo()}
                    variant="primary">
                    Actualizar Modelo
                </Button>
                <Button
                    className={`pointer-events ${pointerHandClass(activeButtonModelsIcons)}`}
                    onClick={() => ActualizarVolumen()}
                    variant="primary">
                    Actualizar Volumen
                </Button>
            </div>
        </div>

    )
}

export default ElementActions
