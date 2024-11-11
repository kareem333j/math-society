import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './loading.css';

export default function LinearIndeterminate(props) {
    if(props.load === false){
        return(
            <></>
        )
    }
    return (
        <>
            <div className="loading1">
                <Box className='load' sx={{ width: '100%' }}>
                    <LinearProgress color="secondary" />
                </Box>
            </div>

        </>
    );
}