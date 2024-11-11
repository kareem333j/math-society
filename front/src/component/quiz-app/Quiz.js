import { FormControl, FormControlLabel, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import './quiz.css';
import { useEffect, useState } from 'react';
import q_img from '../../assets/images/q.png';
import axiosInstance from '../../Axios';
import LoadingGradient from '../loading/Loading2';
import Party1 from '../party/party1';
import { QuizResults } from './QuizResults';
import useLocalStorage from 'use-local-storage';
import { baseURLMediaTypeImage } from '../../Axios';
import CloseIcon from '@mui/icons-material/Close';

var timerConst = {}

function Quiz({ id, dataAuth, close_screen, full_screen }) {
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState({
        get_timer: true,
        set_timer: true,
        send_quiz: true,
        get_results: true,
    });
    const [quizLoading, setQuizLoading] = useState(true);
    const [quiz, setQuiz] = useState({});
    const [quizStart, setQuizStart] = useLocalStorage("quiz", {});
    const [quizEnd, setQuizEnd] = useState({});
    const [error, setError] = useState({
        catch: false,
        message: 'good connection'
    });
    const [quizResults, setQuizResults] = useState({
        is_exist: false,
        data: null,
    })

    const [full, setFull] = useState(false);

    // view image window state
    const [viewImageWindow, setViewImageWindow] = useState(false);
    const [dataImage, setDataImage] = useState({ src: '', alt: '' });

    const [stop, setStop] = useState({});
    const [startRendering, setStartRendering] = useState(false);

    // timer data
    const [quizTime, setQuizTime] = useState();
    const [quizTimeStorage, setQuizTimeStorage] = useLocalStorage('t', {});
    const [currentTimer, setCurrentTimer] = useLocalStorage("data", {});

    // see results 
    const [seeResults, setSeeResults] = useState(false);


    const handleRadioChange = (event) => {
        const currentQuestion = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        const choices_active = document.querySelectorAll(`#${currentQuestion.id} .choice-active`);
        if (choices_active) {
            [...choices_active].map((e) => {
                return e.classList.remove('choice-active');
            })
        }
        if (event.target.checked) {
            event.target.parentElement.parentElement.classList.add('choice-active');
        }
        setUserAnswers({
            ...userAnswers,

            [event.target.name]: parseInt(event.target.value),
        })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const radio_theme = {
        color: 'var(--radio-color) !important',
        '&.Mui-checked': {
            color: "#fff !important",
        },
    };

    function CustomRadio() {
        return <Radio sx={radio_theme} />
    }


    const timeFormatter = (seconds) => {
        let hours = parseInt((seconds / 60) / 60);
        let min = parseInt((seconds / 60) % 60);
        let sec = parseInt(seconds % 60);

        hours = (hours < 10) ? `0${hours}` : hours;
        min = (min < 10) ? `0${min}` : min;
        sec = (sec < 10) ? `0${sec}` : sec;

        return `${hours}:${min}:${sec}`
    }

    const ViewImageWindow = () => {
        if (viewImageWindow) {
            return (
                <div className='view-image-window d-flex justify-content-center align-items-center p-0 pt-5 m-0'>
                    <div className='close'>
                        <Tooltip title="غلق">
                            <IconButton
                                onClick={() => setViewImageWindow(false)}
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="edit"
                                className='custom-edit-button options-btn'
                            >
                                <CloseIcon size="large" />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <img className='w-100 img' src={dataImage.src} alt={dataImage.alt} />
                </div>
            )
        }
        return null;
    }

    useEffect(() => {
        setQuizResults(false);
        setError({ catch: false, message: 'good connection' });
        setLoading({ get_timer: true, set_timer: true, send_quiz: true, get_results: true });
        setQuizLoading(true);
        axiosInstance
            .get(`/quizzes/${id}`)
            .then((response) => {
                setError({ catch: false, message: 'good connection' });
                setQuizLoading(false);
                setQuiz(response.data)

                if (response.data.time <= 0) {
                    setQuizTime(28800);
                    setQuizTimeStorage({
                        ...quizTimeStorage,

                        [`quiz_${id}`]: 28800
                    });
                } else {
                    setQuizTime(response.data.time);
                    setQuizTimeStorage({
                        ...quizTimeStorage,

                        [`quiz_${id}`]: response.data.time
                    });
                }
            })
            .catch((error) => {
                setError({ catch: false, message: 'good connection' });
                setQuizLoading(false)
                if (error.response.status === 403) {
                    setError({ catch: true, message: error.response.data.detail });
                }
            })


        if (quizStart) {
            if (quizStart[`quiz_${id}`] === true) {
                setStartRendering(true);
            } else {
                setQuizStart({
                    ...quizStart,

                    [`quiz_${id}`]: false,
                })
                setStartRendering(true);
            }
        } else {
            setQuizStart({
                ...quizStart,

                [`quiz_${id}`]: false,
            })
            setStartRendering(true);
        }

        if (stop[`quiz_${id}`] !== true) {
            setStop({
                ...stop,

                [`quiz_${id}`]: false,
            })
        }

    }, [id]);

    useEffect(() => {
        if (quizStart) {
            if (quizStart[`quiz_${id}`] === true) {
                get_timer();
            }
        } else {
            setQuizStart({
                ...quizStart,

                [`quiz_${id}`]: false,
            })
            setStartRendering(true);
        }
    }, [quizStart, id]);



    useEffect(() => {
        if (currentTimer) {
            if (!currentTimer[`quiz_${id}`]) {
                setCurrentTimer({
                    ...currentTimer,

                    [`quiz_${id}`]: 0,
                });
            } else {
                if (quizTimeStorage[`quiz_${id}`] !== 0) {

                    setTimeout(() => {
                        if (currentTimer[`quiz_${id}`] < quizTimeStorage[`quiz_${id}`] && quizStart[`quiz_${id}`] === true && stop[`quiz_${id}`] === false) {
                            setCurrentTimer({
                                ...currentTimer,

                                [`quiz_${id}`]: currentTimer[`quiz_${id}`] + 1,
                            });

                            timerConst[`quiz_${id}`] = currentTimer[`quiz_${id}`]
                        }
                    }, 500);
                }

            }
        } else {
            setCurrentTimer({
                ...currentTimer,

                [`quiz_${id}`]: 0,
            });
        }
    }, [quizTimeStorage])

    const get_timer = () => {
        const timer_interval = setInterval(() => {
            if (stop === true || (stop === true && currentTimer[`quiz_${id}`] === quizTime)) {
                clearInterval(timer_interval);
            } else {
                axiosInstance
                    .get(`quizzes/${id}/get_timer`)
                    .then((response) => {
                        setLoading({ ...loading, get_timer: false });
                        if (response.data.start === true) {
                            if (quizTimeStorage[`quiz_${id}`] >= currentTimer[`quiz_${id}`]) {
                                set_timer(currentTimer[`quiz_${id}`], true);
                            } else {
                                set_timer(currentTimer[`quiz_${id}`], false);
                                clearInterval(timer_interval);
                            }
                        } else {
                            clearInterval(timer_interval);
                        }
                    }).catch((error) => {
                        setLoading({ ...loading, get_timer: false });
                        if (error.response.status === 404) {
                            set_timer(0, true);
                        }
                    });
            }

        }, 15000);
    }

    const set_timer = (value, start) => {
        axiosInstance
            .post(`quizzes/timer`, {
                'timer': timerConst[`quiz_${id}`],
                'quiz': id,
                'start': start
            }).then((response) => {
                setLoading({ ...loading, set_timer: false });
            }).catch((error) => {
                setLoading({ ...loading, set_timer: false });
                console.log(error);
            });
    }

    const sendQuiz = () => {
        setQuizStart({
            ...quizStart,

            [`quiz_${id}`]: false,
        })
        setStop({
            ...stop,

            [`quiz_${id}`]: false,
        })

        axiosInstance
            .post('quizzes/send', {
                'results': userAnswers,
                'timer': currentTimer[`quiz_${id}`],
                'quiz': id,
            })
            .then((response) => {
                setLoading({ ...loading, send_quiz: false });
                setQuizEnd({
                    ...quizEnd,

                    [`quiz_${id}`]: true
                });
            }).catch((error) => {
                setLoading({ ...loading, send_quiz: false });
            });
    }

    const getResults = () => {
        axiosInstance
            .get(`quizzes/${id}/results`)
            .then((response) => {
                setLoading({ ...loading, get_results: false });
                setQuizResults({
                    is_exist: true,
                    data: response.data,
                });
                setSeeResults(true);
            }).catch((error) => {
                setLoading({ ...loading, get_results: false });
                setQuizResults({
                    is_exist: true,
                    data: null,
                });
                if(error.response.status === 403){
                    setSeeResults(false);
                }
            });
    }

    const startQuiz = () => {
        setStartRendering(true);
        setQuizStart({
            ...quizStart,

            [`quiz_${id}`]: true,
        });
    }


    useEffect(() => {
        if (currentTimer[`quiz_${id}`] < quizTimeStorage[`quiz_${id}`] && quizStart[`quiz_${id}`] === true && stop[`quiz_${id}`] === false) {
            var renderTimeInterval = setInterval(() => {
                if (currentTimer[`quiz_${id}`] >= quizTimeStorage[`quiz_${id}`]) {
                    sendQuiz();
                }
                setCurrentTimer({
                    ...currentTimer,
                    [`quiz_${id}`]: currentTimer[`quiz_${id}`] + 1
                });
                timerConst[`quiz_${id}`] = currentTimer[`quiz_${id}`]
            }, 1000)
            return () => clearInterval(renderTimeInterval);
        } else {
            if (currentTimer[`quiz_${id}`] >= quizTimeStorage[`quiz_${id}`]) {
                setTimeout(() => {
                    sendQuiz();
                }, 500)
            }
        }
    }, [currentTimer[`quiz_${id}`], quizStart[`quiz_${id}`]]);



    const quizSection = () => {
        return (
            <>
                {(quiz.time <= 0) ? <></> : <div className='time-progress p-0'><h3>{timeFormatter(quizTime - currentTimer[`quiz_${id}`])}</h3></div>}
                <section className='quiz-sec position-relative pb-4'>
                    {
                        (full === false) ?
                            <button id='quiz-full' onClick={() => {
                                full_screen();
                                setFull(true);
                            }} className='fullscreen d-flex gap-2 justify-content-center align-items-center btn btn-primary'>
                                <svg width='17px' height='17px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#fff' d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z" /></svg>
                                تكبير
                            </button>
                            :
                            <button id='quiz-full' onClick={() => {
                                close_screen();
                                setFull(false);
                            }} className='fullscreen d-flex gap-2 justify-content-center align-items-center btn btn-danger'>
                                <svg width='17px' height='17px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#fff' d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z" /></svg>
                                تصغير
                            </button>
                    }
                    <form onSubmit={handleSubmit} className='quiz-form'>
                        <FormControl variant="standard">
                            {
                                quiz.questions.map((question, index) => {
                                    return (
                                        <div key={question.id} className='question w-100 d-flex flex-column mb-5' id={`q_${question.id}`}>
                                            <div className='title d-flex gap-2 align-items-center w-100 mb-2 flex-column'>
                                                <div className='d-flex w-100 justify-content-start align-items-center gap-2'>
                                                    <span className='q-num'>{index + 1}-</span>

                                                    <span className='q-title'>{question.title}</span>

                                                </div>
                                                {
                                                    (question.img != null) ? <div onClick={
                                                        () => {
                                                            setDataImage({ src: `${baseURLMediaTypeImage}${question.img}`, alt: question.title });
                                                            setViewImageWindow(true);
                                                        }
                                                    } className='w-90' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0', 'cursor':'pointer' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${question.img}`} alt='question-image' /></div> : ''
                                                }
                                            </div>
                                            <div className='choices-div'>
                                                <RadioGroup
                                                    aria-labelledby="demo-error-radios"
                                                    name={`${question.id}`}
                                                    defaultValue=''
                                                    onChange={handleRadioChange}
                                                    className='choices'
                                                >
                                                    {
                                                        question.choices.map((choice) => {
                                                            return (
                                                                <>
                                                                    <FormControlLabel key={choice.id} value={choice.id} control={CustomRadio()} label={
                                                                        <div className='d-flex gap-2 flex-column w-100'>
                                                                            {choice.choice}
                                                                            {
                                                                                (choice.img != null) ? <div onClick={
                                                                                    () => {
                                                                                        setDataImage({ src: `${baseURLMediaTypeImage}${choice.img}`, alt: choice.choice });
                                                                                        setViewImageWindow(true);
                                                                                    }
                                                                                }
                                                                                    className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                            }
                                                                        </div>
                                                                    } />

                                                                </>

                                                            )
                                                        })
                                                    }
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            <button onClick={sendQuiz} hover='إنهاء' className='finish-btn fw-bold w-100 border-0'>إنهاء</button>
                        </FormControl>
                    </form>

                </section>
            </>

        )
    }


    if (quizLoading === true) {
        return (
            <div className='w-100' style={{ 'height': '70vh' }}>
                <LoadingGradient />
            </div>
        )
    } else {
        if (quizResults.is_exist === true) {
            if(seeResults === true){
                return <QuizResults quiz_id={id} results={quizResults.data} full_screen={full_screen} close_screen={close_screen} />
            }else{
                return (
                    <section className='w-100 d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '40vh' }}>
                        <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>لم يتم الإعلان عن النتيحة بعد...</h3>
                    </section>
                )
            }
        } else {
            if (error.catch === true) {
                return (
                    <section className='w-100 d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '40vh' }}>
                        <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>{error.message}..!</h3>
                        <button onClick={getResults} hover='النتيجة' style={{ 'width': '200px' }} className='finish-btn danger fw-bold border-0 mt-2'>عرض النتائج</button>
                    </section>

                )
            }
            else {
                if (quizEnd[`quiz_${id}`] === true) {
                    return (
                        <section className='w-100 fw-bold d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '50vh' }}>
                            <Party1 />
                            <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>لقد تم إرسال إجاباتك بنجاح ..!</h3>
                            <button onClick={getResults} hover='النتيجة' style={{ 'width': '200px' }} className='finish-btn fw-bold border-0 mt-2'>عرض النتائج</button>
                            <Party1 />
                        </section>
                    )
                }
                else {

                    return (
                        <>
                            <ViewImageWindow />
                            <div className='d-flex justify-content-center align-items-center w-100 flex-column gap-3'>
                                <div dir='rtl' className='quiz-info row'>
                                    <div className='col-lg-6 name d-flex gap-2 p-2'>
                                        <span className='title fw-bold'>الأختبار :</span>
                                        <span className='res'>{quiz.title}</span>
                                    </div>
                                    <div className='col-lg-6 num-of-ques d-flex gap-2 p-2'>
                                        <span className='title fw-bold'>عدد الأسئلة :</span>
                                        <span className='res'>{quiz.questions.length}</span>
                                    </div>
                                    <div className='col-lg-6 time d-flex gap-2 p-2'>
                                        <span className='title fw-bold'>الزمن :</span>
                                        {
                                            (quiz.time <= 0) ? <span dir='ltr' style={{ 'fontSize': '1.7em' }} className='res d-flex align-items-center'>∞</span>
                                                :
                                                <span dir='ltr' className='res'>{timeFormatter(quiz.time)}</span>
                                        }
                                    </div>
                                    <div className='col-lg-6 points d-flex gap-2 p-2'>
                                        <span className='title fw-bold'>النقاط :</span>
                                        <span className='res'>{quiz.points}</span>
                                    </div>
                                </div>
                                {
                                    (quiz.questions.length !== 0) ?
                                        (startRendering === true) ? (quizStart) ? (quizStart[`quiz_${id}`] !== true) ?
                                            <section className='w-100 d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '40vh' }}>
                                                <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>عندما تكون جاهز اضغط علي زر بدأ لتبدأ الأمتحان..!</h3>
                                                <button onClick={startQuiz} hover='بدء🔥' style={{ 'width': '200px' }} className='finish-btn danger fw-bold border-0 mt-2'>ابدأ الأن</button>
                                            </section>
                                            :
                                            quizSection()
                                            :
                                            <section className='w-100 d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '40vh' }}>
                                                <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>عندما تكون جاهز اضغط علي زر بدأ لتبدأ الأمتحان..!</h3>
                                                <button onClick={startQuiz} hover='بدء🔥' style={{ 'width': '200px' }} className='finish-btn danger fw-bold border-0 mt-2'>ابدأ الأن</button>
                                            </section>
                                            : <></>
                                        :
                                        <section className='w-100 d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '40vh' }}>
                                            <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>لم يتم إضافة اي سؤال الي هذا الإختبار حتي الأن..!</h3>
                                        </section>
                                }

                            </div>
                        </>
                    )

                }
            }
        }
    }
}

export default Quiz;