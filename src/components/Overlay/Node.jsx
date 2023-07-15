
import React, { useState, useImperativeHandle, useEffect, useRef, useContext } from 'react';

import { BiChevronRight } from 'react-icons/bi';
import { FaBuromobelexperte } from 'react-icons/fa';
import { IoScaleSharp } from "react-icons/io5";
import { RiServerFill } from 'react-icons/ri';
import { AiTwotoneFire } from 'react-icons/ai';
import OverlayContext from './OverlayContext';

const Node = React.forwardRef((props, ref) => {
    //const { title, active, eventToParent } = props;
    const { title, changeDescription, type, closeFromParent, id, level, equipments, instruments, HSE_Equipaments, isBranch, name, description, Subequipment } = props;
    const { setisDetailsClosed, setCurrentNodeSelected } = useContext(OverlayContext);
    const [expanded, setExpanded] = useState(false);
    const [clicked, setclicked] = useState(false);
    const [subLevel, setSubLevel] = useState([]);
    const hasSubEquipiment = (Array.isArray(Subequipment) ? Subequipment.length > 0 ? true : false : false);
    const [isParent, setIsparent] = useState(hasSubEquipiment || (equipments !== undefined && equipments.length > 0) || (instruments !== undefined && instruments.length > 0) || (instruments !== undefined && HSE_Equipaments.length > 0))
    const itemsRef = useRef([]);
    const currentRef = useRef();
    itemsRef.current = [];
    let children;
    const nodeClick = (e) => {

        if (itemsRef.current.length > 0) {
            itemsRef.current.forEach(item => item.childFunction())
        }
        setclicked(!clicked);
        setCurrentNodeSelected(currentRef);
        setExpanded(!expanded);
        changeDescription(
            {
                title: name,
                description: description

            }
        )
        setisDetailsClosed(false);
    };




    //child function
    const childCall = (event) => {

        changeDescription(
            {
                title: event.title,
                description: event.description
            }
        )

    }
    useEffect(() => {
        if (closeFromParent) {
            //childRef.current.childFunction();

        }
    }, [closeFromParent])

    const SimpleChild = () => {
        return (
            <h1>Hola</h1>
        );
    };
    useEffect(() => {
        let subLevelArray = [];
        if (equipments !== undefined && equipments.length > 0) {
            subLevelArray.push("Equipment");
        }
        if (instruments !== undefined && instruments.length > 0) {
            subLevelArray.push("Instrument");
        }
        if (HSE_Equipaments !== undefined && HSE_Equipaments.length > 0) {
            subLevelArray.push("HSE_Equipment");
        }
        setSubLevel(subLevelArray);

    }, [equipments, instruments, HSE_Equipaments])
    //Funcion compartida con padre
    useImperativeHandle(ref, () => ({
        childFunction(data) {
            if (itemsRef.current.length > 0) {
                itemsRef.current.forEach(item => item.childFunction())
            }
            setExpanded(true);
        }
    }))
    useImperativeHandle(currentRef, () => ({
        unClickNode() {
            setclicked(false);
        }
    }))
    const addToRefArray = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }

    }
    return (

        <>
            <div
                ref={currentRef}
                className={
                    `node node-${type}
                     ${closeFromParent ? ' hidden' : ''}
                     ${clicked ? `node-active-${type}` : ''}
                     `
                }
                onClick={nodeClick}
            > <div className={`node-container ${isParent ? 'node-parent' : ''}`} >
                    {
                        isParent ?
                            <BiChevronRight className={`${expanded ? 'chevron-down' : ''}`} /> : <></>
                    }


                    {level.toString() === "1" ? <FaBuromobelexperte /> : <></>}
                    {level.toString() === "2" ? <IoScaleSharp /> : <></>}
                    {level.toString() === "3" ? <AiTwotoneFire /> : <></>}
                    {level.toString() === "4" ? <RiServerFill /> : <></>}
                    <span className='node-title no-text-select pointer-hand'>{`${title}`}</span>
                </div>

            </div>

            {hasSubEquipiment ?
                Subequipment.map((equipament, index) =>
                    <Node
                        key={index}
                        title={`${equipament.Tag}-${equipament.DESCRIPTION}`}
                        changeDescription={(event) => childCall(event)}
                        equipments={undefined}
                        instruments={undefined}
                        HSE_Equipaments={undefined}
                        Subequipment={undefined}
                        type={equipament.TYPE}
                        closeFromParent={expanded}
                        id={equipament.UUID}
                        ref={addToRefArray}
                        level={equipament.HLEVEL}
                        isBranch={"final"}
                        name={equipament.Tag}
                        description={equipament.DESCRIPTION}

                    />

                )
                : <></>}
            {isBranch === false ?
                type === "Equipment" && equipments !== undefined ?

                    equipments.map((equipament, index) =>
                        <Node
                            key={index}
                            title={`${equipament.Tag}-${equipament.DESCRIPTION}`}
                            changeDescription={(event) => childCall(event)}
                            equipments={undefined}
                            instruments={undefined}
                            HSE_Equipaments={undefined}
                            Subequipment={equipament.Subequipment.length === 0 ? undefined : equipament.Subequipment}
                            type={"childEquipament"}
                            closeFromParent={expanded}
                            id={equipament.UUID}
                            ref={addToRefArray}
                            level={equipament.HLEVEL}
                            isBranch={!hasSubEquipiment}
                            name={equipament.Tag}
                            description={equipament.DESCRIPTION}

                        />

                    )
                    : type === "HSE_Equipment" && HSE_Equipaments !== undefined ?
                        HSE_Equipaments.map((equipament, index) =>
                            <Node
                                key={index}
                                title={`${equipament.Tag}-${equipament.DESCRIPTION}`}
                                changeDescription={(event) => childCall(event)}
                                equipments={undefined}
                                instruments={undefined}
                                HSE_Equipaments={undefined}
                                Subequipment={equipament.Subequipment.length === 0 ? undefined : equipament.Subequipment}
                                type={"childHSE_Equipament"}
                                closeFromParent={expanded}
                                id={equipament.UUID}
                                ref={addToRefArray}
                                level={equipament.HLEVEL}
                                isBranch={!hasSubEquipiment}
                                name={equipament.Tag}
                                description={equipament.DESCRIPTION}
                            />
                        )
                        : type === "Instrument" && instruments !== undefined ?
                            instruments.map((equipament, index) =>
                                <Node
                                    key={index}
                                    title={`${equipament.Tag}-${equipament.DESCRIPTION}`}
                                    changeDescription={(event) => childCall(event)}
                                    equipments={undefined}
                                    instruments={undefined}
                                    HSE_Equipaments={undefined}
                                    Subequipment={equipament.Subequipment.length === 0 ? undefined : equipament.Subequipment}
                                    type={"childInstrument"}
                                    closeFromParent={expanded}
                                    id={equipament.UUID}
                                    ref={addToRefArray}
                                    level={equipament.HLEVEL}
                                    isBranch={!hasSubEquipiment}
                                    name={equipament.Tag}
                                    description={equipament.DESCRIPTION}
                                />
                            ) : <></>

                :
                subLevel.map((child, index) =>
                    <Node
                        key={index}
                        title={child}
                        changeDescription={(event) => childCall(event)}
                        equipments={child === "Equipment" ? equipments : []}
                        instruments={child === "Instrument" ? instruments : []}
                        HSE_Equipaments={child === "HSE_Equipment" ? HSE_Equipaments : []}
                        type={child}
                        closeFromParent={expanded}
                        id={index}
                        ref={addToRefArray}
                        level={"0"}
                        isBranch={false}
                        name={child}
                        description={""}
                    />
                )
            }
        </>

    );
}
)

export default Node