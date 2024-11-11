import { MdCreateNewFolder, MdCreate } from "react-icons/md";
import NonFillBtn from "../../../../../inherit/NonFillBtn";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useLocation } from "react-router-dom";
import LinearIndeterminate from "../../../../../loading/loading1";
import { useState } from "react";
import axiosInstance from "../../../../../../Axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { enqueueSnackbar } from "notistack";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export const CourseCard = (props) => {
    let dataCourse = props.dataCourse;
    const [loadingDelete, setLoadingDelete] = useState(true);
    const [startDelete, setStartDelete] = useState(false);
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const location = useLocation();

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

    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    const handleDeleteBtn = (props) => {
        withReactContent(Swal).fire({
            title: "! حذف ",
            text: "هل انت متأكد من حذف هذا الكورس",
            icon: "question",
            cancelButtonText: "إلغاء",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم, حذف",
        }).then((response) => {
            if (response.isConfirmed) {
                deleteCourse();
            }
        });
    }

    const deleteCourse = () => {
        setStartDelete(true);
        setLoadingDelete(true);
        axiosInstance
            .delete(`admin/courses/course/${dataCourse.id}/delete`)
            .then(() => {
                setLoadingDelete(false);
                handleClickVariant('success', "لقد تم حذف الكورس بنجاح");
                props.refresh(true);
            }).catch(() => {
                setLoadingDelete(false);
                handleClickVariant('error', "لقد حدث خطأ اثناء حذف الكورس حاول في وقت لاحق");
            });
    }

    const price = <div className='price col-lg-4'>
        <div className="price-container d-flex justify-content-center align-items-center gap-1" dir='rtl'>
            <span className='number fw-bold'>{dataCourse.price}</span>
            <span className='name text-light'>جنيهاً</span>
        </div>
    </div>

    const free = <div className='price col-lg-4' style={{ 'borderRadius': '100px', 'background': 'linear-gradient(to right, var(--tw-gradient-stops))' }}>
        <div className="price-container d-flex justify-content-center align-items-center gap-1" dir='rtl'>
            <span className='name text-light'>مجاناً</span>
        </div>
    </div>

    const paid = <div className='price col-lg-4' style={{ 'borderRadius': '100px', 'background': 'linear-gradient(to right, var(--tw-gradient-stops))' }}>
        <div className="price-container d-flex justify-content-center align-items-center gap-1" dir='rtl'>
            <span className='name text-light'>تم الدفع</span>
        </div>
    </div>

    return (
        <>
            <LinearIndeterminate load={(loadingDelete && startDelete) ? true : false} />
            <div dir="ltr" key={dataCourse.id} className={`position-relative course ${((dataCourse.new) === true) ? 'badge-poster new' : ''} ${(Number(dataCourse.price) === 0) ? 'badge-poster free-course' : ''}
            :
            ''
            }`}>
                <div className='course-img w-100 overflow-hidden'>
                    <img style={{ 'borderRadius': '5px' }} src={dataCourse.image} className='img-fluid' alt="course-img" />
                </div>
                <div className='title px-2 pt-3 pb-3 w-100 text-center d-flex justify-content-center align-items-center'>
                    {dataCourse.title}
                </div>
                <div style={{"whiteSpace": "pre-line"}} className='description px-5 mb-3 w-100 text-center d-flex justify-content-center align-items-center'>
                    {dataCourse.description}
                </div>
                <div className="line mt-4 mb-0 d-flex justify-content-center align-items-center">
                    <svg height="6" viewBox="0 0 306 6" fill="var(--tw-gradient-from)" xmlns="http://www.w3.org/2000/svg" className="w-[90%]"><path d="M0.43099 3.29443C0.43099 4.76719 1.6249 5.9611 3.09766 5.9611C4.57042 5.9611 5.76432 4.76719 5.76432 3.29443C5.76432 1.82167 4.57042 0.627767 3.09766 0.627767C1.6249 0.627767 0.43099 1.82167 0.43099 3.29443ZM300.431 3.29443C300.431 4.76719 301.625 5.9611 303.098 5.9611C304.57 5.9611 305.764 4.76719 305.764 3.29443C305.764 1.82167 304.57 0.627767 303.098 0.627767C301.625 0.627767 300.431 1.82167 300.431 3.29443ZM3.09766 3.79443H303.098V2.79443H3.09766V3.79443Z"></path></svg>
                </div>
                <div className='more-info px-5 m-0 row'>
                    <div className="date d-flex flex-column col-lg-8 gap-2">
                        <div className='create d-flex gap-1 justify-content-start align-items-center'>
                            <span style={{ 'marginTop': '-3px' }}>
                                <MdCreateNewFolder />
                            </span>
                            <span>
                                {dateFormatter(dataCourse.upload_date)}
                            </span>
                        </div>
                        <div className='update d-flex gap-1 justify-content-start align-items-center'>
                            <span style={{ 'marginTop': '-3px' }}>
                                <MdCreate />
                            </span>
                            <span>
                                {dateFormatter(dataCourse.update_date)}
                            </span>
                        </div>
                    </div>
                    {
                        (parseFloat(dataCourse.price) === parseFloat(dataCourse.price_off)) ?
                            (parseFloat(dataCourse.price) === 0) ? free : price
                            : price
                    }
                </div>
                <div className="line mb-3 d-flex justify-content-center align-items-center">
                    <svg height="6" viewBox="0 0 306 6" fill="var(--tw-gradient-from)" xmlns="http://www.w3.org/2000/svg" className="fill-midNight-800 mb-4 dark:fill-Olive-200 smooth w-[90%] md:w-full  mx-auto"><path d="M0.43099 3.29443C0.43099 4.76719 1.6249 5.9611 3.09766 5.9611C4.57042 5.9611 5.76432 4.76719 5.76432 3.29443C5.76432 1.82167 4.57042 0.627767 3.09766 0.627767C1.6249 0.627767 0.43099 1.82167 0.43099 3.29443ZM300.431 3.29443C300.431 4.76719 301.625 5.9611 303.098 5.9611C304.57 5.9611 305.764 4.76719 305.764 3.29443C305.764 1.82167 304.57 0.627767 303.098 0.627767C301.625 0.627767 300.431 1.82167 300.431 3.29443ZM3.09766 3.79443H303.098V2.79443H3.09766V3.79443Z"></path></svg>
                </div>
                <div className='btns d-flex w-100 justify-content-center align-items-center gap-3'>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="visit"
                        className='custom-edit-button options-btn'
                        component={Link}
                        to={`/courses/${dataCourse.grade_info.name}/course/${dataCourse.id}`}
                    >
                        <RemoveRedEyeIcon />
                    </IconButton>
                    <NonFillBtn to={`/admin/dashboard/courses/${dataCourse.id}`} name="تفاصيل" />
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="edit"
                        className='custom-edit-button options-btn'
                        component={Link}
                        to={`/admin/dashboard/courses/${dataCourse.id}/edit`}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="delete"
                        className='custom-delete-button options-btn'
                        onClick={handleDeleteBtn}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
        </>
    )
};