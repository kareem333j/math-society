import './course-view.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import QuizIcon from '@mui/icons-material/Quiz';
import TypeVideo from './course-types/TypeVideo';
import ReactDOM from 'react-dom/client';
import { PDF } from '../../pdf/pdf';
import Quiz from '../../quiz-app/Quiz';
import { Checkbox } from '@mui/material';
import axiosInstance from '../../../Axios';
import LinearIndeterminate from '../../loading/loading1';


const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
    },
    'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
        ...theme.applyStyles('dark', {
            backgroundColor: '#30404d',
        }),
    },
    'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(206,217,224,.5)',
        ...theme.applyStyles('dark', {
            background: 'rgba(57,75,89,.5)',
        }),
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
        backgroundColor: '#394b59',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
    }),
}));

const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: '#106ba3',
    },
});

function BpCheckbox(props) {
    return (
        <Checkbox
            sx={{ '&:hover': { bgcolor: 'transparent' } }}
            // disableRipple
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
            {...props}
        />
    );
}

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
})
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function Playlist(props) {
    const [expanded, setExpanded] = React.useState('panel1');
    const [courseContent, setCourseContent] = React.useState(props.data);
    const courseId = props.courseId;

    const contentSec = React.useRef();
    const contentRef = React.useRef();
    const lecRef = React.useRef();
    let refs = React.useRef([React.createRef(), React.createRef()]);
    const [currentSessionId, setCurrentSessionId] = React.useState(0);
    const [rootExist, setRootExist] = React.useState(false);
    const [contentRoot, setContentRoot] = React.useState(null);


    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isPageLoaded, setIsPageLoaded] = React.useState(false); //this helps

    const [loadTop, setLoadTop] = React.useState(false);

    // sessions progress
    const [getSessionsProgress, setGetSessionsProgress] = React.useState(null);
    const [loadSessions, setLoadSessions] = React.useState(true);

    const handleFullScreen = () => {
        let element = document.getElementById('content-root');

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

        return true;
    }

    const handleCloseScreen = () => {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msExitFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            return false;
        }
        return false;
    }

    const getCourseContent = () => {
        setLoadTop(true);
        axiosInstance
            .get(`courses/${courseId}/lectures`)
            .then((response) => {
                setCourseContent(response.data);
                setLoadTop(false);
            }).catch((error) => {
                setLoadTop(false);
            });
    }

    const getSessionsUpdate = () => {
        setLoadTop(true);
        setLoadSessions(true);
        axiosInstance
            .get(`course/${courseId}/sessions`)
            .then((response) => {
                // setCourseContent(response.data);
                setLoadSessions(false);
                setGetSessionsProgress(response.data);
                setLoadTop(false);
            }).catch((error) => {
                setLoadSessions(false);
                setLoadTop(false);
            });
    }



    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const renderSession = (session, lecIndex, SessionIndex) => {
        if (isPageLoaded) {
            if (rootExist === false) {
                setContentRoot(ReactDOM.createRoot(document.getElementById('content-root')));
                setRootExist(true);
            }
            if (rootExist === true) {
                if (currentSessionId !== `${lecIndex}${SessionIndex}`) {
                    if (session.type === 'video') {
                        contentRoot.render(
                            <>
                                <TypeVideo videoData={session} dataAuth={props.dataAuth} />
                            </>
                        )
                    } else if (session.type === 'document') {
                        contentRoot.render(
                            <>
                                <PDF path={session.document} full_screen={handleFullScreen} close_screen={handleCloseScreen} />
                            </>

                        )
                    }
                    else if (session.type === 'quiz') {
                        contentRoot.render(
                            <>
                                <Quiz id={session.id} dataAuth={props.dataAuth} full_screen={handleFullScreen} close_screen={handleCloseScreen} />
                            </>
                        )
                    }
                    setCurrentSessionId(`${lecIndex}${SessionIndex}`);
                }
            }
        }
    }

    React.useEffect(() => {
        setIsLoaded(true);
        document.addEventListener('keyup', (event) => {
            navigator.clipboard.writeText('');
            contentSec.current.innerHTML = '';
            alert('Screenshots Disabled -_-');
        });
        
        const preventKeys = (e) => {
            if (e.ctrlKey && (e.key === 'I' || e.key === 'S' || e.key === 'U')) {
                e.preventDefault();
            }
        };
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('keydown', preventKeys);
        return () => {
            document.removeEventListener('contextmenu', (e) => e.preventDefault());
            document.removeEventListener('keydown', preventKeys);
        };
    }, []);
    React.useEffect(() => {
        if (isLoaded) {
            setIsPageLoaded(true);
        }
    }, [isLoaded]);
    React.useEffect(() => {
        if (isPageLoaded) {
            getSessionsUpdate();
            if (refs.current !== undefined) {
                if (refs.current[0].current !== undefined && refs.current[0].current != null) {
                    refs.current[0].current.click();
                    setTimeout(() => {
                        refs.current[0].current.click();
                    }, 1000);
                }
            }
        }
    }, [isPageLoaded]);

    // disable context menu
    // React.useEffect(() => {
    //     if (contentRef.current !== undefined) {
    //         contentRef.current.addEventListener('contextmenu', event => event.preventDefault());
    //     }
    // }, [contentRef]);
    // React.useEffect(() => {
    //     if (contentSec.current !== undefined) {
    //         contentSec.current.addEventListener('contextmenu', event => event.preventDefault());
    //     }
    // }, [contentSec]);



    const escFunction = React.useCallback((event) => {
        if (event.key === "Escape") {
            // setFull(true);
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener('keydown', escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handelSessionDone = (e, id, type) => {
        updateSession(id, type, e.target.checked);
    }

    const updateSession = (id, type, value) => {
        setLoadTop(true);
        axiosInstance
            .post(`session/done`, {
                type: type,
                result: value,
                id: id,
                user: props.dataAuth.profile.id,
                course: courseId
            }).then((response) => {
                setLoadTop(false);
                getSessionsUpdate();
                // getCourseContent();
            }).catch((error) => {
                setLoadTop(false);
            });
    };

    const renderSessionProgress = (data_session, done, not_done) => {
        if (getSessionsProgress != null) {
            for (let i = 0; i < getSessionsProgress.length; i++) {
                if (getSessionsProgress[i].session_id === data_session.id && getSessionsProgress[i].type === data_session.type && getSessionsProgress[i].done === true) {
                    return done;
                }
            }
        }
        return not_done
    }

    return (
        <section className="f-sec" ref={contentSec}>
            <LinearIndeterminate load={loadTop} />
            <div className="main row" style={{ 'padding': '10px' }}>
                <div dir='rtl' ref={contentRef} id='content-root' style={{ 'minHeight': '50vh' }} className="content-area col-lg-9 py-2">
                </div>
                <div className="playlist col-lg-3">
                    <div ref={lecRef}>
                        {
                            (courseContent).map((lecture, lecIndex) => {
                                return (
                                    <Accordion dir='rtl' defaultExpanded={(lecIndex === 0) ? true : false} key={lecture.id} onChange={handleChange(`panel${lecture.id}`)}>
                                        <AccordionSummary aria-controls={`panel${lecture.id}d-content`} id={`panel${lecture.id}d-header`}>
                                            <div className='d-flex flex-column me-3 accordion-title'>
                                                <span className='title'>{lecture.title}</span>
                                                <span className='description'>{lecture.description}</span>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className='d-flex flex-column lec-content'>
                                                {
                                                    lecture.content.map((session, SessionIndex) => {
                                                        return (
                                                            <div ref={refs.current[lecIndex + SessionIndex]}
                                                                className={`session d-flex align-items-center justify-content-between ${renderSessionProgress(session, 'done', '')}`} key={SessionIndex} style={{ 'zIndex': '5' }} onClick={(e) => {
                                                                    [...document.querySelectorAll('.session')].map((e) => {
                                                                        e.classList.remove('active');
                                                                    })
                                                                    e.target.classList.add('active');
                                                                    e.target.parentElement.parentElement.classList.add('active');
                                                                    e.target.parentElement.classList.add('active');
                                                                    e.target.parentElement.parentElement.parentElement.classList.add('active');
                                                                    renderSession(session, lecIndex, SessionIndex);

                                                                }}>
                                                                <span>
                                                                    {
                                                                        (session.type === 'video') ?
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" /></svg>
                                                                            :
                                                                            (session.type === 'document') ?
                                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                                                                :
                                                                                (session.type === 'quiz') ?
                                                                                    <QuizIcon />
                                                                                    :
                                                                                    <></>
                                                                    }
                                                                    <span className='ms-3' style={{ 'fontSize': '1.1em', 'zIndex': '0 !important' }}>
                                                                        {session.title}
                                                                    </span>
                                                                    <span style={{ 'zIndex': '0 !important' }}>
                                                                        {
                                                                            (session.type === 'video') ?
                                                                                '( فيديو )'
                                                                                :
                                                                                (session.type === 'document') ?
                                                                                    '( pdf )'
                                                                                    :
                                                                                    (session.type === 'quiz') ?
                                                                                        '( اختبار الكتروني )'
                                                                                        :
                                                                                        <></>
                                                                        }
                                                                    </span>
                                                                </span>
                                                                <span className='no-back'><BpCheckbox onClick={(e) => { handelSessionDone(e, session.id, session.type) }} checked={renderSessionProgress(session, true, false)} /></span>
                                                            </div>
                                                        )

                                                    })


                                                }
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })

                        }
                    </div>
                </div>
            </div>
        </section>
    );
}


export default Playlist;