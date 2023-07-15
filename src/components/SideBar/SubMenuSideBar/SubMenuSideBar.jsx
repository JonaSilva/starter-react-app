
//React
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OverlayContext from '../../Overlay/OverlayContext';
//Iconos
import { BiHelpCircle } from 'react-icons/bi';
import { RiSettings3Fill } from 'react-icons/ri';
import { BsFilePersonFill } from 'react-icons/bs';
import { TbBuildingCommunity } from 'react-icons/tb';
import { GoTriangleDown } from 'react-icons/go';
//Bootsrapt
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { AccordionContext } from 'react-bootstrap';

import './SubMenuSideBar.scss';



function ContextAwareToggle({ children, eventKey, callback }) {
    const { eventKeyMenu } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = eventKeyMenu === eventKey;
    return (

        <Link
            to="" className={`nav-link row-12 boton-acordion ${isCurrentEventKey ? "active" : ""}`} aria-current="page"
            onClick={(event) => { event.preventDefault(); decoratedOnClick(); }}
        >
            {children}
        </Link>
    );
}



function SubMenuSideBar(props) {
    const { eventMenu, name } = props;
    const [isLoaded, setisLoaded] = useState(false);
    const { setisDetailsClosed } = useContext(OverlayContext);
    const navigate = useNavigate();

    useEffect(() => {
        setisLoaded(true);
        setisDetailsClosed(true);
    }, []);

    useEffect(() => {

        if (eventMenu !== null && document.getElementById('event' + eventMenu) !== null) {
            document.getElementById('event' + eventMenu).children[0].click()
        }
    }, [eventMenu])

    const closeDetails = () => {
        localStorage.removeItem('model');
        setisDetailsClosed(true);
        navigate(`/`);
    }
    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={`SubMenuSideBar ${isLoaded ? 'sub-menu-visible' : ' '} flex-parent`}
        >
            <div className="row-12">
                <div className='siteSelectionNormal'>
                    <button onClick={closeDetails} className="rounded active" aria-current="page">
                        <div className="interiorButton">
                            <TbBuildingCommunity className="iconSiteSelection mt-1"></TbBuildingCommunity>
                            <div className="nameSiteSelection">Site selection</div>
                        </div>
                    </button>
                </div>
            </div>
            <div className="row-12">
                <hr />
                <Accordion className='nav nav-pills Accordion flex-column mb-md-0'>
                    <Card className='nav-item no-border' bg='transparent' border="transparent">
                        <div className='no-border row-12' id="event0">
                            <ContextAwareToggle eventKey="0">
                                <BsFilePersonFill className="col-2 inLineFlex"></BsFilePersonFill>
                                <span className={`col-8 inlineBlock ${name.length < 10 ? 'nameShort' : 'nameLong'}`}>{name}</span>
                                <GoTriangleDown className="col-2 inlineBlock mt-1 arrows"></GoTriangleDown>
                            </ContextAwareToggle>
                        </div>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <div className="col-2 inLineFlex"></div>
                                <div className="col-8 inlineBlock text">Logout</div>
                                <div className="col-2 inlineBlock"></div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card className='nav-item no-border' bg='transparent' border="transparent">
                        <div className='no-border row-12' id="event1">
                            <ContextAwareToggle eventKey="1" >
                                <RiSettings3Fill className="col-2 inLineFlex"></RiSettings3Fill>
                                <span className="col-8 inlineBlock text">Settings</span>
                                <GoTriangleDown className="col-2 inlineBlock mt-1 arrows"></GoTriangleDown>
                            </ContextAwareToggle>
                        </div>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <div className="col-2 inLineFlex"></div>
                                <div className="col-8 inlineBlock text">Product Group Management</div>
                                <div className="col-2 inlineBlock"></div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card className='nav-item no-border' bg='transparent' border="transparent">
                        <div className='no-border row-12' id="event2">
                            <ContextAwareToggle eventKey="2" >
                                <BiHelpCircle className="col-2 inLineFlex"></BiHelpCircle>
                                <span className="col-8 inlineBlock text">Help</span>
                                <GoTriangleDown className="col-2 inlineBlock mt-1 arrows"></GoTriangleDown>
                            </ContextAwareToggle>
                        </div>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body className="listGroup">
                                <div className='col-2 inLineFlex'></div>
                                <div className="col-10 inlineBlock textHelp">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className='pointer-hand' onClick={() => openInNewTab('https://www.youtube.com/watch?v=')}>Tutorial</ListGroup.Item>
                                        <ListGroup.Item className='pointer-hand' onClick={() => openInNewTab('https://sway.office.com/lNQCsSgPjlhsHvKS?play')}>User Guide</ListGroup.Item>
                                        <ListGroup.Item className='pointer-hand' onClick={() => openInNewTab('https://https://www.sanofi.com.mx/')}>Release Notes</ListGroup.Item>
                                        <ListGroup.Item className='pointer-hand' onClick={() => openInNewTab('https://https://www.sanofi.com.mx/')}>Shortcuts</ListGroup.Item>
                                        <ListGroup.Item className='pointer-hand' onClick={() => openInNewTab('https://forms.office.com/Pages/ResponsePage.aspx?id=1sijrHGqGk6hDgNXL8WMC6LTWz7PiLJOmBTno-w4JC5UMzBITTZORVY0R1NJT1A0QURNTUVDSTBaWSQlQCN0PWcu')}>
                                            Feedback</ListGroup.Item>
                                        <ListGroup.Item>v0.01</ListGroup.Item>
                                    </ListGroup>
                                </div>

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

            </div>

        </div>
    )
}

export default SubMenuSideBar