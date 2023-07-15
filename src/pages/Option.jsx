
import React, { useContext, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import '../style/pages/Option.scss';

import GlobalContext from '../context/globalContext';

function Option() {
    const { logged, updateLogged } = useContext(GlobalContext)
   
    useEffect(() => {
        console.log(logged)
    },[logged])
    return (
        <div className='option-container'>
            <h1>{logged ? "Admin" : "User"}</h1>
            <Button onClick={() => updateLogged(true)} variant='primary'>Admin</Button>{' '}
            <Button onClick={() => updateLogged(false)} variant='secondary'>User</Button>
        </div>
    )
}

export default Option