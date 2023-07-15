
import React, { useState, useEffect, useRef, useContext } from "react";
import OverlayContext from "../OverlayContext";
import MatterportContext from "../../Matterport/MatterportContext";

import * as THREE from '../../../../bundle/vendors/three/0.139.2/three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import modelsServices from "../../../services/modelsServices";

import { Button, CloseButton, Form } from 'react-bootstrap';
import './ModelPreview.scss';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

let scene;
let previousModel;
let selectedModel;
function loadFbxByName(name) {

    if (scene.children.length > 0 && previousModel !== undefined) {
        scene.remove(scene.children.length - 1)
        previousModel.removeFromParent();
    }
    const fbxLoader = new FBXLoader()
    fbxLoader.load(`${process.env.REACT_APP_DOMAIN}/static/files/3d/${name}`,
        (object) => {
            scene.add(object)
            previousModel = object;
        },
        (error) => {
            console.log(error)
        }
    )
}
function ModelPreview() {
    const divPreview = useRef(null);
    const [modelList, setModelList] = useState();
    const [modelForm, setModelForm] = useState({
        model: 'null',
        type: 'text',
        textContent: '',
        interactuable: false,
        animated: false
    });

    const { currentNodeSelected, setShowModelPreview, setReloadHierarchy, reloadHierarchy } = useContext(OverlayContext);
    const { currentPosition} = useContext(MatterportContext);
    const [enableToast, setEnableToast] = useState(false);
    //currentNodeSelected
    useEffect(() => {

        scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        const loader = new THREE.CubeTextureLoader();
        loader.setPath(`${process.env.REACT_APP_DOMAIN}/static/files/images`);

        const texture = new THREE.TextureLoader().load(`${process.env.REACT_APP_DOMAIN}/static/files/images/1668362286202461.jpg`);
        scene.background = texture;
        renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
        divPreview.current.appendChild(renderer.domElement);
        const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
        scene.add(light);



        camera.position.z = 5;
        try {
            new OrbitControls(camera, renderer.domElement);
        } catch (e){
            console.error("Couldn't initialize OrbitControls", e);
        }
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        modelsServices.getModelsList()
            .then(res => {
                setModelList(res);
            })
            .catch((err) => console.error(err))

    }, [])

    function changeModel(model) {
        selectedModel = model;
        loadFbxByName(model);
    }
    function addModel() {
        if (currentNodeSelected !== undefined) {
            modelsServices.addNewModel(
                selectedModel,
                currentNodeSelected.UUID,
                currentPosition.x,
                currentPosition.y - 1.5,
                currentPosition.z,
                modelForm.animated,
                modelForm.textContent,
                modelForm.animated,
                modelForm.type
            )
            .then(res => {
                setEnableToast(true);
                setReloadHierarchy(!reloadHierarchy)
            })
            .catch((err) => console.error(err));
        }
    };

    return (
        <div id="container-preview">

            <ToastContainer
                position="middle-center"
                className="p-3 details-toast"
            >
                <Toast
                    bg="success"
                    onClose={() => setEnableToast(false)} show={enableToast} delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Éxito</strong>
                    </Toast.Header>
                    <Toast.Body>Modelo agregado</Toast.Body>
                </Toast>
            </ToastContainer>

            <div className="mainModel">
                <div className="formModel pointer-events">
                    <div id="listOfModels">
                        <Form.Select id="selectModel" size="sm" onChange={e => changeModel(e.target.value)}>
                            <option hidden>Seleccione un modelo</option>
                            {modelList !== undefined && Array.isArray(modelList) ?
                                modelList
                                .filter(model => model.toLowerCase().includes('.fbx'))
                                .map(model =>
                                    <option key={`${model}`}>
                                        {model}
                                    </option>
                                )
                                :
                                <option>No se tienen modelos registrados</option>
                            }
                        </Form.Select>
                    </div>
                    <hr />

                    <div id="typeOfText">
                        <div className="labelsFunctions">
                            <label>Tipo de texto</label>
                        </div>
                        <div id="inputsFunction">
                            <div id="webText">
                                <div className="leftSideOption">
                                    <Form.Check type="radio" label="Texto"
                                        onChange={(e) => {
                                            if (e.target.value === "on") {

                                                setModelForm(prevstate => ({
                                                    ...prevstate,
                                                    type: "text"

                                                }))
                                            }
                                        }}
                                    />
                                </div>
                                <div className="rightSideOption">
                                    <Form.Check type="radio" label="Hipervínculo"
                                        onChange={(e) => {
                                            if (e.target.value === "on") {

                                                setModelForm(prevstate => ({
                                                    ...prevstate,
                                                    type: "web"

                                                }))
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div id="inputText">
                                <Form.Control type="text" id="textToModel" aria-describedby="messageHelpInput"

                                    onChange={(e) => {

                                        setModelForm(prevstate => ({
                                            ...prevstate,
                                            textContent: e.target.value
                                        }))

                                    }}

                                />
                                {/*<Form.text id="messageHelpInput" muted>Introducir el texto ó hipervínculo que se asociará al modelo</Form.text>*/}
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div id="interactAnimate">
                        <div className="labelsFunctions">
                            <label>Tipo de función</label>
                        </div>
                        <div id="checkFunction">
                            <div id="interactable">
                                <Form.Check type="checkbox" label="Interactuable"
                                    onChange={(e) => {
                                        if (e.target.value === "on") {
                                            setModelForm(prevstate => ({
                                                ...prevstate,
                                                interactuable: true
                                            }))
                                        } else {
                                            setModelForm(prevstate => ({
                                                ...prevstate,
                                                interactuable: false
                                            }))
                                        }

                                    }}
                                />
                            </div>
                            <div id="animated">
                                <Form.Check type="checkbox" label="Animado"
                                    onChange={(e) => {
                                        if (e.target.value === "on") {
                                            setModelForm(prevstate => ({
                                                ...prevstate,
                                                animated: true
                                            }))

                                        } else {
                                            setModelForm(prevstate => ({
                                                ...prevstate,
                                                animated: false
                                            }))

                                        }

                                    }}

                                />
                            </div>
                        </div>
                    </div>
                    <div id="sendInfo">
                        <Button className="pointer-events pointer-hand" variant="primary" onClick={addModel}>Agregar Modelo</Button>
                    </div>
                </div>
                <div className="previewModel">
                    <div id='modelPreview' ref={divPreview}></div>
                </div>

            </div>
            <div className="closeModels">
                <CloseButton variant="white"
                    className='pointer-events'
                    onClick={() => {
                        setShowModelPreview(false);
                    }}
                />
            </div>
        </div>
    );
};

export default ModelPreview;
