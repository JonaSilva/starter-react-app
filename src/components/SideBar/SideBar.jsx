
import React, { useState, useEffect, useContext } from 'react';
import GlobalContext from '../../context/globalContext';

import './_sideBar.scss';

import { BiChevronLeft } from 'react-icons/bi';

import SubMenuSideBar from './SubMenuSideBar/SubMenuSideBar';
import SubMenuMiniSide from './SubMenuMiniSide/SubMenuMiniSide';
import userService from '../../services/auth/userService';

function SideBar() {
    
    const [name, setName] = useState("Not found");
    const { closeSideBar, setCloseSideBar, logged} = useContext(GlobalContext);
    const [eventMenu, setEventMenu] = useState(null);
   

    const collapseSidebar = () => {
        setEventMenu(null)
        setCloseSideBar(!closeSideBar);
    }

    const transformStringToBoolean= (stringToTransform) =>{
        return stringToTransform.toLowerCase() == ("true" || 'true') ? true: false;
    }

    useEffect(() => {
        
        userService.getUser()
            .then(res => {
                
                const localLogged = transformStringToBoolean(localStorage.getItem('logged'));
                
                if ( localLogged !== null && localLogged === true){
                    
                    setName("Administrator");
                }else{
                    
                    setName(res.name);
                }
            })
            .catch(setName("User"));
    }, [logged])
    return (
        <>

            <div

                className={`d-flex flex-column flex-shrink-0 p-3 text-white background-primary ${closeSideBar ? 'minimize-sidebar' : 'expand-sidebar'}`}
                id='side-bar'>
                <div className="row-12 digitalTwinLogoMinimizeParent">
                    <div to="/" className="d-flex align-items-center text-white digitalTwinLogoMinimize">
                        <div
                            className={closeSideBar ? 'col-12' : 'col-4'}
                            onClick={collapseSidebar}>
                            <img className="bi" width="40" height="32" src={require('../../images/logo.png')} alt='logo'></img>
                        </div>
                        <div className={`col-8 SubMenuSideBar ${closeSideBar ? '' : 'sub-menu-visible'}`}
                            align="left">
                            <span className="fs-4 digitalTwin">Digital twin</span>
                        </div>
                    </div>
                    <BiChevronLeft
                        onClick={collapseSidebar}
                        className={`btn-collapse rounded ${closeSideBar ? 'rotate-180 hidden' : ''}`}></BiChevronLeft>
                </div>
                <div className="row-12">
                    <hr />
                </div>

                {closeSideBar ? <SubMenuMiniSide setEventMenu={setEventMenu} /> : <SubMenuSideBar eventMenu={eventMenu} name={name} />}
            </div>
        </>
    )
}

export default SideBar