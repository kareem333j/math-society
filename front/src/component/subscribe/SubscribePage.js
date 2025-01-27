import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './subscribe.css';
import axiosInstance from "../../Axios";
import { SubscribeBtn } from "../inherit/SubscribeBtn";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { Title2 } from "../title/Title2";
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import LinearIndeterminate from "../loading/loading1";
import LoadingGradient from "../loading/Loading2";
import { AlertSuccess2 } from "../errors/Alert2";
import ClipboardCopy from "../inherit/CopyField";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";


export const SubscribePage = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();
    let location = useLocation();
    var dataAuth = props.dataAuth;
    const param = useParams();
    const course_id = param.course_id;

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [courseContent, setCourseContent] = useState({
        error: { catch: true, status: 0, message: 'no connection' },
        course: null,
    });
    const [changePaymentBtnStep1, setChangePaymentBtnStep1] = useState(false);
    const [transactionNumberIfExists, setTransactionNumberIfExists] = useState(0);

    const handleClickVariant = (variant) => () => {
        enqueueSnackbar('تم نسخ الرقم', { variant });
    };

    useEffect(() => {
        if (dataAuth.isAuthenticated) {
            dataAuth.profile.profile.subscribe_courses.map((course) => {
                if (course.course === parseInt(course_id) && course.is_active === true) {
                    history(`/`);
                }
            });
            if (dataAuth.profile.profile.is_superuser === true || dataAuth.profile.profile.is_staff === true) {
                history(`/`);
            }
        }
        if (props.userLoaded === true) {
            history('/login', { state: { next: location.pathname } });
        }
        getUserCourseIfExists();
        getCourse();
    }, [dataAuth]);


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

    const getUserCourseIfExists = () => {
        setLoading(true);
        axiosInstance
            .get(`courses/payment/get_transaction/${course_id}`)
            .then((response) => {
                setLoading(false);
                setChangePaymentBtnStep1(true);
                setTransactionNumberIfExists(response.data.transaction);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 404) {
                    setChangePaymentBtnStep1(false);
                } else {
                    setChangePaymentBtnStep1(false);
                }
            });
    }

    const getTransactionNumber = () => {
        alert({
            action: () => {
            },
            btn: 'تم',
            title: ' رقم العملية الخاص بك هو',
            html: <ClipboardCopy copyText={transactionNumberIfExists} onClick={handleClickVariant('success')} />,
        });
    }

    const alert = (dataAlert) => {
        AlertSuccess2(dataAlert);
    }

    const handelPayment1 = () => {
        setLoading2(true);
        axiosInstance
            .post(`courses/payment/process1`, {
                course: course_id
            })
            .then((response) => {
                setLoading2(false);
                alert({
                    action: () => {
                    },
                    btn: 'تم',
                    title: ' رقم العملية الخاص بك هو',
                    html: <ClipboardCopy copyText={response.data} onClick={handleClickVariant('success')} />,
                });
                getUserCourseIfExists();
            })
            .catch((err) => {
                setLoading2(false);
            })
    }

    if (loading === true) {
        return <LoadingGradient />
    } else {
        if (courseContent.course != null) {
            return (
                <>
                    <LinearIndeterminate load={loading2} />
                    <Helmet>
                        <title>الإشتراك في {courseContent.course.title} - مجتمع الرياضيات</title>
                    </Helmet>
                    <section className='course-data-subscribe d-flex justify-content-center'>
                        <Container className='d-flex justify-content-center'>
                            <div className='row w-100 d-flex justify-content-start align-items-start'>
                                <div dir='rtl' className={`course-data-subscribe-card ${(changePaymentBtnStep1 === true) ? 'is_subscribe' : ''} col-lg-4 col-md-6`}>
                                    <div className='media w-100 p-0 mb-3'>
                                        <img src={courseContent.course.image} alt='media' />
                                    </div>
                                    <div className="item d-flex align-items-center">
                                        <span className="course-title">{courseContent.course.title}</span>
                                    </div>
                                    <div className="item d-flex justify-content-between align-items-center">
                                        <span className="title">اجمالي السعر ق الخصم</span>
                                        <span className="value"><span>ج</span><span className={`${(courseContent.course.price_off !== courseContent.course.price) ? 'text-decoration-line-through' : ''} fw-bold`}>{courseContent.course.price_off}</span></span>
                                    </div>
                                    <div className="item d-flex justify-content-between align-items-center border-0">
                                        <span className="title">اجمالي السعر ب الخصم</span>
                                        <span className="value"><span>ج</span><span className="fw-bold">{courseContent.course.price}</span></span>
                                    </div>
                                    <div className='actions w-100 d-flex justify-content-center align-items-center flex-column gap-2'>
                                        {
                                            (changePaymentBtnStep1 === true) ?
                                                <>
                                                    <SubscribeBtn type='is_subscribed' dataAuth={dataAuth.isAuthenticated} name='في انتظار الدفع...' bgColor='var(--red1)' color='#fff' />
                                                    <SubscribeBtn onClick={getTransactionNumber} dataAuth={dataAuth.isAuthenticated} name='إظهار رقم العملية' bgColor='var(--title-background)' color='#fff' />
                                                </>
                                                :
                                                <SubscribeBtn type='subscribed' onClick={handelPayment1} dataAuth={dataAuth.isAuthenticated} name=' اكمال الدفع !' bgColor='var(--red1)' color='#fff' />
                                        }
                                    </div>
                                </div>
                                <div dir='rtl' className={`course-details-subscribe ${(changePaymentBtnStep1 === true) ? 'is_subscribe' : ''} col-lg-8 col-md-6 d-flex flex-column gap-2`}>
                                    <div className='title'>
                                        <span dir="ltr">عملية الدفع <CurrencyExchangeIcon /></span>
                                    </div>
                                    <div>
                                        <span className="note">يجب عليك إتباع الخطوات المقترحة لإتمام عملية الدفع بشكل سليم</span>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                    <section className='course-content-subscribe' dir='rtl'>
                        <Container>
                            <Title2 title='خطوات الدفع' />
                            <div className='row content-div'>
                                <div className="notes-div col-lg-8 col-sm-12 col-md-12 row">
                                    <div className='item col-lg-12 col-sm-12 col-md-12 d-flex gap-2'>
                                        <LooksOneIcon />
                                        <span className="content">قم بالتأكد بالفعل انك تريد شراء الكورس لأنه عند البدء في الشراء لايمكن التراجع عن العملية حتي إن تغير سعر الكورس لاتستطيع الشراء بالسعر الجديد او تطبيق اي كوبونات خصم فقط تستطيع الشراء بالسعر الذي بدأت فيه عملية الشراء</span>
                                    </div>
                                    <div className='item col-lg-12 col-sm-12 col-md-12 d-flex gap-2'>
                                        <LooksTwoIcon />
                                        <span className="content">قم بالضغط علي زر إكمال الدفع</span>
                                    </div>
                                    <div className='item col-lg-12 col-sm-12 col-md-12 d-flex gap-2'>
                                        <Looks3Icon />
                                        <span className="content">بعد الضغط علي زر الإكمال سيظهر لك رقم العملية احتفظ بهذا الرقم جيدا..!</span>
                                    </div>
                                    <div className='item col-lg-12 col-sm-12 col-md-12 d-flex gap-2'>
                                        <Looks4Icon />
                                        <span className="content">قم بالذهاب لأقرب ماكينة دفع فوري وقم بالتحويل علي رقم الهاتف التالي <span className="fw-bold text-danger">( 01023681084 )</span> المبلغ المالي الظاهر امامك في الفاتورة </span>
                                    </div>
                                    <div className='item col-lg-12 col-sm-12 col-md-12 d-flex gap-2'>
                                        <Looks5Icon />
                                        <span className="content">بعد ذالك تواصل مع اي من الأرقام التاليه وارسل له من خلال التلجرام او واتساب صورة من فاتورة فوري بعد الدفع وارسل له رقم العملية الذي ظهر امامك عندما قمت بالضغط علي زر الإكمال</span>
                                    </div>
                                    <div className='item col-lg-12 col-sm-12 col-md-12 d-flex gap-2'>
                                        <span className="content pe-4">ارقام الهاتف التي سترسل لها صورة الدفع رقم العملية هي <span className="fw-bold text-danger">( 01023681084 , 01019180886 )</span></span>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                </>
            )
        }
    }
}