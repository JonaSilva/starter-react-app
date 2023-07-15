
import './matterport.scss'

function MatterportBundle() {

    const iframeLoaded = async () => {
        let sdk;
        const showcase = document.getElementById("showcase");
        const key = "a8r5fqadeftxik11qa7b4x2ea";

        try {
            sdk = await showcase.contentWindow.MP_SDK.connect(showcase, key, "3.6");
        }
        catch (e) {
            console.error(e);
            return;
        }

        onConect(sdk);

    }
    const onConect = async (sdk) => {
        const [sceneObject] = await sdk.Scene.createObjects(1);
        const lights = sceneObject.addNode();
        lights.addComponent('mp.lights');
        lights.start();


        const node = sceneObject.addNode();
        const initial = {
            url: process.env.REACT_APP_DOMAIN + "/static/files/3d/Tanque 500L B.fbx",
            visible: true,
            localScale: {
                x: 0.1, y: 0.1, z: 0.1
            },
            localPosition: { x: 1, y: -1, z: 0 }
        };

        const node2 = sceneObject.addNode();
        const initial2 = {
            url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/fbx/stanford-bunny.fbx',
            visible: true,
            localScale: {
                x: 0.00002,
                y: 0.00002,
                z: 0.00002
            },
            localPosition: { x: 0, y: 0, z: 0 }
        };

        node.addComponent('mp.fbxLoader', initial);
        node.start();
        node2.addComponent('mp.fbxLoader', initial2);
        node2.start();

    }
    return (
        <div className='container matterport'>
            <iframe id="showcase"
                src="/bundle/showcase.html?m=tGdQs2pC6qd&play=1&qs=1&log=0&applicationKey=a8r5fqadeftxik11qa7b4x2ea"
                width="800px" height="600px" frameBorder="0" allow="xr-spatial-tracking"
                title="hola"
                allowFullScreen
                onLoad={iframeLoaded}
            >
            </iframe>
        </div>
    )
}

export default MatterportBundle