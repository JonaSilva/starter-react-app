
import React, { useContext, useRef } from 'react';
import OverlayContext from '../OverlayContext';
import { AiOutlineClose } from 'react-icons/ai';

export default function Atab(props) {
    const { closeDocument, documentsOpen, setDocumentsOpen} = useContext(OverlayContext);
    const { filename, active, document, documentData, setDocumentData } = props;
    const itemsRef = useRef([]);
    itemsRef.current = [];
    const addToRefArray = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };

    const cloeseTab = (e) => {
        const tabText = e.target.parentElement.parentElement.innerText;
        if(documentsOpen.length>= 1){
            const newArray = documentsOpen.filter(element => {
                return element.filename !== tabText
            });
            setDocumentsOpen(newArray);
            if(documentsOpen.length === 1){
                closeDocument(true);
            }
        }
    };

    function clickTab(docuemt, tab) {
        if (tab.target.nodeName !== "svg") {
            documentsOpen.forEach(element => {
                if (element.filename === tab.target.innerText) {
                    element.active = true;
                } else {
                    element.active = false;
                }
            });
            setDocumentData([...documentData, docuemt]);
            setDocumentsOpen([...documentsOpen])
        }
    };

    return (
        <a
            onClick={(e) => clickTab(document, e)}
            className={`pointer-events pointer-hand no-text-select ${active ? "overlay-tab-active" : ""}`}
            ref={addToRefArray}
        > <span className='no-text-select'>
                {filename}
            </span>
            <div className='overlay-tab'
                onClick={(e) => cloeseTab(e)}
            >
                <AiOutlineClose className='close-document-button' />
            </div>
        </a>
    );
};
