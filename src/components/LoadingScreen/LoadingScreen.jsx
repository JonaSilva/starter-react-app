
import React, { useEffect, useState } from 'react'
import './LoadingScreen.scss'

function LoadingScreen(props) {

    const [hidde, setHidde] = useState(false);
    const [textToShow, setTextToShow] = useState("Iniciando modelo");
    const { appState } = props;

    function hiddeLoadScreen() {
        setHidde(true)
    }
    useEffect(() => {
        switch (appState.toString()) {
            case "Loading":
                setTextToShow("Obteniendo modelo");

                break;
            case 'appphase.loading':
                setTextToShow("Cargando modelo");
                break;
            case 'appphase.playing':
                setTextToShow("Finalizando carga");
                document.getElementById('showcase').contentWindow.document.getElementById('bottom-ui').style.display = "none";
                document.getElementById('showcase').contentWindow.document.getElementById('control-kit-wrapper').addEventListener('DOMNodeInserted', (e) => {
                    e.target.remove();
                });

                setTimeout(hiddeLoadScreen, 3500);
                break;
            case 'tryNumber 0':
                setTextToShow("Cargando sitios ...");
                break;
            case 'tryNumber 1':
                setTextToShow("Reintento de obtener sitios:  1 ");
                break;
            case 'tryNumber 2':
                setTextToShow("Reintento de obtener sitios:  2 ");
                break;
            case 'tryNumber 3':
                setTextToShow("Ocurrió un error. Favor de comunicarse con el administrador del sitio.");
                break;
            default:
                evaluateAppState(appState);
                break;
        }

    }, [appState, textToShow])


    const evaluateAppState = (state) => {
        if (state.includes("Error")) {
            setTextToShow("Lo sentimos, ocurrió un error " + state);
        } else {
            setTextToShow("Lo sentimos, ocurrió un error inesperado favor de refrescar la página");
        }

    }

    return (
        <div
            className={`no-pointer-events ${hidde === true ?
                'hidden' : ''
                }`}
            id='loadingScreen'>
            <div id="loading-wrapper">
                <div id="loading-text">{textToShow}</div>
                <div id="loading-content"></div>
            </div>
        </div>
    )
}

export default LoadingScreen