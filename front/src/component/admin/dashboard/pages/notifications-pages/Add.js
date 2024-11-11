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


export const AddNotification = (props) => {
    const notificationsContext = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [data, setData] = useState({
        title: '',
        context: '',
        to: ''
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
    const [sendToUsers, setSendToUsers] = useState([
        { 'id': 0, name: 'جميع الطلاب' },
    ]);

    useEffect(() => {
        getUsersList();
    }, []);

    const addNotification = () => {
        setLoading(true);
        axiosInstance
            .post(`admin/notifications/add`, data)
            .then(() => {
                setLoading(false);
                props.close();
                handleClickVariant('success', 'تم إرسال الإشعار بنجاح');
                reGetAllNotifications();
            })
            .catch(() => {
                setLoading(false);
                handleClickVariant('error', 'لقد حدث خطأ');
            });
    }

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

    const getUsersList = () => {
        setLoadingUsers(true);
        axiosInstance
            .get('admin/users/basic')
            .then((response) => {
                const data = response.data;
                setLoadingUsers(false);
                setSendToUsers([
                    ...sendToUsers,
                    ...data
                ]);
                
            })
            .catch(() => {
                setLoadingUsers(false);
                props.close();
                handleClickVariant('error', 'لقد حدث خطأ')
            });
    }

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    }

    const handleForm = (e) => {
        e.preventDefault();
        addNotification();
    }

    return (
        <div className='w-100 dialog-content overflow-hidden'>
            <LinearIndeterminate load={loading && setSendToUsers.length > 0} />
            <div className="container general-div-inputs ">
                <div className="title w-100 d-flex justify-content-center align-items-center">إرسال إشعار </div>
                <form className='w-100 py-5' onSubmit={handleForm}>
                    {
                        (loadingUsers !== true) ?
                            <div className="input-div" dir="rtl">
                                <CustomSelectField
                                    value={data.to}
                                    label="اختر المرسل إليه"
                                    onChange={handleInputChange}
                                    name="to"
                                    array={sendToUsers}
                                />
                            </div>
                            :
                            <></>
                    }

                    <div className="input-div" dir="rtl">
                        <CustomTextField
                            label="العنوان"
                            name="title"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-div" dir="rtl">
                        <CustomTextAreaField
                            label="المحتوي"
                            rows={10}
                            name="context"
                            onChange={handleInputChange}
                            required={true}
                        />
                    </div>
                    <div className="input-div p-1" dir="rtl">
                        <DashboardMainBtn name='إرسال' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                    </div>
                </form>
            </div>
        </div>
    )
}