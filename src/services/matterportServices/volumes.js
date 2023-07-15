
import volumenServices from "../volumenServices";
import elementsServices from "../elementsServices";

let timeout = null;

const loadRoomVolumens = function (sdkMatterport) {
    const promises = [];
    volumenServices.getAllVolumes()
        .then(res => {
            res.forEach((elemento) => {
                promises.push(new Promise((resolve, reject) => {
                    emptyModelLoader({
                        animated: 0,
                        id: 61,
                        interactuable: "1",
                        interactuable_content: "",
                        interactuable_type: "text",
                        modelfilename: "CuboTransparente.fbx",
                        modelformat: "FBX",
                        parent: elemento.parent,
                        positionx: elemento.positionx,
                        positiony: elemento.positiony,
                        positionz: elemento.positionz,
                        rotationx: elemento.rotationx,
                        rotationy: elemento.rotationy,
                        rotationz: elemento.rotationz,
                        scalex: elemento.scalex,
                        scaley: elemento.scaley,
                        scalez: elemento.scalez
                    }, sdkMatterport);
                }));

            });
        }).catch(error => console.error({
            error
        }));
};

async function runPromisesInSequence(promises) {
    for (let promise of promises) {
        await promise();
    }
};

const emptyModelLoader = async (model, sdkMatterport) => {

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
    const modelo = node.addComponent(sdkMatterport.Scene.Component.FBX_LOADER, initial);
    const THREE = modelo.context.three;
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });


    material.transparent = true;
    material.opacity = 0.5;

    node.start();
    modelo.events[sdkMatterport.Scene.InteractionType.HOVER] = true;
    const emitPath = sceneObject.addEmitPath(modelo, 'INTERACTION.CLICK');
    const hooverEmithPath = sceneObject.addEmitPath(modelo, 'INTERACTION.HOVER');
    sceneObject.spyOnEvent({
        path: emitPath,
        onEvent(eventData) {
            const queryInput = document.getElementById("inputSearch");

            const hierarchyMinimizeBtn = document.getElementById("hierarchy-minimize-btn");
            elementsServices.geElememntByUUID(model.parent)
                .then(res => {
                    if (queryInput !== undefined) {
                        if (res[0].Description !== "" && res[0].Description !== undefined) {
                            queryInput.setAttribute('volume', res[0].UUID);
                            clearTimeout(timeout);
                            timeout = setTimeout(function () {
                                hierarchyMinimizeBtn.click();
                                queryInput.click();

                            }, 1000);
                        }
                    }
                }).catch((error) => console.error({ error }));

        },
    });

    sceneObject.spyOnEvent({
        path: hooverEmithPath,
        onEvent(eventData) {
            if (eventData.hover) {
                document.getElementById('showcase').contentWindow.document.getElementsByClassName("showcase")[0].style.cursor = "pointer";
            } else {
                document.getElementById('showcase').contentWindow.document.getElementsByClassName("showcase")[0].style.cursor = "auto";
            }
        },
    });
}

function degtoRad(deg) {
    return deg / 180.0 * Math.PI;
}

const volumes = {
    loadRoomVolumens,
    emptyModelLoader
};

export default volumes;
