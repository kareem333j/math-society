import { useContext, useEffect, useState } from "react";
import { TestCard } from "./inherit/TestCard";
import { DashboardMainBtn } from "../../../../inherit/DashboardMainBtn";
import { AddCourseContext } from "../../../../../context/AddCourseContext";
import { CustomSwitchBtn } from "../../inherit/SwitchBtn";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../../Axios";
import LoadingGradient from "../../../../loading/Loading2";
import { CustomTextField } from "../../inherit/fields/TextField";
import { CustomNumberField } from "../../inherit/fields/NumberField";
import { CustomTextAreaField } from "../../inherit/fields/TextAreaField";
import { CustomSelectField } from "../../inherit/fields/SelectField";
import LinearIndeterminate from "../../../../loading/loading1";
import { InputAdornment } from "@mui/material";



export default function Add() {
    const course = useContext(AddCourseContext);
    const history = useNavigate();
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const [loading, setLoading] = useState(true);
    const [addRequestLoading, setAddRequestLoading] = useState(false);

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
        if (e.target.name === 'new' || e.target.name === 'is_active' || e.target.name === 'notification') {
            if (e.target.value === "on") {
                e.target.value = "off";
            } else {
                e.target.value = "on";
            }

            course.setDataCourse({
                ...course.dataCourse,

                [e.target.name]: (e.target.value === "on") ? true : false,
            });
        }
    };

    const handleFromData = (e) => {
        e.preventDefault();
        setAddRequestLoading(true);
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
        formData.append('price_off', (course.dataCourse.price_off === 1)? 0: parseFloat(course.dataCourse.price_off));
        formData.append('price', parseFloat(course.dataCourse.price));
        formData.append('grade', course.dataCourse.grade);
        formData.append('is_active', course.dataCourse.is_active);
        formData.append('new', course.dataCourse.new);
        if (course.dataCourse.image_to_server != null) {
            formData.append('image', course.dataCourse.image_to_server)
        }
        
        axiosInstance
            .post('admin/courses/add', formData, config)
            .then((response) => {
                setAddRequestLoading(false);
                history('/admin/dashboard/courses', {state:'تم إضافة الكورس بنجاح'});
            })
            .catch((error) => {
                setAddRequestLoading(false);
                handleClickVariant('error', 'لقد فشلت عملية الإضافة راجع البيانات');
            })
    }


    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    useEffect(() => {
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
    }, [])

    const handleFormErrors = () => {
        let imageInput = document.querySelector('.course-from-with-card .test input');
        if (imageInput) {
            if (imageInput.value.length === 0) {
                handleClickVariant('error', 'يجب إضافة صورة للكورس');
                handleClickVariant('error', 'تأكد ان جميع الحقول ممتلئة');
            }
        }
        console.log(course.dataCourse)
    }
    if (loading === true) {
        return <LoadingGradient />
    } else {

        return (
            <SnackbarProvider maxSnack={3}>
                <LinearIndeterminate load={addRequestLoading} />
                <div className="w-100">
                    <form onSubmit={handleFromData} className="row course-from-with-card">
                        <div className="add-course-div general-div-inputs col-lg-8 flex-column">
                            <div className="title w-100 d-flex justify-content-center align-items-center">إضافة كورس جديد</div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-12 input-div" dir="rtl">
                                    <CustomTextField
                                        label="اسم الكورس"
                                        name='title'
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-6 input-div">
                                    <CustomNumberField
                                        inputProps={{ min: 0, max: 999 }}
                                        defaultValue={0}
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
                                        defaultValue={0}
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
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="w-100 row inputs-row">
                                <div className="col-lg-12 input-div" dir="rtl">
                                    <CustomSelectField
                                        value={grade}
                                        label="اختر الصف الدراسي "
                                        onChange={(e) => {
                                            handleChange(e);
                                            handleFormChange(e);
                                        }}
                                        name="grade"
                                        array={grades}
                                    />
                                </div>
                            </div>
                            <div className="w-100 row">
                                <div className="col-lg-12 p-1 switch-buttons">
                                    <CustomSwitchBtn defaultChecked={true} name='new' onClick={handleFormChange} title='إضافة العلامة المائية (جديد)' />
                                </div>
                                <div className="col-lg-12 p-1 switch-buttons">
                                    <CustomSwitchBtn defaultChecked={true} name='is_active' onClick={handleFormChange} title='تفعيل (حيث ان الكورس سيظهر للجميع)' />
                                </div>
                                <div className="col-lg-12 p-1 switch-buttons">
                                    <CustomSwitchBtn defaultChecked={false} name='notification' onClick={handleFormChange} title='إرسال إشعار لجمع من بهذا الصف بشأن الكورس الجديد' />
                                </div>
                            </div>
                            <div className="w-100 row">
                                <div className="col-lg-12 input-div p-1" dir="rtl">
                                    <DashboardMainBtn onClick={handleFormErrors} name='إضافة' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                                </div>
                            </div>
                        </div>
                        <div className="test col-lg-4">
                            <TestCard context={AddCourseContext} required={true} />
                        </div>
                    </form>
                </div>
            </SnackbarProvider>
        )
    }
}