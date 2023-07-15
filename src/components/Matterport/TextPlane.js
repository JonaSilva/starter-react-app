
function TextPlane() {
    let THREE;
    let sprite;
    let sprite1;
    let sprite2;
    this.inputs = {
        visible: false,
        changeValues(firts, second, third) {

            if (sprite !== undefined && sprite1 !== undefined && sprite2 !== undefined) {
                sprite.material.map = new THREE.TextureLoader().load(`../../../public/images/sprites/digit${firts}.png`);
                sprite.material.needsUpdate = true;
                sprite1.material.map = new THREE.TextureLoader().load(`../../../public/images/sprites/digit${second}.png`);
                sprite1.material.needsUpdate = true;
                sprite2.material.map = new THREE.TextureLoader().load(`../../../public/images/sprites/digit${third}.png`);
                sprite2.material.needsUpdate = true;

            }
        }
    };

    this.onInit = function () {
        THREE = this.context.three;
        const group = new THREE.Group();
        group.position.set(0, 0, 0);
        const map = new THREE.TextureLoader().load("../../../public/images/sprites/digit1.png");
        this.material = new THREE.SpriteMaterial({ map: map });
        sprite = new THREE.Sprite(this.material);
        group.add(sprite);
        sprite.position.set(-1, 0, 0);
        const map1 = new THREE.TextureLoader().load("../../../public/images/sprites/digit2.png");
        this.material1 = new THREE.SpriteMaterial({ map: map1 });
        sprite1 = new THREE.Sprite(this.material1);
        group.add(sprite1);
        sprite1.position.set(0, 0, 0);
        const map2 = new THREE.TextureLoader().load("../../../public/images/sprites/digit3.png");
        this.material2 = new THREE.SpriteMaterial({ map: map2 });
        sprite2 = new THREE.Sprite(this.material2);
        group.add(sprite2);
        sprite1.position.set(1, 0, 0);
        this.outputs.objectRoot = group;
    };

    this.onDestroy = function () {
        this.material.dispose();
    };
};

function TextPlaneFactory() {
    return new TextPlane();
};

export { TextPlane, TextPlaneFactory };
