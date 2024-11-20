import { useEffect, useState } from 'react';
import './course-content.css';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../Axios';
import { Container } from 'react-bootstrap';
import ReloadBtn1 from '../../inherit/ReloadBtn1';
import LoadingGradient from '../../loading/Loading2';
import CourseImage from '../../../assets/images/course.jpg';
import { SubscribeBtn } from '../../inherit/SubscribeBtn';
import { MdCreate, MdCreateNewFolder } from 'react-icons/md';
import { Title2 } from '../../title/Title2';
import Accordions from '../../inherit/Accordion';
import { $404 as Error404 } from '../../errors/404';
import { Helmet } from 'react-helmet';



function CourseContent(props) {
    const param = useParams()
    const course_id = param.course_id;
    const dataAuth = props.dataAuth;


    useEffect(() => {
        getCourse();
    }, [course_id]);

    const [loading, setLoading] = useState(false);
    const [courseContent, setCourseContent] = useState({
        error: { catch: true, status: 0, message: 'no connection' },
        course: {},
    });


    const getCourse = () => {
        setLoading(true);
        axiosInstance
            .get(`/courses/course/${course_id}`)
            .then((response) => {
                setLoading(false);
                if (response.status === 200 || response.status === 201) {
                    setCourseContent({ error: { catch: false, status: 200, msg: 'good connection' }, course: response.data });
                } else {
                    setCourseContent({ error: { catch: true, status: 200, msg: 'لقد حدث خطأ ما حاول في وقت لاحق' }, course: {} });
                }
            }).catch((err) => {
                setLoading(false);
                if (err.response.status === 404) {
                    setCourseContent({ error: { catch: true, status: 404, message: 'عنوان خطأ لا يوجد بيانات في هذا المسار' }, course: {} });
                } else {
                    setCourseContent({ error: { catch: true, message: 'لقد حدث خطأ ما حاول في وقت لاحق' }, course: {} });
                }
            });
    }

    const dateFormatter = (value) => {
        let date = new Date(value);

        let newDate =
            new Intl.DateTimeFormat('ar-GB', {
                dateStyle: 'full',
                // timeStyle: 'short',
                timeZone: 'Africa/Cairo',
            }).format(date)


        return newDate
        // date.toDateString();
    }


    const price = (courseContent.course.price_off <= 0) ?
        <span className='after'>مجانا</span>
        :
        <>
            {
                (courseContent.course.price_off === courseContent.course.price) ?
                    <span className='after'>
                        {courseContent.course.price} ج
                    </span>
                    :
                    <div className='d-flex flex-column'>
                        <div className='mb-2 d-flex gap-4'>
                            <span className='after'>
                                {courseContent.course.price} ج
                            </span>
                            <span className='before'>
                                {courseContent.course.price_off} ج
                            </span>
                        </div>
                        <span className='period'>لفترة محدودة</span>
                    </div>

            }

        </>



    if (loading === true) {
        return (
            <>
                <section className='course-data d-flex justify-content-center align-items-center'>
                    <LoadingGradient />
                </section>
                <section className='course-content d-flex justify-content-center align-items-center'>
                    <LoadingGradient />
                </section>
            </>
        )
    }
    else {
        if (courseContent.error.catch === true) {
            if (courseContent.error.status === 404) {
                return <Error404 message={courseContent.error.message} />
            } else {
                return <section className='extra-section d-flex justify-content-center align-items-center'>
                    <h3 className="text-danger d-flex flex-column gap-3 flex-column">
                        {courseContent.error.message}
                        <ReloadBtn1 onclick={getCourse} title='اعادة التحميل' />
                    </h3>
                </section>
            }
        } else {
            return (
                <>
                    <Helmet>
                        <title>{courseContent.course.title} - مجتمع الرياضيات</title>
                    </Helmet>
                    <section className='course-data d-flex justify-content-center'>
                        <Container className='d-flex justify-content-center'>
                            <div className='row w-100 d-flex justify-content-start align-items-start'>
                                <div dir='rtl' className='course-data-card col-lg-4 col-md-6'>
                                    <div className='media w-100 p-0 mb-3'>
                                        <img src={courseContent.course.image} alt='media' />
                                    </div>
                                    <div className='price w-100 d-flex align-items-center'>
                                        {
                                            (courseContent.course.is_paid === true) ?
                                                <></>
                                                :
                                                (dataAuth.isAuthenticated) ?
                                                    (dataAuth.profile.profile.is_superuser === true || dataAuth.profile.profile.is_staff === true || dataAuth.profile.profile.is_vip === true) ?
                                                        <></>
                                                        :
                                                        <>{price}</>
                                                    :
                                                    <>{price}</>
                                        }
                                    </div>
                                    <div className='actions w-100 d-flex justify-content-center align-items-center'>

                                        {
                                            (parseFloat(courseContent.course.price) === 0) ?
                                                <SubscribeBtn dataAuth={dataAuth.isAuthenticated} to='view' name='الدخول الي الكورس' bgColor='var(--red1)' color='#fff' />
                                                :
                                                (courseContent.course.is_paid === true) ?
                                                    <SubscribeBtn dataAuth={dataAuth.isAuthenticated} to='view' name='الدخول الي الكورس' bgColor='var(--red1)' color='#fff' />
                                                    :
                                                    (dataAuth.isAuthenticated) ?
                                                        (dataAuth.profile.profile.is_superuser === true || dataAuth.profile.profile.is_staff === true || dataAuth.profile.profile.is_vip === true) ?
                                                            <SubscribeBtn dataAuth={dataAuth.isAuthenticated} to='view' name='الدخول الي الكورس' bgColor='var(--red1)' color='#fff' />
                                                            :
                                                            <SubscribeBtn dataAuth={dataAuth.isAuthenticated} name='اشترك الأن !' to='subscribe' bgColor='var(--red1)' color='#fff' />
                                                        :
                                                        <SubscribeBtn dataAuth={dataAuth.isAuthenticated} name='اشترك الأن !' to='subscribe' bgColor='var(--red1)' color='#fff' />

                                        }

                                    </div>
                                    <div className='description w-100'>
                                        {courseContent.course.description}
                                    </div>
                                </div>
                                <div dir='rtl' className='course-details col-lg-8 col-md-6 d-flex flex-column'>
                                    <div className='title'>
                                        <span>{courseContent.course.title}</span>
                                    </div>
                                    <div className='grade mb-4'>
                                        <span>{courseContent.course.grade_info.name}</span>
                                    </div>
                                    <div className='date d-flex gap-4'>
                                        <div className='upload d-flex gap-2'>
                                            <span><MdCreateNewFolder /> تاريخ النشر : </span>
                                            <span>{dateFormatter(courseContent.course.upload_date)}</span>
                                        </div>
                                        <div className='upload d-flex gap-2'>
                                            <span><MdCreate /> اخر تحديث : </span>
                                            <span>{dateFormatter(courseContent.course.update_date)}</span>
                                        </div>
                                    </div>
                                    <div className='lectures'></div>
                                </div>
                            </div>
                        </Container>
                    </section>
                    <section className='course-content' dir='rtl'>
                        <Container>
                            <Title2 title='محتوي الكورس' />
                            <div className='row content-div'>
                                <div className='col-lg-8 col-sm-12 col-md-12'>
                                    {
                                        (courseContent.course.lectures.length > 0) ?
                                            <Accordions data_theme={props.data_theme} data={courseContent} />
                                            :
                                            <div className='w-100 d-flex justify-content-start align-items-center'>
                                                <span className='text-danger' style={{ 'fontSize': '1.3em' }}>لم يتم تنزيل اي محاضرة في هذا الكورس حتي الأن !</span>
                                            </div>
                                    }
                                </div>
                            </div>
                        </Container>
                    </section>
                </>
            )
        }
    }
}

export default CourseContent;