import { useContext, useState, useEffect } from "react";
import LinearIndeterminate from "../../../../loading/loading1"
import { CustomTextField } from "../../inherit/fields/TextField";
import { CustomTextAreaField } from "../../inherit/fields/TextAreaField";
import { CustomSwitchBtn } from "../../inherit/SwitchBtn";
import { DashboardMainBtn } from "../../../../inherit/DashboardMainBtn";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../../../Axios";
import { adminCourseContext } from "../../../../../context/AdminCourseDataContext";


export const EditLectureForm = (props) => {
    const [loading, setLoading] = useState(false);
    const course = useContext(adminCourseContext);
    const course_id = props.course_id;
    const [data, setData] = useState({
        title: '',
        description: '',
        active: true,
    });
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    const reGet_course = () => {
        setLoading(true);
        axiosInstance
            .get(`admin/courses/course/${course_id}`)
            .then((response) => {
                setLoading(false);
                course.setCourse(response.data);
            })
            .catch((error) => {
                setLoading(false);
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            })
    }

    useEffect(()=>{
        setLoading(true);
        axiosInstance
        .get(`admin/courses/lectures/${course.course.currentLecture}`)
        .then((response)=>{
            setLoading(false);
            setData(response.data);
        })
        .catch(()=>{
            setLoading(false);
            handleClickVariant('error', 'هناك خطأ ما قد حدث');
        });
    }, []);

    const handleForm = (e)=>{
        e.preventDefault();
        setLoading(true);
        axiosInstance
        .put(`admin/courses/lectures/${course.course.currentLecture}/update`, data)
        .then(()=>{
            setLoading(true);
            props.close();
            reGet_course();
            handleClickVariant('success', 'تم تعديل المحاضرة بنجاح');
        })
        .catch(()=>{
            setLoading(true);
            handleClickVariant('error', 'هناك خطأ ما قد حدث');
        });
    }

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
        // for switch buttons
        if (e.target.name === 'active') {
            if (e.target.value === "on") {
                e.target.value = "off";
            } else {
                e.target.value = "on";
            }
            setData({
                ...data,
                [e.target.name]: (e.target.value === "on") ? true : false,
            });
        }
    }

    return (
        <div className='w-100 dialog-content overflow-hidden'>
            <LinearIndeterminate load={loading} />
            <div className="container general-div-inputs ">
                <div className="title w-100 d-flex justify-content-center align-items-center">"تعديل  "{data.title}</div>
                <form className='w-100 py-5' onSubmit={handleForm}>
                    <div className="input-div" dir="rtl">
                        <CustomTextField
                            label="عنوان المحاضرة"
                            name="title"
                            value={data.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-div" dir="rtl">
                        <CustomTextAreaField
                            label="الوصف"
                            rows={4}
                            name="description"
                            onChange={handleInputChange}
                            required={false}
                            defaultValue={data.description}
                        />
                    </div>
                    <div className="p-1 switch-buttons mb-5">
                        <CustomSwitchBtn checked={data.active} name='active' onClick={handleInputChange} title='تفعيل (حيث ان المحاضرة ستظهر للجميع)' />
                    </div>
                    <div className="input-div p-1" dir="rtl">
                        <DashboardMainBtn name='حفظ' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                    </div>
                </form>
            </div>
        </div>
    )
}