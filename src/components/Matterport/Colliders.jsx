
import React, { useContext, useState, useEffect } from 'react'
import MatterportContext from './MatterportContext'
import Sphere from './Sphere';

function Colliders() {
    const { sdkMatterport, setToogleModel, setActiveSensors } = useContext(MatterportContext)
    const [inRange, setInrage] = useState()


    const loadCollider = async (sdk, currentPosition) => {
        const [sceneObject] = await sdk.Scene.createObjects(1);

        sdk.Scene.register('sphere', Sphere.SphereFactory);
        const sources = await Promise.all([
            sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
                origin: { x: 27.727545566393385, y: -1.8520450370038812, z: -23.38572514035789 },
                radius: 50,
                userData: {
                    id: 'sphere-source-1',
                },
            }),
            sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
                radius: 4,
                origin: { x: 27.727545566393385, y: -1.8520450370038812, z: -23.38572514035789 },
                userData: {
                    id: 'sphere-source-2',
                },
            }),
        ]);
        // attach to a sensor previously created with `Sensor.createSensor()`
        const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
        sensor.addSource(...sources);
        sensor.readings.subscribe({
            onAdded(source, reading) {
                console.log(source.userData.id + ' has a reading of ' + reading);
            },
            onUpdated(source, reading) {
                console.log({ reading })
                setInrage(reading.inRange);
                console.log(source.userData.id, 'has an updated reading');
                if (reading.inRange) {
                    console.log(source.userData.id, 'is currently in range');
                    if (reading.inView) {
                        console.log('... and currently visible on screen');
                    }
                }
            }
        });
        const sensorNode = sceneObject.addNode();
        sensorNode.obj3D.position.set(27.727545566393385, -1.8520450370038812, -23.38572514035789);
        sensorNode.addComponent("sphere")
        sensorNode.start();
    }
    function loadSensor() {
        loadCollider(sdkMatterport)
    }

    useEffect(() => {
        setActiveSensors(inRange)
    }, [inRange]);
    return (
        <></>
    )
}

export default Colliders
