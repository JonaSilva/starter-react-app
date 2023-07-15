
import { createContext, useState } from "react";
const OverlayContext = createContext();

export function OverlayProvider({ children }) {

    const [isDocumentClosed, setisDocumentClosed] = useState(true);
    const [fileDocument, setfileDocument] = useState(true);
    const [isDetailsClosed, setisDetailsClosed] = useState(true);
    const [openUbicationBtn, setOpenUbicationBtn] = useState(false);
    const [currentNodeSelected, setCurrentNodeSelected] = useState();
    const [previousDocumentTab, setpreviousDocumentTab] = useState();
    const [documentsOpen, setDocumentsOpen] = useState([]);
    const [currentSensors, setCurrentSensors] = useState([]);
    const [currentModels, setCurrentModels] = useState([]);
    const [WarningToast, setWarningToast] = useState(false);
    const [WarningToastPosition, setWarningToastPosition] = useState(false);
    const [WarningToastAddModel, setWarningToastAddModel] = useState(false);
    const [activeButtonSensorsIcons, setActiveButtonSensorsIcons] = useState(false);
    const [activeButtonModelsIcons, setActiveButtonModelsIcons] = useState(false);
    const [reloadHierarchy, setReloadHierarchy] = useState(false)
    const [searchQuery, setSearchQuery] = useState([""]);
    const [toogleModelPopup, setToogleModelPopup] = useState(false);
    const [devActions, setDevActions] = useState(false);
    const [modelQueries, setModelQueries] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState({
        toogle: false,
        query: ""
    });
    const [sensors, setSensors] = useState([]);
    const [toogleHierarchy, setToogleHierarchy] = useState(true)
    const [tabState, setTabState] = useState({
        tab1: true,
        tab2: false,
    });
    const [openedMiniMap, setOpenedMiniMap] = useState(false)

    const [showModelPreview, setShowModelPreview] = useState(false);
    const closeDocument = (bool) => {
        setisDocumentClosed(bool);
    }
    return (
        <OverlayContext.Provider value={{
            isDocumentClosed,
            closeDocument,
            fileDocument,
            setfileDocument,
            isDetailsClosed,
            setisDetailsClosed,
            setCurrentNodeSelected,
            documentsOpen,
            setDocumentsOpen,
            previousDocumentTab,
            setpreviousDocumentTab,
            currentNodeSelected,
            searchQuery,
            setSearchQuery,
            openUbicationBtn,
            setOpenUbicationBtn,
            tabState,
            setTabState,
            WarningToast,
            setWarningToast,
            WarningToastPosition,
            setWarningToastPosition,
            WarningToastAddModel,
            setWarningToastAddModel,
            currentSensors,
            setCurrentSensors,
            currentModels,
            setCurrentModels,
            activeButtonSensorsIcons,
            setActiveButtonSensorsIcons,
            activeButtonModelsIcons,
            setActiveButtonModelsIcons,
            openedMiniMap,
            setOpenedMiniMap,
            toogleModelPopup,
            setToogleModelPopup,
            devActions,
            setDevActions,
            showModelPreview,
            setShowModelPreview,
            reloadHierarchy,
            setReloadHierarchy,
            triggerSearch,
            setTriggerSearch,
            toogleHierarchy,
            setToogleHierarchy,
            modelQueries,
            setModelQueries,
            sensors, 
            setSensors
        }}>
            {children}
        </OverlayContext.Provider>
    )
}

export default OverlayContext