
import { useState, useContext, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import GlobalContext from '../../../context/globalContext'
import OverlayContext from '../../Overlay/OverlayContext';

import './SubMenuMiniSide.scss';

//Iconos
import { BiHelpCircle } from 'react-icons/bi';
import { RiSettings3Fill } from 'react-icons/ri';
import { BsFilePersonFill } from 'react-icons/bs';
import { TbBuildingCommunity } from 'react-icons/tb';

function SubMenuMiniSide(props) {
    const { setEventMenu } = props;
    const [isLoaded, setisLoaded] = useState(false);
    const {setisDetailsClosed} = useContext(OverlayContext);
    const { setCloseSideBar } = useContext(GlobalContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        setisLoaded(true);
        setisDetailsClosed(true);
    }, []);

    const openOptionMenu = (e) => {
        
        setEventMenu(e.currentTarget.id);
        setCloseSideBar(false);
        
    }

    const closeDetails = () =>{
        localStorage.removeItem('model');
        setisDetailsClosed(true);
        navigate(`/`);
    }
    return (
        <div className={`sub-menu-min ${isLoaded ? 'sub-menu-visible' : ' '} flex-parent`}>
            <div className="siteSelectionMini">
                <button onClick={closeDetails} className="active rounded" aria-current="page">
                    <TbBuildingCommunity className="bi" size="2.5em"></TbBuildingCommunity>
                </button>
            </div>

            <div className='lowerMenuMini'>
                <hr className="separatorInferiorMenu" />
                <div className="groupInferiorButtons">
                    <button onClick={openOptionMenu} id="0">
                        <BsFilePersonFill size='1.45em'></BsFilePersonFill>
                    </button>
                    <button onClick={openOptionMenu} id="1">
                        <RiSettings3Fill size="1.45em"></RiSettings3Fill>
                    </button>
                    <button onClick={openOptionMenu} id="2">
                        <BiHelpCircle size="1.45em"></BiHelpCircle>
                    </button>
                </div>
                
                {/*<Link to="" className="nav-link firstLink mb-1 rounded" aria-current="page">
                    <BsFilePersonFill className='bi me-1' size="2.5em"></BsFilePersonFill>
                </Link>
                <Link to="" className="nav-link mb-1 rounded" aria-current="page">
                    <RiSettings3Fill className='bi me-1' size="2.5em"></RiSettings3Fill>
                </Link>
                <Link to="" className="nav-link mb-1 rounded" aria-current="page">
                    <BiHelpCircle className='bi me-1' size="2.5em"></BiHelpCircle>
                </Link>*/}
            </div>


        </div>
    )
}


export default SubMenuMiniSide