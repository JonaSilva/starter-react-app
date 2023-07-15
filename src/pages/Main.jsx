
import React, { useEffect, useState, useContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Matterport from '../components/Matterport/Matterport';
import MatterportDev from '../components/Matterport/MatterportDev';

import MatterportBundle from '../components/Matterport/MatterportBundle';
import SideBar from '../components/SideBar/SideBar';
import SitesList from '../components/Site Selection/Site List/SitesList.jsx';
import Option from './Option';
import '../style/pages/_main.scss';

//Servicio de sitios
import sitesServices from '../services/sitesServices';
import GlobalContext from '../context/globalContext';

function Main() {
    console.log('init');
    const {
        logged,
        setCloseSideBar,
        setSiteTry,
        setLoadingSuccessful,
    } = useContext(GlobalContext)

    const [siteList, setsiteList] = useState([]);
    const [retry, setRetry] = useState(false);
    const [tryServiceCounter, setTryServiceCounter] = useState(0)

    const [buildingSiteList, setBuildingSiteList] = useState([]);

    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {

        if (location.pathname.includes("site")) {

            setCloseSideBar(true);
        } else {
            setCloseSideBar(false);
        }
    }, [location]);

    //Get sites
    //No se pudieron obtener los sitios, por favor comunicate con el administrador del sitio
    useEffect(() => {

        if (!retry && siteList.length == 0) {
            getSites();
        }
    }, [retry])

    const getSites = () => {

        if (tryServiceCounter < 3) {
            setRetry(true);
            sitesServices.getSites()
                .then(res => {

                    setTryServiceCounter(0);
                    setRetry(false)
                    setsiteList(res)
                    setLoadingSuccessful(true);
                })
                .catch((err) => {
                    setTryServiceCounter(tryServiceCounter + 1);
                    setRetry(false);
                });
        } else {
            setTryServiceCounter(0);
            setSiteTry(3);
        }

    }

    useEffect(() => {
        siteList.sort((a, b) => a.Site - b.Site);
        siteList.forEach((site) => {
            sitesServices.getBuildingBySite(site.Site)
                .then(res => {
                    setBuildingSiteList((prev) => ([
                        ...prev,
                        {
                            name: site.Site,
                            img: site.ImgB64,
                            buildings: res.data,
                            parentUiid: site.UUID,
                            parentId: site.Id
                        }
                    ]));
                })
                .catch((err) => {
                    console.error(err)
                });
        });
    }, [siteList])

    const redirectToSite = () => {
        if (typeof localStorage.getItem('model') === 'string' && location.pathname === '/') {
            navigate(`/site/`);
        } else {
            return (<Route path='/' element={<SitesList buildingSiteList={buildingSiteList} />}></Route>)
        }
    }


    return (
        <div
            className={`App`}
        >
            <Helmet>
                <script src="https://static.matterport.com/showcase-sdk/latest.js" type="text/javascript" />
            </Helmet>
            <SideBar />
            <Routes >
                {redirectToSite()}
                <Route path='/site/' element={logged ? <MatterportDev /> : <Matterport />}></Route>
                <Route path='/siteSDK/' element={<MatterportBundle />}></Route>
                <Route path='/beheerder/' element={<Option />}></Route>
                <Route path="*" element={<h1>NOt found</h1>}></Route>
            </Routes>


        </div>
    )
}

export default Main
