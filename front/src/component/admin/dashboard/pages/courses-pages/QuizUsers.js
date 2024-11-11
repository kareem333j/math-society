import { useContext, useEffect, useState } from "react";
import { adminCourseContext } from "../../../../../context/AdminCourseDataContext";
import axiosInstance from "../../../../../Axios";
import { enqueueSnackbar } from "notistack";
import LinearIndeterminate from "../../../../loading/loading1";
import { BsDatabaseFillX } from "react-icons/bs";
import { Link } from "react-router-dom";
import LoadingGradient from "../../../../loading/Loading2";


export const QuizUsers = (props) => {
    const [loading, setLoading] = useState(false);
    const course_id = props.course_id;
    const courseContext = useContext(adminCourseContext);
    const [subscribers, setScribers] = useState(null);

    // enqueueSnackbar
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosInstance
            .get(`admin/quizzes/${courseContext.course.session.id}/subscribers`)
            .then((response) => {
                setLoading(false);
                setScribers(response.data);
            }).catch((error) => {
                setLoading(false);
                props.close();
                handleClickVariant('error', 'حدث خطأ ما');
            });
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

    return (
        <div className='w-100 dialog-content session-forms'>
            <LinearIndeterminate load={loading} />
            <div className="container general-div-inputs ">
                <div className="title w-100 d-flex justify-content-center align-items-center text-center mb-3">جميع المشاركون بالإختبار</div>
                {
                    (subscribers === null) ?
                        <LoadingGradient />
                        :
                        <div className="area-table" dir="rtl">
                            {
                                (subscribers.length <= 0) ?
                                    <div style={{ 'minHeight': '20vh' }} className="w-100 d-flex justify-content-center align-items-center">
                                        <h3 style={{ 'color': 'var(--text-cyan-700)', 'fontSize': '1.5em' }}>لا يوجد اي مشاركون حتي الأن <BsDatabaseFillX style={{ 'marginLeft': '5px' }} /></h3>
                                    </div>
                                    :
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className='td-id'>#</th>
                                                <th className='head'><span>اسم المستخدم</span></th>
                                                <th className='head'><span>رقم الهاتف</span></th>
                                                <th className='head'><span> الزمن المستهلك</span></th>
                                                <th className='head'><span>الدرجة</span></th>
                                                <th className='head'><span>النقاط</span></th>
                                                <th className='head'><span>الحالة</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                subscribers.map((subscriber, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className='td-id'>{i + 1}</td>
                                                            <td>
                                                                <Link style={{ 'color': 'var(--red-light)' }} to={`/user/${subscriber.user_info.id}/profile`} target="_blank">
                                                                    {subscriber.user_info.name}
                                                                </Link>
                                                            </td>
                                                            <td>{subscriber.user_info.phone}</td>
                                                            <td>
                                                                <div className="d-flex gap-2 align-items-center">
                                                                    <span>{timeFormatter(subscriber.quiz_info.time_taken)}</span>
                                                                    <span style={{ 'color': 'var(--red-light)' }}>من</span>

                                                                    {
                                                                        (subscriber.time > 0) ?
                                                                            <span>timeFormatter(subscriber.time)</span>
                                                                            :
                                                                            <span className="d-flex align-items-center p-0 m-0" style={{'fontSize':'1.5em'}}>∞</span>
                                                                    }

                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <span>{subscriber.quiz_info.degree}</span>
                                                                    <span style={{ 'color': 'var(--red-light)' }}>من</span>
                                                                    <span>{subscriber.quiz_info.number_of_questions}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <span>{subscriber.quiz_info.points}</span>
                                                                    <span style={{ 'color': 'var(--red-light)' }}>من</span>
                                                                    <span>{subscriber.points}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {
                                                                    (subscriber.start === false && subscriber.done === true) ?
                                                                        <span dir="ltr" className='active'>تم التسليم</span>
                                                                        :
                                                                        (subscriber.start === true && subscriber.done === false) ?
                                                                            <span dir="ltr" className='not-active'>... لم يتم التسليم بعد</span>
                                                                            :
                                                                            <span dir="ltr" className='not-active'>غير معروف</span>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                            }

                        </div>
                }
            </div>
        </div>
    )
}