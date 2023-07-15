
import React, { useContext } from 'react';
import { useNavigate} from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import GlobalContext from '../../context/globalContext';
import "./site.scss";

import PropTypes from 'prop-types';
function Site(props) {
    const { buildings, name, image } = props;

    const { updateModel, setStartPoint, updateCurrentSiteID, updateSiteName } = useContext(GlobalContext);
    const navigate = useNavigate();

    const clickLink = (item) => {
        console.log(item.Description);
        if (item.StartPoint) {
            setStartPoint(item.StartPoint)
            localStorage.setItem('startPoint', item.StartPoint);
        }else{
            setStartPoint('')
            localStorage.setItem('startPoint', '');
        }
        localStorage.setItem('startPoint', item.StartPoint);
        updateCurrentSiteID(item.Id);
        updateModel(item.Model);
        updateSiteName(item.Description);
        navigate(`/site`);
    }

    return (
        <>
            <Card className='site-card proyect-card' bg="light">
                <Card.Img className='image' variant="bottom" src={`${image ? image : require('../../images/Site.png')}`} />
                <Card.ImgOverlay className='overlay' >
                    <Card.Title className='title'>{name}</Card.Title>
                </Card.ImgOverlay>
                <Card.Body>
                    <Dropdown>
                        <Dropdown.Toggle size="lg" className='mx-2 dropdown-button' id="dropdown-basic">
                            <span className='drop-text'>{name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={`${buildings.length > 12 ? 'overflowBuildingList': 'noOverflowBuildingList'}`}>
                            {buildings.map((item) =>
                                <div key={item.Id + "l"}>
                                    <button onClick={() => clickLink(item)} className="dropdown-item drop-text">
                                        {item.Description}
                                    </button>
                                </div>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Body>
            </Card>
        </>
    )
}
Site.propTypes = {
    //position: PropTypes.string,
    buildings: PropTypes.array
}
export default Site