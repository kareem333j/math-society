import { useContext, useState } from "react";
import axiosInstance from "../../../../../Axios";
import { DashboardMainBtn } from "../../../../inherit/DashboardMainBtn";
import { CustomTextAreaField } from "../../inherit/fields/TextAreaField";
import { CustomTextField } from "../../inherit/fields/TextField";
import { CustomSwitchBtn } from "../../inherit/SwitchBtn";
import LinearIndeterminate from "../../../../loading/loading1";
import { adminCourseContext } from "../../../../../context/AdminCourseDataContext";
import { enqueueSnackbar } from "notistack";


export const AddLectureForm = (props) => {
    const [loading, setLoading] = useState(false);
    const course_id = props.course_id;
    const course = useContext(adminCourseContext);
    const [data, setData] = useState({
        title: '',
        description: '',
        active: true,
        notification: false,
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

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
        // for switch buttons
        if (e.target.name === 'active' || e.target.name === 'notification') {
            setData({
                ...data,
                
                [e.target.name]: e.target.checked,
            });
            console.log(data);
        }
    }

    const handleForm = (e) => {
        e.preventDefault();
        sendData();
    };

    const sendData = () => {
        setLoading(true);
        axiosInstance
            .post(`admin/courses/${course_id}/lectures/add`, data)
            .then(() => {
                setLoading(false);
                props.close();
                reGet_course();
                handleClickVariant('success', 'تم إضافة المحاضرة بنجاح');
            })
            .then((error) => {
                setLoading(false);
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            })
    }

    return (
        <div className='w-100 dialog-content overflow-hidden'>
            <LinearIndeterminate load={loading} />
            <div className="container general-div-inputs ">
                <div className="title w-100 d-flex justify-content-center align-items-center">إضافة محاضرة جديدة</div>
                <form className='w-100 py-5' onSubmit={handleForm}>
                    <div className="input-div" dir="rtl">
                        <CustomTextField
                            label="عنوان المحاضرة"
                            name="title"
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
                        />
                    </div>
                    <div className="p-1 switch-buttons">
                        <CustomSwitchBtn checked={data.active} name='active' onClick={handleInputChange} title='تفعيل (حيث ان المحاضرة ستظهر للجميع)' />
                    </div>
                    <div className="p-1 switch-buttons mb-5">
                        <CustomSwitchBtn checked={data.notification} name='notification' onClick={handleInputChange} title='إرسال إشعار لجميع المشتركين بهذا الكورس بشأن إضافة هذه المحاضرة' />
                    </div>
                    <div className="input-div p-1" dir="rtl">
                        <DashboardMainBtn name='إضافة' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                    </div>
                </form>
            </div>
        </div>
    )
}