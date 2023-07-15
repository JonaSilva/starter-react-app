
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

function Iframe3D() {


    this.inputs = {
        visible: false,
    };

    this.onInit = function () {
        //Html
        const container = document.getElementById('showcase');
        const renderer = new CSS3DRenderer();
        const THREE = this.context.three;
        const camera = this.context.camera;
        const scene = this.context.scene;

        renderer.setSize(container.offsetWidth, window.innerHeight);
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = "0px";
        renderer.domElement.className = "label-render-matterport-css3 iframe";
        renderer.domElement.id = `rendererIframe`;

        document.getElementById("matteport-container").appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.visible = false;

        mesh.add(new Element('SJOz3qjfQXU', 0, 0, 240, 0));

        this.outputs.objectRoot = mesh;
        animate();

        function Element(id, x, y, z, ry) {
            const div = document.createElement('div');
            div.setAttribute("class", "css3dContainer");
            div.style.width = '480px';
            div.style.height = '360px';
            div.style.backgroundColor = '#000';

            const iframe = document.createElement('iframe');
            iframe.setAttribute("class", "iframe3d");
            iframe.style.width = '480px';
            iframe.style.height = '360px';
            iframe.style.border = '0px';
            iframe.frameborder = "0";

            iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
            div.appendChild(iframe);
            const object = new CSS3DObject(div);
            object.position.set(0, 0, 0);

            object.scale.set(0.5, 0.5, 0.5)
            object.layers.set(0);
            return object;

        }
        function animate() {

            requestAnimationFrame(animate);

            renderer.render(scene, camera);

        }
    };

    this.onDestroy = function () {
        this.material.dispose();
    };
};

function Iframe3DFactory() {
    return new Iframe3D();
};

export default {
    Iframe3DFactory
};
