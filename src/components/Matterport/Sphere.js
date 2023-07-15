
function Sphere(data) {
    let projector;
    const mouse = { x: 0, y: 0 };
    const targetList = [];
    let THREE = undefined;
    let camera = undefined;
    this.inputs = {
        scene: undefined,
        camera: undefined};

    function onDocumentMouseDown(event) {
        // update the mouse variable
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        const vector = new THREE.Vector3(mouse.x, mouse.y, 1);
        projector.unprojectVector(vector, camera);

        const ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        const intersects = ray.intersectObjects(targetList, true);
        if (intersects.length > 0) {
            intersects.forEach(element => {
                if (element.object.type === "TransformControlsPlane") {
                    element.object.material.color.set(0xff0000);
                }
            });
        }
    };

    this.onInit = function () {
        THREE = this.context.three;
        camera = this.context.camera;
        // initialize object to perform world/screen calculations
        projector = new THREE.Projector();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x10d024 });
        //this.material.wireframe = true;
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.visible = true;
        mesh.uuid = "cajaaaa"
        mesh.nuevo = "Nuevo objecto";
        this.outputs.objectRoot = mesh;

        targetList.push(mesh);
        document.getElementById("showcase").contentDocument.activeElement.addEventListener('mousedown', onDocumentMouseDown, false);
    };
    
    this.onDestroy = function () {
        this.material.dispose();
    };
};

function SphereFactory() {
    return new Sphere();
};

export default {
    SphereFactory
};
