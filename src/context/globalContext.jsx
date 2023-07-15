
import { createContext, useState } from "react";
const GlobalContext = createContext();

export function GlobalProvider({ children }) {

    const [model, setModel] = useState(localStorage.getItem('model'));
    const [startPoint, setStartPoint] = useState(localStorage.getItem('startPoint'));
    const [siteName, setSiteName] = useState(localStorage.getItem('siteName'));
    const [siteId, setSiteId] = useState();
    const [siteTry, setSiteTry] = useState(0);
    const [loadingSuccessful, setLoadingSuccessful] = useState(false);
    const transformStringToBoolean = (stringToTransform) => {
        if (stringToTransform == null) {
            return false
        }
        else {
            return stringToTransform.toLowerCase() == ("true" || 'true') ? true : false;
        }

    }
    const [logged, setLogged] = useState(localStorage.getItem('logged') === (undefined || "") ? "" : transformStringToBoolean(localStorage.getItem('logged')));
    const [closeSideBar, setCloseSideBar] = useState(true);


    const updateModel = (model) => {
        localStorage.setItem('model', model);
        setModel(model);
    }
    const updateSiteName = (site) => {
        localStorage.setItem('siteName', site);
        setSiteName(site);
    }
    const updateCurrentSiteID = (building) => {
        localStorage.setItem('building', building);
        setSiteId({ building })

    }

    const updateLogged = (logged) => {

        localStorage.setItem('logged', logged);
        setLogged(logged);
    }
    return (
        <GlobalContext.Provider value={{
            model,
            setModel,
            startPoint,
            setStartPoint,
            updateCurrentSiteID,
            siteId,
            updateModel,
            siteName,
            updateSiteName,
            logged,
            setLogged,
            updateLogged,
            closeSideBar,
            setCloseSideBar,
            siteTry,
            setSiteTry,
            loadingSuccessful,
            setLoadingSuccessful

        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext