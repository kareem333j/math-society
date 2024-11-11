import { useContext, useEffect, useState } from "react"
import LinearIndeterminate from "../../../../loading/loading1"
import { CustomTextField } from "../../inherit/fields/TextField";
import { CustomTextAreaField } from "../../inherit/fields/TextAreaField";
import { CustomSwitchBtn } from "../../inherit/SwitchBtn";
import { DashboardMainBtn } from "../../../../inherit/DashboardMainBtn";
import { CustomSelectField } from "../../inherit/fields/SelectField";
import axiosInstance from "../../../../../Axios";
import { enqueueSnackbar } from "notistack";
import { NotificationContext } from "../../../../../context/NotificationsContext";


export const EditNotification = (props) => {
    const notificationsContext = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        title: '',
        context: ''
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

    useEffect(() => {
        getNotification();
    }, []);

    const reGetAllNotifications = () => {
        setLoading(true);
        axiosInstance
            .get('admin/notifications')
            .then((response) => {
                setLoading(false);
                notificationsContext.setNotifications(response.data);
            })
            .catch((error) => {
                setLoading(false);
                handleClickVariant('error', 'لقد حدث خطأ');
            });
    }

    const updateNotification = () => {
        setLoading(true);
        axiosInstance
            .put(`admin/notifications/${props.id}/update`, notification)
            .then(() => {
                setLoading(false);
                props.close();
                handleClickVariant('success', ' تم تحديث الإشعار بنجاح');
                reGetAllNotifications();
            }).catch(() => {
                setLoading(false);
                handleClickVariant('error', 'لقد حدث خطأ');
            });
    }

    const handleInputChange = (e) => {
        setNotification({
            ...notification,
            [e.target.name]: e.target.value,
        });
    }

    const getNotification = () => {
        setLoading(true);
        axiosInstance
            .get(`admin/notifications/${props.id}`)
            .then((response) => {
                setLoading(false);
                setNotification({
                    title: response.data.title,
                    context: response.data.context
                })
            })
            .catch(() => {
                setLoading(false);
                props.close();
                handleClickVariant('error', 'لقد حدث خطأ')
            });
    }

    const handleForm = (e) => {
        e.preventDefault();
        updateNotification();
    }

    return (
        <div className='w-100 dialog-content overflow-hidden'>
            <LinearIndeterminate load={loading} />
            <div className="container general-div-inputs ">
                <div className="title w-100 d-flex justify-content-center align-items-center">تعديل الإشعار</div>
                <form className='w-100 py-5' onSubmit={handleForm}>
                    <div className="input-div" dir="rtl">
                        <CustomTextField
                            label="العنوان"
                            name="title"
                            onChange={handleInputChange}
                            value={notification.title}
                        />
                    </div>
                    <div className="input-div" dir="rtl">
                        <CustomTextAreaField
                            label="المحتوي"
                            rows={10}
                            name="context"
                            onChange={handleInputChange}
                            defaultValue={notification.context}
                            required={true}
                        />
                    </div>
                    <div className="input-div p-1" dir="rtl">
                        <DashboardMainBtn name='حفظ' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                    </div>
                </form>
            </div>
        </div>
    )
}