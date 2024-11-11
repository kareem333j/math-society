import { useContext, useRef } from "react";
import { MdCreateNewFolder, MdCreate } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import DefaultCourseImage from '../../../../../../assets/images/background/course-bg-default.png';

export const TestCard = (props) => {
    const course = useContext(props.context);

    const testImageRef = useRef();
    const course_img = useRef();
    var date = new Date();

    const dateFormatter = (value) => {
        let date = new Date(value);

        let newDate =
            new Intl.DateTimeFormat('ar-GB', {
                dateStyle: 'full',
                timeZone: 'Africa/Cairo',
            }).format(date)


        return newDate
    }


    const addNewImage = (e) => {
        var imageInfoBorder = document.querySelector('.course-img .more-info');

        course.setDataCourse({
            ...course.dataCourse,

            image: (e.target.files[0] !== undefined) ? URL.createObjectURL(e.target.files[0]) : DefaultCourseImage,
            image_to_server: e.target.files[0]
        });
        if (document.querySelector('.course-img .more-info')) {
            imageInfoBorder.style = 'display: none';
        }
        if (e.target.files[0] === undefined) {
            imageInfoBorder.style = 'display: flex';
        }
    }

    const handleImageClick = () => {
        testImageRef.current.click();
    }

    const price = <div className='price col-lg-4'>
        <div className="price-container d-flex justify-content-center align-items-center gap-1" dir='rtl'>
            <span className='number fw-bold'>{parseFloat(course.dataCourse.price).toFixed(2)}</span>
            <span className='name text-light'>جنيهاً</span>
        </div>
    </div>

    const free = <div className='price col-lg-4' style={{ 'borderRadius': '100px', 'background': 'linear-gradient(to right, var(--tw-gradient-stops))' }}>
        <div className="price-container d-flex justify-content-center align-items-center gap-1" dir='rtl'>
            <span className='name text-light'>مجاناً</span>
        </div>
    </div>

    return (
        <div dir="ltr" key={course.dataCourse.id} className={`course test ${((course.dataCourse.new) === true) ? 'badge-poster new' : ''} ${(Number(course.dataCourse.price) === 0 && Number(course.dataCourse.price) === Number(course.dataCourse.price_off)) ? 'badge-poster free-course' : ''} ${(course.dataCourse.is_paid === true) ? 'badge-poster paid'
            :
            ''
            }`}>
            <div onClick={handleImageClick} ref={course_img} id='course-test-img' className='course-img course-test-img w-100 overflow-hidden'>
                <div className="more-info">
                    <IoAdd />
                    <span>إضغط لإضافة صورة للكورس</span>
                    <span className="text-danger fw-bold">1600 x 900</span>
                </div>
                <img style={{ 'borderRadius': '5px' }} src={course.dataCourse.image} className='img-fluid' alt="course-img" />
                <input ref={testImageRef} type="file" accept="image/*" name="course_image" onChange={(e) => { addNewImage(e) }} required={props.required} />
                {/* accept='.png,.svg,.jpg,.JPG' */}
            </div>
            <div className='title px-2 pt-3 pb-3 w-100 text-center d-flex justify-content-center align-items-center'>
                {course.dataCourse.title}
            </div>
            <div style={{"whiteSpace": "pre-line"}} className='description px-5 mb-3 w-100 text-center d-flex justify-content-center align-items-center'>
                {course.dataCourse.description}
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
                            {dateFormatter(date)}
                        </span>
                    </div>
                    <div className='update d-flex gap-1 justify-content-start align-items-center'>
                        <span style={{ 'marginTop': '-3px' }}>
                            <MdCreate />
                        </span>
                        <span>
                            {dateFormatter(date)}
                        </span>
                    </div>
                </div>

                {
                    (parseFloat(course.dataCourse.price) === parseFloat(course.dataCourse.price_off)) ?
                        (parseFloat(course.dataCourse.price) === 0) ? free : price
                        : price
                }
            </div>
        </div>
    )
};