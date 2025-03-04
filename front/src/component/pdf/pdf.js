// pdf worker
import { Worker } from '@react-pdf-viewer/core';
// Import the main component
import { Viewer } from '@react-pdf-viewer/core';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

import { baseURLMedia } from '../../Axios'; 

import './pdf.css'
import { useState } from 'react';

export const PDF = (props) => {
    const [full, setFull] = useState(false);

    return (
        <div className='pdf-div pb-3'>
            <div className='options d-flex gap-2 justify-content-center align-items-center'>
                <span style={{ 'fontSize': '1.1em', 'color': 'var(--color-default2)' }}>اذا كنت تريد رؤية الملف بشكل افضل </span>
                <a className='btn btn-danger fw-bold' target="_blank" rel="noopener noreferrer" href={`${props.path}`}>اضغط هنا</a>
            </div>
            <Worker id='worker' workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                {
                    (full === false) ?
                        <button id='fullscreen-btn' onClick={() => {
                            setFull(props.full_screen());
                        }} className='fullscreen d-flex gap-2 justify-content-center align-items-center btn btn-primary position-absolute'>
                            <svg width='17px' height='17px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#fff' d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z" /></svg>
                            تكبير
                        </button>
                        :
                        <button id='fullscreen-btn' onClick={() => {
                            setFull(props.close_screen());
                        }} className='fullscreen d-flex gap-2 justify-content-center align-items-center btn btn-danger position-absolute'>
                            <svg width='17px' height='17px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#fff' d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z" /></svg>
                            تصغير
                        </button>
                }
                <Viewer fileUrl={`${props.path}`} />;
            </Worker>
        </div>
    )
}