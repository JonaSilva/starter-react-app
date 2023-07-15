
import React from 'react';

export default function ShowTypeDocument(document) {

   

    if (document === undefined) {
        return (<></>);
    }

    const URIFileString = (typeFile, fileName) => {
        return `${process.env.REACT_APP_DOMAIN}/static/files/${typeFile}/${fileName}}`;
    };

    let render;

    switch (document.type) {
        case 'image':
            render = <img
                className="document-view-file no-image-select"
                src={`${document.url ? document.url : URIFileString('images', document.filename)}`}
                id="view-imagen"
                alt="img" />;
            break;
        case 'pdf':
            render = <iframe
                className="document-view-file"
                src={`${document.url ? document.url : URIFileString('pdf', document.filename)}`}
                id="iframe-pdf"
            >
            </iframe>;
            break;
        case 'video':
            render = <video
                src={`${document.url ? document.url : URIFileString('video', document.filename)}`}
                width="640"
                height="480"
                autoPlay controls
                className="document-view-file"
                id="iframe-video"
            >
            </video>;
            break;

        default:
            render = <></>;
            break;
    };

    return (render);
  
};
