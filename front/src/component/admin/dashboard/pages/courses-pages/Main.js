import { forwardRef, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axiosInstance from "../../../../../Axios";
import LoadingGradient from "../../../../loading/Loading2";
import '../shared.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogScreen from "../../inherit/Dialog";
import { AddLectureForm } from "./AddLecture";
import { AddSessionForm } from "./AddSession";
import { adminCourseContext } from "../../../../../context/AdminCourseDataContext";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { enqueueSnackbar } from "notistack";
import { EditLectureForm } from "./EditLecture";
import { EditSession } from "./EditSession";
import { Link } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import { QuizUsers } from "./QuizUsers";
import { BsDatabaseFillX } from "react-icons/bs";




export default function CourseMainPageForAdmin(props) {
    const params = useParams();
    const course_id = params.course_id;
    const [loading, setLoading] = useState(true);
    const course = useContext(adminCourseContext);

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
        get_course();
    }, [course_id])

    const dateFormatter = (value) => {
        let date = new Date(value);

        let newDate =
            new Intl.DateTimeFormat('ar-GB', {
                dateStyle: 'full',
                // timeStyle: 'short',
                timeZone: 'Africa/Cairo',
            }).format(date)


        return newDate
    }

    const get_course = () => {
        setLoading(true);
        axiosInstance
            .get(`admin/courses/course/${course_id}`)
            .then((response) => {
                setLoading(false);
                course.setCourse(response.data);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
    }

    const handleDeleteBtn = (props) => {
        withReactContent(Swal).fire({
            title: "! حذف ",
            text: props.msg,
            icon: "question",
            cancelButtonText: "إلغاء",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم, حذف",
        }).then((response) => {
            if (response.isConfirmed) {
                if (props.type === 'lecture') {
                    axiosInstance
                        .delete(`admin/courses/lectures/${props.id}/delete`)
                        .then(() => {
                            handleClickVariant('success', 'تم حذف المحاضرة بنجاح');
                            get_course();
                        }).catch(() => {
                            handleClickVariant('error', 'لقد حدث خطأ');
                        });
                }
                if (props.type === 'session') {
                    axiosInstance
                        .delete(`admin/courses/lectures/sessions/${props.sessionType}/${props.id}/delete`)
                        .then(() => {
                            handleClickVariant('success', 'تم حذف الحصة بنجاح');
                            get_course();
                        }).catch(() => {
                            handleClickVariant('error', 'لقد حدث خطأ');
                        });
                }
            }
        });
    }

    // DialogScreen state
    const [openAddSession, setOpenAddSession] = useState(false);
    const [openEditSession, setOpenEditSession] = useState(false);

    const [openAddLecture, setOpenAddLecture] = useState(false);
    const [openEditLecture, setOpenEditLecture] = useState(false);

    const [openQuizUser,setOpenQuizUser] = useState(false);

    const handleClickOpen = (type) => {
        if (type === 'add_session') {
            setOpenAddSession(true);
        }
        else if (type === 'edit_session') {
            setOpenEditSession(true);
        }
        else if (type === 'add_lecture') {
            setOpenAddLecture(true);
        }
        else if (type === 'edit_lecture') {
            setOpenEditLecture(true);
        }
        else if (type === 'quiz_users') {
            setOpenQuizUser(true);
        }
    };


    if (loading === true) {
        return (
            <LoadingGradient />
        )
    } else {
        return (
            <div className="course-info-admin py-4 w-100 overflow-hidden mb-5">
                <>
                    <DialogScreen course_id={course_id} close_title='إضافة حصة' data_theme={props.data_theme} open={openAddSession} setOpen={setOpenAddSession} component={AddSessionForm} />
                    <DialogScreen course_id={course_id} close_title='تعديل الحصة' data_theme={props.data_theme} open={openEditSession} setOpen={setOpenEditSession} component={EditSession} />
                    <DialogScreen course_id={course_id} close_title='جميع المشاركون بالإختبار' data_theme={props.data_theme} open={openQuizUser} setOpen={setOpenQuizUser} component={QuizUsers} />
                    <DialogScreen course_id={course_id} close_title='إضافة محاضرة' data_theme={props.data_theme} open={openAddLecture} setOpen={setOpenAddLecture} component={AddLectureForm} />
                    <DialogScreen course_id={course_id} close_title={`تعديل المحاضرة`} data_theme={props.data_theme} open={openEditLecture} setOpen={setOpenEditLecture} component={EditLectureForm} />
                </>
                <h3 className="title w-100 fw-bold mb-4"> تفاصيل <ArrowLeftIcon size='large' />{course.course.title}</h3>
                <hr />
                <div className="w-100 pt-4">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <h4 className="data-title">المحاضرات <ArrowDropDownIcon /></h4>
                        <Button onClick={(e) => handleClickOpen('add_lecture')} className='options-btn d-flex justify-content-center align-items-center' dir='ltr' id='admin-main-btn1' variant="contained" sx={{ 'fontWeight': 'bold' }} size='medium'>
                            <AddIcon />
                        </Button>
                    </div>
                    <div className="area-table w-100">
                        {
                            course.course.lectures.length <= 0 ?
                                <div style={{ 'minHeight': '20vh' }} className="w-100 d-flex justify-content-center align-items-center">
                                    <h3 style={{ 'color': 'var(--text-cyan-700)', 'fontSize': '1.5em' }}>لا يوجد محاضرات حتي الأن <BsDatabaseFillX style={{'marginLeft':'5px'}} /></h3>
                                </div>
                                :
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='td-id'>#</th>
                                            <th className='head'><span>العنوان</span></th>
                                            <th className='head'><span>عدد الحصص</span></th>
                                            <th className='head'><span>تاريخ النشر</span></th>
                                            <th className='head'><span> اخر تحديث</span></th>
                                            <th className='head'><span>الخصوصية</span></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            course.course.lectures.map((lecture) => {
                                                return (
                                                    <tr key={lecture.id}>
                                                        <td className='td-id'>{lecture.id}</td>
                                                        <td>
                                                            <div className='user-main-info d-flex flex-row align-items-center'>
                                                                <div className='content d-flex'>
                                                                    <h3>{(lecture.title.length > 26) ? `${(lecture.title).substring(0, 26)}...` : (lecture.title)}</h3>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{lecture.content.length}</td>
                                                        <td>
                                                            {dateFormatter(lecture.created_dt)}
                                                        </td>
                                                        <td>{dateFormatter(lecture.updated_dt)}</td>
                                                        <td>
                                                            {
                                                                (lecture.active) ? <span dir="ltr" className='active'>علني <RemoveRedEyeIcon /></span>
                                                                    :
                                                                    <span dir="ltr" className='not-active'>خاص <VisibilityOffIcon /></span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className='d-flex gap-4 px-3'>
                                                                <Tooltip title="تعديل">
                                                                    <IconButton
                                                                        size="large"
                                                                        edge="start"
                                                                        color="inherit"
                                                                        aria-label="edit"
                                                                        className='custom-edit-button options-btn'
                                                                        onClick={() => {
                                                                            handleClickOpen('edit_lecture');
                                                                            course.setCourse({
                                                                                ...course.course,
                                                                                'currentLecture': lecture.id
                                                                            });
                                                                        }}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="حذف">
                                                                    <IconButton
                                                                        size="large"
                                                                        edge="start"
                                                                        color="inherit"
                                                                        aria-label="delete"
                                                                        className='custom-delete-button options-btn'
                                                                        onClick={() => {
                                                                            handleDeleteBtn({ msg: 'هل متأكد من حف هذه المحاضرة', type: 'lecture', id: lecture.id });
                                                                        }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                        }

                    </div>
                    <div className="w-100 mt-5 d-flex justify-content-between align-items-center">
                        <h4 className="data-title mb-3">الحصص <ArrowDropDownIcon /></h4>
                        <Button onClick={(e) => handleClickOpen('add_session')} className='options-btn d-flex justify-content-center align-items-center' dir='ltr' id='admin-main-btn1' variant="contained" sx={{ 'fontWeight': 'bold' }} size='medium'>
                            <AddIcon />
                        </Button>
                    </div>
                    <div className="area-table">
                        {
                            course.course.lectures.length <= 0 ?
                                <div style={{ 'minHeight': '20vh' }} className="w-100 d-flex justify-content-center align-items-center">
                                    <h3 style={{ 'color': 'var(--text-cyan-700)', 'fontSize': '1.5em' }}>لا يوجد حصص حتي الأن <BsDatabaseFillX style={{'marginLeft':'5px'}} /></h3>
                                </div>
                                :
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='td-id'>#</th>
                                            <th className='head'><span>العنوان</span></th>
                                            <th className='head'><span>النوع</span></th>
                                            <th className='head'><span>تاريخ النشر</span></th>
                                            <th className='head'><span> اخر تحديث</span></th>
                                            <th className='head'><span>الخصوصية</span></th>
                                            <th className='head'><span>الأولوية</span></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            course.course.lectures.map((lecture) => {
                                                return lecture.content.map((session) => {
                                                    return (
                                                        <tr key={`${session.priority}${session.id}${lecture.id}`}>
                                                            <td className='td-id'>{session.priority}{session.id}{lecture.id}</td>
                                                            <td>
                                                                <div className='user-main-info d-flex flex-row align-items-center'>
                                                                    <div className='content d-flex'>
                                                                        <h3>{(session.title.length > 26) ? `${(session.title).substring(0, 26)}...` : (session.title)} - {(lecture.title.length > 26) ? `${(lecture.title).substring(0, 26)}...` : (lecture.title)}</h3>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {
                                                                    (session.type === 'quiz') ? 'اختبار إلكتروني'
                                                                        : (session.type === 'document') ? 'pdf' :
                                                                            (session.type === 'video') ? 'فيديو' : ''
                                                                }
                                                            </td>
                                                            <td>
                                                                {dateFormatter(session.created_dt)}
                                                            </td>
                                                            <td>{dateFormatter(session.updated_dt)}</td>
                                                            <td>
                                                                {
                                                                    (session.active) ? <span dir="ltr" className='active'>علني <RemoveRedEyeIcon /></span>
                                                                        :
                                                                        <span dir="ltr" className='not-active'>خاص <VisibilityOffIcon /></span>
                                                                }
                                                            </td>
                                                            <td>{session.priority}</td>
                                                            <td>
                                                                <div className='d-flex gap-4 px-3 justify-content-start'>
                                                                    <Tooltip title="تعديل">
                                                                        <IconButton
                                                                            size="large"
                                                                            edge="start"
                                                                            color="inherit"
                                                                            aria-label="edit"
                                                                            className='custom-edit-button options-btn'
                                                                            onClick={() => {
                                                                                handleClickOpen('edit_session');
                                                                                course.setCourse({
                                                                                    ...course.course,
                                                                                    session: {
                                                                                        id: session.id,
                                                                                        type: session.type
                                                                                    }
                                                                                });
                                                                            }}
                                                                        >
                                                                            <EditIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="حذف">
                                                                        <IconButton
                                                                            size="large"
                                                                            edge="start"
                                                                            color="inherit"
                                                                            aria-label="delete"
                                                                            className='custom-delete-button options-btn'
                                                                            onClick={() => handleDeleteBtn({ msg: 'هل متأكد من حذف هذه الحصة', type: 'session', id: session.id, sessionType: session.type })}
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {
                                                                        (session.type === 'quiz') ?
                                                                            <Tooltip title="المشاركين">
                                                                                <IconButton
                                                                                    size="large"
                                                                                    edge="start"
                                                                                    color="inherit"
                                                                                    aria-label="edit"
                                                                                    className='custom-edit-button options-btn'
                                                                                    onClick={() => {
                                                                                        handleClickOpen('quiz_users');
                                                                                        course.setCourse({
                                                                                            ...course.course,
                                                                                            session: {
                                                                                                id: session.id,
                                                                                                type: session.type
                                                                                            }
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <InfoIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            })
                                        }
                                    </tbody>
                                </table>
                        }

                    </div>
                    <div className="w-100 mt-5 d-flex justify-content-between align-items-center">
                        <h4 className="data-title d-flex align-items-center">المشتركون بالكورس <ArrowDropDownIcon /></h4>
                        <div className="d-flex justify-content-center align-items-center" style={{ 'width': '30px', 'height': '30px', 'backgroundColor': 'var(--red1)', 'borderRadius': '100%' }}>
                            <span className="p-0 m-0" style={{ 'fontSize': '1.2em', 'color': '#fff' }}>{course.course.subscribers.length}</span>
                        </div>
                    </div>
                    <div className="area-table">
                        {
                            (course.course.subscribers.length <= 0) ?
                                <div style={{ 'minHeight': '20vh' }} className="w-100 d-flex justify-content-center align-items-center">
                                    <h3 style={{ 'color': 'var(--text-cyan-700)', 'fontSize': '1.5em' }}>لا يوجد اي مشتركين <BsDatabaseFillX style={{'marginLeft':'5px'}} /></h3>
                                </div>
                                :
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='td-id'>#</th>
                                            <th className='head'><span>اسم المستخدم</span></th>
                                            <th className='head'><span>رقم الهاتف</span></th>
                                            <th className='head'><span>تاريخ الطلب</span></th>
                                            <th className='head'><span>المبلغ المدفوع</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            course.course.subscribers.map((subscriber, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className='td-id'>{subscriber.subscriber_id}</td>
                                                        <td>
                                                            <Link style={{ 'color': 'var(--red-light)' }} target="_blank" to={`/user/${subscriber.user_id}/profile`}>{subscriber.username}</Link>
                                                        </td>
                                                        <td>{subscriber.phone}</td>
                                                        <td>{dateFormatter(subscriber.request_dt)}</td>
                                                        <td>{parseFloat(subscriber.price).toFixed(2)} ج</td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}