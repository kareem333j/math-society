import { useContext, useEffect, useState } from "react";
import { TestCard } from "./inherit/TestCard";
import { DashboardMainBtn } from "../../../../inherit/DashboardMainBtn";
import { AddCourseContext } from "../../../../../context/AddCourseContext";
import { CustomSwitchBtn } from "../../inherit/SwitchBtn";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../../Axios";
import LoadingGradient from "../../../../loading/Loading2";
import { CustomTextField } from "../../inherit/fields/TextField";
import { CustomNumberField } from "../../inherit/fields/NumberField";
import { CustomTextAreaField } from "../../inherit/fields/TextAreaField";
import { CustomSelectField } from "../../inherit/fields/SelectField";
import LinearIndeterminate from "../../../../loading/loading1";
import EditCourseProvider, { EditCourseContext } from "../../../../../context/EditCourseContext";
import { InputAdornment } from "@mui/material";



export default function Edit() {
    const params = useParams();
    const courseId = params.course_id;
    var course = useContext(EditCourseContext);
    var [defaultDataCourse, setDefaultDataCourse] = useState(course.dataCourse);
    const history = useNavigate();
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const [loading, setLoading] = useState(true);
    const [loadingDefaultData,setLoadingDefaultData] = useState(true);
    const [editRequestLoading, setEditRequestLoading] = useState(false);

    const [grades, setGrades] = useState(null);
    const [grade, setGrade] = useState('');

    // for select only
    const handleChange = (event) => {
        setGrade(event.target.value);
    };

    const handleFormChange = (e) => {
        course.setDataCourse({
            ...course.dataCourse,

            [e.target.name]: e.target.value,
        });

        // for price fields
        if (e.target.name === 'price_off' || e.target.name === 'price') {
            if (e.target.value > 999.99) {
                e.target.value = 999.99;
            } else if (e.target.value < 0) {
                e.target.value = 0;
            }
            if (isNaN(parseFloat(e.target.value))) {
                e.target.value = 0;
            }
            course.setDataCourse({
                ...course.dataCourse,

                [e.target.name]: (e.target.value > 999.99) ? 999.99 : (e.target.value < 0) ? 0 : parseFloat(e.target.value).toFixed(2),
            });
        }

        // for switch buttons
        if (e.target.name === 'new' || e.target.name === 'is_active') {
            course.setDataCourse({
                ...course.dataCourse,
                [e.target.name]: e.target.checked,
            });
        }
    };

    const handleFromData = (e) => {
        e.preventDefault();
        setEditRequestLoading(true);
        const config = {
            headers: {
                Authorization: localStorage.getItem('access_token')
                    ? 'JWT ' + localStorage.getItem('access_token')
                    : null,
                'Content-Type': 'multipart/form-data'
            }
        };

        let formData = new FormData();  // عشان انا محدد في الباك اند ان التسيق يجي بهيئة فورم صحيحة
        formData.append('title', course.dataCourse.title);
        formData.append('description', course.dataCourse.description);
        formData.append('price_off', (course.dataCourse.price_off === 1) ? 0 : parseFloat(course.dataCourse.price_off));
        formData.append('price', parseFloat(course.dataCourse.price));
        formData.append('grade', course.dataCourse.grade);
        formData.append('is_active', course.dataCourse.is_active);
        formData.append('new', course.dataCourse.new);
        if (course.dataCourse.image_to_server != null) {
            formData.append('image', course.dataCourse.image_to_server)
        }else{
            formData.append('image', '');
        }

        axiosInstance
            .put(`admin/courses/course/${courseId}/edit`, formData, config)
            .then((response) => {
                setEditRequestLoading(false);
                history('/admin/dashboard/courses', { state: 'تم تحديث الكورس بنجاح' });
            })
            .catch((error) => {
                setEditRequestLoading(false);
                handleClickVariant('error', 'لقد فشلت عملية التحديث راجع البيانات');
            })
    }


    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    useEffect(() => {
        getGrades();
        getCourseData();
    }, [])

    const getGrades = () => {
        setLoading(true);
        axiosInstance
            .get('/grades')
            .then((response) => {
                setLoading(false);
                setGrades(response.data);
            })
            .catch((err) => {
                setLoading(false);
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            });
    }

    const getCourseData = () => {
        setLoadingDefaultData(true);
        axiosInstance
            .get(`admin/courses/course/${courseId}`)
            .then((response) => {
                setLoadingDefaultData(false);
                const data = response.data;
                const defaultDataCourseFromDataBase = {
                    ...course.dataCourse,
                    image: data.image,
                    new: data.new,
                    is_active: data.is_active,
                    title: data.title,
                    description: data.description,
                    price_off: data.price_off,
                    price: data.price,
                    grade: data.grade_info.id
                }
                course.setDataCourse(defaultDataCourseFromDataBase);
                setDefaultDataCourse(response.data);

            })
            .catch((error) => {
                setLoadingDefaultData(false);
                console.log(error)
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            })
    }

    const handleFormErrors = () => {
        let imageInput = document.querySelector('.course-from-with-card .test input');
        if (imageInput) {
            if (imageInput.value.length === 0) {
                handleClickVariant('error', 'يجب إضافة صورة للكورس');
                handleClickVariant('error', 'تأكد ان جميع الحقول ممتلئة');
            }
        }
    }
    if (loading === true || loadingDefaultData === true) {
        return <LoadingGradient />
    } else {

        return (
            <SnackbarProvider maxSnack={3}>
                <LinearIndeterminate load={editRequestLoading} />
                <div className="w-100">
                    <form onSubmit={handleFromData} className="row course-from-with-card">
                        <div className="add-course-div general-div-inputs col-lg-8 flex-column">
                            <div className="title w-100 d-flex justify-content-center align-items-center text-center">تعديل : "{defaultDataCourse.title}"</div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-12 input-div" dir="rtl">
                                    <CustomTextField
                                        label="اسم الكورس"
                                        name='title'
                                        onChange={handleFormChange}
                                        defaultValue={defaultDataCourse.title}
                                    />
                                </div>
                            </div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-6 input-div">
                                    <CustomNumberField
                                        inputProps={{ min: 0, max: 999 }}
                                        defaultValue={defaultDataCourse.price_off}
                                        label="السعر ق الخصم"
                                        name='price_off'
                                        onChange={handleFormChange}
                                        icon={<InputAdornment position="start">$</InputAdornment>}
                                        type='text'
                                    />
                                </div>
                                <div className="col-lg-6 input-div">
                                    <CustomNumberField
                                        inputProps={{ min: 0, max: 999 }}
                                        defaultValue={defaultDataCourse.price}
                                        label="السعر ب الخصم"
                                        name='price'
                                        onChange={handleFormChange}
                                        icon={<InputAdornment position="start">$</InputAdornment>}
                                        type='text'
                                    />
                                </div>
                            </div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-12 input-div" dir="rtl">
                                    <CustomTextAreaField
                                        label="الوصف"
                                        rows={4}
                                        name="description"
                                        onChange={handleFormChange}
                                        defaultValue={defaultDataCourse.description}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-12 input-div" dir="rtl">
                                    <CustomSelectField
                                        value={course.dataCourse.grade}
                                        label="اختر الصف الدراسي "
                                        onChange={handleFormChange}
                                        name="grade"
                                        defaultValue={defaultDataCourse.grade_info.id}
                                        array={grades}
                                    />
                                </div>
                            </div>
                            <div className="w-100 row">
                                <div className="col-lg-12 p-1 switch-buttons">
                                    <CustomSwitchBtn defaultChecked={defaultDataCourse.new} name='new' onClick={handleFormChange} title='إضافة العلامة المائية (جديد)' />
                                </div>
                                <div className="col-lg-12 p-1 switch-buttons">
                                    <CustomSwitchBtn defaultChecked={defaultDataCourse.is_active} name='is_active' onClick={handleFormChange} title='تفعيل (حيث ان الكورس سيظهر للجميع)' />
                                </div>
                            </div>
                            <div className="w-100 row">
                                <div className="col-lg-12 input-div p-1" dir="rtl">
                                    <DashboardMainBtn onClick={handleFormErrors} name='حفظ' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                                </div>
                            </div>
                        </div>
                        <div className="test col-lg-4">
                            <TestCard dataImage={defaultDataCourse} type='edit' context={EditCourseContext} required={false} />
                        </div>
                    </form>
                </div>
            </SnackbarProvider>
        )
    }
}