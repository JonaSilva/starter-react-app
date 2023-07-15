
import React, { useContext, useEffect, useState } from 'react'

import OverlayContext from '../../OverlayContext';
import Table from 'react-bootstrap/Table';
import './Details.scss'


function Details(props) {
    //const { point, updatePoint, setToogleModel, toogleModel } = useContext(MatterportContext);
    const { closeDocument, setfileDocument, isDetailsClosed, isDocumentClosed, tabState, setTabState } = useContext(OverlayContext);
    const { details, fileList, dataNode } = props;
    const [enableTable, setEnableTable] = useState(false);

    //  console.log({ fileList })
    let filteredList, headerTable, bodyTable, testing;

    const clickTab = (e) => {
        switch (e.target.text) {
            case "Información":
                setTabState({
                    tab1: true,
                    tab2: false,
                })
                break;
            case "Documentos y Enlaces":
                setTabState({
                    tab1: false,
                    tab2: true,
                })
                break;
            default:
                break;
        }
    }

    const RenderHeader = () => {
        if (dataNode == undefined) {
            return (<tr><td><strong>SIN INFORMACIÓN DISPONIBLE</strong></td></tr>);

        } else {
            return (<tr><td><strong>DATO</strong></td><td><strong>VALOR</strong></td></tr>);

        }
    }

    const RenderBody = () => {
        if (dataNode === undefined) {

            return (<tr></tr>);

        } else {
            getCleanData(dataNode);

            return (Object.entries(filteredList).map(([key, value, index]) => {

                if (value == null) {
                    return <tr key={index}><td className='details-table-value-name'>{key}</td><td></td></tr>
                }

                return <tr key={index}><td className='details-table-value-name'>{key}</td><td className='details-table-value'>{value}</td></tr>

            }));
        }
    }

    const getCleanData = (data) => {
        switch (Object.keys(data)[1]) {

            case "Equipment":

                filteredList = {
                    Equipment: dataNode.Equipment,
                    System: dataNode.System,
                    Tag: dataNode.Tag,
                    Description: dataNode.Description,
                    Manufacter: dataNode.Manufacter,
                    Model: dataNode.Model,
                    SerialNumber: dataNode.SerialNumber,
                    SAP_Tag: dataNode.SAP_Tag
                }

                break;
            case "electricalPanel":

                filteredList = {
                    Panel: dataNode.electricalPanel,
                    System: dataNode.System,
                    Tag: dataNode.Tag,
                    Description: dataNode.Description,
                    Manufacter: dataNode.Manufacter,
                    Model: dataNode.Model,
                    SerialNumber: dataNode.SerialNumber,
                    SAP_Tag: dataNode.SAP_Tag
                }

                break;
            case "Instrument":
                filteredList = {
                    Instrument: dataNode.Instrument,
                    Tag: dataNode.Tag,
                    System: dataNode.System,
                    Equipment: dataNode.Equipment,
                    Description: dataNode.Description,
                    Manufacter: dataNode.Manufacter,
                    Model: dataNode.Model,
                    SerialNumber: dataNode.SerialNumber,
                    SAP_Tag: dataNode.SAP_Tag
                }
                break;

            case "Room":

                filteredList = {
                    Room: dataNode.Room,
                    Level: dataNode.Level,
                    Description: dataNode.Description,
                    SAP_Tag: dataNode.SAP_Tag
                }
                break;

            case "Subequipment":
                filteredList = {
                    Subequipment: dataNode.Subequipment,
                    Tag: dataNode.Tag,
                    Location: dataNode["Location(Room)"],
                    Description: dataNode.Description,
                    Manufacter: dataNode.Manufacter,
                    Model: dataNode.Model,
                    SerialNumber: dataNode.SerialNumber,
                    SAP_Tag: dataNode.SAP_Tag
                }
                break;

            default:
                console.log(dataNode);
                break;
        }
    }



    useEffect(() => {

    }, [dataNode]);

    return (
        <>
            <div className={` ${isDetailsClosed ? 'hidden' : 'no-pointer-events'}`}>
                <div className="tabs">
                    <ul className="tabs group">
                        <li>
                            <a
                                onClick={(e) => clickTab(e)}
                                className={`${tabState.tab1 ? 'active' : ''} pointer-events pointer-hand no-text-select`} >Información
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={(e) => clickTab(e)}
                                className={`${tabState.tab2 ? 'active' : ''} pointer-events pointer-hand no-text-select`}>Documentos y Enlaces</a>
                        </li>
                    </ul>
                </div>
                <div className="content">
                    {
                        tabState.tab1 ?
                            <div className=' p-3 h-100'>
                                <div className={`row-12 ${!tabState.tab1 ? '' : ' tableList pointer-events pointer-hand fade-in'}  `}>
                                    <div className='col-12 section-ov-document'>
                                        {
                                            (details !== undefined) &&
                                            <Table key="2" bordered className='details-file-list'>
                                                <thead>

                                                    {<RenderHeader />}
                                                </thead>
                                                <tbody className='details-table-body'>
                                                    {<RenderBody />}
                                                </tbody>
                                            </Table>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='p-3 h-100'>
                                <div className={`row-12 sub-ov pointer-events no-x-scroll ${!tabState.tab2 ? '' : 'fade-in'}`}>
                                    <div className='col-12 details-file-list h-100'>
                                        { fileList.length > 0 ?

                                            fileList.map((item, index) =>
                                                <div
                                                    className='pointer-events pointer-hand no-text-select details-description-text'
                                                    key={index + "det"}
                                                    //Llamar funcion de padre 
                                                    onClick={() => {
                                                        if (item.type === "web") {
                                                            window.open(item.url, '_blank', 'statusbar=no,height=800,width=600,xyz=abc').focus();
                                                        } else {
                                                            if (isDocumentClosed) {
                                                                closeDocument(false)
                                                            }
                                                            setfileDocument(item)
                                                        }
                                                    }}
                                                >{item.filename}

                                                </div>
                                            )
                                            : <div
                                                className='pointer-events pointer-hand no-text-select details-description-text'>
                                                <div><strong>No se encontraron documentos</strong></div>
                                            </div>
                                        }
                                    </div>

                                </div>

                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Details