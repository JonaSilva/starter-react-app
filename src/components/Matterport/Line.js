
let THREE;
let group;
function Line() {
    let labelRenderer;

    this.inputs = {
        points: [],
        scene: undefined,
        camera: undefined,
    };
    this.onInit = function () {

        const Scene = this.context.scene;
        const camera = this.context.camera;
        const renderer = this.context.renderer;

        this.inputs.scene = this.context.scene;
        this.inputs.camera = this.context.camera;

        const iframe = document.getElementById('showcase');
        THREE = this.context.three;
        this.materialBlue = new THREE.LineBasicMaterial({ color: 0x0000ff });
        this.materialRed = new THREE.LineBasicMaterial({ color: 0xfe0000 });
        this.materialGreen = new THREE.LineBasicMaterial({ color: 0x0ffe00 });
        this.materialOrange = new THREE.LineBasicMaterial({ color: 0x0ffa500 });

        const initialPoints = [];
        const points = [];

        this.inputs.points.forEach((point) => {
            initialPoints.push(new THREE.Vector3(point.x, point.y, point.z));
        })

        const z0 = new THREE.Vector3(initialPoints[0].x, initialPoints[0].y, initialPoints[0].z);
        const z1 = new THREE.Vector3(initialPoints[0].x, initialPoints[0].y, initialPoints[1].z);
        const z2 = new THREE.Vector3(initialPoints[0].x, initialPoints[1].y, initialPoints[1].z);
        const z3 = new THREE.Vector3(initialPoints[0].x, initialPoints[1].y, initialPoints[1].z);
        const z4 = new THREE.Vector3(initialPoints[1].x, initialPoints[1].y, initialPoints[1].z);
        const z5 = new THREE.Vector3(initialPoints[0].x, initialPoints[0].y, initialPoints[0].z);
        const z6 = new THREE.Vector3(initialPoints[1].x, initialPoints[1].y, initialPoints[1].z);

        points.push(z0);
        points.push(z1);
        points.push(z2);
        points.push(z3);
        points.push(z4);
        points.push(z5);
        points.push(z6);

        const geometry1 = new THREE.BufferGeometry().setFromPoints([z0, z1]);
        const geometry2 = new THREE.BufferGeometry().setFromPoints([z1, z2]);
        const geometry3 = new THREE.BufferGeometry().setFromPoints([z2, z3]);
        const geometry4 = new THREE.BufferGeometry().setFromPoints([z3, z4]);
        const geometry5 = new THREE.BufferGeometry().setFromPoints([z4, z5]);

        this.line2 = new THREE.Line(geometry2, this.materialGreen);
        this.line1 = new THREE.Line(geometry1, this.materialBlue);
        this.line3 = new THREE.Line(geometry3, this.materialOrange);
        this.line4 = new THREE.Line(geometry4, this.materialRed);
        this.line5 = new THREE.Line(geometry5, this.materialOrange);

        group = new THREE.Group();
        group.add(this.line1);
        group.add(this.line2);
        group.add(this.line3);
        group.add(this.line4);
        group.add(this.line5);

        labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize(iframe.offsetWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.style.display = "block";
        labelRenderer.domElement.className = "label-line-matterport iframe"
        labelRenderer.domElement.id = "label-render-matterport"
        document.getElementById("matteport-container").appendChild(labelRenderer.domElement);
        group.add(createMeasurementsLabel("z", [z1, z2]));
        group.add(createMeasurementsLabel("y", [z0, z1]));
        group.add(createMeasurementsLabel("x", [z3, z4]));
        Scene.add(group);

        labelRenderer.render(Scene, camera);
        renderer.render(Scene, camera);

    };

    this.onTick = function (tickDelta) {

        if (tickDelta === 7) {
            if (this.inputs.camera !== undefined && this.inputs.scene !== undefined) {
                labelRenderer.render(this.inputs.scene, this.inputs.camera);
            }
        }
    };

    this.onDestroy = function () {
        group.clear();
        const parentContainer = document.getElementById("matteport-container");
        for (let i = parentContainer.children.length - 1; i >= 0; i--) {
            if (parentContainer.children[i].className === "label-line-matterport iframe") {
                parentContainer.children[i].remove()
            }
        }
        group.removeFromParent();
    };
};

function createMeasurementsLabel(text, initialPoints) {
    const dx = Math.pow(initialPoints[1].x - initialPoints[0].x, 2);
    const dy = Math.pow(initialPoints[1].y - initialPoints[0].y, 2);
    const dz = Math.pow(initialPoints[1].z - initialPoints[0].z, 2);
    const distance = Math.abs(Math.sqrt(dx + dy + dz)).toFixed(3)

    const labelDiv = document.createElement("div");
    labelDiv.className = "label-matterport-measurements";
    labelDiv.textContent = text + " " + distance + "m";
    labelDiv.style.display = "block";
    labelDiv.style.marginTop = "-1em";

    const label = new THREE.CSS2DObject(labelDiv);
    label.position.set((initialPoints[1].x + initialPoints[0].x) / 2, (initialPoints[1].y + initialPoints[0].y) / 2, (initialPoints[1].z + initialPoints[0].z) / 2);
    label.layers.set(0);

    return label;
};

function LineFactory() {
    return new Line();
};

export default {
    LineFactory
};
