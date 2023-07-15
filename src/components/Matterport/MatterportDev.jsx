
import React, { useContext, useEffect, useRef, useState } from 'react';
import MenuOverlay from '../Overlay/MenuOverlay';
import Document from '../Overlay/Document/Document';
import './matterport.scss'

import PropTypes from 'prop-types'
import OverlayContext from '../Overlay/OverlayContext';
import GlobalContext from '../../context/globalContext'
import MatterportContext from './MatterportContext';
import Label from './Label';
import Line from './Line';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import SensorsWebSocket from '../../services/SensorsWebSocket';
import Colliders from './Colliders';
import animationServices from '../../services/matterportServices/animationServices';
import volumenServices from '../../services/volumenServices';
/**
 * 
 * @returns 
 * 
 */
function triggerEvent(elem, event) {
    const clickEvent = new Event(event); // Create the event.
    elem.dispatchEvent(clickEvent);    // Dispatch the event.
}
function MatterportDev() {
    const { point,
        updateSdk,
        toogleModel,
        setCurrentPosition,
        activeSensors,
        sensorsData,
        transformControls,
        setTransformControls,
        activeMeasure,
        setActiveMeasure,
        sdkMatterport,
        setDraggedSensor,
        setDraggedModel,
        setfbxObjects,
        models,
        setModels,
        loadEmptyModel,
        setloadEmptyModel,
        currentPosition,
        setToogleModel,
        setControlGizmos,
        controlGizmos,
        activeClickedGizmo,
        setActiveClickedGizmo
    } = useContext(MatterportContext)
    const { model, startPoint } = useContext(GlobalContext);
    const {
        isDocumentClosed,
        currentSensors,
        currentModels,
        setDevActions,
        currentNodeSelected

    } = useContext(OverlayContext);
    const [sensors, setSensors] = useState([])
    const [activateAnimation, setActivateAnimation] = useState(false);
    const [gizmoType, setGizmoType] = useState("");
    const iframeLoad = useRef(null);
    const [appState, setAppState] = useState("Loading");
    let modelo;
    let mpSdk;
    let room = `${process.env.REACT_APP_SHOW_CASE}${model}${process.env.REACT_APP_OPTIONS_MATTERPORT}${process.env.REACT_APP_SDK_KEY}`;
    let measurementLinesNode;
    const INTERACTIONCLICK = 'INTERACTION.CLICK';

    if (startPoint !== ('' || 'null' || null)) {
        room = `${room}${startPoint}`;
    }

    useEffect(() => {
        if (point !== undefined) {
            moveToPoint(point);
        }
    }, [point]);

    useEffect(() => {
        if (sdkMatterport.Sweep !== undefined) {
            testingMove(sdkMatterport);
        }
        if (sdkMatterport.Scene !== undefined) {

            activeColliderSensor();
            sdkMatterport.Measurements.data.subscribe({
                onAdded: function (index, item, collection) {
                    loadLineCallBack(item)
                }
            });

            sdkMatterport.Measurements.mode.subscribe(function (measurementModeState) {
                // measurement mode state has changed
                measurementModeState = measurementModeState.active;
                if (measurementModeState === false) {
                    if (measurementLinesNode !== undefined) {
                        setActiveMeasure(false);
                        measurementLinesNode.stop();
                        measurementLinesNode = undefined;
                    }
                }

            });
        }
    }, [sdkMatterport]);

    useEffect(() => {
        if (!toogleModel && models.length === 0 && currentModels !== undefined) {
            currentModels.forEach(model => looadCallback(model));
        }

        if (models.length > 0) {
            if (toogleModel) {
                models.forEach((model) => {
                    model.obj3D.children[0].visible = false;
                });
                transformControls.forEach(t => {
                    if (t.TYPE === "MODEL" && t.obj3D.children[0] !== undefined) {
                        t.obj3D.children[0].visible = false;
                    }
                });
            } else {
                models.forEach((model) => {
                    model.obj3D.children[0].visible = true;
                    transformControls.forEach(t => t.obj3D.children[0].visible = true);
                })
                transformControls.forEach(t => {
                    if (t.TYPE === "MODEL") {
                        t.obj3D.children[0].visible = true;
                    }
                });
            }
        }
    }, [toogleModel, currentModels]);

    useEffect(() => {
        distanceActive();
    }, [activeMeasure]);

    const turnOnSensors = () => {
        sensors.forEach((sensor) => setDevActions(true));
        transformControls.forEach(t => {
            if (t.TYPE === "SENSOR") {
                setDevActions(true);
                t.obj3D.children[0].visible = true;
            }
        });
    }

    useEffect(() => {

        if (currentSensors !== undefined && activeSensors) {
            if (sensors.length === 0) {
                currentSensors.forEach((sensor, index) => {
                    looadSensorsCall(sensor, index);
                });

                turnOnSensors();
            } else {
                turnOnSensors();
            }
        }
        if ((currentSensors === undefined || activeSensors === false) && (sensors.length > 0)) {
            transformControls.forEach(t => {
                if (t.TYPE === "SENSOR") {
                    t.obj3D.children[0].visible = false
                }
            });
        }

    }, [currentSensors, activeSensors]);

    useEffect(() => {
        if (sensorsData !== undefined && sensors!== undefined) {
            if (sensorsData !== undefined && sensors.length > 1) {
                sensorsData.forEach(element => {
                    if (element !== undefined && element.UUID === sensors.Id) {
                        element.inputs.value = parseFloat(sensors.val);
                        element.inputs.units = sensors.units;
                    }
                });
            }
        }
    }, [sensorsData]);


    useEffect(() => {
        if(sensors !== undefined){
            console.log(sensors);
            if (sensors.length > 0 && sensors[sensors.length - 1].componentType === "GaugeSensor") {
                sensors[0].components[0].instance.inputs.loaded = true;
            }
        }
    }, [sensors]);

    useEffect(() => {
        if (loadEmptyModel) {
            setloadEmptyModel(false);
            if (currentNodeSelected !== undefined) {
                volumenServices.addNewVolume(
                    currentNodeSelected.UUID,
                    currentPosition.x,
                    currentPosition.y,
                    currentPosition.z,
                    0,
                    0,
                    0,
                    1,
                    1,
                    1).then(res => {
                        emptyModelLoader(currentNodeSelected.name, res.insertId);
                    })
                    .catch(err => console.error({ err }))
            }
        }
    }, [loadEmptyModel]);

    useEffect(() => {
        if (activateAnimation) {
            animationServices.activeAnimation(currentModels, models, sdkMatterport)
        }
    }, [activateAnimation, currentModels]);

    useEffect(() => {
        if (activeClickedGizmo.activate) {
            setActiveClickedGizmo(prevState => ({
                ...prevState,
                activate: false
            }));
            if (controlGizmos.length > 0) {
                controlGizmos.forEach(gizmo => {
                    gizmo.visible = false;
                    gizmo.enabled = false;
                });
            }
        }
    }, [activeClickedGizmo]);

    useEffect(() => {
        if (gizmoType !== "") {
            if (controlGizmos.length > 0) {
                const currentGizmo = controlGizmos.find(gizmo => gizmo.GizmoId === activeClickedGizmo.idActiveGizmo);
                if (currentGizmo !== undefined) {
                    currentGizmo.enabled = true;
                    currentGizmo.mode = gizmoType;
                }
            }
        }
    }, [gizmoType, activeClickedGizmo]);

    const iframeLoaded = async () => {
        let sdk;
        const showcase = document.getElementById("showcase");
        const key = process.env.REACT_APP_SDK_KEY;
        try {
            sdk = await showcase.contentWindow.MP_SDK.connect(showcase, key, "3.6");
            onShowcaseConnect(sdk);
            sdk.App.state.subscribe(function (appState) {
                // app state has changed
                setAppState(appState.phase);
            });
        }
        catch (e) {
            setAppState("Error: " + e);
            console.error(e);
            return;
        }
        document.getElementById("showcase").contentDocument.activeElement.addEventListener("keyup", keyUpCallback)

    };

    const keyUpCallback = (e, clicked) => {
        switch (e.key) {
            case "r":
                setGizmoType("rotate");
                break;
            case "m":
                setGizmoType("translate");
                break;
            case "v":
                setGizmoType("scale");
                break;
            case "x":
                setGizmoType("borrar");
                break;
            default:
                break;
        }
    };

    const activeColliderSensor = async () => {
        const sources = await Promise.all([
            sdkMatterport.Sensor.createSource(sdkMatterport.Sensor.SourceType.SPHERE, {
                origin: { x: 15.428938865661621, y: 0.08918046951293945, z: -19.989582061767578 },
                radius: 2,
                userData: {
                    id: 'sphere-source-1',
                },
            }),
            sdkMatterport.Sensor.createSource(sdkMatterport.Sensor.SourceType.SPHERE, {
                radius: 2,
                userData: {
                    id: 'sphere-source-2'
                },
            }),
        ]);
        const sensor = await sdkMatterport.Sensor.createSensor(sdkMatterport.Sensor.SensorType.CAMERA);
        sensor.addSource(...sources);

        sensor.readings.subscribe({
            onUpdated(source, reading) {
                if (reading.inRange && toogleModel === true) {
                    setToogleModel(false)
                    setActivateAnimation(true);
                }
            }
        });
    };

    const looadCallback = async (model) => {
        setDevActions(true);
        loadModel(sdkMatterport, model);
    };

    const loadLineCallBack = async (item) => {
        loadLine(sdkMatterport, item);
    };

    const looadSensorsCall = async (sensor, index) => {
        setDevActions(true);
        loadSensor(sdkMatterport, sensor);
    };

    const addComponentTransformControls = (nodeControl) => {
        return nodeControl.addComponent('mp.transformControls');
    };

    const emptyModelLoader = async (name, volumenId) => {
        const model = {
            animated: 0,
            id: 61,
            interactuable: "1",
            interactuable_content: "",
            interactuable_type: "text",
            modelfilename: "Cubo.fbx",
            modelformat: "FBX",
            parent: currentNodeSelected.UUID ? currentNodeSelected.UUID : "db722953-1a5f-11ed-b646-002b67db2934",
            positionx: currentPosition.x,
            positiony: -0.7,
            positionz: currentPosition.z,
            rotationx: 0,
            rotationy: 0,
            rotationz: 0,
            scalex: 1,
            scaley: 1,
        };

        const [sceneObject] = await sdkMatterport.Scene.createObjects(1);
        const node = sceneObject.addNode();
        node.obj3D.position.set(model.positionx, model.positiony, model.positionz);
        node.obj3D.rotation.set(degtoRad(model.rotationx), degtoRad(model.rotationy), degtoRad(model.rotationz));
        const initial = {
            url: process.env.REACT_APP_DOMAIN + "/static/files/3d/" + model.modelfilename,
            visible: true,
            localScale: {
                x: model.scalex,
                y: model.scaley,
                z: model.scalez
            },
            localPosition: {
                x: 0, y: 0, z: 0
            },
            localRotation: {
                x: 0, y: 0, z: 0
            }
        };
        modelo = node.addComponent(sdkMatterport.Scene.Component.FBX_LOADER, initial);
        const nodeControl = sceneObject.addNode();
        const myControl = addComponentTransformControls(nodeControl);

        nodeControl.start();
        myControl.inputs.mode = 'rotate';
        myControl.inputs.selection = node;
        nodeControl.TYPE = "MODEL";
        node.start();
        modelo.events[sdkMatterport.Scene.InteractionType.HOVER] = true;
        myControl.events[sdkMatterport.Scene.InteractionType.CLICK] = true;
        myControl.events[sdkMatterport.Scene.InteractionType.ROTATE] = true;
        myControl.events[sdkMatterport.Scene.InteractionType.LONG_PRESS_END] = true;
        myControl.events[sdkMatterport.Scene.InteractionType.HOVER] = true;
        myControl.events[sdkMatterport.Scene.InteractionType.DRAG_END] = true;

        myControl.transformControls.addEventListener('objectChange', (e) => {
            myControl.inputs.selection.obj3D.rotation.isEuler = false;
            setDraggedModel({
                id: model.id,
                idVolumen: volumenId,
                position: myControl.inputs.selection.obj3D.position,
                rotation: {
                    x: radToDeg(myControl.inputs.selection.obj3D.rotation._x),
                    y: radToDeg(myControl.inputs.selection.obj3D.rotation._y),
                    z: radToDeg(myControl.inputs.selection.obj3D.rotation._z)
                },
                scale: {
                    x: myControl.inputs.selection.obj3D.scale.x,
                    y: myControl.inputs.selection.obj3D.scale.y,
                    z: myControl.inputs.selection.obj3D.scale.z
                }
            });
        });

        myControl.emits =
        {
            // emit a clicked events
            clicked: true,
            [sdkMatterport.Scene.InteractionType.HOVER]: true,
            [sdkMatterport.Scene.InteractionType.DRAG_END]: true

        };

        const emitPath = sceneObject.addEmitPath(modelo, INTERACTIONCLICK);
        const hooverEmithPath = sceneObject.addEmitPath(myControl, 'INTERACTION.HOVER');
        myControl.outputs.objectRoot.GizmoId = volumenId;
        setControlGizmos(oldArray => [...oldArray, myControl.outputs.objectRoot]);

        setActiveClickedGizmo(prevState => ({
            ...prevState,
            activate: true
        }));

        sceneObject.spyOnEvent({
            path: emitPath,
            onEvent(eventData) {
                setActiveClickedGizmo({
                    idActiveGizmo: volumenId,
                    activate: true
                });

                setTimeout(function () {
                    myControl.outputs.objectRoot.visible = true;
                    myControl.outputs.objectRoot.enabled = true;
                }, 500);
            },
        });
        sceneObject.spyOnEvent({
            path: hooverEmithPath
        });
    }

    const loadModel = async (sdk, model) => {

        const [sceneObject] = await sdk.Scene.createObjects(1);
        const lights = sceneObject.addNode();
        const initialLight = {
            enabled: true,
            color: {
                r: 1, g: 1, b: 1
            },
            intensity: 0.35,
        };


        lights.addComponent('mp.ambientLight', initialLight);
        lights.start();
        const node = sceneObject.addNode();
        node.obj3D.position.set(model.positionx, model.positiony, model.positionz);
        node.obj3D.rotation.set(degtoRad(model.rotationx), degtoRad(model.rotationy), degtoRad(model.rotationz));
        const initial = {
            url: process.env.REACT_APP_DOMAIN + "/static/files/3d/" + model.modelfilename,
            visible: true,
            localScale: {
                x: model.scalex,
                y: model.scaley,
                z: model.scalez
            },
            localPosition: {
                x: 0, y: 0, z: 0
            },
            localRotation: {
                // x: model.rotationx, y: model.rotationy, z: model.rotationz
                x: 0, y: 0, z: 0
            }
        };
        modelo = node.addComponent(sdk.Scene.Component.FBX_LOADER, initial);
        const nodeControl = sceneObject.addNode();
        const myControl = addComponentTransformControls(nodeControl);

        nodeControl.start();
        myControl.inputs.visible = true;
        myControl.inputs.selection = node;
        myControl.inputs.mode = 'rotate';
        nodeControl.TYPE = "MODEL";
        node.start();
        setTransformControls(current => [...current, nodeControl]);
        modelo.events[sdk.Scene.InteractionType.HOVER] = true;
        myControl.events[sdk.Scene.InteractionType.CLICK] = true;
        myControl.events[sdk.Scene.InteractionType.ROTATE] = true;
        myControl.events[sdk.Scene.InteractionType.LONG_PRESS_END] = true;
        myControl.events[sdk.Scene.InteractionType.HOVER] = true;
        myControl.events[sdk.Scene.InteractionType.DRAG_END] = true;

        myControl.transformControls.addEventListener('objectChange', (e) => {
            myControl.inputs.selection.obj3D.rotation.isEuler = false;
            setDraggedModel({
                id: model.id,
                position: myControl.inputs.selection.obj3D.position,
                rotation: {

                    x: radToDeg(myControl.inputs.selection.obj3D.rotation._x),
                    y: radToDeg(myControl.inputs.selection.obj3D.rotation._y),
                    z: radToDeg(myControl.inputs.selection.obj3D.rotation._z)
                }
            });
        });
        myControl.emits =
        {
            // emit a clicked events
            clicked: true,
            [sdk.Scene.InteractionType.HOVER]: true,
            [sdk.Scene.InteractionType.DRAG_END]: true

        };

        setModels(current => [...current, node]);

        const emitPath = sceneObject.addEmitPath(modelo, INTERACTIONCLICK);
        const hooverEmithPath = sceneObject.addEmitPath(myControl, 'INTERACTION.HOVER');

        myControl.outputs.objectRoot.GizmoId = model.id;
        setControlGizmos(oldArray => [...oldArray, myControl.outputs.objectRoot]);
        setActiveClickedGizmo(prevState => ({
            ...prevState,
            activate: true
        }));
        sceneObject.spyOnEvent({
            path: emitPath,
            onEvent(eventData) {
                setActiveClickedGizmo({
                    idActiveGizmo: model.id,
                    activate: true
                });

                setTimeout(function () {
                    myControl.outputs.objectRoot.visible = true;
                    myControl.outputs.objectRoot.enabled = true;
                }, 500);

            },
        });

        sceneObject.spyOnEvent({
            path: hooverEmithPath
        });
        setfbxObjects(current => [...current, lights]);
        setfbxObjects(current => [...current, nodeControl]);
        setfbxObjects(current => [...current, node]);
    };
    ///Load cube

    const loadLine = async (sdk, lineItem) => {
        if (sdk.Scene !== undefined) {
            const [sceneObject] = await sdkMatterport.Scene.createObjects(1);
            sdkMatterport.Scene.register('Line', Line.LineFactory);
            measurementLinesNode = sceneObject.addNode();
            measurementLinesNode.obj3D.position.set(lineItem.points[0].x, lineItem.points[0].y, lineItem.points[0].z);
            const LineComponent = measurementLinesNode.addComponent('Line');
            LineComponent.inputs.points = lineItem.points;
            measurementLinesNode.start();
        }
    };

    const loadSensor = async (sdk, sensor) => {

        const [sceneObject] = await sdk.Scene.createObjects(1);

        sdk.Scene.register('Label', Label.LabelFactory).then((complete) => {
            const node = sceneObject.addNode();
            node.obj3D.position.set(Math.round(sensor.xpos), Math.round(sensor.ypos), Math.round(sensor.zpos));
            node.obj3D.rotation.set(degtoRad(sensor.rotationx), degtoRad(sensor.rotationy), degtoRad(sensor.rotationz));
            node.UUID = sensor.Id;

            const nodeControl = sceneObject.addNode();

            modelo = node.addComponent("Label");
            modelo.UUID = sensor.Id;

            const myControl = addComponentTransformControls(nodeControl);
            nodeControl.start();
            myControl.inputs.visible = true;
            myControl.inputs.selection = node;
            myControl.inputs.mode = 'translate';
            myControl.events[INTERACTIONCLICK] = true;
            const draggEndControlEmithPath = sceneObject.addEventPath(myControl, 'INTERACTION.DRAG_END');
            const longPRessControlEmith = sceneObject.addEventPath(myControl, 'INTERACTION.LONG_PRESS_END');

            myControl.emits =
            {
                // emit a clicked events
                clicked: true,

            };

            nodeControl.TYPE = "SENSOR";

            sceneObject.spyOnEvent({
                path: longPRessControlEmith,
                onEvent(eventData) {
                    setDraggedSensor({
                        id: sensor.Id, position: eventData.collider.position, rotation: {
                            x: radToDeg(myControl.inputs.selection.obj3D.rotation._x),
                            y: radToDeg(myControl.inputs.selection.obj3D.rotation._y),
                            z: radToDeg(myControl.inputs.selection.obj3D.rotation._z)
                        }
                    });
                },
            });
            modelo.onEvent({ eventType: "evento" });
            node.start();

            sceneObject.spyOnEvent({
                path: draggEndControlEmithPath,
                onEvent(eventData) {

                    setDraggedSensor({
                        id: sensor.Id,
                        position: eventData.collider.position,
                        rotation: {
                            x: radToDeg(myControl.inputs.selection.obj3D.rotation._x),
                            y: radToDeg(myControl.inputs.selection.obj3D.rotation._y),
                            z: radToDeg(myControl.inputs.selection.obj3D.rotation._z)
                        }
                    });
                },
            });
        });

        setSensors(current => [...current, modelo]);
    };

    async function onShowcaseConnect(mpSdk) {
        try {
            updateSdk(mpSdk);
        } catch (e) {
            console.error(e);
        }
    };

    function radToDeg(rad) {
        return rad * 180.0 / Math.PI;
    };

    function degtoRad(deg) {
        return deg / 180.0 * Math.PI;
    };

    async function onMovePoint(mpSdk, point) {
        point.rotation.x = parseFloat(point.rotation.x)
        point.rotation.y = parseFloat(point.rotation.y)

        if (point.rotation === undefined || (isNaN(point.rotation.x) || (isNaN(point.rotation.y)))) {
            point.rotation = { x: 0, y: 0 };
        }
        const sweepId = point.sweep ? point.sweep : '113d90e80778439f8cd748177c572a6e';
        const rotation = point.rotation;
        const transition = mpSdk.Sweep.Transition.FADE;
        const transitionTime = 2000;
        mpSdk.Sweep.moveTo(sweepId, {
            rotation: rotation,
            transition: transition,
            transitionTime: transitionTime,
        });
    };


    const distanceActive = async function () {
        onActiveDistance(sdkMatterport);

    };

    async function onActiveDistance(mpSdk, point) {
        let subscription;
        if (measurementLinesNode !== undefined) {
            measurementLinesNode.stop();
            measurementLinesNode = undefined;
        }
        if (mpSdk.Measurements !== undefined) {
            mpSdk.Measurements.toggleMode(activeMeasure)
                .then(() => {
                    if (activeMeasure === false) {
                        if (measurementLinesNode !== undefined) {
                            measurementLinesNode.stop();
                            measurementLinesNode = undefined;
                        }
                    }

                });
            if (!activeMeasure) {
                subscription?.cancel();
            }
        }
    };

    const moveToPoint = async function (point) {
        const sdkKey = process.env.REACT_APP_SDK_KEY; // TODO: replace with your sdk key
        const iframe = document.getElementById('showcase');
        try {
            mpSdk = await window.MP_SDK.connect(
                iframe, // Obtained earlier
                sdkKey, // Your SDK key
                '' // Unused but needs to be a valid string
            );
            onMovePoint(mpSdk, point);
        } catch (e) {
            console.error(e);
        }
    };

    async function testingMove(mpSdk) {

        mpSdk.Sweep.current.subscribe(function (currentSweep) {
            // Change to the current sweep has occurred.
            if (currentSweep.sid !== '') {
                setCurrentPosition(currentSweep.position);
            }
        });

        const sweepId = '1';
        const rotation = { x: 30, y: -45 };
        const transition = mpSdk.Sweep.Transition.INSTANT;
        const transitionTime = 2000; // in milliseconds
        if (mpSdk.Sweep !== undefined) {
            mpSdk.Sweep.moveTo(sweepId, {
                rotation: rotation,
                transition: transition,
                transitionTime: transitionTime
            })
                .catch(function (error) {
                    // Error with moveTo command
                    console.error(error);
                });
        }
    };

    // oneSecondTimeOut();
    return (
        <>
            <Colliders />
            <SensorsWebSocket active={activeSensors} />
            {isDocumentClosed === false ?
                <Document

                /> : <></>
            }
            <div
                className='matterport' id='matteport-container'>
                <LoadingScreen appState={appState} />
                <MenuOverlay />
                <iframe
                    id="showcase"
                    className="iframe"
                    src={room}
                    title="frame"
                    frameBorder="0" allow="fullscreen; vr"
                    allowFullScreen
                    onLoad={iframeLoaded}
                    ref={iframeLoad}
                >
                </iframe>
            </div>
            <h6 className='devoloperTag'>Developer</h6>
        </>
    );
};

MatterportDev.propTypes = {
    room_id: PropTypes.string
};

export default MatterportDev;
