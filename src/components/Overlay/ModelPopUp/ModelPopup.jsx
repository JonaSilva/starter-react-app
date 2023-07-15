
import React, { useContext, useEffect, useState } from 'react';
import { CloseButton, Form } from 'react-bootstrap';
import OverlayContext from '../OverlayContext';
import MatterportContext from '../../Matterport/MatterportContext';
import modelsServices from '../../../services/modelsServices';
import hyperlinksServices from '../../../services/hyperlinksService';

import './ModelPopUp.scss';

import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ModelPopup(props) {
    const { active } = props;
    const { setToogleModelPopup, setWarningToast, WarningToast } = useContext(OverlayContext);
    const { clickedModel, setClickedModel } = useContext(MatterportContext);
    const [modelInfo, setModelInfo] = useState();
    const [modelLinks, setModeLinks] = useState();

    useEffect(() => {
        if (clickedModel !== undefined) {
            modelsServices.getModelById(clickedModel)
                .then((res) => {
                    //Get HyperLinks
                    if (res[0].interactuable.data[0] === 1 && res[0].interactuable_type === "web") {

                        hyperlinksServices.getHyperLinksByParentUUID(res[0].parent)
                            .then((res) => {
                                if (res.length === 1) {
                                    window.open(res[0].url, '_blank', 'statusbar=no,height=800,width=800,xyz=abc').focus();
                                } else if (res.length > 1) {
                                    setToogleModelPopup(true);
                                    setModeLinks(res)
                                }

                            })
                            .catch(err => console.error(err))
                        setModelInfo(res);
                        setClickedModel(undefined)
                    }
                    if (res[0].interactuable.data[0] === 1 && res[0].interactuable_type === "text") {
                        setClickedModel(undefined)
                        //  setWarningToast(true)
                        setModelInfo(res[0].interactuable_content);
                        setToogleModelPopup(true);
                    }

                }).catch(err => console.error(err))
        }

    }, [clickedModel]);

    useEffect(() => {
    }, [modelLinks, modelInfo])
    return (
        <div id='ModelPopup'
            className={` ${active ? '' : 'hidden'}`}
        >
            <ToastContainer
                position="middle-center"
                className="p-3 details-toast"
            >
                <Toast
                    bg="warning"
                    onClose={() => setWarningToast(false)} show={WarningToast} delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Exito</strong>
                    </Toast.Header>
                    <Toast.Body>warning</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className="mainContainterModelPopUp">
                <div className="topModelPopUp">
                    <div className="titleModelPopUp"><h5>Información del modelo</h5></div>
                    <div className="CloseButton">
                        <CloseButton variant="white"
                            className='pointer-events'
                            onClick={() => {

                                setToogleModelPopup(false);
                            }}
                        />
                    </div>
                </div>
                <div className="bottomModelPopUp">
                    {
                        (modelInfo !== (undefined || null)) ? <textarea className="form-control pointer-events" type="text" placeholder={modelInfo} disabled /> : <Form.Control type="text" placeholder="Sin información disponible" disabled readOnly />
                    }
                </div>
            </div>
        </div>
    )
}

export default ModelPopup

/*
{Array.isArray(modelLinks) && modelLinks.length > 0 ?

    modelLinks.map((item, index) =>
        <div
            className='pointer-events pointer-hand no-text-select details-description-text'
            key={index + "det"}
            onClick={() => {
                if (item.type === "web") {
                    window.open(item.url, '_blank', 'statusbar=no,height=800,width=600,xyz=abc').focus();
                } else {

                }
            }}
        >{item.filename}

        </div>
    )
    : <div
        className='pointer-events pointer-hand no-text-select details-description-text'>
        <div><strong>No se encontraron documentos</strong></div>
    </div>
}
*/