
import {Gauge, TextRenderer}  from "../../libs/gauge";
export const numero = 40
export const label_name = "NAME"

let gauge;
let textRenderer;
let mounted = false;
let percentage;
let id;

function GaugeSensor(data) {

    let labelRenderer;
    let labelDiv;
    this.inputs = {
        visible: false,
        scene: undefined,
        camera: undefined,
        text: "TEXTO por default",
        loaded: false,
        initialValue: 1,
        units: "°C",
        value: 0,
        index: "0"
    };

    this.onInit = function () {

        const iframe = document.getElementById('showcase');
        const THREE = this.context.three;
        this.inputs.scene = this.context.scene;
        this.inputs.camera = this.context.camera;
        labelDiv = document.createElement("div");
        labelDiv.className = "gaugeSensor-matterport";

        labelDiv.innerHTML +=
            `<canvas width="150" height="100" id="canvas-preview${this.inputs.index}"></canvas>
            <span id="preview-textfield${this.inputs.index}">
            </span>
            `
            ;

        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(0, 0, 0);
        label.layers.set(0);

        labelRenderer = new THREE.CSS2DRenderer();

        labelRenderer.setSize(iframe.offsetWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.className = "label-render-matterport iframe"
        labelRenderer.domElement.id = `label-render-matterport${this.inputs.index}`


        document.getElementById("matteport-container").appendChild(labelRenderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial();
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.visible = false;
        mesh.add(label);

        const textnode = document.createElement("div");
        textnode.id = `NUEVO${this.inputs.index}`
        iframe.appendChild(textnode);
        this.outputs.objectRoot = mesh;
        this.outputs.collider = mesh;

        labelRenderer.render(this.inputs.scene, this.inputs.camera);
        const opts = {
            angle: -0.2, // The span of the gauge arc
            lineWidth: 0.2, // The line thickness
            radiusScale: 0.83, // Relative radius

            pointer: {
                length: 0.57, // // Relative to gauge radius
                strokeWidth: 0.035, // The thickness
                color: "#000000" // Fill color
            },
            staticLabels: {
                font: "10px sans-serif", // Specifies font
                labels: [8, 16, 24, 32, 40],  // Print labels at these values
                color: "#000000", // Optional: Label text color
                // fractionDigits: 2 // Optional: Numerical precision. 0=round off.
            },
            staticZones: [
                { strokeStyle: "#F03E3E", min: 0, max: 8 }, // Red from 100 to 130
                { strokeStyle: "#FFDD00", min: 8, max: 16 }, // Yellow
                { strokeStyle: "#30B32D", min: 16, max: 24 }, // Green
                { strokeStyle: "#FFDD00", min: 24, max: 32 }, // Yellow
                { strokeStyle: "#F03E3E", min: 32, max: 40 } // Red
            ],

            limitMax: false, // If false, max value increases automatically if value > maxValue
            limitMin: false, // If true, the min value of the gauge will be fixed
            colorStart: "#6F6EA0", // Colors
            colorStop: "#C0C0DB", // just experiment with them
            strokeColor: "#EEEEEE", // to see which ones work best for you

            generateGradient: true,
            highDpiSupport: true, // High resolution support
            // renderTicks is Optional
            renderTicks: {
                divisions: 3,
                divWidth: 1.1,
                divLength: 0.7,
                divColor: "#333333",
                subDivisions: 3,
                subLength: 0.5,
                subWidth: 0.6,
                subColor: "#666666"
            }
        };
        const target = labelDiv.children[0] // your canvas element
        gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 40; // set max gauge value
        gauge.setMinValue(0);
        gauge.animationSpeed = 28; // set animation speed (32 is default value)           
        mounted = true;

        gauge.set(this.inputs.value);
        textRenderer = new TextRenderer(document.getElementById(`preview-textfield${this.inputs.index}`))
        const initialString = ` ${this.inputs.value} ${this.inputs.units}`;

        textRenderer.render = function (gauge, id) {
            percentage = (gauge.displayedValue - gauge.minValue) / (gauge.maxValue - gauge.minValue);
            target.nextElementSibling.textContent = initialString;
        };
        gauge.setTextField(textRenderer);
    };

    this.onInputsUpdated = function (previous) {

        if (this.inputs.loaded === true && mounted === true) {
            gauge.set(this.inputs.value);

            const initialString = ` ${this.inputs.value} ${this.inputs.units}`;

            textRenderer.render = function (gauge) {
                percentage = (gauge.displayedValue - gauge.minValue) / (gauge.maxValue - gauge.minValue);
                gauge.canvas.nextElementSibling.textContent = initialString;
            };
            gauge.setTextField(textRenderer);
        }
    };

    this.onTick = function (tickDelta) {
        if (this.inputs.camera !== undefined && this.inputs.scene !== undefined) {
            if (tickDelta > 4 && tickDelta < 12) {
                labelRenderer.render(this.inputs.scene, this.inputs.camera);
            }
        }
    };

    this.onDestroy = function () {
        this.material.dispose();
    };
};

function GaugeSensorFactory() {
    return new GaugeSensor();
};

export default {
    GaugeSensorFactory
};