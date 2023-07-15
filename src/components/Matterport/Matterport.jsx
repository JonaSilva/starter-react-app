
import React, { useContext, useEffect, useState } from 'react';
import MenuOverlay from '../Overlay/MenuOverlay';
import Document from '../Overlay/Document/Document';
import './matterport.scss'

import PropTypes from 'prop-types'
import OverlayContext from '../Overlay/OverlayContext';
import GlobalContext from '../../context/globalContext'
import MatterportContext from './MatterportContext';
import Line from './Line';
import Iframe3DCss2 from './Iframe3DCss2';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import animationServices from '../../services/matterportServices/animationServices';
import SensorsWebSocket from '../../services/SensorsWebSocket';
import Colliders from './Colliders';
import volumes from './../../services/matterportServices/volumes.js'
/**
 * 
 * @returns 
 * 
 */
function Matterport() {
    const { point,
        updateSdk,
        toogleModel,
        setCurrentPosition,
        activeSensors,
        sensorsData,
        activeMeasure,
        setActiveMeasure,
        sdkMatterport,
        setClickedModel,
        models,
        setModels,
        setfbxObjects,
        activeVideo3D
    } = useContext(MatterportContext)
    const { model, startPoint } = useContext(GlobalContext);
    const { isDocumentClosed, currentSensors, currentModels, setCurrentSensors } = useContext(OverlayContext);
    const [sensors, setSensors] = useState([])
    const [activateAnimation] = useState(false);
    const [appState, setAppState] = useState("Loading");
    let modelo;
    let mpSdk;
    let room = `${process.env.REACT_APP_SHOW_CASE}${model}${process.env.REACT_APP_OPTIONS_MATTERPORT}${process.env.REACT_APP_SDK_KEY}`;
    let measurementLinesNode;

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
            activeColliderSensor();
            testingMove(sdkMatterport);
        }

        if (sdkMatterport.Scene !== undefined) {
            volumes.loadRoomVolumens(sdkMatterport);
            activeColliderSensor();
            sdkMatterport.Measurements.data.subscribe({
                onAdded: function (index, item, collection) {
                    loadLineCallBack(item)
                }
            });
            sdkMatterport.Measurements.mode.subscribe(function (measurementModeState) {
                // measurement mode state has changed
                measurementModeState = measurementModeState.active;
                if (measurementModeState === false && measurementLinesNode !== undefined) {
                    setActiveMeasure(false)
                    measurementLinesNode.stop();
                    measurementLinesNode = undefined;
                }
            });
        }
    }, [sdkMatterport]);

    useEffect(() => {
        if (!toogleModel && models.length === 0 && currentModels !== undefined) {
            currentModels.forEach(model => looadCallback(model))
        } else if (models.length > 0 && toogleModel) {
            if (toogleModel) {
                try {
                    models.forEach((model) => {
                        
                        if (model.obj3D.children[0].visible !== undefined) {
                            model.obj3D.children[0].visible = false;
                        }
                    });
                } catch (error) {
                    console.error({ error });
                }
            } else {
                models.forEach((model) => {
                    model.obj3D.children[0].visible = true;
                });
            }
        }
    }, [toogleModel, currentModels]);

    useEffect(() => {
    }, [toogleModel])

    useEffect(() => {
        distanceActive();
    }, [activeMeasure]);

    useEffect(() => {

        if (currentSensors !== undefined && activeSensors) {
            if (sensors.length === 0) {
                currentSensors.forEach((sensor, index) => {
                    looadSensorsCall(sensor, index)
                })
            }
            if (sensors.length > 0) {
                sensors.forEach((sensor) => {
                    sensor.context.root.obj3D.children[0].children[0].visible = true;
                });
            }
        }

        if (activeSensors === false && sensors.length > 0 || currentSensors === undefined) {
            sensors.forEach((sensor) => {
                sensor.context.root.obj3D.children[0].children[0].visible = false;
            });
            if(currentSensors === undefined){
                setSensors([]);
            }
        }

        
    }, [activeSensors, currentSensors]);

    useEffect(() => {
        if (sensorsData !== undefined && sensors!== undefined) {
            if(sensors.length > 1)
            sensorsData.forEach((sensor, index) => {
                sensors[index].inputs.value = parseFloat(sensor.val);
            })
        }
    }, [sensorsData]);


    useEffect(() => {
        if(sensors !== undefined){
            if (sensors.length > 0 && sensors[sensors.length - 1].componentType === "GaugeSensor") {
                sensors[0].loaded = true;
            }
        }
    }, [sensors]);

    useEffect(() => {
        if (activeVideo3D) {
            loadVideoPanel()
        }
    }, [activeVideo3D]);

    useEffect(() => {
        if (activateAnimation) {
            animationServices.activeAnimation(currentModels, models, sdkMatterport)
        }
    }, [activateAnimation, currentModels]);

    const loadVideoPanel = async () => {
        const [sceneObject] = await sdkMatterport.Scene.createObjects(1);
        const nodeVideo = sceneObject.addNode();
        sdkMatterport.Scene.register('Iframe3d', Iframe3DCss2.Iframe3DCSS2Factory)
            .then(res => {
                nodeVideo.obj3D.position.set(27.3507, -0, -25);
                nodeVideo.obj3D.rotation.set(0, 0, 0);
                const VideoPlaneComponent = nodeVideo.addComponent("Iframe3d");

                VideoPlaneComponent.inputs.visible = true;
                VideoPlaneComponent.inputs.frameSRC = "http://localhost:3500/d-solo/SCSmFAb4z/new-dashboard?orgId=1&from=1677619115750&to=1677640715750&panelId=4";
                nodeVideo.start();
            });

    };

    const iframeLoaded = async () => {
        let sdk;
        const showcase = document.getElementById("showcase");
        const key = process.env.REACT_APP_SDK_KEY;

        try {
            sdk = await showcase.contentWindow.MP_SDK.connect(showcase, key, "3.6");
            onShowcaseConnect(sdk);
            sdk.App.state.subscribe(function (appState) {
                setAppState(appState.phase);
            });
        }
        catch (e) {
            setAppState("Error: " + e);
            console.error(e);
            return;
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
                origin: { x: 13.157041549682617, y: 0.09695100784301758, z: -21.473613739013672 },
                radius: 2,
                userData: {
                    id: 'sphere-source-2'
                },
            }),
            sdkMatterport.Sensor.createSource(sdkMatterport.Sensor.SourceType.SPHERE, {
                origin: { x: 18.778383255004883, y: 0.0919344425201416, z: -19.791112899780273 },
                radius: 2,
                userData: {
                    id: 'sphere-source-3'
                },
            }),


        ]);
        const sensor = await sdkMatterport.Sensor.createSensor(sdkMatterport.Sensor.SensorType.CAMERA);
        sensor.addSource(...sources);
        sensor.readings.subscribe({
            onUpdated(source, reading) {
                if (reading.inRange) {
                    if (source.userData.id == "sphere-source-2") {
                        animationServices.activateLastAnimation();
                    }
                    if (source.userData.id == "sphere-source-3") {
                        animationServices.loadFbx(sdkMatterport, {
                            animated: 0,
                            id: 81,
                            data: Array[1],
                            0: 1,
                            length: 1,
                            type: "Buffer",
                            interactuable_content: "ensamble",
                            interactuable_type: "web",
                            modelfilename: "mano.fbx",

                            modelformat: "FBX",
                            parent: "db7266da-1a5f-11ed-b646-002b67db2934",
                            positionx: 17.1447,
                            positiony: 0.562028,
                            positionz: -22.5677,
                            rotationx: -168.314,
                            rotationy: -41.178,
                            rotationz: -178.695,
                            scalex: 0.01,
                            scaley: 0.01,
                            scalez: 0.01,
                            lightIntensity: 0.2

                        })
                    }
                }
            }
        });
    };

    const looadCallback = async (model) => {
        loadModel(sdkMatterport, model);
    };

    const loadLineCallBack = async (item) => {
        loadLine(sdkMatterport, item);
    };

    const looadSensorsCall = async (model, index) => {
        looadGaugeSensor(model, index);
    };

    const looadGaugeSensor = async (data, index) => {
        const [sceneObject] = await sdkMatterport.Scene.createObjects(1);

        sdkMatterport.Scene.register('css2Frame', Iframe3DCss2.Iframe3DCSS2Factory)
            .then((res) => {
                const sensorNode = sceneObject.addNode();
                sensorNode.obj3D.position.set(data.xpos, data.ypos, data.zpos);
                sensorNode.obj3D.rotation.set(degtoRad(data.rotationx), degtoRad(data.rotationy), degtoRad(data.rotationz));
                sensorNode.UUID = data.Id;

                const css2Sensor = sensorNode.addComponent("css2Frame");
                css2Sensor.inputs.visible = true;
                css2Sensor.inputs.frameSRC = data.source;

                sensorNode.start();

                setSensors(current => [...current, css2Sensor]);
            })
    };

    const evaluateInteractionAndAnimate = (model, node, scaleRange) => {

        let addScale = false;
        if (model.interactuable.data[0] === 1 && model.animated === 1) {
            const modelAnimation = function () {
                requestAnimationFrame(modelAnimation);
                if (addScale) {
                    node.scale.x += 0.006;
                    node.scale.y += 0.006;
                    node.scale.z += 0.006;
                    if (node.scale.x >= scaleRange.max) {
                        addScale = false
                    }
                } else {
                    node.scale.x -= 0.006;
                    node.scale.y -= 0.006;
                    node.scale.z -= 0.006;
                    if (node.scale.x <= scaleRange.min) {
                        addScale = true
                    }
                }
            }
            modelAnimation();
        }
    };

    const loadModel = async (sdk, model) => {
        const [sceneObject] = await sdk.Scene.createObjects(1);

        const lights = sceneObject.addNode();
        const scaleRange = {
            max: 0.2 + model.scalex,
            min: model.scalex,
        }
        lights.addComponent('mp.lights');
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
                x: 0, y: 0, z: 0
            }
        };
        modelo = node.addComponent(sdk.Scene.Component.FBX_LOADER, initial);
        modelo.type = "FBX MODEL";
        /**COntrol */
        node.start();

        setModels(current => [...current, node]);

        const emitPath = sceneObject.addEmitPath(modelo, 'INTERACTION.CLICK');
        const hooverEmithPath = sceneObject.addEmitPath(modelo, 'INTERACTION.HOVER');
        sceneObject.spyOnEvent({
            path: emitPath,
            onEvent(eventData) {
                setClickedModel(model.id);

            },
        });
        sceneObject.spyOnEvent({
            path: hooverEmithPath,
            onEvent(eventData) {
                if (eventData.hover && model.interactuable.data[0] === 1) {
                    document.getElementById('showcase').contentWindow.document.getElementsByClassName("showcase")[0].style.cursor = "pointer";
                } else {
                    document.getElementById('showcase').contentWindow.document.getElementsByClassName("showcase")[0].style.cursor = "auto";
                }
            },
        });

        setfbxObjects(current => [...current, lights]);
        setfbxObjects(current => [...current, node]);

        evaluateInteractionAndAnimate(model, node, scaleRange);
    };

    const loadLine = async (sdk, lineItem) => {
        if (sdk.Scene !== undefined) {
            const [sceneObject] = await sdkMatterport.Scene.createObjects(1);

            sdkMatterport.Scene.register('Line', Line.LineFactory).then((res) => {
                measurementLinesNode = sceneObject.addNode();
                measurementLinesNode.obj3D.position.set(lineItem.points[0].x, lineItem.points[0].y, lineItem.points[0].z);
                const LineComponent = measurementLinesNode.addComponent('Line');
                LineComponent.inputs.points = lineItem.points;
                measurementLinesNode.start();
            });
        }
    };

    async function onShowcaseConnect(mpSdk) {
        try {
            updateSdk(mpSdk);
        } catch (e) {
            console.error(e);
        }
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
        })
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

    return (
        <>
            <Colliders />
            <SensorsWebSocket active={activeSensors} />
            {isDocumentClosed === false ?
                <Document

                /> : <></>
            }
            <div className='matterport no-image-select no-text-select' id='matteport-container'>
                <LoadingScreen appState={appState} />
                <MenuOverlay />

                <video
                    crossOrigin="anonymous"
                    playsInline
                    id='video'
                    loop
                    width="640"
                    height="360"
                    controls
                    className='hidden'
                    volume="0.5"

                >
                    <source src={process.env.REACT_APP_DOMAIN + "/static/files/video/" + "Llenado video final.mp4"} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>


                <iframe
                    id="showcase"
                    className="iframe"
                    src={room}
                    title="frame"
                    frameBorder="0" allow="fullscreen; vr"
                    allowFullScreen
                    onLoad={iframeLoaded}
                >
                </iframe>

            </div>
        </>
    );
}
Matterport.propTypes = {
    room_id: PropTypes.string
};

export default Matterport