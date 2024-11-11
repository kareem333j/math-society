import { Button, FormControl, FormControlLabel, RadioGroup, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance, { baseURLMediaTypeImage } from "../../Axios";
import LoadingGradient from "../loading/Loading2";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';


export const QuizResults = (props) => {
    const quiz_id = props.quiz_id
    const [quiz, setQuiz] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ catch: false, message: '' });
    const results = props.results;
    const [statistics, setStatistics] = useState({
        degree: 0,
        gpa: 0,
        right_answers: 0,
        wrong_answers: 0
    });
    const [full, setFull] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get(`quizzes/${quiz_id}/revision`)
            .then((response) => {
                setQuiz(response.data);
                setLoading(false);
                setStatistics({
                    degree: results.results.degree_percentage,
                    gpa: results.results.gpa,
                    right_answers: results.results.degree_percentage,
                    wrong_answers: 100 - results.results.degree_percentage
                })
            }).catch((error) => {
                setLoading(false);
                if (error.response.status === 403) {
                    setError({
                        catch: true,
                        message: error.response.data.detail
                    });
                } else {
                    setError({
                        catch: true,
                        message: '...!some thing went wrong'
                    });
                }
            });
    }, []);


    const timeFormatter = (seconds) => {
        let hours = parseInt((seconds / 60) / 60);
        let min = parseInt((seconds / 60) % 60);
        let sec = parseInt(seconds % 60);

        hours = (hours < 10) ? `0${hours}` : hours;
        min = (min < 10) ? `0${min}` : min;
        sec = (sec < 10) ? `0${sec}` : sec;

        return `${hours}:${min}:${sec}`
    }


    if (loading === true) {
        return (
            <div className='w-100' style={{ 'height': '70vh' }}>
                <LoadingGradient />
            </div>
        )
    } else {
        if (error.catch === true) {
            return (
                <section className='w-100 d-flex flex-column justify-content-center align-items-center p-5' style={{ 'minHeight': '40vh' }}>
                    <h3 className='text-center fw-bold mb-4' style={{ 'fontSize': '1.6em', 'color': 'var(--text-cyan-700)' }}>{error.message}</h3>
                </section>
            )
        } else {
            return (
                <div className='d-flex justify-content-center align-items-center w-100 flex-column gap-3 mt-1'>
                    <div className="w-100 d-flex align-items-center mb-1 fw-bold gap-2 justify-content-between" dir="rtl">
                        <span style={{ 'fontSize': '1.5em', 'color': 'var(--color-default2)' }}>تحليل رقمي <ExpandMoreIcon /></span>
                        {
                            (full === false) ?
                                <button onClick={() => {
                                    props.full_screen();
                                    setFull(true);
                                }} className='fullscreen d-flex gap-2 justify-content-center align-items-center btn btn-primary'>
                                    <svg width='17px' height='17px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#fff' d="M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z" /></svg>
                                    تكبير
                                </button>
                                :
                                <button onClick={() => {
                                    props.close_screen();
                                    setFull(false);
                                }} className='fullscreen d-flex gap-2 justify-content-center align-items-center btn btn-danger'>
                                    <svg width='17px' height='17px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#fff' d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z" /></svg>
                                    تصغير
                                </button>
                        }
                    </div>
                    <div dir='rtl' className='quiz-info row'>
                        <div className='col-lg-6 name d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>الأختبار :</span>
                            <span className='res d-flex align-items-center'>{quiz.title}</span>
                        </div>
                        <div className='col-lg-6 points d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>الدرجة :</span>
                            <span className='res d-flex align-items-center'>{results.results.degree}</span>
                            <span className="title d-flex align-items-center">من</span>
                            <span className='res d-flex align-items-center'>{results.results.number_of_questions}</span>
                        </div>
                        <div className='col-lg-6 points d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>النقاط (GPA) :</span>
                            <span className='res d-flex align-items-center'>{results.results.points}</span>
                            <span className="title d-flex align-items-center">من</span>
                            <span className='res d-flex align-items-center'>{quiz.points}</span>
                        </div>
                        <div className='col-lg-6 time d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>الزمن المستهلك :</span>
                            <span dir='ltr' className='res d-flex align-items-center'>{timeFormatter(results.results.time_taken)}</span>
                            <span className="title d-flex align-items-center">من</span>
                            {
                                (quiz.time <= 0) ? <span dir='ltr' style={{ 'fontSize': '1.7em' }} className='res d-flex align-items-center'>∞</span>
                                    :
                                    <span dir='ltr' className='res'>{timeFormatter(quiz.time)}</span>
                            }
                        </div>
                        <div className='col-lg-6 num-of-ques d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>عدد الأسئلة :</span>
                            <span className='res d-flex align-items-center'>{quiz.questions.length}</span>
                        </div>
                        <div className='col-lg-6 num-of-ques d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>عدد الأسئلة الصحيحة :</span>
                            <span className='res d-flex align-items-center'>{results.results.degree}</span>
                        </div>
                        <div className='col-lg-6 num-of-ques d-flex gap-2 p-2'>
                            <span className='title fw-bold d-flex align-items-center'>عدد الأسئلة الخطأ :</span>
                            <span className='res d-flex align-items-center'>{results.results.number_of_questions - results.results.degree}</span>
                        </div>
                    </div>
                    <div className="w-100 d-flex align-items-center mt-4 mb-1 fw-bold gap-2" dir="rtl" style={{ 'fontSize': '1.5em', 'color': 'var(--color-default2)' }}>
                        تحليل نسبي <ExpandMoreIcon />
                    </div>
                    <div dir='rtl' className='quiz-info statistics d-flex flex-column w-100 p-3 pt-5'>
                        <div className="statistic row w-100 d-flex align-items-center mb-5">
                            <div className="name col-lg-3 col-md-3 col-sm-3 col-5" style={{ 'fontSize': '1.2em', 'color': 'var(--color-default2)' }}>النسبة </div>
                            <div dir="ltr" className="progress col-lg-9 col-md-9 col-sm-9 col-7 p-0">
                                <div className="progress-bar" style={{ 'width': `${statistics.degree}%`, 'backgroundColor': (statistics.degree < 50) ? 'red' : (statistics.degree === 50) ? 'var(--title-background)' : 'var(--green-success)' }}></div>
                                <div className="counter fw-bold" style={{ 'left': `calc(${statistics.degree}% - 25px)` }}>{statistics.degree}%</div>
                            </div>
                        </div>
                        <div className="statistic row w-100 d-flex align-items-center mb-5">
                            <div className="name col-lg-3 col-md-3 col-sm-3 col-5" style={{ 'fontSize': '1.2em', 'color': 'var(--color-default2)' }}>النقاط (GPA) </div>
                            <div dir="ltr" className="progress col-lg-9 col-md-9 col-sm-9 col-7 p-0">
                                <div className="progress-bar" style={{ 'width': `${statistics.gpa}%`, 'backgroundColor': (statistics.gpa < 50) ? 'red' : (statistics.gpa === 50) ? 'var(--title-background)' : 'var(--green-success)' }}></div>
                                <div className="counter fw-bold" style={{ 'left': `calc(${statistics.gpa}% - 25px)` }}>{statistics.gpa}%</div>
                            </div>
                        </div>
                        <div className="statistic row w-100 d-flex align-items-center mb-5">
                            <div className="name col-lg-3 col-md-3 col-sm-3 col-5" style={{ 'fontSize': '1.2em', 'color': 'var(--color-default2)' }}>الإجابات الصحيحة </div>
                            <div dir="ltr" className="progress col-lg-9 col-md-9 col-sm-9 col-7 p-0">
                                <div className="progress-bar" style={{ 'width': `${statistics.right_answers}%`, 'backgroundColor': (statistics.right_answers < 50) ? 'red' : (statistics.right_answers === 50) ? 'var(--title-background)' : 'var(--green-success)' }}></div>
                                <div className="counter fw-bold" style={{ 'left': `calc(${statistics.right_answers}% - 25px)` }}>{statistics.right_answers}%</div>
                            </div>
                        </div>
                        <div className="statistic row w-100 d-flex align-items-center mb-5">
                            <div className="name col-lg-3 col-md-3 col-sm-3 col-5" style={{ 'fontSize': '1.2em', 'color': 'var(--color-default2)' }}>الإجابات الخطأ </div>
                            <div dir="ltr" className="progress col-lg-9 col-md-9 col-sm-9 col-7 p-0">
                                <div className="progress-bar" style={{ 'width': `${statistics.wrong_answers}%`, 'backgroundColor': (statistics.wrong_answers < 50) ? 'red' : (statistics.wrong_answers === 50) ? 'var(--title-background)' : 'var(--green-success)' }}></div>
                                <div className="counter fw-bold" style={{ 'left': `calc(${statistics.wrong_answers}% - 25px)` }}>{statistics.wrong_answers}%</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 d-flex align-items-center mt-4 mb-1 justify-content-between" dir="rtl">
                        <span className="d-flex align-items-center gap-2 fw-bold" style={{ 'fontSize': '1.5em', 'color': 'var(--color-default2)' }}>
                            الإختبار بعد التصحيح <ExpandMoreIcon />
                        </span>
                        {
                            (quiz.notes != null) ?
                                <a style={{ 'fontSize': '1em', 'backgroundColor': 'var(--red-light)' }} className="d-flex align-items-center gap-2 text-light btn" href={quiz.notes} target="blank">
                                    <InfoIcon /> ملاحظات
                                </a>
                                :
                                <></>
                        }
                    </div>
                    <section className='quiz-sec'>
                        <form>
                            <FormControl variant="standard">
                                {
                                    quiz.questions.map((question, index) => {
                                        return (
                                            <div key={question.id} className='question w-100 d-flex flex-column mb-5' id={`q_${question.id}`}>
                                                <div className='title d-flex gap-2 align-items-center w-100 mb-2 flex-column'>
                                                    <div className='d-flex w-100 justify-content-start align-items-center gap-2'>
                                                        <span className='q-num'>{index + 1}-</span>
                                                        <span className='q-title d-flex gap-2 align-items-center'>
                                                            {question.title}

                                                        </span>
                                                        {
                                                            (results.results.answers[index] === undefined) ? <span className="text-danger" style={{ 'fontSize': '1em' }}><>( لم تقم بالإجابة علي هذا السؤال )</></span> :
                                                                (results.results.answers[index].value === 0) ? <span className="text-danger" style={{ 'fontSize': '1em' }}><>( لم تقم بالإجابة علي هذا السؤال )</></span> : <></>
                                                        }
                                                    </div>
                                                    {
                                                        (question.img != null) ? <div className='w-90' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${question.img}`} alt='question-image' /></div> : ''
                                                    }
                                                </div>
                                                <div className='choices-div'>
                                                    <RadioGroup
                                                        aria-labelledby="demo-error-radios"
                                                        name={`${question.id}`}
                                                        defaultValue=''
                                                        className='choices'
                                                    >
                                                        {

                                                            question.choices.map((choice) => {
                                                                if (results.results.answers[index] === undefined) {
                                                                    if (choice.is_true) {
                                                                        return (
                                                                            <FormControlLabel className="right-choice revision" key={choice.id} value={choice.id} control={<TaskAltIcon sx={{ 'marginLeft': '10px' }} />} label={
                                                                                <div className='d-flex gap-2 flex-column w-100'>
                                                                                    {choice.choice}
                                                                                    {
                                                                                        (choice.img != null) ? <div className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                                    }
                                                                                </div>
                                                                            } />
                                                                        )
                                                                    }
                                                                    return (
                                                                        <FormControlLabel className="revision" sx={{ 'paddingRight': '15px !important' }} key={choice.id} value={choice.id} control={<></>} label={
                                                                            <div className='d-flex gap-2 flex-column w-100'>
                                                                                {choice.choice}
                                                                                {
                                                                                    (choice.img != null) ? <div className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                                }
                                                                            </div>
                                                                        } />
                                                                    )
                                                                } else {
                                                                    if (results.results.answers[index].value === choice.id) {
                                                                        if (results.results.answers[index].is_true === true) {
                                                                            return (
                                                                                <FormControlLabel className="right-choice revision" key={choice.id} value={choice.id} control={<TaskAltIcon sx={{ 'marginLeft': '10px' }} />} label={
                                                                                    <div className='d-flex gap-2 flex-column w-100'>
                                                                                        {choice.choice}
                                                                                        {
                                                                                            (choice.img != null) ? <div className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                                        }
                                                                                    </div>
                                                                                } />
                                                                            )
                                                                        }
                                                                        return (
                                                                            <FormControlLabel className="wrong-choice revision" key={choice.id} value={choice.id} control={<HighlightOffIcon sx={{ 'marginLeft': '10px' }} />} label={
                                                                                <div className='d-flex gap-2 flex-column w-100'>
                                                                                    {choice.choice}
                                                                                    {
                                                                                        (choice.img != null) ? <div className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                                    }
                                                                                </div>
                                                                            } />
                                                                        )
                                                                    }
                                                                    else {
                                                                        if (choice.is_true) {
                                                                            return (
                                                                                <FormControlLabel className="right-choice revision" key={choice.id} value={choice.id} control={<TaskAltIcon sx={{ 'marginLeft': '10px' }} />} label={
                                                                                    <div className='d-flex gap-2 flex-column w-100'>
                                                                                        {choice.choice}
                                                                                        {
                                                                                            (choice.img != null) ? <div className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                                        }
                                                                                    </div>
                                                                                } />
                                                                            )
                                                                        }
                                                                        return (
                                                                            <FormControlLabel className="revision" sx={{ 'paddingRight': '15px !important' }} key={choice.id} value={choice.id} control={<></>} label={
                                                                                <div className='d-flex gap-2 flex-column w-100'>
                                                                                    {choice.choice}
                                                                                    {
                                                                                        (choice.img != null) ? <div className='w-100' style={{ 'paddingRight': '0px', 'width': '95%', 'overflow': 'hidden', 'margin': '0' }}><img className='w-100 img' src={`${baseURLMediaTypeImage}${choice.img}`} alt='question-image' /></div> : ''
                                                                                    }
                                                                                </div>
                                                                            } />
                                                                        )
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </FormControl>
                        </form>

                    </section>
                </div>
            )
        }
    }
}