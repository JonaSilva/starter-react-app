
import React, { useImperativeHandle, useState, useContext, useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import OverlayContext from '../OverlayContext';
import Atab from './Atab';
import { gsap } from "gsap";
import './Document.scss';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ShowTypeDocument from './ShowTypeDocument';


const getLimitLeftScreenOnFalse = (elementBounds, mousePosition) => {
    return elementBounds.left < 0 ? 50 : elementBounds.left - mousePosition.x;
};

const getLimitTopScreenOnFalse = (elementBounds, mousePosition) => {
    return elementBounds.top < 0 ? 50 : elementBounds.top - mousePosition.y;
};

function moveElement(element, mousePosition) {
    const elementBounds = element.getBoundingClientRect();
    const screenRect = element.parentElement.getBoundingClientRect();

    const newPosition = {
        left: elementBounds.left + elementBounds.width > screenRect.width - 50 ? screenRect.width - elementBounds.width - 100 : getLimitLeftScreenOnFalse(elementBounds, mousePosition),
        top: elementBounds.top + elementBounds.height > screenRect.height - 50 ? screenRect.height - elementBounds.height - 100 : getLimitTopScreenOnFalse(elementBounds, mousePosition)
    };
    gsap.to(element, 0, {
        top: `${newPosition.top}px`,
        left: `${newPosition.left}px`,
        ease: "power3.out"
    });
};

function mousemove (e, prevX, prevY) {
    const newX = prevX - e.clientX;
    const newY = prevY - e.clientY;
    moveElement(element, { x: newX, y: newY });
}

function mouseUp () {
    window.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseleave", mouseUp);
    element.removeEventListener("mouseup", mouseUp);
}

function mousedown(e, element) {
    if ((e.target.id !== "view-imagen" && e.target.id !== "iframe-pdf" && e.target.id !== "iframe-video") && element.id === "document-container") {
        window.addEventListener("mousemove", mousemove);
        element.addEventListener("mouseleave", mouseUp);
        element.addEventListener("mouseup", mouseUp);
        mousemove(e, e.clientX, e.clientY);
        mouseUp();
    }
}


const Document = React.forwardRef((props, ref) => {
    const { isDocumentClosed, closeDocument, fileDocument, documentsOpen, setDocumentsOpen, setWarningToast, WarningToast } = useContext(OverlayContext);
    const [documentData, setDocumentData] = useState({ type: "", file: "none" });

    const viewRef = useRef();
    const ulTab = useRef();

    //para llamar funcion desde padre 
    function closeClick() {
        closeDocument(true);
    };

    useImperativeHandle(ref, () => ({
        childFunction(data) {
            setDocumentData(data);
        }
    }));

    useEffect(() => {
        if (documentsOpen.length < 4) {
            const alreadyOpen = documentsOpen.filter(document => document.filename === fileDocument.filename);
            if (alreadyOpen.length !== 0) {
                fileDocument.active = true;
                setDocumentData(fileDocument);
                documentsOpen.map(document => document.active = false);
                setDocumentsOpen(documentsOpen => [...documentsOpen, fileDocument]);
            }
        } else {
            setWarningToast(true);
        }
    }, [fileDocument]);

    const handleMouseDown = (e) => {
        viewRef.current.style.cursor = "grabbing";
        mousedown(e, viewRef.current);
    };

    useEffect(() => {
        viewRef.current.addEventListener("mousedown", handleMouseDown);
    }, []);

    return (
        <div
            ref={viewRef}
            className={`pointer-events ${isDocumentClosed ? 'hidden' : 'document-view'}`}
            id="document-container">
            <div className='row'>
                <div className='col-10'>
                    {documentsOpen.length > 0 ?
                        <ul
                            ref={ulTab}
                            className="overlay-tabs group document-overlay-tabs">
                            {documentsOpen.map((document, index) => <li className='li-details' key={`${document.filename}${index * 2}`}>
                                <div>
                                    <Atab
                                        key={`${document.filename}${index * 2}`}
                                        document={document}
                                        filename={document.filename}
                                        active={document.active}
                                        documentData={documentData}
                                        setDocumentData={setDocumentData} />
                                </div>
                            </li>
                            )}
                        </ul>
                        : <></>}
                </div>
                <div className='col-2 section-ov-document document-actions-container'
                >
                    <div
                        onClick={closeClick}
                        className='pointer-hand pointer-events'
                    >
                        <AiOutlineClose className='close-document-button' />
                    </div>

                </div>
            </div>
            <div className='pointer-events section-ov-document overlay-content docuemt-size p-3'>
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
                                alt="" />
                            <strong className="me-auto">Precaución</strong>
                        </Toast.Header>
                        <Toast.Body>Favor de cerrar una pestaña en visualizador de documentos y reintente nuevamente la apertura de documento</Toast.Body>
                    </Toast>
                </ToastContainer>
                <ShowTypeDocument document={documentData}></ShowTypeDocument>
            </div>
        </div>
    );
});

export default Document;
