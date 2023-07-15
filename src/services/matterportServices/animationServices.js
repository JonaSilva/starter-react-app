
import FbxAnimation from '../../components/Matterport/FbxAnimation';

let currentState = 'state0';
let currentState2 = "state1";
let activateLast = false;
let threejsModeloCargado = false;
let obj3 = undefined;
//
function changeState() {
    switch (currentState) {
        case 'state0':
            currentState = 'state1';
            break;
        case 'state1':
            currentState = 'state2';
            break;
        case 'state2':
            currentState = 'state1';
            break;
    }
}
function changeState2() {
    switch (currentState2) {
        case 'state1':
            currentState2 = 'state2';
            break;
        case 'state2':
            currentState2 = 'state1';
            break;
    }
}

const activeAnimation = (models, models3d, sdk) => {

    let obj1 = undefined;
    let obj2 = undefined;

    const modelo0 = {
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
    }

    const modelo = {
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
        positionx: 14.87,
        positiony: 0.75,
        positionz: -22.734,
        rotationx: -54.0966,
        rotationy: -1.98187,
        rotationz: -79.813,
        scalex: 0.01,
        scaley: 0.01,
        scalez: 0.01,
        lightIntensity: 0.2
    }


    const modelo2 = {
        animated: 0,
        id: 81,
        data: Array[1],
        0: 1,
        length: 1,
        type: "Buffer",
        interactuable_content: "ensamble",
        interactuable_type: "web",
        modelfilename: "Equipos.fbx",
        modelformat: "FBX",
        parent: "db7266da-1a5f-11ed-b646-002b67db2934",
        positionx: 18.3782,
        positiony: -1.35844,
        positionz: -21.6846,
        rotationx: -1.18964,
        rotationy: 85.6122,
        rotationz: 1.03407,
        scalex: 0.01,
        scaley: 0.01,
        scalez: 0.01,
        lightIntensity: 0.3
    }

    const modelo3 = {
        animated: 0,
        id: 81,
        data: Array[1],
        0: 1,
        length: 1,
        type: "Buffer",
        interactuable_content: "ensamble",
        interactuable_type: "web",
        modelfilename: "Ensambles.fbx",
        modelformat: "FBX",
        parent: "db7266da-1a5f-11ed-b646-002b67db2934",
        positionx: 18.3782,
        positiony: -1.35844,
        positionz: -21.6846,
        rotationx: 0,
        rotationy: 0,
        rotationz: 0,
        scalex: 0.01,
        scaley: 0.01,
        scalez: 0.01,
        lightIntensity: 0.3
    }


    if (currentState === "state0") {
        load(sdk, modelo0).then(res => {
            obj2 = res.obj3D;

        }).then(() => {
            load(sdk, modelo2)
                .then(res => {
                    obj3 = res.obj3D;
                    load(sdk, modelo)
                        .then(res => {
                            obj1 = res.obj3D;
                            load(sdk, modelo3)
                                .then(res => {
                                    setTimeout(function () {
                                        const audio = new Audio(`${process.env.REACT_APP_DOMAIN}/static/files/audio/formulation.wav`);
                                        audio.play();
                                        javaSricptAnimation(obj1, obj2, obj3);
                                    }, 5000);
                                }).catch(err => console.error(err))
                        }).catch(err => console.error(err))
                }).catch(err => console.error(err))
        });
    }
};

const load = async (sdk, model) => {
    const [sceneObject] = await sdk.Scene.createObjects(1);
    const lights = sceneObject.addNode();
    const initialLight = {
        enabled: true,
        color: {
            r: 1, g: 1, b: 1
        },
        intensity: model.lightIntensity,
    };
    lights.addComponent('mp.ambientLight', initialLight);
    const node = sceneObject.addNode();
    node.obj3D.position.set(model.positionx, model.positiony, model.positionz);
    node.obj3D.rotation.set(degtoRad(model.rotationx), degtoRad(model.rotationy), degtoRad(model.rotationz));
    lights.start();
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
    let model3d = node.addComponent(sdk.Scene.Component.FBX_LOADER, initial);
    node.start();
    model3d.events[sdk.Scene.InteractionType.HOVER] = true;
    const emitPath = sceneObject.addEmitPath(model3d, 'INTERACTION.CLICK');
    sceneObject.spyOnEvent({
        path: emitPath});

    return node;
}

function javaSricptAnimation(model, model2, modelo3) {
    setInterval(changeState, 1000);
    setInterval(changeState2, 1000);
    let aux = undefined;
    if (modelo3.children.length > 0) {
        aux = modelo3.children;
    }

    const tick = function () {
        requestAnimationFrame(tick);

        if (activateLast === true) {
            aux[0].children[0].children[12].rotation.y += 0.1;
        }
        if (currentState === "state1") {
            model2.rotation.z += 0.1;
            model.rotation.x += 0.1;
        }
        if (currentState === "state2") {
            model2.rotation.z -= 0.1;
            model.rotation.x -= 0.1;
        }
    }
    tick();
};

const activateLastAnimation = function () {
    activateLast = true;
};

const loadFbx = async (sdk, model) => {
    if (threejsModeloCargado === false) {
        threejsModeloCargado = true
        const [sceneObject] = await sdk.Scene.createObjects(1);
        sdk.Scene.register('fbxAnimation', FbxAnimation.FbxAnimationFactory)
            .then((res) => {
                const node = sceneObject.addNode();

                node.obj3D.position.set(18.3782, -0.5, -21.6846);
                const modelo = node.addComponent("fbxAnimation");
                modelo.inputs.visible = true;
                node.start();
            });
    }
};

function degtoRad(deg) {
    return deg / 180.0 * Math.PI;
}

const animationServices = {
    activeAnimation,
    activateLast,
    activateLastAnimation,
    loadFbx
}
export default animationServices

