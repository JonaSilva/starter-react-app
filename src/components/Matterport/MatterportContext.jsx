
import { createContext, useState } from "react";
const MatterportContext = createContext();

export function MatterportProvider({ children }) {
    const [sdkMatterport, setSdk] = useState({});
    const [point, setPoint] = useState();
    const [toogleModel, setToogleModel] = useState(true);
    const [increaseRotaiton, setincreaseRotaiton] = useState(0);
    const [currentPosition, setCurrentPosition] = useState({ x: "nan", y: "nan" });
    const [currentControl, setCurrentControl] = useState(null);
    const [positionTomove, setPositionTomove] = useState();
    const [activeSensors, setActiveSensors] = useState(false);
    const [sensorsData, setSensorsData] = useState([]);
    const [transformControls, setTransformControls] = useState([]);
    const [activeMeasure, setActiveMeasure] = useState();
    const [draggedSensor, setDraggedSensor] = useState();
    const [draggedModel, setDraggedModel] = useState();
    const [clickedModel, setClickedModel] = useState();
    const [models, setModels] = useState([]);
    const [fbxObjects, setfbxObjects] = useState([]);
    const [controlGizmos, setControlGizmos] = useState([]);
    const [activeVideo3D, setactiveVideo3D] = useState(false);
    const [loadEmptyModel, setloadEmptyModel] = useState(false);
    const [activeClickedGizmo, setActiveClickedGizmo] = useState({ activate: true, idActiveGizmo: "" });
    //const [active, setTransformControls] = useState();

    const updatePoint = (newPoint) => {
        console.log({ newPoint })
        setPoint(newPoint);
    }
    const updateSdk = (sdk) => {
        setSdk(sdk);
    }

    return (
        <MatterportContext.Provider value={{
            point,
            updatePoint,
            updateSdk,
            setToogleModel,
            toogleModel,
            currentPosition,
            setCurrentPosition,
            setPoint,
            positionTomove,
            setPositionTomove,
            increaseRotaiton,
            setincreaseRotaiton,
            activeSensors,
            setActiveSensors,
            sensorsData,
            setSensorsData,
            sdkMatterport,
            transformControls,
            setTransformControls,
            activeMeasure,
            setActiveMeasure,
            draggedSensor,
            setDraggedSensor,
            draggedModel,
            setDraggedModel,
            clickedModel,
            setClickedModel,
            models,
            setModels,
            fbxObjects,
            setfbxObjects,
            controlGizmos,
            setControlGizmos,
            activeVideo3D,
            setactiveVideo3D,
            loadEmptyModel,
            setloadEmptyModel,
            activeClickedGizmo,
            setActiveClickedGizmo,
            currentControl,
            setCurrentControl
        }}>
            {children}
        </MatterportContext.Provider>
    )
}

export default MatterportContext