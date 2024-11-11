import FillBtn from '../inherit/FillBtn';
import NonFillBtn from '../inherit/NonFillBtn';
import './cards.css';
import CourseImage from '../../assets/images/course.jpg'
import { MdCreateNewFolder, MdCreate } from "react-icons/md";
import { useState } from 'react';


export function Course(props) {
    const dataAuth = props.dataAuth;
    const dataCourse = props.dataCourse;

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
        <div key={dataCourse.id} className={`course ${((dataCourse.new) === true) ? 'badge-poster new' : ''} ${(Number(dataCourse.price) === 0) ? 'badge-poster free-course' : ''} ${(dataCourse.is_paid === true) ? 'badge-poster paid'
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
                    (dataCourse.is_paid === true) ? paid
                        :
                        (parseFloat(dataCourse.price) === 0 && parseFloat(dataCourse.price_off) === 0) ?
                            free
                            :
                            price
                }
            </div>
            <div className="line mb-3 d-flex justify-content-center align-items-center">
                <svg height="6" viewBox="0 0 306 6" fill="var(--tw-gradient-from)" xmlns="http://www.w3.org/2000/svg" className="fill-midNight-800 mb-4 dark:fill-Olive-200 smooth w-[90%] md:w-full  mx-auto"><path d="M0.43099 3.29443C0.43099 4.76719 1.6249 5.9611 3.09766 5.9611C4.57042 5.9611 5.76432 4.76719 5.76432 3.29443C5.76432 1.82167 4.57042 0.627767 3.09766 0.627767C1.6249 0.627767 0.43099 1.82167 0.43099 3.29443ZM300.431 3.29443C300.431 4.76719 301.625 5.9611 303.098 5.9611C304.57 5.9611 305.764 4.76719 305.764 3.29443C305.764 1.82167 304.57 0.627767 303.098 0.627767C301.625 0.627767 300.431 1.82167 300.431 3.29443ZM3.09766 3.79443H303.098V2.79443H3.09766V3.79443Z"></path></svg>
            </div>
            <div className='btns d-flex w-100 justify-content-center align-items-center gap-2'>
                <NonFillBtn to={`course/${dataCourse.id}`} name="تفاصيل" />
                {
                    (parseFloat(dataCourse.price) === 0) ?
                        <FillBtn dataAuth={dataAuth.isAuthenticated} to={`course/${dataCourse.id}/view`} name="الدخول للكورس" />
                        :
                        (dataCourse.is_paid === true) ?
                            <FillBtn dataAuth={dataAuth.isAuthenticated} to={`course/${dataCourse.id}/view`} name="الدخول للكورس" />
                            :
                            (dataAuth.isAuthenticated) ?
                                (dataAuth.profile.profile.is_superuser === true || dataAuth.profile.profile.is_staff === true || dataAuth.profile.profile.is_vip === true) ?
                                    <FillBtn dataAuth={dataAuth.isAuthenticated} to={`course/${dataCourse.id}/view`} name="الدخول للكورس" />
                                    :
                                    <FillBtn dataAuth={dataAuth.isAuthenticated} to={`course/${dataCourse.id}/subscribe`} name="! اشترك الأن" />
                                :
                                <FillBtn dataAuth={dataAuth.isAuthenticated} to={`course/${dataCourse.id}/subscribe`} name="! اشترك الأن" />
                }
            </div>
        </div>
    )
}

// 