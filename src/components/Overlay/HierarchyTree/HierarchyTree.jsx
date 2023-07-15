
import React, { useState, useEffect, useRef, useContext } from 'react';

import Details from './Details/Details';
import D3HierarchyTree from './../D3HierarchyTree';
import ElementActions from './ElementActions/ElementActions';

import GlobalContext from '../../../context/globalContext';
import MatterportContext from '../../Matterport/MatterportContext';
import OverlayContext from '../../Overlay/OverlayContext';

import hyperlinksServices from '../../../services/hyperlinksService';
import searchService from '../../../services/searchService';
import roomServices from '../../../services/roomsService';
import equipmentsServices from '../../../services/equipmentsServices';
import hseEquipmentsServices from '../../../services/hseEquipmentsServices';
import subEquipmentsServices from '../../../services/subEquipmentsServices';
import instrumentsServices from '../../../services/instrumentsServices';
import elementsServices from '../../../services/elementsServices';
import elecricalPanelServices from '../../../services/electricalPanelServices';
import sensorsServices from '../../../services/sensorsServices';
import modelsServices from '../../../services/modelsServices';
import './HierarchyTree.scss';
import { Button } from 'react-bootstrap';
import { BiChevronLeft } from 'react-icons/bi';

//simulate click
function triggerEvent(elem, event) {
    const clickEvent = new Event(event); // Create the event.
    elem.dispatchEvent(clickEvent);    // Dispatch the event.
}

function HierarchyTree(props) {
    let timeout = null;
    const inputRef = useRef(null);
    const { hide } = props;
    const { siteId, siteName, logged } = useContext(GlobalContext);
    const {
        updatePoint,
        positionTomove,
        setPositionTomove,
        setActiveSensors,
        setToogleModel,
        models,
        setModels,
        fbxObjects,
        setfbxObjects

    } = useContext(MatterportContext);
    const {
        currentNodeSelected,
        searchQuery,
        openUbicationBtn,
        setisDetailsClosed,
        isDetailsClosed,
        setCurrentSensors,
        setCurrentModels,
        setActiveButtonSensorsIcons,
        setActiveButtonModelsIcons,
        reloadHierarchy,
        setDevActions,
        triggerSearch,
        setToogleHierarchy,
        modelQueries,
        setModelQueries

    } = useContext(OverlayContext);
    const itemsRef = useRef([]);

    itemsRef.current = [];
    const [found, setFound] = useState({ msg: "not found" });
    const [hierarchyInitial, setHierarchyInitial] = useState({});
    const [hierarchy, setHierarchy] = useState(hierarchyInitial);
    const [hierarchyLevel2, setHierarchyLevel2] = useState([]);
    const [positionNode, setPositionNode] = useState();
    const [dataNode, setDataNode] = useState();
    const [query, setQuery] = useState("");
    const [uuidVolume, setUuidVolume] = useState(undefined);
    const [fileList, setFileList] = useState([
        { filename: "866-700x600.jpg", type: "image" }
    ]);
    const [firstLevel, setFirtsLevel] = useState(false)
    const [roomsUUIDList, setRoomsUUIDList] = useState([]);
    const [d3Key, setD3key] = useState(1);

    const scrollContainer = useRef();

    const emptyNode = {
        TYPE: null,
        UUID: null,
        UUID_PARENT: null,
        PATH: null
    }

    const callServiceOnType = (type, id, parentUUID, position_uuid, rotaion) => {
        switch (type) {
            case 'Equipment':
                equipmentsServices.getEquipmentByUUID(currentNodeSelected.UUID).
                    then(res => {
                        setDataNode(res[0].equipments);
                        if (res[0].equipments.POSITION_UUID !== null) {
                            position_uuid = res[0].equipments.POSITION_UUID;

                        }
                        if (res[0].equipments.hrot !== null && res[0].equipments.vrot !== null) {
                            rotaion = { x: res[0].equipments.hrot, y: res[0].equipments.vrot }

                        }

                        if (position_uuid !== undefined && rotaion !== undefined) {
                            setPositionNode({ sweep: position_uuid, rotation: rotaion });
                        }
                        if (position_uuid === undefined && rotaion !== undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid !== undefined && rotaion === undefined) {
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: position_uuid, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid === undefined && rotaion === undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode(res[0].rooms.POSITION_UUID ? { sweep: res[0].rooms.POSITION_UUID, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } } : undefined);
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }

                    })
                    .catch((err) => {
                        console.error(err)
                    });
                break;
            case 'Electricalpanel':
                elecricalPanelServices.gePaneltByUUID(currentNodeSelected.UUID).
                    then(res => {
                        setDataNode(res[0].electricalpanel);
                        if (res[0].electricalpanel.POSITION_UUID !== null) {
                            position_uuid = res[0].electricalpanel.POSITION_UUID;

                        }
                        if (res[0].electricalpanel.hrot !== null && res[0].electricalpanel.vrot !== null) {
                            rotaion = { x: res[0].electricalpanel.hrot, y: res[0].electricalpanel.vrot }

                        }

                        if (position_uuid !== undefined && rotaion !== undefined) {
                            setPositionNode({ sweep: position_uuid, rotation: rotaion });
                        }
                        if (position_uuid === undefined && rotaion !== undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid !== undefined && rotaion === undefined) {
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: position_uuid, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid === undefined && rotaion === undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode(res[0].rooms.POSITION_UUID ? { sweep: res[0].rooms.POSITION_UUID, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } } : undefined);
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }

                    })
                    .catch((err) => {
                        console.error(err)
                    });
                break;
            case 'HSE_Equipment':
                hseEquipmentsServices.getHSEEquipmentByUUID(currentNodeSelected.UUID).
                    then(res => {
                        setDataNode(res[0].hse_equipments);
                        if (res[0].hse_equipments.POSITION_UUID !== null) {
                            position_uuid = res[0].hse_equipments.POSITION_UUID;
                        }
                        if (res[0].hse_equipments.hrot !== null && res[0].hse_equipments.vrot !== null) {
                            rotaion = { x: res[0].hse_equipments.hrot, y: res[0].hse_equipments.vrot }
                        }

                        if (position_uuid !== undefined && rotaion !== undefined) {
                            setPositionNode({ sweep: position_uuid, rotation: rotaion });
                        }
                        if (position_uuid === undefined && rotaion !== undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: res[0].rooms.POSITION_UUID, rotation: rotaion });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid !== undefined && rotaion === undefined) {
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: position_uuid, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid === undefined && rotaion === undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode(res[0].rooms.POSITION_UUID ? { sweep: res[0].rooms.POSITION_UUID, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } } : undefined);
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }


                    })
                    .catch((err) => {
                        console.error(err)
                    });
                break;
            case 'Subequipment':
                subEquipmentsServices.geSubEquipmentByUUID(currentNodeSelected.UUID).
                    then(res => {
                        setDataNode(res[0].subequipments);
                        if (res[0].subequipments.POSITION_UUID !== null) {
                            position_uuid = res[0].subequipments.POSITION_UUID;
                        }
                        if (res[0].subequipments.hrot !== null && res[0].subequipments.vrot !== null) {
                            rotaion = { x: res[0].subequipments.hrot, y: res[0].subequipments.vrot }
                        }

                        if (position_uuid !== undefined && rotaion !== undefined) {
                            setPositionNode({ sweep: position_uuid, rotation: rotaion });
                        }
                        if (position_uuid === undefined && rotaion !== undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });

                        }
                        if (position_uuid !== undefined && rotaion === undefined) {
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: position_uuid, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid === undefined && rotaion === undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }

                    })
                    .catch((err) => {
                        console.error(err)
                    });
                break;
            default: //Instrument
                instrumentsServices.getInstrumentByUUID(currentNodeSelected.UUID).
                    then(res => {
                        setDataNode(res[0].instruments);
                        if (res[0].instruments.POSITION_UUID !== null) {
                            position_uuid = res[0].instruments.POSITION_UUID;
                        }
                        if (res[0].instruments.hrot !== null && res[0].instruments.vrot !== null) {
                            rotaion = { x: res[0].instruments.hrot, y: res[0].instruments.vrot }
                        }

                        if (position_uuid !== undefined && rotaion !== undefined) {
                            setPositionNode({ sweep: position_uuid, rotation: rotaion });
                        }
                        if (position_uuid === undefined && rotaion !== undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: res[0].rooms.POSITION_UUID, rotation: rotaion });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid !== undefined && rotaion === undefined) {
                            roomServices.roomByUUID(id).
                                then(res => {
                                    setPositionNode({ sweep: position_uuid, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } });
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                        if (position_uuid === undefined && rotaion === undefined) {
                            getParentPositionUUID(parentUUID).then(res => {
                                setPositionNode({ sweep: res.sweep, rotation: res.rotation });
                            })
                                .catch((err) => {
                                    console.error(err)
                                });
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    });
                break;
        }
    };

    function getDetails() {
        if(currentNodeSelected.TYPE !== undefined) {
            const type = currentNodeSelected.TYPE;
            let id = currentNodeSelected.UUID;
            let parentUUID = currentNodeSelected.UUID_PARENT;
            let path = currentNodeSelected.PATH;
            let position_uuid = undefined;
            let rotaion = undefined;
            if (type !== "Room") {
                path = path.split(",");
                id = path[0];
                callServiceOnType(type, id, parentUUID, position_uuid, rotaion)
            } else {
                roomServices.roomByUUID(id).
                    then(res => {
                        setDataNode(res[0].rooms);
                        setPositionNode(res[0].rooms.POSITION_UUID ? { sweep: res[0].rooms.POSITION_UUID, rotation: { x: res[0].rooms.hrot, y: res[0].rooms.vrot } } : undefined);
                    })
                    .catch((err) => {
                        console.error(err)
                    });
            }
        }
    }

    function getSensors(current_node) {
        if (current_node.UUID !== undefined) {
            sensorsServices.getSensorsByParentUUID(current_node.UUID)
                .then(res => {
                    setCurrentSensors(undefined);
                    if (res.length > 0) {
                        setActiveButtonSensorsIcons(true);
                        setDevActions(true);
                        setCurrentSensors(res);
                    } else {
                        setActiveSensors(false);
                        setActiveButtonSensorsIcons(false);
                        setDevActions(false);
                    }
                })
                .catch((err) => {
                    setCurrentSensors(undefined);
                    console.error(err);
                });
        }
    }

    const hideModelsAndRestart = () => {
        
        if (models.length > 0) {
            fbxObjects.forEach(element => {
                element.stop();
            });
        }
        setModels([])
    };

    function getModels(current_node) {
        if (current_node.UUID === undefined) {
            setCurrentModels(undefined);
        }else{
            modelsServices.getModelsByParentUUID(current_node.UUID)
                .then(res => {

                    if (res.length > 0) {

                        hideModelsAndRestart();
                        setActiveButtonModelsIcons(true);
                        setDevActions(true);

                        if (fbxObjects.length > 0) {
                            fbxObjects.forEach(element => {
                                element.stop();
                            });
                            setfbxObjects([]);
                        }
                        setCurrentModels(res);
                    } else {
                        hideModelsAndRestart();
                        setCurrentModels(undefined);
                        setToogleModel(true)
                        setActiveButtonModelsIcons(false);
                        setDevActions(false);
                    }
                })
                .catch((err) => {
                    setCurrentModels(undefined);
                    console.error(err);
                });
        }
    }

    const setSweep = () => {
        setPositionTomove(positionNode)
    };

    function updateHierarchyWithChildren(newData) {
        if (Array.isArray((newData.children))) {
            newData.children.map((child) => {
                if (child.HLEVEL === 2) {
                    let obj = hierarchyLevel2.find(element => element.UUID === child.UUID);
                    child.children = obj.children;
                }
            });
        }
        setHierarchy(newData);
    };

    const getParentPositionUUID = function (parentUUID) {
        return new Promise((resolve, reject) => {
            let postion = { sweep: "", rotation: { x: NaN, y: NaN } };
            elementsServices.geElememntByUUID(parentUUID)
                .then(res => {
                    const type = res[0].Type;
                    switch (type) {
                        case 'HSE_Equipment':
                            hseEquipmentsServices.getHSEEquipmentByUUID(parentUUID).
                                then(res => {
                                    postion.sweep = res[0].hse_equipments.POSITION_UUID;
                                    postion.rotation.x = res[0].hse_equipments.hrot;
                                    postion.rotation.y = res[0].hse_equipments.vrot;
                                    resolve(postion)
                                })
                                .catch((err) => {
                                    console.error(err)
                                    reject(err)
                                });
                            break;
                        case 'Subequipment':
                            subEquipmentsServices.geSubEquipmentByUUID(parentUUID).
                                then(res => {
                                    postion.sweep = res[0].subequipments.POSITION_UUID;
                                    postion.rotation.x = res[0].subequipments.hrot;
                                    postion.rotation.y = res[0].subequipments.vrot;
                                    resolve(postion)
                                })
                                .catch((err) => {
                                    console.error(err)
                                    reject(err)
                                });
                            break;
                        case 'Equipment':
                            equipmentsServices.getEquipmentByUUID(parentUUID).
                                then(res => {
                                    postion.sweep = res[0].equipments.POSITION_UUID;
                                    postion.rotation.x = res[0].equipments.hrot;
                                    postion.rotation.y = res[0].equipments.vrot;
                                    resolve(postion)
                                })
                                .catch((err) => {
                                    console.error(err)
                                    reject(err)
                                });
                            break;
                        case 'Instrument':
                            instrumentsServices.getInstrumentByUUID(parentUUID).
                                then(res => {
                                    postion = res[0].instruments.POSITION_UUID;
                                    //resolve(postion)
                                })
                                .catch((err) => {
                                    console.error(err)
                                    reject(err)
                                });
                            break;
                        case 'Electricalpanel':
                            elecricalPanelServices.gePaneltByUUID(parentUUID).
                                then(res => {
                                    postion.sweep = res[0].electricalpanel.POSITION_UUID;
                                    postion.rotation.x = res[0].electricalpanel.hrot;
                                    postion.rotation.y = res[0].electricalpanel.vrot;
                                    resolve(postion)
                                })
                                .catch((err) => {
                                    console.error(err)
                                    reject(err)
                                });
                            break;
                        case 'Room':
                            resolve(postion)
                            break;
                        default:
                            resolve(postion)
                    }
                }).catch((err) => {
                    console.error(err)
                    reject(err)
                });
        })
    }

    async function retrieveDataOfRoomFound(data) {
        if (data !== undefined && data.children) {
            data.children.map((element) => {
                if (element.TYPE === "Room") {
                    if (element.children.length === 0) {
                        element.sinHIjos = true;
                        let found = hierarchyInitial.children.find(child => child.UUID === element.UUID);
                        if (found != undefined) {
                            element.children = found.children;
                        }
                    }
                }
            }
            )
            return data;
        } else {
            return data;
        }
    }

    function goToPosition() {
        setSweep();
    }

    const turnOffChangeNode = () =>{
        getSensors(emptyNode);
        getModels(emptyNode);
        setToogleModel(false);
    };

    useEffect(() => {
        hyperlinksServices.getAllHyperlinks().
            then(res => {

                setFileList(current => [...current, ...res]);
            })
            .catch((err) => {
                console.error(err)
            });

        if (siteId === undefined) {
            roomServices.getRoomsByBuildingId(localStorage.getItem('building')).
                then(res => {
                    setHierarchy(res);
                    setFirtsLevel(true);
                })
                .catch((err) => {
                    console.error(err)
                });
        } else {
            roomServices.getRoomsByBuildingId(siteId.building).
                then(res => {
                    setHierarchy(res)
                    setFirtsLevel(true);

                })
                .catch((err) => {
                    console.error(err)
                });
        }
    }, []);

    useEffect(() => {
        if (firstLevel === true) {

            if (Array.isArray(hierarchy)) {

                const roomList = hierarchy.map((element) => {
                    return element.rooms.UUID
                })
                setRoomsUUIDList(roomList);
            }

        }
    }, [firstLevel])

    useEffect(() => {
        if (Object.keys(hierarchyInitial).length === 0) {
        } else {
            let level2Array = [];
            hierarchyInitial.children.forEach(element => {
                element.children.forEach(subElement => {
                    subElement.children.forEach((level2) => {
                        level2Array.push(level2);

                    })
                })
            });
            setHierarchyLevel2(level2Array);
        }
    }, [hierarchyInitial])

    useEffect(() => {
        if (currentNodeSelected !== undefined && modelQueries === true) {
            // getDetails();
            getSensors(currentNodeSelected);
            getModels(currentNodeSelected);
            setModelQueries(false)
        }else{
            if (models.length > 0) {
                fbxObjects.forEach(element => {
                    element.stop();
                });
            }
        }
    }, [modelQueries])

    useEffect(() => {
        
        turnOffChangeNode();

        if (currentNodeSelected !== undefined) {
            getDetails()
            getSensors(currentNodeSelected);
        }
        
        
    }, [currentNodeSelected]);

    useEffect(() => {
        if (currentNodeSelected !== undefined) {
            getDetails();
            getSensors(currentNodeSelected);
            getModels(currentNodeSelected);
        }
    }, [reloadHierarchy])
    //Busqueda
    useEffect(() => {
        if (roomsUUIDList.length > 0) {
            searchService.searchQuery(query, roomsUUIDList, uuidVolume).
                then((res) => {
                    setFound({ msg: "found" });
                    if (Object.keys(hierarchyInitial).length === 0) {
                        //jerarqui inicial 
                        res.name = siteName;
                        setHierarchy(res);
                        setHierarchyInitial(res);
                    } else {
                        retrieveDataOfRoomFound(res).then((newData) => {
                            newData.name = siteName;
                            updateHierarchyWithChildren(newData)
                            if (uuidVolume !== undefined) {
                                setTimeout(function () {
                                    const event = document.createEvent("SVGEvents");
                                    event.initEvent("click", true, true);
                                    document.getElementById("node-list").children[0].children[2].children[1].dispatchEvent(event);

                                }, 1000);
                            }
                        });
                    }
                    setD3key(d3Key + 1);
                }).
                catch(err => console.error(err));
        }
    }, [query, roomsUUIDList, uuidVolume])
    useEffect(() => {
        setD3key(d3Key + 1);
        setQuery(searchQuery);
    }, [searchQuery])

    useEffect(() => {
        if (positionTomove !== undefined) {
            updatePoint(
                positionTomove
            )
        }
    }, [positionTomove])
    useEffect(() => {
        if (currentNodeSelected !== undefined && currentNodeSelected.UUID !== undefined) {
            hyperlinksServices.getHyperLinksByParentUUID(currentNodeSelected.UUID).
                then(res => {
                    setFileList(res);
                })
                .catch((err) => {
                    console.error(err)
                });
        }
    }, [currentNodeSelected])
    useEffect(() => {
        scrollContainer.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [hierarchy])
    useEffect(() => {
        if (triggerSearch.query !== "") {
            inputRef.current.value = triggerSearch.query.toLowerCase();
            clearTimeout(timeout);

            // Make a new timeout set to go off in 1000ms (1 second)
            timeout = setTimeout(function () {
                setQuery(triggerSearch.query.toLowerCase().split(" ")[0])
            }, 1000);
        }
    }, [triggerSearch])
    return (
        <>
            <div className="hierarchyComponent no-pointer-events mb-2">
                <div id="hierarchyTree-list" className={`hierarchyTree pointer-events ${hide ? 'hidden' : 'pointer-events'} ${!isDetailsClosed ? 'detailOpened' : ''}`}>
                    <div className="hierarchyHeader mt-2">
                        <div className="searcher mt-2 ms-2">
                            <input type="text" placeholder='Búsqueda' id="inputSearch" autoComplete="off"
                                ref={inputRef}
                                onClick={(e) => {
                                    if (e.isTrusted === false) {
                                        setUuidVolume(e.target.getAttribute("volume"));
                                        setToogleHierarchy(false);
                                    } else {
                                        setUuidVolume(undefined)
                                    }
                                }}
                                onKeyUp={(e) => {
                                    clearTimeout(timeout);

                                    // Make a new timeout set to go off in 1000ms (1 second)
                                    timeout = setTimeout(function () {
                                        setQuery(e.target.value)
                                    }, 500);
                                }
                                } />
                        </div>
                        <div className={`positionButton mt-2 me-2 ${openUbicationBtn ? " " : "hidden"}`}>
                            <Button variant="primary" onClick={goToPosition}
                                className="pointer-events ">Ubicar</Button>
                        </div>
                    </div>
                    <div className="hierarchyBody mb-3 mt-3" ref={scrollContainer}>

                        {
                            (hierarchy.children === undefined || found.msg === "not found" || hierarchy.children.length <= 0) && <h6>No se encontraron elementos</h6>

                        }
                        {
                            (hierarchy.children !== undefined && hierarchy.children.length > 0) && <D3HierarchyTree key={d3Key} data={hierarchy} />
                        }

                    </div>
                </div>
                <div className="detailsBox no-pointer-events">
                    {
                        logged ?
                            <></> :
                            <Details
                                details={currentNodeSelected} fileList={fileList}
                                dataNode={dataNode}

                            />


                    }

                    <ElementActions />
                </div>
                <div className="closeDetailsBox no-pointer-events">
                    <div className={`hierarchy-minimize mt-1 ms-2 pointer-events pointer-hand ${isDetailsClosed ? 'hidden' : ''}`}
                        onClick={() => setisDetailsClosed(true)}
                    >
                        <BiChevronLeft />
                    </div>
                </div>
                <div className="blankSpace no-pointer-events">

                </div>
            </div>
        </>
    )
}


export default HierarchyTree

