
export const numero = 40;
export const label_name = "NAME";

function Label(data) {
    let labelRenderer;
    let labelDiv;
    this.inputs = {
        visible: false,
        scene: undefined,
        camera: undefined,
        text: "TEXTO por default",
        units: "°C",
        value: 0,
        loaded: false,
        renderer: undefined,
        cube: undefined,
        dragged: undefined
    };
    this.outputs = {
        salida: undefined,
    }
    this.onInit = function () {
        const iframe = document.getElementById('showcase');
        const THREE = this.context.three;
        this.inputs.renderer = new THREE.WebGLRenderer();

        this.inputs.scene = this.context.scene;
        this.inputs.camera = this.context.camera;
        labelDiv = document.createElement("div");
        labelDiv.className = "label-matterport";
        labelDiv.textContent = this.inputs.value + "\n" + this.inputs.units;
        labelDiv.style.marginTop = "-1em";
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(0, 0, 0);
        label.layers.set(0);

        labelRenderer = new THREE.CSS2DRenderer();

        labelRenderer.setSize(iframe.offsetWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.className = "label-render-matterport iframe"
        labelRenderer.domElement.id = "label-render-matterport"
        document.getElementById("matteport-container").appendChild(labelRenderer.domElement);
        const geometry = new THREE.PlaneGeometry(0.6, 0.6);
        this.material = new THREE.MeshBasicMaterial({ color: 0x008000, side: THREE.DoubleSide });
        const geometry2 = new THREE.PlaneGeometry(0.2, 0.2);
        this.material2 = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xdedede, wireframe: false, transparent: false, opacity: 0.99 });

        const mesh = new THREE.Mesh(geometry, this.material2);
        const mesh2 = new THREE.Mesh(geometry2, this.material);
        mesh.visible = true;
        mesh.add(label);
        mesh.add(mesh2);
        this.outputs.objectRoot = mesh;
        this.outputs.collider = mesh;
        mesh2.position.z = 0.02

        this.events["INTERACTION.CLICK"] = true;
        this.events["INTERACTION.HOVER"] = true;
        this.events["INTERACTION.DRAG"] = true;
        this.events["INTERACTION.ROTATE_END"] = true;
        this.events["INTERACTION.ROTATE"] = true;
        this.events["INTERACTION.POINTER_MOVE"] = true;
        this.events["INTERACTION.POINTER_BUTTON"] = true;
        this.events["INTERACTION.PINCH_END"] = true;
        this.events["INTERACTION.MULTI_SWIPE_END"] = true;
        this.events["INTERACTION.MULTI_SWIPE"] = true;
        this.events["INTERACTION.LONG_PRESS_START"] = true;
        this.events["INTERACTION.LONG_PRESS_END"] = true;
        this.events["INTERACTION.KEY"] = true;

        const textnode = document.createElement("div");
        textnode.id = "NUEVO"
        iframe.appendChild(textnode);
    };

    this.onEvent = function (type, data) {
        this.notify("evento", { num: 2 });
    };

    this.onInputsUpdated = function (previous) {
        if (labelDiv !== undefined) {
            labelDiv.textContent = this.inputs.value + "\n" + this.inputs.units;
        }
        if (this.inputs.camera !== undefined && this.inputs.scene !== undefined) {
            labelRenderer.render(this.inputs.scene, this.inputs.camera);
        }
    };

    this.onTick = function (tickDelta) {
        if (tickDelta > 4 && tickDelta < 12) {
            if (this.inputs.camera !== undefined && this.inputs.scene !== undefined) {
                labelRenderer.render(this.inputs.scene, this.inputs.camera);
            }
        }
    };

    this.onDestroy = function () {
        this.material.dispose();
    };

    function render(inputs) {
        if (inputs.renderer !== undefined) {
            inputs.renderer.render(inputs.scene, inputs.camera);
        }

    };

    this.onEvent = function (type, data) {
        if (type === "INTERACTION.DRAG") {
            if (this.inputs.dragged !== true) {
                this.inputs.dragged = true;
                this.outputs.salida = true;
            }
        }
        if (type === "INTERACTION.DRAG_END") {
            if (this.inputs.dragged !== false) {
                this.inputs.dragged = false;
                this.outputs.salida = false;
            }
        }
    };
}
function LabelFactory() {
    return new Label();
};

export default {
    LabelFactory
};
