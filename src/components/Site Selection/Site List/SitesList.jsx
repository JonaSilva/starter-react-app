
import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Site from '../Site.jsx';

import "./sitesList.scss";

import GlobalContext from '../../../context/globalContext.jsx';
import LoadingScreen from '../../LoadingScreen/LoadingScreen.jsx';

function SitesList(props) {
    const {
        siteTry,
        loadingSuccessful
    } = useContext(GlobalContext)

    const { buildingSiteList } = props;

    buildingSiteList.sort((a, b) => a.name > b.name ? 1 : -1);
    /*const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});
    
    function handleResize() {
       setWindowSize({width: window.innerWidth, height: window.innerHeight});
    }
    
    window.addEventListener('resize', handleResize)*/

    return (
        <div className='main-div'>
            {loadingSuccessful === true ? <></> : <LoadingScreen appState={`tryNumber ${siteTry}`} />}


            <div className='lista-tarjetas'>
                <h1>

                    Site selection
                </h1>
                <Row sm={2} xs={1} md={4} lg={5} className="gy-4 gx-2">
                    {buildingSiteList.map((site) =>
                        <Col key={site.name} >
                            <Site
                                buildings={site.buildings}
                                name={site.name}
                                image={site.img}
                                siteId={site.parentId}
                            />
                        </Col>

                    )}
                </Row>
            </div>
        </div>

    )
}

export default SitesList