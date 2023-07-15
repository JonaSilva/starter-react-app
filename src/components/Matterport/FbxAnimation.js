
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

function FbxAnimation() {
    this.inputs = {
        visible: false,
        matterportModel: undefined
    };

    this.onInit = function () {
        const THREE = this.context.three;
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        material.transparent = true;
        material.opacity = 0.5;
        const fbxLoader = new FBXLoader();

        fbxLoader.load(
            `${process.env.REACT_APP_DOMAIN}/static/files/3d/mremireh_o_desbiens.fbx`,
            (object) => {

                object.scale.x = 20;
                object.scale.y = 20;
                object.scale.z = 20;

                this.outputs.objectRoot = object;
            },
            (error) => {
                console.log(error);
            }
        )

    };

    this.onDestroy = function () {
        this.material.dispose();
    };
}

function FbxAnimationFactory() {
    return new FbxAnimation();
};

export default {
    FbxAnimationFactory
};
