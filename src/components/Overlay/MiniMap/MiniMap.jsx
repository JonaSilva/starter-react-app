
import React, { useContext, useEffect, useState, useRef} from 'react';
import {Buffer} from 'buffer';

import GlobalContext from '../../../context/globalContext';
import MatterportContext from '../../Matterport/MatterportContext';
import OverlayContext from '../OverlayContext';

import miniMapServices from '../../../services/OverlayServices/miniMapServices';
import graphServices from '../../../services/OverlayServices/graphQlServices';

import './MiniMap.scss';

import PanZoom from "react-easy-panzoom";

import { BsZoomIn, BsZoomOut } from "react-icons/bs";
import { VscScreenFull } from "react-icons/vsc";

function MiniMap() {
    const { model } = useContext(GlobalContext);
    const { sdkMatterport} = useContext(MatterportContext)
    const { openedMiniMap } = useContext(OverlayContext);
    const [maps, setImagesMap] = useState();
    const [currentConstants,setCurrentConstants]= useState();
    const [imageOnMap, setImageOnMap] = useState();
    const [showMap, setShowMap] = useState(false);
    const [actualFloor, setActualFloor] = useState(-1);

    const panZoom = useRef(null);

    let toogleClassCheck = openedMiniMap ? 'active': '';
    let toogleClassMap = openedMiniMap ? 'active': 'inactive';
    let currentCanvas;
    let visionPointTodraw = 15;
    
    useEffect(() => {

        miniMapServices.getImagesByModel(model).then(res => {
            
            if(res.results == undefined || res.results.length == undefined) {
                setShowMap(false);
            }else{
                getImagesFromAPI(res.results);
                //setImagesMap(res.results);
            }
        }).catch(err => {
            console.error(err, "gettingImages");
        });
    }, [])

    
    useEffect(() => {

        if(sdkMatterport.Camera !== undefined && maps !== undefined) {
            let tempSweep, tempAngle;
           

            sdkMatterport.Sweep.current.subscribe(function (currentSweep) {
                if ( currentSweep.sid !== '' && actualFloor !== currentSweep.floorInfo.id) {
                    updateMap(currentSweep.floorInfo.id);
                    setActualFloor(currentSweep.floorInfo.id);
                }
            });

            sdkMatterport.Camera.pose.subscribe(function (pose) {	

                let poseCorrect = tempSweep !== pose.sweep && pose.position.y != 0;
                let angleIsValid = tempAngle !== (Math.round((pose.rotation.y+180)/10))*10;


                if((poseCorrect || angleIsValid)){
                    
                    
                    tempSweep = pose.sweep;
                    tempAngle = (Math.round((pose.rotation.y+180)/10))*10;
                    
                    if(currentConstants !== undefined){
                        
                        cleanAndDraw(pose.position.x,pose.position.z, tempAngle);
                    }
                        
                        
                   
                    
                }
            });
                               
        }
    }, [sdkMatterport, maps, currentConstants])

    

    useEffect(() => {
        
        if(maps == undefined){
            setShowMap(false);
        }else{
            setShowMap(true);
        }
    }, [maps])
    
    const getImagesFromAPI =  (imgsDB) => {
         graphServices.queryGraphql('').then(responseApi => {
            
            const copyObjToNew = structuredClone(responseApi.data.model.assets.floorplans);
            const apiResponseCleaned = cleanApiResponse(copyObjToNew);
            changeURLForImgs(apiResponseCleaned);
            const dataTransformed = transformApiResToUse(apiResponseCleaned);
            setImagesMap(dataTransformed);

         }).catch(error => {
            console.error(error);
            setImagesMap(imgsDB);
         })

    }

    const cleanApiResponse = (responseApi) => {
        return responseApi.filter(obj => {
            if(obj.filename.split("_")[0].includes("colorplan") && obj.filename.split("_")[1].includes("0")){
                return obj
            }
        })
    }

    const changeURLForImgs = (obj) =>{
        obj.forEach(async obj => {
            obj.ImgB64 = await gettingImageFromApi(obj.url);
        });
    };

    const gettingImageFromApi = (URL) => {
         return miniMapServices.getImageFromURL(URL).then(imageFromService => { 
            return convertArrayToB64(imageFromService);
        });

    }

    const convertArrayToB64 = (img) => {
        return "data:image/jpg;base64," + Buffer.from(img.data,'binary').toString('base64');
    }

    /*const compareApiImgVersusDB = (imgsDB, imgApi) =>{
        
        const mappingImages = imgApi.map(imageApi =>{

            const filteredImg = imgsDB.filter(imgApi => imgApi.ImgB64 == imageApi.ImgB64);

            if(Object.keys(filteredImg).length === 0){
                return imageApi
            }
        });
        
        return Object.keys(mappingImages).length === 0 ? false : true;
        
    }*/

    /*const insertImageOnDB = (dataToInsert) => {
        
        addBuildingInfo(dataToInsert)

        miniMapServices.insertImagesOnDB(dataToInsert)
        .catch( 
            err => {
            console.log("Problema al insertar en BD floorImages");
        })
    }*/

    /*const addBuildingInfo = (dataToAddBuilding) =>{
        dataToAddBuilding.forEach(image => {image.building = parseInt(localStorage.getItem("building"),10);})
    }*/
    


    const transformApiResToUse = (toTransform) => {
        return toTransform.map(element =>{

            element.X_Size_m = element.width/element.resolution;
            element.Y_Size_m = element.height/element.resolution;
            element.X_Size_px = element.width;
            element.Y_Size_px = element.height;
            element.X_Offset_px = (element.origin.x*element.resolution)*-1;
            element.Y_Offset_px = (element.origin.y*element.resolution)+element.height;
            element.floorid = parseInt(element.floor.label.split(" ")[1],10)-1;
            element.matterportid = element.floor.id;
            element.name = localStorage.getItem("siteName")+" "+element.floor.label;
            
            delete element.url;
            delete element.filename;
            delete element.floor;
            delete element.height;
            delete element.origin;
            delete element.provider;
            delete element.resolution;
            delete element.status;
            delete element.width;
            
            return element;

        });
        
    };

    const updateMap=(currentFloorId)=>{

        const imageToSet = maps.filter(map =>{
            return map.floorid == currentFloorId});
        
        if(imageToSet.length >0){
            setImageOnMap(imageToSet[0].ImgB64);
            setShowMap(true);
            setCurrentConstants(imageToSet[0]);
        }else{
            setShowMap(false);
        }
        
    };

    const cleanAndDraw = (matterportX,matterportY, camRotation) => {

        const coordinates = getCoordinates(matterportX,matterportY);
        const context = choseeCanvasAndClean();

        drawPointAndVision(context, coordinates, camRotation)
            
    };

    const drawPointAndVision = (context, coordinates,rotation) =>{
        
        let arrow = new Image();

        context.beginPath();

        arrow.onload = function() {
            context.save();
            //ACA TAMBIËN
            context.translate(coordinates.x, coordinates.y);
            context.rotate( ((-rotation+45) * Math.PI / 180).toFixed(3));
            context.translate(-coordinates.x, -coordinates.y);
            context.drawImage(arrow, coordinates.x, coordinates.y, visionPointTodraw, visionPointTodraw);
            context.restore();
            
        }
        
        arrow.src = "data:image/png;base64,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";
        
        context.arc(coordinates.x, coordinates.y, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.stroke();
        
    }

    const getCoordinates = (x,y) => {
        let xToDraw, yToDraw, convertToImageSizeX, convertToImageSizeY;
        
        xToDraw = ((currentConstants.X_Size_px/currentConstants.X_Size_m)*x) + currentConstants.X_Offset_px;
        yToDraw = ((currentConstants.Y_Size_px/currentConstants.Y_Size_m)*y) + currentConstants.Y_Offset_px;

        convertToImageSizeX = 360/currentConstants.X_Size_px;
        convertToImageSizeY = 245/currentConstants.Y_Size_px;
        return {x: xToDraw*convertToImageSizeX, y: yToDraw*convertToImageSizeY};
    };

    const choseeCanvasAndClean = () => {
        
        if(currentCanvas == undefined){
            
            
            currentCanvas = document.getElementById('myCanvas');
            return currentCanvas.getContext('2d');
        }

        if(currentCanvas.id == "myCanvas"){
            
            currentCanvas.getContext('2d').clearRect(0, 0, currentCanvas.width, currentCanvas.height);
            currentCanvas = document.getElementById('myCanvas2');
            
            return currentCanvas.getContext('2d');
        }

        currentCanvas.getContext('2d').clearRect(0, 0, currentCanvas.width, currentCanvas.height);
        currentCanvas = document.getElementById('myCanvas');
        return currentCanvas.getContext('2d');


    }

    useEffect(()=>{
        
    },[showMap])

    const zoomIn = () => {
        panZoom.current.zoomIn(2);
    }

    const zoomOut = () => {
        panZoom.current.zoomOut(2);
        
    }

    function resetZoom (){
        panZoom.current.reset();
    }
    

    return (
        <>
        {
            
            (showMap) && <div className={`tool-tip mt-2 me-2 ${toogleClassCheck}`}>
           
                <div className={`map ${toogleClassMap} no-text-select no-image-select pointer-events pointer-hand`}>
                    <PanZoom ref={panZoom}>
                        <canvas id="myCanvas" width="360" height="245"/>
                        <canvas id="myCanvas2" width="360" height="245"/>
                        <img id="imgMap" src={imageOnMap}/>
                    </PanZoom>
                </div>
                <div className="buttons">
                    <div className="functionButtonParent me-2">
                        <div className="lowerButtons mt-4">

                        </div>
                        <div className="functionButton zoomIn pointer-events pointer-hand" onClick={zoomIn}>
                            <BsZoomIn></BsZoomIn>  
                        </div>
                        <div className="functionButton zoomOut pointer-events pointer-hand" onClick={zoomOut}>
                            <BsZoomOut></BsZoomOut>
                        </div>
                        <div className="functionButton centerMap pointer-events pointer-hand" onClick={resetZoom}>
                            <VscScreenFull></VscScreenFull> 
                        </div>
                        
                        <div className="upperButtons">

                        </div>
                    </div>
                    
                </div>
            </div>
        }
        
        </>
        
    )
}

export default MiniMap